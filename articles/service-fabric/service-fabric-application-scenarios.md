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
Azure Service Fabric offers a reliable and flexible platform that enables you to write and run many types of business applications and services. These applications and microservices can be stateless or stateful, and they are resource-balanced across virtual machines to maximize efficiency. The unique architecture of Service Fabric enables you to perform near real-time data analysis, in-memory computation, parallel transactions, and event processing in your applications. You can easily scale your applications up or down (really in or out), depending on your changing resource requirements.

For design guidance on building applications, read [microservices architecture on Azure Service Fabric](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric) and [best practices for application design using Service Fabric](service-fabric-best-practices-applications.md)

The Service Fabric platform is ideal for the following types of applications:

* **Data gathering, processing, and IoT**: Since Service Fabric handles large scale and has low latency through its stateful services, it is ideal for data processing on millions of devices where the data for the device and the computation are colocated.

    Customers who have built IoT services using Service Fabric include [Honeywell](https://customers.microsoft.com/story/honeywell-builds-microservices-based-thermostats-on-azure), [PCL Construction](https://customers.microsoft.com/story/pcl-construction-professional-services-azure), [Crestron](https://customers.microsoft.com/story/crestron-partner-professional-services-azure),  [BMW](https://customers.microsoft.com/story/bmw-enables-driver-mobility-via-azure-service-fabric/),
[Schneider Electric](https://customers.microsoft.com/story/schneider-electric-powers-engergy-solutions-on-azure-service-fabric), and
[Mesh Systems](https://customers.microsoft.com/story/mesh-systems-lights-up-the-market-with-iot-based-azure-solutions).

* **Gaming and session-based interactive applications**: Service Fabric is ideal if your application requires low latency reads and writes, such as in online gaming or instant messaging. Service Fabric enables you to build these interactive, stateful applications without having to create a separate store or cache. Visit [Azure gaming solutions](https://azure.microsoft.com/solutions/gaming/) for design guidance on [using Service Fabric in gaming services](https://docs.microsoft.com/gaming/azure/reference-architectures/multiplayer-synchronous-sf)

    Customers who have built gaming services include [Next Games](https://customers.microsoft.com/story/next-games-media-telecommunications-azure) and [Digamore](https://customers.microsoft.com/story/digamore-entertainment-scores-with-a-new-gaming-platform-based-on-azure-service-fabric/). Customers who have built interactive sessions include [Honeywell with Hololens](https://customers.microsoft.com/story/honeywell-manufacturing-hololens)

* **Data analytics and workflow processing**: Applications that must reliably process events or streams of data also benefit from the optimized reads and writes in Service Fabric. Furthermore, Service Fabric supports application processing pipelines, where results must be reliable and passed on to the next processing stage without any loss. These include transactional and financial systems, where data consistency and computation guarantees are essential.

    Customers who have built business workflow services include [Zeiss Group](https://customers.microsoft.com/story/zeiss-group-focuses-on-azure-service-fabric-for-key-integration-platform) and [Digamore](https://customers.microsoft.com/story/digamore-entertainment-scores-with-a-new-gaming-platform-based-on-azure-service-fabric/)

* **Computation on data**: Service Fabric enables you to build data computation intensive stateful applications. Service Fabric allows the co-location of processing (computation) and data in applications. Normally, when your application requires access to data, network latency associated with an external data cache or storage tier limits the computation time. With stateful Service Fabric services, that latency is eliminated, enabling more optimized reads and writes. For example, consider an application that performs near real-time recommendation selections for customers, with a round-trip time requirement of less than 100 milliseconds. The latency and performance characteristics of Service Fabric services (where the computation of recommendation selection is colocated with the data and rules) provides a responsive experience to the user compared with the standard implementation model of having to fetch the necessary data from remote storage.

    Customers who have built computation services include [Solidsoft Reply](https://customers.microsoft.com/story/solidsoft-reply-platform-powers-e-verification-of-pharmaceuticals) and [Infosupport](https://customers.microsoft.com/story/service-fabric-customer-profile-info-support-and-fudura)

* **Highly available services**: Service Fabric provides fast failover by creating multiple secondary service replicas. If a node, process, or individual service goes down due to hardware or other failure, one of the secondary replicas is promoted to a primary replica with minimal loss of service.

* **Scalable services**: Individual services can be partitioned, allowing for state to be scaled out across the cluster. In addition, individual services can be created and removed on the fly. Services can quickly and easily be scaled out from a few instances on a few nodes to thousands of instances on many nodes, and then scaled in again, depending on your resource needs. You can use Service Fabric to build these services and manage their complete life cycles.

## Application design case studies
A number of case studies showing how Service Fabric is used to design applications are published on [customer stories](https://customers.microsoft.com/search?sq=%22Azure%20Service%20Fabric%22&ff=&p=0&so=story_publish_date%20desc/) and the [microservices solutions site](https://azure.microsoft.com/solutions/microservice-applications/).

## Design applications composed of stateless and stateful microservices
Building applications with Azure Cloud Service worker roles is an example of a stateless service. In contrast, stateful microservices maintain their authoritative state beyond the request and its response. This functionality provides high availability and consistency of the state through simple APIs that provide transactional guarantees backed by replication. Service Fabric's stateful services democratize high availability, bringing it to all types of applications, not just databases and other data stores. This is a natural progression. Applications have already moved from using purely relational databases for high availability to NoSQL databases. Now the applications themselves can have their "hot" state and data managed within them for additional performance gains without sacrificing reliability, consistency, or availability.

When building applications consisting of microservices, you typically have a combination of stateless web apps (ASP.NET, Node.js, etc.) calling onto stateless and stateful business middle-tier services, all deployed into the same Service Fabric cluster using the Service Fabric deployment commands. Each of these services is independent with regard to scale, reliability, and resource usage, greatly improving agility and flexibility in development and life-cycle management.

Stateful microservices simplify application designs because they remove the need for the additional queues and caches that have traditionally been required to address the availability and latency requirements of purely stateless applications. Since stateful services naturally have high availability and low latency, there are fewer moving parts to manage in your application as a whole. The diagrams below illustrate the differences between designing an application that is stateless and one that is stateful. By taking advantage of the [Reliable Services](service-fabric-reliable-services-introduction.md) and [Reliable Actors](service-fabric-reliable-actors-introduction.md) programming models, stateful services reduce application complexity while achieving high throughput and low latency.

## An application built using stateless services
![Application using stateless service][Image1]

## An application built using stateful services
![Application using stateless service][Image2]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

* Read about [customer case studies](https://customers.microsoft.com/search?sq=%22Azure%20Service%20Fabric%22&ff=&p=0&so=story_publish_date%20desc)
* Learn more about [patterns and scenarios](service-fabric-patterns-and-scenarios.md)

* Get started building stateless and stateful services with the Service Fabric
  [reliable services](service-fabric-reliable-services-quick-start.md) and [reliable actors](service-fabric-reliable-actors-get-started.md) programming models.
* Visit the Azure architecture center for guidance on [building microservices on Azure](https://docs.microsoft.com/azure/architecture/microservices/)
* Go to [Azure Service Fabric application and cluster best practices](service-fabric-best-practices-overview.md) for application design guidance.

* Also see the following topics:
  * [Tell me about microservices](service-fabric-overview-microservices.md)
  * [Define and manage service state](service-fabric-concepts-state.md)
  * [Availability of Service Fabric services](service-fabric-availability-services.md)
  * [Scale Service Fabric services](service-fabric-concepts-scalability.md)
  * [Partition Service Fabric services](service-fabric-concepts-partitioning.md)

[Image1]: media/service-fabric-application-scenarios/AppwithStatelessServices.jpg
[Image2]: media/service-fabric-application-scenarios/AppwithStatefulServices.jpg
