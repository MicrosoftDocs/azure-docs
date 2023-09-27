---
title: Check status of a Lifecycle workflow
description: This article guides a user on checking the status of a Lifecycle workflow
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 06/22/2023
ms.subservice: compliance
ms.custom: template-how-to 
---


# Check the status of a workflow

When a workflow is created, it's important to check its status, and run history to make sure it ran properly for the users it processed both by schedule and by on-demand. To get information about the status of workflows, Lifecycle Workflows allows you to check run and user processing history. This history also gives you summaries to see how often a workflow has run, and who it ran successfully for. You're also able to check the status of both the workflow, and its tasks. Checking the status of workflows and their tasks allows you to troubleshoot potential problems that could come up during their execution.


## Run workflow history using the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You're able to retrieve run information of a workflow using Lifecycle Workflows. To check the runs of a workflow using the Microsoft Entra Admin center, you would do the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Lifecycle Workflows Administrator](../roles/permissions-reference.md#lifecycle-workflows-administrator).

1. Browse to **Identity governance** > **Lifecycle workflows** > **workflows**.

1. Select the workflow you want to run history of. 

1. On the workflow overview screen, select **Audit logs**.

1. On the history page, select the **Runs** button.  

1. Here you'll see a summary of workflow runs.
    :::image type="content" source="media/check-status-workflow/run-list.png" alt-text="Screenshot of a workflow Runs list.":::
1. The runs summary cards include the total number of processed runs, the number of successful runs, the number of failed runs, and the total number of failed tasks.   

## User workflow history using the Microsoft Entra admin center

To get further information than just the runs summary for a workflow, you're also able to get information about users processed by a workflow. To check the status of users a workflow has processed using the Microsoft Entra admin center, you would do the following steps:
 
1. In the left menu, select **Lifecycle Workflows**.

1. select **Workflows**.

1. select the workflow you want to see user processing information for. 

1. On the workflow overview screen, select **Workflow history**.
    :::image type="content" source="media/check-status-workflow/workflow-history.png" alt-text="Screenshot of a workflow overview history.":::
1. On the workflow history page, you're presented with a summary of every user processed by the workflow along with counts of successful and failed users and tasks.
    :::image type="content" source="media/check-status-workflow/workflow-history-list.png" alt-text="Screenshot of a list of workflow summaries.":::
1. By selecting total tasks by a user you're able to see which tasks have successfully completed, or are currently in progress.
    :::image type="content" source="media/check-status-workflow/task-history-status.png" alt-text="Screenshot of workflow task history status.":::
1. By selecting failed tasks, you're able to see which tasks have failed for a specific user.
    :::image type="content" source="media/check-status-workflow/task-history-failed.png" alt-text="Screenshot of workflow failed tasks history.":::
1. By selecting unprocessed tasks, you're able to see which tasks are unprocessed.
    :::image type="content" source="media/check-status-workflow/task-history-unprocessed.png" alt-text="Screenshot of unprocessed tasks of a workflow.":::


## User workflow history using Microsoft Graph

### List user processing results using Microsoft Graph

To view a status list of users processed by a workflow, which are UserProcessingResults, you'd make the following API call:

To view a list of user processing results using API via Microsoft Graph, see: [List userProcessingResults](/graph/api/identitygovernance-workflow-list-userprocessingresults)

### User processing results using Microsoft Graph

To view a summary of user processing results via API using Microsoft Graph, see: [userProcessingResult: summary](/graph/api/identitygovernance-userprocessingresult-summary)



## Run workflow history via Microsoft Graph

### List runs using Microsoft Graph

To view runs of a workflow via API using Microsoft Graph, see: [runs](/graph/api/resources/identitygovernance-run)


### Get a summary of runs using Microsoft Graph

To view run summary via API using Microsoft Graph, see: [run summary of a lifecycle workflow](/graph/api/identitygovernance-run-summary)

### List user and task processing results of a given run using Microsoft Graph

To get user processing result for a run of a lifecycle workflow via API using Microsoft Graph, see: [Get userProcessingResult (for a run of a lifecycle workflow)](/graph/api/identitygovernance-userprocessingresult-get)

To list task processing results for a user processing result via API using Microsoft Graph, see: [List taskProcessingResults (for a userProcessingResult)](/graph/api/identitygovernance-userprocessingresult-list-taskprocessingresults)


> [!NOTE]
> A workflow must have activity in the past 7 days to get **userProcessingResults ID**. If there has not been any activity in that time-frame, the **userProcessingResults** call will not return a value.


## Next steps

- [Manage workflow versions](manage-workflow-tasks.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)
