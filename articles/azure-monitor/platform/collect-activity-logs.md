---
title: Collect and analyze Azure activity logs in Log Analytics workspace | Microsoft Docs
description: You can use the Azure Activity Logs solution to analyze and search the Azure activity log across all your Azure subscriptions.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: dbac4c73-0058-4191-a906-e59aca8e2ee0
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/11/2019
ms.author: magoedte
---

# Collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor
The [Azure Activity Log](activity-logs-overview.md) provides insight into subscription-level events that have occurred in your Azure subscription. This article describes how to collect the Activity Log into a Log Analytics workspace and how to use the Activity Log Analytics [monitoring solution](../insights/solutions.md), which provides log queries and views for analyzing the log data. 

Connecting the Activity Log to a Log Analytics workspace provides the following benefits:

- Analyze the Activity Log from multiple Azure subscriptions.
- Store Activity Log entries for longer than 90 days.
- Correlate Activity Log entries with other monitoring data collected by Azure Monitor.
- Use [log queries](../log-query/log-query-overview.md) to perform complex analysis on Activity Log entries.

## Connect Activity Log to Log Analytics workspace
An Activity Log can be connected to only one workspace, but a single workspace can be connected to the Activity Log for multiple subscriptions in the same Azure tenant. For collection across multiple tenants, see [Collect Azure Activity Logs into a Log Analytics workspace across subscriptions in different Azure Active Directory tenants](collect-activity-logs-subscriptions.md).

Use the following procedure to connect the Activity Log to your Log Analytics workspace:

1. From the **Log Analytics workspaces** menu in the Azure portal, select the workspace to collect the Activity Log.
1. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
1. Click the subscription you want to connect.

    ![Workspaces](media/activity-log-export/workspaces.png)

1. Click **Connect** to connect the Activity log in the subscription to the selected workspace. If the subscription is already connected to another workspace, click **Disconnect** first to disconnect it.

    ![Connect Workspaces](media/activity-log-export/connect-workspace.png)


## Activity Logs Analytics solution
When you connect your Activity Log to a Log Analytics workspace, entries will be collected and available for log queries. Install the Azure Log Analytics monitoring solution to your workspace, to add 

### Install the solution
Use the procedure in [Install a monitoring solution](../insights/solutions.md#install-a-monitoring-solution) to install the **Activity Log Analytics** solution.

### Use the solution
Monitoring solutions are accessed from the **Monitor** menu in the Azure portal. Select **More** in the **Insights** section. 
When you add the Activity Log Analytics solution to your workspace, the **Azure Activity Logs** tile is added to your **Overview** dashboard. This tile displays a count of the number of Azure activity records for the Azure subscriptions that the solution has access to.

![Azure Activity Logs tile](./media/collect-activity-logs/azure-activity-logs-tile.png)


Click the **Azure Activity Logs** tile to open the **Azure Activity Logs** dashboard. The dashboard includes the blades in the following table. Each blade lists up to 10 items matching that blade's criteria for the specified scope and time range. You can run a log search that returns all records by clicking **See all** at the bottom of the blade or by clicking the blade header.

Activity log data only appears *after* you've configured your activity logs to go to the solution, so you can't view data before then.

| Blade | Description |
| --- | --- |
| Azure Activity Log Entries | Shows a bar chart of the top Azure activity log entry record totals for the date range that you have selected and shows a list of the top 10 activity callers. Click the bar chart to run a log search for <code>AzureActivity</code>. Click a caller item to run a log search returning all activity log entries for that item. |
| Activity Logs by Status | Shows a doughnut chart for Azure activity log status for the date range that you have selected. Also shows a list a list of the top ten status records. Click the chart to run a log search for <code>AzureActivity &#124; summarize AggregatedValue = count() by ActivityStatus</code>. Click a status item to run a log search returning all activity log entries for that status record. |
| Activity Logs by Resource | Shows the total number of resources with activity logs and lists the top ten resources with record counts for each resource. Click the total area to run a log search for <code>AzureActivity &#124; summarize AggregatedValue = count() by Resource</code>, which shows all Azure resources available to the solution. Click a resource to run a log search returning all activity records for that resource. |
| Activity Logs by Resource Provider | Shows the total number of resource providers that produce activity logs and lists the top ten. Click the total area to run a log search for <code>AzureActivity &#124; summarize AggregatedValue = count() by ResourceProvider</code>, which shows all Azure resource providers. Click a resource provider to run a log search returning all activity records for the provider. |

![Azure Activity Logs dashboard](./media/collect-activity-logs/activity-log-dash.png)

## Next steps

- Create an [alert](../platform/alerts-metric.md) when a specific activity happens.
- Use [Log Search](../log-query/log-query-overview.md) to view detailed information from your activity logs.
