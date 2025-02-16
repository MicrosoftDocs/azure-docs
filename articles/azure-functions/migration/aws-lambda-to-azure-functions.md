---
title: Migrate AWS Lambda to Azure Functions
description: Concepts, how-tos, best practices from moving from AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate AWS Lambda to Azure Functions

> [!NOTE]
> **Content developer**: Introduce the topic in a way that is meaningful for your service.

Migrating a serverless workload that uses AWS Lambda to Azure requires careful planning and execution. This article series provides essential guidance to help you:

- Perform a discovery process on your existing workload
- Learn how to perform key migration activities
- Evaluate and optimize a migrated workload

| :::image type="icon" source="../../migration/images/goal.svg"::: You'll build a runbook for your migration based on the guidance the pre-migration design area reviews, performing discovery activities, addressing downtime decisions. The runbook will be refined through testing and validation. |
| :-- |

## Scope

> [!NOTE]
> **Content developer**: Clearly set the scope and set the scope to the capabilities of the service and its dependencies. Some services have some fairly niche edges, and this migration guide should focus on the "normal" usage scope.  Consider dependencies as a component that this service needs to rely on, without which it won't fundamentally function. For example, networking aspects are a dependency (regardless of the workload objectives). On the other hand, a database typicallyisn't a dependency, if it's deployed to store workload data. Make clear what is both in scope and out of scope.

This migration series specifically addresses an AWS Lambda instance being replatformed to run in Azure Functions hosted as Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.

These articles do not address:

- Migration to own container hosting solution, such as through Container Apps
- Hosting AWS Lambda containers in Azure
- Fundimental Azure adoption approach by your organization, such as [Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/) or other topics addressed in the Cloud Adoption Framework [Migrate methodology](/azure/cloud-adoption-framework/migrate/).

### Compariable functionality

This guide offers recommendations to obtain compariable functionality only. If any of the recommendations are for functionality that are Azure exclusive, and beyond capabilities in AWS Lambda, those are called out as future optimizations.

> [!IMPORTANT]
> While you may choose to include optimizations as part of your migration, Microsoft recommends a two-step process: migrate "like-to-like" first, and then evaluate optimization opportunities to bring out the best on Azure. Those optimization efforts should be continuous and executed through your workload team's change control processes. A migration that adds additional capabilities during a migration incures added risk and extends the process beyond necessary.

### Workload perspective

A migration process from AWS to Azure usually involves more than just one service in isolation, as workloads are made of many resources and processes to manage those resources. You must combine the concepts, how-tos, and examples presented in this article series along with your larger plan that involves the other components and processes in your workload to have a comprehensive strategy. This guide will focus only on replatforming to Azure Functions and common dependencies for serverless workloads.

## Perform pre-migration planning

Before initiating any migration, conduct a thorough evaluation of your current AWS Lambda deployment and design your end state. This step involves assessing multiple design areas of your existing implementation, identifying direct mapping opportunities, and uncovering potential challenges. These findings have you plan the necessary activities and adjustments to your workload or exectations for a successful transition to Azure Functions.

There's no recommended order of these design areas, however we've discovered that customers that start with $TOPIC establish a good foundation for this process.

Perform a pre-migration evaluation of the following design areas:

- [Core capabilities](./capabilities.md)
- [Identity and access management](./identity-access-management.md)
- [Deployment](./deployment.md)
- [Monitoring](./monitoring.md)
- [Dependencies](./dependencies.md)
- [Governance](./governance.md)

### Functional and non-functional objectives and targets

Prior to a migration, collect some baseline information on the current run state of the system around performance, reliablity, and cost; along with any targets for those numbers. Your migration should assume those targets as measurement of business objectves and you shouldn't compromiseing on. Collect the following information about your AWS Lambda deployment:

- [Budget and cost of ownership](./function-placeholder.md)
- [Reliability objectives and current reliability status](./function-placeholder.md)
- [Performance targets and current performance](./function-placeholder.md)

## Follow the recommended migration approach

Migrations are often sequenced with a failover and failback strategy, throughly tested in pre-production environment. Learn how Microsoft recommends you prepare and perform a cutover from AWS Lambda to Azure Functions.

Follow the how-to in [Perform your migration from AWS Lambda to Azure Functions](./perform-migration.md).

## Evaluate end-state

Before you can fully decommission the resources in AWS, you need to have full confidence that the platform is meeting current workload expectations and there are no blockers to maintainging the workload or blockers to further development on the workload.

Ensure your Azure Function is meeting expectations, [Evaluate end-state](./function-placeholder.md).

## Explore sample migration scenarios

These examples are based on key learnings from Azure customers who have completed this migration. They illustate application of recommendations described in pre-migration evaluation, the process, and the end state.  It also provides suggestions on how the scenario could be further optimized on Azure.

- [Migrate an event-driven data processing pipeline](./function-placeholder.md)
- [Migrate a microservices workload](./function-placeholder.md)

## Further optimize on Azure

After you've migrated your Lambda to Azure Functions and your AWS resources are decommissioned, we recommend you explore additional features on Azure. These features can help you in future workload requirements or help close gaps in areas where your AWS Lambda solution was not meeting requirements.

See, [Explore Azure optimization opportunities](./function-placeholder.md)

## Next step

> [!div class="nextstepaction"]
> [Start pre-migration evaluation with $TOPIC](./governance.md)