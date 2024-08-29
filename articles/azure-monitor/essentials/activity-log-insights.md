---
title: Azure activity log and activity log insights
description: Learn how to monitor changes to resources and resource groups in an Azure subscription with Azure Monitor activity log insights.
author: guywi-ms
services: azure-monitor
ms.topic: how-to
ms.date: 12/11/2023
ms.author: guywild
ms.reviewer: orens

# Customer intent: As an IT manager, I want to understand how I can use the activity log and activity log insights to monitor changes to resources and resource groups in an Azure subscription.
---

# Use the Azure Monitor activity log and activity log insights

The Azure Monitor activity log is a platform log that provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started. This article provides information on how to view the activity log and send it to different destinations.

## View the activity log

You can access the activity log from most menus in the Azure portal. The menu that you open it from determines its initial filter. If you open it from the **Monitor** menu, the only filter is on the subscription. If you open it from a resource's menu, the filter is set to that resource. You can always change the filter to view all other entries. Select **Add Filter** to add more properties to the filter.
<!-- convertborder later -->
:::image type="content" source="./media/activity-log/view-activity-log.png" lightbox="./media/activity-log/view-activity-log.png" alt-text="Screenshot that shows the activity log." border="false":::

For a description of activity log categories, see [Azure activity log event schema](activity-log-schema.md#categories).

## Download the activity log

Select **Download as CSV** to download the events in the current view.
<!-- convertborder later -->
:::image type="content" source="media/activity-log/download-activity-log.png" lightbox="media/activity-log/download-activity-log.png" alt-text="Screenshot that shows downloading the activity log." border="false":::

### View change history

For some events, you can view the change history, which shows what changes happened during that event time. Select an event from the activity log you want to look at more deeply. Select the **Change history** tab to view any changes on the resource up to 30 minutes before and after the time of the operation.

:::image type="content" source="media/activity-log/change-history-event.png" lightbox="media/activity-log/change-history-event.png" alt-text="Screenshot that shows the Change history list for an event.":::

If any changes are associated with the event, you'll see a list of changes that you can select. Selecting a change opens the **Change history** page. This page displays the changes to the resource. In the following example, you can see that the VM changed sizes. The page displays the VM size before the change and after the change. To learn more about change history, see [Get resource changes](../../governance/resource-graph/how-to/get-resource-changes.md).

:::image type="content" source="media/activity-log/change-history-event-details.png" lightbox="media/activity-log/change-history-event-details.png" alt-text="Screenshot that shows the Change history page showing differences.":::

## Retention period

Activity log events are retained in Azure for *90 days* and then deleted. There's no charge for entries during this time regardless of volume. For more functionality, such as longer retention, create a diagnostic setting and route the entries to another location based on your needs. See the criteria in the preceding section.

## Activity log insights

Activity log insights provide you with a set of dashboards that monitor the changes to resources and resource groups in a subscription. The dashboards also present data about which users or services performed activities in the subscription and the activities' status. This article explains how to onboard and view activity log insights in the Azure portal.

Activity log insights are a curated [Log Analytics workbook](../visualize/workbooks-overview.md) with dashboards that visualize the data in the `AzureActivity` table. For example, data might include which administrators deleted, updated, or created resources and whether the activities failed or succeeded.

Azure Monitor stores all activity logs you send to a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) in a table called `AzureActivity`. Before you use activity log insights, you must [enable sending logs to your Log Analytics workspace](./diagnostic-settings.md).

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

