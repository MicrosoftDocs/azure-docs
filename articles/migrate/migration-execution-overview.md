---
title: Overview of migration execution in Azure Migrate
description: Compare migration waves and direct server migration to choose how to move workloads to Azure.
author: snehithm
ms.author: snmuvva 
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 10/28/2026

#CustomerIntent: As a migration planner, I want to understand the migration execution options so that I can choose an approach for my workloads.
---
# Overview of migration execution in Azure Migrate

Azure Migrate supports two ways to run migrations after discovery and planning. You can group applications and workloads into a migration wave and execute their migration together, or start migrations for selected servers without creating a wave.

## Which option should I use?

Use migration waves for automated workflows and unified tracking across applications and workloads. For new waves, Azure Migrate generates and runs an execution plan that coordinates migration steps, dependencies, and approval gates.

Direct migration remains available when you want to migrate selected servers without creating a wave. It supports servers only.

## Execute migrations by using waves

A migration wave contains the applications and workloads you intend to migrate together. For each workload, you configure a target Azure service and a migration method. You then start and track the migration from the wave.

Wave planning and execution are in preview for both classic and new waves. A wave's creation date determines whether it uses migration tasks or a generated execution plan.

### New waves

For waves created on or after November 11, 2026, Azure Migrate generates an execution plan from the workloads, target services, and migration methods configured in the wave. The plan defines the migration steps, their dependencies, and the step groups that organize the work.

Before starting the wave, you review the generated steps, customize the plan to your organization's needs, and complete the required inputs. During execution, Azure Migrate runs the steps according to their dependencies and waits where approval or manual work is required. You monitor the steps and respond to work that needs attention.

The [wave migration overview](wave-migrations-overview.md) describes the supported migration methods and the capabilities of generated execution plans.

### Classic waves

Waves you created before November 11, 2026, are classic waves. Instead of a generated execution plan, they use migration tasks associated with their applications and workloads. For supported migrations, you start the migration from the wave and track progress there. For work outside Azure Migrate, you complete the activity in the appropriate tool and update its tracked task in the wave.

For instructions, see [Configure, execute, and track classic waves](configure-execute-track-classic-waves.md).

You can't convert a classic wave to use a generated execution plan. If execution didn't start, you can delete the classic wave and [create a new wave](how-to-plan-create-waves.md) on or after November 11, 2026. If execution started, continue configuring, executing, and tracking that wave as a classic wave.

## Execute migrations directly

For direct migration, you select the servers to migrate and trigger each action manually, such as enabling replication, running a test migration, and performing the final migration. You don't create a wave or configure a wave execution plan.

For more details on direct server migrations, see [Overview of server migration methods in Azure Migrate](server-migrate-overview.md).

## Track workload and application migration progress

The project's **Migrations** page shows overall progress for applications and workloads. Execution status indicates migration progress. The details for an application or workload show progress and actions for its migration method.

For wave migrations, this project-level view shows progress across waves. Within an individual wave, **Overview** shows overall wave, application, and workload status. For new waves, **Execution runs** shows the individual steps, approvals, failures, and workload executions that contribute to that progress.

Choose a view based on what you need to review:

| View | Use it to |
| --- | --- |
| Project **Migrations** | Review overall application and workload migration progress across the project |
| Project **Waves** and a wave's **Overview** | Find a wave and review its overall migration progress |
| A wave's **Execution runs** in the new experience | Review individual steps, workload executions within steps, approvals, and failures |

## Next steps

- Get an [overview of wave migrations](wave-migrations-overview.md).
- Learn [how to configure, execute, and track classic waves](configure-execute-track-classic-waves.md).
- Get an [overview of server migration methods in Azure Migrate](server-migrate-overview.md).