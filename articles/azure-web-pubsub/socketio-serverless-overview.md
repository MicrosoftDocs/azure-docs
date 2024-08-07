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

# Overview Socket.IO Serverless Mode

Socket.IO is a library that enables real-time, bidirectional, and event-based communication between web clients and servers. Traditionally, Socket.IO operates in a server-client architecture, where the server handles all communication logic and maintains persistent connections.

With the increasing adoption of serverless computing, we're introducing a new mode: Socket.IO Serverless mode. This mode allows Socket.IO to function in a serverless environment, handling communication logic through RESTful APIs or webhooks, offering a scalable, cost-effective, and maintenance-free solution.

## Differences Between Default Mode and Serverless Mode
| Feature | Default Mode | Serverless Mode |
|------------|------------|------------|
|Architecture|Use persistent connection for both servers and clients | Clients use persistent connections but servers use RESTful APIs and webhook event handlers in a stateless manner|
|SDKs and Languages| Official JavaScript server SDKs together with []() is required; All compatible clients|No mandatery SDKs or languages. Use ()[] to simplified integrate with Azure Function; All compatible clients|
|Network Accessibility| The server doesn't need to expose network access as it proactively make connection to the service|The server needs to expose network access to the service|
|Feature supports|Most features are supported except some unsupported features()[]|See list of supported features()[]|
