---
title: Monitor Azure Event Grid message delivery
description: This article describes how to use the Azure portal to see the status of the delivery of Azure Event Grid messages.
services: event-grid
author: spelluru
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: spelluru
---

# Monitor Event Grid message delivery 

This article describes how to use the portal to see the status of event deliveries.

Event Grid provides durable delivery. It delivers each message at least once for each subscription. Events are sent to the registered webhook of each subscription immediately. If a webhook doesn't acknowledge receipt of an event within 60 seconds of the first delivery attempt, Event Grid retries delivery of the event.

For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).

## Delivery metrics

The portal displays metrics for the status of delivering event messages.

For topics, here are some of the metrics:

* **Publish Succeeded**: Event successfully sent to the topic, and processed with a 2xx response.
* **Publish Failed**: Event sent to the topic but rejected with an error code.
* **Unmatched**: Event successfully published to the topic, but not matched to an event subscription. The event was dropped.

For subscriptions, here are some of the metrics:

* **Delivery Succeeded**: Event successfully delivered to the subscription's endpoint, and received a 2xx response.
* **Delivery Failed**: Every time the service tries to deliver and the event handler doesn't return a success 2xx code, the **Delivery Failed** counter is incremented. If we attempt to deliver the same event multiple times and fail, the **Delivery Failed** counter is incremented for each failure.
* **Expired Events**: Event was not delivered and all retry attempts were sent. The event was dropped.
* **Matched Events**: Event in the topic was matched by the event subscription.

    > [!NOTE]
    > For the full list of metrics, see [Metrics supported by Azure Event Grid](metrics.md).

## View custom topic metrics

If you've published a custom topic, you can view the metrics for it. 

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the topic, type **Event Grid Topics**, and then select **Event Grid Topics** from the drop-down list. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-event-grid-topics.png" alt-text="Search for and select Event Grid Topics":::
3. Select your custom topic from the list of topics. 

    :::image type="content" source="./media/monitor-event-delivery/select-custom-topic.png" alt-text="Select your custom topic":::
4. View the metrics for the custom event topic on the **Event Grid Topic** page. In the following image, the **Essentials** section that shows the resource group, subscription etc. is minimized. 

    :::image type="content" source="./media/monitor-event-delivery/custom-topic-metrics.png" alt-text="View event metrics":::

You can create charts with supported metrics by using the **Metrics** tab of the **Event Grid Topic** page.

:::image type="content" source="./media/monitor-event-delivery/topics-metrics-page.png" alt-text="Topic - Metrics page":::

To learn more about metrics, see [Metrics in Azure Monitor](../azure-monitor/platform/data-platform-metrics.md)


## View subscription metrics
1. Navigate to the **Event Grid Topic** page by following steps from the previous section. 
2. Select the subscription from the bottom pane as shown in the following example. 

    :::image type="content" source="./media/monitor-event-delivery/select-event-subscription.png" alt-text="Select event subscription":::    

    You can also search for **Event Grid Subscriptions** in the search bar in the Azure portal, select **Topic Type**, **Subscription**, and **Location** to see an event subscription. 

    :::image type="content" source="./media/monitor-event-delivery/event-subscriptions-page.png" alt-text="Select event subscription from Event Grid Subscriptions page":::        
3. See the metrics for the subscription on the home page for the subscription in a chart. You can see **General**, **Error**, **Latency**, and **Dead-Letter** metrics for past 1 hour, 6 hours, 12 hours, 1 day, 7 days, or 30 days. 

    :::image type="content" source="./media/monitor-event-delivery/subscription-home-page-metrics.png" alt-text="Metrics on the subscription home page":::    


## Set alerts
You can set alerts on the topic and domain level metrics for custom topics and event domains. On the **Event Grid Topic** page for your topic, select **Alerts** from the left had resource menu in order to view, manage, and create alert rules. [Learn more about Azure Monitor Alerts](../azure-monitor/platform/alerts-overview.md)

:::image type="content" source="./media/monitor-event-delivery/select-alerts.png" alt-text="Alerts page":::
![View event metrics]()

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
