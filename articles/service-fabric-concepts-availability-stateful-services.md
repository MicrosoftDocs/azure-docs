<properties
   pageTitle="Availability of Service Fabric Stateful Services"
   description="Describes fault detection, failover, recovery for stateful services"
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
   ms.author="appi101"/>

#Availability of Service Fabric Stateful Services
A Stateful Service has some state that is associated with it. In Service Fabric, a stateful service is modelled as a set of replicas. Each replica is an instance of the code of the service that has a view of the state. Read and Write operations are performed at one replica (called the Primary). Changes to state due to write operations are *replicated* to multiple other replicas (called the Active Secondaries). This combination of Primary and Secondary replicas is the replica set of the service.

There can be only one Primary that is servicing read and write requests. There can be multiple secondary replicas. The number of Active Secondary replicas is configurable and a higher number of replicas allows for tolerating a greater number of concurrent software and hardware failures.

In the event of a fault (when the Primary replica goes down), Service Fabric makes one of the Active Secondary replicas the new Primary replica. This Secondary replica already has the updated version of the state (via *replication*) and can continue processing further read and write operations.

This concept of a replica being a Primary or a Secondary is known as the replica role.

##Replica Roles
The Role of a replica is used to manage the lifecycle of the state being managed by that replica. A replica whose role is primary is servicing read requests. It is also servicing write requests by updating its state and replicating the changes to the Active Secondaries in its replica set. An Active Secondary is responsible for receiving state changes that the Primary replica has replicated and updating its view of the state.

>[AZURE.NOTE] Higher level programming models such as the actor framework abstract away the concept of replica role from the developer.
