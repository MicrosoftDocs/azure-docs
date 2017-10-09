---
title: Task hubs in Durable Functions - Azure
description: Learn what a task hub is in the Durable Functions extension for Azure Functions. Learn how to configure configure task hubs.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: azfuncdf
---

# Task hubs in Durable Functions (Azure Functions)

A *task hub* for [Durable Functions](durable-functions-overview.md) is a logical container for orchestrations and activities within the context of a single Azure storage account. Multiple functions and even function apps can exist in the same task hub, and the task hub often serves as an application container.

Task hubs do not need to be created explicitly. They are initialized automatically by the runtime, using a name that is declared in the *host.json* file. Each task hub has its own set of storage queues, tables, and blobs within a single storage account. All function apps that run in a given task hub share the same storage resources. Orchestrator and activity functions can only interact with each other when they belong to the same task hub.

## Configuring a task hub in host.json

A task hub name can be configured in the *host.json* file of a function app.

```json
{
  "durableTask": {
    "HubName": "MyTaskHub"
  }
}
```

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default task hub name for a function app is **DurableFunctionsHub**.

> [!NOTE]
> If you have multiple function apps that share a storage account, it is recommended to configure a different task hub name for each function app. This ensures that each function app is properly isolated from each other.

## Azure Storage resources

A task hub consists of several Azure Storage resources:

* One or more control queues.
* One work-item queue.
* One history table.
* One storage container containing one or more lease blobs.

All of these resources are created automatically in the default Azure Storage account when orchestrator or activity functions run or are scheduled to run. The [Performance & Scale](durable-functions-perf-and-scale.md) article explains how these resources are used.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)

