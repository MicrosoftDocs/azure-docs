---
title: Overview of wave migrations in Azure Migrate
description: Learn how Azure Migrate coordinates migration steps, dependencies, automation, and approvals for your migration waves.
author: snehithm
ms.author: snmuvva 
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 10/28/2026

#CustomerIntent: As a migration lead, I want to understand migration waves and their supported capabilities so that I can decide whether they fit my migration needs.
---
# Overview of wave migrations in Azure Migrate (preview)

A *wave* in Azure Migrate is a group of resources that you want to migrate together. Azure Migrate brings the steps, dependencies, automation, and approval decisions for that wave together so you can coordinate migration work across applications, workloads, and teams.

Azure Migrate generates a *wave execution plan* from the wave's resources, target Azure services, and migration methods. The execution plan defines how that single wave migrates. Review and customize the execution plan, provide required inputs, and start the wave when you're ready to migrate.

This article provides an overview of wave migration capabilities in Azure Migrate so you can decide how they fit your migration needs.

> [!NOTE]
> Wave planning and execution in Azure Migrate are in preview. This article describes waves created on or after November 11, 2026. Waves created before that date use the classic experience. See [Configure, execute, and track classic waves](configure-execute-track-classic-waves.md).

## Why this capability exists

Managing a wave migration with spreadsheets, work items, and separate tools has three drawbacks:

- **Manual planning takes time and introduces errors.** Teams must list, order, and coordinate every task manually.
- **Execution puts production workloads at risk.** Missed steps, unforeseen dependencies, and coordination failures can cause migration failures and downtime.
- **Plans are separate from migration tools.** Teams review a document, then perform the migration in Azure Migrate, Azure Database Migration Service, Azure Storage Mover, and other tools.

Azure Migrate replaces static migration documents with generated wave workflows that orchestrate migration tools directly.

## Key benefits

Migrating in waves with Azure Migrate provides the following benefits:

- **Less manual coordination**:  Replace disconnected task lists and tool handoffs with a workflow your teams can review and execute together. 
- **Consistent migration workflows**: Apply migration-method-specific best practices instead of assembling each workflow from scratch. 
- **Validated automation with human oversight**: Run large wave migrations with Microsoft-validated automation while keeping people responsible for critical decisions.
- **Efficient execution**: Let independent work progress without unnecessary waits while respecting workload dependencies. 
- **Visibility across the migration**: Give operators execution details and stakeholders an overall view of migration progress. 


## Wave migration lifecycle

The lifecycle connects wave preparation, execution-plan review, and migration outcomes:

- **Preparation:** The wave's resources, target Azure services, and migration methods provide the information for automatic [execution plan generation](wave-migrations.md#execution-plan).
- **Review:** Migration teams review generated steps, dependencies, and groups, and supply inputs that discovery and assessment couldn't populate.
- **Customization:** Incorporate organization-specific work, decisions, and ownership into the plan before execution.
- **Execution and review:** Operators start the prepared wave, respond to approvals or failures, and review outcomes with stakeholders.

## Typical responsibilities

| Role | What they usually do |
| --- | --- |
| **Cloud architect or migration planner** | Confirm the wave's resources, target services, migration methods, and dependencies. Review the generated execution plan. |
| **Migration engineer or operator** | Customize the execution plan. Configure input parameters. Start and monitor the wave. Perform operational approvals. Resolve failures and retries. |
| **Application owner** | Review application-specific work, validate the migrated application, and make business decisions at relevant approval steps |
| **Project manager or migration lead** | Coordinate reviews, team availability, and governance decisions, and track overall application and wave outcomes |

## Supported capabilities

Azure Migrate provides the following capabilities for wave execution:

- **Automatic generation:** Azure Migrate uses a Microsoft-maintained *step library* of reusable migration steps to generate the execution plan. It populates available inputs from assessment, discovery, and other applicable sources. See [Execution plan generation](wave-migrations.md#execution-plan).
- **Execution plan customization:** Add organization-specific actions, decisions, and scripts. Edit supported properties and grouping. See [what customizations are available](reference-wave-migrations.md#customization-capability-matrix).
- **Dependency-aware orchestration:** Coordinate migration tools and let independent work progress in parallel without bypassing required ordering. See [how the execution plan is structured and orchestrated](wave-migrations.md#steps-and-step-groups).
- **Approval steps:** Keep people responsible for critical decisions. See [how approvals and manual steps work](wave-migrations.md#approvals-and-manual-work).
- **Execution controls and recovery:** Start from the portal or Azure CLI. Control wave execution. Retry failed work. See [Execute your wave](execute-wave-migration.md).
- **Execution tracking:** Inspect step and workload results. See [how to track and troubleshoot wave migrations](track-wave-migrations.md).
- **Overall migration tracking:** Report application and wave outcomes separately from individual step execution. See [how to report overall migration progress](track-wave-migrations.md#report-overall-migration-progress).


## Supported migrations

The following migrations are supported:

- VMware virtual machines (VMs) to Azure VMs using Azure Migrate Server Migration, with agentless migration.
- Hyper-V VMs to Azure VMs using Azure Migrate Server Migration, with agentless Hyper-V migration.
- Any server to an Azure VM using Azure Migrate Server Migration, with agent-based migration.
- File shares to Azure Files using Azure Storage Mover.
- SQL Server databases to Azure SQL Managed Instance using Azure Database Migration Service in offline mode.
- Any server to Azure VMs using redeploy and data copy.

For unsupported migrations, you perform the migration outside Azure Migrate. To aid tracking and coordination, the execution plan includes two steps: a manual step at the beginning to acknowledge workloads whose migration isn't supported, and an approval step in the appropriate application's step group to mark migration complete.

## Behaviors to plan for

- **Complete required inputs before starting.** Prepare discovery, targets, and tools. Static input checks don't replace live validation during wave execution.
- **Starting approves the current version.** Complete stakeholder review first. Runs are user-started, with one active run at a time. After successful completion, the wave is locked. You can't change workloads or configuration, edit the execution plan, or execute the wave again.
- **Changes have lifecycle constraints.** Active runs permit input changes only on a failed step being retried. Structural edits require cancellation and a new run. Regeneration discards all user edits and creates the execution plan from scratch.
- **Controls don't undo migration.** Pause and cancellation stop scheduling new work, while work in progress continues until it reaches a logical stopping point. Neither control terminates or undoes underlying migration-tool operations. Cancellation provides no cleanup or rollback.
- **Concurrency is system-managed.** Limits are shared across the wave and apply alongside migration-tool limits.

For exact limits and unsupported operations, see the [reference](reference-wave-migrations.md#execution-controls-and-capability-matrix). For action-specific checks and warnings, see [Configure and customize a wave](configure-customize-wave.md), [Execute your wave migration](execute-wave-migration.md), and [Track wave migrations](track-wave-migrations.md).

## Next step

> [!div class="nextstepaction"]
> [Understand how wave migrations work with an example](wave-migrations.md)