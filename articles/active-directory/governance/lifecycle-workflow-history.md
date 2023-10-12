---
title: Lifecycle Workflow History
description: Conceptual article about Lifecycle Workflows reporting and history capabilities
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: conceptual 
ms.date: 05/31/2023
ms.custom: template-concept 
---


# Lifecycle Workflows history



Workflows created using Lifecycle Workflows allow for the automation of lifecycle task for users no matter where they fall in the Joiner-Mover-Leaver (JML) model of their identity lifecycle in your organization. Making sure workflows are processed correctly is an important part of an organization's lifecycle management process. Workflows that aren't processed correctly can lead to many issues in terms of security and compliance. With Lifecycle Workflow's history features, you can specify which workflow events you want to view a history of based on user, runs, or task summaries. This reporting feature allows you to quickly see what ran for who, and rather or not it was successful. Along with the summaries in these specific areas, you're also able to view detailed information about each specific event recorded in their respective summary section. In this article you'll learn the difference between the three different type of history summaries, and details, you can query with Lifecycle Workflows. You'll also learn when you would use each when getting more information about how your workflows were utilized for users in your organization. For detailed information about every action Lifecycle Workflows take, see: [Auditing Lifecycle Workflows](lifecycle-workflow-audits.md).

## Lifecycle Workflow History Summaries

Lifecycle Workflows introduce a history feature based on summaries and details. These history summaries allow you to quickly get information about for who a workflow ran, and whether or not this run was successful. This is valuable because the large set of information given by audit logs might become too numerous to be efficiently used. To make a large set of information processed easier to read, Lifecycle Workflows provide summaries for quick use. You can view these history summaries in three ways:

- **Users summary**: Shows a summary of users processed by a workflow. Successfully, failed, and total ran information for each specific user is shown.
- **Runs summary**: Shows a summary of workflow runs in terms of the workflow. Successful, failed, and total task information when workflow runs are noted.
- **Tasks summary**: Shows a summary of tasks processed by a workflow, and which tasks failed, successfully, and totally ran in the workflow.

Summaries allow you to quickly gain details about how a workflow ran for itself, or users, without going into further details in logs.  For a step by step guide on getting this information, see [Check the status of a workflow](check-status-workflow.md).

## Users Summary information

User summaries allow you to view workflow information through the lens of users it has processed.

:::image type="content" source="media/lifecycle-workflow-history/users-summary-concept.png" alt-text="Screenshot of a workflow user summary.":::


Within the user summary, you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of users processed by a workflow during the selected time frame.        |
|Successful     | The total number of successful users processed by a workflow during the selected time frame.        |
|Failed     | The total number of failed users processed by a workflow during the selected time frame.        |
|Total tasks     | The total number of tasks processed for users in a workflow during the selected time frame.        |
|Failed tasks     |  The total number of failed tasks processed for users in a workflow during the selected time frame.       |

### User history details

User detailed history information allows you to filter for specific information based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the user processed. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Workflow execution type**: You can filter on workflow execution type such as **Scheduled** or **on-demand**
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the user was processed in a workflow.

For a complete guide on getting user processed summary information, see: [User workflow history using the Microsoft Entra admin center](check-status-workflow.md#user-workflow-history-using-the-microsoft-entra-admin-center).


## Runs Summary

Runs summaries allow you to view workflow information through the lens of its run history

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

For a complete guide on getting runs information, see: [Run workflow history using the Microsoft Entra admin center](check-status-workflow.md#run-workflow-history-using-the-microsoft-entra-admin-center)


## Tasks summary

Task summaries allow you to view workflow information through the lens of its tasks.

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

Separating processing of the workflow from the tasks is important because, in a workflow, processing a user certain tasks could be successful, while others could fail. Whether or not a task runs after a failed task in a workflow depends on parameters such as enabling continue On Error, and their placement within the workflow. For more information, see [Common task parameters](lifecycle-workflow-tasks.md#common-task-parameters).

## Next steps

- [userProcessingResult resource type](/graph/api/resources/identitygovernance-userprocessingresult?view=graph-rest-beta&preserve-view=true)
- [taskReport resource type](/graph/api/resources/identitygovernance-taskreport?view=graph-rest-beta&preserve-view=true)
- [run resource type](/graph/api/resources/identitygovernance-run?view=graph-rest-beta&preserve-view=true)
- [taskProcessingResult resource type](/graph/api/resources/identitygovernance-taskprocessingresult?view=graph-rest-beta&preserve-view=true)
- [Understanding Lifecycle Workflows](understanding-lifecycle-workflows.md)
- [Lifecycle Workflow templates](lifecycle-workflow-templates.md)
