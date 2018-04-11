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

Introduced in version 6.2, the EventStore in an out-of-the-box monitoring option in Service Fabric, which provides a way for you to understand the state of your cluster or workloads at a given point in time. 
The EventStore exposes Service Fabric events through APIs that you can make calls. To see a full list of events available in the EventStore, see [Service Fabric events](service-fabric-diagnostics-event-generation-operational.md). 

Service Fabric events are available for each entity in your cluster. These EventStore APIs allow you to query the cluster directly to get diagnostics data on any entity in your cluster and should be used to help:
* Diagnose issues in development or testing, where you might not have a fully baked monitoring pipeline available
* Confirm that management actions you are taking on your cluster are being processed correctly by your cluster

The EventStore also has the ability to correlate events in your cluster. By looking at events that were written at the same time from different entities that may have impacted each other, the EventStore service is able to link these events to help with identifying causes for activities in your cluster. 
For example, if there is an unexpected change in your replica configuration, i.e., a secondary replica is unexpectedly promoted, when exposing the event for the replica, the EventStore will also look at other events exposed by the platform and correlate this with a `NodeDown` event. This means that the node hosting your primary replica went down, causing this change. Correlation helps with faster failure detection and root causes analysis.

To get started with using the EventStore, see [Query EventStore APIs for cluster events](service-fabric-diagnostics-eventstore.md).

## Next steps
* Overview of monitoring and diagnostics in Service Fabric - [Monitoring and Diagnostics overview](service-fabric-diagnostics-overview.md)
* Learn more about monitoring your cluster - [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md).