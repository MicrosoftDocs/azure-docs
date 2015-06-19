<properties
   pageTitle="Availability of Service Fabric Services"
   description="Describes fault detection, failover, recovery for services"
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
   ms.date="04/13/2015"
   ms.author="aprameyr"/>

# Availability of Service Fabric services
Service Fabric services can be either stateful or stateless. This article gives an overview of how Service Fabric maintains availability of a service in the event of failures.

## Availability of Service Fabric stateless services
A stateless service is an application service that does not have any [local persistent state](service-fabric-concepts-state.md).

Creating a stateless service requires defining an instance count which is the number of instances of the stateless service that should be running in the cluster. These are the number of copies of the application logic that will be instantiated in the cluster. Increasing the number of instances is the recommended way of scaling out stateless services.

When a fault is detected on any instance of the stateless service a new instance is created on some other eligible node in the cluster.

## Availability of Service Fabric stateful services
A Stateful Service has some state that is associated with it. In Service Fabric, a stateful service is modeled as a set of replicas. Each replica is an instance of the code of the service that has a copy of the state. Read and Write operations are performed at one replica (called the Primary). Changes to state due to write operations are *replicated* to multiple other replicas (called the Active Secondaries). This combination of Primary and Active Secondary replicas is the replica set of the service.

There can be only one Primary that is servicing read and write requests. There can be multiple Active Secondary replicas. The number of Active Secondary replicas is configurable and a higher number of replicas allows for tolerating a greater number of concurrent software and hardware failures.

In the event of a fault (when the Primary replica goes down), Service Fabric makes one of the Active Secondary replicas the new Primary replica. This Active Secondary replica already has the updated version of the state (via *replication*) and can continue processing further read and write operations.

This concept of a replica being a Primary or a Active Secondary is known as the replica role.

### Replica Roles
The Role of a replica is used to manage the lifecycle of the state being managed by that replica. A replica whose role is primary is servicing read requests. It is also servicing write requests by updating its state and replicating the changes to the Active Secondaries in its replica set. An Active Secondary is responsible for receiving state changes that the Primary replica has replicated and updating its view of the state.

>[AZURE.NOTE] Higher level programming models such as the [Reliable Actors framework](service-fabric-reliable-actors-introduction.md) abstract away the concept of replica role from the developer.

## Next steps

For information on Service Fabric concepts, see the following:

- [Scalability of Service Fabric Services](service-fabric-concepts-scalability.md)

- [Partitioning Service Fabric Services](service-fabric-concepts-partitioning.md)

- [Defining and Managing State](service-fabric-concepts-state.md)
