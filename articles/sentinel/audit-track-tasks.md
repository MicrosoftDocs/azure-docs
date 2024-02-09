---
title: Audit and track changes to incident tasks in Microsoft Sentinel
description: This article explains how you, as a SOC manager, can audit the history of Microsoft Sentinel incident tasks, and track changes to them, in order to gauge your task assignments and their contribution to your SOC's efficiency and effectiveness.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/08/2023
---

# Audit and track changes to incident tasks in Microsoft Sentinel

[Incident tasks](incident-tasks.md) ensure comprehensive and uniform treatment of incidents across all SOC personnel. Task lists are typically defined according to determinations made by senior analysts or SOC managers, and put into practice using automation rules or playbooks.

Your analysts can see the list of tasks they need to perform for a particular incident on the incident details page, and mark them complete as they go. Analysts can also create their own tasks on the spot, manually, right from within the incident.

This article explains how you, as a SOC manager, can audit the history of Microsoft Sentinel incident tasks, and track the changes made to them throughout their life cycle, in order to gauge the efficacy of your task assignments and their contribution to your SOC's efficiency and proper functioning.

## Structure of Tasks array in the SecurityIncident table

The *SecurityIncident* table is an audit table&mdash;it stores not the incidents themselves, but rather records of the life of an incident: its creation and any changes made to it. Any time an incident is created or a change is made to an incident, a record is generated in this table showing the now-current state of the incident.

The addition of tasks details to the schema of this table allows you to audit tasks in greater depth.

The detailed information added to the **Tasks** field consists of key-value pairs taking the following structure:

| Key | Value description |
| --- | ----- |
| **createdBy** | The identity that created the task:<br>**- email**: email address of identity<br>**- name**: name of the identity<br>**- objectId**: GUID of the identity<br>**- userPrincipalName**: UPN of the identity |
| **createdTimeUtc** | Time the task was created, in UTC. |
| **lastCompletedTimeUtc** | Time the task was marked complete, in UTC.
| **lastModifiedBy** | The identity that last modified the task:<br>**- email**: email address of identity<br>**- name**: name of the identity<br>**- objectId**: GUID of the identity<br>**- userPrincipalName**: UPN of the identity |
| **lastModifiedTimeUtc** | Time the task was last modified, in UTC.
| **status** | Current status of the task: New, Completed, Deleted. |
| **taskId** | Resource ID of the task. |
| **title** | Friendly name given to the task by its creator. |

## View incident tasks in the SecurityIncident table

Apart from the **Incident tasks workbook**, you can audit task activity by querying the *SecurityIncident* table in **Logs**. The rest of this article shows you how to do this, as well as how to read and understand the query results to get task activity information.

1. In the **Logs** page, enter the following query in the query window and run it. This query will return all the incidents that have any tasks assigned.

    ```kusto
    SecurityIncident
    | where array_length( Tasks) > 0
    ```

    You can add any number of statements to the query to filter and narrow down the results. To demonstrate how to view and understand the results, we're going to add statements to filter the results so that we only see the tasks for a single incident, and we'll also add a `project` statement so that we see only those fields that will be useful for our purposes, without a lot of clutter.

    [Learn more about using Kusto Query Language](kusto-overview.md).

    ```kusto
    SecurityIncident
    | where array_length( Tasks) > 0
    | where IncidentNumber == "405211"
    | sort by LastModifiedTime desc 
    | project IncidentName, Title, LastModifiedTime, Tasks
    ```

1. Let's look at the most recent record for this incident, and find the list of tasks associated with it. 
    1. Select the expander next to the top row in the query results (which have been sorted in descending order of recency).

        :::image type="content" source="media/audit-track-tasks/incident-with-tasks-query-1.png" alt-text="Screenshot of query results showing an incident with its tasks." lightbox="media/audit-track-tasks/incident-with-tasks-query-1.png":::

    1. The *Tasks* field is an array of the current state of all the tasks in this incident. Select the expander to view each item in the array in its own row.

        :::image type="content" source="media/audit-track-tasks/incident-with-tasks-query-2.png" alt-text="Screenshot of query results showing an incident with its tasks expanded." lightbox="media/audit-track-tasks/incident-with-tasks-query-2.png":::

    1. Now you see that there are two tasks in this incident. Each one is represented in turn by an expandable array. Select a single task's expander to view its information.

        :::image type="content" source="media/audit-track-tasks/incident-with-tasks-query-3.png" alt-text="Screenshot of query results showing an incident with a single task expanded." lightbox="media/audit-track-tasks/incident-with-tasks-query-3.png":::

    1. Here you see the details for the first task in the array ("0" being the index position of the task in the array). The *title* field shows the name of the task as displayed in the incident.

### View tasks added to the list

1. Let's add a task to the incident, and then we'll come back here, run the query again, and see the changes in the results.

    1. On the **Incidents** page, enter the incident ID number in the Search bar.
    1. Open the incident details page and select **Tasks** from the toolbar.
    1. Add a new task, give it the name "This task is a test task!", then select **Save**. The last task shown below is what you should end up with:

        :::image type="content" source="media/audit-track-tasks/incident-task-list-task-added.png" alt-text="Screenshot shows incident tasks panel.":::

1. Now let's return to the **Logs** page and run our query again. 

    In the results you'll see that there's a **new record in the table** for this same incident (note the timestamps). Expand the record and you'll see that while the record we saw before had two tasks in its *Tasks* array, the new one has three. The newest task is the one we just added, as you can see by its title.

    :::image type="content" source="media/audit-track-tasks/incident-with-tasks-query-5.png" alt-text="Screenshot of query results showing an incident with its newly created task." lightbox="media/audit-track-tasks/incident-with-tasks-query-5.png":::

### View status changes to tasks

Now, if we go back to that new task in the incident details page and mark it as complete, and then come back to **Logs** and rerun the query again, we'll see yet another new record for the same incident, this time showing our task's new status as **Completed**.

:::image type="content" source="media/audit-track-tasks/incident-with-tasks-query-6.png" alt-text="Screenshot of query results showing an incident task with its new status." lightbox="media/audit-track-tasks/incident-with-tasks-query-5.png":::

### View deletion of tasks

Let's go back to the task list in the incident details page and delete the task we added earlier.

When we come back to **Logs** and run the query yet again, we'll see another new record, only this time the status for our task&mdash;the one titled "This task is a test task!"&mdash;will be **Deleted**.

**However**&mdash; once the task has appeared one such time in the array (with a **Deleted** status), it will no longer appear in the **Tasks** array in new records for that incident in the **SecurityIncident** table. The existing records, like those we saw above, will continue to preserve the evidence that this task once existed.

## View active tasks belonging to a closed incident

The following query allows you to see if an incident was closed but not all its assigned tasks were completed. This knowledge can help you verify that any remaining loose ends in your investigation were brought to a conclusion&mdash;all relevant parties were notified, all comments were entered, all responses were verified, and so on.

```kusto
SecurityIncident
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| where Status == 'Closed'
| mv-expand Tasks
| evaluate bag_unpack(Tasks)
| summarize arg_max(lastModifiedTimeUtc, *) by taskId
| where status !in ('Completed', 'Deleted')
| project TaskTitle = ['title'], TaskStatus = ['status'], createdTimeUtc, lastModifiedTimeUtc = column_ifexists("lastModifiedTimeUtc", datetime(null)), TaskCreator = ['createdBy'].name, lastModifiedBy, IncidentNumber, IncidentOwner = Owner.userPrincipalName
| order by lastModifiedTimeUtc desc
```


## Next steps

- Learn more about [incident tasks](incident-tasks.md).
- Learn how to [investigate incidents](investigate-cases.md).
- Learn how to add tasks to groups of incidents automatically using [automation rules](create-tasks-automation-rule.md) or [playbooks](create-tasks-playbook.md), and [when to use which](incident-tasks.md#use-automation-rules-or-playbooks-to-add-tasks).
- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) and how to [create them](./create-manage-use-automation-rules.md).
- Learn more about [playbooks](automate-responses-with-playbooks.md) and how to [create them](tutorial-respond-threats-playbook.md).
