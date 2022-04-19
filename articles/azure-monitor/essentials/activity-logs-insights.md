---
title: Activity logs insights 
description: View the overview of Azure Activity logs of your resources
author: osalzberg
services: azure-monitor
ms.topic: conceptual
ms.date: 04/14/2022
ms.author: guywild

#Customer intent: As an IT administrator, I want to track changes to resource groups or specific resources in a subscription and to see which administrators or services make these changes. 
---
 
# Activity logs insights (Preview)
Activity logs insights let you view information about changes to resources and resource groups in your Azure subscription. It uses information from the [Activity log](activity-log.md) to also present data about which users or services performed particular activities in the subscription. This includes which administrators deleted, updated or created resources, and whether the activities failed or succeeded. This article explains how to enable and use Activity log insights. 

## Enable Activity log insights
The only requirement to enable Activity log insights is to [configure the Activity log to export to a Log Analytics workspace](activity-log.md#send-to-log-analytics-workspace). Pre-built [workbooks](../visualize/workbooks-overview.md) curate this data, which is stored in the [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity) table in the workspace. 

:::image type="content" source="media/activity-log/activity-logs-insights-main.png" lightbox="media/activity-log/activity-logs-insights-main.png" alt-text="A screenshot showing Azure Activity logs insights dashboards":::

## View Activity logs insights - Resource group / Subscription level

To view Activity logs insights on a resource group or a subscription level:

1. In the Azure portal, select **Monitor** > **Workbooks**.
1. Select **Activity Logs Insights** in the **Insights** section. 

    :::image type="content" source="media/activity-log/open-activity-log-insights-workbook.png" lightbox="media/activity-log/open-activity-log-insights-workbook.png" alt-text="A screenshot showing how to locate and open the Activity logs insights workbook on a scale level":::

1. At the top of the **Activity Logs Insights** page, select:
    1. One or more subscriptions from the **Subscriptions** dropdown.
    1. Resources and resource groups from the **CurrentResource** dropdown.
    1. A time range for which to view data from the **TimeRange** dropdown.
## View Activity logs insights on any Azure resource

>[!Note]
> * Currently Applications Insights resources are not supported for this workbook.

To view Activity logs insights on a resource level:

1. In the Azure portal, go to your resource, select **Workbooks**.
1. Select **Activity Logs Insights** in the **Activity Logs Insights** section. 

    :::image type="content" source="media/activity-log/activity-log-resource-level.png" lightbox= "media/activity-log/activity-log-resource-level.png" alt-text="A screenshot showing how to locate and open the Activity logs insights workbook on a resource level":::

1. At the top of the **Activity Logs Insights** page, select:
    
    1. A time range for which to view data from the **TimeRange** dropdown.
    * **Azure Activity Logs Entries** shows the count of Activity log records in each [activity log category](./activity-log-schema.md#categories).
     
        :::image type="content" source="media/activity-log/activity-logs-insights-category-value.png" lightbox= "media/activity-log/activity-logs-insights-category-value.png" alt-text="Azure Activity Logs by Category Value":::
    
    * **Activity Logs by Status** shows the count of Activity log records in each status.
    
        :::image type="content" source="media/activity-log/activity-logs-insights-status.png" lightbox= "media/activity-log/activity-logs-insights-status.png" alt-text="Azure Activity Logs by Status":::
    
    * At the subscription and resource group level, **Activity Logs by Resource** and **Activity Logs by Resource Provider** show the count of Activity log records for each resource and resource provider.
    
        :::image type="content" source="media/activity-log/activity-logs-insights-resource.png" lightbox= "media/activity-log/activity-logs-insights-resource.png" alt-text="Azure Activity Logs by Resource":::
    
## Next steps
Learn more about:
* [Platform logs](./platform-logs-overview.md)
* [Activity log event schema](activity-log-schema.md)
* [Creating a diagnostic setting to send Activity logs to other destinations](./diagnostic-settings.md)