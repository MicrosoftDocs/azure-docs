<properties
   pageTitle="Defining and Managing State"
   description="How to define and manage service state in Service Fabric"
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
   ms.date="08/26/2015"
   ms.author="aprameyr"/>

# Service State
**Service State** is the data the service requires in order to function. It is the data structures and variables that the service reads and writes in order to do work.

For example: Consider a simple calculator service. This service takes two numbers and returns their sum. This is a purely stateless service that has no data associated with it.

Now, consider the same calculator but in addition to computing sum it also has a method to return the last sum it had computed. This service is now stateful - it contains some state that it writes to (when it computes a new sum) and reads from (when it returns the last computed sum).

In Service Fabric, the first service is called a Stateless Service. The second service is called a Stateful Service.

## Storing Service State
State can either be externalized or co-located with the code that is manipulating the state. Externalization of state is typically done by using an external database or store. In our calculator example, this could be a SQL database where the current result is stored in a table. Every request to compute the sum performs an update on this row.

State can also be co-located with the code that manipulates this code. Stateful services in Service Fabric are built using this model. Service Fabric provides the infrastructure to ensure this state is highly available and fault tolerant in the event of failures.

## Next steps

For information on Service Fabric concepts, see the following:

- [Availability of Service Fabric Services](service-fabric-availability-services.md)

- [Scalability of Service Fabric Services](service-fabric-concepts-scalability.md)

- [Partitioning Service Fabric Services](service-fabric-concepts-partitioning.md)
 
