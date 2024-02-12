---
title: Collect logs in Web PubSub for Socket.IO
description: This article explains how to collect logs when you're using Web PubSub for Socket.IO.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, Socket.IO logging, Socket.IO debugging, socketio, azure socketio
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# Collect logs in Web PubSub for Socket.IO

Like when you self-host the Socket.IO library, you can collect logs on both the server and client side when you use Web PubSub for Socket.IO.

## Server side

The server side includes two utilities that provide debugging capabilities:

- [DEBUG](https://github.com/debug-js/debug), which the Socket.IO library and extension library provided by Web PubSub use for certain logging.
- [@azure/logger](https://www.npmjs.com/package/@azure/logger), which provides lower-level network-related logging. Conveniently, it also allows you to set a log level.

### `DEBUG` JavaScript utility

#### Log all debug information

```bash
DEBUG=* node yourfile.js
```

#### Log the debug information from specific packages

```bash
# Logs debug information from the "socket.io" package
DEBUG=socket.io:* node yourfile.js

# Logs debug information from the "engine.io" package
DEBUG=engine:* node yourfile.js

# Logs debug information from the extension library "wps-sio-ext" provided by Web PubSub
DEBUG=wps-sio-ext:* node yourfile.js

# Logs debug information from multiple packages
DEBUG=engine:*,socket.io:*,wps-sio-ext:* node yourfile.js
```

:::image type="content" source="./media/socketio-troubleshoot-logging/log-debug.png" alt-text="Screenshot of logging information from DEBUG JavaScript utility":::

### `@azure/logger` utility

You can enable logging from the `@azure/logger` utility to get lower-level network-related information by setting the environmental variable `AZURE_LOG_LEVEL`.

```bash
AZURE_LOG_LEVEL=verbose node yourfile.js
```

`Azure_LOG_LEVEL` has four levels: `verbose`, `info`, `warning`, and `error`.

:::image type="content" source="./media/socketio-troubleshoot-logging/log-azure-logger.png" alt-text="Screenshot of logging information from the logger utility.":::

## Client side

Using Web PubSub for Socket.IO doesn't change how you debug the Socket.IO library. [Refer to the documentation](https://socket.io/docs/v4/logging-and-debugging/) from the Socket.IO library.

### Debug the Socket.IO client in Node

```bash
# Logs all debug information
DEBUG=* node yourfile.js

# Logs debug information from the "socket.io-client" package 
DEBUG=socket.io-client:* node yourfile.js

# Logs debug information from the "engine.io-client" package 
DEBUG=engine.io-client:* node yourfile.js

# Logs debug information from multiple packages 
DEBUG=socket.io-client:*,engine.io-client* node yourfile.js
```

### Debug the Socket.IO client in a browser

In a browser, use `localStorage.debug = '<scope>'`.

```bash
# Logs all debug information
localStorage.debug = '*';

# Logs debug information from the "socket.io-client" package 
localStorage.debug = 'socket.io-client';
```
