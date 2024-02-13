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

1. Create an Event Grid topic that receives events from MQTT clients.
2. Create a subscription to the topic using Event Hubs as the destination.
3. Create an event stream in Microsoft Fabric with the event hub as a source and a Fabric KQL database or Lakehouse as a destination. 

## Event flow

1. MQTT client sends events to your Event Grid custom topic.
2. Event subscription to the custom topic forwards those events to your event hub. 
3. Fabric event stream receives events from the event hub and stores them in a Fabric destination such as a KQL database. 

## Detailed steps

1. In the Azure portal, do these steps:
    1. [Create an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md).
    1. [Create an Event Grid topic](create-custom-topic.md). 
    1. [Create an event subscription to the custom topic using Azure Event Hubs as the destination type and select your event hub](mqtt-routing-to-event-hubs-portal.md#create-an-event-subscription-with-event-hubs-as-the-endpoint). 
    1. [Create an Event Grid namespace and enable MQTT broker](mqtt-publish-and-subscribe-portal.md#create-a-namespace). 
    1. [Enable routing to a custom topic](mqtt-routing-to-event-hubs-portal.md#configure-routing-in-the-event-grid-namespace).     
1. In Microsoft Fabric, do these steps:
    1. [Create a KQL database](/fabric/real-time-analytics/create-database). 
    2. [Create an event stream](/fabric/real-time-analytics/event-streams/create-manage-an-eventstream#create-an-eventstream).
    3. [Add your event hub as an input source](/fabric/real-time-analytics/event-streams/add-manage-eventstream-sources#add-an-azure-event-hub-as-a-source).
    4. [Add your KQL Database as a destination](/fabric/real-time-analytics/event-streams/add-manage-eventstream-destinations#add-a-kql-database-as-a-destination). 
1. Test your solution by sending events to the custom topic. 

## Next steps
Build a Power BI report as shown in the sample: [Build a near-real-time Power BI report with the event data ingested in the KQL database](/fabric/real-time-analytics/event-streams/stream-real-time-events-from-custom-app-to-kusto#build-a-near-real-time-power-bi-report-with-the-event-data-ingested-in-the-kql-database).


    




- 


