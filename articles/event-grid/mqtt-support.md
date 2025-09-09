---
title: MQTT Features Supported by Azure Event Grid MQTT Broker
description: This article describes the MQTT features supported by the Azure Event Grid MQTT broker.
ms.topic: conceptual
ms.custom:
  - ignite-2023
  - build-2024
  - build-2025
ms.date: 07/30/2025
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# MQTT features supported by the Azure Event Grid MQTT broker

Message Queuing Telemetry Transport (MQTT) is a publish-subscribe messaging transport protocol that was designed for constrained environments. MQTT is efficient, scalable, and reliable, which makes it popular for communication in Internet of Things (IoT) scenarios. The MQTT broker supports clients that publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSocket, MQTT v5, and MQTT v5 over WebSocket. The MQTT broker also supports communication across MQTT versions (MQTT 3.1.1 and MQTT 5).

The MQTT broker in Azure Event Grid also supports devices and services sending MQTT messages over HTTPS, simplifying integration with non-MQTT clients. Event Grid allows you to send MQTT messages to the cloud for data analysis, storage, and visualizations, among other use cases. This feature is currently in preview.

MQTT v5 introduced many improvements over MQTT v3.1.1 to deliver a more seamless, transparent, and efficient communication. It added:

- Better error reporting.
- More transparent communication to clients through features like user properties and content type.
- More control to clients over the communication through features like message and session expiry.
- Standard important patterns like the request-response pattern.

## Connection flow

Your MQTT clients *must* connect over Transport Layer Security (TLS) 1.2 or TLS 1.3. Attempts to skip this step fail with connection.

When you connect to the MQTT broker, use the following ports during communication over MQTT:

- MQTT v3.1.1 and MQTT v5 on TCP port 8883
- MQTT v3.1.1 over WebSocket and MQTT v5 over WebSocket on TCP port 443

The CONNECT packet should include the following properties:

- The `ClientId` field is required, and it should include the session name of the client. The session name needs to be unique across the namespace. You can use the client authentication name as the session name if each client is using one session per client. If one client is using multiple sessions, it needs to use different values for `ClientId` for each of its sessions.
- The `Username` field is required if you didn't select a value in the `alternativeAuthenticationNameSources` during namespace creation. In that case, you need to provide your client's authentication name in the `Username` field. That name needs to match the authentication name provided and the value in the client's certificate field that was specified during the client resource creation.

Learn more about [client authentication](mqtt-client-authentication.md).

### Multi-session support

Multi-session support enables your application MQTT clients to have more scalable and reliable implementation by connecting to the MQTT broker with multiple active sessions at the same time.

#### Namespace configuration

Before you use this feature, you need to configure the namespace to allow multiple sessions per client. To configure multiple sessions per client in the Azure portal, follow these steps:

1. Go to your namespace in the Azure portal.
1. Under **Configuration**, change the value for **Maximum client sessions per authentication name** to the number of sessions per client that you want.
1. Select **Apply**.

>[!NOTE]
>For the Azure CLI configuration, update the `MaxClientSessionsPerAuthenticationName` property in the namespace payload with the value that you want.

#### Connection flow

The CONNECT packets for each session should include the following properties:

- Provide the `Username` property in the CONNECT packet to signify your client authentication name.
- Provide the `ClientID` property in the CONNECT packet to signify the session name, such as if there are one or more values for the client ID for each username.

For example, the following combinations of `Username` and `ClientId` in the CONNECT packet enable the client `Mgmt-application` to connect to the MQTT broker over three independent sessions:

- **First session**:
  - `Username`: `Mgmt-application`
  - `ClientId`: `Mgmt-Session1`
- **Second session**:
  - `Username`: `Mgmt-application`
  - `ClientId`: `Mgmt-Session2`
- **Third session**:
  - `Username`: `Mgmt-application`
  - `ClientId`: `Mgmt-Session3`

:::image type="content" source="media/mqtt-support/mqtt-multi-session-high-res.png" alt-text="Diagram that shows a multi-session example." border="false":::

For more information, see [Establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md).

#### Handle sessions

- If a client tries to take over another client's active session by presenting its session name with a different authentication name, its connection request is rejected with an unauthorized error. For example, if client B tries to connect to session *123* that's assigned at that time for client A, client B's connection request is rejected. However, if the same client tries to reconnect with the same session names and the same authentication name, it can take over its existing session.
- If a client resource is deleted without ending its session, other clients can't use its session name until the session expires. For example, if client B creates a session with session name *123* and then client B gets deleted, client A can't connect to session *123* until it expires.
- The limit for the number of sessions per client applies to online and offline sessions at any point in time. For example, consider a namespace with the maximum client sessions per authentication name set to *1*. Client A connects with a persistent session *123* and then gets disconnected. Client A can't connect with a new session *456* because its session *123* is still active even if it's offline. Accordingly, we recommend that the same client always reconnects with the same static session names as opposed to generating a new session name with every reconnect.

## MQTT features

The Event Grid MQTT broker supports the following MQTT features.

### Quality of Service

The MQTT broker supports Quality of Service (QoS) levels 0 and 1, which define the guarantee of message delivery on PUBLISH and SUBSCRIBE packets between clients and the MQTT broker.

- **QoS 0 guarantees at-most-once delivery**: The subscriber doesn't acknowledge messages with QoS 0, and the publisher doesn't retransmit them.
- **QoS 1 guarantees at-least-once delivery**: The subscriber acknowledges messages, and the publisher retransmits them if they weren't acknowledged.

QoS enables your clients to control the efficiency and reliability of the communication.

### Persistent sessions

The MQTT broker supports persistent sessions for MQTT v3.1.1 so that the MQTT broker preserves information about a client's session when it gets disconnected to ensure reliability of the communication. This information includes the client's subscriptions and missed or unacknowledged QoS 1 messages. Clients can configure a persistent session by setting the `cleanSession` flag in the CONNECT packet to `false`.

#### Clean start and session expiry

MQTT v5 introduced the clean start and session expiry features as an improvement over MQTT v3.1.1 in handling session persistence. Clean start allows a client to start a new session with the MQTT broker after discarding any previous session data. Session expiry allows a client to inform the MQTT broker when an inactive session is considered expired and automatically removed. 

In the CONNECT packet, a client can set the `Clean Start` flag to `true`. A client can also set a short session expiry interval for security reasons or to avoid any potential data conflicts that might have occurred during the previous session. A client can also set the `Clean Start` flag to `false` or a long session expiry interval to ensure the reliability and efficiency of persistent sessions.

#### Maximum session expiry interval configuration

You can configure the maximum session expiry interval allowed for all your clients that connect to the Event Grid namespace. For MQTT v3.1.1 clients, the configured limit is applied as the default session expiry interval for all persistent sessions. For MQTT v5 clients, the configured limit is applied as the maximum value for the session expiry interval property in the CONNECT packet. Any value that exceeds the limit is adjusted. The default value for this namespace property is one hour, and it can extend up to eight hours. To configure the maximum session expiry interval in the Azure portal, follow these steps:

1. Go to your namespace in the Azure portal.
1. Under **Configuration**, change the value for **Maximum session expiry interval in hours** to the limit that you want.
1. Select **Apply**.

:::image type="content" source="media/mqtt-support/mqtt-maximum-session-expiry-configuration.png" alt-text="Screenshot that shows the maximum session expiry interval configuration." border="false":::

#### Session overflow

The MQTT broker maintains a queue of messages for each active MQTT session that isn't connected, until the client connects with the MQTT broker again to receive the messages in the queue. If a client doesn't connect to receive the queued QoS 1 messages, the session queue accumulates messages until it reaches its limit of 100 messages or 1 MB. After the queue reaches its limit during the lifespan of the session, the session is terminated.

### Last Will and Testament messages

Last Will and Testament (LWT) notifies your MQTT clients with the abrupt disconnections of other MQTT clients. You can use LWT to ensure predictable and reliable flow of communication among MQTT clients during unexpected disconnections. This capability is valuable for scenarios where real-time communication, system reliability, and coordinated actions are critical. Clients that collaborate to perform complex tasks can react to LWT messages from each other by adjusting their behavior, redistributing tasks, or taking over certain responsibilities to maintain the system's performance and stability.

To use LWT, a client can specify the Will message, Will topic, and the rest of the Will properties in the CONNECT packet during connection. When the client disconnects abruptly, the MQTT broker publishes the Will message to all the clients that subscribed to the Will topic. To reduce the noise from fluctuating disconnections, the client can set the delay interval to a value greater than zero. In that case, if the client disconnects abruptly but restores the connection before the delay interval expires, the Will message isn't published.

### User properties

The MQTT broker supports user properties on MQTT v5 PUBLISH packets that you can use to add custom key/value pairs in the message header to provide more context about the message. The use cases for user properties are versatile. You can use this feature to include the purpose or origin of the message so that the receiver can handle the message without parsing the payload, which saves computing resources. For example, a message with a user property that indicates its purpose as a "warning" could trigger different handling logic than one with the purpose of "information."

### Request-response pattern

MQTT v5 introduced fields in the MQTT PUBLISH packet header that provide context for the response message in the request-response pattern. These fields include a response topic and a correlation ID that the responder can use in the response without prior configuration. The response information enables more efficient communication for the standard request-response pattern that's used in command-and-control scenarios.

:::image type="content" source="media/mqtt-support/mqtt-request-response-high-res.png" alt-text="Diagram that shows a request-response pattern example." border="false":::

### Message expiry interval

In MQTT v5, the message expiry interval allows messages to have a configurable lifespan. The message expiry interval is defined as the time interval between the time that a message is published to the MQTT broker and the time when the broker needs to discard the undelivered message. This feature is useful in scenarios where messages are valid for only a certain amount of time, such as time-sensitive commands, real-time data streaming, or security alerts. By setting a message expiry interval, the MQTT broker can automatically remove outdated messages. This step ensures that only relevant information is available to subscribers. If a message's expiry interval is set to zero, it means the message should never expire.

### Topic aliases

In MQTT v5, topic aliases allow a client to use a shorter alias in place of the full topic name in the published message. The MQTT broker maintains a mapping between the topic alias and the actual topic name. This feature can save network bandwidth and reduce the size of the message header, particularly for topics with long names. It's useful in scenarios where the same topic is repeatedly published in multiple messages, such as in sensor networks. The MQTT broker supports up to 10 topic aliases. A client can use a `Topic Alias` field in the PUBLISH packet to replace the full topic name with the corresponding alias.

:::image type="content" source="media/mqtt-support/mqtt-topic-alias-high-res.png" alt-text="Diagram that shows the topic alias example." border="false":::

### Flow control

In MQTT v5, flow control refers to the mechanism for managing the rate and size of messages that a client can handle. To configure flow control, set the `Maximum Packet Size` and `Receive Maximum` parameters in the CONNECT packet. The `Receive Maximum` parameter allows the client to limit the number of messages sent by the broker to the number of messages that the client can handle. The `Maximum Packet Size` parameter defines the maximum size of packets that the client can receive. The MQTT broker has a message size limit of 512 KiB. This feature ensures the reliability and stability of the communication for constrained devices with limited processing speed or storage capabilities.

### Negative acknowledgments and server-initiated disconnect packet

For MQTT v5, the MQTT broker can send negative acknowledgments and server-initiated disconnect packets that provide the client with more information about failures for message delivery or connection. These features help the client diagnose the reason behind a failure and take appropriate mitigating actions. The MQTT broker uses the reason codes that are defined in the [MQTT v5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html).

### Message ordering

MQTT v5 ensures in-order message delivery within each topic and each client when QoS level 1 is used, which is crucial for workflows that require sequence integrity. It's ideal for scenarios like telemetry, command execution, and time-series data.

However, it doesn't guarantee ordering across different topics or when messages are sent with varying QoS levels. To learn more, contact us at [askmqtt@microsoft.com](mailto:askmqtt@microsoft.com).

### Assigned client identifiers

MQTT v5 introduces support for assigned client identifiers, which allows the MQTT broker to generate and return a unique client ID when the client doesn't provide one. MQTT broker support for this feature ensures seamless client onboarding and reduces the need for clients to manage their own identifiers. It's especially useful in scenarios where client provisioning is dynamic or when devices have no preconfigured identity. Assigned client IDs can be retrieved from the CONNACK response and reused for future sessions to maintain consistent identification.

#### Manage client identifier and session limits in MQTT

- Assigned client identifiers allow clients to connect without specifying predefined identifiers, enabling temporary or persistent sessions.
- Clients can avoid being locked out by using short session expiry intervals during the first connection and saving the assigned client identifier for future use.
- For firmware updates or resets, clients should either retain their known client identifier or use modest session expiry intervals to avoid prolonged lockouts.
- Namespace configuration can increase session limits per client to minimize disruptions during updates or rollbacks.

## Current limitations

The MQTT broker is adding more MQTT v5 and MQTT v3.1.1 features in the future to align more with the MQTT specifications. The following list details the current differences between features supported by the MQTT broker and the MQTT specifications.

### MQTT v5 current limitations

MQTT v5 currently differs from the [MQTT v5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html) in the following ways:

- Shared subscriptions aren't supported yet.
- Maximum Will delay interval is 300.
- Maximum QoS is 1.
- Maximum packet size is 512 KiB.
- Subscription identifiers aren't supported.
- Topic alias maximum is 10. The server doesn't assign any topic aliases for outgoing messages at this time. Clients can assign and use topic aliases within the set limit.
- CONNACK doesn't return the `Response Information` property even if the CONNECT request contains the `Request Response Information` property.
- User properties on CONNECT, SUBSCRIBE, DISCONNECT, PUBACK, and AUTH packets aren't used by the service, so they aren't supported. If any of these requests include user properties, the request fails.
- If the server receives a PUBACK packet from a client with a nonsuccess response code, the connection is terminated.
- Keep Alive maximum is 1,160 seconds.

### MQTTv3.1.1 current limitations

MQTT v5 currently differs from the [MQTT v3.1.1 specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) in the following ways:

- QoS 2 isn't supported. A publish request with a `RETAIN` flag or with a QoS 2 fails and closes the connection.
- Keep Alive maximum is 1,160 seconds.

## Code samples

[This repository](https://github.com/Azure-Samples/MqttApplicationSamples) contains C#, C, and Python code samples that show how to send telemetry, send commands, and broadcast alerts. The certificates created through the samples are fit for testing, but they aren't fit for production environments.

## Related content

To learn more about MQTT, see the [MQTT v5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html).
To learn more about the MQTT broker, see:

- [Client authentication](mqtt-client-authentication.md)
- [Establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md)
