<properties
   pageTitle="Availability of Service Fabric services | Microsoft Azure"
   description="Describes fault detection, failover, and recovery for services"
   services="service-fabric"
   documentationCenter=".net"
   authors="appi101"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/10/2016"
   ms.author="aprameyr"/>

# Availability of Service Fabric services
Azure Service Fabric services can be either stateful or stateless. This article gives an overview of how Service Fabric maintains availability of a service in the event of failures.

## Availability of Service Fabric stateless services
A stateless service is an application service that does not have any [local persistent state](service-fabric-concepts-state.md).

Creating a stateless service requires defining an instance count, which is the number of instances of the stateless service that should be running in the cluster. This is the number of copies of the application logic that will be instantiated in the cluster. Increasing the number of instances is the recommended way of scaling up a stateless service.

When a fault is detected on any instance of a stateless service, a new instance is created on some other eligible node in the cluster.

## Availability of Service Fabric stateful services
A stateful service has some state associated with it. In Service Fabric, a stateful service is modeled as a set of replicas. Each replica is an instance of the code of the service that has a copy of the state. Read and write operations are performed at one replica (called the primary). Changes to state from write operations are *replicated* to multiple other replicas (called active secondaries). The combination of primary and active secondary replicas is the replica set of the service.

There can be only one primary replica servicing read and write requests, but there can be multiple active secondary replicas. The number of active secondary replicas is configurable, and a higher number of replicas can tolerate a greater number of concurrent software and hardware failures.

In the event of a fault (when the primary replica goes down), Service Fabric makes one of the active secondary replicas the new primary replica. This active secondary replica already has the updated version of the state (via *replication*), and it can continue processing further read and write operations.

This concept--of a replica being either a primary or active secondary--is known as the replica role.

### Replica roles
The role of a replica is used to manage the life cycle of the state being managed by that replica. A replica whose role is primary services read requests. It also services write requests by updating its state and replicating the changes to the active secondaries in its replica set. The role of an active secondary is to receive state changes that the primary replica has replicated and update its view of the state.

>[AZURE.NOTE] Higher-level programming models such as the [reliable actors framework](service-fabric-reliable-actors-introduction.md) abstract away the concept of replica role from the developer.

## Next steps

For more information on Service Fabric concepts, see the following:

- [Scalability of Service Fabric services](service-fabric-concepts-scalability.md)

- [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)

- [Defining and managing state](service-fabric-concepts-state.md)
