---
title: AWS Lambda to Azure Functions Migration Discover Stage
description: Learn about the steps that you need to take during the discover stage of your AWS Lambda to Azure Functions migration.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to learn about the discover stage of migration so that I can migrate serverless applications from AWS Lambda to Azure Functions efficiently.
--- 

# AWS Lambda to Azure Functions migration discover stage

In this stage, you will conduct a detailed discovery process to inventory the current workloads, including their configuration, dependencies, and usage patterns. 

## Discover Your Current Workload 

Compile a comprehensive inventory of your AWS Lambda functions using familiar AWS tooling like service specific SDKs, APIs, CloudTrail etc. to assess the workloads on AWS. Your inventory should include the following key aspects: 

- Understanding the Use Cases:
   - Identify the primary business or technical purposes each Lambda function serves.
   - Categorize functions based on their use cases, such as event-driven workflows, data processing, real-time analytics, or API backends. 

 - Understanding the Configuration:
    - Document configuration settings for each function, including memory allocation, timeout settings, and environment variables.
    - Note versioning details, aliases, and any deployment-specific configurations, such as language runtime and architecture (e.g., x86 or ARM). 

- Understanding Security and Networking Setup:
   - Assess IAM roles and policies associated with each function to ensure proper access control.
   - Identify VPC configurations, including subnets, security groups, and NAT gateway dependencies, if applicable. 

- Understanding the Tooling:
   - List the CI/CD tools and deployment frameworks used, such as AWS SAM, Serverless Framework, or custom pipelines.
   - Document build and packaging tools, including testing frameworks and staging workflows. 

- Understanding Monitoring, Logging, and Observability:
   - Evaluate the monitoring and logging mechanisms currently in place, such as AWS CloudWatch, X-Ray, or third-party tools.
   - Identify log retention policies and patterns for troubleshooting.
   - Document metrics and alerts being tracked, such as error rates, invocation counts, or duration trends. 

- Understanding dependencies
   - Determine all AWS services (e.g., DynamoDB, S3, API Gateway) and third-party tools your Lambda functions rely on, documenting their configurations, interactions, and data flows.
   - Map interdependencies between Lambda functions, such as shared resources or invocation chains, and evaluate potential bottlenecks or latency issues.
   - Assess service limits, operational considerations, and monitoring tools (e.g., CloudWatch, X-Ray) to ensure a comprehensive understanding of dependency impact. 

By the end of this stage, you will have a comprehensive inventory of your AWS Lambda functions, including their use cases, configurations, security and networking setups, tooling, monitoring, logging, observability, and dependencies. This detailed inventory will serve as the foundation for the next stage, where you will assess the readiness and suitability of these functions for migration to Azure Functions.

## Next step

> [!div class="nextstepaction"]
> [Assess stage](aws-lambda-azure-functions-migration-assess.md)