<properties
   pageTitle="Overview of Service Fabric | Microsoft Azure"
   description="An overview of Service Fabric, where applications are composed of many microservices to provide scale and resilience. Service Fabric is a distributed systems platform used to build scalable, reliable, and easily managed applications for the cloud"
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
   ms.date="07/05/2016"
   ms.author="mfussell"/>

# Overview of Service Fabric
Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and addresses the significant challenges in developing and managing cloud applications. By using Service Fabric, developers and administrators can avoid solving complex infrastructure problems and focus instead on implementing mission-critical, demanding workloads knowing that they are scalable, reliable, and manageable. Service Fabric represents the next-generation middleware platform for building and managing these enterprise-class, Tier-1 cloud-scale applications.

## Applications composed of microservices
Service Fabric enables you to build and manage scalable and reliable applications composed of microservices running at very high density on a shared pool of machines (referred to as a Service Fabric cluster). It provides a sophisticated runtime for building distributed, scalable stateless and stateful microservices. It also provides comprehensive application management capabilities for provisioning, deploying, monitoring, upgrading/patching, and deleting deployed applications.

Why is a microservices approach important? The two main reasons are:

1. They enable you to scale different parts of your application depending on its needs.

2. Development teams are able to be more agile in rolling out changes and thereby provide features to your customers faster and more frequently.

Service Fabric powers many Microsoft services today, including Azure SQL Database, Azure DocumentDB, Cortana, Power BI, Microsoft Intune, Azure Event Hubs, Azure IoT, Skype for Business, and many core Azure services to name a few.

Service Fabric is tailored to creating “born in the cloud” services that can start small, as needed, and grow to massive scale with hundreds or thousands of machines.

Today's Internet-scale services are built using microservices. Examples of microservices include protocol gateways, user profiles, shopping carts, inventory processing, queues, and caches. Service Fabric is a microservices platform that gives every microservice a unique name that can be either stateless or stateful.

Service Fabric provides comprehensive runtime and lifecycle management capabilities to applications composed of these microservices. It hosts microservices inside containers that are deployed and activated across the Service Fabric cluster. Just as an order-of-magnitude increase in density is made possible by moving from VMs to containers, a similar order of magnitude in density becomes possible by moving from containers to microservices. For example, a single Azure SQL Database cluster, which is built on Service Fabric, comprises hundreds of machines running tens of thousands of containers hosting a total of hundreds of thousands of databases. (Each database is a Service Fabric stateful microservice.) The same is true of Event Hubs and the other services mentioned above. This is why the term "hyperscale" can be used to describe Service Fabric capabilities. If containers give you high density, then microservices give you hyperscale.

For more on the microservices approach read [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)

## Create Service Fabric clusters anywhere
You can create Service Fabric clusters in many environments to deploy your applications to. This can be in Azure or on premises, on Windows Server or on Linux. In addition the development environment in the SDK is identical to the production environment with no emulators involved. In other words, if it runs on your local development cluster it will deploy to the same cluster in other environments.

For more information on creating clusters on-premise read [creating a cluster on Windows Server or Linux](service-fabric-deploy-anywhere.md) or for Azure creating a cluster [via the Azure Portal](service-fabric-cluster-creation-via-portal.md).

![Service Fabric platform][Image1]

## Stateless and stateful Service Fabric microservices

Service Fabric enables you to build applications consisting of microservices. Stateless microservices (protocol gateways, web proxies, etc.) do not maintain a mutable state outside of any given request and its response from the service. Azure Cloud Services worker roles are an example of a stateless service. Stateful microservices (user accounts, databases, devices, shopping carts, queues, etc.) maintain a mutable, authoritative state beyond the request and its response. Today's Internet-scale applications consist of a combination of stateless and stateful microservices.

Why have stateful microservices along with stateless ones? The two main reasons are:

1. The ability to build high-throughput, low-latency, failure-tolerant online transaction processing (OLTP) services such as interactive storefronts, search, Internet of Things (IoT) systems, trading systems, credit card processing and fraud detection systems, personal record management, etc., by keeping code and data close on the same machine.

2. Application design simplification, as stateful microservices remove the need for additional queues and caches. These have traditionally been required to address the availability and latency requirements of a purely stateless application. Since stateful services are naturally high-availability and low-latency, this means fewer moving parts to manage in your application as a whole.

For more information on application patterns with Service Fabric, read [Application scenarios](service-fabric-application-scenarios.md) and [Choosing a programming model framework](service-fabric-choose-framework.md) for your service

## Application lifecycle management
Service Fabric provides first-class support for the full application lifecycle management (ALM) of cloud applications--from development through deployment, daily management, and maintenance to eventual decommissioning.

The Service Fabric ALM capabilities enable application administrators/IT operators to use simple, low-touch workflows to provision, deploy, patch, and monitor applications. These built-in workflows greatly reduce the burden on IT operators to keep applications continuously available.

Most applications consist of a combination of stateless and stateful microservices and other executables/runtimes that are deployed together. By having strong types on the applications and packaged microservices, Service Fabric enables the deployment of multiple application instances, each of which can be managed and upgraded independently. Importantly, Service Fabric is able to deploy *any* executables or runtime and make these reliable. For example, it can be used to deploy ASP.NET Core 1, Node.js, Java VMs, scripts, or anything else that makes up your application.

For more information on application lifecycle management, read [Application lifecycle](service-fabric-application-lifecycle.md) and on deploying any code see [Deploy a guest executable](service-fabric-deploy-existing-app.md)

## Key capabilities
By using Service Fabric, you can:

- Develop massively scalable applications that are self-healing.

- Develop applications composed of microservices, using the Service Fabric programming model, or simply host guest executables, and other application frameworks of your choice, such as ASP.NET Core 1, Node.js, etc.

- Develop stateless and stateful microservices and make these highly reliable.

- Simplify the design of your application by using stateful microservices in place of caches and queues.

- Deploy to Azure or to on-premises clouds running Windows Server or Linux with zero code changes. Write once and then deploy anywhere to any Service Fabric cluster.

- Develop with a "datacenter on your machine" approach. The local development environment is the same code that runs in the Azure datacenters.

- Deploy applications in seconds.

- Deploy applications at higher density than virtual machines, deploying hundreds or thousands of applications per machine.

- Deploy different versions of the same application side by side, each independently upgradable.

- Manage the lifecycle of your stateful applications without any downtime, including breaking and nonbreaking upgrades.

- Manage applications using .NET APIs, PowerShell, or REST interfaces.

- Upgrade and patch microservices within applications independently.

- Monitor and diagnose the health of your applications and set policies for performing automatic repairs.

- Scale up or scale down your Service Fabric cluster easily, knowing that the applications scale according to available resources.

- Watch the self-healing resource balancer orchestrate the redistribution of applications across the Service Fabric cluster to recover from failures and optimize the distribution of load based on available resources.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

* For more information:
    * [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)
    * [Terminology overview](service-fabric-technical-overview.md)
* Setting up your Service Fabric [development environment](service-fabric-get-started.md)  
* [Choosing a programming model framework](service-fabric-choose-framework.md) for your service

[Image1]: media/service-fabric-overview/Service-Fabric-Overview.png
