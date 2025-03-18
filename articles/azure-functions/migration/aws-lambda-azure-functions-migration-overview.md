---
title: AWS Lambda to Azure Functions Migration Guide Overview
description: Learn about the steps that you need to take to migrate serverless applications from AWS Lambda to Azure Functions.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to learn about how to migrate serverless applications from AWS Lambda to Azure Functions so that I can make the transition efficiently.
--- 

# AWS Lambda to Azure Functions migration guide overview

This document provides step-by-step guidance for customers transitioning serverless applications from AWS Lambda to Azure Functions. 

## Introduction to Azure Functions 

Azure Functions is a serverless computing platform. It enables developers to execute event-driven code without provisioning or managing infrastructure. The Azure Functions Flex Consumption Plan is the direct equivalent to Lambda's consumption-based model, offering network integration to meet enterprise governance needs alongside serverless execution. Both AWS Lambda and Azure Functions share similarities such an automatic resource provisioning, scaling, pay-per-use pricing model etc. Additionally, Azure Functions also supports dedicated hosting modes, leveraging its highly portable runtime to run in various environments.  In this document, we focus on Azure Functions Flex Consumption hosting plan. Moreover, Azure Functions offers unique benefits such as a versatile programming model with rich triggers and bindings, scaling models, concurrency control, and runtime support, which provide added advantages.  

## Migration Journey Overview 

Migration can generally be classified into a three-stage journey: Discover, Plan, and Execute. This framework provides a structured approach for migrating workloads from AWS Lambda to Azure Functions. 

### Discover Stage

Discover Workloads: Conduct a detailed discovery process to uncover your current workloads and serverless estate. Evaluate existing AWS Lambda workloads, including their configuration, dependencies, and usage patterns. 

### Assess Stage

Map Features: Map AWS Lambda features to Azure Functions equivalents to ensure compatibility, and also map AWS services that Lambda depends on to corresponding Azure services. 

Create a Migration Plan: Develop an iterative, detailed migration plan that outlines steps, timelines, and resources required for a smooth transition. 

### Migrate Stage 

Adapt Function Code: Modify the function code as needed to adhere to Azure Functions’  programming model and best practices. 

Deploy and Test: Perform a guided migration of workloads to Azure Functions. Test the deployed functions to validate their performance and correctness. 

Optimize and Monitor: Fine-tune the migrated workloads to optimize performance. Implement monitoring practices to ensure ongoing reliability and efficiency within the Azure environment. 

## Next step

> [!div class="nextstepaction"]
> [Discover stage](aws-lambda-azure-functions-migration-discover.md)