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
ms.topic: overview
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/20/2017
ms.author: msfussell
ms.custom: mvc

---
# Overview of Azure Service Fabric
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. Service Fabric also addresses the significant challenges in developing and managing cloud native applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable. Service Fabric represents the next-generation platform for building and managing these enterprise-class, tier-1, cloud-scale applications running in containers.

This short video introduces Service Fabric and microservices:
> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-Service-Fabric/player]

## Applications composed of microservices 
Service Fabric enables you to build and manage scalable and reliable applications composed of microservices that run at high density on a shared pool of machines, which is referred to as a cluster. It provides a sophisticated, lightweight runtime to build distributed, scalable, stateless, and stateful microservices running in containers. It also provides comprehensive application management capabilities to provision, deploy, monitor, upgrade/patch, and delete deployed applications including containerized services.

Service Fabric powers many Microsoft services today, including Azure SQL Database, Azure Cosmos DB, Cortana, Microsoft Power BI, Microsoft Intune, Azure Event Hubs, Azure IoT Hub, Dynamics 365, Skype for Business, and many core Azure services.

Service Fabric is tailored to create cloud native services that can start small, as needed, and grow to massive scale with hundreds or thousands of machines.

Today's Internet-scale services are built of microservices. Examples of microservices include protocol gateways, user profiles, shopping carts, inventory processing, queues, and caches. Service Fabric is a microservices platform that gives every microservice (or container) a unique name that can be either stateless or stateful.

Service Fabric provides comprehensive runtime and lifecycle management capabilities to applications that are composed of these microservices. It hosts microservices inside containers that are deployed and activated across the Service Fabric cluster. A move from virtual machines to containers makes possible an order-of-magnitude increase in density. Similarly, another order of magnitude in density becomes possible when you move from containers to microservices in these containers. For example, a single cluster for Azure SQL Database comprises hundreds of machines running tens of thousands of containers that host a total of hundreds of thousands of databases. Each database is a Service Fabric stateful microservice. 

For more on the microservices approach, read [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)

## Container deployment and orchestration
Service Fabric is Microsoft's [container orchestrator](service-fabric-cluster-resource-manager-introduction.md) deploying microservices across a cluster of machines. Microservices can be developed in many ways from using the [Service Fabric programming models](service-fabric-choose-framework.md), [ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md), to deploying [any code of your choice](service-fabric-guest-executables-introduction.md). Importantly, you can mix both services in processes and services in containers in the same application. If you just want to [deploy and manage containers](service-fabric-containers-overview.md), Service Fabric is a perfect choice as a container orchestrator.

## Any OS, any cloud
Service Fabric runs everywhere. You can create clusters for Service Fabric in many environments, including Azure or on premises, on Windows Server, or on Linux. You can even create clusters on other public clouds. In addition, the development environment in the SDK is **identical** to the production environment, with no emulators involved. In other words, what runs on your local development cluster deploys to the clusters in other environments.

![Service Fabric platform][Image1]

For Windows development, the Service Fabric .NET SDK is integrated with Visual Studio and Powershell. See [Prepare your development environment on Windows](service-fabric-get-started.md). For Linux development, the Service Fabric Java SDK 
 is integrated with Eclipse, and Yeoman is used to generate templates for Java, .NET Core, and container applications. See [Prepare your development environment on Linux](service-fabric-get-started.md)

For more information on creating clusters, read [creating a cluster on Windows Server or Linux](service-fabric-deploy-anywhere.md) or for Azure creating a cluster [via the Azure portal](service-fabric-cluster-creation-via-portal.md).

## Stateless and stateful microservices for Service Fabric
Service Fabric enables you to build applications that consist of microservices or containers. Stateless microservices (such as protocol gateways and web proxies) do not maintain a mutable state outside a request and its response from the service. Azure Cloud Services worker roles are an example of a stateless service. Stateful microservices (such as user accounts, databases, devices, shopping carts, and queues) maintain a mutable, authoritative state beyond the request and its response. Today's Internet-scale applications consist of a combination of stateless and stateful microservices. 

A key differentiation with Service Fabric is its strong focus on building stateful services, either with the [built-in programming models ](service-fabric-choose-framework.md) or with  containerized stateful services. The [application scenarios](service-fabric-application-scenarios.md) describe the scenarios where stateful services are used.


## Application lifecycle management
Service Fabric provides support for the full application lifecycle and CI/CD of cloud applications including containers. This lifecycle includes development through deployment, daily management, and maintenance to eventual decommissioning.

Service Fabric application lifecycle management capabilities enable application administrators and IT operators to use simple, low-touch workflows to provision, deploy, patch, and monitor applications. These built-in workflows greatly reduce the burden on IT operators to keep applications continuously available.

Most applications consist of a combination of stateless and stateful microservices, containers, and other executables that are deployed together. By having strong types on the applications, Service Fabric enables the deployment of multiple application instances. Each instance is managed and upgraded independently. Importantly, Service Fabric can deploy containers or any executables and make them reliable. For example, Service Fabric can deploy .NET, ASP.NET Core, node.js, Windows containers, Linux containers, Java virtual machines, scripts, Angular, or literally anything that makes up your application.

Service Fabric is integrated with CI/CD tools such as [Azure Pipelines](https://www.visualstudio.com/team-services/), [Jenkins](https://jenkins.io/index.html), and [Octopus Deploy](https://octopus.com/) and can be used with any other popular CI/CD tool.

For more information about application lifecycle management, read [Application lifecycle](service-fabric-application-lifecycle.md). For more about how to deploy any code, see [deploy a guest executable](service-fabric-deploy-existing-app.md).

## Key capabilities
By using Service Fabric, you can:

* Deploy to Azure or to on-premises datacenters that run Windows or Linux with zero code changes. Write once, and then deploy anywhere to any Service Fabric cluster.
* Develop scalable applications that are composed of microservices by using the Service Fabric programming models, containers, or any code.
* Develop highly reliable stateless and stateful microservices. Simplify the design of your application by using stateful microservices. 
* Use the novel Reliable Actors programming model to create cloud objects with self contained code and state.
* Deploy and orchestrate containers that include Windows containers and Linux containers. Service Fabric is a data aware, stateful, container orchestrator.
* Deploy applications in seconds, at high density with hundreds or thousands of applications or containers per machine.
* Deploy different versions of the same application side by side, and upgrade each application independently.
* Manage the lifecycle of your applications without any downtime, including breaking and nonbreaking upgrades.
* Scale out or scale in the number of nodes in a cluster. As you scale nodes, your applications automatically scale.
* Monitor and diagnose the health of your applications and set policies for performing automatic repairs.
* Watch the resource balancer orchestrate the redistribution of applications across the cluster. Service Fabric recovers from failures and optimizes the distribution of load based on available resources.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* For more information:
  * [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)
  * [Terminology overview](service-fabric-technical-overview.md)
* Setting up your [Windows development environment](service-fabric-get-started.md)  
* Setting up your [Linux development environment](service-fabric-get-started-linux.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[Image1]: media/service-fabric-overview/Service-Fabric-Overview.png
