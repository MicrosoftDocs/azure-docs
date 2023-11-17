---
title: 'MQTT Features Support by Azure Event Grid’s MQTT broker feature'
description: 'Describes the MQTT features supported by Azure Event Grid’s MQTT broker feature.'
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---

# MQTT features supported by Azure Event Grid’s MQTT broker feature
MQTT is a publish-subscribe messaging transport protocol that was designed for constrained environments. It’s efficient, scalable, and reliable, which made it the gold standard for communication in IoT scenarios.  MQTT broker supports clients that publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSockets, MQTT v5, and MQTT v5 over WebSockets. MQTT broker also supports cross MQTT version (MQTT 3.1.1 and MQTT 5) communication.



MQTT v5 has introduced many improvements over MQTT v3.1.1 to deliver a more seamless, transparent, and efficient communication. It added:
- Better error reporting.
- More transparent communication  clients through features like user properties and content type.
- More control to clients over the communication through features like message and session expiry.
- Standard important patterns like the request-response pattern.

## Connection flow:

Your MQTT clients *must* connect over TLS 1.2 or TLS 1.3. Attempts to skip this step fail with connection. 

While connecting to MQTT broker, use the following ports during communication over MQTT:

- MQTT v3.1.1 and MQTT v5 on TCP port 8883
- MQTT v3.1.1 over WebSocket and MQTTv5 over WebSocket on TCP port 443.

The CONNECT packet should include the following properties:

- The ClientId field is required, and it should include the session name of the client. The session name needs to be unique across the namespace. You can use the client authentication name as the session name if each client is using one session per client. If one client is using multiple sessions, it needs to use different values for ClientId for each of its sessions.
- The Username field is required if you didn’t select a value in the  alternativeAuthenticationNameSources during namespace creation. In that case, you need to provide your client’s authentication name in the Username field. That name needs to match the authentication name provided and the value in the client’s certificate field that was specified during the client resource creation.

Learn more about [Client authentication](mqtt-client-authentication.md)

### Multi-session support

Multi-session support enables your application MQTT clients to have more scalable and reliable implementation by connecting to MQTT broker with multiple active sessions at the same time. 


#### Namespace configuration 
Before using this feature, you need to configure the namespace to allow multiple sessions per client. Use the following steps to configure multiple sessions per client in the Azure portal:
- Go to your namespace in the Azure portal.
- Under **Configuration**, change the value for the **Maximum client sessions per authentication name** to the desired number of sessions per client.
- Select **Apply**.

>[!NOTE] 
>For the Azure CLI configuration, update the **MaxClientSessionsPerAuthenticationName** property in the namespace payload with the desired value.

#### Connection flow:
The CONNECT packets for each session should include the following properties:
- Provide the Username property in the CONNECT packet to signify your client authentication name.
- Provide the ClientID property in the CONNECT packet to signify the session name such as there are one or more values for the ClientID for each Username.

For example, the following combinations of Username and ClientIds in the CONNECT packet enable the client "Mgmt-application" to connect to MQTT broker over three independent sessions:

- First Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session1
- Second Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session2
- Third Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session3

:::image type="content" source="media/mqtt-support/mqtt-multi-session-high-res.png" alt-text="Diagram of a multi-session example." border="false":::

For more information, see [How to establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md) 

#### Handling sessions:

- If a client tries to take over another client's active session by presenting its session name with a different authentication name, its connection request is rejected with an unauthorized error. For example, if Client B tries to connect to session 123 that is assigned at that time for client A, Client B's connection request is rejected. That being said, if the same client tries to reconnect with the same session names and the same authentication name, it is able to take over its existing session.
- If a client resource is deleted without ending its session, other clients can't use its session name until the session expires. For example, If client B creates a session with session name 123 then client B gets deleted, client A can't connect to session 123 until it expires.
- The limit for the number of sessions per client applies to online and offline sessions at any point in time. For example, consider a namespace with the maximum client sessions per authentication name is set to 1. If client A connects with a persistent session 123 then gets disconnected, client A won't be able to connect with a new session 456 since its session 123 is still active even if it's offline. Accordingly, we recommend that the same client always reconnects with the same static session names as opposed to generating a new session name with every reconnect.

## MQTT features
Azure Event Grid’s MQTT broker feature supports the following MQTT features:

### Quality of service (QoS)
MQTT broker supports QoS 0 and 1, which define the guarantee of message delivery on PUBLISH and SUBSCRIBE packets between clients and MQTT broker. QoS 0 guarantees at-most-once delivery; messages with QoS 0 aren’t acknowledged by the subscriber nor get retransmitted by the publisher. QoS 1 guarantees at-least-once delivery; messages are acknowledged by the subscriber and get retransmitted by the publisher if they didn’t get acknowledged. QoS enables your clients to control the efficiency and reliability of the communication.
### Persistent sessions
MQTT broker supports persistent sessions for MQTT v3.1.1 such that MQTT broker preserves information about a client’s session in case of disconnections to ensure reliability of the communication. This information includes the client’s subscriptions and missed/ unacknowledged QoS 1 messages. Clients can configure a persistent session through setting the cleanSession flag in the CONNECT packet to false.
#### Clean start and session expiry
MQTT v5 has introduced the clean start and session expiry features as an improvement over MQTT v3.1.1 in handling session persistence. Clean Start is a feature that allows a client to start a new session with MQTT broker, discarding any previous session data. Session Expiry allows a client to inform MQTT broker when an inactive session is considered expired and automatically removed. In the CONNECT packet, a client can set Clean Start flag to true and/or short session expiry interval for security reasons or to avoid any potential data conflicts that might have occurred during the previous session. A client can also set a clean start to false and/or long session expiry interval to ensure the reliability and efficiency of persistent sessions.

#### Maximum session expiry interval configuration
You can configure the maximum session expiry interval allowed for all your clients connecting to the Event Grid namespace. For MQTT v3.1.1 clients, the configured limit is applied as the default session expiry interval for all persistent sessions. For MQTT v5 clients, the configured limit is applied as the maximum value for the Session Expiry Interval property in the CONNECT packet; any value that exceeds the limit will be adjusted. The default value for this namespace property is 1 hour and can be extended up to 8 hours. Use the following steps to configure the maximum session expiry interval in the Azure portal:
- Go to your namespace in the Azure portal.
- Under **Configuration**, change the value for the **Maximum session expiry interval in hours** to the desired limit.
- Select **Apply**.

:::image type="content" source="media/mqtt-support/mqtt-maximum-session-expiry-configuration.png" alt-text="screenshot for the maximum session expiry interval configuration." border="false":::

#### Session overflow
MQTT broker maintains a queue of messages for each active MQTT session that isn't connected, until the client connects with MQTT broker again to receive the messages in the queue. If a client doesn't connect to receive the queued QOS1 messages, the session queue starts accumulating the messages until it reaches its limit: 100 messages or 1 MB. Once the queue reaches its limit during the lifespan of the session, the session is terminated.

### User properties 
MQTT broker supports user properties on MQTT v5 PUBLISH packets that allow you to add custom key-value pairs in the message header to provide more context about the message. The use cases for user properties are versatile. You can use this feature to include the purpose or origin of the message so the receiver can handle the message without parsing the payload, saving computing resources. For example, a message with a user property indicating its purpose as a "warning" could trigger different handling logic than one with the purpose of "information."

### Request-response pattern
MQTTv5 introduced fields in the MQTT PUBLISH packet header that provide context for the response message in the request-response pattern. These fields include a response topic and a correlation ID that the responder can use in the response without prior configuration. The response information enables more efficient communication for the standard request-response pattern that is used in command-and-control scenarios.

:::image type="content" source="media/mqtt-support/mqtt-request-response-high-res.png" alt-text="Diagram of the request-response pattern example." border="false":::

### Message expiry interval:
In MQTT v5, message expiry interval allows messages to have a configurable lifespan. The message expiry interval is defined as the time interval between the time a message is published to MQTT broker and the time when the MQTT broker needs to discard the message if it hasn't been delivered. This feature is useful in scenarios where messages are only valid for a certain amount of time, such as time-sensitive commands, real-time data streaming, or security alerts. By setting a message expiry interval, MQTT broker can automatically remove outdated messages, ensuring that only relevant information is available to subscribers. If a message's expiry interval is set to zero, it means the message should never expire.

### Topic aliases:
In MQTT v5, topic aliases allow a client to use a shorter alias in place of the full topic name in the published message. MQTT broker maintains a mapping between the topic alias and the actual topic name. This feature can save network bandwidth and reduce the size of the message header, particularly for topics with long names. It's useful in scenarios where the same topic is repeatedly published in multiple messages, such as in sensor networks. MQTT broker supports up to 10 topic aliases. A client can use a Topic Alias field in the PUBLISH packet to replace the full topic name with the corresponding alias.

:::image type="content" source="media/mqtt-support/mqtt-topic-alias-high-res.png" alt-text="Diagram of the topic alias example." border="false":::

### Flow control
In MQTT v5, flow control refers to the mechanism for managing the rate and size of messages that a client can handle. Flow control can be configured by setting the Maximum Packet Size and Receive Maximum parameters in the CONNECT packet. The Receive Maximum parameter allows the client to limit the number of messages sent by the broker to the number of messages that the client is able to handle. The Maximum Packet Size parameter defines the maximum size of packets that the client can receive. MQTT broker has a message size limit of 512 KiB. This feature ensures reliability and stability of the communication for constrained devices with limited processing speed or storage capabilities.

### Negative acknowledgments and server-initiated disconnect packet
For MQTT v5, MQTT broker is able to send negative acknowledgments (NACKs) and server-initiated disconnect packets that provide the client with more information about failures for  message delivery or connection. These features help the client diagnose the reason behind a failure and take appropriate mitigating actions. MQTT broker uses the reason codes that are defined in the [MQTT v5 Specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)

## Current limitations

MQTT broker is adding more MQTT v5 and MQTT v3.1.1 features in the future to align more with the MQTT specifications. The following list details the current differences between features supported by the MQTT broker and the MQTT specifications:

### MQTTv5 current limitations

MQTT v5 currently differs from the [MQTT v5 Specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html) in the following ways:
- Shared Subscriptions aren't supported yet.
- Retain flag isn't supported yet.
- Will Message isn't supported yet. Receiving a CONNECT request with Will Message results in CONNACK with 0x83 (Implementation specific error).
- Maximum QoS is 1.
- Maximum Packet Size is 512 KiB
- Message ordering isn't guaranteed.
- Subscription Identifiers aren't supported.
- Assigned Client Identifiers aren't supported yet.
- Topic Alias Maximum is 10. The server doesn't assign any topic aliases for outgoing messages at this time. Clients can assign and use topic aliases within set limit.
- CONNACK doesn't return Response Information property even if the CONNECT request contains Request Response Information property.
- User Properties on CONNECT, SUBSCRIBE, DISCONNECT, PUBACK, AUTH packets are not used by the service so they're not supported. If any of these requests include user properties, the request will fail.
- If the server receives a PUBACK from a client with non-success response code, the connection is terminated.
- Keep Alive Maximum is 1160 seconds.

### MQTTv3.1.1 current limitations

MQTT v5 currently differs from the [MQTT v3.1.1 Specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) in the following ways:
- Will Message isn't supported yet. Receiving a CONNECT request with Will Message results in a connection failure.
- QoS2 and Retain Flag aren't supported yet. A publish request with a retain flag or with a QoS2 fails and closes the connection.
- Message ordering isn't guaranteed.
- Keep Alive Maximum is 1160 seconds.

## Code samples:

[This repository](https://github.com/Azure-Samples/MqttApplicationSamples) contains C#, C, and python code samples that show how to send telemetry, send commands, and broadcast alerts. Note that the certificates created through the samples are fit for testing, but they aren't fit for production environments. 

## Next steps:

Learn more about MQTT:
- [MQTT v3.1.1 Specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [MQTT v5 Specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)

Learn more about MQTT broker:
- [Client authentication](mqtt-client-authentication.md)
- [How to establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md) 
