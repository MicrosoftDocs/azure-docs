---
title: Execute and Track Waves in Azure Migrate
description: Learn how to execute and track waves in Azure Migrate. Understand supported and manual execution flows, update statuses, and monitor migration progress efficiently.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: how-to
ms.date: 11/04/2025
monikerRange: migrate 
# Customer intent: To understand how to execute and track migration waves in Azure Migrate, including supported and manual execution flows, and learn how to monitor migration progress and update statuses during the migration phase.
---

# Execute and track waves in Azure Migrate (preview)

This article describes how to execute migration and modernization waves in Azure Migrate, including starting migration flows, performing tasks, and tracking progress for supported and unsupported workloads.

This phase begins when you reach the planned start time and perform migration and modernization activities within the scheduled time window. Azure Migrate provides two types of execution and tracking flows, based on whether the workload migration from source to target is supported:

1. **Azure Migrate supports execution activities**: When Azure Migrate supports execution, Wave Planning enables automated execution and tracking. You can start migration, and modernization flows through wave execution, take actions, and track statuses. For example, you can perform server migration tasks such as replication, test migration, and cutover, and monitor progress automatically.
1. **Azure Migrate doesn't support these execution activities**: Azure Migrate doesn’t support several workload and application migration or modernization activities. In such cases, you plan and track the activities in Azure Migrate and manually update their status for centralized tracking. Execute these activities outside Azure Migrate.

## Executing Waves

This section explains how to execute a migration wave in Azure Migrate using the Wave Planning feature. When the wave is ready, follow these steps to execute it:

1. Select **Execute wave** from **Wave Planning**.

:::image type="content" source="./media/how-to-execute-track-waves/execute-waves.png" alt-text="The screenshot shows the overview of the execute wave details." lightbox="./media/how-to-execute-track-waves/execute-waves.png"::: 


### Execute application migration tasks

Use the application migration settings to review workloads, execute migration flows, and track tasks for completion.

1. Select the application name. Azure Migrate groups the workload by source-to-target combinations that share a similar migration and modernization journey.
2. For each source to target combination, select **Review and Execute**. If supported, Azure Migrate starts the execution flow for the workload.

:::image type="content" source="./media/how-to-execute-track-waves/application-execute.png" alt-text="The screenshot shows the details of the application execute waves." lightbox="./media/how-to-execute-track-waves/application-execute.png"::: 

3. If the application has tracked tasks, select the number under **Tasks**.

:::image type="content" source="./media/how-to-execute-track-waves/application-tasks.png" alt-text="The screenshot shows the application task marked as complete." lightbox="./media/how-to-execute-track-waves/application-tasks.png"::: 

4. After you complete the task out of band, select **Mark as Complete**.

### Execute Workload migration flows

Use workload migration settings to review source-to-target combinations, execute supported migrations, and update tasks for unsupported flows.

1. For each source target combination select **Review and Execute.**  If supported, Azure Migrate starts the workload execution flow.
1. For unsupported executions, update the tasks by selecting **View Execution Details**.    
1. For supported executions, select **Execute** migrations for all to start the execution flow.
  
## Tracking wave executions

Use the Migrations view in the Wave to track the migration execution of applications and workloads.

:::image type="content" source="./media/how-to-execute-track-waves/workload-tracking-view.png" alt-text="The screenshot shows the workload tracking view." lightbox="./media/how-to-execute-track-waves/workload-tracking-view.png"::: 

To view detailed workload status, follow the steps:

1. Select **Execution Stage** and review the tasks in each migration and modernization stage. You can also perform activities and update the migration status here.

:::image type="content" source="./media/how-to-execute-track-waves/workload-task-tracking-view.png" alt-text="The screenshot shows the workload task view in migration." lightbox="./media/how-to-execute-track-waves/workload-task-tracking-view.png"::: 
    
:::image type="content" source="./media/how-to-execute-track-waves/app-tracking-view.png" alt-text="The screenshot shows the app tracking details." lightbox="./media/how-to-execute-track-waves/app-tracking-view.png"::: 

## Next steps

Learn more to [Optimize work loads](/azure/cloud-adoption-framework/modernize/optimize-after-cloud-modernization).