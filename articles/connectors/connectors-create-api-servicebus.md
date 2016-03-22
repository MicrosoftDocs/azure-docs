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
ms.date="03/16/2016"
ms.author="deonhe"/>

# Get started with the Azure Service Bus API

Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, receive from subscription, etc.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Azure Service Bus](../app-service-logic/app-service-logic-connector-azureservicebus.md).

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

Follow these steps to create a service bus **connection** that you can then use in your logic app:

1. Select **Recurrence**
2. Select a **Frequency** and enter an **Interval**     
![Configure Service Bus][1] 
3. Select **Add an action**     
 ![Configure Service Bus][2]   
4. Enter **Service Bus** in the search box and wait for the search to return all entries with Service Bus in the name
5. Select **Service Bus - Send message**  
![Configure Service Bus][3]
7. Enter a **Connection name** and a **Connection string** then select **Create connection**:      
![Configure Service Bus][4]
7. After the connection is created, you'll be presented with the **Send message** dialog. Enter all the required information for sending a message.  
![Configure Service Bus][5]
8. Select the **Save** button on the menu above to save your work.    

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

[1]: ./media/connectors-create-api-servicebus/connectionconfig1.png
[2]: ./media/connectors-create-api-servicebus/connectionconfig2.png 
[3]: ./media/connectors-create-api-servicebus/connectionconfig3.png
[4]: ./media/connectors-create-api-servicebus/connectionconfig4.png
[5]: ./media/connectors-create-api-servicebus/connectionconfig5.png
[6]: ./media/connectors-create-api-servicebus/connectionconfig6.png