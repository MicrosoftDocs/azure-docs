---
title: How to troubleshoot Socket.IO common issues
description: Learn how to troubleshoot Socket.IO common issues
author: xingsy97
ms.author: xiyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# Troubleshooting for common issues

It's helpful to group issues you may observe into these areas. 
- serve side
- client side
- Socket.IO library
- Web PubSub for Socket.IO 

## Server side

### `useAzureSocketIO is not a function`
#### Possible error
- `TypeError: (intermediate value).useAzureSocketIO is not a function`

#### Root cause
If you are TypeScript in your project, you may observe this error. This is due to the improper package import. 

```typescript
// Bad example
import * as wpsExt from "@azure/web-pubsub-socket.io"
```
If a package is not used or referenced after importing, the default behavior of TypeScript compiler is not to emit the package in the compiled `.js` file.

#### Solution
Use `import "@azure/web-pubsub-socket.io"`, instead. This import statement will force TypeScript compiler to include a package in the comiled `.js` file even if the pacakge is not referenced anywhere in the source code. [Read more](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit)about this frequenctly asked question from the TypeScript community.
```typescript
// Good example. 
// It forces TypeScript to include the package in compiled `.js` file.
import "@azure/web-pubsub-socket.io"
```

## Client side

### `404 Not Found in client side with AWPS endpoint`
#### Possible Error
 `GET <web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

#### Root cause
Socket.IO client is created without a correct `path` option.
```javascript
// Bad example
const socket = io(endpoint)
```

#### Solution 
Add the correct `path` option with value `/clients/socketio/hubs/eio_hub`
```javascript
// Good example
const socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

### `404 Not Found in client side with non-AWPS endpoint`

#### Possible Error
 `GET <non-web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

#### Root cause
Socket.IO client is created without correct Web PubSub for Socket.IO endpoint. For example, 

```javascript
// Bad example. 
// This example uses the original Socket.IO server endpoint. 
const endpoint = "socketio-server.com";
var socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

Using Web PubSub for Socket.IO, your clients establish connections with an Azure service. When creating a Socket.IO client, you need to endpoint to your Web PubSub for Socket.IO resource.  

#### Solution
Let Socket.IO client use the endpoint of your Web PubSub for Socket.IO resource.

```javascript
// Good example.
const webPubSubEndpoint = "<web-pubsub-endpoint>";
var socket = io(webPubSubEndpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

## Socket.IO library
When using Web PubSub for Socket.IO, the issue may lie with Socket.IO library itself or the Azure service.

To determine if the issues are with Socket.IO libray, you can isolate it by temporarily removing Web PubSub for Socket.IO from your application. If the application works as expected after the removal, the root cause is probably with the Azure service.

Refer to [Socket.IO library's documentation](https://socket.io/docs/v4/troubleshooting-connection-issues/) for common connection issues.

## Web PubSub for Socket.IO 
If you suspect that the issue is with the Azure service, you can [enable logging on the server side](./socketio-troubleshoot-logging.md#server-side). 
