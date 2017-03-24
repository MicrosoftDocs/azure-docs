---
title: AMQP 1.0 in Azure Service Bus request-response-based operations | Microsoft Docs
description: List of Microsoft Azure Service Bus request/response-based operations.
services: service-bus-messaging
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2017
ms.author: sethm

---

# AMQP 1.0 in Microsoft Azure Service Bus: request-response-based operations

This topic defines the list of Microsoft Azure Service Bus request/response-based operations. This information is based on the AMQP Management Version 1.0 working draft.  
  
For a detailed wire-level AMQP 1.0 protocol guide, which explains how Service Bus implements and builds on the OASIS AMQP technical specification, see the [AMQP 1.0 in Azure Service Bus and Event Hubs protocol guide](service-bus-amqp-protocol-guide.md).  
  
## Concepts  
  
### Entity description  

An entity description refers to either a Service Bus [QueueDescription Class](/dotnet/api/microsoft.servicebus.messaging.queuedescription), [TopicDescription Class](/dotnet/api/microsoft.servicebus.messaging.topicdescription), or [SubscriptionDescription Class](/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription) object.  
  
### Brokered message  

Represents a message in Service Bus which is mapped to an AMQP message. The mapping is defined in the [Service Bus AMQP protocol guide](service-bus-amqp-protocol-guide.md) article.  
  
## Attach to entity management node  

All the operations described in this document follow a request/response pattern, are scoped to an entity, and require attaching to an entity management node.  
  
### Create link for sending requests  

Creates a link to the management node for sending requests.  
  
```  
requestLink = session.attach( 	  
role: SENDER,   
   	target: { address: "<entity address>/$management" },   
   	source: { address: ""<my request link unique address>" }   
)  
  
```  
  
### Create link for receiving responses  

Creates a link for receiving responses from the management node.  
  
```  
responseLink = session.attach(	  
role: RECEIVER,   
	source: { address: "<entity address>/$management" }   
   	target: { address: "<my response link unique address>" }   
)  
  
```  
  
### Transfer a request message  

Transfers a request message.  
  
```  
requestLink.sendTransfer(  
        Message(  
                properties: {  
                        message-id: <request id>,  
                        reply-to: "<my response link unique address>"  
                },  
                application-properties: {  
                        "operation" -> "<operation>",  
                },  
        )  
```  
  
### Receive a response message  

Receives the response message from the response link.  
  
```  
responseMessage = responseLink.receiveTransfer()  
```  
  
The response message will be of the following form.  
  
```  
Message(  
properties: {	  
		correlation-id: <request id>  
	},  
	application-properties: {  
			"statusCode" -> <status code>,  
			"statusDescription" -> <status description>,  
           },		  
)  
  
```  
  
### Service Bus entity address  

Service Bus entities must be addressed as follows:  
  
|Entity type|Address|Example|  
|-----------------|-------------|-------------|  
|queue|`<queue_name>`|`“myQueue”`<br /><br /> `“site1/myQueue”`|  
|topic|`<topic_name>`|`“myTopic”`<br /><br /> `“site2/page1/myQueue”`|  
|subscription|`<topic_name>/Subscriptions/<subscription_name>`|`“myTopic/Subscriptions/MySub”`|  
  
## Message operations  
  
### Message Renew Lock  

Extends the lock of a message by the time specified in the entity description.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:renew-lock`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
 The request message body must consist of an amqp-value section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|`lock-tokens`|array of uuid|Yes|Message lock tokens to renew.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed.|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an amqp-value section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|expirations|array of timestamp|Yes|Message lock token new expiration corresponding to the request lock tokens.|  
  
### Peek Message  

Peeks messages without locking.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:peek-message`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|`from-sequence-number`|long|Yes|Sequence number from which to start peek.|  
|`message-count`|int|Yes|Maximum number of messages to peek.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – has more messages<br /><br /> 0xcc: No content – no more messages|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|messages|list of maps|Yes|List of messages in which every map represents a message.|  
  
The map representing a message must contain the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|message|array of byte|Yes|AMQP 1.0 wire-encoded message.|  
  
### Schedule Message  

Schedules messages.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:schedule-message`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|messages|list of maps|Yes|List of messages in which every map represents a message.|  
  
The map representing a message must contain the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|message-id|string|Yes|`amqpMessage.Properties.MessageId` as string|  
|session-id|string|Yes|`amqpMessage.Properties.GroupId as string`|  
|partition-key|string|Yes|`amqpMessage.MessageAnnotations.”x-opt-partition-key"`|  
|message|array of byte|Yes|AMQP 1.0 wire-encoded message.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed.|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|sequence-numbers|array of long|Yes|Sequence number of scheduled messages. Sequence number is used to cancel.|  
  
### Cancel Scheduled Message  

Cancels scheduled messages.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:cancel-scheduled-message`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|sequence-numbers|array of long|Yes|Sequence numbers of scheduled messages to cancel.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed.|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|sequence-numbers|array of long|Yes|Sequence number of scheduled messages. Sequence number is used to cancel.|  
  
## Session Operations  
  
### Session Renew Lock  

Extends the lock of a message by the time specified in the entity description.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:renew-session-lock`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|session-id|string|Yes|Session ID.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – has more messages<br /><br /> 0xcc: No content – no more messages|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|expiration|timestamp|Yes|New expiration.|  
  
### Peek Session Message  

Peeks session messages without locking.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:peek-message`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|from-sequence-number|long|Yes|Sequence number from which to start peek.|  
|message-count|int|Yes|Maximum number of messages to peek.|  
|session-id|string|Yes|Session ID.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – has more messages<br /><br /> 0xcc: No content – no more messages|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a map with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|messages|list of maps|Yes|List of messages in which every map represents a message.|  
  
 The map representing a message must contain the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|message|array of byte|Yes|AMQP 1.0 wire-encoded message.|  
  
### Set Session State  

Sets the state of a session.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:peek-message`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|session-id|string|Yes|Session ID.|  
|session-state|array of bytes|Yes|Opaque binary data.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|  
  
### Get Session State  

Gets the state of a session.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:get-session-state`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|session-id|string|Yes|Session ID.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|session-state|array of bytes|Yes|Opaque binary data.|  
  
### Enumerate Sessions  

Enumerates sessions on a messaging entity.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:get-message-sessions`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|last-updated-time|timestamp|Yes|Filter to include only sessions updated after a given time.|  
|skip|int|Yes|Skip a number of sessions.|  
|top|int|Yes|Maximum number of sessions.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – has more messages<br /><br /> 0xcc: No content – no more messages|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|skip|int|Yes|Number of skipped sessions if status code is 200.|  
|sessions-ids|array of strings|Yes|Array of session IDs if status code is 200.|  
  
## Rule operations  
  
### Add Rule  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:add-rule`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|rule-name|string|Yes|Rule name, not including subscription and topic names.|  
|rule-description|map|Yes|Rule description as specified in next section.|  
  
The **rule-description** map must include the following entries, where **sql-filter** and **correlation-filter** are mutually exclusive.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|sql-filter|map|Yes|`sql-filter`, as specified in the next section.|  
|correlation-filter|map|Yes|`correlation-filter`, as specified in the next section.|  
|sql-rule-action|map|Yes|`sql-rule-action`, as specified in the next section.|  
  
The sql-filter map must include the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|expression|string|Yes|Sql filter expression.|  
  
The **correlation-filter** map must include at least one of the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|correlation-id|string|No||  
|message-id|string|No||  
|to|string|No||  
|reply-to|string|No||  
|label|string|No||  
|session-id|string|No||  
|reply-to-session-id|string|No||  
|content-type|string|No||  
|properties|map|No|Maps to Service Bus [BrokeredMessage.Properties](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Properties).|  
  
The **sql-rule-action** map must include the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|expression|string|Yes|Sql action expression.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|  
  
### Remove Rule  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:remove-rule`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|rule-name|string|Yes|Rule name, not including subscription and topic names.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|  
  
## Deferred message operations  
  
### Receive by sequence number  

Receives deferred messages by sequence number.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:receive-by-sequence-number`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|sequence-numbers|array of long|Yes|Sequence numbers.|  
|receiver-settle-mode|ubyte|Yes|Receiver settle mode as specified in AMQP core v1.0.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|  
  
The response message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|messages|list of maps|Yes|List of messages where every map represents a message.|  
  
The map representing a message must contain the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|lock-token|uuid|Yes|Lock token if `receiver-settle-mode` is 1.|  
|message|array of byte|Yes|AMQP 1.0 wire-encoded message.|  
  
### Update disposition status  

Updates the disposition status of deferred messages.  
  
#### Request  

The request message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|operation|string|Yes|`com.microsoft:update-disposition`|  
|`com.microsoft:server-timeout`|uint|No|Operation server timeout in milliseconds.|  
  
The request message body must consist of an **amqp-value** section containing a **map** with the following entries.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|disposition-status|string|Yes|completed<br /><br /> abandoned<br /><br /> suspended|  
|lock-tokens|array of uuid|Yes|Message lock tokens to update disposition status.|  
|deadletter-reason|string|No|May be set if disposition status is set to **suspended**.|  
|deadletter-description|string|No|May be set if disposition status is set to **suspended**.|  
|properties-to-modify|map|No|List of Service Bus brokered message properties to modify.|  
  
#### Response  

The response message must include the following application properties.  
  
|Key|Value Type|Required|Value Contents|  
|---------|----------------|--------------|--------------------|  
|statusCode|int|Yes|HTTP response code [RFC2616]<br /><br /> 200: OK – success, otherwise failed|  
|statusDescription|string|No|Description of the status.|

## Next steps
to learn more about AMQP and Service bus, visit the following links:

* [Service Bus AMQP overview]
* [AMQP 1.0 support for Service Bus partitioned queues and topics]
* [AMQP in Service Bus for Windows Server]

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[AMQP 1.0 support for Service Bus partitioned queues and topics]: service-bus-partitioned-queues-and-topics-amqp-overview.md
[AMQP in Service Bus for Windows Server]: https://msdn.microsoft.com/library/dn574799.asp