---
title: Check status of a Lifecycle workflow - Azure Active Directory
description: This article guides a user on checking the status of a Lifecycle workflow
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 03/10/2022
ms.subservice: compliance
ms.custom: template-how-to 
---


# Check the status of a workflow (Preview)

When a workflow is created, it's important to check its status, and run history to make sure it ran properly for the users it processed both by schedule and by on-demand. To get information about the status of workflows, Lifecycle Workflows allows you to check run and user processing history. This history also gives you summaries to see how often a workflow has run, and who it ran successfully for. You're also able to check the status of both the workflow, and its tasks. Checking the status of workflows and their tasks allows you to troubleshoot potential problems that could come up during their execution.


## Run workflow history using the Azure portal

You're able to retrieve run information of a workflow using Lifecycle Workflows. To check the runs of a workflow using the Azure portal, you would do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. On the left menu, select **Lifecycle Workflows (Preview)**.

1. On the Lifecycle Workflows overview page, select **Workflows (Preview)**.

1. Select the workflow you want to run history of. 

1. On the workflow overview screen, select **Audit logs**.

1. On the history page, select the **Runs** button.  

1. Here you'll see a summary of workflow runs.
    :::image type="content" source="media/check-status-workflow/run-list.png" alt-text="Screenshot of a workflow Runs list.":::
1. The runs summary cards include the total number of processed runs, the number of successful runs, the number of failed runs, and the total number of failed tasks.   

## User workflow history using the Azure portal

To get further information than just the runs summary for a workflow, you're also able to get information about users processed by a workflow. To check the status of users a workflow has processed using the Azure portal, you would do the following steps:

 
1. In the left menu, select **Lifecycle Workflows (Preview)**.

1. select **Workflows (Preview)**.

1. select the workflow you want to see user processing information for. 

1. On the workflow overview screen, select **Workflow history (Preview)**.
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

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults
```

By default **userProcessingResults** returns only information from the last 7 days. To get information as far back as 30 days, you would run the following API call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults?$filter=<Date range for processing results>
```

by default **userProcessingResults** returns only information from the last 7 days. To filter information as far back as 30 days, you would run the following API call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<id>/userProcessingResults?$filter=<Date range for processing results>
```

An example of a call to get **userProcessingResults** for a month would be as follows:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults?$filter=< startedDateTime ge 2022-05-23T00:00:00Z and startedDateTime le 2022-06-22T00:00:00Z
```

### User processing results using Microsoft Graph

When multiple user events are processed by a workflow, running the **userProcessingResults** may give incomprehensible information. To get a summary of information such as total users and tasks, and failed users and tasks, Lifecycle Workflows provides a call to get count totals.

To view a summary in count form, you would run the following API call:
```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults/summary(<Date Range>)
```

An example to get the summary between May 1, and May 30, you would run the following call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults/summary(startDateTime=2022-05-01T00:00:00Z,endDateTime=2022-05-30T00:00:00Z)
```

### List task processing results of a given user processing result

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/userProcessingResults/<userProcessingResultId>/taskProcessingResults/
```

## Run workflow history via Microsoft Graph

### List runs using Microsoft Graph

With Microsoft Graph, you're able to get full details of workflow and user processing run information.

To view a list of runs, you'd make the following API call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/runs
```

### Get a summary of runs using Microsoft Graph

To get a summary of runs for a workflow, which includes detailed information for counts of failed runs and tasks, along with successful runs and tasks for a time range, you'd make the following API call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/runs/summary(startDateTime=<time>,endDateTime=<time>)
```
An example to get a summary of runs of a workflow through the time interval of May 2022 would be as follows:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/runs/summary(startDateTime=2022-05-01T00:00:00Z,endDateTime=202205-31T00:00:00Z)
```

### List user and task processing results of a given run using Microsoft Graph

With Lifecycle Workflows, you're able to check the status of each user and task who had a workflow processed for them as part of a run.

 
You're also able to use **userProcessingResults** with the run call to get users processed for a run by making the following API call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId>/runs/<runId>/userProcessingResults
```

This API call will also return a **userProcessingResults ID** value, which can be used to retrieve task processing information in the following call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflowId> /runs/<runId>/userProcessingResults/<userProcessingResultId>/taskProcessingResults
```

> [!NOTE]
> A workflow must have activity in the past 7 days to get **userProcessingResults ID**. If there has not been any activity in that time-frame, the **userProcessingResults** call will not return a value.


## Next steps

- [Manage workflow versions](manage-workflow-tasks.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)