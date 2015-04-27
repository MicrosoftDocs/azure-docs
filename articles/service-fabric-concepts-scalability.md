<properties
   pageTitle="Scalability of Service Fabric Services"
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
   ms.date="04/23/2015"
   ms.author="aprameyr"/>

# Scaling Service Fabric Applications
Service Fabric makes it easy to build scalable applications by load balancing services, partitions and replicas on all the nodes in a cluster. This enables maximum resource utilization.

High Scale for Service Fabric Applications can be achieved in two ways:

1. Scaling at the partition level

2. Scaling at the service name level

## Scaling at the partition level
Service Fabric supports partitioning an individual service into multiple smaller partitions. The [Partitioning overview](service-fabric-concepts-partitioning.md) provides information on the types of partitioning schemes that are supported. The replicas of each partition are spread across the nodes in the cluster. Consider a service using the ranged partitioning scheme with a low key of 0, high key of 99 and 4 partitions. In a 3 node cluster, the service might be laid out with four replicas sharing the resources on each node as shown below.

![Partition Layout With Three Nodes](./media/service-fabric-concepts/layout-three-nodes.png)

Increasing the number of nodes will allow Service Fabric to utilize the resources on the new nodes by moving some of the replicas to empty nodes.  Thus, increasing the number of nodes to four will now have three replicas running on each node (of different partitions) allowing for better resource utilization and performance.

![Partition Layout With Four Nodes](./media/service-fabric-concepts/layout-four-nodes.png)

## Scaling at the service name level
A service instance is a specific named instance of an application name and a service type name (see [Service Fabric Application Lifecycle](service-fabric-application-lifecycle.md)). It is during service creation that you specify the partition scheme ([Partitioning Service Fabric Services](service-fabric-concepts-partitioning.md)) to be used.

The first level of scaling is by service names. You can create new instances of a service, with a different level of partitioning, as your older service instances become busy. This allows new service consumers to use less busy service instances in favor of busier ones.

An option to increase capacity, or to increase or decrease partition counts, is to create a new service instance with a new partition scheme. The complexity is that any consuming clients need to know when and how to use a differently named service.

### Example Scenario – Embedded Dates
One possible scenario would be to use date information as part of the service name. For example, you could use service instance with a specific name for all customers that joined in 2013 and a another name for customers that joined in 2014. This naming scheme allows for programmatic increase in names depending on the date (as 2014 approaches, the service instance for 2014 can be created on demand).

However, this approach is based on the clients using application specific naming information that is outside of the scope of Service Fabric knowledge.

- *Using a Naming Convention*: In 2013 when your application goes live you create one service called fabric:/app/service2013. Towards the second quarter of 2013 you create another service called fabric:/app/service2014. Both these services are of the same service type. In this approach, your client will have to have logic on constructing the appropriate service name based on the year.

- *Using a Lookup Service*: Another pattern is to provide a secondary “lookup service” which can provide the name of the service for a desired key. New service instances can then be created by the lookup service. The lookup service itself does not retain any application data, but only data about the service names that it creates. Thus in same year based example above the client would first contact the lookup service to find out the name of the service handling data for a given year and then use that service name for performing the actual operation. The result of the first lookup can be cached.

## Next steps

For information on Service Fabric concepts, see the following:

- [Availability of Service Fabric Services](service-fabric-availability-services.md)

- [Partitioning Service Fabric Services](service-fabric-concepts-partitioning.md)

- [Defining and Managing State](service-fabric-concepts-state.md)
