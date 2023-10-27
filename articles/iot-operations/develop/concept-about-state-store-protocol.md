---
title: About Azure IoT MQ state store protocol
# titleSuffix: Azure IoT MQ
description: Learn about the fundamentals of the Azure IoT MQ state store protocol
author: timlt
ms.author: timlt
# ms.subservice: mq
ms.topic: concept-article
ms.date: 10/26/2023

# CustomerIntent: As a developer, I want understand what the Azure IoT MQ state store protocol is, so
# that I can use it to interact with the MQ state store. 
---

# Azure IoT MQ state store protocol

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article provides protocol guidance for developers who implement Azure IoT MQ state store clients. The MQ state store is a distributed storage system that resides in the DMQTT cluster. The state store offers the same high availability guarantees as MQTT messages in DMQTT. According to the MQ MQTT5/RPC protocol guidelines, clients should interact with the MQ state store by using the MQTT5 protocol. Microsoft recommends that whenever possible, developers use the MQ Client SDKs (for supported languages) to communicate with the MQ state store. 

## State store protocol overview
The MQ state store currently supports the following actions:

- `set` \<keyName\> \<keyValue\> \<setOptions\>
- `get` \<keyName\>
- `del` \<keyName\>
- `vdel` \<keyName\> \<keyValue\> ## Deletes a given \<keyName\> if and only if its value is \<keyValue\>


Conceptually the protocol is simple.  Clients use the required properties and payload described in the following sections, to publish a request to a well-defined state store system topic.  The state store asynchronously processes the request and responds on the response topic that the client initially provided.

The following diagram shows the basic view of the request and response:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-basic.png" alt-text="Diagram of state store basic request and response process." border="false":::

## State store system topic, QoS, and required MQTT5 properties

To communicate with the State Store, clients must meet the following requirements:

- Use MQTT5
- Use QoS1

To communicate with the state store, clients must `PUBLISH` requests to the system topic `$services/statestore/_any_/command/invoke/request`.  Because the state store is part of DMQTT, it does an implicit `SUBSCRIBE` to this topic on MQ startup.

The following MQTT5 properties are required in the processing of building a request.  If these properties aren't present or the request isn't of type QoS1, the request fails. 

- [Response Topic](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Request_/_Response).  The state store responds to the initial request using this value.  As a best practice, format the response topic as `clients/{clientId}/services/statestore/_any_/command/invoke/response`. 
- [Correlation Data](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Correlation_Data).  When the state store sends a response, it includes the correlation data of the initial request.

The following diagram shows an expanded view of the request and response:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-expanded.png" alt-text="Diagram of state store expanded request and response process." border="false":::

## Supported actions

The actions `set`, `get`, and `del` behave as expected. 

The values that the `set` action sets, and the `get` action retrieves, are arbitrary binary data.  The size of the values is only limited by the maximum MQTT payload size and resource limitations of MQ and the client themselves.

### set options

The `set` action provides more optional flags beyond the basic `keyValue` and `keyName`.

- `NX`. Allows the key to be set only if it doesn't exist already.
- `NEX <value>`. Allows the key to be set only if the key doesn't exist or if the key's value is already set to `<value>. The `NEX` flag is typically used for a client renewing the expiration (`PX`) on a key.
- `PX`. How long the key should persist before it expires, in milliseconds.

### vdel

The `vdel` action is a special case of the `del` command.  `del` unconditionally deletes the given `keyName`.  `vdel` requires another argument called `keyValue`.  `vdel` only deletes the given `keyName` if it has the same `keyValue`.

## Payload Format

The state store `PUBLISH` payload format is inspired by [RESP3](https://github.com/redis/redis-specifications/blob/master/protocol/RESP3.md), which is the underlying protocol that Redis uses.  RESP3 encodes both the verb, such as `set` or `get`, and the parameters such as `keyName` and `keyValue`.  

### Case sensitivity

Both verbs and options are case sensitive.  For example, `set` and `set ... NX` are valid state store commands.  `SET`, `seT`, and `set ... nX` aren't valid. 

### Request format

Requests are formatted as in the following example.  Following RESP3, the `*` represents the number of items in an array.  The `$` character is the number of characters in the following line, excluding the trailing CRLF.

The supported commands in RESP3 format are `get`, `set`, `del`, and `vdel`.

```console
*{NUMBER-OF-ARGUMENTS}<CR><LF>
${LENGTH-OF-NEXT-LINE}<CR><LF>
{COMMAND-NAME}<CR><LF>
${LENGTH-OF-NEXT-LINE}<CR><LF> // This is always the keyName with the current supported verbs.
{KEY-NAME}<CR><LF>
// Next lines included only if command has additional arguments
${LENGTH-OF-NEXT-LINE}<CR><LF> // This is always the keyValue for set
{KEY-VALUE}<CR><LF>
```

Concrete examples of State Store RESP3 payloads:

```console
*3<CR><LF>$3<CR><LF>set<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$6<CR><LF>VALUE5<CR><LF>
*2<CR><LF>$3<CR><LF>get<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*2<CR><LF>$3<CR><LF>del<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*3<CR><LF>$4<CR><LF>vdel<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$3<CR><LF>ABC<CR><LF>
```

### Response format

Responses also follow the RESP3 protocol guidance.

#### Error Responses

When the state store detects an invalid RESP3 payload, it still returns a response to the requestor's `Response Topic`.  Examples of invalid payloads include an invalid command, an illegal RESP3, or integer overflow.  An invalid payload starts with the string `-ERR` and contains more details.

> [!NOTE]
> A `get`, `del`, or `vdel` request on a nonexistent key is not considered an error.

#### Set Responses

When a `set` request succeeds, the state store returns the following payload:

```console
+OK<CR><LF>
```

#### Get Responses

When a `get` request is made on a nonexistent key, the state store returns the following payload: 

```console
$-1<CR><LF>
```

When the key is found, the state store returns the value in the following format:

```console
${NumberOfBytes}<CR><LF>
{KEY-VALUE}
```

The output of the state store returning the value `1234` looks like the following example:

```console
$4<CR><LF>1234<CR><LF>
```

#### Responses to del and vdel

The state store returns the number of values it deletes on a delete request.  Currently, the state store can only delete one value at a time.  

```console
:{NumberOfDeletes}<CR><LF> // Will be 1 on successful delete or 0 if the keyName is not present
```

The following output is an example of a successful `del` command:  

```console
:1<CR><LF>
```

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Azure IoT MQ state store](concept-about-state-store.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)
