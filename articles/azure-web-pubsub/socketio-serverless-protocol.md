---
title: Overview Socket.IO Serverless Mode
description: Get an overview of Azure's support for the open-source Socket.IO library on serverless mode.
keywords: Socket.IO, Socket.IO on Azure, serverless, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 08/5/2024
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Socket.IO Serverless Mode Specification

This documents describe the details of serverless support. As the Socket.IO supports including the serverless supports highly depends on the Web PubSub service's existing interface, it introduces many complicated transforming and mapping. For most users, we s

## Lifetime workflow

In the Socket.IO Serverless mode, the client's connection lifecycle is managed through a combination of persistent connections and webhooks. The workflow ensures that the serverless architecture can efficiently handle real-time communication while maintaining control over the client's connection state.

### Socket Connects

In the client side, you should use a Socket.IO compatible client. In the following client code, we uses the (official JavaScript client SDK)[https://www.npmjs.com/package/socket.io-client].

Client:

```javascript
// Initiate a socket
var socket = io("<service-endpoint>", {
    path: "/clients/socketio/hubs/<hub-name>",
    query: { access_token: "<access-token>"}
});

// handle the connection to the namespace
socket.on("connect", () => {
  // ...
});
```

Explaination of the previous sample:
- The `<service-endpoint>` is the `Endpoint` of the service resource.
- The `<hub-name>` in `path` is a concept in Web PubSub for Socket.IO, which provides isolation between hubs.
- The `<access-token>` is a JWT used to authenticate with the service. See (How to generate access token)[] for details. 

### Authentication

When a client attempts to connect to the service, the process is divided into two distinct steps: establishing an Engine.IO (physical) connection and connecting to a namespace, which is referred to as a socket in Socket.IO terminology. The authentication process differs between these two steps:

1. **Engine.IO connection**: During this step, the service authenticates the client using an access token to determine whether to accept the connection. If the corresponding hub is configured to allow anonymous mode, the Engine.IO connection can proceed without validating the access token. However, for security reasons, it is recommended to disable anonymous mode in production environments.

2. **Socket**: After the Engine.IO connection is successfully established, the client SDK sends a payload to connect to a namespace. Upon receiving the socket connect request, the service triggers a connect call to the event handler. The outcome of this step depends on the status code returned by the connect response: a 200 status code indicates that the socket is approved, while a 4xx or 5xx status code results in the socket being rejected.

3. Once a socket is connected, the service triggers a connected call to the event handler. It's an asynchonized call to notify the event handler a socket is successfully connected.

### Sending messages

Clients can send messages using the following code:

```javascript
socket.emit("hello", "world");
```

In this example, the message is sent with the **EventName** "hello", and the following arguments are the parameters. The service will trigger a corresponding user event with the same event name. This is a synchronous call, and the response data will be returned to the client unchanged. It is a common practice to include an acknowledgment in the response body to confirm that the message was received and processed.

For example, the client emit message with ack:

```javascript
socket.emit("hello", "world", (response) => {
  console.log(response);
});
```

The event handler may respond with a body like `{ type: ACK, namespace: "/", data: ["bar"], id: 13 }` to acknowledge the emission. This response confirms the receipt and handling of the message by the server.

### Socket Disconnects

Client disconnects from a namespace or the corresponding Engine.IO connection closes results in socket close. Service will trigger a disconnected event for every disconnected sockets. It's an asynchronized call for notification.

## Supported functionality and RESTful APIs

A server can leverage RESTful APIs to manage Socket.IO clients and send message to clients as well. As Socket.IO reuses the Web PubSub service RESTful APIs, Socket.IO terminology will be transformed into Web PubSub terminology. The following documents will elaborate the transformation.

### Key Concept

#### Namespace, Room and Group Mapping

As Socket.IO has the terminology namespace and room while Web PubSub service doesn't, we're mapping the namespace and room into groups.

```
Group name <--> 0~Base64UrlEncoded(namespace)~Base64UrlEncoded(room)
```

To represent the whole namespace:

```
Group name <--> 0~Base64UrlEncoded(namespace)~
```

See [Base64URL Standard](https://base64.guru/standards/base64url), which is a base64 protocol that has ability to use the encoding result as filename or URL address.

For example:

```
Namespace = /, Room = rm <--> Group = 0~Lw~cm0
Namespace = /ns, Room = rm <--> Group = 0~L25z~cm0
Namespace = /ns <--> Group = 0~L25z~
```

#### Connection ID

Connection ID  uniquely identifies an Engine.IO connection. Different sockets running on the same Engine.IO connection share the same connection ID.

#### Socket ID

A Socket ID uniquely identifies a socket connection. According to the Socket.IO specification, each socket automatically joins a room with the same name as its Socket ID. For example, a socket with the Socket ID "abc" is automatically placed in the room "abc." This design allows you to send a message specifically to that socket by targeting the corresponding room with the same name as the Socket ID.

### Add socket to room

```Http
POST {endpoint}/api/hubs/{hub}/:addToGroups?api-version=2024-01-01
```

#### Request Body
```json
{
  "filter": "An OData filter which target connections satisfy",
  "groups": [] // Target group
}
```

See [Add Connections to Groups](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/add-connections-to-groups?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [OData filter syntax in the Azure Web PubSub service](https://learn.microsoft.com/azure/azure-web-pubsub/reference-odata-filter) for filter details.

#### Example

Add socket `socketId` in namespace `/ns` to room `rm` in hub `myHub`.

```HTTP
POST {endpoint}/api/hubs/myHub/:addToGroups?api-version=2024-01-01

{
  "filter": "'0~L25z~c29ja2V0SWQ' in groups"
  "groups": [ "'0~L25z~cm0" ]
}
```

### Remove socket from room

```Http
POST {endpoint}/api/hubs/{hub}/:removeFromGroups?api-version=2024-01-01
```

#### Request Body
```json
{
  "filter": "An OData filter which target connections satisfy",
  "groups": [] // Target group
}
```

See [Remove Connections From Groups](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/remove-connections-from-groups?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [OData filter syntax in the Azure Web PubSub service](https://learn.microsoft.com/azure/azure-web-pubsub/reference-odata-filter) for filter details.

#### Example

Remove socket `socketId` in namespace `/ns` from room `rm` in hub `myHub`.

```HTTP
POST {endpoint}/api/hubs/myHub/:removeFromGroups?api-version=2024-01-01

{
  "filter": "'0~L25z~c29ja2V0SWQ' in groups"
  "groups": [ "'0~L25z~cm0" ]
}
```

### Send to a socket

```Http
POST {endpoint}/api/hubs/{hub}/groups/{group}/:send?api-version=2024-01-01

Content-Type: text/plain
```

#### Request Body

```
Engine.IO serialized payload
```

See [Send To All](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/send-to-all?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [Engine.IO Protocl](https://socket.io/docs/v4/engine-io-protocol/) for Engine.IO Protocl details.

#### Example

Send message `{"eventName", "arg1", "arg2"}` to socket `socketId` in namespace `/ns` in hub `myHub`.

Such message can be handled by client:

```javascript
socket.on('eventName', (arg1, arg2) => {
  // ...
});
```

```HTTP
POST {endpoint}/api/hubs/myHub/groups/0~L25z~c29ja2V0SWQ/:send?api-version=2024-01-01

42/ns,["eventName","arg1","arg2"]
```

### Send to a room

```Http
POST {endpoint}/api/hubs/{hub}/groups/{group}/:send?api-version=2024-01-01

Content-Type: text/plain
```

#### Request Body

```
Engine.IO serialized payload
```

See [Send To All](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/send-to-all?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [Engine.IO Protocl](https://socket.io/docs/v4/engine-io-protocol/) for Engine.IO Protocl details.

#### Example

Send message `{"eventName", "arg1", "arg2"}` to room `rm` in namespace `/ns` in hub `myHub`.

Such message can be handled by client:

```javascript
socket.on('eventName', (arg1, arg2) => {
  // ...
});
```

```HTTP
POST {endpoint}/api/hubs/myHub/groups/0~L25z~cm0/:send?api-version=2024-01-01

42/ns,["eventName","arg1","arg2"]
```

### Send to namespace

```Http
POST {endpoint}/api/hubs/{hub}/groups/{group}/:send?api-version=2024-01-01

Content-Type: text/plain
```

#### Request Body

```
Engine.IO serialized payload
```

See [Send To All](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/send-to-all?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [Engine.IO Protocl](https://socket.io/docs/v4/engine-io-protocol/) for Engine.IO Protocl details.

#### Example

Send message `{"eventName", "arg1", "arg2"}` to namespace `/ns` in hub `myHub`.

Such message can be handled by client:

```javascript
socket.on('eventName', (arg1, arg2) => {
  // ...
});
```

```HTTP
POST {endpoint}/api/hubs/myHub/groups/0~L25z~/:send?api-version=2024-01-01

42/ns,["eventName","arg1","arg2"]
```

### Disconnect socket

```Http
POST {endpoint}/api/hubs/{hub}/groups/{group}/:send?api-version=2024-01-01

Content-Type: text/plain
```

#### Request Body

```
Engine.IO serialized payload for socket disconnection
```

See [Send To All](https://learn.microsoft.com/rest/api/webpubsub/dataplane/web-pub-sub/send-to-all?view=rest-webpubsub-dataplane-2024-01-01&tabs=HTTP) for REST details. See [Engine.IO Protocl](https://socket.io/docs/v4/engine-io-protocol/) for Engine.IO Protocl details. See [Disconnection from a namespace](https://socket.io/docs/v4/socket-io-protocol/#disconnection-from-a-namespace-1) for disconnection payload details.

#### Example

Disconnect socket `socketId` in namespace `/ns` in hub `myHub`.

```HTTP
POST {endpoint}/api/hubs/myHub/groups/0~L25z~c29ja2V0SWQ/:send?api-version=2024-01-01

41/ns,
```

## Event Handler Specification

Event handler may handle `connect`, `connected`, `disconnected` and other message events from clients. They're REST calls triggered from the service.

### Connect Event

Service triggers `connect` event when a socket is connecting. Event handler can use `connect` event to auth and accept or reject the socket

Request:

```
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: xxx
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.connect
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2024-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: connect
ce-namespace: {namespace}
ce-socketId: {socketId}

{
  "claims": {}, // claims of jwt of client
  "query": {}, // query string of client connect request
  "headers": {}, // headers of client connect request
  "clientCertificates": [
    {
      "thumbprint": "ABC"
    }
  ]
}
```

Successful Response:

```
HTTP/1.1 200 OK
```

Non-success status code means the event handler rejects the socket.

### Connected Event

Service trigger `connected` event when a socket is connected successfully.

Request:

```
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.connected
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2024-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: connected
ce-namespace: {namespace}
ce-socketId: {socketId}

{}
```

Response:

Connected event is an asynchronized event, response doesn't matters.

```
HTTP/1.1 200 OK
```

### Disconnected Event

Service triggers `disconnected` event when a socket is disconnected.

Request:

```
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: xxxx
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.disconnected
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: disconnected
ce-namespace: {namespace}
ce-socketId: {socketId}

{
    "reason": "{Reason}" // Empty if connection close normally. Reason only implies the close is abnormal.
}
```

Response:

`disconnected` is an asynchronized method, response doesn't matters

```
HTTP/1.1 200 OK
```

### Message Event

The service triggers a corresponding message event with the same event name.

Request:

```
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: text/plain
Content-Length: xxxx
ce-specversion: 1.0
ce-type: azure.webpubsub.user.message
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: {eventName}
ce-namespace: {namespace}
ce-socketId: {socketId}

Engine.IO serialized payload
```

Response:

The data in body will be directly send to corresponding client. Usually it's used for ack message. (When the request contains an AckId)

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: nnnn

UserResponsePayload (Engine.IO serialized payload)
```

Or

```
HTTP/1.1 204 No Content
```
