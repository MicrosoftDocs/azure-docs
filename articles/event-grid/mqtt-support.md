---
title: 'MQTT Support in Azure Event Grid'
description: 'Describes the MQTT Support in Azure Event Grid.'
ms.topic: conceptual
ms.date: 04/30/2023
author: george-guirguis
ms.author: geguirgu
---
# MQTT Support in Azure Event Grid
MQTT is a publish-subscribe messaging transport protocol that was designed for constrained environments. It’s efficient, scalable, and reliable, which made it the gold standard for communication in IoT scenarios. Event Grid supports clients that publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSockets, MQTT v5, and MQTT v5 over WebSockets. Event Grid also supports cross MQTT version (MQTT 3.1.1 and MQTT 5) communication.

MQTT v5 has introduced many improvements over MQTT v3.1.1 to deliver a more seamless, transparent, and efficient communication. It introduced:
- Better error reporting.
- More transparent communication  clients through features like user properties and content type.
- More control to clients over the communication through features like message and session expiry.
- Standard important patterns like the request-response pattern.

## Code Samples:

[This repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main) contains C# and C code samples that show how to send telemetry, send commands and their responses, and broadcast alerts. The certificates created through the samples are fit for testing, but they aren't fit for production environments. 



## Connection flow:

Your MQTT clients *must* connect over TLS 1.2 or TLS 1.3. Attempts to skip this step fail with connection. 

While connecting to Event Grid, use the following ports during communication over MQTT:

- MQTT v3.1.1 and MQTT v5 on TCP port 8883
- MQTT v3.1.1 over WebSocket and MQTTv5 over WebSocket on TCP port 443.

### The CONNECT packet should include the following properties:

- The ClientId field is required, and it should include the session name of the client. The session name needs to be unique across the namespace. You can use the client authentication name as the session name if each client is using one session per client. If one client is using multiple sessions, it needs to use different values for ClientId for each of its sessions.
- The Username field is required if you didn’t select a value in the  alternativeAuthenticationNameSources during namespace creation. In that case, you need to provide your client’s authentication name in the Username field. That name needs to match the authentication name provided and the value in the client’s certificate field that was specified during the client resource creation.

Learn more about [Client authentication](mqtt-client-authentication.md)

## Multi-session support

Multi-session support enables your application MQTT clients to have more scalable and reliable implementation by connecting to Event Grid with multiple active sessions at the same time. 

To create multiple sessions per client, provide the Username property in the CONNECT packet to signify your client authentication name, and the ClientID property in the CONNECT packet to signify the session name such as there are one or more values for the ClientID for each Username.

For example, the following combinations of Username and ClientIds in the CONNECT packet enables client Mgmt-application to connect to Event Grid over three independent sessions:

- First Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session1
- Second Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session2
- Third Session:
  - Username: Mgmt-application
  - ClientId: Mgmt-Session3

## Handling sessions:

- If a client tries to take over another client's active session by presenting its session name, its connection request will be rejected with an unauthorized error. For example, if Client B tries to connect to session 123 that is assigned at that time for client A, Client B's connection request will be rejected.
- If a client resource is deleted without ending its session, other clients won't be able to use its session name until the session expires. For example, If client B creates a session with session name 123 then client B deleted, client A won't be able to connect to session 123 until it expires.

## Limitations

The following lists detail the limitations to the MQTT support in Event Grid.

### MQTTv5 Limitations

MQTT v5 support is limited in following ways (communicated to client via CONNACK properties unless explicitly noted otherwise):
- Shared Subscriptions aren't supported yet.
- Retain flag isn't supported yet.
- Will Message isn't supported yet. Receiving a CONNECT request with Will Message will result in CONNACK with 0x83 (Implementation specific error).
- Maximum QoS is 1.
- Maximum Packet Size is 512 KiB
- Message ordering isn't guaranteed.
- Subscription Identifiers aren't supported.
- Assigned Client Identifiers aren't supported yet.
- Client-specified Session Expiry isn't supported. The server will override any Session Expiry Interval value coming in the CONNECT request (other than 0) with a fixed expiry interval (3600) in the CONNACK’s Session Expiry Interval property.
- Since the only supported authentication mode is through certificates, the server will respond to a CONNECT request with either Authentication Method or Authentication Data with a CONNACK with code 0x8C (Bad authentication method) or 0x87 (Not Authorized) respectively.
- Topic Alias Maximum is 10. The server won't assign any topic aliases for outgoing messages at this time. Clients can assign and use topic aliases within set limit.
- CONNACK doesn't return Response Information property even if the CONNECT request contains Request Response Information property.
- If the server receives a PUBACK from a client with non-success response code, the connection will be terminated.
- Keep Alive Maximum is 1160 seconds.

### MQTTv3.1.1 Limitations

MQTT v3.1.1 support is limited in the following ways:
- Will Message isn't supported yet. Receiving a CONNECT request with Will Message will result in a connection failure.
- QoS2 and Retain Flag aren't supported yet. A publish request with a retain flag or with a QoS2 will fail and close the connection.
- Message ordering isn't guaranteed.
- Keep Alive Maximum is 1160 seconds.

## Next steps:

Learn more about MQTT:

- [MQTT v3.1.1 Specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [MQTT v5 Specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)

Learn more about Event Grid’s MQTT support:
- [Client authentication](mqtt-client-authentication.md)
