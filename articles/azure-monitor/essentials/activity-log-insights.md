---
title: Azure activity log insights
description: Learn how to monitor changes to resources and resource groups in an Azure subscription with Azure Monitor activity log insights.
author: guywi-ms
services: azure-monitor
ms.topic: how-to
ms.date: 08/24/2022
ms.author: guywild
ms.reviewer: orens

#customer-intent: As an IT manager, I want to understand how I can use activity log insights to monitor changes to resources and resource groups in an Azure subscription.
---

# Monitor changes to resources and resource groups with Azure Monitor activity log insights

Activity log insights provide you with a set of dashboards that monitor the changes to resources and resource groups in a subscription. The dashboards also present data about which users or services performed activities in the subscription and the activities' status. This article explains how to onboard and view activity log insights in the Azure portal.

Before you use activity log insights, you must [enable sending logs to your Log Analytics workspace](./diagnostic-settings.md).

## How do activity log insights work?

Azure Monitor stores all activity logs you send to a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) in a table called `AzureActivity`.

Activity log insights are a curated [Log Analytics workbook](../visualize/workbooks-overview.md) with dashboards that visualize the data in the `AzureActivity` table. For example, data might include which administrators deleted, updated, or created resources and whether the activities failed or succeeded.

:::image type="content" source="media/activity-log/activity-logs-insights-main-screen.png" lightbox= "media/activity-log/activity-logs-insights-main-screen.png" alt-text="Screenshot that shows activity log insights dashboards.":::

## View resource group or subscription-level activity log insights 

To view activity log insights at the resource group or subscription level:

1. In the Azure portal, select **Monitor** > **Workbooks**.
1. In the **Insights** section, select **Activity Logs Insights**.

    :::image type="content" source="media/activity-log/open-activity-log-insights-workbook.png" lightbox= "media/activity-log/open-activity-log-insights-workbook.png" alt-text="Screenshot that shows how to locate and open the Activity Logs Insights workbook on a scale level.":::

1. At the top of the **Activity Logs Insights** page, select:

    - One or more subscriptions from the **Subscriptions** dropdown.
    - Resources and resource groups from the **CurrentResource** dropdown.
    - A time range for which to view data from the **TimeRange** dropdown.

## View resource-level activity log insights

>[!Note]
> Activity log insights does not currently support Application Insights resources.

To view activity log insights at the resource level:

1. In the Azure portal, go to your resource and select **Workbooks**.
1. In the **Activity Logs Insights** section, select **Activity Logs Insights**.

    :::image type="content" source="media/activity-log/activity-log-resource-level.png" lightbox= "media/activity-log/activity-log-resource-level.png" alt-text="Screenshot that shows how to locate and open the Activity Logs Insights workbook on a resource level.":::

1. At the top of the **Activity Logs Insights** page, select a time range for which to view data from the **TimeRange** dropdown:
   
   * **Azure Activity Log Entries** shows the count of activity log records in each activity log category.
     
     :::image type="content" source="media/activity-log/activity-logs-insights-category-value.png" lightbox= "media/activity-log/activity-logs-insights-category-value.png" alt-text="Screenshot that shows Azure activity logs by category value.":::
    
   * **Activity Logs by Status** shows the count of activity log records in each status.
    
     :::image type="content" source="media/activity-log/activity-logs-insights-status.png" lightbox= "media/activity-log/activity-logs-insights-status.png" alt-text="Screenshot that shows Azure activity logs by status.":::
    
   * At the subscription and resource group level, **Activity Logs by Resource** and **Activity Logs by Resource Provider** show the count of activity log records for each resource and resource provider.
    
     :::image type="content" source="media/activity-log/activity-logs-insights-resource.png" lightbox= "media/activity-log/activity-logs-insights-resource.png" alt-text="Screenshot that shows Azure activity logs by resource.":::

## Next steps

Learn more about:

* [Activity logs](./activity-log.md)
* [The activity log event schema](activity-log-schema.md)

