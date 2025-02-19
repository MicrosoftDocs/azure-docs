---
title: Build migration assets
description: Establish your code changes, infrastructure as code templates, and migration runbook for migration to Azure Functions
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Build migration assets


So far, you've evaluated your current run-state against the capabilities offered in Azure Functions across the various [pre-migration design areas](./aws-lambda-to-azure-functions.md#perform-pre-migration-planning). Those evaluations, recommendations, and deviations will influence your decisions on changes to the serverless code and how your Azure Functions deployment and its dependencies are configured.

| :::image type="icon" source="../../migration/images/goal.svg"::: You have source code, infrastructure as code templates, and deployment pipelines ready for your workload that will be running in Azure. |
| :-- |

## Update code

> [!NOTE]
> **Content developer**: Work with SME and provide any key guidance we have for migrating serverless code from AWS lambda to Azure Functions.

- Recommendation 1
- Recommendation 2
- Tool 1

Ensure you make changes in a separate code branch from the primary or migration branch. This will ensure that the changes do not interfere with your ability to redeploy the current AWS Lambda serverless code while the migration effort runs in parallel.


## Build your infrastructure as code template

> [!NOTE]
> **Content developer**: Work with SME and provide any key guidance we have for creating the IaC for Azure Functions. Code assets are excluded from this documentation effort to avoid maintenance burden at this point. 


- Recommendation 1
- Recommendation 2
- Tool 1

## Build your deployment pipeline

> [!NOTE]

> **Content developer**: Work with SME and provide any key guidance we have for creating an Azure Pipelines or GitHub Actions-based deployment, specifically to be used for migration.

- Recommendation 1
- Recommendation 2
- Tool 1

## Next step

Document step-by-step activities for your migration and perform the migration process. The goal is to have a repeatable structure that can be run on Day-0 of migration.

> [!div class="nextstepaction"]
> [Perform Day-0 migration activities for AWS Lambda to Azure Functions transition](./perform-migration.md)

