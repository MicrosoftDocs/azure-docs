---
title: Develop a Day-0 migration manual for migrating AWS Lambda to Azure Functions
description: How to perform a migration from AWS Lambda to Azure Functions
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---


# Develop a Day-0 migration manual for migrating AWS Lambda to Azure Functions

| :::image type="icon" source="../../migration/images/goal.svg"::: Your migration manual has the steps necessary to complete the migration activities from AWS Lambda to Azure Functions, covering rollback steps in case of failure. |
| :-- |

Your migration team should have a standard operating procedure (SOP) for activities on the day of migration, referred to as _Day-0 migration_. This manual should include step-by-step instructions, detailing who should conduct each step, what to do, expected outcome, and validation with each logical increment. It should also describe rollback procedures in case of unexpected, detrimental results during the process. These steps do not need to be automated, as migration is typically a one-time activity.

## Prerequisites

> [!NOTE]
> **Content developer**: Work with your SME to summarize all of the core "pre-migration" tasks (the tables). None of these should be new activities at this point. However, if there are, add that to the the pre-planning design area guides.

To ensure a smooth migration from AWS Lambda to Azure Functions, make sure you have completed the following steps:

- You've have completed your preparation by following the recommendations in the [pre-migration design areas](./aws-lambda-to-azure-functions.md#perform-pre-migration-planning). Make sure you've noted the deviations and have a plan to mitigate them on Azure.

- You have modified and tested your [application code](./build-migration-assets.md#update-code) to work on Azure Functions.

- You have allocated a subscription that's ready for deployment and have the necessary privileges to create the required resources.

- You've built out your [infrastructure templates](./build-migration-assets.md#build-your-infrastructure-as-code-template) to create your Azure Function resource and its required dependencies.

## 1. Prepare

> [!NOTE]
> **Content developer**: Collaborate with your SME to identify the activities the customer should complete immediately before they begin the migration process as outlined in the manual. These activities should not be a repetition of pre-planning activities. Instead, consider them as the first steps common to all migration approaches. This is the "job to be done".'"
>
> Have the SME consider the following:
> - Source code
> - Required Azure depdendencies
> - Dependencies still staying in AWS
> - Custom domains and DNS
> - Virtual networks
> - Workload secrets
> - Service specific considerations (such as Durable Functions)
> - Failback strategy


## 2. Perform the migration based on your downtime plan

Based on your [pre-migration deployment planning](./deployment.md) choice, add the appropriate migration steps for doing the actual migration.

### Perform a planned downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe the steps of this process and document the instructions we need to give our customers. Ensure the steps map back to the pre-migration planning guide. Include recommended tooling as part of the instructions.

#### Failback execution on a planned downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe how to execute a failback at at least one key point during this type of migration.

### Perform a zero-downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe the steps of this process and document the instructions we need to give our customers. Ensure the steps map back to the pre-migration planning guide. Include recommended tooling as part of the instructions.

#### Failback execution on a zero-downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe how to execute a failback at at least one key point during this type of migration.

### Perform a minimized-downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe the steps of this process and document the instructions we need to give our customers. Ensure the steps map back to the pre-migration planning guide. Include recommended tooling as part of the instructions.

#### Failback execution on a minimized-downtime migration

> [!NOTE]
> **Content developer**: Have your SME describe how to execute a failback at at least one key point during this type of migration.


## 3. Test in pre-production and production environments

The instructions in the manual must be tested before you perform your production migration. Simulate your AWS Lambda to Azure Funtions migration and refine it until a satisfactory result is achieved. Note the measure of success in your manual. Simulate common Azure Function migration failure modes, such as:

- Failure mode 1
- Failure mode 2

> [!TIP]
> You might be able to pre-deploy Azure resources and test those resources in your production environment before marking migration as complete and  deployment on Azure becomes primary. Test your production resources as much as possible before doing the shifting of processing or client traffic.

## Next step

With all relevant engineering and support staff ready, execute your migration manual on Day-0. After your migration is complete, conduct a  post-migration evaluation:

> [!div class="nextstepaction"]
> [Perform a post migration evaluation](./post-migration-checklist.md)
