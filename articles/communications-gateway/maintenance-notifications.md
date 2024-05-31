---
title: Check for Azure Communications Gateway upgrades and maintenance
description: Learn how to use Azure Service Health to check for upgrades and maintenance notifications for Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 04/10/2024

#CustomerIntent: As a customer managing Azure Communications Gateway, I want to learn about upcoming changes so that I can plan for service impact.
---

# Maintenance notifications for Azure Communications Gateway

We manage Azure Communications Gateway for you, including upgrades and maintenance activities. Planned upgrades and maintenance activities happen outside your business hours.

Azure Communications Gateway is integrated with [Azure Service Health](/azure/service-health/overview). We use Azure Service Health's service health notifications to inform you of upcoming upgrades and scheduled maintenance activities.

You must monitor Azure Service Health and enable alerts for notifications about planned maintenance.

## Viewing information about upgrades and maintenance activities

To view information about upcoming upgrades and maintenance activities, sign in to the [Azure portal](https://portal.azure.com/), and select **Monitor** followed by  **Service Health**. The Azure portal displays a list of notifications. Notifications about upgrades and other maintenance activities are listed under **Planned maintenance**.

:::image type="content" source="media/maintenance-notifications/planned-maintenance-list.png" alt-text="Screenshot of a list of planned maintenance notifications in the Azure portal." lightbox="media/maintenance-notifications/planned-maintenance-list.png":::

To view more information about an upgrade or other maintenance activity, select the notification. The notification provides more details, including the:

- Affected region or regions.
- Start and end times.
- Type of activity and/or change.
- Expected impact.
- Recommended actions for you.

:::image type="content" source="media/maintenance-notifications/maintenance-notification.png" alt-text="Screenshot of an upgrade notification in the Azure portal." lightbox="media/maintenance-notifications/maintenance-notification.png":::

For more on viewing notifications, see [View service health notifications by using the Azure portal](/azure/service-health/service-notifications).

## Setting up alerts

Alerts allow you to send your operations team proactive notifications of upcoming maintenance activities. For example, you can configure emails and/or SMS notifications. For an overview of alerts, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview).

You can configure alerts for planned maintenance notifications by selecting **Create service health alert** from the **Planned maintenance** pane for Service Health or by following [Set up alerts for service health notifications](/azure/service-health/alerts-activity-log-service-notifications-portal).

## Next step

> [!div class="nextstepaction"]
> [Set up alerts for service health notifications](/azure/service-health/alerts-activity-log-service-notifications-portal)
