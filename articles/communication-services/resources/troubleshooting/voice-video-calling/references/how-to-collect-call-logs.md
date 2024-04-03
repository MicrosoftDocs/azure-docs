---
title: References - How to collect call logs
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect call logs.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect call logs
In cases where we are unable to debug an issue solely through service logs or telemetry, we may request client logs.
To collect client logs, you can use [@azure/logger](https://www.npmjs.com/package/@azure/logger), which is used by WebJS calling SDK internally.

```typescript
import { setLogLevel, createClientLogger, AzureLogger } from '@azure/logger';
setLogLevel('info');
let logger = createClientLogger('ACS');
const callClient = new CallClient({ logger });
// app logging
logger.info('....');

```

[@azure/logger](https://www.npmjs.com/package/@azure/logger) supports four different log levels:

* verbose
* info
* warning
* error

For debugging purposes, `info` level logging is usually sufficient.

In the browser environment, [@azure/logger](https://www.npmjs.com/package/@azure/logger) outputs logs to the console by default.
You can redirect logs by overriding `AzureLogger.log` method. For more details, see [@azure/logger](/javascript/api/overview/azure/logger-readme).

It is important to note that if you implement a log file download feature in your application and keep the logs in memory before they're downloaded and flushed,
you need to set a limit on the log size. If you don't set a limit, it may cause memory issues during a long running call.
Additionally, if you send logs to a remote service, you may need to consider mechanisms such as compression and scheduling.
When a client has limited bandwidth, a large amount of logs in a short period of time can affect call quality.

