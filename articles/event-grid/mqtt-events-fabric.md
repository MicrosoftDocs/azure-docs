---
title: Send MQTT events to Microsoft Fabric via Event Hubs
description: Shows you how to use Event Grid to  send events from MQTT clients to Microsoft Fabric via Azure Event Hubs. 
ms.topic: how-to
ms.date: 04/30/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
---

# How to send MQTT events to Microsoft Fabric using Azure Event Grid (Preview) 
This article shows you how to use Azure Event Grid to send events from MQTT clients to Microsoft Fabric eventstream. 

## High-level steps

1. Create an Azure Event Grid  namespace.
1. Create a namespace topic in the namespace that receives events from MQTT clients.
1. Enable managed identity on the Event Grid namespace.  
1. Enable MQTT and routing on the Event Grid namespace, if you want to receive Message Queuing Telemetry Transport (MQTT) data.
1. Create an event stream in Microsoft Fabric.  

## Detailed steps

1. Follow steps from the article: [QuickStart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) to:
    1. Create Event Grid namespace in the Azure portal.
    1. Create a namespace topic. 
    1. Enable managed identity for the namespace. 
    1. Enable MQTT broker for the Event Grid namespace. 
    1. Configure routing for the Event Grid namespace. 
    1. Create clients, topic space, and permission bindings. 
    1. Use MQTTX tool to send a few test events or messages.  
1. In Microsoft Fabric, follow the steps from the article: [Add Azure Event Grid Namespace source to an eventstream (Preview)](/fabric/real-time-intelligence/event-streams/add-source-azure-event-grid)
    1. Create workspace in Fabric. 
    1. Create an eventstream.
    1. Create an Azure Event Grid namespace datasource. 
    1. Preview Data in the eventstream.

## Next steps
To learn how to add other sources to an eventstream, see the following article: [Add and manage an event source in an eventstream](/fabric/real-time-intelligence/event-streams/add-manage-eventstream-sources). 

    




- 


