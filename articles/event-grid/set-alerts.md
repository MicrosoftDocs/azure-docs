---
title: Set alerts for Azure Event Grid metrics and activity log operations
description: This article describes how to create alerts on Azure Event Grid metrics and activity log operations. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/25/2020
ms.author: spelluru
---

# Set alerts on Azure Event Grid metrics and activity logs
This article describes how to create alerts on Azure Event Grid metrics and activity log operations. You can create alerts on both publish and delivery metrics for Azure Event Grid resources (topics and domains). For system topics, [create alerts using the **Metrics** page](#create-alerts-using-the-metrics-page).

## Create alerts on dead-lettered events
The following procedure shows you how to create an alert on **dead-lettered events** metric for a custom topic. In this example, an email is sent to the Azure resource group owner when the dead-lettered event count for a topic goes above 10. 

1. On the **Event Grid Topic** page for your topic, select **Alerts** on the left menu, and then select **+New alert rule**. 

    :::image type="content" source="./media/monitor-event-delivery/new-alert-button.png" alt-text="Alerts page - New alert rule button":::
2. On the **Create alert rule** page, verify that your topic is selected for the resource. Then, click **Select condition**. 

    :::image type="content" source="./media/monitor-event-delivery/alert-select-condition.png" alt-text="Alerts page - select condition":::    
3. On the **Configure signal logic** page, follow these steps:
    1. Select a metric or an activity log entry. In this example, **Dead Lettered Events** is selected. 

        :::image type="content" source="./media/monitor-event-delivery/select-dead-lettered-events.png" alt-text="Select dead-lettered events":::        
    2. Select dimensions (optional). 
        
        :::image type="content" source="./media/monitor-event-delivery/configure-signal-logic.png" alt-text="Configure signal logic":::        

        > [!NOTE]
        > You can select **+** button for **EventSubscriptionName** to specify an event subscription name to filter events. 
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

## Create alerts on other metrics or activity log operations
The previous section showed you how to create alerts on dead-lettered events. The steps for create alerts on other metrics or activity log operations are similar. 

For example, to create an alert on a delivery failure event, select **Delivery failed events** on the **Configure signal logic** page. 

:::image type="content" source="./media/set-alerts/delivery-failed-events.png" alt-text="Select Delivery failed events":::


## Create alerts using the Metrics page
You can also create alerts by using the **Metrics** page. The steps are similar. For system topics, you can only use the **Metrics** page to create alerts, as the **Alerts** page isn't available. 

:::image type="content" source="./media/monitor-event-delivery/metric-page-create-alert-button.png" alt-text="Metrics page - Create alert button":::   
    

> [!NOTE]
> This article doesn't cover all the different steps and combinations that you can use to create an alert. For an overview of alerts, see [Alerts overview](../azure-monitor/platform/alerts-metric.md).

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
