---
title: Manage your alert instances
description: The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days and allows you to manage your alert instances.
ms.topic: conceptual
ms.date: 08/03/2022
ms.reviewer: harelbr
---
# Manage your alert instances
The **Alerts** page summarizes all alert instances in all your Azure resources generated in the last 30 days. You can see all types of alerts from multiple subscriptions in a single pane. You can search for a specific alert and manage alert instances.

There are a few ways to get to the **Alerts** page:

- From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.  

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-monitor-menu.png" alt-text="Screenshot that shows Alerts on the Azure Monitor menu. ":::
  
- From a specific resource, go to the **Monitoring** section and select **Alerts**. The page that opens contains the alerts for the specific resource.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-resource-menu.png" alt-text="Screenshot that shows Alerts on the menu of a resource in the Azure portal.":::

## Alerts summary pane

The **Alerts** summary pane summarizes the alerts fired in the last 24 hours. You can filter the list of alert instances by **Time range**, **Subscription**, **Alert condition**, **Severity**, and more. If you selected a specific alert severity to open the **Alerts** page, the list is pre-filtered for that severity.

To see more information about a specific alert instance, select the alert instance to open the **Alert details** page.

:::image type="content" source="media/alerts-managing-alert-instances/alerts-page.png" alt-text="Screenshot that shows the Alerts summary page in the Azure portal.":::

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
