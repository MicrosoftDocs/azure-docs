---
title: How to collect logs in Azure Socket.IO
description: Learn how to collect logs in Azure Socket.IO
author: xingsy97
ms.author: xingsy97
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# How to collect logs in Azure Socket.IO

### Server side
Native [Socket.IO](https://socket.io/docs/v4/logging-and-debugging/) framework uses [debug](https://github.com/visionmedia/debug) as its logging utility. Our server SDK follows it for all logic which is directly tied to Socket.IO. 

- Print all debug information:
```bash
DEBUG=* node yourfile.js
```

- Print debug information from different package.

Examples for [`socket.io`](https://github.com/socketio/socket.io), [`engine.io`](https://github.com/socketio/engine.io) and server SDK [`@azure/web-pubsub-socket.io`](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-socketio-extension) are shown below. 

```bash
# Print debug information from package socket.io
DEBUG=socket.io:* node yourfile.js

# Print debug information from package engine.io
DEBUG=engine:* node yourfile.js

# Print debug information from server SDK package
DEBUG=wps-sio-ext:* node yourfile.js
```

- Print debug information from mulitple packages:
```bash
DEBUG=engine:*,socket.io:*,wps-sio-ext:* node yourfile.js
```

### Client side
Web PubSub for Socket.IO doesn't modify the client package. The client-side logging with Web PubSub is same as the native Socket.IO

#### Client in Node
- Print all debug information
```bash
DEBUG=* node yourfile.js
```

- Print debug information from different package
```bash
# Print debug information from package socket.io-client
DEBUG=socket.io-client:* node yourfile.js

# Print debug information from package engine.io-client
DEBUG=engine.io-client:* node yourfile.js
```

- Print debug information from multiple package
```bash
DEBUG=socket.io-client:*,engine.io-client* node yourfile.js
```

#### Client in browser
In browser, use `localStorage.debug = '<scope>'` instead of `DEBUG=<scope>` in Node.

For example, in browser, use code below to print all debug information.
```bash
localStorage.debug = '*';
```

### Server connection logging
Server SDK uses an external package to build [Server Connection]() with the service. This external package uses [@azure/logger](https://www.npmjs.com/package/@azure/logger) as its logging utility. Enable its logging by setting environmental variable `AZURE_LOG_LEVEL`.

For example:

```bash
AZURE_LOG_LEVEL=verbose node yourfile.js
```

`Azure_LOG_LEVEL` has 4 levels: "verbose", "info", "warning" and "error".

## Related resources

- [Logging and debugging in Socket.IO](https://socket.io/docs/v4/logging-and-debugging/)
