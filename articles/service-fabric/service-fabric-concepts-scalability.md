<properties
   pageTitle="Scalability of Service Fabric services | Microsoft Azure"
   description="Describes how to scale Service Fabric services"
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

# Scaling Service Fabric applications
Azure Service Fabric makes it easy to build scalable applications by load-balancing services, partitions, and replicas on all the nodes in a cluster. This enables maximum resource utilization.

High scale for Service Fabric applications can be achieved in two ways:

1. Scaling at the partition level

2. Scaling at the service name level

## Scaling at the partition level
Service Fabric supports partitioning an individual service into multiple smaller partitions. The [partitioning overview](service-fabric-concepts-partitioning.md) provides information on the types of partitioning schemes that are supported. The replicas of each partition are spread across the nodes in a cluster. Consider a service that uses a ranged partitioning scheme with a low key of 0, a high key of 99, and four partitions. In a three-node cluster, the service might be laid out with four replicas that share the resources on each node as shown here:

![Partition layout with three nodes](./media/service-fabric-concepts-scalability/layout-three-nodes.png)

Increasing the number of nodes allows Service Fabric to utilize the resources on the new nodes by moving some of the replicas to empty nodes. By increasing the number of nodes to four, the service now has three replicas running on each node (of different partitions), allowing for better resource utilization and performance.

![Partition layout with four nodes](./media/service-fabric-concepts-scalability/layout-four-nodes.png)

## Scaling at the service name level
A service instance is a specific instance of an application name and a service type name (see [Service Fabric application life cycle](service-fabric-application-lifecycle.md)). During the creation of a service, you specify the partition scheme (see [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)) to be used.

The first level of scaling is by service name. You can create new instances of a service, with different levels of partitioning, as your older service instances become busy. This allows new service consumers to use less-busy service instances, rather than busier ones.

One option for increasing capacity, as well as increasing or decreasing partition counts, is to create a new service instance with a new partition scheme. This adds complexity, though, as any consuming clients need to know when and how to use the differently named service.

### Example scenario: Embedded dates
One possible scenario would be to use date information as part of the service name. For example, you could use a service instance with a specific name for all customers who joined in 2013 and another name for customers who joined in 2014. This naming scheme allows for programmatically increasing the names depending on the date (as 2014 approaches, the service instance for 2014 can be created on demand).

However, this approach is based on the clients using application-specific naming information that is outside the scope of Service Fabric knowledge.

- *Using a naming convention*: In 2013, when your application goes live, you create a service called fabric:/app/service2013. Near the second quarter of 2013, you create another service, called fabric:/app/service2014. Both of these services are of the same service type. In this approach, your client will need to employ logic to construct the appropriate service name based on the year.

- *Using a lookup service*: Another pattern is to provide a secondary lookup service, which can provide the name of the service for a desired key. New service instances can then be created by the lookup service. The lookup service itself doesn't retain any application data, only data about the service names that it creates. Thus, for the year-based example above, the client would first contact the lookup service to find out the name of the service handling data for a given year, and then use that service name for performing the actual operation. The result of the first lookup can be cached.

## Next steps

For more information on Service Fabric concepts, see the following:

- [Availability of Service Fabric services](service-fabric-availability-services.md)

- [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)

- [Defining and managing state](service-fabric-concepts-state.md)
