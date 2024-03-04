---
title: How to collect logs in Azure Socket.IO
description: This article explains how to collect logs when using Web PubSub for Socket.IO
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# How to collect logs using Web PubSub for Socket.IO

Like when you self-host Socket.IO library, you can collect logs on both the server and client side when you use Web PubSub for Socket.IO.

## Server-side
On the server-side, two utilities are included that provide debugging 
capabilities.
- [DEBUG](https://github.com/debug-js/debug), which is used by Socket.IO library and extension library provided by Web PubSub for certain logging.
- [@azure/logger](https://www.npmjs.com/package/@azure/logger), which provides more low-level network-related logging. Conveniently, it also allows you to set a log level. 

### `DEBUG` JavaScript utility

#### Logs all debug information
```bash
DEBUG=* node yourfile.js
```

#### Logs debug information of specific packages.
```bash
# Logs debug information of "socket.io" package
DEBUG=socket.io:* node yourfile.js

# Logs debug information of "engine.io" package
DEBUG=engine:* node yourfile.js

# Logs debug information of extention library "wps-sio-ext" provided by Web PubSub
DEBUG=wps-sio-ext:* node yourfile.js

# Logs debug information of mulitple packages
DEBUG=engine:*,socket.io:*,wps-sio-ext:* node yourfile.js
```
:::image type="content" source="./media/socketio-troubleshoot-logging/log-debug.png" alt-text="Screenshot of logging information from DEBUG JavaScript utility":::

### `@azure/logger` utility
You can enable logging from this utility to get more low-level network-related information by setting the environmental variable `AZURE_LOG_LEVEL`.

```bash
AZURE_LOG_LEVEL=verbose node yourfile.js
```

`Azure_LOG_LEVEL` has four levels: `verbose`, `info`, `warning` and `error`.
:::image type="content" source="./media/socketio-troubleshoot-logging/log-azure-logger.png" alt-text="Screenshot of logging information from @azure/logger utility":::

## Client side
Using Web PubSub for Socket.IO doesn't change how you debug Socket.IO library. [Refer to the documentation](https://socket.io/docs/v4/logging-and-debugging/) from Socket.IO library.

### Debug Socket.IO client in Node
```bash
# Logs all debug information
DEBUG=* node yourfile.js

# Logs debug information from "socket.io-client" package 
DEBUG=socket.io-client:* node yourfile.js

# Logs debug information from "engine.io-client" package 
DEBUG=engine.io-client:* node yourfile.js

# Logs debug information from multiple packages 
DEBUG=socket.io-client:*,engine.io-client* node yourfile.js
```

### Debug Socket.IO client in browser
In browser, use `localStorage.debug = '<scope>'`.

```bash
# Logs all debug information
localStorage.debug = '*';

# Logs debug information from "socket.io-client" package 
localStorage.debug = 'socket.io-client';
```
