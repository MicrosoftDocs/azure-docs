---
title: Overview of Service Fabric on Azure | Microsoft Docs
description: An overview of Service Fabric, where applications are composed of many microservices to provide scale and resilience. Service Fabric is a distributed systems platform used to build scalable, reliable, and easily managed applications for the cloud.
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: masnider

ms.assetid: bbcc652a-a790-4bc4-926b-e8cd966587c0
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: mfussell

---
# Overview of Azure Service Fabric
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric also addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable. Service Fabric represents the next-generation middleware platform for building and managing these enterprise-class, tier-1, cloud-scale applications.

This short Channel9 video introduces Service Fabric and microservices:
<center><a target="_blank" href="https://aka.ms/servicefabricvideo">  
<img src="./media/service-fabric-overview/OverviewVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

This longer Microsoft Virtual Academy video describes the Service Fabric core concepts:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=tbuZM46yC_5206218965">  
<img src="./media/service-fabric-overview/CoreConceptsVid.png" WIDTH="360" HEIGHT="244">  
</a></center>


## Applications composed of microservices
Service Fabric enables you to build and manage scalable and reliable applications composed of microservices that run at very high density on a shared pool of machines, which is referred to as a cluster. It provides a sophisticated runtime to build distributed, scalable, stateless and stateful microservices. It also provides comprehensive application management capabilities to provision, deploy, monitor, upgrade/patch, and delete deployed applications.

Why is a microservices approach important? The two main reasons are:

* You can scale different parts of your application depending on the needs of the application.
* Development teams can be more agile as they roll out changes and thus provide features to customers faster and more frequently.

Service Fabric powers many Microsoft services today, including Azure SQL Database, Azure Cosmos DB, Cortana, Microsoft Power BI, Microsoft Intune, Azure Event Hubs, Azure IoT Hub, Skype for Business, and many core Azure services.

Service Fabric is tailored to create cloud native services that can start small, as needed, and grow to massive scale with hundreds or thousands of machines.

Today's Internet-scale services are built of microservices. Examples of microservices include protocol gateways, user profiles, shopping carts, inventory processing, queues, and caches. Service Fabric is a microservices platform that gives every microservice a unique name that can be either stateless or stateful.

Service Fabric provides comprehensive runtime and lifecycle management capabilities to applications that are composed of these microservices. It hosts microservices inside containers that are deployed and activated across the Service Fabric cluster. A move from virtual machines to containers makes possible an order-of-magnitude increase in density. Similarly, another order of magnitude in density becomes possible when you move from containers to microservices. For example, a single cluster for Azure SQL Database comprises hundreds of machines running tens of thousands of containers that host a total of hundreds of thousands of databases. Each database is a Service Fabric stateful microservice. The same is true of the other previously mentioned services, which is why the term *hyperscale* is used to describe Service Fabric capabilities. If containers give you high density, then microservices give you hyperscale.

For more on the microservices approach, read [Why a microservices approach to building applications?](service-fabric-overview-microservices.md).

## Container deployment and orchestration
Service Fabric is an [orchestrator](service-fabric-cluster-resource-manager-introduction.md) of microservices across a cluster of machines. Microservices can be developed in many ways from using the [Service Fabric programming models ](service-fabric-choose-framework.md) to deploying [guest executables](service-fabric-deploy-existing-app.md). Service Fabric can deploy services in container images. Importantly, you can mix both services in processes and services in containers in the same application. If you just want to [deploy and manage container images](service-fabric-containers-overview.md) across a cluster of machines, Service Fabric is a perfect choice.

## Create clusters for Service Fabric anywhere
You can create clusters for Service Fabric in many environments, including Azure or on premises, on Windows Server, or on Linux. In addition, the development environment in the SDK is identical to the production environment, and no emulators are involved. In other words, what runs on your local development cluster deploys to the same cluster in other environments.

For more information on creating clusters on-premises, read [creating a cluster on Windows Server or Linux](service-fabric-deploy-anywhere.md) or for Azure creating a cluster [via the Azure portal](service-fabric-cluster-creation-via-portal.md).

![Service Fabric platform][Image1]

## Stateless and stateful microservices for Service Fabric
Service Fabric enables you to build applications that consist of microservices. Stateless microservices (such as protocol gateways and web proxies) do not maintain a mutable state outside a request and its response from the service. Azure Cloud Services worker roles are an example of a stateless service. Stateful microservices (such as user accounts, databases, devices, shopping carts, and queues) maintain a mutable, authoritative state beyond the request and its response. Today's Internet-scale applications consist of a combination of stateless and stateful microservices.

Why have stateful microservices along with stateless ones? The two main reasons are:

* You can build high-throughput, low-latency, failure-tolerant online transaction processing (OLTP) services by keeping code and data close on the same machine. Some examples are interactive storefronts, search, Internet of Things (IoT) systems, trading systems, credit card processing and fraud detection systems, and personal record management.
* You can simplify application design. Stateful microservices remove the need for additional queues and caches, which are traditionally required to address the availability and latency requirements of a purely stateless application. Stateful services are naturally high-availability and low-latency, which reduces the number of moving parts to manage in your application as a whole.

For more information about application patterns with Service Fabric, read [Application scenarios](service-fabric-application-scenarios.md) and [Choosing a programming model framework](service-fabric-choose-framework.md) for your service.

You can also watch this Microsoft Virtual Academy video for an overview of stateless and stateful services:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=HhD9566yC_4106218965">  
<img src="./media/service-fabric-overview/ReliableServicesVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

## Application lifecycle management
Service Fabric provides support for the full application lifecycle management of cloud applications. This lifecycle includes development through deployment, daily management, and maintenance to eventual decommissioning.

Service Fabric application lifecycle management capabilities enable application administrators and IT operators to use simple, low-touch workflows to provision, deploy, patch, and monitor applications. These built-in workflows greatly reduce the burden on IT operators to keep applications continuously available.

Most applications consist of a combination of stateless and stateful microservices and other executables/runtimes that are deployed together. By having strong types on the applications and packaged microservices, Service Fabric enables the deployment of multiple application instances. Each instance is managed and upgraded independently. Importantly, Service Fabric can deploy *any* executables or runtime and make them reliable. For example, Service Fabric deploys .NET, ASP.NET Core, Node.js, Java virtual machines, scripts, Angular or anything else that makes up your application.

For more information about application lifecycle management, read [Application lifecycle](service-fabric-application-lifecycle.md). For more about how to deploy any code, see [Deploy a guest executable](service-fabric-deploy-existing-app.md).

You can also watch this Microsoft Virtual Academy video for an overview of app lifecycle management:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=My3Ka56yC_6106218965">  
<img src="./media/service-fabric-overview/AppLifecycleVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

## Key capabilities
By using Service Fabric, you can:

* Develop massively scalable applications that are self-healing.
* Develop applications that are composed of microservices by using the Service Fabric programming model. Or, you can simply host guest executables and other application frameworks of your choice, such as ASP.NET Core or Node.js.
* Develop highly reliable stateless and stateful microservices.
* Deploy and orchestrate containers that include Windows containers and Docker containers across a cluster. These containers can contain guest executables or reliable stateless and stateful microservices. In either case, you get mapping from container port to host port, container discoverability, and automated failover.
* Simplify the design of your application by using stateful microservices in place of caches and queues.
* Deploy to Azure or to on-premises datacenters that run Windows or Linux with zero code changes. Write once, and then deploy anywhere to any Service Fabric cluster.
* Develop with a "datacenter on your machine" approach. The local development environment is the same code that runs in the Azure datacenters.
* Deploy applications in seconds.
* Deploy applications at higher density than virtual machines, deploying hundreds or thousands of applications per machine.
* Deploy different versions of the same application side by side, and upgrade each application independently.
* Manage the lifecycle of your stateful applications without any downtime, including breaking and nonbreaking upgrades.
* Manage applications by using .NET APIs, Java (Linux), PowerShell, Azure command-line interface (Linux), or REST interface.
* Upgrade and patch microservices within applications independently.
* Monitor and diagnose the health of your applications and set policies for performing automatic repairs.
* Scale out or scale in the number of nodes in a cluster, and scale up or scale down the size of each node. As you scale nodes, your applications automatically scale and are distributed according to the available resources.
* Watch the self-healing resource balancer orchestrate the redistribution of applications across the cluster. Service Fabric recovers from failures and optimizes the distribution of load based on available resources.
* Use the fault analysis service to perform chaos testing on your service to find issues and failures before running in production.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* For more information:
  * [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)
  * [Terminology overview](service-fabric-technical-overview.md)
* Setting up your Service Fabric [development environment](service-fabric-get-started.md)  
* [Choosing a programming model framework](service-fabric-choose-framework.md) for your service
* Learn about [Service Fabric support options](service-fabric-support.md)

[Image1]: media/service-fabric-overview/Service-Fabric-Overview.png
