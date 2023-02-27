---
title: Lifecycle Workflow History
description: Conceptual article about Lifecycle Workflows reporting and history capabilities.
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: conceptual 
ms.date: 01/26/2023
ms.custom: template-concept 
---


# Lifecycle Workflows history

Workflows created using Lifecycle Workflows allow for the automation of common tasks for users throughout their lifecycle within your organization. Making sure these workflows are processed correctly after they've run is an important part of an organization's lifecycle management process. Workflows that aren't processed correctly can lead to many issues in terms of security and compliance. In this article, you'll learn the difference between the three different workflow history types provided by Lifecycle Workflows, and when you should use each. To see a comprehensive view of Lifecycle Workflow actions, see: [Auditing Lifecycle Workflows](lifecycle-workflow-audits.md).

## History overview

Lifecycle Workflows introduce the ability to view workflow details from three different perspectives. These perspectives allow you to gain quick insight into for who the workflow ran, when it ran and completed, and which tasks were completed during its run. For a step by step guide on getting this information for a specific workflow, see [Check the status of a workflow](check-status-workflow.md)

The three perspectives you can view workflow details from are as follows:

- [Users](lifecycle-workflow-history.md#users-history)
- [Runs](lifecycle-workflow-history.md#runs-history)
- [Tasks](lifecycle-workflow-history.md#tasks-history)

Below you'll learn about each perspective, what they tell you, and when you should use them.


## Users history

When you view history through the **Users** perspective, how a workflow processes users is taken into account. Viewing history through this perspective is useful for seeing how a workflow ran for both overall, and specific, users.

User history details can be used for:

- **Execution Conditions validation**: By seeing which users a workflow has run for, and when they ran, allows you to validate if execution conditions are correctly set


### User summary details

:::image type="content" source="media/lifecycle-workflow-history/users-summary-concept.png" alt-text="Screenshot of a workflow user summary.":::

Within the user summary, you're able to find the following information:

|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of users processed during the selected time frame.        |
|Successful     | The total number of successful users processed during the selected time frame.        |
|Failed     | The total number of failed users processed during the selected time frame.        |
|Total tasks     | The total number of tasks processed for users during the selected time frame.        |
|Failed tasks     |  The total number of failed tasks processed for users during the selected time frame.       |



### User history details

User detailed history information allows you to filter for specific information based on:

- **Date**: You can filter based on a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter based on a specific status of the user processed. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Workflow execution type**: You can filter based on the workflow execution type such as **Scheduled** or **On-demand**.
- **Completed date**: You can filter based on a range from as short as 24 hours up to 30 days of when the user was processed in a workflow.

For a complete guide on getting user processed summary information, see: [User workflow history using the Azure portal](check-status-workflow.md#user-workflow-history-using-the-azure-portal).


## Runs history

When viewing history through the **Runs** perspective, you get to see the history of each time a specific workflow ran. Viewing history through this perspective is useful for seeing workflow execution history, and when each one failed. Task failure information during specific workflow executions are also noted.

### Runs summary details

:::image type="content" source="media/lifecycle-workflow-history/runs-status-concept.png" alt-text="Screenshot of a workflow runs summary.":::

Within the runs summary, you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of workflows that have run.         |
|Successful     | Workflows that successfully ran.        |
|Failed     | Workflows that failed to run.        |
|Failed tasks     | Workflows that ran with failed tasks.        |


### Runs history details

Runs detailed history information allows you to filter for specific information based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the workflow run. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**.
- **Workflow execution type**: You can filter on workflow execution type such as **Scheduled** or **On-demand**.
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the workflow ran.

For a complete guide on getting runs information, see: [Run workflow history using the Azure portal](check-status-workflow.md#run-workflow-history-using-the-azure-portal)


## Tasks history

Viewing history through **Tasks** allows you to view workflow information specifically through the perspective of its tasks. You are able to see which tasks have run, their start time, their status, and for who they have run successfully or unsuccessfully for. Viewing tasks processed by a workflow is important because certain tasks could fail for a user, while other tasks within the workflow could be successful. This can greatly influence how a workflow behaves based on how tasks are configured. For example, whether or not a following task runs after one has failed depends on parameters such as enabling **continueOnError**, and their placement within the workflow. For more information, see [Common task parameters](lifecycle-workflow-tasks.md#common-task-parameters).

### Task summary details

:::image type="content" source="media/lifecycle-workflow-history/task-summary-concept.png" alt-text="Screenshot of a workflow task summary.":::

Within the tasks summary, you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of tasks processed by a workflow.         |
|Successful     | The number of successfully processed tasks by a workflow.       |
|Failed     | The number of failed processed tasks by a workflow.         |
|Unprocessed     | The number of unprocessed tasks by a workflow.        |

### Task history details

Task detailed history information allows you to filter for specific information based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the workflow run. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the workflow ran.
- **Tasks**: You can filter based on specific task names.


## Next steps

- [userProcessingResult resource type](/graph/api/resources/identitygovernance-userprocessingresult?view=graph-rest-beta&preserve-view=true)
- [taskReport resource type](/graph/api/resources/identitygovernance-taskreport?view=graph-rest-beta&preserve-view=true)
- [run resource type](/graph/api/resources/identitygovernance-run?view=graph-rest-beta&preserve-view=true)
- [taskProcessingResult resource type](/graph/api/resources/identitygovernance-taskprocessingresult?view=graph-rest-beta&preserve-view=true)
- [Understanding Lifecycle Workflows](understanding-lifecycle-workflows.md)
- [Lifecycle Workflow templates](lifecycle-workflow-templates.md)