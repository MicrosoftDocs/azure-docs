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

1. In the Azure portal, do these steps:
    1. [Create an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md).
    1. [Create an Event Grid namespace and a topic](create-view-manage-namespace-topics.md#create-a-namespace-topic). 
    1. [Enable managed identity on the namespace](event-grid-namespace-managed-identity.md).
    1. [Add the identity to Azure Event Hubs Data Sender role on the Event Hubs namespace or event hub](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition). 
    1. [Create a subscription to the topic using Azure Event Hubs as the destination type and select your event hub](mqtt-routing-to-event-hubs-portal.md#create-an-event-subscription-with-event-hubs-as-the-endpoint). 
    1. [Create an Event Grid namespace and enable MQTT broker](mqtt-publish-and-subscribe-portal.md#create-a-namespace). 
    1. [Enable routing to a namespace topic](mqtt-routing-to-event-hubs-portal.md#configure-routing-in-the-event-grid-namespace).     
1. In Microsoft Fabric, do these steps:
    1. [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake#create-a-lakehouse). 
    2. [Create an event stream](/fabric/real-time-analytics/event-streams/create-manage-an-eventstream#create-an-eventstream).
    3. [Add your event hub as an input source](/fabric/real-time-analytics/event-streams/add-manage-eventstream-sources#add-an-azure-event-hub-as-a-source).
    4. [Add your lakehouse as a destination](/fabric/real-time-analytics/event-streams/add-manage-eventstream-destinations#add-a-lakehouse-as-a-destination). 
1. [Publish events to the namespace topic](publish-deliver-events-with-namespace-topics.md#send-events-to-your-topic). 

## Next steps
Build a Power BI report as shown in the sample: [Build a near-real-time Power BI report with the event data ingested in a lakehouse](/fabric/real-time-analytics/event-streams/transform-and-stream-real-time-events-to-lakehouse).


    




- 


