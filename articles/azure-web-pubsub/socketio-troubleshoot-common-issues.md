---
title: Troubleshoot Socket.IO common problems
description: Learn how to troubleshoot common problems with the Socket.IO library and the Azure Web PubSub service.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, Socket.IO issues, socketio, azure socketio
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# Troubleshoot Socket.IO common problems

Web PubSub for Socket.IO builds on the Socket.IO library. When you're using the Azure service, problems might lie with the service or with the library.

To find the origin of problems, you can isolate the Socket.IO library by temporarily removing Web PubSub for Socket.IO from your application. If the application works as expected after the removal, the root cause is probably with the Azure service.

Use this article to find solutions to common problems with the service. Additionally, you can [enable logging on the server side](./socketio-troubleshoot-logging.md#server-side) to examine the behavior of your Socket.IO app, if none of the listed solutions help.

If you suspect that the problems are with the Socket.IO library, refer to the [Socket.IO library's documentation](https://socket.io/docs/v4/troubleshooting-connection-issues/).

## Server side

### Improper package import

#### Possible error

`TypeError: (intermediate value).useAzureSocketIO is not a function`

#### Root cause

If you use TypeScript in your project, you might observe this error. It's due to improper package import.

```typescript
// Bad example
import * as wpsExt from "@azure/web-pubsub-socket.io"
```

If a package isn't used or referenced after importing, the default behavior of the TypeScript compiler is not to emit the package in the compiled *.js* file.

#### Solution

Use `import "@azure/web-pubsub-socket.io"` instead. This import statement forces the TypeScript compiler to include a package in the compiled *.js* file, even if the package isn't referenced anywhere in the source code. [Read more](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit) about this frequently asked question from the TypeScript community.

```typescript
// Good example. 
// It forces TypeScript to include the package in compiled .js file.
import "@azure/web-pubsub-socket.io"
```

## Client side

### Incorrect path option

#### Possible error

`GET <web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

#### Root cause

The Socket.IO client was created without a correct `path` option.

```javascript
// Bad example
const socket = io(endpoint)
```

#### Solution 

Add the correct `path` option with the value `/clients/socketio/hubs/eio_hub`.

```javascript
// Good example
const socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

### Incorrect Web PubSub for Socket.IO endpoint

#### Possible error

`GET <non-web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

#### Root cause

The Socket.IO client was created without a correct Web PubSub for Socket.IO endpoint. For example:

```javascript
// Bad example. 
// This example uses the original Socket.IO server endpoint. 
const endpoint = "socketio-server.com";
const socket = io(endpoint, {
    path: "/clients/socketio/hubs/<Your hub name>",
});
```

When you use Web PubSub for Socket.IO, your clients establish connections with an Azure service. When you create a Socket.IO client, you need to use the endpoint for your Web PubSub for Socket.IO resource.  

#### Solution

Let Socket.IO client use the endpoint for your Web PubSub for Socket.IO resource.

```javascript
// Good example.
const webPubSubEndpoint = "<web-pubsub-endpoint>";
const socket = io(webPubSubEndpoint, {
    path: "/clients/socketio/hubs/<Your hub name>",
});
```
