---
title: Activity log insights 
description: View the overview of Azure Activity logs of your resources
author: osalzberg
services: azure-monitor
ms.topic: conceptual
ms.date: 03/14/2021
ms.author: guywild-ms

#Customer intent: As an IT administrator, I want to track changes to resource groups or specific resources in a subscription and to see which administrators or services make these changes. 
---

# Activity log insights (Preview)

Activity log insights let you view information about changes to resources and resource groups in a subscription. The dashboards also present data about which users or services performed activities in the subscription and the activities' status. This article explains how to view Activity log insights in the Azure portal.

Before using Activity log insights, you'll have to [enable sending logs to your Log Analytic workspace](./diagnostic-settings.md).

## How does Activity log insights work?

Activity logs you send to a [Log Analytics workspace](/articles/azure-monitor/logs/log-analytics-workspace-overview.md) are stored in a table called AzureActivity. 

Activity log insights is a curated [Log Analytics workbook](/articles/azure-monitor/visualize/workbooks-overview.md) with dashboards that let you visualize the data in the AzureActivity table. For example, which administrators deleted, updated or created resources, and whether the activities failed or succeeded.

![A screenshot showing Azure Activity logs insights dashboards](media/activity-log/activity-logs-insights-main.png)

## View Activity log insights

To view Activity log insights:

1. In the Azure portal, select **Monitor** > **Workbooks**.
1. Select **Activity Logs Insights** in the **Insights** section. 
1. Select a subscription, resources and resource groups, and a time range.

## General information

* Use the Azure activities by Category Value to view a count of Activity log records for each category.
 
![Azure Activity Logs by Category Value](media/activity-log/activity-logs-insights-categoryvalue.png)

* Use the Azure activities by Category status to view a count of Activity log records by each status.

![Azure Activity Logs by Status](media/activity-log/activity-logs-insights-status.png)

* If you are on a scale level - a subscription or a resource group, use the Azure activities by Resource and by resource provider to view a count of Activity log records for each selected resource and provider.

![Azure Activity Logs by Resource](media/activity-log/activity-logs-insights-resource.png)

## Next steps
Learn more about:
* [Platform logs](./platform-logs-overview.md)
* [Activity log event schema](activity-log-schema.md)
* [Creating a diagnostic setting to send Activity logs to other destinations](./diagnostic-settings.md)