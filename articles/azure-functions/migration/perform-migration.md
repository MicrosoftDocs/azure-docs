---
title: Perform the migration from AWS Lambda to Azure Functions
description: How to perform a migration from AWS Lambda to Azure Functions
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Perform your migration from AWS Lambda to Azure Functions

This article describes how Microsoft recommends you perform a migration from AWS Lambda to Azure Functions.

## Prerequisites

> [!NOTE]
> **Content developer**: Work with your SME to summarize all of the core "pre-migration" tasks they should have completed. These need to have been completed, none of these should be "new activities" -- if they are, then instead introduce the topic into the pre-planning activies guides.

- You've prepared by following all of the recommendations in the [pre-migration design areas](./aws-lambda-to-azure-functions.md#perform-pre-migration-evaluation).
- You've a subscription allocated and ready for your resources and you have privileges to create the resources needed in the subscription.
- You've built out your infrastructure templates to create your Azure Function resource and its required dependencies.
- You've modified and tested your application code to work on Azure Functions.

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

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)