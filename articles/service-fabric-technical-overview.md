<properties 
   pageTitle="Technical Overview" 
   description="A technical overview of Service Fabric" 
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
   ms.date="02/18/2015"
   ms.author="mfussell"/>

# Introduction to Service Fabric
Service Fabric enables you to easily build and manage scalable and reliable applications composed of microservices running at very high density on a shared pool of machines (commonly referred to as a Service Fabric cluster).  It provides a sophisticated runtime for building distributed scalable stateless and stateful microservices and comprehensive application management capabilities for provisioning, deploying, monitoring, upgrading/patching, and deleting deployed applications. 

Service Fabric powers many Microsoft services today such as Azure SQL Databases, Azure DocumentDB, Cortana, Power BI, Intune, Azure Event Hubs, many core Azure Services, Lync Communication Server to name a few.

Service Fabric is tailored to creating “born in the cloud” services that can start small, as needed, and grow to massive scale with hundreds or thousands of machines, creating Service Fabric clusters across availability sets in a region or across regions.

Todays Internet scale service are built using a set of microservices. Example microservices are protocol gateways, user profiles, shopping carts, inventory processing, queues, caches, etc. Service Fabric is a microservices platform giving every microservice a unique name and it can either be stateless or stateful. Stateless microservices (e.g. protocol gateways, web proxies, etc.) do not maintain any mutable state outside of any request and its response, whereas stateful microservices (e.g. user accounts, databases, device actors, shopping carts, queues etc.) maintain mutable, authoritative state beyond the request and its response.

Service Fabric provides comprehensive runtime and lifecycle management capabilities to application composed of microservices. It hosts microservices inside containers that are deployed and activated across the Service Fabric cluster. Just like an order of magnitude increase in density is made possible by moving from VMs to containers, a similar order of magnitude in density becomes possible when moving from containers to microservices. For example, a single Azure SQL Database cluster, which is built on Service Fabric, comprises of 100s of machines running 10000s of containers hosting a total of 100000s of databases (each database is Service Fbaric stateful microservice). The same is true of Event Hubs and the other service mentioned above. This is why the term hyperscale can be used to describe Service Fabric capabilities — if containers give you high density, then microservices give you hyperscale. 

## Stateless and Stateful Service Fabric Microservices ##

Though it may be straightforward to build a stateless microservices in platform, it is considerable more difficult to support stateful microservices because it requires solving many hard distributed systems problems such as failure detection, leader election, replicated state machines, local and distributed transactions at scale with perfect accuracy.

If providing runtime support for stateful microservices is harder, providing full lifecycle management capabilities to those stateful microservices in doubly harder. Lifecycle management needs to suddenly deal with persistent containers because they cannot be randomly moved around without leading to data loss and instead have to be brought up in-place, replica quorums have to be maintained 100% of the time while accounting for machine failures, strong version coherency has to be maintained to enable protocol and schema changes, etc. 

Why are stateful microservices important? why not simply use stateless services for everything? If you want to build high-throughput, low-latency, tail-tolerant OLTP services like interactive store fronts, search, IoT systems, trading systems, credit card processing and fraud detection systems, personal record lookups etc., it is very hard to imagine how you can build them if cloud platform does not democratize building stateful microservices. Service Fabric represents the next-generation middleware platform for building and managing these cloud scale services.  

# Technical Overview 

Service Fabric is a distributed systems platform that makes it easy to build scalable, reliable, low-latency, and easily managed services and applications for the cloud. Service Fabric enables applications and services across all tiers to run reliably at cloud scale with the ability to be patched and managed without downtime.

## Capabilities
By using Service Fabric, you can:

- Develop stateful, scalable, and highly available applications.

- Deploy applications at higher density than on virtual machines.

- Deploy different versions of the same application side-by-side.

- Manage the lifecycle of your stateful applications without downtime, including breaking and non-breaking upgrades.

- Upgrade and patch services within applications independently.

- Monitor and diagnose the health of my applications and set policies to perform automatic repairs.

- Scale-up or scale-down your cluster easily, knowing that the applications will scale according to the available resources.

- Develop a client that can communicate with the applications that are using existing client and server technologies.

## Key Concepts
Cluster- Sentence or two. Links to Further Reading topic(s).

Nodes- Sentence or two. Links to Further Reading topic(s).

Application- Sentence or two. Links to Further Reading topic(s).

Service- Sentence or two. Links to Further Reading topic(s).

Programming models- actor, FabSrv, etc. Links to Further Reading topic(s).

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Application Scenarios](../service-fabric-application-scenarios). 

