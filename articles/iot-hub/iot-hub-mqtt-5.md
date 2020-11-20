---
 title: Azure IoT Hub MQTT 5 support (preview)
 description: Learn about IoT Hub's MQTT 5 support
 services: iot-hub
 author: jlian
 ms.service: iot-fundamentals
 ms.topic: conceptual
 ms.date: 11/19/2020
 ms.author: jlian
---

# IoT Hub MQTT 5 support overview (preview)

**Version:** 2.0
**api-version:** 2020-10-01-preview

This document defines IoT Hub data plane API over MQTT version 5.0 protocol. See [API Reference](iot-hub-mqtt-5-reference.md) for complete definitions in this API.

## Prerequisites

- You must enable [preview mode]() on a brand new IoT hub to try MQTT 5.
- Prior knowledge of [MQTT 5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html) is required.

## Level of support and limitations

IoT Hub support for MQTT 5 is in preview and limited in following ways (communicated to client via `CONNACK` properties unless explicitly noted otherwise):

- Subscription identifiers are not supported.
- Shared subscriptions are not supported.
- `RETAIN` is not supported.
- `Maximum QoS` is `1`.
- `Maximum Packet Size` is `256 KiB` (subject to further restrictions per operation).
- Assigned Client IDs are not supported.
- `Keep Alive` is limited to `19 min` (max delay for liveness check – `28.5 min`).
- `Topic Alias Maximum` is `10`.
- `Response Information` is not supported; `CONNACK` will not return `Response Information` property even if `CONNECT` contains `Request Response Information` property.
- `Receive Maximum` (maximum number of allowed outstanding unacknowledged `PUBLISH` packets (in client-server direction) with `QoS: 1`) is `16`.
- Single client can have no more than `50` subscriptions.
  When the limit is reached, `SUBACK` will return `0x97` (Quota exceeded) reason code for subscriptions.

## Connection lifecycle

### Connection

In order to connect to IoT Hub using this API, client must establish connection per MQTT 5 specification.
Client must send `CONNECT` packet within 30 seconds following successful TLS handshake, or the server closes the connection.
Here's an example of `CONNECT` packet:

```yaml
-> CONNECT
    Protocol_Version: 5
    Clean_Start: 0
    Client_Id: D1
    Authentication_Method: SAS
    Authentication_Data: {SAS bytes}
    api-version: 2020-10-10
    host: abc.azure-devices.net
    sas-at: 1600987795320
    sas-expiry: 1600987195320
    client-agent: artisan;Linux
```

- `Authentication Method` property is required and identifies which authentication method is used. See [Authentication](#Authentication) for more details.
- `Authentication Data` property handling depends on `Authentication Method`. If `Authentication Method` is set to `SAS`, then `Authentication Data` is required and must contain valid signature (see [Authentication](#Authentication) for more details).
- `api-version` property is required and must be set to API version value provided in this specification's header for this specification to apply.
- `host` property defines host name of the tenant. It is required unless SNI extension was presented in Client Hello record during TLS handshake
- `sas-at` defines time of connection.
- `sas-expiry` defines expiration time for the provided SAS.
- `client-agent` optionally communicates information about the client creating the connection.

> [!NOTE]
> `Authentication Method` and other properties throughout the specification with capitalized names are first-class properties in MQTT 5 - they are described in details in MQTT 5 specification. `api-version` and other properties in dash case are user properties specific to IoT Hub API.

IoT Hub responds with `CONNACK` packet once it finishes with authentication and fetching data to support the connection. If connection is established successfully, `CONNACK` looks like:

```yaml
<- CONNACK
    Session_Present: 1
    Reason_Code: 0x00
    Session_Expiry_Interval: 0xFFFFFFFF # included only if CONNECT specified value less than 0xFFFFFFFF and more than 0x00
    Receive_Maximum: 16
    Maximum_QoS: 1
    Retain_Available: 0
    Maximum_Packet_Size: 262144
    Topic_Alias_Maximum: 10
    Subscription_Identifiers_Available: 0
    Shared_Subscriptions_Available: 0
    Server_Keep_Alive: 1140 # included only if client did not specify Keep Alive or if it specified a bigger value
```

First-class MQTT properties are set per MQTT specification and reflect the capabilities that IoT Hub does or does not support.

### Authentication

The `Authentication Method` property on `CONNECT` client defines what kind of authentication it uses for this connection:

- `SAS` - Shared Access Signature is provided in `CONNECT`'s `Authentication Data` property,
- `X509` - client relies on client certificate authentication.

If authentication method does not match that configured for the client in IoT Hub, authentication fails.

> [!NOTE]
> This API requires `Authentication Method` property to be set in `CONNECT` packet. If `Authentication Method` property is not provided, connection fails with `Bad Request` response.

Username/password authentication used in previous API versions is not supported.

#### SAS

With SAS-based authentication, client must prove authenticity of MQTT connection by providing signature of connection context information.
Signature must be based on one of two authentication keys per client's configuration in IoT Hub or one of two Shared access keys of a [Shared access policy](iot-hub-devguide-security.md).

String to sign must be formed as follows:

```text
{host name}\n
{Client Id}\n
{sas-policy}\n
{sas-at}\n
{sas-expiry}\n
```

- `host name` is derived either from SNI extension (presented by client in Client Hello record during TLS handshake) or `host` user property in `CONNECT` packet.
- `Client Id` is Client Identifier in `CONNECT` packet.
- `sas-policy` - if present, defines IoT Hub access policy used for authentication. It is encoded as user property on `CONNECT` packet. Optional: omitting it means authentication settings in device registry will be used instead.
- `sas-at` - if present, specifies time of connection - current time. It is encoded as user property of `time` type on `CONNECT` packet.
- `sas-expiry` defines expiration time for the authentication. It is `time`-typed user property on `CONNECT` packet. It is required.

For optional parameters, if omitted, empty string MUST be used instead in string to sign.

HMAC-SHA256 is used to hash the string based on one of device's symmetric keys. Hash value is then set as value of `Authentication Data` property.

#### X509

If `Authentication Method` property is set to `X509`, IoT Hub authenticates the connection based on the provided client certificate.

#### Re-authentication

If SAS-based authentication is used, we recommend using short-lived authentication tokens. In order to keep connection authenticated and prevent disconnection due to expiration, client must perform re-authentication by sending `AUTH` packet with `Reason Code: 0x19` (re-authentication):

```yaml
-> AUTH
    Reason_Code: 0x19
    Authentication_Method: SAS
    Authentication_Data: {SAS bytes}
    sas-at: {current time}
    sas-expiry: {SAS expiry time}
```

Rules:

- `Authentication Method` must be the same as the one used for initial authentication
- if connection was originally authenticated using SAS based on Shared Access Policy, signature used in re-authentication must be based on the same policy.

If re-authentication succeeds, IoT Hub sends `AUTH` packet with `Reason Code: 0x00` (success). Otherwise, IoT Hub sends `DISCONNECT` packet with `Reason Code: 0x87` (Not authorized) and closes the connection.

### Disconnection

Server can disconnect client for a variety of reasons:

- client is misbehaving in a way that is impossible to respond to with negative acknowledgement (or response) directly,
- server is failing to keep state of the connection up to date,
- client with the same identity has connected.

Server may disconnect with any reason code defined in MQTT 5.0 specification. Notable mentions:

- `135` (Not authorized) when re-authentication fails, current SAS token expires or device's credentials change
- `142` (Session taken over) when new connection with the same client identity has been opened.
- `159` (Connection rate exceeded) when connection rate for the IoT hub exceeds  
- `131` (Implementation specific error) is used for any custom errors defined in this API. `status` and `reason` properties will be used to communicate further details about the cause for disconnection (see [Response](#Response) for details).

## Operations

All the functionality in this API is expressed as operations. Here is an example of Send Telemetry operation:

```yaml
-> PUBLISH
    QoS: 1
    Packet_Id: 3
    Topic: $iothub/telemetry
    Payload: Hello

<- PUBACK
    Packet_Id: 3
    Reason_Code: 0
```

For complete specification of operations in this API, see [API Reference](TODO/LINK/TO/SPEC).

> [!NOTE]
> All the samples in this specification are shown from client's perspective. Sign `->` means client sending packet, `<-` - receiving.

### Message topics and subscriptions

Topics used in operations' messages in this API start with `$iothub/`.
MQTT broker semantics don't apply to these operations (see "[Topics beginning with \$](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901246)" for details).
Topics starting with `$iothub/` that are not defined in this API are not supported:

- Sending messages to undefined topic results in `Not Found` response (see [Response](#Response) for details below),
- Subscribing to undefined topic results in `SUBACK` with `Reason Code: 0x8F` (Topic Filter Invalid).

Topic names and property names are case sensitive and must be spelled exactly as defined, e.g. `$iothub/telemetry/` is not supported while `$iothub/telemetry` is.

**NOTE:** Wildcards in subscriptions under `$iothub/..` are generally not supported, e.g. client cannot subscribe to `$iothub/+` or `$iothub/#`. An attempt to subscribe with wildcard results in `SUBACK` with `Reason Code: 0xA2` (Wildcard Subscriptions not supported). Only single-segment wildcards (`+`) are supported in stead of path parameters in topic name for operations that have them.

### Interaction types

All the operations in this API are based on one of two interaction types:

- Message with optional acknowledgement (MessageAck)
- Request-Response (ReqRep)

Operations also vary by direction (determined by direction of initial message in exchange):

- Client-to-Server (c2s)
- Server-to-Client (s2c)

For example, Send Telemetry is Client-to-Server operation of "Message with acknowledgement" type, while Handle Direct Method is Server-to-Client operation of Request-Response type.

#### Message-acknowledgement interactions

Message with optional Acknowledgement (MessageAck) interaction is expressed as an exchange of `PUBLISH` and `PUBACK` packets in MQTT. Acknowledgement is optional and sender may choose to not request it by sending `PUBLISH` packet with `QoS: 0`.

> [!NOTE]
> If properties in `PUBACK` packet must be truncated due to `Maximum Packet Size` declared by the client, IoT Hub will retain as many User properties as it can fit within the given limit. User properties listed first have higher chance to be sent than those listed later; `Reason String` property has the least priority.

##### Example of simple MessageAck interaction

Message:

```yaml
PUBLISH
    QoS: 1
    Packet_Id: 34
    Topic: $iothub/{request.path}
    Payload: <any>
```

Acknowledgement (success):

```yaml
PUBACK
    Packet_Id: 34
    Reason_Code: 0
```

#### Request-Response Interactions

In Request-Response (ReqRep) interactions, both Request and Response translate into `PUBLISH` packets with `QoS: 0`.

`Correlation Data` property must be set in both and is used to match Response packet to Request packet.

This API uses single response topic `$iothub/responses` for all ReqRep operations. Subscribing to / unsubscribing from this topic for client-to-server operations is not required - server assumes all clients to be subscribed.

##### Example of simple ReqRep interaction

Request:

```yaml
PUBLISH
    QoS: 0
    Topic: $iothub/{request.path}
    Correlation_Data: 0x01 0xFA
    Payload: ...
```

Response (success):

```yaml
PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: 0x01 0xFA
    Payload: ...
```

ReqRep interactions don't support `PUBLISH` packets with `QoS: 1` as request or response messages. Sending Request `PUBLISH` results in `Bad Request` response.

Maximum length supported in `Correlation Data` property is 16 bytes. If `Correlation Data` property on `PUBLISH` packet is set to a value longer than 16 bytes, IoT Hub sends `DISCONNECT` with `Bad Request` outcome, and closes the connection. This only applies to packets exchanged within this API.

> [!NOTE]
> Correlation Data is an arbitrary byte sequence, e.g. it is not guaranteed to be UTF-8 string.
>
> ReqRep use predefined topics for response; Response Topic property in Request `PUBLISH` packet (if set by the sender) is ignored.

IoT Hub automatically subscribes client to response topics for all client-to-server ReqRep operations. Even if client explicitly unsubscribes from response topic, IoT Hub reinstates the subscription automatically. For server-to-client ReqRep interactions, it is still necessary for device to subscribe.

### Message Properties

Operation properties - system or user-defined - are expressed as packet properties in MQTT 5.

User property names are case sensitive and must be spelled exactly as defined. For example, `Trace-ID` is not supported while `trace-id` is.

All User properties with names that are not in the specification and do not have prefix `@` are be considered a request error.

System properties are encoded either as first class properties (e.g. `Content Type`) or as User properties. Specification provides exhaustive list of supported system properties.
All first class properties are ignored unless support for them is explicitly stated in the specification.

Where user-defined properties are allowed, their names must follow the format `@{property name}`. User-defined properties only support valid UTF-8 string values. E.g. `MyProperty1` property with value `15` must be encoded as User property with name `@MyProperty` and value `15`.

If IoT Hub doens't recognize User property, it is considered an error and IoT Hub responds with `PUBACK` with `Reason Code: 0x83` (Implementation specific error) and `status: 0100` (Bad Request). If acknowledgement was not requested (QoS: 0), `DISCONNECT` packet with the same error will be sent back and connection is terminated.

This API defines following data types besides `string`:

- `time`: number of milliseconds since `1970-01-01T00:00:00.000Z`. E.g. `1600987195320` for `2020-09-24T22:39:55.320Z`,
- `u32`: unsigned 32-bit integer number,
- `u64`: unsigned 64-bit integer number,
- `i32`: signed 32-bit integer number.

### Response

Interactions can result in different outcomes: `Success`, `Bad Request`, `Not Found`, and others.
Outcomes can be distinguished from each other by `status` user property. `Reason Code` in `PUBACK` packets (for MessageAck interactions) is set to match `status` in meaning where possible.

> [!NOTE]
> If client specifies `Request Problem Information: 0` in CONNECT packet, no user properties will be sent on PUBACK packets to comply with MQTT 5 specification, including `status` property. In this case, client can still rely on `Reason Code` to determine whether acknowledge is positive or negative. 

Every interaction has a single outcome designated as default (or success). It has `Reason Code` of `0` and the default value of `status` property - not set.

If interaction completes with an alternative outcome, it is communicated accordingly:

- For MessageAck interactions, PUBACK will have a `Reason Code` other than 0x0 (Success). `status` property may be present to further clarify the outcome.
- For ReqRep interactions, Response PUBLISH will have `status` property set.
- For MessageAck interactions that were sent with `QoS: 0` and therefore there's no way to respond directly, DISCONNECT packet will be sent instead with response information instead, followed by disconnect.

Examples:

Bad Request (MessageAck):

```yaml
PUBACK
    Reason_Code: 131
    status: 0100
    reason: Unknown property `test`
```

Not Authorized (MessageAck):

```yaml
PUBACK
    Reason_Code: 135
    status: 0101
```

Not Authorized (ReqRep):

```yaml
PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: ...
    status: 0101
```

IoT Hub will (when warranted) include following user properties:

- `status` - IoT Hub's extended code for operation's status. This code can be used to differentiate outcomes (as described above) and act upon them accordingly.
- `trace-id` – trace ID for the operation; IoT Hub may retain additional diagnostics concerning the operation that could be used for internal investigation.
- `reason` - human-readable message providing further information on why operation ended up in a state indicated by `status` property.

> [!NOTE]
> If client sets `Maximum Packet Size` property in CONNECT packet to a very small value, not all user properties may fit and would not appear in the packet.
> 
> `reason` is meant only for people and should not be used in client logic. This API allows for messages to be changed at any point without warning or change of version.
>
> If client sends `RequestProblemInformation: 0` in CONNECT packet, user properties will not be included in acknowledgements per [MQTT 5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901053).

#### Status code

`status` property carries status code for operation to is optimized for machine reading efficiency.
It consists of two byte unsigned integer encoded as hex in string, e.g. `0501`.
Code structure (bit map):

```text
7 6 5 4 3 2 1 0 | 7 6 5 4 3 2 1 0
0 0 0 0 0 R T T | C C C C C C C C
```

First byte is used for flags:

- bits 0 and 1 indicate type of outcomes:
  - `00` - success
  - `01` - client error
  - `10` - server error
- bit 2: `1` indicates error is retryable
- bits 3 through 7 are reserved and must be set to `0`

Second byte contains actual distinct response code.
Error codes with different flags can have the same second byte value.
E.g. there can be `0001`, `0101`, `0201`, `0301` error codes having distinct meaning.

For example, `Too Many Requests` is a client, retryable error with own code of `1`. Its value is
`0000 0101 0000 0001` or `0x0501`.

Clients may use type bits in order to identify whether operation concluded successfully.
Clients may use retryable bit to decide whether it is sensible to retry operation.

## Recommendations

### Session management

CONNACK packet carries `Session Present` property to indicate whether server restored previously created session. Client can use it to figure out whether it needs to subscribe to topics of interest or whether it can skip subscribing on assumption that subscription was done before.

In order to be able to rely on `Session Present` client would either need to keep track of subscriptions it has already made (i.e. sent SUBSCRIBE packet and received SUBACK with successful reason code), or make sure to subscribe to all topics in a single SUBSCRIBE/SUBACK exchange. Otherwise, if client sends two SUBSCRIBE packets and only one of them is processed successfully by server, server will communicate `Session Present: 1` in CONNACK while having only part of client's subscriptions accepted.

When client behavior changes however (e.g. as part of firmware update), it is encouraged to forego this optimization and subscribe unconditionally in case previous version of client did not subscribe to all the topics new code would. Also, to ensure no stale subscriptions are left behind taking from maximum allowed number of subscriptions, it is recommended to explicitly unsubscribe from subscriptions that are no longer in use.

### Batching

There is no special format to send a batch of messages. Instead it is advised to bundle packets (`PUBLISH`, `PUBACK`, `SUBSCRIBE`, etc.) together before handing them over to underlying TLS/TCP stack. That will reduce overhead of resource-intensive operations in TLS and networking. In addition, client can facilitate topic alias support within the "batch":

- Put complete topic name in the first PUBLISH packet for the connection and associate topic alias with it,
- Put following packets for the same topic with empty topic name and topic alias property.

## Migration

This section lists the changes in the API compared to [previous MQTT API](iot-hub-mqtt-support.md).

- Transport protocol is MQTT 5. Previously - MQTT 3.1.1.
- Context information for SAS Authentication is contained in `CONNECT` packet directly instead of being encoded along with signature.
- Authentication Method is used to indicate authentication method used.
- Shared Access Signature is put in Authentication Data property. Previously Password field was used.
- Topics for operations are different:
  - Telemetry: `$iothub/telemetry` instead of `devices/{Client Id}/messages/events`,
  - Commands: `$iothub/commands` instead of `devices/{Client Id}/messages/devicebound`,
  - Patch Twin Reported: `$iothub/twin/patch/reported` instead of `$iothub/twin/PATCH/properties/reported`,
  - Notify Twin Desired State Changed: `$iothub/twin/patch/desired` instead of `$iothub/twin/PATCH/properties/desired`.
- Subscription for client-server request-response operations' response topic is not required.
- User properties are used instead of encoding properties in topic name segment.
- property names are spelled in "dash-case" naming convention instead of abbreviations with special prefix. User-defined properties now require prefix instead. For instance, `$.mid` is now `message-id`, while `myProperty1` becomes `@myProperty1`.
- Correlation Data property is used to correlate request and response messages for request-response operations instead of `$rid` property encoded in topic.
- `iothub-connection-auth-method` property is no longer stamped on telemetry events.
- C2D commands will not be purged in absence of subscription from device. Instead they will remain queued up until device subscribes or they expire.

## Examples

### Send telemetry

Message:

```yaml
-> PUBLISH
    QoS: 1
    Packet_Id: 31
    Topic: $iothub/telemetry
    @myProperty1: My String Value # optional
    creation-time: 1600987195320 # optional
    @ No_Rules-ForUser-PROPERTIES: Any UTF-8 string value # optional
    Payload: <data>
```

Acknowledgement:

```yaml
<- PUBACK
    Packet_Id: 31
    Reason_Code: 0
```

Alternative acknowledgement (throttled):

```yaml
<- PUBACK
    Packet_Id: 31
    Reason_Code: 151
    status: 0501
```

---

### Send get twin's state

Request:

```yaml
-> PUBLISH
    QoS: 0
    Topic: $iothub/twin/get
    Correlation_Data: 0x01 0xFA
    Payload: <empty>
```

Response (success):

```yaml
<- PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: 0x01 0xFA
    Payload: <twin/desired state>
```

Response (not allowed):

```yaml
<- PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: 0x01 0xFA
    status: 0102
    reason: Operation not allowed for `B2` SKU
    Payload: <empty>
```

---

### Handle direct method call

Request:

```yaml
<- PUBLISH
    QoS: 0
    Topic: $iothub/methods/abc
    Correlation_Data: 0x0A 0x10
    Payload: <data>
```

Response (success):

```yaml
-> PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: 0x0A 0x10
    response-code: 200 # user defined response code
    Payload: <data>
```

**NOTE**: `status` is not set - it is a success response.

Device Unavailable Response:

```yaml
-> PUBLISH
    QoS: 0
    Topic: $iothub/responses
    Correlation_Data: 0x0A 0x10
    status: 0603
```

---

### Error while using QoS 0, part 1

Request:

```yaml
-> PUBLISH
    QoS: 0
    Topic: $iothub/twin/gett # misspelled topic name - server won't recognize it as Request-Response interaction
    Correlation_Data: 0x0A 0x10
    Payload: <data>
```

Response:

```yaml
<- DISCONNECT
    Reason_Code: 144
    reason: "Unsupported topic: `$iothub/twin/gett`"
```

---

### Error while using QoS 0, part 2

Request:

```yaml
-> PUBLISH # missing Correlation Data
    QoS: 0
    Topic: $iothub/twin/get
    Payload: <data>
```

Response:

```yaml
<- DISCONNECT
    Reason_Code: 131
    status: 0100
    reason: "`Correlation Data` property is missing"
```
