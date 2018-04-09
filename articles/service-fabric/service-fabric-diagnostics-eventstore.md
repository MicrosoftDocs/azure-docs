---
title: Service Fabric Event Store  | Microsoft Docs
description: Learn about Azure Service Fabric's EventStore
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/10/2018
ms.author: dekapur

---

# EventStore Overview

>[!NOTE]
>As of Service Fabric version 6.2. the EventStore APIs are currently in preview for Windows clusters running on Azure only. We are working on porting this functionality to Linux as well as our Standalone clusters.

The Event Store in an out-of-the-box monitoring option in Service Fabric, which provides a way for you to understand the state of your cluster or workloads at a given point in time. Service Fabric exposes several structured platform events via the Operational Channel today, but also exposes the same events through the Event Store APIs. These APIs allow you to query the cluster directly to get diagnostics data on various entities in your cluster and should be used to help:
* Diagnose issues in development or testing, where you might not have a fully baked monitoring pipeline available
* Confirm that management actions you are taking on your cluster are being processed correctly by your cluster

To see a full list of events available in the EventStore, have a look at Service Fabric's [Operational Channel events](service-fabric-diagnostics-event-generation-operational.md). 

The EventStore also looks at various operations in the cluster and attempts to correlate certain activities together. For example, if there is an unexpected change in your replica configuration, i.e. a secondary replica becomes promoted to being primary because the node with your primary on it is having issues, when exposing the event for the replica, the EventStore will also look at other events exposed by the platform to attempt to connect this with a `NodeDown` event. this helps with faster failure detection and root causes analysis.

The EventStore exposes events on various levels, so you can query for events for the following entities in your cluster:
* Cluster
* Application
* Service
* Partition
* Replica 
* Container

This data is exposed through REST APIs as well as Service Fabric's client tooling. See [Query EventStore APIs for cluster events](service-fabric-diagnostics-eventstore.md) to learn how to do this.

## Next steps
* Learn more about monitoring and diagnostics in Service Fabric - [Monitoring and Diagnostics overview](service-fabric-diagnostics-overview.md)
* 