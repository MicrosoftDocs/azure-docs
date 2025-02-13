---
title: WebSocket client protocols for Azure Web PubSub
description: This article presents an overview of the client protocols for Azure Web PubSub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 11/08/2021
---

#  WebSocket client protocols for Azure Web PubSub

Clients connect to Azure Web PubSub by using the standard [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) protocol.

## Service endpoints
The Web PubSub service provides two types of endpoints for clients to connect to:
* `/client/hubs/{hub}`
* `/client/?hub={hub}`

`{hub}` is a mandatory parameter that acts as isolation for various applications. You can set it in either the path or the query.

## Authorization

Clients connect to the service with a JSON Web Token (JWT). The token can be in either the query string, as `/client/?hub={hub}&access_token={token}`, or the `Authorization` header, as `Authorization: Bearer {token}`.

Here's a general authorization workflow:

1. The client negotiates with your application server. The application server contains the authorization middleware, which handles the client request and signs a JWT for the client to connect to the service.
1. The application server returns the JWT and the service URL to the client.
1. The client tries to connect to the Web PubSub service by using the URL and the JWT token returned from the application server.

### Supported claims
You could also configure properties for the client connection when generating the access token by specifying special claims inside the JWT token:

| Description | Claim type | Claim value | Notes |
| --- | --- | --- | --- |
| The `userId` for the client connection | `sub` | the userId | Only one `sub` claim is allowed. |
| The lifetime of the token | `exp` | the expiration time | The `exp` (expiration time) claim identifies the expiration time on or after which the token MUST NOT be accepted for processing. |
| The [permissions](#permissions) the client connection initially has | `role` | the role value defined in [permissions](#permissions) | Specify multiple `role` claims if the client has multiple permissions. |
| The initial groups that the client connection joins once it connects to Azure Web PubSub | `webpubsub.group` | the group to join | Specify multiple `webpubsub.group` claims if the client joins multiple groups. |

You could also add custom claims into the access token, and these values are preserved as the `claims` property in [connect upstream request body](./reference-cloud-events.md#system-connect-event).

[Server SDKs](./howto-generate-client-access-url.md#generate-from-service-sdk) provides APIs to generate the access token for the clients. 

<a name="simple_client"></a>

## The simple WebSocket client

A **simple WebSocket client**, as the naming indicates, is a simple WebSocket connection. It can also have its own custom subprotocol. 

For example, in JavaScript, you can create a simple WebSocket client by using the following code:

```js
// simple WebSocket client1
var client1 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1');

// simple WebSocket client2 with some custom subprotocol
var client2 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'custom.subprotocol')
```

Simple WebSocket client has two modes: `sendEvent` and `sendToGroup`. The mode is determined once the connection is established and cannot be changed later.

`sendEvent` is the default mode for the simple WebSocket client. In `sendEvent` mode, every WebSocket frame the client sent is considered as a `message` event. Users can configure [event handlers](./concept-service-internals.md#event-handler) or [event listeners](./concept-service-internals.md#event-listener) to handle these `message` events. 

```javascript
// Every data frame is considered as a `message` event
var client3 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1');

// Or explicitly set the mode
var client4 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1?webpubsub_mode=sendEvent');
```

In `sendToGroup` mode, every WebSocket frame the client sent is considered as a message to be published to a specific group. `group` is a required query parameter in this mode, and only a single value is allowed. The connection should also have corresponding [permissions](#permissions) to send messages to the target group. Both `webpubsub.sendToGroup.<group>` and `webpubsub.sendToGroup` roles work for it.

For example, in JavaScript, you can create a simple WebSocket client in `sendToGroup` mode with `group=group1` by using the following code:
```javascript
var client5 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1?webpubsub_mode=sendToGroup&group=group1');
```

## The PubSub WebSocket client

A **PubSub WebSocket client** is the WebSocket client using subprotocols defined by the Azure Web PubSub service:

* `json.webpubsub.azure.v1`
* `protobuf.webpubsub.azure.v1`

With the service-supported subprotocol, the **PubSub WebSocket client**s can directly publish messages to groups when they have the [permissions](#permissions).

### The `json.webpubsub.azure.v1` subprotocol

Check [here for the JSON subprotocol in detail](reference-json-webpubsub-subprotocol.md).

#### Create a PubSub WebSocket client

```js
var pubsubClient = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.webpubsub.azure.v1');
```

#### Join a group from the client directly

```js
let ackId = 0;
pubsubClient.send(    
    JSON.stringify({
        type: 'joinGroup',
        group: 'group1',
        ackId: ++ackId
    }));
```

#### Send messages to a group from the client directly

```js
let ackId = 0;
pubsubClient.send(    
    JSON.stringify({
        type: 'sendToGroup',
        group: 'group1',
        ackId: ++ackId,
        dataType: "json",
        data: {
            "hello": "world"
        }
    }));
```

### The `protobuf.webpubsub.azure.v1` subprotocol

Protocol buffers (protobuf) is a language-neutral, platform-neutral, binary-based protocol that simplifies sending binary data. Protobuf provides tools to generate clients for many languages, such as Java, Python, Objective-C, C#, and C++. [Learn more about protobuf](https://developers.google.com/protocol-buffers).

For example, in JavaScript, you can create a **PubSub WebSocket client** with a protobuf subprotocol by using the following code:

```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.webpubsub.azure.v1');
```

Check [here for the protobuf subprotocol in detail](reference-protobuf-webpubsub-subprotocol.md).


### AckId and Ack Response

The **PubSub WebSocket Client** supports `ackId` property for `joinGroup`, `leaveGroup`, `sendToGroup` and `event` messages. When using `ackId`, you can receive an ack response message when your request is processed. You can choose to omit `ackId` in fire-and-forget scenarios. In the article, we describe the behavior differences between specifying `ackId` or not.

#### Behavior when No `ackId` specified

If `ackId` isn't specified, it's fire-and-forget. Even there are errors when brokering messages, you have no way to get notified.

#### Behavior when `ackId` specified

##### Idempotent publish

`ackId` is a uint64 number and should be unique within a client with the same connection ID. Web PubSub Service records the `ackId` and messages with the same `ackId` are treated as the same message. The service refuses to broker the same message more than once, which is useful in retry to avoid duplicated messages. For example, if a client sends a message with `ackId=5` and fails to receive an ack response with `ackId=5`, then the client retries and sends the same message again. In some cases, the message is already brokered and the ack response is lost for some reason. The service rejects the retry and response an ack response with `Duplicate` reason.

#### Ack Response

Web PubSub Service sends ack response for each request with `ackId`.

Format:
```json
{
    "type": "ack",
    "ackId": 1, // The ack id for the request to ack
    "success": false, // true or false
    "error": {
        "name": "Forbidden|InternalServerError|Duplicate",
        "message": "<error_detail>"
    }
}
```

* The `ackId` associates the request.

* `success` is a bool and indicate whether the request is successfully processed by the service. If it's `false`, clients need to check the `error`.

* `error` only exists when `success` is `false` and clients should have different logic for different `name`. You should suppose there might be more type of `name` in future.
    - `Forbidden`: The client doesn't have the permission to the request. The client needs to be added relevant roles.
    - `InternalServerError`: Some internal error happened in the service. Retry is required.
    - `Duplicate`: The message with the same `ackId` has been already processed by the service.

### Permissions

As you likely noticed in the earlier PubSub WebSocket client description, a client can publish to other clients only when it's *authorized* to do so. A client's permissions can be granted when it's being connected or during the lifetime of the connection.

| Role | Permission |
|---|---|
| Not specified | The client can send event requests. |
| `webpubsub.joinLeaveGroup` | The client can join or leave any group. |
| `webpubsub.sendToGroup` | The client can publish messages to any group. |
| `webpubsub.joinLeaveGroup.<group>` | The client can join or leave group `<group>`. |
| `webpubsub.sendToGroup.<group>` | The client can publish messages to group `<group>`. |
| | |

The permission of a client can be granted in several ways:

#### 1. Assign the role to the client when generating the access token

Client can connect to the service using a JWT token. The token payload can carry information such as the `role` of the client. When signing the JWT token to the client, you can grant permissions to the client by giving the client specific roles.

For example, let's sign a JWT token that has the permission to send messages to `group1` and `group2`: 

```js
let token = await serviceClient.getClientAccessToken({
    roles: [ "webpubsub.sendToGroup.group1", "webpubsub.sendToGroup.group2" ]
});
```

#### 2. Assign the role to the client with the `connect` event handler

The roles of the clients can also be set when the `connect` event handler is registered and the upstream event handler can return the `roles` of the client to the Web PubSub service when handling the `connect` events.

For example, in JavaScript, you can configure the `handleConnect` event to do so:

```js
let handler = new WebPubSubEventHandler("hub1", {
  handleConnect: (req, res) => {
    // auth the connection and set the userId of the connection
    res.success({
      roles: [ "webpubsub.sendToGroup.group1", "webpubsub.sendToGroup.group2" ]
    });
  },
});
```

#### 3. Assign the role to the client through REST APIs or server SDKs during runtime

```js
let service = new WebPubSubServiceClient("<your_connection_string>", "test-hub");
await service.grantPermission("<connection_id>", "joinLeaveGroup", { targetName: "group1" });
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
