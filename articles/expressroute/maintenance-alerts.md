---
title: 'How to view and configure alerts for Azure ExpressRoute circuit maintenance'
description: Learn how to configure custom alerts for ExpressRoute circuit maintenance using the Service Health page in the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# How to view and configure alerts for Azure ExpressRoute circuit maintenance

ExpressRoute uses Azure Service Health to notify you of planned and upcoming ExpressRoute circuit maintenance. With Service Health, you can view planned and past maintenance in the Azure portal along with configuring alerts and notifications that best suits your needs. To learn more about Azure Service Health refer to [What is Azure Service Health?](../service-health/overview.md)

> [!NOTE]
> * During a maintenance activity or in case of unplanned events impacting one of the connection, Microsoft will prefer to use AS path prepending to drain traffic over to the healthy connection. You will need to ensure the traffic is able to route over the healthy path when path prepend is configure from Microsoft and required route advertisements are configured appropriately to avoid any service disruption. 
> * Terminating ExpressRoute BGP connections on stateful devices can cause issues with failover during planned or unplanned maintenances by Microsoft or your ExpressRoute Provider. You should test your set up to ensure your traffic will failover properly, and when possible, terminate BGP sessions on stateless devices.
> * During maintenance between the Microsoft edge and core network, BGP availability will appear down even if the BGP session between the customer edge and Microsoft edge remains up. For information about maintenance between the Microsoft edge and core network, make sure to have your maintenance alerts turned on and configured correctly using the guidance in this article.
>

## View planned maintenance

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to the Service Health page. 

    :::image type="content" source="./media/maintenance-alerts/search-service-health.png" alt-text="Screenshot of searching for Service Health page."::: 

1. Select **Planned maintenance** under *Active Events* on the left side of the page. On this page, you can view individual maintenance events by filtering on a target subscription, Azure region, and Azure service.

    :::image type="content" source="./media/maintenance-alerts/view-maintenance.png" alt-text="Screenshot of planned maintenance page in Service Health." lightbox="./media/maintenance-alerts/view-maintenance-expanded.png"::: 

1. Select **ExpressRoute** from the *Services* drop-down to only view ExpressRoute related maintenance. Then select an issue from the list to view the event summary. Select the **Issues updates** tab for more details about an on-going maintenance.

    :::image type="content" source="./media/maintenance-alerts/summary.png" alt-text="Screenshot of ExpressRoute maintenance summary." lightbox="./media/maintenance-alerts/summary-expanded.png":::

## View past maintenance

1. To view past maintenance events, select **Health history** under the *History* section on the left side of the page. 

    :::image type="content" source="./media/maintenance-alerts/health-history.png" alt-text="Screenshot of selecting Health history in Service Health." lightbox="./media/maintenance-alerts/health-history-expanded.png"::: 

1. On this page, you can review individual maintenance events by filtering on a target subscription and Azure Region. To further narrow the scope of health history events, you can select the health event type and define a past time range. To filer for planned ExpressRoute circuit maintenance, set the Health Event Type to **Planned Maintenance**.

    :::image type="content" source="./media/maintenance-alerts/past-maintenance.png" alt-text="Screenshot of past maintenance on Health history page." lightbox="./media/maintenance-alerts/past-maintenance-expanded.png"::: 

## Create alerts and notifications for maintenance events

1. Azure Service Health supports customized alerting for maintenance events. To configure an alert for ExpressRoute Circuit maintenance, navigate to **Health alerts** under the *Alerts* section on the left side of the page. Here you see a table of previously configured alerts.

1.  To create a new alert, select **Add service health alert** at the top of the page.

    :::image type="content" source="./media/maintenance-alerts/health-alerts.png" alt-text="Screenshot of selecting Health alerts in Service Health." lightbox="./media/maintenance-alerts/health-alerts-expanded.png"::: 

1. Select or enter the following information to create an alert rule.

    | Category | Settings | Value | 
    | --- | -------- | ----- |
    | **Condition** | Subscription | Select the target subscription. |
    |               | Service(s) | *ExpressRoute \ ExpressRoute Circuits* |
    |               | Region(s) | Select a region or leave as *Global* for health events for all regions.
    |               | Event type | Select *Planned maintenance*. |
    | **Actions** | Action group name | The *Action Group* determines the notification type and defines the audience that the notification is sent to. For assistance in creating and managing the Action Group, refer to [Create and manage action groups](../azure-monitor/alerts/action-groups.md) in the Azure portal. |
    | **Alert rule details** | Alert rule name | Enter a *name* to identify your alert rule. |
    |                        | Description | Provide a description for what this alert rule does. | 
    |                        | Save alert rule to resource group | Select a *resource group* to create this alert rule in. |
    |                        | Enable alert rule upon create | Check this box to enable this alert rule once created. |

1. Select **Create alert rule** to save your configuration.

    :::image type="content" source="./media/maintenance-alerts/create-alert-rule.png" alt-text="Screenshot of create alert rule page."::: 

## Next steps

* Learn more about [Azure ExpressRoute](expressroute-introduction.md), [Network Insights](../network-watcher/network-insights-overview.md), and [Network Watcher](../network-watcher/network-watcher-monitoring-overview.md)
* [Customize your metrics](expressroute-monitoring-metrics-alerts.md) and create a [Connection Monitor](../network-watcher/connection-monitor-overview.md)

