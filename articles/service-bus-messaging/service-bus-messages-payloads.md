---
title: Azure Service Bus messages, payloads, and serialization | Microsoft Docs
description: This article provides an overview of Azure Service Bus messages, payloads, message routing, and serialization. 
ms.topic: article
ms.date: 07/23/2024
---

# Messages, payloads, and serialization

Azure Service Bus handles messages. Messages carry a payload and metadata. The metadata is in the form of key-value pairs, and describes the payload, and gives handling instructions to Service Bus and applications. Occasionally, that metadata alone is sufficient to carry the information that the sender wants to communicate to receivers, and the payload remains empty.

The object model of the official Service Bus clients for .NET and Java reflect the abstract Service Bus message structure, which is mapped to and from the wire protocols Service Bus supports.
 
A Service Bus message consists of a binary payload section that Service Bus never handles in any form on the service-side, and two sets of properties. The **broker properties** are predefined by the system. These predefined properties either control message-level functionality inside the broker, or they map to common and standardized metadata items. The **user properties** are a collection of key-value pairs that can be defined and set by the application.
 
The predefined broker properties are listed in the following table. The names are used with all official client APIs and also in the [`BrokerProperties`](/rest/api/servicebus/introduction) JSON object of the HTTP protocol mapping.
 
The equivalent names used at the Advanced Message Queuing Protocol (AMQP) protocol level are listed in parentheses. While the following names use pascal casing, JavaScript and Python clients would use camel and snake casing respectively.

| Property Name | Description |
|---------------| ------------|
| `ContentType` (`content-type`) | Optionally describes the payload of the message, with a descriptor following the format of RFC2045, Section 5; for example, `application/json`. |
| `CorrelationId` (`correlation-id`) | Enables an application to specify a context for the message for the purposes of correlation; for example, reflecting the **MessageId** of a message that is being replied to. |
| `DeadLetterSource` | Only set in messages that have been dead-lettered and later autoforwarded from the dead-letter queue to another entity. Indicates the entity in which the message was dead-lettered. This property is read-only. |
| `DeliveryCount` | <p>Number of deliveries that have been attempted for this message. The count is incremented when a message lock expires, or the message is explicitly abandoned by the receiver. This property is read-only.</p> <p>The delivery count isn't incremented when the underlying AMQP connection is closed.</p> |
| `EnqueuedSequenceNumber` | For messages that have been autoforwarded, this property reflects the sequence number that had first been assigned to the message at its original point of submission. This property is read-only. |
| `EnqueuedTimeUtc` | The UTC instant at which the message has been accepted and stored in the entity. This value can be used as an authoritative and neutral arrival time indicator when the receiver doesn't want to trust the sender's clock. This property is read-only. |
| `Expires​AtUtc` (`absolute-expiry-time`) | The UTC instant at which the message is marked for removal and no longer available for retrieval from the entity because of its expiration. Expiry is controlled by the **TimeToLive** property and this property is computed from EnqueuedTimeUtc+TimeToLive. This property is read-only. |
| `Label` or `Subject` (`subject`) | This property enables the application to indicate the purpose of the message to the receiver in a standardized fashion, similar to an email subject line. |
| `Locked​Until​Utc` | For messages retrieved under a lock (peek-lock receive mode, not presettled) this property reflects the UTC instant until which the message is held locked in the queue/subscription. When the lock expires, the [DeliveryCount](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage.deliverycount) is incremented and the message is again available for retrieval. This property is read-only. |
| `Lock​Token` | The lock token is a reference to the lock that is being held by the broker in *peek-lock* receive mode. The token can be used to pin the lock permanently through the [Deferral](message-deferral.md) API and, with that, take the message out of the regular delivery state flow. This property is read-only. |
| `Message​Id` (`message-id`) | The message identifier is an application-defined value that uniquely identifies the message and its payload. The identifier is a free-form string and can reflect a GUID or an identifier derived from the application context. If enabled, the [duplicate detection](duplicate-detection.md) feature identifies and removes second and further submissions of messages with the same **MessageId**. |
| `Partition​Key` | For [partitioned entities](service-bus-partitioning.md), setting this value enables assigning related messages to the same internal partition, so that submission sequence order is correctly recorded. The partition is chosen by a hash function over this value and can't be chosen directly. For session-aware entities, the **SessionId** property overrides this value. |
| `Reply​To` (`reply-to`) | This optional and application-defined value is a standard way to express a reply path to the receiver of the message. When a sender expects a reply, it sets the value to the absolute or relative path of the queue or topic it expects the reply to be sent to. |
| `Reply​To​Session​Id` (`reply-to-group-id`) | This value augments the **ReplyTo** information and specifies which **SessionId** should be set for the reply when sent to the reply entity. |
| `Scheduled​Enqueue​Time​Utc` | For messages that are only made available for retrieval after a delay, this property defines the UTC instant at which the message will be logically enqueued, sequenced, and therefore made available for retrieval. |
| `Sequence​Number` | The sequence number is a unique 64-bit integer assigned to a message as it is accepted and stored by the broker and functions as its true identifier. For partitioned entities, the topmost 16 bits reflect the partition identifier. Sequence numbers monotonically increase and are gapless. They roll over to 0 when the 48-64 bit range is exhausted. This property is read-only. |
| `Session​Id` (`group-id`) | For session-aware entities, this application-defined value specifies the session affiliation of the message. Messages with the same session identifier are subject to summary locking and enable exact in-order processing and demultiplexing. For entities that aren't session-aware, this value is ignored. |
| `Time​To​Live` | This value is the relative duration after which the message expires, starting from the instant it has been accepted and stored by the broker, as captured in **EnqueueTimeUtc**. When not set explicitly, the assumed value is the **DefaultTimeToLive** for the respective queue or topic. A message-level **TimeToLive** value can't be longer than the entity's **DefaultTimeToLive** setting. If it's longer, it's silently adjusted. |
| `To` (`to`) | This property is reserved for future use in routing scenarios and currently ignored by the broker itself. Applications can use this value in rule-driven autoforward chaining scenarios to indicate the intended logical destination of the message. |
| `Via​Partition​Key` | If a message is sent via a transfer queue in the scope of a transaction, this value selects the transfer queue partition. |

The abstract message model enables a message to be posted to a queue via HTTPS and can be retrieved via AMQP. In either case, the message looks normal in the context of the respective protocol. The broker properties are translated as needed, and the user properties are mapped to the most appropriate location on the respective protocol message model. In HTTP, user properties map directly to and from HTTP headers; in AMQP they map to and from the `application-properties` map.

## Message routing and correlation

A subset of the broker properties described previously, specifically `To`, `ReplyTo`, `ReplyToSessionId`, `MessageId`, `CorrelationId`, and `SessionId`, are used to help applications route messages to particular destinations. To illustrate this feature, consider a few patterns:

- **Simple request/reply**: A publisher sends a message into a queue and expects a reply from the message consumer. To receive the reply, the publisher owns a queue into which it expects replies to be delivered. The address of the queue is expressed in the **ReplyTo** property of the outbound message. When the consumer responds, it copies the **MessageId** of the handled message into the **CorrelationId** property of the reply message and delivers the message to the destination indicated by the **ReplyTo** property. One message can yield multiple replies, depending on the application context.
- **Multicast request/reply**: As a variation of the prior pattern, a publisher sends the message into a topic and multiple subscribers become eligible to consume the message. Each of the subscribers might respond in the fashion described previously. This pattern is used in discovery or roll-call scenarios and the respondent typically identifies itself with a user property or inside the payload. If **ReplyTo** points to a topic, such a set of discovery responses can be distributed to an audience.
- **Multiplexing**: This session feature enables multiplexing of streams of related messages through a single queue or subscription such that each session (or group) of related messages, identified by matching **SessionId** values, are routed to a specific receiver while the receiver holds the session under lock. Read more about the details of sessions [here](message-sessions.md).
- **Multiplexed request/reply**: This session feature enables multiplexed replies, allowing several publishers to share a reply queue. By setting **ReplyToSessionId**, the publisher can instruct the consumers to copy that value into the **SessionId** property of the reply message. The publishing queue or topic doesn't need to be session-aware. As the message is sent, the publisher can then specifically wait for a session with the given **SessionId** to materialize on the queue by conditionally accepting a session receiver. 

Routing inside of a Service Bus namespace can be realized using autoforward chaining and topic subscription rules. Routing across namespaces can be realized [using Azure LogicApps](https://azure.microsoft.com/services/logic-apps/). As indicated in the previous list, the **To** property is reserved for future use and might eventually be interpreted by the broker with a specially enabled feature. Applications that wish to implement routing should do so based on user properties and not lean on the **To** property; however, doing so now won't cause compatibility issues.

## Payload serialization

When in transit or stored inside of Service Bus, the payload is always an opaque, binary block. The `ContentType` property enables applications to describe the payload, with the suggested format for the property values being a MIME content-type description according to IETF RFC2045; for example, `application/json;charset=utf-8`.

Unlike the Java or .NET Standard variants, the .NET Framework version of the Service Bus API supports creating **BrokeredMessage** instances by passing arbitrary .NET objects into the constructor. 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

When you use the legacy SBMP protocol, those objects are then serialized with the default binary serializer, or with a serializer that is externally supplied. The object is serialized into an AMQP object. The receiver can retrieve those objects with the [`GetBody<T>()`](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1) method, supplying the expected type. With AMQP, the objects are serialized into an AMQP graph of `ArrayList` and `IDictionary<string,object>` objects, and any AMQP client can decode them. 

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

While this hidden serialization magic is convenient, applications should take explicit control of object serialization and turn their object graphs into streams before including them into a message, and do the reverse on the receiver side. This yields interoperable results. While AMQP has a powerful binary encoding model, it's tied to the AMQP messaging ecosystem, and HTTP clients have trouble decoding such payloads. 

The .NET Standard and Java API variants only accept byte arrays, which means that the application must handle object serialization control.

When handling object deserialization from the message payload, developers should take into consideration that messages may arrive from multiple sources using different serialization methods. This can also happen when evolving a single application, where old versions may continue to run alongside newer versions. In these cases, it is recommended to have additional deserialization methods to try if the first attempt at deserialization fails. One library that supports this is [NServiceBus](https://docs.particular.net/nservicebus/serialization/#specifying-additional-deserializers). If all deserialization methods fail, then it's recommended to [dead-letter the message](./service-bus-dead-letter-queues.md?source=recommendations#application-level-dead-lettering).

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
