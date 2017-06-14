---
title: Azure Service Fabric Reliable State Manager and Reliable Collection internals | Microsoft Docs
description: Deep dive on reliable collection concepts and design in Azure Service Fabric.
services: service-fabric
documentationcenter: .net
author: mcoskun
manager: timlt
editor: rajak

ms.assetid: 62857523-604b-434e-bd1c-2141ea4b00d1
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 5/1/2017
ms.author: mcoskun

---

# Azure Service Fabric Reliable State Manager and Reliable Collection internals
This document delves inside Reliable State Manager and Reliable Collections to see how core components work behind the scenes.

> [!NOTE]
> This document is work in-progress. Add comments to this article to tell us what topic you would like to learn more about.
>

##  Local persistence model: log and checkpoint
The Reliable State Manager and Reliable Collections follow a persistence model that is called Log and Checkpoint.
In this model, each state change is logged on disk first and then applied in memory.
The complete state itself is persisted only occasionally (a.k.a. Checkpoint).
The benefit is that deltas are turned into sequential append-only writes on disk for improved performance.

To better understand the Log and Checkpoint model, let’s first look at the infinite disk scenario.
The Reliable State Manager logs every operation before it is replicated.
Logging allows the Reliable Collections to apply the operation only in memory.
Since logs are persisted, even when the replica fails and needs to be restarted, the Reliable State Manager has enough information in its log to replay all the operations the replica has lost.
As the disk is infinite, log records never need to be removed and the Reliable Collection needs to manage only the in-memory state.

Now let’s look at the finite disk scenario.
As log records accumulate, the Reliable State Manager will run out of disk space.
Before that happens, the Reliable State Manager needs to truncate its log to make room for the newer records.
Reliable State Manager requests the Reliable Collections to checkpoint their in-memory state to disk.
At this point, the Reliable Collections' would persist its in-memory state.
Once the Reliable Collections complete their checkpoints, the Reliable State Manager can truncate the log to free up disk space.
When the replica needs to be restarted, Reliable Collections recover their checkpointed state, and the Reliable State Manager recovers and plays back all the state changes that occurred since the last checkpoint.

Another value add of checkpointing is that it improves recovery times in common scenarios. 
Log contains all operations that have happened since the last checkpoint.
So it may include multiple versions of an item like multiple values for a given row in Reliable Dictionary.
In contrast, a Reliable Collection checkpoints only the latest version of each value for a key.

## Next steps
* [Transactions and Locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)

