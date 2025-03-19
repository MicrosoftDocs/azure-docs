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

This article provides an overview of how to migrate serverless applications from AWS Lambda to Azure Functions.

## Introduction to Azure Functions 

Azure Functions is a serverless computing platform. It enables developers to run event-driven code without provisioning or managing infrastructure. The Azure Functions Flex Consumption plan is equivalent to Lambda's consumption-based model. It provides network integration to meet enterprise governance needs alongside serverless execution. AWS Lambda and Azure Functions share similar features like automatic resource provisioning, scaling, and pay-per-use pricing models. Azure Functions also supports dedicated hosting modes, taking advantage its highly portable runtime to run in various environments. The following migration stages focus on the Azure Functions Flex Consumption hosting plan. Azure Functions provides unique benefits, such as a versatile programming model that has rich triggers and bindings, scaling models, concurrency control, and runtime support. 

## Migration overview

Migration can generally be divided into a three-stage journey: discover, assess, and migrate. This framework provides a structured approach to migrating workloads from AWS Lambda to Azure Functions. 

### Discover

During this stage, you conduct a detailed discovery process to uncover your current workloads and serverless estate. Evaluate existing AWS Lambda workloads, including their configuration, dependencies, and usage patterns. 

### Assess

During this stage, you map AWS Lambda features to Azure Functions equivalents to ensure compatibility. You also map AWS services that Lambda depends on to corresponding Azure services. 

You should also create a migration plan during the assess stage. Develop an iterative, detailed migration plan that outlines the steps, timelines, and resources required for a smooth transition.

### Migrate 

During this stage, you adapt function code, deploy and test the functions, and optimize and monitor the migrated workloads. 

- Modify the function code as needed to adhere to the Azure Functions programming model and best practices.
- Perform a guided migration of workloads to Azure Functions. Test the deployed functions to validate their performance and correctness.
- Fine-tune the migrated workloads to optimize performance. Implement monitoring practices to ensure ongoing reliability and efficiency within the Azure environment. 

## Next step

> [!div class="nextstepaction"]
> [Discover stage](aws-lambda-azure-functions-migration-discover.md)