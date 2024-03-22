---
title: Send MQTT events to Microsoft Fabric via Event Hubs
description: Shows you how to use Event Grid to  send events from MQTT clients to Microsoft Fabric via Azure Event Hubs. 
ms.topic: how-to
ms.date: 02/13/2024
author: spelluru
ms.author: spelluru
ms.subservice: mqtt
---

# How to send MQTT events to Microsoft Fabric via Event Hubs using Azure Event Grid
This article shows you how to use Azure Event Grid to send events from MQTT clients to Microsoft Fabric data stores via Azure Event Hubs. 

## High-level steps

1. Create a namespace topic that receives events from MQTT clients.
2. Create a subscription to the topic using Event Hubs as the destination.
3. Create an event stream in Microsoft Fabric with the event hub as a source and a Fabric KQL database or Lakehouse as a destination. 

## Event flow

1. MQTT client sends events to your Event Grid namespace topic.
2. Event subscription to the namespace topic forwards those events to your event hub. 
3. Fabric event stream receives events from the event hub and stores them in a Fabric destination such as a KQL database or a lakehouse. 

## Detailed steps

1. Follow steps from the article: [Tutorial: Use namespace topics to route MQTT messages to Azure Event Hubs (Azure portal)](mqtt-routing-to-event-hubs-portal-namespace-topics.md) to:
    1. Create an Event Grid namespace in the Azure portal.
    1. Create a namespace topic.
    1. Enable managed identity for the namespace.
    1. Enable MQTT broker for the Event Grid namespace.
    1. Create an Event Hubs namespace.
    1. Create an event hub.
    1. Grant Event Grid namespace the permission to send events to the event hub.
    1. Create an event subscription to namespace topic with the event hub as the endpoint.
    1. Configure routing for the Event Grid namespace.
    1. Create clients, topic space, and permission bindings. 
    1. Use MQTTX tool to send a few test events or messages. 
1. In Microsoft Fabric, do these steps:
    1. [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake#create-a-lakehouse). 
    2. [Create an event stream](/fabric/real-time-analytics/event-streams/create-manage-an-eventstream#create-an-eventstream).
    3. [Add your event hub as an input source](/fabric/real-time-analytics/event-streams/add-manage-eventstream-sources#add-an-azure-event-hub-as-a-source).
    4. [Add your lakehouse as a destination](/fabric/real-time-analytics/event-streams/add-manage-eventstream-destinations#add-a-lakehouse-as-a-destination). 
1. [Publish events to the namespace topic](publish-deliver-events-with-namespace-topics.md#send-events-to-your-topic). 

## Next steps
Build a Power BI report as shown in the sample: [Build a near-real-time Power BI report with the event data ingested in a lakehouse](/fabric/real-time-analytics/event-streams/transform-and-stream-real-time-events-to-lakehouse).


    




- 


