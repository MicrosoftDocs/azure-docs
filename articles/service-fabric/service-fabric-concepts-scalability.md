---
title: Scalability of Service Fabric services | Microsoft Docs
description: Describes how to scale Service Fabric services
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: ed324f23-242f-47b7-af1a-e55c839e7d5d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/30/2016
ms.author: masnider

---
# Scaling Service Fabric applications
Azure Service Fabric makes it easy to build scalable applications by managing the services, partitions, and replicas on all the nodes in a cluster. This enables maximum resource utilization.

High scale for Service Fabric applications can be achieved in two ways:

1. Scaling at the service partition level
2. Scaling at the named service instance level

## Scaling at the partition level
Service Fabric supports partitioning. Partitioning allows an individual service to be split into multiple independent partitions, each with some portion of the service's overall state. The [partitioning overview](service-fabric-concepts-partitioning.md) provides information on the types of partitioning schemes that are supported. The replicas of each partition are spread across the nodes in a cluster. Consider a service that uses a ranged partitioning scheme with a low key of 0, a high key of 99, and a partition count of 4. In a three-node cluster, the service might be laid out with four replicas that share the resources on each node as shown here:

<center>
![Partition layout with three nodes](./media/service-fabric-concepts-scalability/layout-three-nodes.png)
</center>

If you increase the number of nodes, Service Fabric will utilize the resources on the new nodes by moving some of the existing replicas there. By increasing the number of nodes to four, the service now has three replicas running on each node (each belonging to different partitions), allowing for better resource utilization and performance.

<center>
![Partition layout with four nodes](./media/service-fabric-concepts-scalability/layout-four-nodes.png)
</center>

## Scaling at the service name level
A service instance is a specific instance of an application name and a service type name (see [Service Fabric application life cycle](service-fabric-application-lifecycle.md)). During the creation of a service, you specify the partition scheme (see [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)) to be used.

The first level of scaling is by service name. You can create instances of a service, optionally with different levels of partitioning, as your older service instances become busy. This allows new service consumers to use less-busy service instances, rather than busier ones.

One option for increasing capacity is to create a new service instance with a new partition scheme. This adds complexity, though. Any consuming clients need to know when and how to use the differently named service. As another alternative a management or intermediary service would need to make a determination about which service and partition should handle each request.

### Example scenario: Embedded dates
One possible scenario would be to use date information as part of the service name. For example, you could use a service instance with a specific name for all customers who joined in 2013 and another name for customers who joined in 2014. This naming scheme allows for programmatically increasing the names depending on the date (as 2014 approaches, the service instance for 2014 can be created on demand).

However, this approach is based on the clients using application-specific naming information that is outside the scope of Service Fabric knowledge.

* *Using a naming convention*: In 2013, when your application goes live, you create a service called fabric:/app/service2013. Near the second quarter of 2013, you create another service, called fabric:/app/service2014. Both of these services are of the same service type. In this approach, your client will need to employ logic to construct the appropriate service name based on the year.
* *Using a lookup service*: Another pattern is to provide a secondary lookup service, which can provide the name of the service for a desired key. New service instances can then be created by the lookup service. The lookup service itself doesn't retain any application data, only data about the service names that it creates. Thus, for the year-based example above, the client would first contact the lookup service to find out the name of the service handling data for a given year. Then, the client would use that service name for performing the actual operation. The result of the first lookup can be cached.

## Putting it all together
Let's take all the ideas that we've discussed here and talk through another scenario.

Consider the following example: you are trying to build a service that acts as an address book, holding on to names and contact information. How many users are you going to have? How many contacts will each user store? Trying to figure this all out when you are standing up your service for the first time is really hard. The consequences of picking the wrong partition count could cause you to have scale issues later. But why try to pick single partition scheme out for all users at all?

In these types of situations, consider the following pattern instead:
1. Instead of trying to pick a partitioning scheme for everyone up front, build a "manager service".
2. The job of the manager service is to look at customer information when they sign up for your service. Then depending on that information to create an instance of your _actual_ contact-storage service _just for that customer_. This type of dynamic service creation pattern many benefits:

    * You're not trying to guess the correct partition count for all users up front
    * Data segmentation, since each customer has their own copy of the service
    * Each customer service can be configured differently, with more or fewer partitions or replicas as necessary based on their expected scale.
      * For example, say the customer paid for the "Gold" tier - they could get more replicas or greater partition count
      * Or say they provided information indicating the number of contacts they needed was "Small" - they would get only a few partitions.
    * You're not running a bunch of service instances or replicas while you're waiting for customers to show up
    * If a customer ever leaves, then removing their information from your service is as simple as having the manager delete that service that it created

## Next steps
For more information on Service Fabric concepts, see the following articles:

* [Availability of Service Fabric services](service-fabric-availability-services.md)
* [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)
* [Defining and managing state](service-fabric-concepts-state.md)
