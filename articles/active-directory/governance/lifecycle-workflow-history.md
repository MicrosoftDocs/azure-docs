---
title: Lifecycle Workflow History
description: Conceptual article about Lifecycle Workflows reporting and history capabilities
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 08/01/2022
ms.custom: template-concept 
---


# Lifecycle Workflows history (Preview)



Workflows created using Lifecycle Workflows allow for the automation of lifecycle task for users no matter where they fall in the Joiner-Mover-Leaver (JML) model of their identity lifecycle in your organization. Making sure workflows are processed correctly is an important part of an organization's lifecycle management process. Workflows that aren't processed correctly can lead to many issues in terms of security and compliance. With Audit logs every action that Lifecycle Workflows complete are recorded. With history features, Lifecycle Workflows allow you to specify workflow events based on user, runs, or task summaries. This reporting feature allows you to quickly see what ran for who, and rather or not it was successful. In this article you'll learn the difference between auditing logs and 3 different type of history summaries you can query with Lifecycle Workflows. You'll also learn when you would use each when getting more information about how your workflows were utilized for users in your organization.



## Audit Logs

Every time a workflow is processed, an event is logged. These events are stored in the **Audit Logs** section, and can be used to gain information about workflows for historical, and auditing, purposes. 

:::image type="content" source="media/lifecycle-workflow-history/audit-logs-concept.png" alt-text="Screenshot of a workflow audit log.":::

On the **Audit Log** page you're presented a sequential list, by date, of every action Lifecycle Workflows has taken. From this information you're able to filter based on the following parameters:


|Filter  |Description  |
|---------|---------|
|Date     | You can filter a specific range for the audit logs from as short as 24 hours up to 30 days.        |
|Date option     | You can filter by your tenant's local time, or by UTC.        |
|Service     | The Lifecycle Workflow service.        |
|Category     | Categories of the event being logged. Separated into <br><br>  **All**- All events logged by Lifecycle Workflows.<br><br>  **TaskManagement**- Task specific related events logged by Lifecycle Workflows. <br><br> **WorkflowManagement**- Events dealing with the workflow itself.       |
|Activity     |  You can filter based on specific activities, which are based on categories.       |

After filtering this information, you're also able to see other information in the log such as:

- **Status**: Whether or not the logged event was successful or not.
- **Status Reason**: If the event failed, a reason is given why.
- **Target(s)**: Who the logged event ran for. Information given as their Azure Active Directory object ID.
- **Initiated by (actor)**: Who did the event being logged. Information given by the user name. 

## Lifecycle Workflow History Summaries

While the large set of information contained in audit logs can be useful for compliance reasons, for regular administration use it might be too much information. To make this large set of information processed easier to read, Lifecycle Workflows provide summaries for quick use. You can view these history summaries in three ways:

- **Users summary**: Shows a summary of users processed by a workflow, and which tasks failed, successfully, and totally ran for each specific user. 
- **Runs summary**: Shows a summary of workflow runs in terms of the workflow. Successful, failed, and total task information when workflow runs are noted.
- **Tasks summary**: Shows a summary of tasks processed by a workflow, and which tasks failed, successfully, and totally ran in the workflow.

Summaries allow you to quickly gain details about how a workflow ran for itself, or users, without going into further details in logs.  For a step by step guide on getting this information, see [Check the status of a workflow (Preview)](check-status-workflow.md)

## Users Summary information

User summaries allow you to view workflow information through the lens of users it has processed.

:::image type="content" source="media/lifecycle-workflow-history/users-summary-concept.png" alt-text="Screenshot of a workflow user summary.":::


Within the user summary you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of users processed by a workflow during the selected time frame.        |
|Successful     | The total number of successful users processed by a workflow during the selected time frame.        |
|Failed     | The total number of failed users processed by a workflow during the selected time frame.        |
|Total tasks     | The total number of tasks processed for users in a workflow during the selected time frame.        |
|Failed tasks     |  The total number of failed tasks processed for users in a workflow during the selected time frame.       |


User summaries allow you to filter based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the user processed. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Workflow execution type**: You can filter on workflow execution type such as **Scheduled** or **on-demand**
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the user was processed in a workflow.

For a complete guide on getting user processed summary information, see: [User workflow history using the Azure portal](check-status-workflow.md#user-workflow-history-using-the-azure-portal).


## Runs Summary

Runs summaries allow you to view workflow information through the lens of its run history

:::image type="content" source="media/lifecycle-workflow-history/runs-status-concept.png" alt-text="Screenshot of a workflow runs summary.":::

Within the runs summary you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of workflows that have run.         |
|Successful     | Workflows that successfully ran.        |
|Failed     | Workflows that failed to run.        |
|Failed tasks     | Workflows that ran with failed tasks.        |

Runs summaries allow you to filter based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the workflow run. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Workflow execution type**: You can filter on workflow execution type such as **Scheduled** or **On-demand**.
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the workflow ran.

For a complete guide on getting runs information, see: [Run workflow history using the Azure portal](check-status-workflow.md#run-workflow-history-using-the-azure-portal)


## Tasks summary

Task summaries allow you to view workflow information through the lens of its tasks.

:::image type="content" source="media/lifecycle-workflow-history/task-summary-concept.png" alt-text="Screenshot of a workflow task summary.":::

Within the tasks summary you're able to find the following information:


|Parameter  |Description  |
|---------|---------|
|Total Processed     | The total number of tasks processed by a workflow.         |
|Successful     | The number of successfully processed tasks by a workflow.       |
|Failed     | The number of failed processed tasks by a workflow.         |
|Unprocessed     | The number of unprocessed tasks by a workflow.        |

Task summaries allow you to filter based on:

- **Date**: You can filter a specific range from as short as 24 hours up to 30 days of when workflow ran.
- **Status**: You can filter a specific status of the workflow run. The supported statuses are: **Completed**, **In Progress**, **Queued**, **Canceled**, **Completed with errors**, and **Failed**. 
- **Completed date**: You can filter a specific range from as short as 24 hours up to 30 days of when the workflow ran.
- **Tasks**: You can filter based on specific task names.

Separating processing of the workflow from the tasks is important because, in a workflow, processing a user certain tasks could be successful, while others could fail. Whether or not a task runs after a failed task in a workflow depends on parameters such as enabling continue On Error, and their placement within the workflow. For more information, see [Common task parameters](lifecycle-workflow-tasks.md#common-task-parameters-preview).

## Next steps

- [Understanding Lifecycle Workflows](understanding-lifecycle-workflows.md)
- [Lifecycle Workflow templates](lifecycle-workflow-templates.md)

