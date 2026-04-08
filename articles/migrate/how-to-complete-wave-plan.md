---
title: High-Fidelity Azure Execution Planning for Modernization
description: Learn how to plan Azure execution with high fidelity. Identify targets, tools, tasks, and prerequisites to ensure predictable modernization without delays.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: concept-article
ms.date: 11/04/2025
monikerRange: migrate 
# Customer intent: Understand concepts such as migration targets, prerequisites, and wave planning. Also, plan and execute a predictable migration and modernization process using Azure Migrate.
---

# Plan high-fidelity execution for predictable migration and modernization (preview)

This article explains how to create a high-fidelity migration plan in Azure Migrate, including defining targets, configuring settings, adding tasks, and preparing prerequisites to ensure predictable migration and modernization.

Creating a high-fidelity plan including all the migration details is essential for ensuring predictable migration and modernization without deviations and plans and outcomes. The primary details include:

1. Azure services for hosting applications and workloads.
1. Tools and the approach required for migration and modernization.
1. Activities to be performed during migration and modernization.
1.  Timeline and prerequisites to prepare for migration.

## Identify Azure migration targets before moving workloads 

Before migrating workloads and applications, identify the Azure destination and determine the appropriate method for moving them. The assessment provides recommendations and details about migration targets in Azure.

>[!Note]
> Currently, the Azure Migrate assessment link suggests an Azure target for every workload, but specific configurations, such as storage or compute SKUs are only available for integrated server migrations.

To review and update these settings in Azure Migrate Wave planning, follow these steps:

1. Go to Azure Targets page and select **Configure** in the **Target Settings** tile.

    :::image type="content" source="./media/wave-planning-overview/wave-overview.png" alt-text="The screenshot shows the overview of the wave planning." lightbox="./media/wave-planning-overview/wave-overview.png":::

### Configure application targets and tasks

Use the application target settings to link assessments and add migration tasks for your application.

1. In **Target Setting** select **Link assessment** to review the link assessment. You can change assessment or link if none is currently linked.  

To link an assessment to the application links the assessment to all workloads for that application across waves and reset the tasks.  

:::image type="content" source="./media/how-to-complete-wave-plan/application-target-settings.png" alt-text="The screenshot shows how to select link assessment in target settings page." lightbox="./media/how-to-complete-wave-plan/application-target-settings.png"::: 

2. Select **Add tasks** to add tasks that you need to perform as part of migration beyond the workload migrations. These tasks are manual, so you can add, update, and track manually.

:::image type="content" source="./media/how-to-complete-wave-plan/application-tasks.png" alt-text="The screenshot shows how to select tasks that you need to perform." lightbox="./media/how-to-complete-wave-plan/application-tasks.png"::: 


### Configure Workload Targets and migration tasks

Use workload target settings to configure Azure targets, select migration tools, and add tasks to your migration plan.

1. Select **Configure target** to review and configure the Azure target. The system sets the target by default when you select an assessment. 
2. Select **None** for workloads that are planned for retirement and not to be migrated.
3. Select the tool in **Migration tool** dropdown to define the migration path and tasks. 
4. Select **Other** for workloads that you want to migrate outside Azure Migrate.
   
:::image type="content" source="./media/how-to-complete-wave-plan/workload-target-settings.png" alt-text="The screenshot shows how to review and configure." lightbox="./media/how-to-complete-wave-plan/workload-target-settings.png":::      
 
5. Select **Save configuration**.
6. Review and add tasks using **Add tasks** that need to be performed and tracked for migrations.
7. Select **Save tasks** to save.
    
See the [FAQ](common-questions-wave-planning.md) for supported tools and targets for the execution phase of migration and modernization.

## Prepare your Wave for migration: Key prerequisites

Azure Migrate identifies the prerequisites you need to complete before starting migration, based on the migration targets, tools, and tasks you define. To review and add other prerequisites for tracking and to make the wave ready for migration, follow the steps:

1. Select **View details** in the Wave settings tile.  

:::image type="content" source="./media/how-to-complete-wave-plan/wave-settings.png" alt-text="The screenshot shows how to view details in the wave settings tile." lightbox="./media/how-to-complete-wave-plan/wave-settings.png":::   

2. Review the prerequisites and select **Add Task**.  

:::image type="content" source="./media/how-to-complete-wave-plan/add-tasks-and-prereqs.png" alt-text="The screenshot shows how to add tasks in wave settings." lightbox="./media/how-to-complete-wave-plan/add-tasks-and-prereqs.png":::   

3. Provide a description name of the task and **Description** about the task.

> [!NOTE]
> **Don't** include any personal, sensitive, or confidential information in the wave or task description. 

4. Select **Add**, and then select **Save changes** to save the tasks as a prerequisite.

The tasks appear in the Wave configuration stage of the migration and modernization journey. Complete these tasks before the Wave is ready for execution.

After you identify all tasks and activities, review and update the planned start and end dates for the migration in the **Wave Settings** page.

After you identify the migration and modernization activities, configure the target settings, and complete the prerequisites, the wave transitions to the **Ready for Execution** stage.

You can perform the wave planning for multiple waves in a similar way.

## Next steps

- Learn more about [execute your wave using Azure Migrate](how-to-execute-track-waves.md).
