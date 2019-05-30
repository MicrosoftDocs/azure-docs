---
title: Log query scope in Azure Monitor Log Analytics | Microsoft Docs
description: This article provides a tutorial for using Log Analytics in the Azure portal to write queries.
services: log-analytics
author: bwren
manager: carmonm
ms.service: log-analytics
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: bwren
---

# Log query scope and time range in Azure Monitor Log Analytics
When you run a query in Log Analytics, the results will depend on the scope and the time range specified when the query is run. This article describes both the scope and time range 


## Understand the query scope
The scope of the query is displayed at the top left of the Log Analytics window. An initial scope is set when you start Log Analytics, and you can change the scope by clicking on it.

![Scope](media/scope/scope.png)

The scope is defined by one of four different types of Azure resource:

| Resource | Description | Default |
|:---|:---|:---|
| Log Analytics workspace | All records in that Log Analytics workspace. | Select **Logs** from the **Azure Monitor** menu or the **Log Analytics workspaces** menu.  |
| Application Insights application | All records in that Application Insights application. | Select **Analytics** from **Overview** page of Application Insights. |
| Azure resource | All records created by that resource in all Log Analytics workspaces that you can access.<br><br>For example, if the scope is a virtual machine then all records created by that virtual machine are included in the query. If the virtual machine writes log data to multiple workspaces, then all those workspaces will be included in the query.  | Select **Logs** from the resource menu. | 
| Azure resource that contains other resources | All records created by all resources contained by that resource.<br><br>For example, if the scope is a resource group then all records created by all resources in that resource group are included in the query. If the scope is an Azure subscription, then records created by all resources in that subscription are included. These records may span multiple workspaces. | Select **Logs** from **Resource Group** menu. No default for subscription. |

## Query limits
When the query scope includes multiple Log Analytics workspaces, it can significantly affect performance if those workspaces are spread across multiple Azure regions. In this case, your query may receive a warning or be blocked from running.

You query will receives a warning if the scope includes , it will still run but may take excessive time to complete.

![Query warning](media/scope/query-warning.png)

If your query is blocked, then you will be given the option to reduce the number of workspace regions. This refers to the region that the workspace is included in, not the region of the resource. Reduce the number of regions and attempt to run the query again.

![Query failed](media/scope/query-failed.png)

## Select a time range
By default, Log Analytics applies the _last 24 hours_ time range. To use a different range, select another value through the time picker and click **Run**. In addition to the preset values, you can use the _Custom time range_ option to select an absolute range for your query.

![Time picker](media/get-started-portal/time-picker.png)

When selecting a custom time range, the selected values are in UTC, which could be different than your local time zone.

If the query explicitly contains a filter for _TimeGenerated_, the time picker title will show _Set in query_. Manual selection will be disabled to prevent a conflict.


## Next steps

- Learn more about [writing Azure Monitor log queries](get-started-queries.md).
