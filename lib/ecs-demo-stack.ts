import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as iam from "@aws-cdk/aws-iam";
import * as path from "path"

class EcsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serverImageAsset = new DockerImageAsset(this, 'demo-server-image', {
      directory: path.join(__dirname, '..', 'server'),
    });

    const vpc = new ec2.Vpc(this, "demo-vpc", {
      maxAzs: 3,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{
        name: "Public",
        subnetType: ec2.SubnetType.PUBLIC
      }],
      natGateways: 0
    });

    const cluster = new ecs.Cluster(this, "demo-cluster", {
      vpc: vpc
    });

    const taskRole = new iam.Role(this, "demo-taskRole", {
      roleName: "demo-taskRole",
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
    });

    const taskDef = new ecs.FargateTaskDefinition(this, "demo-taskdef", {
      taskRole: taskRole
    });

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "demo"
    })

    const container = taskDef.addContainer("demo-web", {
      image: ecs.ContainerImage.fromDockerImageAsset(serverImageAsset),
      memoryLimitMiB: 256,
      cpu: 256,
      logging
    });

    container.addPortMappings({
      containerPort: 8080,
      hostPort: 8080,
      protocol: ecs.Protocol.TCP
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "demo-service", {
      cluster: cluster,
      taskDefinition: taskDef,
      publicLoadBalancer: true,
      desiredCount: 3,
      listenerPort: 8080
    });

    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 6 });
    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 10,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });

    new cdk.CfnOutput(this, "LoadBalancerDNS", { value: fargateService.loadBalancer.loadBalancerDnsName });
    new cdk.CfnOutput(this, "repositoryArn", { value: serverImageAsset.repository.repositoryArn });
    new cdk.CfnOutput(this, "imageUri", { value: serverImageAsset.imageUri });
  }
}

const app = new cdk.App();
new EcsCdkStack(app, "EcsCdkStack", {
  env: {
    region: "eu-central-1",
    account: process.env.CDK_DEFAULT_ACCOUNT,
  }
});
