---
title: HTTP message headers and properties in Azure Service Bus
description: Learn how Service Bus represents broker properties, custom properties, and message bodies in HTTP requests and responses.
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-service-bus
ms.topic: concept-article
ms.date: 10/13/2026
---

# HTTP message headers and properties in Azure Service Bus

Service Bus messages contain a body, broker properties, and application-defined properties. When you use the REST messaging APIs, these values map to the HTTP body and headers. This article describes that mapping. For the protocol-independent message model, see [Messages, payloads, and serialization](service-bus-messages-payloads.md).

> [!NOTE]
> SBMP and the `WindowsAzure.ServiceBus` messaging library retired on September 30, 2026. References to `BrokeredMessage` and SBMP in this article describe legacy property mappings and message formats, not a supported client or protocol choice. For new .NET applications, use [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus). For existing applications, see the [migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md).

## Broker properties

For a single message, the `BrokerProperties` HTTP header contains broker properties as a JSON object. For a batch send, each message includes a `BrokerProperties` object in the JSON request body. For request formats, see [Send message](/rest/api/servicebus/send-message-to-queue) and [Send message batch](/rest/api/servicebus/send-message-batch).

Properties can appear in any order. The service uses default values for omitted properties and ignores unrecognized broker properties. The broker-property mapping doesn't depend on the `api-version` query parameter, and a message request doesn't require that parameter.

If you set both `SessionId` and `PartitionKey`, set them to the same value.

For example, a sender can set a message identifier, subject, correlation identifier, and a time to live of 90 seconds:

```http
BrokerProperties: {"MessageId":"order-123","Label":"OrderCreated","CorrelationId":"request-456","TimeToLive":90}
```

The following table maps legacy `BrokeredMessage` property names to their HTTP representations. Request properties are writable by a sender. Response-only properties describe a received message.

| Legacy property | Type | HTTP representation | Direction |
| --- | --- | --- | --- |
| `ContentType` | `string` | `Content-Type` header | Request and response |
| `CorrelationId` | `string` | `BrokerProperties.CorrelationId` | Request and response |
| `SessionId` | `string` | `BrokerProperties.SessionId` | Request and response |
| `DeliveryCount` | `int` | `BrokerProperties.DeliveryCount` | Response |
| `LockedUntilUtc` | `DateTime` | `BrokerProperties.LockedUntilUtc` | Response |
| `LockToken` | `Guid` | `BrokerProperties.LockToken` | Response |
| `MessageId` | `string` | `BrokerProperties.MessageId` | Request and response |
| `Label` | `string` | `BrokerProperties.Label` | Request and response |
| `ReplyTo` | `string` | `BrokerProperties.ReplyTo` | Request and response |
| `EnqueuedTimeUtc` | `DateTime` | `BrokerProperties.EnqueuedTimeUtc`; also represented by the `Date` header | Response |
| `SequenceNumber` | `long` | `BrokerProperties.SequenceNumber` | Response |
| `TimeToLive` | `TimeSpan` | `BrokerProperties.TimeToLive`, expressed in seconds | Request and response |
| `To` | `string` | `BrokerProperties.To` | Request and response |
| `ScheduledEnqueueTimeUtc` | `DateTime` | `BrokerProperties.ScheduledEnqueueTimeUtc` | Request and response |
| `ReplyToSessionId` | `string` | `BrokerProperties.ReplyToSessionId` | Request and response |
| `PartitionKey` | `string` | `BrokerProperties.PartitionKey` | Request and response |

Date-time values use the HTTP date format, such as `Sun, 06 Nov 1994 08:49:37 GMT`. The `TimeToLive` value is the total number of seconds in the duration. The `ExpiresAtUtc` property has no separate HTTP header; derive it from the enqueue time and time to live.

The service ignores response-only properties in a send request. Malformed values produce an HTTP error response. For examples of received properties, see [Peek-lock message](/rest/api/servicebus/peek-lock-message-non-destructive-read).

### Historical send-property defaults

The legacy send-property reference lists an empty default for `CorrelationId`, `Label`, `MessageId`, `PartitionKey`, `ReplyTo`, `ReplyToSessionId`, `ScheduledEnqueueTimeUtc`, `SessionId`, `TimeToLive`, `To`, and `ViaPartitionKey`. It lists `false` for `ForcePersistence`. These entries are historical `BrokeredMessage` mappings, not a feature-support matrix for current HTTP applications. For current property semantics and entity-level defaults such as message expiration, see [Messages, payloads, and serialization](service-bus-messages-payloads.md) and [Message expiration](message-expiration.md).

## Custom message properties

For a single message, each custom property maps to its own HTTP header. For a batch send, put custom properties in each message's `UserProperties` object in the JSON body. Custom headers on a batch request aren't applied to the messages in that batch.

For HTTP headers, Service Bus infers the value type:

| Header value | Interpreted type |
| --- | --- |
| Double-quoted value in HTTP date format | `DateTime` |
| Other double-quoted value | `string`, with the enclosing quotes removed |
| Unquoted `true` or `false`, in lowercase | `bool` |
| Unquoted integer | `Int64` |
| Unquoted floating-point number | `double` |
| Other value | The message is rejected. |

For example:

```http
product: "Example product"
price: 299.98
order-time: "Fri, 04 Mar 2011 08:49:37 GMT"
```

Use custom header names that are separate from reserved HTTP headers such as `Connection` and `Expect`. Reserved headers aren't stored as custom properties. The literal header value `null` is also dropped. See the notes in [Send message](/rest/api/servicebus/send-message-to-queue).

### Legacy property conversion

In the retired SBMP client, custom properties in `message.Properties` could have the types `byte`, `sbyte`, `char`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`, `float`, `double`, `decimal`, `bool`, `Guid`, `string`, `Uri`, `DateTime`, `DateTimeOffset`, and `TimeSpan`.

When those legacy messages are represented over HTTP, `Uri` and `DateTimeOffset` values aren't included in the headers. `Guid` values become strings, and `TimeSpan` values become total seconds. These conversions lose the original type fidelity.

## Message body

Service Bus preserves the message body bytes and the `Content-Type` header when messages cross HTTP and other messaging protocols. Choose a serialization format that both the sender and receiver understand. For example, send JSON bytes with `Content-Type: application/json`.

Messages created by the retired SBMP client without a custom XML serializer can have `application/msbin1` as their content type. Applications reading those existing messages are responsible for deserializing the binary XML body. A legacy WCF Service Bus binding uses the message encoder's content type, such as `application/soap+xml` for a text encoder.

For current serialization guidance, see [Messages, payloads, and serialization](service-bus-messages-payloads.md#payload-serialization).

## Next steps

- [Send a message with Microsoft Entra ID authentication](service-bus-rest-send-entra-token-how-to.md)
- [Send message REST reference](/rest/api/servicebus/send-message-to-queue)
- [Send message batch REST reference](/rest/api/servicebus/send-message-batch)
