---
title: View Azure Event Grid metrics and set alerts
description: This article describes how to use the Azure portal to view metrics for Azure Event Grid topics and subscriptions, and create alerts on them. 
services: event-grid
author: spelluru
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: spelluru
---

# Monitor Event Grid message delivery 
This article describes how to use the portal to see metrics for Event Grid topics and subscriptions, and create alerts on them. 

## Metrics

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

For example, see the metrics chart for the **Published Events** metric.

:::image type="content" source="./media/monitor-event-delivery/custom-topic-metrics-example.png" alt-text="Published events metric":::


## View subscription metrics
1. Navigate to the **Event Grid Topic** page by following steps from the previous section. 
2. Select the subscription from the bottom pane as shown in the following example. 

    :::image type="content" source="./media/monitor-event-delivery/select-event-subscription.png" alt-text="Select event subscription":::    

    You can also search for **Event Grid Subscriptions** in the search bar in the Azure portal, select **Topic Type**, **Subscription**, and **Location** to see an event subscription. 

    :::image type="content" source="./media/monitor-event-delivery/event-subscriptions-page.png" alt-text="Select event subscription from Event Grid Subscriptions page":::        

    For custom topics, select **Event Grid Topics** as **Topic Type**. For system topics, select the type of the Azure resource, for example, **Storage Accounts (Blob, GPv2)**. 
3. See the metrics for the subscription on the home page for the subscription in a chart. You can see **General**, **Error**, **Latency**, and **Dead-Letter** metrics for past 1 hour, 6 hours, 12 hours, 1 day, 7 days, or 30 days. 

    :::image type="content" source="./media/monitor-event-delivery/subscription-home-page-metrics.png" alt-text="Metrics on the subscription home page":::    

## View system topic metrics

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the topic, type **Event Grid System Topics**, and then select **Event Grid System Topics** from the drop-down list. 

    :::image type="content" source="./media/monitor-event-delivery/search-system-topics.png" alt-text="Search for and select Event Grid System Topics":::
3. Select your system topic from the list of topics. 

    :::image type="content" source="./media/monitor-event-delivery/select-system-topic.png" alt-text="Select your system topic":::
4. View the metrics for the system topic on the **Event Grid System Topic** page. In the following image, the **Essentials** section that shows the resource group, subscription etc. is minimized. 

    :::image type="content" source="./media/monitor-event-delivery/system-topic-overview-metrics.png" alt-text="View system topic metrics on the overview page":::

You can create charts with supported metrics by using the **Metrics** tab of the **Event Grid Topic** page.

:::image type="content" source="./media/monitor-event-delivery/system-topic-metrics-page.png" alt-text="System Topic - Metrics page":::

To learn more about metrics, see [Metrics in Azure Monitor](../azure-monitor/platform/data-platform-metrics.md)


## Set alerts
You can set alerts on metrics for topics and domains in the Azure portal. 

The following procedure shows you how to create an alert on **dead-lettered events** metric for a custom topic. In this example, an email is sent to the Azure resource group owner when the dead-lettered event count for a topic goes above 10. 

1. On the **Event Grid Topic** page for your topic, select **Alerts** on the left menu, and then select **+New alert rule**. 

    :::image type="content" source="./media/monitor-event-delivery/new-alert-button.png" alt-text="Alerts page - New alert rule button":::
    
    
    You can also create alerts by using the **Metrics** page. The steps are similar. 

    :::image type="content" source="./media/monitor-event-delivery/metric-page-create-alert-button.png" alt-text="Metrics page - Create alert button":::   
    
2. On the **Create alert rule** page, verify that your topic is selected for the resource. Then, click **Select condition**. 

    :::image type="content" source="./media/monitor-event-delivery/alert-select-condition.png" alt-text="Alerts page - select condition":::    
3. On the **Configure signal logic** page, follow these steps:
    1. Select a metric or an activity log entry. In this example, **Dead Lettered Events** is selected. 

        :::image type="content" source="./media/monitor-event-delivery/select-dead-lettered-events.png" alt-text="Select dead-lettered events":::        
    2. Select dimensions (optional). 
        
        :::image type="content" source="./media/monitor-event-delivery/configure-singal-logic.png" alt-text="Configure signal logic":::        
    3. Scroll down. In the **Alert logic** section, select an **Operator**, **Aggregation type**, and enter a **Threshold value**, and select **Done**. In this example, an alert is triggered when the total dead lettered events count is greater than 10. 
    
        :::image type="content" source="./media/monitor-event-delivery/alert-logic.png" alt-text="Alert logic":::                
4. Back on the **Create alert rule** page, click **Select action group**.

    :::image type="content" source="./media/monitor-event-delivery/select-action-group-button.png" alt-text="Select action group button":::
5. Select **Create action group** on the toolbar to create a new action group. You can also select an existing action group.        
6. On the **Add action group** page, follow these steps:
    1. Enter a **name for the action group**.
    1. Enter a **short name** for the action group.
    1. Select an **Azure subscription** in which you want to create the action group.
    1. Select the **Azure resource group** in which you want to create the action group.
    1. Enter a **name for the action**. 
    1. Select the **action type**. In this example, **Email Azure Resource Manager Role** is selected, specifically the **Owners** role. 
    1. Select **OK** to close the page. 
    
        :::image type="content" source="./media/monitor-event-delivery/add-action-group-page.png" alt-text="Add action group page":::                   
7. Back on the **Create alert rule** page, enter a name for the alert rule, and then select **Create alert rule**.

    :::image type="content" source="./media/monitor-event-delivery/alert-rule-name.png" alt-text="Alert rule name":::  
8. Now, on the **Alerts** page of the topic, you see a link to manage alert rules if there are no alerts yet. If there are alerts, select **Manager alert rules** on the toolbar.  

    :::image type="content" source="./media/monitor-event-delivery/manage-alert-rules.png" alt-text="Manage alerts":::

    > [!NOTE]
    > This article doesn't cover all the different steps and combinations you can use to create an alert. For an overview of alerts, see [Alerts overview](../azure-monitor/platform/alerts-overview.md).

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
