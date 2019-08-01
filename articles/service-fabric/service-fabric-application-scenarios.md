---
title: Application scenarios and design | Microsoft Docs
description: Overview of categories of cloud applications in Service Fabric. Discusses application design that uses stateful and stateless services.
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: ''

ms.assetid: 3a8ca6ea-b8e9-4bc3-9e20-262437d2528e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 4/24/2019
ms.author: atsenthi

---
# Service Fabric application scenarios
Azure Service Fabric offers a reliable and flexible platform where you can write and run many types of business applications and services. These applications and microservices can be stateless or stateful, and they're resource-balanced across virtual machines to maximize efficiency. 

The unique architecture of Service Fabric enables you to perform near real-time data analysis, in-memory computation, parallel transactions, and event processing in your applications. You can easily scale your applications up or down (really in or out), depending on your changing resource requirements.

For design guidance on building applications, read [Microservices architecture on Azure Service Fabric](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric) and [Best practices for application design using Service Fabric](service-fabric-best-practices-applications.md).

Consider using the Service Fabric platform for the following types of applications:

* **Data gathering, processing, and IoT**: Service Fabric handles large scale and has low latency through its stateful services. It can help process data on millions of devices where the data for the device and the computation are colocated.

    Customers who have built IoT services by using Service Fabric include [Honeywell](https://customers.microsoft.com/story/honeywell-builds-microservices-based-thermostats-on-azure), [PCL Construction](https://customers.microsoft.com/story/pcl-construction-professional-services-azure), [Crestron](https://customers.microsoft.com/story/crestron-partner-professional-services-azure),  [BMW](https://customers.microsoft.com/story/bmw-enables-driver-mobility-via-azure-service-fabric/),
[Schneider Electric](https://customers.microsoft.com/story/schneider-electric-powers-engergy-solutions-on-azure-service-fabric), and
[Mesh Systems](https://customers.microsoft.com/story/mesh-systems-lights-up-the-market-with-iot-based-azure-solutions).

* **Gaming and session-based interactive applications**: Service Fabric is useful if your application requires low-latency reads and writes, such as in online gaming or instant messaging. Service Fabric enables you to build these interactive, stateful applications without having to create a separate store or cache. Visit [Azure gaming solutions](https://azure.microsoft.com/solutions/gaming/) for design guidance on [using Service Fabric in gaming services](https://docs.microsoft.com/gaming/azure/reference-architectures/multiplayer-synchronous-sf).

    Customers who have built gaming services include [Next Games](https://customers.microsoft.com/story/next-games-media-telecommunications-azure) and [Digamore](https://customers.microsoft.com/story/digamore-entertainment-scores-with-a-new-gaming-platform-based-on-azure-service-fabric/). Customers who have built interactive sessions include [Honeywell with Hololens](https://customers.microsoft.com/story/honeywell-manufacturing-hololens).

* **Data analytics and workflow processing**: Applications that must reliably process events or streams of data benefit from the optimized reads and writes in Service Fabric. Service Fabric also supports application processing pipelines, where results must be reliable and passed on to the next processing stage without any loss. These pipelines include transactional and financial systems, where data consistency and computation guarantees are essential.

    Customers who have built business workflow services include [Zeiss Group](https://customers.microsoft.com/story/zeiss-group-focuses-on-azure-service-fabric-for-key-integration-platform), [Quorum Business Solutions](https://customers.microsoft.com/en-us/story/quorum-business-solutions-expand-energy-managemant-solutions-using-azure-service-fabric), and [Société General](https://customers.microsoft.com/en-us/story/societe-generale-speeds-real-time-market-quotes-using-azure-service-fabric).

* **Computation on data**: Service Fabric enables you to build stateful applications that do intensive data computation. Service Fabric allows the colocation of processing (computation) and data in applications. 

   Normally, when your application requires access to data, network latency associated with an external data cache or storage tier limits the computation time. Stateful Service Fabric services eliminate that latency, enabling more optimized reads and writes. 
   
   For example, consider an application that performs near real-time recommendation selections for customers, with a round-trip time requirement of less than 100 milliseconds. The latency and performance characteristics of Service Fabric services provide a responsive experience to the user, compared with the standard implementation model of having to fetch the necessary data from remote storage. The system is more responsive because the computation of recommendation selection is colocated with the data and rules.

    Customers who have built computation services include [Solidsoft Reply](https://customers.microsoft.com/story/solidsoft-reply-platform-powers-e-verification-of-pharmaceuticals) and [Infosupport](https://customers.microsoft.com/story/service-fabric-customer-profile-info-support-and-fudura).

* **Highly available services**: Service Fabric provides fast failover by creating multiple secondary service replicas. If a node, process, or individual service goes down due to hardware or other failure, one of the secondary replicas is promoted to a primary replica with minimal loss of service.

* **Scalable services**: Individual services can be partitioned, allowing for state to be scaled out across the cluster. Individual services can also be created and removed on the fly. You can scale out services from a few instances on a few nodes to thousands of instances on many nodes, and then scale them in again as needed. You can use Service Fabric to build these services and manage their complete life cycles.

## Application design case studies
Case studies that show how Service Fabric is used to design applications are published on the [Customer stories](https://customers.microsoft.com/search?sq=%22Azure%20Service%20Fabric%22&ff=&p=0&so=story_publish_date%20desc/) and [Microservices in Azure](https://azure.microsoft.com/solutions/microservice-applications/) sites.

## Designing applications composed of stateless and stateful microservices
Building applications with Azure Cloud Services worker roles is an example of a stateless service. In contrast, stateful microservices maintain their authoritative state beyond the request and its response. This functionality provides high availability and consistency of the state through simple APIs that provide transactional guarantees backed by replication. 

Stateful services in Service Fabric bring high availability to all types of applications, not just databases and other data stores. This is a natural progression. Applications have already moved from using purely relational databases for high availability to NoSQL databases. Now the applications themselves can have their "hot" state and data managed within them for additional performance gains without sacrificing reliability, consistency, or availability.

When you're building applications that consist of microservices, you typically have a combination of stateless web apps (like ASP.NET and Node.js) calling onto stateless and stateful business middle-tier services. The apps and services are all deployed in the same Service Fabric cluster through the Service Fabric deployment commands. Each of these services is independent with regard to scale, reliability, and resource usage. This independence improves agility and flexibility in development and life-cycle management.

Stateful microservices simplify application designs because they remove the need for the additional queues and caches that have traditionally been required to address the availability and latency requirements of purely stateless applications. Because stateful services have high availability and low latency, there are fewer details to manage in your application. 

The following diagrams illustrate the differences between designing an application that's stateless and one that's stateful. By taking advantage of the [Reliable Services](service-fabric-reliable-services-introduction.md) and [Reliable Actors](service-fabric-reliable-actors-introduction.md) programming models, stateful services reduce application complexity while achieving high throughput and low latency.

Here's an example application that uses stateless services:
![Application that uses stateless services][Image1]

Here's an example application that uses stateful services:
![Application that uses stateless services][Image2]

## Next steps

* Learn more about [patterns and scenarios](service-fabric-patterns-and-scenarios.md).

* Get started building stateless and stateful services with the Service Fabric
  [Reliable Services](service-fabric-reliable-services-quick-start.md) and [Reliable Actors](service-fabric-reliable-actors-get-started.md) programming models.
* Visit the Azure Architecture Center for guidance on [building microservices on Azure](https://docs.microsoft.com/azure/architecture/microservices/).
* Go to [Azure Service Fabric application and cluster best practices](service-fabric-best-practices-overview.md) for application design guidance.

* Also see the following topics:
  * [Tell me about microservices](service-fabric-overview-microservices.md)
  * [Define and manage service state](service-fabric-concepts-state.md)
  * [Availability of Service Fabric services](service-fabric-availability-services.md)
  * [Scale Service Fabric services](service-fabric-concepts-scalability.md)
  * [Partition Service Fabric services](service-fabric-concepts-partitioning.md)

[Image1]: media/service-fabric-application-scenarios/AppwithStatelessServices.jpg
[Image2]: media/service-fabric-application-scenarios/AppwithStatefulServices.jpg
