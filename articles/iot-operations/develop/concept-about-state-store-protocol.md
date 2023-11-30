---
title: About Azure IoT MQ state store protocol
titleSuffix: Azure IoT MQ
description: Learn about the fundamentals of the Azure IoT MQ state store protocol
author: timlt
ms.author: timlt
ms.subservice: mq
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 11/1/2023

# CustomerIntent: As a developer, I want understand what the Azure IoT MQ state store protocol is, so
# that I can use it to interact with the MQ state store.
---

# Azure IoT MQ state store protocol

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The MQ state store is a distributed storage system that resides in the Azure Operations cluster. The state store offers the same high availability guarantees as MQTT messages in Azure IoT MQ. According to the MQTT5/RPC protocol guidelines, clients should interact with the MQ state store by using MQTT5. This article provides protocol guidance for developers who need to implement their own Azure IoT MQ state store clients. 

## State store protocol overview
The MQ state store currently supports the following actions:

- `SET` \<keyName\> \<keyValue\> \<setOptions\>
- `GET` \<keyName\>
- `DEL` \<keyName\>
- `VDEL` \<keyName\> \<keyValue\> ## Deletes a given \<keyName\> if and only if its value is \<keyValue\>

Conceptually the protocol is simple. Clients use the required properties and payload described in the following sections, to publish a request to a well-defined state store system topic. The state store asynchronously processes the request and responds on the response topic that the client initially provided.

The following diagram shows the basic view of the request and response:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-basic.png" alt-text="Diagram of state store basic request and response process." border="false":::

## State store system topic, QoS, and required MQTT5 properties

To communicate with the State Store, clients must meet the following requirements:

- Use MQTT5
- Use QoS1
- Have a clock that is within one minute of the MQTT broker's clock.

To communicate with the state store, clients must `PUBLISH` requests to the system topic `$services/statestore/_any_/command/invoke/request`. Because the state store is part of Azure IoT Operations, it does an implicit `SUBSCRIBE` to this topic on startup.

The following MQTT5 properties are required in the processing of building a request. If these properties aren't present or the request isn't of type QoS1, the request fails. 

- [Response Topic](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Request_/_Response). The state store responds to the initial request using this value. As a best practice, format the response topic as `clients/{clientId}/services/statestore/_any_/command/invoke/response`. 
- [Correlation Data](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Correlation_Data). When the state store sends a response, it includes the correlation data of the initial request.

The following diagram shows an expanded view of the request and response:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-expanded.png" alt-text="Diagram of state store expanded request and response process." border="false":::

## Supported actions

The actions `SET`, `GET`, and `DEL` behave as expected. 

The values that the `SET` action sets, and the `GET` action retrieves, are arbitrary binary data. The size of the values is only limited by the maximum MQTT payload size, and resource limitations of MQ and the client.

### `SET` options

The `SET` action provides more optional flags beyond the basic `keyValue` and `keyName`:

- `NX`. Allows the key to be set only if it doesn't exist already.
- `NEX <value>`. Allows the key to be set only if the key doesn't exist or if the key's value is already set to \<value\>. The `NEX` flag is typically used for a client renewing the expiration (`PX`) on a key.
- `PX`. How long the key should persist before it expires, in milliseconds.

### `VDEL` options

The `VDEL` action is a special case of the `DEL` command. `DEL` unconditionally deletes the given `keyName`. `VDEL` requires another argument called `keyValue`. `VDEL` only deletes the given `keyName` if it has the same `keyValue`.

## Payload Format

The state store `PUBLISH` payload format is inspired by [RESP3](https://github.com/redis/redis-specifications/blob/master/protocol/RESP3.md), which is the underlying protocol that Redis uses. RESP3 encodes both the verb, such as `SET` or `GET`, and the parameters such as `keyName` and `keyValue`. 

### Case sensitivity

The client must send both the verbs and the options in upper case. 

### Request format

Requests are formatted as in the following example. Following RESP3, the `*` represents the number of items in an array. The `$` character is the number of characters in the following line, excluding the trailing CRLF.

The supported commands in RESP3 format are `GET`, `SET`, `DEL`, and `VDEL`.

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

Concrete examples of state store RESP3 payloads:

```console
*3<CR><LF>$3<CR><LF>set<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$6<CR><LF>VALUE5<CR><LF>
*2<CR><LF>$3<CR><LF>get<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*2<CR><LF>$3<CR><LF>del<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*3<CR><LF>$4<CR><LF>vdel<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$3<CR><LF>ABC<CR><LF>
```

> [!NOTE]
> Note that `SET` requires additional MQTT5 properties, as explained in the section [Versioning and hybrid logical clocks](#versioning-and-hybrid-logical-clocks).

### Response format

Responses also follow the RESP3 protocol guidance.

#### Error Responses

When the state store detects an invalid RESP3 payload, it still returns a response to the requestor's `Response Topic`.  Examples of invalid payloads include an invalid command, an illegal RESP3, or integer overflow.  An invalid payload starts with the string `-ERR` and contains more details.

> [!NOTE]
> A `GET`, `DEL`, or `VDEL` request on a nonexistent key is not considered an error.

If a client sends an invalid payload, the state store sends a payload like the following example:

```console
-ERR syntax error
```

#### `SET` response

When a `SET` request succeeds, the state store returns the following payload:

```console
+OK<CR><LF>
```

#### `GET` response

When a `GET` request is made on a nonexistent key, the state store returns the following payload: 

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

#### `DEL` and `VDEL` response

The state store returns the number of values it deletes on a delete request. Currently, the state store can only delete one value at a time.

```console
:{NumberOfDeletes}<CR><LF> // Will be 1 on successful delete or 0 if the keyName is not present
```

The following output is an example of a successful `DEL` command:

```console
:1<CR><LF>
```

## Versioning and hybrid logical clocks

This section describes how the state store handles versioning.

### Versions as Hybrid Logical Clocks

The state store maintains a version for each value it stores. The state store could use a monotonically increasing counter to maintain versions. Instead, the state store uses a Hybrid Logical Clock (HLC) to represent versions. For more information, see the articles on the [original design of HLCs](https://cse.buffalo.edu/tech-reports/2014-04.pdf) and the [intent behind HLCs](https://martinfowler.com/articles/patterns-of-distributed-systems/hybrid-clock.html). 

The state store uses the following format to define HLCs: 

```
{wallClock}:{counter}:{node-Id}
```

The `wallClock` is the number of milliseconds since the Unix epoch. `counter` and `node-Id` work as HLCs in general.

When clients do a `SET`, they must set the MQTT5 user property `Timestamp` as an HLC, based on the client's current clock. The state store returns the version of the value in its response message. The response is also specified as an HLC and also uses the `Timestamp` MQTT5 user property. The returned HLC is always greater than the HLC of the initial request.

### Example of setting and retrieving a value's version

This section shows an example of setting and getting the version for a value.

A client sets `keyName=value`. The client clock is October 3, 11:07:05PM GMT. The clock value is `1696374425000` milliseconds since Unix epoch. Assume that the state store's system clock is identical to the client system clock. The client does the `SET` action as described previously.

The following diagram illustrates the `SET` action:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-version.png" alt-text="Diagram of state store action to set the version for a value." border="false":::

The `Timestamp` property on the initial set contains `1696374425000` as the client wall clock, the counter as `0`, and its node-Id as `CLIENT`. On the response, the `Timestamp` property that the state store returns contains the `wallClock`, the counter incremented by one, and the node-Id as `StateStore`. The state store could return a higher `wallClock` value if its clock were ahead, based on the way HLC updates work. 

This version is also returned on successful `GET`, `DEL`, and `VDEL` requests. On these requests, the client doesn't specify a `Timestamp`. 

The following diagram illustrates the `GET` action:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-get-version.png" alt-text="Diagram of state store getting the version of a value." border="false":::

> [!NOTE]
> The `Timestamp` that state store returns is the same as what it returned on the initial `SET` request.

If a given key is later updated with a new `SET`, the process is similar. The client should set its request `Timestamp` based on its current clock. The state store updates the value's version and returns the `Timestamp`, following the HLC update rules.

### Clock skew

The state store rejects a `Timestamp` (and also a `FencingToken`) that is more than a minute ahead of the state store's local clock.

The state store accepts a `Timestamp` that is behind the state store local clock. As specified in the HLC algorithm, the state store sets the version of the key to its local clock because it's greater.

## Locking and fencing tokens

This section describes the purpose and usage of locking and fencing tokens.

### Background

Suppose there are two or more MQTT clients using the state store. Both clients want to write to a given key. The state store clients need a mechanism to lock the key such that only one client at a time can modify a given key.

An example of this scenario occurs in active and stand-by systems. There could be two clients that both perform the same operation, and the operation could include the same set of state store keys. At a given time, one of the clients is active and the other is standing by to immediately take over if the active system hangs or crashes. Ideally, only one client should write to the state store at a given time. However, in distributed systems it's possible that both clients might behave as if they're active, and they might simultaneously try to write to the same keys. This scenario creates a race condition.

The state store provides mechanisms to prevent this race condition by using fencing tokens. For more information about fencing tokens, and the class of race conditions they're designed to guard against, see this [article](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html).

### Obtain a fencing token

This example assumes that we have the following elements:

* `Client1` and `Client2`. These clients are state store clients that act as an active and stand-by pair.
* `LockName`. The name of a key in the state store that acts as the lock.
* `ProtectedKey`. The key that needs to be protected from multiple writers.

The clients attempt to get a lock as the first step. They get a lock by doing a `SET LockName {CLIENT-NAME} NEX PX {TIMEOUT-IN-MILLISECONDS}`. Recall from [Set Options](#set-options) that the `NEX` flag means that the `SET` succeeds only if one of the following conditions is met:

- The key was empty
- The key's value is already set to \<value\> and `PX` specifies the timeout in milliseconds.

Assume that `Client1` goes first with a request of `SET LockName Client1 NEX PX 10000`. This request gives it ownership of `LockName` for 10,000 milliseconds. If `Client2` attempts a `SET LockName Client2 NEX ...` while `Client1` owns the lock, the `NEX` flag means the `Client2` request fails. `Client1` needs to renew this lock by sending the same `SET` command used to acquire the lock, if `Client1` wants to continue ownership.

> [!NOTE]
> A `SET NX` is conceptually equivalent to `AcquireLock()`.

### Use the fencing tokens on SET requests

When `Client1` successfully does a `SET` ("AquireLock") on `LockName`, the state store returns the version of `LockName` as a Hybrid Logical Clock (HLC) in the MQTT5 user property `Timestamp`.

When a client performs a `SET` request, it can optionally include the MQTT5 user property `FencingToken`. The `FencingToken` is represented as an HLC. The fencing token associated with a given key/value pair provides lock ownership checking. The fencing token can come from anywhere. For this scenario, it should come from the version of `LockName`.

The following diagram shows the process of `Client1` doing a `SET` request on `LockName`:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-lockname.png" alt-text="Diagram of a client doing a set request on the lock name property." border="false":::

Next, `Client1` uses the `Timestamp` property (`Property=1696374425000:1:StateStore`) unmodified as the basis of the `FencingToken` property in the request to modify `ProtectedKey`. Like all `SET` requests, the client must set the `Timestamp` property of `ProtectedKey`.

The following diagram shows the process of `Client1` doing a `SET` request on `ProtectedKey`:

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-protectedkey.png" alt-text="Diagram of client doing a set request on the protected key property." border="false":::

If the request succeeds, from this point on `ProtectedKey` requires a fencing token equal to or greater than the one specified in the `SET` request.

### Fencing Token Algorithm

The state store accepts any HLC for the `Timestamp` of a key/value pair, if the value is within the max clock skew. However, the same isn't true for fencing tokens.

The state store algorithm for fencing tokens is as follows:

* If a key/value pair doesn't have a fencing token associated with it and a `SET` request sets `FencingToken`, the state store stores the associated `FencingToken` with the key/value pair.
* If a key/value pair has a fencing token associated with it:
    * If a `SET` request didn't specify `FencingToken`, reject the request.
    * If a `SET` request specified a `FencingToken` that has an older HLC value than the fencing token associated with the key/value pair, reject the request.
    * If a `SET` request specified a `FencingToken` that has an equal or newer HLC value than the fencing token associated with the key/value pair, accept the request. The state store updates the key/value pair's fencing token to be the one set in the request, if it's newer.

After a key is marked with a fencing token, for a request to succeed, `DEL` and `VDEL` requests also require the `FencingToken` property to be included. The algorithm is identical to the previous one, except that the fencing token isn't stored because the key is being deleted.

### Client behavior

These locking mechanisms rely on clients being well-behaved. In the previous example, a misbehaving `Client2` couldn't own the `LockName` and still successfully perform a `SET ProtectedKey` by choosing a fencing token that is newer than the `ProtectedKey` token. The state store isn't aware that `LockName` and `ProtectedKey` have any relationship. As a result, state store doesn't perform validation that `Client2` actually owns the value.  

Clients being able to write keys for which they don't actually own the lock, is undesirable behavior. You can protect against such client misbehavior by correctly implementing clients and using authentication to limit access to keys to trusted clients only.

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)
