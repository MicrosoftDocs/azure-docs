<properties 
   pageTitle="Application Scenarios and Design with Service Fabric" 
   description="Categories of applications. Application design using stateful and stateless services" 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="msfussell" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="04/24/2015"
   ms.author="mfussell"/>

# Service Fabric Application Scenarios

Service Fabric and Azure offer a reliable and flexible cloud infrastructure platform that enables you to run many types of business applications and services. These applications and microservices can be stateless or stateful, and they are resource balanced across the virtual machines to maximize efficiency. The unique architecture of Service Fabric enables you to perform near real-time data analysis, in-memory computation, parallel transactions, and event processing in your applications. You can easily scale your applications up or down, depending on your changing resource requirements. 

The Service Fabric platform in Azure is ideal for the following categories of applications and services:

- **Highly available services**: Service Fabric services provide extremely fast failover. Multiple secondary service replicas remain available. If a node goes down due to hardware failure, one of the secondary replicas is immediately promoted to a primary replica with negligible loss of service to customers. Services can be quickly and easily scaled up from a few instances to thousands of instances and then scaled down to a few instances, depending on your resource needs. You can use Service Fabric to build and manage the lifecycle of these scalable cloud services.

- **Scalable services**: Individual Services can be partitioned allowing for state to be scaled out across the cluster. In addition, Service Fabric multiple services can be created and scaled out.
 
- **Computation on non-static data**: Service Fabric enables you to build data I/O and compute intensive, stateful applications. The processing and data resources in Service Fabric applications are located together, so when your application requires fast reads and writes the network latency that is associated with an external data cache or storage tier is eliminated. For example, say you had an application that performs near real-time advertisement selection with a round-trip time < 100ms, where the computation of advertising selection rules provides a responsive experience to the user.  
 
- **Session based interactive applications**: Service Fabric is useful if your applications, such as online gaming or instant messaging, require low latency reads and writes. Service Fabric enables you to build these interactive, stateful applications without having to create a separate store or cache required for stateless apps.
 
- **Distributed graph processing**: The growth of social networks has greatly increased the need to analyze large-scale graphs in parallel. Fast scaling and parallel load processing make Service Fabric a natural platform for processing large-scale graphs. Service Fabric enables you to build highly scalable services for groups such as social networking, business intelligence, and scientific research.
 
- **Data analytics and workflows**: The fast read/writes of Service Fabric enables applications that must reliably process events or streams of data. Service Fabric also enables applications that describe a processing pipeline, where results must be reliable and then passed on without loss to the next processing stage, including transactional and financial systems, where data consistency and computation guarantees are essential. 

## Designing applications composed of stateless and stateful microservices ##
Building applications with Azure Cloud Service worker roles are an example of stateless services. By contrast stateful microservices maintain the authoritative state beyond the request and its response, but providing state replication through simple APIs. Stateful services are the democratization of high availability (HA) for all applications, not just databases and other data stores. This is the natural progression in design, as applications have moved from using purely relational databases for HA, to NoSQL databases and now to the applications themselves having state managed within them for the "hot" data that must be kept close to compute.

When building applications consisting of microservices you typically have a combination of stateless web apps (ASP.NET, node.js etc) calling onto stateless and stateful business middle-tier services all deployed into the same Service Fabric cluster using the Service Fabric deployment commands. The independence of scale, reliability, and resource usage for each of these microservices provides this agility in development and lifecycle management.
  
Stateful microservices simplify application designs as they remove the need for additional queues and caches that have traditionally been required to address the availability and latency requirements of a purely stateless application. Since stateful service are naturally highly-available and low-latency this means less moving parts to manage in your application as a whole. The diagrams below illustrate the differences between designing an application that is stateless verses one that is stateful. In the stateful case by taking advantage of the [Reliable Services](service-fabric-reliable-services-introduction.md) and [Reliable Actors](service-fabric-reliable-actors-introduction.md) programming models, stateful services reduce application complexity, whilst achieving high throughput and low latency.

## An application built using stateless services##
![Application using Stateless Service][Image1]

## An application built using stateful services##
![Application using Stateless Service][Image2]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps


Get started building stateless and stateful services with the Service Fabric 
[Reliable Services](service-fabric-reliable-services-quick-start.md) and [Reliable Actors](service-fabric-reliable-actors-get-started.md) programming models.

Also see the following topics:

[Defining and Managing Service State](service-fabric-concepts-state.md)

[Availability of services](service-fabric-concepts-availability-services.md)

[Scalability of Service Fabric services](service-fabric-concepts-scalability.md)

[Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)

[Image1]: media/service-fabric-application-scenarios/AppwithStatelessServices.jpg
[Image2]: media/service-fabric-application-scenarios/AppwithStatefulServices.jpg
 
