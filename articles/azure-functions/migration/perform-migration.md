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

Your migration team should have a standard operating procedure (SOP) for activities on the day of migration, referred to as Day-0 migration. This manual should include step-by-step instructions, detailing who should conduct each step, what to do, expected outcome, and validation with each logical increment. It should also describe rollback procedures in case of unexpected, detrimental results during the process. These steps do not need to be automated, as migration is typically a one-time activity.

## Prerequisites

> [!NOTE]
> **Content developer**: Work with your SME to summarize all of the core "pre-migration" tasks they should have completed. These need to have been completed, none of these should be "new activities" -- if they are, then instead introduce the topic into the pre-planning activies guides.

- You've prepared by following all of the recommendations in the [pre-migration design areas](./aws-lambda-to-azure-functions.md#perform-pre-migration-planning).
- You've modified and tested your [application code](./build-migration-assets.md#update-code) to work on Azure Functions.
- You've a subscription allocated and ready for your resources and you have privileges to create the resources needed in the subscription.
- You've built out your [infrastructure templates](./build-migration-assets.md#build-your-infrastructure-as-code-template) to create your Azure Function resource and its required dependencies.

## Prepare

> [!NOTE]
> **Content developer**: Work with your SME to identify what activities the customer should do right before they execute their migration runbook.  This isn't pre-planning activies, this is litterally "first steps" common to all migration approaches; this is "work to do."
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

## Perform the migration based on your downtime plan

Based on your [pre-migration deployment planning](./deployment.md) choice, build your runbook to follow the appropriate migration steps. These are the activities you'll perform while doing the actual migration.

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

## Gain confidence through pre-production and production testing

Your runbook must be tested before you perform your production migration. Simulate your AWS Lambda to Azure Funtions migration to refine and gain confidence in your runbook. Simulate common Azure Function migration failure modes as well, such as:

- List common
- Failure modes
- For an Azure Functions migration

> [!TIP]
> You might be able to pre-deploy Azure resources and test those resources in your production environment before doing your day-of cut over. Where possible, have Azure Functions resources already deployed, using your IaC and pipelines, in your production Azure subscription prior to your cut over. Test your production resources as much as possible before doing the shifting of processing or client traffic.

## Next step

With all relevant engineering and support staff ready, execute your migration runbook on migration day. Your migration runbook should also include steps for post migration evaluation, to lear about those, see:

> [!div class="nextstepaction"]
> [Perform a post migration evaluation](./post-migration-checklist.md)
