---
title: Lifecycle Workflow History
description: Conceptual article about Lifecycle Workflows reporting and history capabilities
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 08/01/2022
ms.custom: template-concept 
---


# Lifecycle Workflows history (Preview)



Workflows created using Lifecycle Workflows allow for the automation of lifecycle task for users no matter where they fall in the Joiner-Mover-Leaver (JML) model of their identity lifecycle in your organization. Making sure workflows are processed correctly is an important part of managing your organization's governance policy. Workflows that are not processed correctly for users can lead to many issues in terms of security and compliance. To make sure you always know who was processed in workflows you run, Lifecycle Workflows introduces the reporting features of runs and user summary. In this article you will learn the difference between the two, and when you would use each when getting more information about how your workflows were utilized for users in your organization.



## Lifecycle Workflows History types

When looking at the history of your workflow, Lifecycle Workflows allow you to view History in two separate ways, through user processed summaries or through runs summaries. User processed summaries allow you to view specific users, and which tasks ran for them. If you want a more workflow-centric version of the history of the workflow, you can view the runs information. This gives you history from the view of the workflow instance being run at that point in time. In this way you are still able to see failed, and total, task information, but as the information is centered around the run instance itself, on the front is information dedicated to the workflow such as start and complete time.

## Basic Summary information

On the user summary page you are able to see a general summary of users processed.
:::image type="content" source="media/lifecycle-workflow-history/lcw-user-summary-concept.png" alt-text="user summary page":::

The cards at the top of the user history page give you a summary in count form. These are:


|Summary  |Description  |
|---------|---------|
|Total Processed     | The total number of users processed by the workflow. Includes both failed and successful task processing.         |
|Successful     |  The total number of successfully processed users by a workflow. A user successfully processed means all of the tasks of the workflow processing the user succeeded.    |
|Failed     | The total number of failed processes for users. Even if some tasks of a workflow are successful a failure of any will note a failed process.     |
|Total tasks     | The total number tasks processed for users.       |
|Failed tasks     | The total number of failed tasks for users.        |

Separating processing of the workflow from the tasks is important because in a workflow processing a user certain tasks could be successful, while others could fail. Whether or not a task runs after a failed task in a workflow depends on parameters such as continue On Error, and their placement within the workflow. For more information, see [Common task parameters](lifecycle-workflow-tasks.md#common-task-parameters-preview).



## Detailed summary information 

While basic information is good for total counts, you may need to find information about how specific users have been processed. Below the basic user summary cards you are able to find detailed information about the users processed by the workflow. This detailed information breaks down information given in the summary cards by users so that they can be audited, and you can quickly figure out who you would have to run a workflow for again. 


The detailed information given for users processed are as follows:

- A user name 
- The user's object ID
- The start date where the workflow began to process for the user
- The end date when the workflow finished processing the user
- A selectable list of total, failed, and unprocessed tasks.
:::image type="content" source="media/lifecycle-workflow-history/lcw-total-tasks-concept.png" alt-text="lcw total task more information":::


From the above list you are able to see which specific tasks succeeded or failed for each user.


As far as runs goes the detailed information are:

- Start date of the workflow instance.
- Complete date of the workflow instance.
- status of the workflow instance
- Failed users
- Failed tasks
- Unprocessed Tasks

## Filtering user history information 


While detailed information is good to have for specific user information, you may need to dive further into the information. Lifecycle Workflows allows you to filter the detailed information based on start date, complete date, status, or execution type.

### Filtering based on start and completed date


When filtering workflow history based on either start or completed date you can filter based on 3 default intervals:

:::image type="content" source="media/lifecycle-workflow-history/lcw-user-summary-concept-date.png" alt-text="lcw filter by date concept":::

- 7 days
- 14 days 
- 30 days

You can also choose to filter date information based on a custom interval between 1 and 30 days.



> [!NOTE]
> By default workflow history is stored for up to 30 days. To get workflow information older than 30 days, such as information about tasks it had at a given date, see [Workflow versioning](lifecycle-workflow-versioning.md).


#### Filtering based on status 

Another way to filter workflow is through the summary status. Whenever a user is processed, or a workflow runs, you get an update of that specific event. Filtering based on status allows you to quickly focus on only workflow processes that behaved in a specific way.
:::image type="content" source="media/lifecycle-workflow-history/lcw-runs-status-concept.png" alt-text="lcw runs status information":::


You can filter based on the following criteria:


|Status  |Description  |
|---------|---------|
|In Progress     | The workflow is currently in progress.        |
|Failed     | The workflow completed with one or more failed tasks.        |
|Complete     | The workflow processed with no failed tasks.     |
|Canceled     | The workflow was canceled in this instance.        |
|Queued     | The workflow is waiting to run        |
|Complete with errors     | Workflow completed with non failed task errors.      |


## Filtering based on execution type

The final way you can filter user summary and run information is by execution type. To understand why this is significant it is important to note the different ways in which a workflow can run. 

Workflows created using Lifecycle Workflows can run in two ways:

- **Scheduled**: A workflow can run on a schedule. A set time in which it will always run as long as execution conditions are met. For more information on the execution conditions which are required for a scheduled workflow to run, see [Execution Conditions](lifecycle-workflows-concept-parts.md#execution-conditions). By default workflows will run every three hours.
- **On-demand**:A workflow can also run on-demand. This allows a workflow to be run immediately irrespective of its scheduled properties. As the workflow runs immediately, execution conditions do not have to be met for a user to be processed by a workflow in this manner. For a step by step guide on running a workflow on-demand, see [Run a workflow on-demand](on-demand-workflow.md).


## Next steps

- [Parts of lifecycle workflows](lifecycle-workflows-concept-parts.md)
- [Lifecycle Workflow templates](lifecycle-workflow-templates.md)

