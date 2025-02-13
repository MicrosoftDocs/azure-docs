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

## Scope

> [!NOTE]
> **Content developer**: Clearly set the scope. Some services have some fairly niche edges, and this migration guide should focus on the "normal" usage scope. Make clear what is both in scope and out of scope.

This migration series specifically addresses an AWS Lambda instance being replatformed to run in Azure Functions hosted as Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.

These articles do not address:

- migration to own container hosting solution, such as through Container Apps
- hosting AWS Lambda containers in Azure
- Fundimental Azure adoption approach by your organization, such as [Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/) or other topics addressed in the Cloud Adoption Framework [Migrate methodology](/azure/cloud-adoption-framework/migrate/).

### Workload perspective

A migration from AWS to Azure usually involves more than just one service in isolation, as workloads are made of many resources and processes to manage those resources. You must combine the concepts, how-tos, and examples presented in this article series along with your larger plan that involves the other components and processes in your workload to have a comprehensive strategy.

## Perform pre-migration evaluation

Before initiating any migration or replatforming, it's crucial to conduct a thorough evaluation of your current AWS Lambda deployment. This step involves assessing multiple design areas of your existing implementation, identifying direct mapping opportunities, and concovering potential challenges. These findings have you plan the necessary activities and adjustments to your workload or exectations for a successful transition to Azure Functions.

You can perform the evaluation on these design areas in any order that you wish, however we've discovered that customers that start with $TOPIC establish a good foundation for this process.

Perform a pre-migration evaluation of the following design areas:

- [Monitoring](./monitoring.md)
- [Identity and access management](./identity-access-management.md)
- [Governance](./governance.md)
- [Deployment](./deployment.md)
- [Core capabilities](./capabilities.md)
- [Dependencies](./dependencies.md)
- 
## Follow a recommended migration approach

TBD

## Evaluate your migration

TBD

## Further optimize on Azure

TBD

## Explore sample migration scenarios

Other customers have completed this migration, and we've taken some of the key learnings from those migrations and provide them as example scenarios for you to learn from. These scenarios illustate the work done in the pre-migration evaluation, show how the migration happened including key dependencies, and addressed how the workload could further optimize once on Azure.

- [Migrate an event-driven data processing pipeline](./function-placeholder.md)
- [Migrate a microservices workload](./function-placeholder.md)

## Next step

> [!div class="nextstepaction"]
> [Start pre-migration evaluation with $TOPIC](./governance.md)