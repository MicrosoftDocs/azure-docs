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



Workflows created using Lifecycle Workflows allow for the automation of lifecycle task for users no matter where they fall in the Joiner-Mover-Leaver (JML) model of their identity lifecycle in your organization. Making sure workflows are processed correctly is an important part of an organization's lifecycle management process. Workflows that aren't processed correctly can lead to many issues in terms of security and compliance. With Lifecycle Workflow's history features, you can specify which workflow events you want to view a history of based on user, runs, or task summaries. This reporting feature allows you to quickly see what ran for who, and rather or not it was successful. Along with the summaries in these specific areas, you're also able to view detailed information about each specific event recorded in their respective summary section. In this article, you learn the difference between the three different type of history summaries, and details, you can query with Lifecycle Workflows. You also learn when you would use each when getting more information about how your workflows were utilized for users in your organization. For detailed information about every action Lifecycle Workflows take, see: [Auditing Lifecycle Workflows](lifecycle-workflow-audits.md).

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


### User history status details

When viewing the status of user processing history, the status values correspond to the following information:


|Status  |Details  |
|---------|---------|
|Completed     | This state is reported if all of the workflow's tasks processes successfully for a user.       |
|In Progress     | This state is reported when a workflow begins running tasks for a user.. The status remains in this state until all the workflow's tasks are processed for the user, or it fails.        |
|Queued     | This state is reported when a user is identified by the Lifecycle Workflow engine that meets the execution conditions of a workflow. From here a user either enters a state of In progress if the workflow begins running for them, or canceled if the admin manually cancels the workflow.       |
|Canceled     |  This state is reported for the following reasons: <br><br>**1.** If the workflow was deleted, all scheduled users it's set to run for are canceled.<br>**2.** If the workflow was disabled, all scheduled users it's set to run for are canceled.<br>**3**. If the workflow's schedule was disabled, all scheduled users it's set to run for are canceled.<br>**4.** If the workflow had a new version created and all tasks were disabled, all scheduled users it's set to run for are canceled.<br>**5.** If users don't meet the current execution conditions of the workflow's new version, the scheduled runs are canceled.<br>**6.**  If the user was queued to have the workflow run for them, but has a profile change and no longer meet the current execution conditions of the workflow immediately before it runs, the processing is canceled.      |
|Completed with errors     | This state is reported if the workflow completed, but one or more tasks that are set have **continueOnError** set as *true* have failed.       |
|Failed     |  This state is reported if a task with **continueOnError** set as *false* fails.      |

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


### Runs history status details

When viewing the status of run history, the status values correspond to the following information:


|Status  |Details  |
|---------|---------|
|Queued      | This state is reported the first time a workflow is set to run.        |
|In Progress     |  This state is reported as soon as the workflow begins processing its first task.       |
|Canceled     |  This state is reported if it was *In Progress* at one point of time, and is now frozen in that state.       |
|Completed with errors     | This state is reported if the workflow runs successfully for some, but not others. If a workflow enters the queued state, but all of its instances are canceled before executing, then it will also show this state before ever entering a state of *In Progress*.        |
|Completed     |  This state is reported if the workflow ran successfully for every user.       |
|Failed     |  This state is reported if all tasks failed for all users the workflow runs for. Canceled users aren't counted as failures in the report.      |

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

### Task history status details

When viewing the status of task history, the status values correspond to the following information:


|Status  |Details  |
|---------|---------|
|Queued      | This state is reported once a workflow instance is scheduled for execution, task reports for all of the tasks within the workflow are also created with this status with Run record. Each task report includes all users but represents a specific task.        |
|In Progress     |  This state is reported as soon as the first task begins being processed.       |
|Canceled     |  This state is reported if no tasks are processed before the workflow is canceled. If a workflow that contains the tasks is deleted, then the status will also show as canceled.      |
|Completed with errors     | This state is reported if a task is processed for a user, but not every task succeeds.       |
|Completed     |  This state is reported if all tasks ran successfully for every user.       |
|Failed     |  This state is reported if all tasks failed.      |

Separating processing of the workflow from the tasks is important because, in a workflow, processing a user certain tasks could be successful, while others could fail. Whether or not a task runs after a failed task in a workflow depends on parameters such as enabling continue On Error, and their placement within the workflow. For more information, see [Common task parameters](lifecycle-workflow-tasks.md#common-task-parameters).

## Next steps

- [userProcessingResult resource type](/graph/api/resources/identitygovernance-userprocessingresult?view=graph-rest-beta&preserve-view=true)
- [taskReport resource type](/graph/api/resources/identitygovernance-taskreport?view=graph-rest-beta&preserve-view=true)
- [run resource type](/graph/api/resources/identitygovernance-run?view=graph-rest-beta&preserve-view=true)
- [taskProcessingResult resource type](/graph/api/resources/identitygovernance-taskprocessingresult?view=graph-rest-beta&preserve-view=true)
- [Understanding Lifecycle Workflows](understanding-lifecycle-workflows.md)
- [Lifecycle Workflow templates](lifecycle-workflow-templates.md)
