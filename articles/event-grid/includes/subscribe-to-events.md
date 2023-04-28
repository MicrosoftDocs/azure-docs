---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/31/2022
 ms.author: spelluru
 ms.custom: include file
---

## Subscribe to events
First, create an event handler that will handle events from the partner. For example, create an event hub, Service Bus queue or topic, or an Azure function. Then, create an event subscription for the partner topic using the event handler you created. 

### Create an event handler
To test your partner topic, you'll need an event handler. Go to your Azure subscription and spin up a service that's supported as an [event handler](../event-handlers.md) such as an [Azure Function](../custom-event-to-function.md). For an example, see [Event Grid Viewer sample](../custom-event-quickstart-portal.md#create-a-message-endpoint) that you can use as an event handler via webhooks. 

### Subscribe to the partner topic
Subscribing to the partner topic tells Event Grid where you want your partner events to be delivered.

1. In the Azure portal, type **Event Grid Partner Topics** in the search box, and select **Event Grid Partner Topics**. 
1. On the **Event Grid Partner Topics** page, select the partner topic in the list. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-partner-topic.png" lightbox="./media/subscribe-to-partner-events/select-partner-topic.png" alt-text="Screenshot showing the selection of a partner topic on the Event Grid Partner Topics page.":::
1. On the **Event Grid Partner Topic** page for the partner topic, select **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-add-event-subscription.png" alt-text="Screenshot showing the selection of Add Event Subscription button on the Event Grid Partner Topic page.":::    
1. On the **Create Event Subscription** page, do the following steps:
    1. Enter a **name** for the event subscription.
    1. For **Filter to Event Types**, select types of events that your subscription will receive.
    1. For **Endpoint Type**, select an Azure service (Azure Function, Storage Queues, Event Hubs, Service Bus Queue, Service Bus Topic, Hybrid Connections. etc.), or webhook.
    1. Click the **Select an endpoint** link. In this example, let's use Azure Event Hubs destination or endpoint. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/select-endpoint.png" lightbox="./media/subscribe-to-partner-events/select-endpoint.png" alt-text="Screenshot showing the configuration of an endpoint for an event subscription.":::            
    1. On the **Select Event Hub** page, select configurations for the endpoint, and then select **Confirm Selection**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/select-event-hub.png" lightbox="./media/subscribe-to-partner-events/select-event-hub.png" alt-text="Screenshot showing the configuration of an Event Hubs endpoint.":::    
    1. Now on the **Create Event Subscription** page, select **Create**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/create-event-subscription.png" alt-text="Screenshot showing the Create Event Subscription page with example configurations.":::
        
