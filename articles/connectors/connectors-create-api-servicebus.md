<properties
pageTitle="Learn to use the Azure Service Bus connector in your logic apps | Microsoft Azure"
description="Create logic apps with Azure App service. Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, and receive from subscription."
services="logic-apps"
documentationCenter=".net,nodejs,java" 	
authors="msftman"
manager="erikre"
editor=""
tags="connectors" />

<tags
ms.service="logic-apps"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="08/02/2016"
ms.author="deonhe"/>

# Get started with the Azure Service Bus connector

Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, and receive from subscription.

To use [any connector](./apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Connect to Service Bus

Before your logic app can access any service, you first need to create a connection to the service. A [connection](./connectors-overview.md) provides connectivity between a logic app and another service.  

>[AZURE.INCLUDE [Steps to create a connection to Azure Service Bus](../../includes/connectors-create-api-servicebus.md)]

## Use a Service Bus trigger

A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).  

>[AZURE.INCLUDE [Steps to create a Service Bus trigger](../../includes/connectors-create-api-servicebus-trigger.md)]  

## Use a Service Bus action

An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).

[AZURE.INCLUDE [Steps to create a Service Bus action](../../includes/connectors-create-api-servicebus-action.md)]  

## Technical details

Here are the details about the triggers, actions, and responses that this connection supports.

### Service Bus triggers

Service Bus has the following triggers:  

|Trigger | Description|
|--- | ---|
|[When a message is received in a queue](connectors-create-api-servicebus.md#when-a-message-is-received-in-a-queue)|This operation triggers a flow when a message is received in a queue.|
|[When a message is received in a topic subscription](connectors-create-api-servicebus.md#when-a-message-is-received-in-a-topic-subscription)|This operation triggers a flow when a message is received in a topic subscription.|


### Service Bus actions

Service Bus has the following actions:


|Action|Description|
|--- | ---|
|[Send message](connectors-create-api-servicebus.md#send-message)|This operation sends a message to a queue or topic.|
### Action and trigger details

Here are the details for the actions and triggers for this connector, along with their responses.



#### Send message

|Property name| Display name|Description|
| ---|---|---|
|ContentData*|Content|Content of the message.|
|ContentType|Content Type|Content type of the message content.|
|Properties|Properties|Key-value pairs for each brokered property.|
|entityName*|Queue/Topic name|Name of the queue or topic.|

These advanced parameters are also available:

|Property name| Display name|Description|
| ---|---|---|
|MessageId|Message Id|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|To|To|Address to send to.|
|ReplyTo|Reply To|Address of the queue to reply to.|
|ReplyToSessionId|Reply To Session Id|Identifier of the session to reply to.|
|Label|Label|Application-specific label.|
|ScheduledEnqueueTimeUtc|ScheduledEnqueueTimeUtc|Date and time, in UTC, when the message will be added to the queue.|
|SessionId|Session Id|Identifier of the session.|
|CorrelationId|Correlation Id|Identifier of the correlation.|
|TimeToLive|Time To Live|The duration, in ticks, that a message is valid. The duration starts from when the message is sent to the Service Bus.|



An * indicates that a property is required.


#### When a message is received in a queue

|Property name| Display name|Description|
| ---|---|---|
|queueName*|Queue name|Name of the queue.|


An * indicates that a property is required.


##### Output details

ServiceBusMessage: This object has the content and properties of a Service Bus message.


| Property name | Data type | Description |
|---|---|---|
|ContentData|string|Content of the message.|
|ContentType|string|Content type of the message content.|
|Properties|object|Key-value pairs for each brokered property.|
|MessageId|string|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|To|string|Send to address.|
|ReplyTo|string|Address of the queue to reply to.|
|ReplyToSessionId|string|Identifier of the session to reply to.|
|Label|string|Application-specific label.|
|ScheduledEnqueueTimeUtc|string|Date and time, in UTC, when the message will be added to the queue.|
|SessionId|string|Identifier of the session.|
|CorrelationId|string|Identifier of the correlation.|
|TimeToLive|string|The duration, in ticks, that a message is valid. The duration starts from when the message is sent to the Service Bus.|




#### When a message is received in a topic subscription

|Property name| Display name|Description|
| ---|---|---|
|topicName*|Topic name|Name of the topic.|
|subscriptionName*|Topic subscription name|Name of the topic subscription.|


An * indicates that a property is required.


##### Output details

ServiceBusMessage: This object has the content and properties of a Service Bus message.


| Property name | Data type | Description |
|---|---|---|
|ContentData|string|Content of the message.|
|ContentType|string|Content type of the message content.|
|Properties|object|Key-value pairs for each brokered property.|
|MessageId|string|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|To|string|Send to address.|
|ReplyTo|string|Address of the queue to reply to.|
|ReplyToSessionId|string|Identifier of the session to reply to.|
|Label|string|Application-specific label.|
|ScheduledEnqueueTimeUtc|string|Date and time, in UTC, when the message will be added to the queue.|
|SessionId|string|Identifier of the session.|
|CorrelationId|string|Identifier of the correlation.|
|TimeToLive|string|The duration, in ticks, that a message is valid. The duration starts from when the message is sent to the Service Bus.|



### HTTP responses

The preceding actions and triggers can return one or more of the following HTTP status codes:

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad request|
|401|Unauthorized|
|403|Forbidden|
|404|Not found|
|500|Internal server error. Unknown error occurred.|
|default|Operation failed.|

## Next steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).
