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

Before using Activity log insights, you'll have to [enable sending logs to your Log Analytics workspace](./diagnostic-settings.md).

## How does Activity log insights work?

Activity logs you send to a [Log Analytics workspace](/articles/azure-monitor/logs/log-analytics-workspace-overview.md) are stored in a table called AzureActivity. 

Activity log insights are a curated [Log Analytics workbook](/articles/azure-monitor/visualize/workbooks-overview.md) with dashboards that visualize the data in the AzureActivity table. For example, which administrators deleted, updated or created resources, and whether the activities failed or succeeded.

:::image type="content" source="media/activity-log/activity-logs-insights-main.png" alt-text="A screenshot showing Azure Activity logs insights dashboards":::

## View Activity log insights - Resource group / Subscription level

To view Activity log insights on a resource group or a subscription level:

1. In the Azure portal, select **Monitor** > **Workbooks**.
1. Select **Activity Logs Insights** in the **Insights** section. 

    :::image type="content" source="media/activity-log/open-activity-log-insights-workbook.png" alt-text="A screenshot showing how to locate and open the Activity logs insights workbook":::

1. At the top of the **Activity Logs Insights** page, select:
    1. One or more subscriptions from the **Subscriptions** dropdown.
    1. Resources and resource groups from the **CurrentResource** dropdown.
    1. A time range for which to view data from the **TimeRange** dropdown.
## View Activity log insights on any Azure resource

>[!Note]
> * Currently Applications Insights resources are not supported for this workbook.

To view Activity log insights on a resource level:

1. In the Azure portal, go to your resource, select **Workbooks**.
1. Select **Activity Logs Insights** in the **Activity Logs Insights** section. 

    :::image type="content" source="media/activity-log/activity-log-resource-level.png" alt-text="A screenshot showing how to locate and open the Activity logs insights workbook":::

1. At the top of the **Activity Logs Insights** page, select:
    
    1. A time range for which to view data from the **TimeRange** dropdown.
    * **Azure Activity Log Entries** shows the count of Activity log records in each [activity log category](/articles/azure-monitor/essentials/activity-log-schema#categories).
     
        :::image type="content" source="media/activity-log/activity-logs-insights-categoryvalue.png" alt-text="Azure Activity Logs by Category Value":::
    
    * **Activity Logs by Status** shows the count of Activity log records in each status.
    
        :::image type="content" source="media/activity-log/activity-logs-insights-status.png" alt-text="Azure Activity Logs by Status":::
    
    * At the subscription and resource group level, **Activity Logs by Resource** and **Activity Logs by Resource Provider** show the count of Activity log records for each resource and resource provider.
    
        :::image type="content" source="media/activity-log/activity-logs-insights-resource.png" alt-text="Azure Activity Logs by Resource":::
    
## Next steps
Learn more about:
* [Platform logs](./platform-logs-overview.md)
* [Activity log event schema](activity-log-schema.md)
* [Creating a diagnostic setting to send Activity logs to other destinations](./diagnostic-settings.md)