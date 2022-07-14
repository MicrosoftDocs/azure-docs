---
title: include file
description: include file
author: sburckha
ms.service: azure-functions
ms.topic: include
ms.date: 06/03/2021
ms.author: sburckha
ms.custom: include file
---

The Azure Storage provider represents the task hub in storage using the following components:

* Two Azure Tables store the instance states.
* One Azure Queue stores the activity messages.
* One or more Azure Queues store the instance messages. Each of these so-called *control queues* represents a [partition](durable-functions-perf-and-scale.md#partition-count) that is assigned a subset of all instance messages, based on the hash of the instance ID.
* A few extra blob containers used for lease blobs and/or large messages.

For example, a task hub named `xyz` with `PartitionCount = 4` contains the following queues and tables:

![Diagram showing Azure Storage provider storage storage organization for 4 control queues.](./media/durable-functions-task-hubs/azure-storage.png)
