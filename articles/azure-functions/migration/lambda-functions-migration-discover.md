---
title: "Stage 1: Discover Workloads to Migrate from AWS Lambda to Azure Functions"
description: Learn how to conduct a detailed discovery process to inventory current AWS Lambda workloads, including their configuration, dependencies, and usage patterns.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to evaluate existing AWS Lambda workloads so that I can migrate serverless applications to Azure Functions efficiently.
--- 

# Stage 1: Discover workloads to migrate from AWS Lambda to Azure Functions

In this stage, you conduct a detailed discovery process to evaluate existing AWS Lambda workloads, including their configuration, dependencies, and usage patterns. 

## Evaluate your current workload

Compile a comprehensive inventory of your AWS Lambda functions by using familiar AWS tooling like service-specific SDKs, APIs, and CloudTrail to assess the workloads on AWS. You should understand the following key aspects of your inventory:

- Use cases

   - Identify the primary business or technical purposes that each Lambda function serves.

   - Categorize functions based on their use cases, such as event-driven workflows, data processing, real-time analytics, or API back ends.

 - Configuration

    - Document configuration settings for each function, including memory allocation, time-out settings, and environment variables.

    - Note versioning details, aliases, and any deployment-specific configurations, such as language runtime and architectures like x86 or ARM. 

- Security and networking setup

   - Assess the identity and access management roles and policies associated with each function to ensure proper access control.

   - Identify virtual private cloud configurations, including subnets, security groups, and NAT gateway dependencies, if applicable.

- Tooling

   - List the continuous integration and continuous delivery tools and deployment frameworks that each function uses, such as AWS SAM, Serverless Framework, or custom pipelines.

   - Document build and packaging tools, including testing frameworks and staging workflows.

- Monitoring, logging, and observability mechanisms

   - Evaluate the current monitoring and logging mechanisms, such as Amazon CloudWatch, AWS X-Ray, or partner tools.

   - Identify log retention policies and patterns for troubleshooting.

   - Document tracked metrics and alerts, such as error rates, invocation counts, and duration trends.

- Dependencies

   - Determine which AWS services, like DynamoDB, S3, or API Gateway, and partner tools that your Lambda functions rely on. Document their configurations, interactions, and dataflows.

   - Map interdependencies, such as shared resources or invocation chains, between Lambda functions, and evaluate potential bottlenecks or latency problems.

   - Assess service limits, operational considerations, and monitoring tools like CloudWatch and X-Ray. Ensure that you understand how these dependencies affect the workload.

By the end of this stage, you should have a comprehensive inventory of your AWS Lambda functions, including their:

- Use cases.

- Configurations.

- Security and networking setups.

- Tooling, monitoring, logging, and observability mechanisms.

- Dependencies.

This detailed inventory is the foundation for the next stage, where you assess the readiness and suitability of these functions for migration to Azure Functions.

## Next step

> [!div class="nextstepaction"]
> [Assess stage](lambda-functions-migration-assess.md)