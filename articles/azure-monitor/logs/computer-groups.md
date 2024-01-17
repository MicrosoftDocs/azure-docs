---
title: Computer groups in Azure Monitor log queries | Microsoft Docs
description: Computer groups in Azure Monitor allow you to scope log queries to a particular set of computers.  This article describes the different methods you can use to create computer groups and how to use them in a log query.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/14/2023

---

# Computer groups in Azure Monitor log queries
Computer groups in Azure Monitor allow you to scope [log queries](./log-query-overview.md) to a particular set of computers.  Each group is populated with computers using a query that you define.  When the group is included in a log query, the results are limited to records that match the computers in the group.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## Permissions required

| Action | Permissions required |
|:---|:---|
| Create a computer group from a log query. | `microsoft.operationalinsights/workspaces/savedSearches/write` permissions to the Log Analytics workspace where you want to create the computer group, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Run a computer group's log search or use a computer group in a log query. | `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example. |
| Delete a computer group. | `microsoft.operationalinsights/workspaces/savedSearches/delete` permissions to the Log Analytics workspace where the computer group is saved, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |

## Creating a computer group
You can create a computer group in Azure Monitor using the methods in the following table.  Details on each method are provided in the sections below. 

| Method | Description |
|:--- |:--- |
| Log query |Create a log query that returns a list of computers. |
| Active Directory | No longer supported |
| Configuration Manager | No longer supported |
| Windows Server Update Services | No longer supported |

### Log query
Computer groups created from a log query contain all of the computers returned by a query that you define.  This query is run every time the computer group is used so that any changes since the group was created is reflected.  

You can use any query for a computer group, but it must return a distinct set of computers by using `distinct Computer`.  Following is a typical example query that you could use for as a computer group.

```kusto
Heartbeat | where Computer contains "srv" | distinct Computer
```

Use the following procedure to create a computer group from a log search in the Azure portal.

1. Click **Logs** in the **Azure Monitor** menu in the Azure portal.
1. Create and run a query that returns the computers that you want in the group.
1. Click **Save** at the top of the screen, and select **Save as function** from the dropdown.
1. Select **Save as computer group**.
1. Provide values for each property for the computer group described in the table and click **Save**.

The following table describes the properties that define a computer group.

| Property | Description |
|:---|:---|
| Function name   | Name of the query to display in the portal. |
| Legacy category       | Category to organize the queries in the portal. |
| Parameters | Add a parameter for each variable in the function that requires a value when it's used. For more information, see [Function parameters](functions.md#function-parameters). |


### Active Directory
No longer supported

### Windows Server Update Service
No longer supported

### Configuration Manager
No longer supported

## Managing computer groups
You can view computer groups that were created from a log query from the **Legacy computer groups** menu item in your Log Analytics workspace in the Azure portal.  Select the **Saved Groups** tab to view the list of groups.  

Click the **Run query** icon for a group to run the group's log search that returns its members.  Click the **Delete** icon to delete the computer group.  You can't modify a computer group but instead must delete and then recreate it with the modified settings.

:::image type="content" source="media/computer-groups/configure-saved.png" alt-text="Screenshot of a Log Analytics resource in Azure with Legacy computer groups pane,  Saved Groups tab, Run query icon, and Delete icon highlighted." lightbox="media/computer-groups/configure-saved.png":::

## Using a computer group in a log query
You use a Computer group created from a log query in a query by treating its alias as a function, typically with the following syntax:

```kusto
Table | where Computer in (ComputerGroup)
```

For example, you could use the following to return UpdateSummary records for only computers in a computer group called mycomputergroup.

```kusto
UpdateSummary | where Computer in (mycomputergroup)
```

## Next steps
* Learn about [log queries](./log-query-overview.md) to analyze the data collected from data sources and solutions.