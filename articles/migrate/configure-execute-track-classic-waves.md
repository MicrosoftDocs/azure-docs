---
title: Configure, execute, and track classic waves in Azure Migrate
description: Learn how to configure targets, prepare prerequisites, execute migrations, and track application and workload progress in classic Azure Migrate waves.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/28/2026
monikerRange: migrate
# Customer intent: As a migration engineer, I want to configure, execute, and track a classic wave so that I can coordinate migration tasks and monitor progress.
---

# Configure, execute, and track classic waves in Azure Migrate (preview)

Classic waves are waves you created before November 11, 2026. They use a task-based workflow to configure migration targets, prepare prerequisites, run migrations, and track progress across applications and workloads, including work outside Azure Migrate.

## Prerequisites

- An Azure Migrate project with a classic wave that contains the applications and workloads you want to migrate.
- Discovery and assessment information for the workloads, where available, to help select Azure targets and migration tools.

> [!NOTE]
> The wave's creation date determines its execution experience. Waves you create on or after November 11, 2026, use the [new wave execution experience (preview)](wave-migrations-overview.md).
>
> There's no conversion mechanism for classic waves. Before execution starts, you can delete the classic wave and [create a new wave](how-to-plan-create-waves.md) on or after November 11, 2026, to use the new experience. After execution starts, continue with the classic experience.

## Configure migration targets and tasks

Classic waves have two broad stages. During configuration, you define migration targets, select tools, and identify tasks and prerequisites. During execution, you carry out that migration work and track its progress.

For each application and workload, review the target Azure service, migration tool, and tasks needed for migration. Assessments provide target recommendations.

> [!NOTE]
> Linking an assessment provides an Azure target recommendation for each workload. You can view detailed configurations, such as storage or compute SKUs, only for integrated server migrations.

Open the wave's **Azure Targets** page and select **Configure** in the **Target Settings** tile.

:::image type="content" source="./media/wave-planning-overview/wave-overview.png" alt-text="Screenshot of the wave overview with target settings and wave settings." lightbox="./media/wave-planning-overview/wave-overview.png":::

### Configure application targets and tasks

Use application target settings to link an assessment and add tasks beyond the individual workload migrations.

> [!IMPORTANT]
> Linking an assessment to an application associates it with all workloads in that application across all waves and resets the related tasks. Review the impact before changing the linked assessment.

1. In **Target Setting**, select **Link assessment** to review or change the linked assessment, or link one if none is linked.

   :::image type="content" source="./media/complete-wave-plan/application-target-settings.png" alt-text="Screenshot of application target settings with the link assessment option." lightbox="./media/complete-wave-plan/application-target-settings.png":::

1. Select **Add tasks** to add application-specific migration work. You track these tasks manually.

   :::image type="content" source="./media/complete-wave-plan/application-tasks.png" alt-text="Screenshot of application migration tasks." lightbox="./media/complete-wave-plan/application-tasks.png":::

### Configure workload targets and tasks

Set each workload's target and migration tool, and then review the tasks needed for its migration.

Migration and modernization tasks describe the activities needed to migrate a workload. Azure Migrate can recommend tasks based on the selected migration approach, and you can add tasks for work specific to your organization.

1. Select **Configure target** to review the Azure target. If you linked an assessment, the target is populated from that assessment.
1. Select **None** for workloads that you plan to retire rather than migrate.
1. In **Migration tool**, select the tool that determines the migration path and tasks. Select **Other** for workloads that you plan to migrate outside Azure Migrate.

   :::image type="content" source="./media/complete-wave-plan/workload-target-settings.png" alt-text="Screenshot of workload target and migration tool settings." lightbox="./media/complete-wave-plan/workload-target-settings.png":::

1. Select **Save configuration**.
1. Review the migration tasks and use **Add tasks** to add any other work you need to track.
1. Select **Save tasks**.

## Prepare the wave for execution

Azure Migrate identifies prerequisites based on the targets, tools, and tasks you configure. Review these prerequisites and add organization-specific preparation work before starting migration.

The wave's planned start and end dates record the intended migration window. Use them to coordinate the work with your teams and review progress against the planned timeline.

1. In the **Wave settings** tile, select **View details**.

   :::image type="content" source="./media/complete-wave-plan/wave-settings.png" alt-text="Screenshot of the wave settings tile." lightbox="./media/complete-wave-plan/wave-settings.png":::

1. Review the prerequisites. To track extra preparation work, select **Add Task**.

   :::image type="content" source="./media/complete-wave-plan/add-tasks-and-prereqs.png" alt-text="Screenshot of tasks and prerequisites in wave settings." lightbox="./media/complete-wave-plan/add-tasks-and-prereqs.png":::

1. Enter a task name and **Description**.

   > [!NOTE]
   > Don't include personal, sensitive, or confidential information in wave or task descriptions.

1. Select **Add**, and then select **Save changes**.
1. Complete the prerequisite tasks shown in the wave configuration stage.
1. Review and update the planned start and end dates in **Wave Settings**.

After you configure the migration targets and activities and complete the prerequisites, the wave transitions to **Ready for Execution**.

## Execute the wave

When the wave is ready and you reach its planned migration window, open it from **Execute** > **Waves**, then select its **Overview** to start execution. Start from the individual classic wave, not the **Waves** list page.

How you execute and track work depends on whether Azure Migrate supports the migration activity:

- **Supported activities:** Start the migration flow from the wave and track its progress automatically. For example, supported server migrations provide replication, test migration, and cutover actions.
- **Activities outside Azure Migrate:** Complete the migration or modernization work in the appropriate tool, then update the tracked tasks manually in Azure Migrate.

### Execute application migration tasks

Review the migration flows and any additional tasks for each application.

1. Select the application name. Workloads are grouped by source-to-target combinations that share a migration journey.
1. For each combination, select **Review and Execute**. If the migration is supported, Azure Migrate opens the workload execution flow.

   :::image type="content" source="./media/execute-track-waves/application-execute.png" alt-text="Screenshot of application workloads grouped for migration execution." lightbox="./media/execute-track-waves/application-execute.png":::

1. If the application has additional tracked tasks, select the number under **Tasks**.

   :::image type="content" source="./media/execute-track-waves/application-tasks.png" alt-text="Screenshot of application tasks that can be marked complete." lightbox="./media/execute-track-waves/application-tasks.png":::

1. Complete each task outside Azure Migrate, then select **Mark as Complete** for the completed task.

### Execute workload migration flows

Start supported migration flows or record progress for work performed outside Azure Migrate.

1. Select **Review and Execute** for each source-to-target combination.
1. Select **Execute** to start the migration flow for the workloads that support migration.
1. Complete the work outside Azure Migrate for activities that aren't supported. Select **View Execution Details** to update the tracked tasks.

## Track the wave's migration progress

Use the wave's **Migrations** view to review application and workload migration progress.

Classic workload migrations are organized into three execution stages. The activities in each stage vary by workload and migration method:

- **Preparation:** Prepare the Azure environment and complete the required data and configuration transfers.
- **Testing:** Test the workload before production use, including deployment to an isolated test environment where applicable.
- **Completion:** Finalize the migration and complete any required setup or optimization in the target environment.

Each stage contains one or more migration and modernization tasks. Completing those tasks marks the stage complete. These workload stages are separate from the wave's configuration and execution stages: they organize the work for each workload, rather than describe the state of the whole wave.

1. Review the applications and workloads in the wave.

   :::image type="content" source="./media/execute-track-waves/workload-tracking-view.png" alt-text="Screenshot of workload migration progress within a classic wave." lightbox="./media/execute-track-waves/workload-tracking-view.png":::

1. Select **Execution Stage** to review the tasks in each migration and modernization stage.

   :::image type="content" source="./media/execute-track-waves/workload-task-tracking-view.png" alt-text="Screenshot of workload tasks within a migration stage." lightbox="./media/execute-track-waves/workload-task-tracking-view.png":::

1. Perform available migration actions or update manually tracked tasks as the work progresses. Supported migration flows update progress automatically.
1. Review application progress alongside the individual workload results.

   :::image type="content" source="./media/execute-track-waves/app-tracking-view.png" alt-text="Screenshot of application migration progress in a classic wave." lightbox="./media/execute-track-waves/app-tracking-view.png":::

For project-level application and workload tracking, see [Track workload and application migration progress](migration-execution-overview.md#track-workload-and-application-migration-progress).

## Related content

- [Compare migration execution options](migration-execution-overview.md).
- [Optimize workloads after migration](/azure/cloud-adoption-framework/modernize/optimize-after-cloud-modernization).
