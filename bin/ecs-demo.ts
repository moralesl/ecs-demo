#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsDemoStack } from '../lib/ecs-demo-stack';

const app = new cdk.App();
new EcsDemoStack(app, 'EcsDemoStack');
