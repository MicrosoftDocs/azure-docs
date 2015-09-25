<properties 
   pageTitle="Overview of Service Fabric | Microsoft Azure" 
   description="An overview of Service Fabric where applications are composed of microservices. Service Fabric is a distributed systems platform used to build scalable, reliable, and easily-managed applications for the cloud" 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="msfussell" 
   manager="timlt" 
   editor="masnider"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="08/25/2015"
   ms.author="mfussell"/>

# Overview of Service Fabric
Service Fabric is a distributed systems platform used to build scalable, reliable, and easily-managed applications for the cloud. Service Fabric addresses the significant challenges in developing and managing cloud applications. By using Service Fabric developers and administrators can avoid solving complex infrastructure problems and focus instead on implementing mission critical, demanding workloads knowing that they are scalable, reliable, and manageable. Service Fabric represents the next-generation middleware platform for building and managing these enterprise class, Tier-1 cloud scale services.

## Applications composed of microservices
Service Fabric enables you to build and manage scalable and reliable applications composed of microservices running at very high density on a shared pool of machines (commonly referred to as a Service Fabric cluster).  It provides a sophisticated runtime for building distributed, scalable stateless and stateful microservices and comprehensive application management capabilities for provisioning, deploying, monitoring, upgrading/patching, and deleting deployed applications. 

Service Fabric powers many Microsoft services today such as Azure SQL Databases, Azure DocumentDB, Cortana, Power BI, Microsoft Intune, Azure Event Hubs, many core Azure Services, and Skype for Business to name a few.

Service Fabric is tailored to creating “born in the cloud” services that can start small, as needed, and grow to massive scale with hundreds or thousands of machines, creating Service Fabric clusters across availability sets in a region or across regions.

Today's Internet scale services are built using microservices. Example microservices are protocol gateways, user profiles, shopping carts, inventory processing, queues, caches, etc. Service Fabric is a microservices platform giving every microservice a unique name that can either be stateless or stateful. 

Service Fabric provides comprehensive runtime and lifecycle management capabilities to applications composed of these microservices. It hosts microservices inside containers that are deployed and activated across the Service Fabric cluster. Just like an order of magnitude increase in density is made possible by moving from VMs to containers, a similar order of magnitude in density becomes possible when moving from containers to microservices. For example, a single Azure SQL Database cluster, which is built on Service Fabric, comprises of hundreds of machines running ten of thousands of containers hosting a total of hundreds of thousands of databases (each database is a Service Fabric stateful microservice). The same is true of Event Hubs and the other service mentioned above. This is why the term hyperscale can be used to describe Service Fabric capabilities — if containers give you high density, then microservices give you hyperscale. 

![Service Fabric Platform][Image1]

## Stateless and stateful Service Fabric microservices

Stateless microservices (e.g. protocol gateways, web proxies, etc.) do not maintain any mutable state outside of any request and its response from the service. Azure Cloud Services worker roles are an example of stateless service. Stateful microservices (e.g. user accounts, databases, devices, shopping carts, queues etc.) maintain mutable, authoritative state beyond the request and its response. Today's Internet scale applications consist of a combination of stateless and stateful microservices.
 
Why are stateful microservices important? Why not simply use stateless services for everything? Two reasons:

1) The ability to build high-throughput, low-latency, failure-tolerant OLTP services like interactive store fronts, search, Internet of Things (IoT) systems, trading systems, credit card processing and fraud detection systems, personal record management etc by keeping code and data close on the same machine.

2) Application design simplification as stateful microservices remove the need for additional queues and caches that have traditionally been required to address the availability and latency requirements of a purely stateless application. Since stateful service are naturally highly-available and low-latency this means less moving parts to manage in your application as a whole. 

For more information on application patterns and design using Service Fabric see [Application Scenarios](service-fabric-application-scenarios.md)

## Application lifecycle management
Service Fabric provides first class support for the full application lifecycle management (ALM) of cloud applications: from development to deployment, to daily management, to maintenance, and to eventual decommissioning.

The Service Fabric ALM capabilities enable application administrators/IT operators to use simple, low-touch workflows to provision, deploy, patch, and monitor applications. These built-in workflows greatly reduce the burden on IT Operators to keep applications continuously available. 

Most applications consist of a combination of stateless and stateful microservices and other EXE/runtimes that are deployed together. By having strong types on the applications and the packaged microservices, Service Fabric enables the deployment of multiple application instances each of which can be managed and upgraded independently. Importantly Service Fabric is able to deploy *any* executables or runtimes and make these reliable. For example it can be used to deploy ASP.NET 5, node.js, scripts, or anything that makes up your application. 
  
For more information on application lifecycle management see [Application Lifecycle](service-fabric-application-lifecycle.md)

## Key capabilities
By using Service Fabric, you can:

- Develop massively scalable applications, that are self-healing.

- Develop with a "data center on your machine" approach. The local development environment is the same code that runs in the Azure data centers.
 
- Develop applications composed of microservices, executables and other application frameworks of your choice such as ASP.NET, nodejs, etc.

- Develop stateless and stateful (micro)services and make these highly reliable.

- Simplify the design of your application, by using stateful (micro)services in place of caches and queues.
 
- Deploy applications in seconds.

- Deploy to Azure or to on-premise clouds running Windows Server with zero code changes. Write once and then deploy to any Service Fabric cluster.

- Deploy applications at higher density than virtual machines, deploying hundreds or thousand of applications per machine. 

- Deploy different versions of the same application side-by-side, each independently upgradable.
 
- Manage the lifecycle of your stateful applications without any downtime, including breaking and non-breaking upgrades.

- Manage applications using .NET APIs, Powershell or REST interfaces.
 
- Upgrade and patch microservices within applications independently.

- Monitor and diagnose the health of your applications and set policies to perform automatic repairs.

- Scale-up or scale-down your Service Fabric cluster easily, knowing that the applications scales according to the available resources.

- Watch the self healing resource balancer orchestrate the redistribution of applications across the Service Fabric cluster to recover from failures and to optimize the distribution of load based on available resources.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

* For more information: [Technical Overview](service-fabric-technical-overview.md).
* Setup your Service Fabric [development environment](service-fabric-get-started.md).  
* Choosing a [framework](service-fabric-choose-framework.md) for your service.


[Image1]: media/service-fabric-overview/Service-Fabric-Overview.png

 