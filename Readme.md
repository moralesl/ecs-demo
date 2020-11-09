# ECS demo

This project is a running demo of using ECS + Fargate. [CDK](https://aws.amazon.com/cdk/) is used for the infrastructure setup.

## Getting started with the CDK

To get started make sure that the CDK cli is installed.

```
npm install -g aws-cdk             # install latest version
```


Now you can run `cdk bootstrap` to deploy the CDK toolkit, see [Bootstraping](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html).

After the bootstrap is completed, you can check the synthetized [CloudFormation](https://aws.amazon.com/cloudformation/) template by running `cdk synth`.

To finally the deploy the CDK stack run `cdk deploy`.


## Getting started with the Docker container

To get started with the containerized web server, take a look [here](./server/Readme.md).