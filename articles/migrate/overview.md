---
title: Wave Planning Overview
description: Learn how Azure Migrate – Wave Planning simplifies cloud migration and modernization. Break large projects into manageable waves, reduce risks, and improve execution with structured planning and continuous feedback.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: concept-article
ms.date: 11/04/2025
monikerRange: migrate 
# Customer intent: Customers want to leverage Azure Migrate’s Wave Planning to simplify large-scale cloud migrations. They’re looking for a structured way to break down complex projects, reduce risks, maintain business continuity, and track progress using integrated planning and execution tools.
---

# Wave planning overview in Azure Migrate (preview)

Wave Planning is a capability in Azure migrate that enables end-to-end migration and modernization of all applications running in your infrastructure. It provides a structured approach to cloud migration and modernization, enabling organization to divide large migration projects into manageable groups of workloads or applications. Each wave is a logical group that you can plan, execute, and track the migrations and modernizations together.

Wave Planning helps cloud architects and migration leads to: 
- Accelerate migration and modernization by focusing on smaller and achievable batches and sequencing them logically.  
- Reduce migration uncertainty by breaking large migrations into manageable phases and increasing the fidelity of the execution plan. 
- Minimize risks and disruptions by grouping dependent systems and enabling iterative planning.
- Improves business continuity and migration fidelity through continuous monitoring and feedback. 

### Key features 

Wave Planning in Azure Migrate offers a structured set of capabilities to simplify and manage the end-to-end migration and modernization of applications and infrastructure.

- Distribute the applications or the underlying infrastructure such as servers and workloads (servers, databases, web apps) discovered through Azure Migrate into waves.
- Create a high-fidelity migration plan for each wave from their source (on-premises or other cloud) to the Azure destination using azure recommendations through Assessments.
- Visualize the execution plans across the waves using timeline.
- Execute and track the migration of applications in waves.
- Monitor the progress, identify risks, and actions as the execution proceeds through different stages of migration.

You can perform migrations using the tools of your choice including Azure Migrate – Server Migration, DMS, or others. With Migration Waves extensible tracking capability, you can integrate your migration tooling for centralized tracking of your entire migration and modernization journey.

## Prerequisites

To create an effective wave plan, follow the best practices and ensure all the pre-requisites mentioned below.

**Complete discovery in Azure Migrate**: You must have an active Azure Migrate project and complete discovery of your infrastructure (servers, databases, and workloads). Verify that discovery is complete and inventory data is accurate.

The following are recommended for creating high quality wave plan.

- **Perform dependency analysis**: Use Azure Migrate dependency visualization to identify relationships between workloads. Grouping dependent workloads helps reduce migration risks and prevent application outages.

- **Define applications and enrich metadata**: Create application groupings and capture details such as business criticality, complexity, and technology stack. Add tags for environment, department, and owner to help prioritize and batch workloads effectively.

- **Run assessments for readiness and cost insights**: Assessments provide readiness status, cost estimates, and recommended migration strategies. These insights improve planning accuracy and group based on the migration strategies.

## Wave planning concepts

Here are some of the concepts and terminology to help you use the wave planning in Azure Migrate.

### Wave stages

There are two broad stages as you proceed with them migration of waves:

1. **Configuration**: This stage indicates that wave planning activities are in progress. The goal is to prepare the team and environment for migration and modernization, and to identify all required actions. Activities include defining the migration path, selecting target configurations and tools, and setting up the migration environment. After configuration is complete, the wave is ready for execution.

1. **Execution**: This stage of the wave indicates the application migration is in progress. All migration and modernization activities identified during the configuration stage are executed here. Internally users prepare the environment, migrate workloads and applications, and optimize the set-up of end-to-end migration or modernization. After all the applications complete their migration or modernization, the wave execution is considered complete.

### Planned start and end dates for Azure Migrate Wave execution

The planned start and end dates of the wave defined when you intend to execute the migration or modernization. You can set these dates based on your execution plan and track your migration and modernization journey against the timelines. When you create a new wave, the default planned start date is current date and plus two weeks, and the default planned completion date is planned start date plus three weeks later.

### Wave status

This section defines the status of the wave migration against the planned timeline. Using wave status, you can assess how well the migrations are progressing. Statuses are determined based on the current date, the stage of the migration journey, and the planned start and end dates. Here are the available status types:     


| **S.No** | **Wave status** | **Definition**   |  **Recommendation** |
| --------- | --------------- | ----------------- | ---------- |
| 1         | Not Started     | The execution hasn't started for this wave and there are more than **7** days for it. | Complete the planning activities and be ready for the execution.   |
| 2         | Off Track       | The planned start or end time of execution has passed.   | Relook at the planned timelines and course corrective actions. Actions could be either changing the dates, moving the workloads or others |
| 3         | On Track        | The execution is in progress and there are more than **7** days to complete them     |   Keep going   |
| 4         | At Risk  | The due date for the migration to start or complete has passed as per the planned dates  | Keep a close track of executions to ensure the migrations complete on time ad don’t go off track.  
| 5         | Completed    | The migration has been  completed.  |

### Execution stages of workloads

1. Workloads go through three execution stages: **Preparation > Testing > Completion**. The activities performed in each stage might differ depending on the workload and the kind of execution strategy.   
1. The **preparation stage** involves setting up the Azure environment and performing data and configuration transfers.  
1. During the **testing stage**, the application is deployed in an isolated environment for testing, and all necessary tests are performed.  
1. In the **completion stage**, the applications are set up in the final environment, and optimizations are performed to make them ready for consumption.

### Migration and modernization tasks

Migration and modernization tasks are a set of activities you need to complete at each stage of migration and modernization. Each stage includes one or more tasks, and completing them marks the stage as complete. During the wave configuration stage, you can define tasks for application migration based on the workload. You can manually define tasks, or Azure Migrate can recommend tasks based on your selected migration approach to help complete your journey.

## Next steps

- Learn more about [creating waves in Azure Migrate](how-to-plan-create-waves.md).