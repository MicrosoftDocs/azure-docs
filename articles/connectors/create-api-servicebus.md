<properties
pageTitle="Use the Azure Service Bus API in your Logic Apps | Microsoft Azure"
description="Get started using the Azure Service Bus API (connector) in your Microsoft Azure App service Logic apps"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors"/>

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="na"
ms.date="02/18/2016"
ms.author="deonhe"/>

# Get started with the Azure Service Bus API

Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, receive from subscription, etc.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Azure Service Bus](../app-service-logic/app-service-logic-connector-Azure Service Bus.md).

With Azure Service Bus, you can:

* Use it to build logic apps  

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Azure Service Bus API can be used as an action; it has trigger(s). All APIs support data in JSON and XML formats. 

 The Azure Service Bus API has the following action(s) and/or trigger(s) available:

### Azure Service Bus actions
You can take these action(s):

|Action|Description|
|--- | ---|
|SendMessage|Sends message to Azure Service Bus queue or topic.|
### Azure Service Bus triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|GetMessageFromQueue|Gets a new message from Azure Service Bus queue.|
|GetMessageFromTopic|Gets a new message from Azure Service Bus topic subscription.|


## Create a connection to Azure Service Bus
To use the Azure Service Bus API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|ConnectionString|Yes|Provide Azure Service Bus Connection String|  

>[AZURE.TIP] You can use this connection in other logic apps.

## Azure Service Bus REST API reference
#### This documentation is for version: 1.0


### Sends message to Azure Service Bus queue or topic.
**```POST: /{entityName}/messages```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|message| |yes|body|none|Service Bus message|
|entityName|string|yes|path|none|Name of the queue or topic|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Gets a new message from Azure Service Bus queue.
**```GET: /{queueName}/messages/head```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|queueName|string|yes|path|none|Name of the queue.|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Gets a new message from Azure Service Bus topic subscription.
**```GET: /{topicName}/subscriptions/{subscriptionName}/messages/head```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|topicName|string|yes|path|none|Name of the topic.|
|subscriptionName|string|yes|path|none|Name of the topic subscription.|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



## Object definition(s): 

 **ServiceBusMessage**:Message comprises of content and properties

Required properties for ServiceBusMessage:

ContentTransferEncoding

**All properties**: 


| Name | Data Type |
|---|---|
|ContentData|string|
|ContentType|string|
|ContentTransferEncoding|string|
|Properties|object|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).