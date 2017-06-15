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
ms.date: 01/05/2017
ms.author: masnider

---
# Availability of Service Fabric services
This article gives an overview of how Service Fabric maintains availability of a service.

## Availability of Service Fabric stateless services
Azure Service Fabric services can be either stateful or stateless. A stateless service is an application service that does not have any [local persistent state](service-fabric-concepts-state.md).

Creating a stateless service requires defining an instance count. The instance count defines the number of instances of the stateless service's application logic that should be running in the cluster. Increasing the number of instances is the recommended way of scaling out a stateless service.

When a fault is detected on any instance of a stateless service, a new instance is created on some eligible node in the cluster.

## Availability of Service Fabric stateful services
A stateful service has some state associated with it. In Service Fabric, a stateful service is modeled as a set of replicas. Each replica is an instance of the code of the service that has a copy of the state. Read and write operations are performed at one replica (called the Primary). Changes to state from write operations are *replicated* to multiple other replicas (called Active Secondaries). The combination of Primary and Active Secondaries make up the replica set of the service.

There can be only one Primary replica servicing read and write requests, but there can be multiple Active Secondary replicas. The number of Active Secondary replicas is configurable, and a higher number of replicas can tolerate a greater number of concurrent software and hardware failures.

If the Primary replica goes down, Service Fabric makes one of the Active Secondary replicas the new Primary replica. This Active Secondary replica already has the updated version of the state (via *replication*), and it can continue processing further read and write operations.

This concept, of a replica being either a Primary or Active Secondary, is known as the Replica Role.

### Replica roles
The role of a replica is used to manage the life cycle of the state being managed by that replica. A replica whose role is Primary services read requests. The Primary also handles all write requests by updating its state and replicating the changes. These changes are applied to the Active Secondaries in the replica set. The job of an Active Secondary is to receive state changes that the Primary replica has replicated and update its view of the state.

> [!NOTE]
> Higher-level programming models such as the [reliable actors framework](service-fabric-reliable-actors-introduction.md) and [Reliable Services](service-fabric-reliable-services-introduction.md) abstract away the concept of replica role from the developer. In actors, the notion of role is unnecessary, while in Services it is visible if necessary but largely simplified.
>
>

## Next steps
For more information on Service Fabric concepts, see the following articles:

* [Scalability of Service Fabric services](service-fabric-concepts-scalability.md)
* [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)
* [Defining and managing state](service-fabric-concepts-state.md)
* [Reliable Services](service-fabric-reliable-services-introduction.md)
