---
title: Azure Service Fabric Event Store  | Microsoft Docs
description: Learn about Azure Service Fabric's EventStore
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/25/2018
ms.author: dekapur

---

# EventStore service overview

>[!NOTE]
>As of Service Fabric version 6.2. the EventStore APIs are currently in preview for Windows clusters running on Azure only. We are working on porting this functionality to Linux as well as our Standalone clusters.

## Overview

Introduced in version 6.2, the EventStore service is a monitoring option in Service Fabric, which provides a way for you to understand the state of your cluster or workloads at a given point in time. 
The EventStore service exposes Service Fabric events through APIs that you can make calls. These EventStore APIs allow you to query the cluster directly to get diagnostics data on any entity in your cluster and should be used to help:
* Diagnose issues in development or testing, or where you might be using a monitoring pipeline
* Confirm that management actions you are taking on your cluster are being processed correctly by your cluster

To see a full list of events available in the EventStore, see [Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).

The EventStore service can be queried for events that are available for each entity and entity type in your cluster. This means you can query for events on the following levels;
* Cluster: all cluster level events
* Nodes: all node level events
* Node: events specific to one node, based on `nodeName`
* Applications: all application level events
* Application: events specific to one application
* Services: events from all services in your clusters
* Service: events from a specific service
* Partitions: events from all partitions
* Partition: events from a specific partition
* Replicas: events from all replicas / instances
* Replica: events from a specific replica / instance


The EventStore service also has the ability to correlate events in your cluster. By looking at events that were written at the same time from different entities that may have impacted each other, the EventStore service is able to link these events to help with identifying causes for activities in your cluster. For example, if one of your applications happens to become unhealthy without any induced changes, the EventStore will also look at other events exposed by the platform and could correlate this with a `NodeDown` event. This helps with faster failure detection and root causes analysis.

To get started with using the EventStore service, see [Query EventStore APIs for cluster events](service-fabric-diagnostics-eventstore-query.md).

## Next steps
* Overview of monitoring and diagnostics in Service Fabric - [Monitoring and Diagnostics for Service Fabric](service-fabric-diagnostics-overview.md)
* Learn more about monitoring your cluster - [Monitoring the cluster and platform](service-fabric-diagnostics-event-generation-infra.md).