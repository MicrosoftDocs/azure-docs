---
title: How to troubleshoot Socket.IO common issues
description: Learn how to troubleshoot Socket.IO common issues
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# Troubleshooting for common issues

Web PubSub for Socket.IO builds on Socket.IO library. When you use this Azure service, issues may lie with Socket.IO library itself or the service.

## Issues with Socket.IO library

To determine if the issues are with Socket.IO library, you can isolate it by temporarily removing Web PubSub for Socket.IO from your application. If the application works as expected after the removal, the root cause is probably with the Azure service.

If you suspect the issues are with Socket.IO library, refer to [Socket.IO library's documentation](https://socket.io/docs/v4/troubleshooting-connection-issues/) for common connection issues.

## Issues with Web PubSub for Socket.IO 
If you suspect that the issues are with the Azure service after investigation, take a look at the list of common issues. 

Additionally, you can [enable logging on the server side](./socketio-troubleshoot-logging.md#server-side) to examine closely the behavior of your Socket.IO app, if none of the listed issues helps.

### Server side

#### `useAzureSocketIO is not a function`
##### Possible error
- `TypeError: (intermediate value).useAzureSocketIO is not a function`

##### Root cause
If you use TypeScript in your project, you may observe this error. It's due to the improper package import. 

```typescript
// Bad example
import * as wpsExt from "@azure/web-pubsub-socket.io"
```
If a package isn't used or referenced after importing, the default behavior of TypeScript compiler is not to emit the package in the compiled `.js` file.

##### Solution
Use `import "@azure/web-pubsub-socket.io"`, instead. This import statement forces TypeScript compiler to include a package in the compiled `.js` file even if the package isn't referenced anywhere in the source code. [Read more](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit)about this frequently asked question from the TypeScript community.
```typescript
// Good example. 
// It forces TypeScript to include the package in compiled `.js` file.
import "@azure/web-pubsub-socket.io"
```

### Client side

#### `404 Not Found in client side with AWPS endpoint`
##### Possible Error
 `GET <web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

##### Root cause
Socket.IO client is created without a correct `path` option.
```javascript
// Bad example
const socket = io(endpoint)
```

##### Solution 
Add the correct `path` option with value `/clients/socketio/hubs/eio_hub`
```javascript
// Good example
const socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

#### `404 Not Found in client side with non-AWPS endpoint`

##### Possible Error
 `GET <non-web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

##### Root cause
Socket.IO client is created without correct Web PubSub for Socket.IO endpoint. For example, 

```javascript
// Bad example. 
// This example uses the original Socket.IO server endpoint. 
const endpoint = "socketio-server.com";
const socket = io(endpoint, {
    path: "/clients/socketio/hubs/<Your hub name>",
});
```

When you use Web PubSub for Socket.IO, your clients establish connections with an Azure service. When creating a Socket.IO client, you need use the endpoint to your Web PubSub for Socket.IO resource.  

##### Solution
Let Socket.IO client use the endpoint of your Web PubSub for Socket.IO resource.

```javascript
// Good example.
const webPubSubEndpoint = "<web-pubsub-endpoint>";
const socket = io(webPubSubEndpoint, {
    path: "/clients/socketio/hubs/<Your hub name>",
});
``` 
