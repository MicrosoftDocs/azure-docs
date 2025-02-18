---
title: Build migration assets
description: Establish your code changes, infrastructure as code templates, and migration runbook for migration to Azure Functions
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Build migration assets

You've evaluated your current run-state against the capabilities offered in Azure Functions across the various [pre-migration design areas](./aws-lambda-to-azure-functions.md#perform-pre-migration-planning). Those evaluations, recommendations, tradeoffs, and deviations will be how you make decisions on what serverless code needs to change, what how your Azure Functions deployment and its dependencies are configured.

| :::image type="icon" source="../../migration/images/goal.svg"::: You have source code, infrastructure as code templates, and deployment pipelines established for your workload that will be running in Azure. |
| :-- |

## Update code

> [!NOTE]
> **Content developer**: Work with SME and provide any key guidance we have for migrating serverless code from AWS lambda to Azure Functions.

- Recommendation 1
- Recommendation 2
- Tool 1

Ensure you make these code changes in a code branch so the changes doesn't impeed your ability to redeploy your current AWS Lambda serverless code while the migration effort is being worked on in parallel.

## Build your infrastructure as code template

> [!NOTE]
> **Content developer**: Work with SME and provide any key guidance we have for creating the IAC for Azure Functions.

- Recommendation 1
- Recommendation 2
- Tool 1

## Build your deployment pipeline

> [!NOTE]
> **Content developer**: Work with SME and provide any key guidance we have for creating an Azure Pipelines or GitHub actions-based deployment, specifically to be used for migration.

- Recommendation 1
- Recommendation 2
- Tool 1

## Next step

Build your runbook by documenting the step-by-step activities for your migration.

> [!div class="nextstepaction"]
> [Perform your migration from AWS Lambda to Azure Functions](./perform-migration.md)
