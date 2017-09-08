---
title: Availability of Service Fabric services | Microsoft Docs
description: Describes fault detection, failover, and recovery for services
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 279ba4a4-f2ef-4e4e-b164-daefd10582e4
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider

---

# Availability of Service Fabric services
This article gives an overview of how Service Fabric maintains availability of a service.

## Availability of Service Fabric stateless services
Azure Service Fabric services can be either stateful or stateless. A stateless service is an application service that does not have any [local state](service-fabric-concepts-state.md) that needs to be highly available or reliable.

Creating a stateless service requires defining an `InstanceCount`. The instance count defines the number of instances of the stateless service's application logic that should be running in the cluster. Increasing the number of instances is the recommended way of scaling out a stateless service.

When an instance of a stateless named service fails, a new instance is created on some eligible node in the cluster. For example, a stateless service instance might fail on Node1 and be recreated on Node5.

## Availability of Service Fabric stateful services
A stateful service has some state associated with it. In Service Fabric, a stateful service is modeled as a set of replicas. Each replica is a running instance of the code of the service that also has a copy of the state for that service. Read and write operations are performed at one replica (called the Primary). Changes to state from write operations are *replicated* to the other replicas in the replica set (called Active Secondaries) and applied. 

There can be only one Primary replica, but there can be multiple Active Secondary replicas. The number of Active Secondary replicas is configurable, and a higher number of replicas can tolerate a greater number of concurrent software and hardware failures.

If the Primary replica goes down, Service Fabric makes one of the Active Secondary replicas the new Primary replica. This Active Secondary replica already has the updated version of the state (via *replication*), and it can continue processing further read and write operations. This process is known as reconfiguration and is described further in [Reconfiguration](service-fabric-concepts-reconfiguration.md).

This concept, of a replica being either a Primary or Active Secondary, is known as the Replica Role. These are described further in [Replicas and Instances](service-fabric-concepts-replica-lifecycle.md). 

## Next steps
For more information on Service Fabric concepts, see the following articles:

- [Scaling Service Fabric services](service-fabric-concepts-scalability.md)
- [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)
- [Defining and managing state](service-fabric-concepts-state.md)
- [Reliable Services](service-fabric-reliable-services-introduction.md)
