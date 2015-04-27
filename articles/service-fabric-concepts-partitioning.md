<properties
   pageTitle="Partitioning Service Fabric Services"
   description="Describes how to partition Service Fabric services"
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

# Partitioning Service Fabric services
Service Fabric makes it easy to build scalable stateful services by supporting partitioning of the service state and having each partition operate on a subset of the total state. Each partition becomes a unit that is made [highly available](service-fabric-availability-services.md). The replicas of partitions are distributed across the nodes in the cluster and are balanced.

> [AZURE.NOTE] While Stateless Services can also be partitioned this scenario is rare and unnecessary for most Service Fabric services.  

There are three different partitioning schemes available.

## Singleton Partitioning Scheme
This is used to specify that the service does not need partitioning.

## Named Partitioning Scheme
This is used to specify a fixed set of names for each partition of the service. Individual partitions can be looked up by their name.

## Ranged Partitioning Scheme
This is used to specify an integer range (identified by a low and a high key) and a number of partitions (n). It creates n partitions, each responsible for a non-overlapping subrange. Example: A ranged partitioning scheme (for a service with three replicas) with a low key of 0, a high key of 99 and a count of 4 would create 4 partitions as shown below.

![Range Partitioning](./media/service-fabric-concepts/range-partitioning.png)

The common case is to create a hash for a unique key within a dataset. Some common examples of keys would be a vehicle identification number (VIN), employee ID, or a unique string. Using that unique key you would then create a long hash code, modulus the key range, to use as your key. You can specify upper and lower bounds of the allowed key range.

Additionally, you should estimate the number of partitions high enough to handle worst-case resource load (such as memory limitations or network bandwidth) but not so much that partitions are extremely sparse.

### Selecting a hash algorithm
An important part of hashing is selecting your hash algorithm. An important consideration is whether the goal is to group similar keys near each other (Locality sensitive hashing), or if activity should be distributed broadly across all partitions (Distribution Hashing).

A good resource for general hash code algorithm choices is [the Wikipedia page on Hash Functions](http://en.wikipedia.org/wiki/Hash_function).

> [AZURE.NOTE] It is not possible to change the number of partitions or the type of partitioning scheme used for a service after it has been created.

## Next steps

For information on Service Fabric concepts, see the following:

- [Availability of Service Fabric Services](service-fabric-availability-services.md)

- [Scalability of Service Fabric Services](service-fabric-concepts-scalability.md)
