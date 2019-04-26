---
title: Azure Service Fabric application design best practices | Microsoft Docs
description: Best practices for developing Service Fabric applications.
services: service-fabric
documentationcenter: .net
author: markfussell
manager: chackdan
editor: ''
ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/24/2019
ms.author: msfussell
---

# Azure Service Fabric application design best practices

This topic provides guidance for building applications and services on Service Fabric.
 
## Get familiar with Service Fabric
* [So you want to learn about Service Fabric?](service-fabric-content-roadmap.md)
* Read about [Service Fabric application scenarios](service-fabric-application-scenarios.md)
* Then understand the programming model choices by reading [Service Fabric programming model overview](service-fabric-choose-framework.md)



## Application design guidance
Become familiar with the  [general architecture](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric) of a Service Fabric application and its [design considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric#design-considerations). 

### Choose an API gateway
Use  an API gateway service that communicates and back-end services that can then be scaled out. The most common API gateway services are;

- [Azure API Management](https://docs.microsoft.com/azure/service-fabric/service-fabric-api-management-overview) which is [integrated with Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-deploy-api-management)
- [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/) along with the [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor) that provides integration with Event Hub partitions
- [Træfik](https://blogs.msdn.microsoft.com/azureservicefabric/2018/04/05/intelligent-routing-on-service-fabric-with-traefik/) integration
- [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/). Note: this is not directly integrated with Service Fabric and Azure API Management is typically a preferred choice.
- Build an [ASP.NET Core web](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-aspnetcore) application

### Choose stateless services
We recommended that you always start by building stateless services using [Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction) storing state in an Azure Database or Azure CosmosDB. Having state externalized is the more familiar approach for most developers and enables you to also take advantage of query capabilities of the store.  

### When to choose stateful services
Consider stateful services when you have a scenario for low latency and a need to keep the data close to the compute. Examples include IoT digital twin devices, game state, session state, caching data from a database, long running workflows to track calls to other service. You then need to decide the data retention timeframe. 

* Cache data - You need caching where latency to external stores is an issue. Use Reliable Collections as your own data cache or consider using the open sourced [service-fabric-distributed-cache](https://github.com/SoCreate/service-fabric-distributed-cache). In this scenario you can loose all the data and it does not matter
* Time bound data - You need to keep data close to compute for latency for a period of time, but that data can afford to be lost in a *disaster* scenario. For example, in many IoT solutions data has to be close to compute, for example calculating the average temperature over the last few days, however if this data is lost, then the specific data points recorded are not that important. Also in this scenario you do not typically care about backup of the individual data points, only of the computed average values that are written to external storage periodically. 
* Long term data - Reliable collections can store your data permanently with HA. Yes, that means forever. However, in this case you need to [prepare for disaster recovery](https://docs.microsoft.com/azure/service-fabric/service-fabric-disaster-recovery) including [configurating periodic backup policies](https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-configure-periodic-backup) for your clusters. In effect what happens were your cluster to be destroyed in a disaster scenario. 
 
## How to play nice with Reliable Services
- Read the [introduction to Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction)
- Always honor the [cancellation token](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-lifecycle#stateful-service-primary-swaps) in the RunAsync() method for stateless and stateful services and the ChangeRole() method stateful services. Your have to play nice with Service Fabric otherwise it does not know if your service can be closed. For example, not honouring the cancellation token can result in  long application upgrade times.
-	Open and close [Communication Listeners](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication) in a timely manner and honor the cancellation tokens.
-	Never mix sync code with async code. For example, do not use .GetAwaiter().GetResult() in your async calls, it needs to be async *all the way* through the call stack.

## How to play nice with Reliable Actors
- Read the [introduction to Reliable Actors](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction)
- Due to their [turn based concurrency](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction#concurrency) actors are best used as independent objects. Creating graphs of multi-actor, synchronous method calls (each of which most likely becomes a separate network call) or having circular actor request affects both performance and scale.
- Strongly consider using pub/sub messaging between your actors for scaling the application. For example the [open sourced pub/sub](https://service-fabric-pub-sub.socreate.it/)
- Let's say this again.  Don’t mix sync code with async code, it needs to be async all the way.
- Make the actor state as [granular as possible](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices )
- Don’t make long running calls in actors, it will block other calls to the same actor.
- If communicating with other services using [Service Fabric remoting](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-remoting) and you are creating a ServiceProxyFactory, then create factory at the [actor service](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-using) level and *not* at actor level.
- Manage the [actor's life-cycle](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices). Delete actors if your not going to use them ever again. This is especially true when using the [VolatileState provider](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#state-persistence-and-replication) as all the state is stored in memory.

## Application diagnostics
- Go crazy adding [application logging](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) in service calls. It helps in diagnostics of scenarios where services call each other. For example when A->B->C->D the call could fail anywhere, if there is not enough logging its  hard to diagnose. If the services are logging too much because of call volumes then at least log errors and warnings.

## IoT and Messaging Applications
When reading messages from [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/) use  [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor) that uses Service Fabric Reliable Services to maintain the state of reading from the partitions and pushes new messages to your services via the IEventProcessor::ProcessEventsAsync() method.

## Workflows Applications
We are working on integrating [Durable Task framework](https://github.com/Azure/durabletask) and Service Fabric Reliable Services with state persisted to Reliable Collections to enable you to create long running, persistent workflows. This is  useful if you need to call a number of different Azure services and remember those that had been successfully called if the service fails over to another machine. 

## Design guidance on Azure
* Visit the [Azure architecture center](https://docs.microsoft.com/azure/architecture/microservices/) for design guidance on [building microservices on Azure](https://docs.microsoft.com/azure/architecture/microservices/)

* Visit [Get Started with Azure for Gaming](https://docs.microsoft.com/gaming/azure/) for design guidance on [using Service Fabric in gaming services](https://docs.microsoft.com/gaming/azure/reference-architectures/multiplayer-synchronous-sf)

## Next steps

* Visit the [Azure architecture center](https://docs.microsoft.com/azure/architecture/microservices/)