---
title: MQTT feature support in MQTT broker
description: MQTT feature and control support in MQTT broker.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-mqtt-broker
ms.topic: reference
ms.date: 07/30/2026

# CustomerIntent: As an operator, I want to understand what MQTT specifications are supported by MQTT broker so that I can configure my MQTT client to connect to MQTT broker.
ms.service: azure-iot-operations
---

# MQTT feature support in MQTT broker

The MQTT broker currently supports the following MQTT features and control packets.

| Feature or control packet | MQTT v3.1.1 | MQTT v5 |
|---|:---:|:---:|
| CONNECT Keep-Alive | Supported | Supported |
| CONNECT Will Messages | Supported | Supported |
| CONNECT Will Messages Delay | N/A | Supported |
| CONNECT Will Messages Expiry Interval | N/A | Supported |
| CONNECT Will Messages User Properties | N/A | Supported |
| CONNECT Clean Start | Supported | Supported |
| CONNECT Persistent session | Supported | Supported |
| CONNECT Session Expiry Interval | N/A | Supported |
| CONNECT Client Receive Maximum | N/A | Supported |
| CONNECT Client Maximum Packet Size | N/A | Not Supported |
| CONNECT Topic Alias Maximum | N/A | Not Supported |
| CONNECT Request Response Information | N/A | Not Supported |
| CONNECT User Properties | N/A | Supported |
| CONNECT Authentication Data | N/A | Supported |
| CONNECT Authentication Method | N/A | Supported |
| CONNECT Server Generated Client ID | N/A | Supported |
| CONNACK Session Present | Supported | Supported |
| CONNACK Server Maximum Packet Size<sup>1</sup> | N/A | Supported |
| AUTH | N/A | Supported |
| PUBLISH QoS0 Delivery | Supported | Supported |
| PUBLISH QoS1 Delivery | Supported | Supported |
| PUBLISH QoS2 Delivery | Not Supported | Not Supported |
| PUBLISH QoS1 Offline messages for persistent sessions | Supported | Supported |
| PUBLISH QoS1 Flow control<sup>2</sup> | N/A | Supported |
| PUBLISH Retain flag | Supported | Supported |
| PUBLISH Correlation Data | N/A | Supported |
| PUBLISH Response Topic | N/A | Supported |
| PUBLISH Payload Format Indicator | N/A | Supported |
| PUBLISH Message Expiry Interval | N/A | Supported |
| PUBLISH Topic Alias | N/A | Not Supported |
| PUBLISH User Properties | N/A | Supported |
| SUBSCRIBE | Supported | Supported |
| SUBSCRIBE Retain as Published | N/A | Supported |
| SUBSCRIBE Retain Handling | N/A | Supported |
| SUBSCRIBE Wildcards | Supported | Supported |
| SUBSCRIBE No Local | N/A | Supported |
| UNSUBSCRIBE | Supported | Supported |
| SUBSCRIBE Subscription Identifiers | N/A | Not Supported |
| SUBSCRIBE Shared Subscriptions | Supported | Supported |
| PINGREQ | Supported | Supported |
| DISCONNECT | Supported | Supported |
| DISCONNECT Session Expiry Interval | N/A | Supported |

<sup>1</sup> The broker sets the maximum allowed incoming packet size based on the memory profile.<br/>
<sup>2</sup> The broker sends out as many publishes as possible without waiting up to the client's Receive Maximum.

## Broker limits

The following limits aren't part of the MQTT specification. They describe how the MQTT broker allocates resources, and they're useful when you plan a deployment or troubleshoot client behavior.

### Offline messages for persistent sessions

When a client with a persistent session disconnects, the broker queues QoS 1 messages and delivers them when the client reconnects. The broker drops QoS 0 messages for offline sessions instead of queuing them.

The MQTT specification doesn't require a broker to queue QoS 0 messages for offline clients, so this behavior is a design choice rather than a gap. If you need delivery across a disconnection, subscribe at QoS 1.

### $SYS topics

The broker accepts subscriptions to `$SYS` topics, but it doesn't publish any `$SYS` messages. A subscription to a `$SYS` topic filter succeeds and then never receives a message.

`$SYS` topics aren't part of the MQTT specification. They're a convention that some brokers use to publish server metrics and status. To monitor the MQTT broker, use the metrics and logs that it emits instead. For more information, see [Deployment planning - Diagnostics](../deployment-plan/deployment-planning-diagnostics.md).

### Maximum QoS

The broker supports QoS 0 and QoS 1. It advertises `Maximum QoS` as `1` to MQTT v5 clients in the CONNACK packet, and it rejects any PUBLISH packet that uses QoS 2. This limit isn't configurable.

### Maximum packet size

The [memory profile](../deployment-plan/deployment-planning.md#choose-your-memory-profile) that you choose at deployment sets an upper bound on the largest packet the broker accepts:

| Memory profile | Maximum packet size |
| --- | --- |
| Tiny | 4 MB |
| Low | 16 MB |
| Medium (default) | 64 MB |
| High | 256 MB |

If you also set the `maxPacketSizeBytes` client setting, the broker uses the smaller of the two values, so you can't raise the maximum packet size above the memory profile bound. For more information, see [Deployment planning - Advanced MQTT options](../deployment-plan/deployment-planning-mqtt-options.md).

The broker advertises the resulting value as the `Maximum Packet Size` property in the CONNACK packet. If a client sends a larger packet, the broker disconnects it with the _Packet too large_ reason code.

This limit applies to packets that the broker _receives_. The broker doesn't honor the `Maximum Packet Size` property that a client sends in its CONNECT packet, so a client can receive packets that are larger than the size it advertises.

### Receive maximum

The broker advertises a `Receive Maximum` of `100` in the CONNACK packet. This value is the number of QoS 1 messages that the broker accepts from a client before the client waits for acknowledgments. This limit isn't configurable.

Don't confuse this value with the `maxReceiveMaximum` client setting. That setting is the upper bound on the `Receive Maximum` value that a _client_ can request in its CONNECT packet, and it controls the opposite direction of message flow. For more information, see [Deployment planning - Advanced MQTT options](../deployment-plan/deployment-planning-mqtt-options.md).

### Subscriptions per client

The broker doesn't limit the number of subscriptions that a single client can create.
