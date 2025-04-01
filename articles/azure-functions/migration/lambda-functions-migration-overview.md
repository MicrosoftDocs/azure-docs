---
title: Migrate AWS Lambda to Azure Functions
description: Learn about Azure Functions and the three stages that you need to complete to migrate serverless applications from AWS Lambda to Azure Functions.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to learn how to migrate serverless applications from AWS Lambda to Azure Functions so that I can make the transition efficiently.
--- 

# Migrate AWS Lambda to Azure Functions

This article provides an overview of how to migrate serverless applications from AWS Lambda to Azure Functions. Learn about Functions features, and understand the stages of migration so that you can migrate your workload effeciently.

## Introduction to Azure Functions

Azure Functions provides serverless compute resources in Azure by enabling you to run event-driven code without provisioning or managing infrastructure. The Flex Consumption hosting plan for Functions is equivalent to Lambda's consumption-based model. It provides network integration to meet enterprise governance needs alongside serverless implementation. AWS Lambda and Azure Functions share similar features like automatic resource provisioning, scaling, and pay-per-use pricing models. Functions also supports dedicated hosting modes, taking advantage of its highly portable runtime to run in various environments. Functions provides unique benefits, such as a versatile programming model that has rich triggers and bindings, scaling models, concurrency control, and runtime support. 
	
This migration guide assumes that you're using the Flex Consumption plan to host your migrated Lambda code.

## Migration overview

Migration can generally be divided into a three-stage journey: discover, assess, and migrate. This framework provides a structured approach to migrate workloads from AWS Lambda to Azure Functions.

### Stage 1: Discover

During this stage, you conduct a detailed discovery process to uncover your current workloads and serverless estate. Evaluate existing AWS Lambda workloads, including their configuration, dependencies, and usage patterns. 

### Stage 2: Assess

During this stage, you map AWS Lambda features to Azure Functions equivalents to ensure compatibility. You also map AWS services that Lambda depends on to corresponding Azure services. 

You should also create a migration plan during the assess stage. Develop an iterative, detailed migration plan that outlines the steps, timelines, and resources required for a smooth transition.

### Stage 3: Migrate 

During this stage, you perform these steps to adapt function code, deploy and test the functions, and optimize and monitor the migrated workloads: 

1. Modify the function code as needed to adhere to the Azure Functions programming model and best practices.
1. Perform a guided migration of workloads to Azure Functions. Test the deployed functions to validate their performance and correctness.
1. Fine-tune the migrated workloads to optimize performance. Implement monitoring practices to ensure ongoing reliability and efficiency within the Azure environment. 

## Next step

Let's get started migrating your AWS Lambda code to Azure Functions:

> [!div class="nextstepaction"]
> [Discover stage](lambda-functions-migration-discover.md)