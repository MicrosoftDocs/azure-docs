---
title: References - How to collect client logs
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect client logs.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect client logs
The client logs can help when we want to get more details while debugging an issue.
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

For debugging purposes, `info` level logging is sufficient in most cases.

In the browser environment, [@azure/logger](https://www.npmjs.com/package/@azure/logger) outputs logs to the console by default.
You can redirect logs by overriding `AzureLogger.log` method. For more information, see [@azure/logger](/javascript/api/overview/azure/logger-readme).

Your app might keep logs in memory if it has a \'download log file\' feature.
If that is the case, you have to set a limit on the log size.
Not setting a limit might cause memory issues on long running calls.

Additionally, if you send logs to a remote service, consider mechanisms such as compression and scheduling.
If the client has insufficient bandwidth, sending a large amount of log data in a short period of time can affect call quality.
