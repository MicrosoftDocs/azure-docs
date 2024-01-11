---
title: Manage your alert instances
description: The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days and allows you to manage your alert instances.
ms.topic: conceptual
ms.date: 07/11/2023
ms.reviewer: harelbr
---
# Manage your alert instances
The **Alerts** page summarizes all alert instances in all your Azure resources generated in the last 30 days. Alerts are stored for 30 days and are deleted after the 30-day retention period. 
For stateful alerts, while the alert itself is deleted after 30 days, and is not viewable on the alerts page, the alert condition is stored until the alert is resolved, to prevent firing another alert, and so that notifications can be sent when the alert is resolved. For more information, see [Alerts and state](alerts-overview.md#alerts-and-state).

You can get to the **Alerts** page in a few ways:

- From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.  

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-monitor-menu.png" alt-text="Screenshot that shows Alerts on the Azure Monitor menu. ":::
  
- From a specific resource, go to the **Monitoring** section and select **Alerts**. The page that opens contains the alerts for the specific resource.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-resource-menu.png" alt-text="Screenshot that shows Alerts on the menu of a resource in the Azure portal.":::

## Alerts summary pane

The **Alerts** summary pane summarizes the alerts fired in the last 24 hours. You can filter the list of alert instances by **Time range**, **Subscription**, **Alert condition**, **Severity**, and more. If you selected a specific alert severity to open the **Alerts** page, the list is pre-filtered for that severity.

To see more information about a specific alert instance, select the alert instance to open the **Alert details** page.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-page.png" alt-text="Screenshot that shows the Alerts summary page in the Azure portal.":::



## View alerts as a timeline (preview)

You can see your alerts in a timeline view. In this view, you can see the number of alerts fired in a specific time range. 

To see the alerts in a timeline view, select **View as timeline** at the top of the Alerts summary page.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-view-timeline.png" alt-text="Screenshot that shows the view timeline button in the Alerts summary page in the Azure portal.":::

The timeline shows you which resource the alerts were fired on to give you context of the alert in your Azure hierarchy. The alerts are grouped by the time they were fired. You can filter the alerts by severity, resource, and more. You can also select a specific time range to see the alerts fired in that time range.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-timeline.png" alt-text="Screenshot that shows the Alerts timeline page in the Azure portal.":::
## Alert details page

The **Alert details** page provides more information about the selected alert:

 - To change the user response to the alert, select **Change user response**.
 - To see all closed alerts, select the **History** tab.  

:::image type="content" source="media/alerts-managing-alert-instances/alerts-details-page.png" alt-text="Screenshot that shows the Alerts details page in the Azure portal.":::

## Manage your alerts programmatically

You can query your alerts instances to create custom views outside of the Azure portal or to analyze your alerts to identify patterns and trends.

We recommend that you use [Azure Resource Graph](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade) with the `AlertsManagementResources` schema to manage alerts across multiple subscriptions. For a sample query, see [Azure Resource Graph sample queries for Azure Monitor](../resource-graph-samples.md).

You can use Resource Graph:
 - With [Azure PowerShell](/powershell/module/az.monitor/).
 - In the Azure portal.

You can also use the [Alert Management REST API](/rest/api/monitor/alertsmanagement/alerts) for lower-scale querying or to update fired alerts.

## Next steps

- [Learn about Azure Monitor alerts](./alerts-overview.md)
- [Create a new alert rule](alerts-log.md)
