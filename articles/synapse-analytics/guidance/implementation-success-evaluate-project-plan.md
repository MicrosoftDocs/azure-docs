---
title: "Synapse implementation success methodology: Evaluate project plan"
description: "Learn how to evaluate your modern data warehouse project plan before the project starts."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate project plan

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

In the lifecycle of the project, the most important and extensive planning is done *before implementation*. This article describes how to conduct a high-level review of your project plan. The aim is to ensure it contains critical artifacts and information to deliver a successful solution. It includes checklists of items that you should complete and approve before the project starts.

A detailed review should follow the high-level project plan review. The detailed review should focus on the specific Azure Synapse components identified during the [assessment stage](implementation-success-assess-environment.md).

## Evaluate the project plan

Work through the following two high-level checklists, taking care to verify that each task aligns with the information gathered during the [assessment stage](implementation-success-assess-environment.md).

First, ensure that your project plan defines the following points.

> [!div class="checklist"]
> - **The core resource team:** Assemble a group of key people that have expertise crucial to the project.
> - **Scope:** Document how the project scope will be defined, verified, measured, and how the work breakdown will be defined and assigned.
> - **Schedule:** Define the time duration required to complete the project.
> - **Cost:** Estimate costs for internal and external resources, including infrastructure, hardware, and software.

Second, having defined and assigned the work breakdown, prepare the following artifacts.

> [!div class="checklist"]
> - **Migration plan:** Document the plan to migrate from your current system to Azure Synapse. Incorporate tasks for executing the migration within the project plan scope and schedule.
> - **Success criteria:** Define the critical success criteria for stakeholders (or the project sponsor), including go and no-go criteria.
> - **Quality assurance:** Define how to conduct code reviews, and the development, staging, and production promotion approval processes.
> - **Test plan:** Define test cases, success criteria for unit, integration, user testing, and metrics to validate all deliverables. Incorporate tasks for developing and executing the test plans within the project plan scope and schedule.

## Evaluate project plan detailed tasks

Once the high-level project plan review is complete and approved, the next step is to drill down into each component of the project plan.

Identify the project plan components that address each aspect of Azure Synapse as it's intended for use in your solution. Also, validate that the project plan accounts for all the effort and resources required to develop, test, deploy, and operate your solution by evaluating:

- The workspace project plan.
- The data integration project plan.
- The dedicated SQL pool project plan.
- The serverless SQL pool project plan.
- The Spark pool project plan.

## Next steps

In the [next article](implementation-success-evaluate-solution-development-environment-design.md) in the *Azure Synapse success by design* series, learn how to evaluate the environments for your modern data warehouse project to support development, testing, and production.
