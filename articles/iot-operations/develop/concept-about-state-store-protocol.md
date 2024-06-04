---
title: Learn about the Azure IoT MQ state store protocol
description: Learn how to implement an Azure IoT MQ state store protocol client
author: PatAltimore
ms.author: patricka
ms.subservice: mq
ms.topic: concept-article
ms.date: 04/29/2024

# CustomerIntent: As a developer, I want understand what the Azure IoT MQ state store protocol is, so
# that I can implement a client app to interact with the MQ state store.
---

# Azure IoT MQ Preview state store protocol

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The MQ state store is a distributed storage system within the Azure IoT Operations cluster. The state store offers the same high availability guarantees as MQTT messages in Azure IoT MQ Preview. According to the MQTT5/RPC protocol guidelines, clients should use MQTT5 to interact with the MQ state store. This article provides protocol guidance for developers who need to implement their own Azure IoT MQ state store clients. 

## State store protocol overview
The MQ state store supports the following commands:

- `SET` \<keyName\> \<keyValue\> \<setOptions\>
- `GET` \<keyName\>
- `DEL` \<keyName\>
- `VDEL` \<keyName\> \<keyValue\> ## Deletes a given \<keyName\> if and only if its value is \<keyValue\>

The protocol uses the following request-response model:
- **Request**. Clients publish a request to a well-defined state store system topic. To publish the request, clients use the required properties and payload described in the following sections.
- **Response**. The state store asynchronously processes the request and responds on the response topic that the client initially provided.

The following diagram shows the basic view of the request and response:

<!--
sequenceDiagram

      Client->>+State Store: Request<BR>PUBLISH State Store Topic<BR>Payload
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>PUBLISH Response Topic<BR>Payload
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-basic.svg" alt-text="Diagram of state store basic request and response process." border="false":::

## State store system topic, QoS, and required MQTT5 properties

To communicate with the state store, clients must meet the following requirements:

- Use MQTT5. For more information, see the [MQTT 5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html).
- Use QoS 1 (Quality of Service level 1). QoS 1 is described in the [MQTT 5 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901236).
- Have a clock that is within one minute of the MQTT broker's clock.

To communicate with the state store, clients must `PUBLISH` requests to the system topic `statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/command/invoke`. Because the state store is part of Azure IoT Operations, it does an implicit `SUBSCRIBE` to this topic on startup.

To build a request, the following MQTT5 properties are required. If these properties aren't present or the request isn't of type QoS 1, the request fails.

- [Response Topic](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Request_/_Response). The state store responds to the initial request using this value. As a best practice, format the response topic as `clients/{clientId}/services/statestore/_any_/command/invoke/response`. Setting the response topic as `statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/command/invoke` or as one that begins with `clients/statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8` is not permitted on a state store request. The state store disconnects MQTT clients that use an invalid response topic.
- [Correlation Data](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Correlation_Data). When the state store sends a response, it includes the correlation data of the initial request.

The following diagram shows an expanded view of the request and response:

<!--
sequenceDiagram

      Client->>+State Store:Request<BR>PUBLISH statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/command/invoke<BR>Response Topic:client-defined-response-topic<BR>Correlation Data:1234<BR>Payload(RESP3)
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>PUBLISH client-defined-response-topic<br>Correlation Data:1234<BR>Payload(RESP3)
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-expanded.svg" alt-text="Diagram of state store expanded request and response process." border="false":::

## Supported commands

The commands `SET`, `GET`, and `DEL` behave as expected.

The values that the `SET` command sets, and the `GET` command retrieves, are arbitrary binary data. The size of the values is only limited by the maximum MQTT payload size, and resource limitations of MQ and the client.

### `SET` options

The `SET` command provides more optional flags beyond the basic `keyValue` and `keyName`:

- `NX`. Allows the key to be set only if it doesn't exist already.
- `NEX <value>`. Allows the key to be set only if the key doesn't exist or if the key's value is already set to \<value\>. The `NEX` flag is typically used for a client renewing the expiration (`PX`) on a key.
- `PX`. How long the key should persist before it expires, in milliseconds.

### `VDEL` options

The `VDEL` command is a special case of the `DEL` command. `DEL` unconditionally deletes the given `keyName`. `VDEL` requires another argument called `keyValue`. `VDEL` only deletes the given `keyName` if it has the same `keyValue`.

## Payload format

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

The following example output shows state store RESP3 payloads:

```console
*3<CR><LF>$3<CR><LF>set<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$6<CR><LF>VALUE5<CR><LF>
*2<CR><LF>$3<CR><LF>get<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*2<CR><LF>$3<CR><LF>del<CR><LF>$7<CR><LF>SETKEY2<CR><LF>
*3<CR><LF>$4<CR><LF>vdel<CR><LF>$7<CR><LF>SETKEY2<CR><LF>$3<CR><LF>ABC<CR><LF>
```

> [!NOTE]
> Note that `SET` requires additional MQTT5 properties, as explained in the section [Versioning and hybrid logical clocks](#versioning-and-hybrid-logical-clocks).

### Response format

When the state store detects an invalid RESP3 payload, it still returns a response to the requestor's `Response Topic`. Examples of invalid payloads include an invalid command, an illegal RESP3, or integer overflow. An invalid payload starts with the string `-ERR` and contains more details.

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

When clients do a `SET`, they must set the MQTT5 user property `__ts` as an HLC representing its timestamp, based on the client's current clock. The state store returns the version of the value in its response message. The response is also specified as an HLC and also uses the `__ts` MQTT5 user property. The returned HLC is always greater than the HLC of the initial request.

### Example of setting and retrieving a value's version

This section shows an example of setting and getting the version for a value.

A client sets `keyName=value`. The client clock is October 3, 11:07:05PM GMT. The clock value is `1696374425000` milliseconds since Unix epoch. Assume that the state store's system clock is identical to the client system clock. The client does the `SET` command as described previously.

The following diagram illustrates the `SET` command:

<!--
sequenceDiagram

      Client->>+State Store: Request<BR>__ts=1696374425000:0:Client1<BR>Payload: SET keyName=value
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>__ts=1696374425000:1:StateStore<BR>Payload: OK
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-version.svg" alt-text="Diagram of state store command to set the version for a value." border="false":::

The `__ts` (timestamp) property on the initial set contains `1696374425000` as the client wall clock, the counter as `0`, and its node-Id as `CLIENT`. On the response, the `__ts` property that the state store returns contains the `wallClock`, the counter incremented by one, and the node-Id as `StateStore`. The state store could return a higher `wallClock` value if its clock were ahead, based on the way HLC updates work.

This version is also returned on successful `GET`, `DEL`, and `VDEL` requests. On these requests, the client doesn't specify a `__ts`.

The following diagram illustrates the `GET` command:

<!--
sequenceDiagram

      Client->>+State Store: Request<BR>Payload: GET keyName
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>__ts=1696374425000:1:StateStore<BR>Payload: keyName's value
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-get-version.svg" alt-text="Diagram of state store getting the version of a value." border="false":::

> [!NOTE]
> The timestamp `__ts` that state store returns is the same as what it returned on the initial `SET` request.

If a given key is later updated with a new `SET`, the process is similar. The client should set its request `__ts` based on its current clock. The state store updates the value's version and returns the `__ts`, following the HLC update rules.

### Clock skew

The state store rejects a `__ts` (and also a `__ft`) that is more than a minute ahead of the state store's local clock.

The state store accepts a `__ts` that is behind the state store local clock. As specified in the HLC algorithm, the state store sets the version of the key to its local clock because it's greater.

## Locking and fencing tokens

This section describes the purpose and usage of locking and fencing tokens.

### Background

Suppose there are two or more MQTT clients using the state store. Both clients want to write to a given key. The state store clients need a mechanism to lock the key such that only one client at a time can modify a given key.

An example of this scenario occurs in active and standby systems. There could be two clients that both perform the same operation, and the operation could include the same set of state store keys. At a given time, one of the clients is active and the other is standing by to immediately take over if the active system hangs or crashes. Ideally, only one client should write to the state store at a given time. However, in distributed systems it's possible that both clients might behave as if they're active, and they might simultaneously try to write to the same keys. This scenario creates a race condition.

The state store provides mechanisms to prevent this race condition by using fencing tokens. For more information about fencing tokens, and the class of race conditions they're designed to guard against, see this [article](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html).

### Obtain a fencing token

This example assumes that we have the following elements:

* `Client1` and `Client2`. These clients are state store clients that act as an active and standby pair.
* `LockName`. The name of a key in the state store that acts as the lock.
* `ProtectedKey`. The key that needs to be protected from multiple writers.

The clients attempt to get a lock as the first step. They get a lock by doing a `SET LockName {CLIENT-NAME} NEX PX {TIMEOUT-IN-MILLISECONDS}`. Recall from [Set Options](#set-options) that the `NEX` flag means that the `SET` succeeds only if one of the following conditions is met:

- The key was empty
- The key's value is already set to \<value\> and `PX` specifies the timeout in milliseconds.

Assume that `Client1` goes first with a request of `SET LockName Client1 NEX PX 10000`. This request gives it ownership of `LockName` for 10,000 milliseconds. If `Client2` attempts a `SET LockName Client2 NEX ...` while `Client1` owns the lock, the `NEX` flag means the `Client2` request fails. `Client1` needs to renew this lock by sending the same `SET` command used to acquire the lock, if `Client1` wants to continue ownership.

> [!NOTE]
> A `SET NX` is conceptually equivalent to `AcquireLock()`.

### Use the fencing tokens on SET requests

When `Client1` successfully does a `SET` ("AquireLock") on `LockName`, the state store returns the version of `LockName` as a Hybrid Logical Clock (HLC) in the MQTT5 user property `__ts`.

When a client performs a `SET` request, it can optionally include the MQTT5 user property `__ft` to represent a "fencing token". The __ft` is represented as an HLC. The fencing token associated with a given key-value pair provides lock ownership checking. The fencing token can come from anywhere. For this scenario, it should come from the version of `LockName`.

The following diagram shows the process of `Client1` doing a `SET` request on `LockName`:

<!--
sequenceDiagram

      Client->>+State Store: Request<BR>__ts=1696374425000:0:Client1<BR>Payload: SET LockName Client1 NEX PX ...
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>__ts=1696374425000:1:StateStore<BR>Payload:  OK
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-lockname.svg" alt-text="Diagram of a client doing a set request on the lock name property." border="false":::

Next, `Client1` uses the `__ts` property (`Property=1696374425000:1:StateStore`) unmodified as the basis of the `__ft` property in the request to modify `ProtectedKey`. Like all `SET` requests, the client must set the `__ts` property of `ProtectedKey`.

The following diagram shows the process of `Client1` doing a `SET` request on `ProtectedKey`:

<!--
sequenceDiagram

      Client->>+State Store: Request<BR>__ft =1696374425000:1:StateStore<BR>__ts=1696374425001:0:Client1<BR>Payload: SET LockName Client1 NEX PX ...
      Note over State Store,Client: State Store Processes Request
      State Store->>+Client: Response<BR>__ts=1696374425001:1:StateStore<BR>Payload: OK
-->

:::image type="content" source="media/concept-about-state-store-protocol/state-store-request-response-set-protectedkey.svg" alt-text="Diagram of client doing a set request on the protected key property." border="false":::

If the request succeeds, from this point on `ProtectedKey` requires a fencing token equal to or greater than the one specified in the `SET` request.

### Fencing Token Algorithm

The state store accepts any HLC for the `__ts` of a key-value pair, if the value is within the max clock skew. However, the same isn't true for fencing tokens.

The state store algorithm for fencing tokens is as follows:

* If a key-value pair doesn't have a fencing token associated with it and a `SET` request sets `__ft`, the state store stores the associated `__ft` with the key-value pair.
* If a key-value pair has a fencing token associated with it:
    * If a `SET` request didn't specify `__ft`, reject the request.
    * If a `SET` request specified a `__ft` that has an older HLC value than the fencing token associated with the key-value pair, reject the request.
    * If a `SET` request specified a `__ft` that has an equal or newer HLC value than the fencing token associated with the key-value pair, accept the request. The state store updates the key-value pair's fencing token to be the one set in the request, if it's newer.

After a key is marked with a fencing token, for a request to succeed, `DEL` and `VDEL` requests also require the `__ft` property to be included. The algorithm is identical to the previous one, except that the fencing token isn't stored because the key is being deleted.

### Client behavior

These locking mechanisms rely on clients being well-behaved. In the previous example, a misbehaving `Client2` couldn't own the `LockName` and still successfully perform a `SET ProtectedKey` by choosing a fencing token that is newer than the `ProtectedKey` token. The state store isn't aware that `LockName` and `ProtectedKey` have any relationship. As a result, state store doesn't perform validation that `Client2` actually owns the value.

Clients being able to write keys for which they don't actually own the lock, is undesirable behavior. You can protect against such client misbehavior by correctly implementing clients and using authentication to limit access to keys to trusted clients only.

## Notifications

Clients can register with the state store to receive notifications of keys being modified. Consider the scenario where a thermostat uses the state store key `{thermostatName}\setPoint`. Other state store clients can change this key's value to change the thermostat's setPoint. Rather than polling for changes, the thermostat can register with the state store to receive messages when `{thermostatName}\setPoint` is modified.

### KEYNOTIFY request messages

State store clients request the state store monitor a given `keyName` for changes by sending a `KEYNOTIFY` message. Just like all state store requests, clients PUBLISH a QoS1 message with this message via MQTT5 to the state store system topic `statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/command/invoke`.

The request payload has the following form:

```console
KEYNOTIFY<CR><LF>
{keyName}<CR><LF>
{optionalFields}<CR><LF>
```

Where:

* KEYNOTIFY is a string literal specifying the command.
* `{keyName}` is the key name to listen for notifications on. Wildcards aren't currently supported.
* `{optionalFields}`  The currently supported optional field values are:
  *  `{STOP}` If there's an existing notification with the same `keyName` and `clientId` as this request, the state store removes it.

The following example output shows a `KEYNOTIFY` request to monitor the key `SOMEKEY`:

```console
*2<CR><LF>
$9<CR><LF>
KEYNOTIFY<CR><LF>
$7<CR><LF>
SOMEKEY<CR><LF>
```

### KEYNOTIFY response message

Like all state store RPC requests, the state store returns its response to the `Response Topic` and uses the `Correlation Data` properties specified from the initial request. For `KEYNOTIFY`, a successful response indicates that the state store processed the request. After the state store successfully processes the request, it either monitors the key for the current client, or stops monitoring.

On success, the state store's response is the same as a successful `SET`.

```console
+OK<CR><LF>
```

If a client sends a `KEYNOTIFY SOMEKEY STOP` request but the state store isn't monitoring that key, the state store's response is the same as attempting to delete a key that doesn't exist.

```console
:0<CR><LF>
```

Any other failure follows the state store's general error reporting pattern:

```
-ERR: <DESCRIPTION OF ERROR><CR><LF>
```

### KEYNOTIFY notification topics and lifecycle

When a `keyName` being monitored via `KEYNOTIFY` is modified or deleted, the state store sends a notification to the client. The topic is determined by convention - the client doesn't specify the topic during the `KEYNOTIFY` process.

The topic is defined in the following example. The `clientId` is an upper-case hex encoded representation of the MQTT ClientId of the client that initiated the `KEYNOTIFY` request and `keyName` is a hex encoded representation of the key that changed.

```console
clients/statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/{clientId}/command/notify/{keyName}
```

As an example, MQ publishes a `NOTIFY` message sent to `client-id1` with the modified key name `SOMEKEY` to the topic:

```console
clients/statestore/FA9AE35F-2F64-47CD-9BFF-08E2B32A0FE8/636C69656E742D696431/command/notify/534F4D454B4559`
```

A client using notifications should `SUBSCRIBE` to this topic and wait for the `SUBACK` to be received *before* sending any `KEYNOTIFY` requests so that no messages are lost.

If a client disconnects, it must resubscribe to the `KEYNOTIFY` notification topic and resend the `KEYNOTIFY` command for any keys it needs to continue monitoring. Unlike MQTT subscriptions, which can be persisted across a nonclean session, the state store internally removes any `KEYNOTIFY` messages when a given client disconnects.

### KEYNOTIFY notification message format

When a key being monitored via `KEYNOTIFY` is modified, the state store will `PUBLISH` a message to the notification topic following the format to state store clients registered for the change.

```console
NOTIFY<CR><LF>
{operation}<CR><LF>
{optionalFields}<CR><LF>
```

The following details are included in the message:

* `NOTIFY` is a string literal included as the first argument in the payload, indicating a notification arrived.
* `{operation}` is the event that occurred. Currently these operations are:
  * `SET` the value was modified. This operation can only occur as the result of a `SET` command from a state store client.
  * `DEL` the value was deleted. This operation can occur because of a `DEL` or `VDEL` command from a state store client.
* `optionalFields`
  * `VALUE` and `{MODIFIED-VALUE}`. `VALUE` is a string literal indicating that the next field, `{MODIFIED-VALUE}`, contains the value the key was changed to. This value is only sent in response to keys being modified because of a `SET` and is only included if the `KEYNOTIFY` request included the optional `GET` flag.

The following example output shows a notification message sent when the key `SOMEKEY` is modified to the value `abc`, with the `VALUE` included because the initial request specified the `GET` option:

```console
*4<CR><LF>
$6<CR><LF>
NOTIFY<CR><LF>
$3<CR><LF>
SET<CR><LF>
$5<CR><LF>
VALUE<CR><LF>
$3<CR><LF>
abc<CR><LF>
```

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)
