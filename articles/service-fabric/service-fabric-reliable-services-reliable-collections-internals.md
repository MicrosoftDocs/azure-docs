---
title: Deep Dive Azure Service Fabric reliable Collections | Microsoft Docs
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

# Reliable State Manager and Collection Internals
This document delves inside Reliable State Manager and Reliable Collections to see how core components work behind the scenes.

> [!NOTE]
> Note that this document is work in-progress. Add comments below to tell us what topic you would exposed next.
>

##  Checkpoint & Log Persistence Model
The Reliable State Manager and Reliable Collections follow a persistence model that is called Log and Checkpoint.
This is a model where each state change is logged on disk and applied only in memory.
The complete state itself is persisted only occasionally (a.k.a. Checkpoint).
The benefit is that deltas are turned into sequential append-only writes on disk for improved performance.

To better understand the Log and Checkpoint model, let’s first look at the infinite disk scenario.
The Reliable State Manager logs every operation before it is replicated.
This allows the Reliable Collection to apply only the operation in memory.
Since logs are persisted, even when the replica fails and needs to be restarted, the Reliable State Manager has enough information in its logs to replay all the operations the replica has lost.
As the disk is infinite, log records never need to be removed and the Reliable Collection needs to manage only the in-memory state.

Now let’s look at the finite disk scenario.
As log records accumulate, the Reliable State Manager will run out of disk space.
Before that happens, the Reliable State Manager needs to truncate its log to make room for the newer records.
It will request the Reliable Collections to checkpoint their in-memory state to disk.
It is the Reliable Collections' responsibility to persist its state up to that point.
Once the Reliable Collections complete their checkpoints, the Reliable State Manager can truncate the log to free up disk space.
This way, when the replica needs to be restarted, Reliable Collections will recover their checkpointed state, and the Reliable State Manager will recover and play back all the state changes that occurred since the checkpoint.

> [!NOTE]
> Another value add of checkpointing is that it improves recovery performance in common cases.
> This is because checkpoints contain only the latest versions.
> 

## Next steps
* [Transactions and Locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)

