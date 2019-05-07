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
ms.date: 04/26/2019
ms.author: msfussell
---

# Azure Service Fabric application design best practices

This article provides best practice guidance for building applications and services on Service Fabric.
 
## Get familiar with Service Fabric
* [So you want to learn about Service Fabric?](service-fabric-content-roadmap.md)
* Read about [Service Fabric application scenarios](service-fabric-application-scenarios.md)
* Then understand the programming model choices with [Service Fabric programming model overview](service-fabric-choose-framework.md)



## Application design guidance
Become familiar with the [general architecture](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric) of a Service Fabric application and its [design considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric#design-considerations).

### Choose an API gateway
Use an API gateway service that communicates to back-end services that can then be scaled out. The most common API gateway services used are:

- [Azure API Management](https://docs.microsoft.com/azure/service-fabric/service-fabric-api-management-overview), which is [integrated with Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-deploy-api-management)
- [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/) using the [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor) to read from Event Hub partitions
- [Træfik reverse proxy](https://blogs.msdn.microsoft.com/azureservicefabric/2018/04/05/intelligent-routing-on-service-fabric-with-traefik/) using the [Azure Service Fabric provider](https://docs.traefik.io/configuration/backends/servicefabric/)
- [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/) note: this is not directly integrated with Service Fabric and Azure API Management is typically a preferred choice
- Build your own [ASP.NET Core](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-aspnetcore) web application gateway

### Choose stateless services
We recommended that you always start by building stateless services using [Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction) storing state in an Azure Database, Azure CosmosDB, or Azure storage. Having state externalized is the more familiar approach for most developers and enables you to also take advantage of query capabilities on the store.  

### When to choose stateful services
Consider stateful services when you have a scenario for low latency and need to keep the data close to the compute. Some examples include IoT digital twin devices, game state, session state, caching data from a database and long running workflows to track calls to other services.

Decide the data retention time frame:

- Cached data - You use caching where latency to external stores is an issue. Use a stateful service as your own data cache or consider using the [open sourced SoCreate service-fabric-distributed-cache](https://github.com/SoCreate/service-fabric-distributed-cache). In this scenario, you can lose all the data in the cache and it does not matter.
- Time-bound data - You need to keep data close to compute for latency for a period of time, but that data can afford to be lost in a *disaster* scenario. For example, in many IoT solutions data has to be close to compute, for example calculating the average temperature over the last few days, however if this data is lost, then the specific data points recorded are not that important. Also in this scenario you do not typically care about backup of the individual data points, only of the computed average values that are written to external storage periodically.  
- Long-term data - Reliable collections can store your data permanently. However, in this case you need to [prepare for disaster recovery](https://docs.microsoft.com/azure/service-fabric/service-fabric-disaster-recovery) including [configuring periodic backup policies](https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-configure-periodic-backup) for your clusters. In effect, you configure what happens if your cluster is destroyed in a disaster scenario, where you would need to create a new cluster, and how to deploy new application instances and recover from the latest backup.

Save costs and improve availability:
- You can reduce costs with stateful services since you do not incur data access and transactions costs from the remote store and there is no need to use another service such as Azure Redis.
- Using stateful services primarily for storage and not for compute is expensive and not recommended. Consider stateful services as compute with cheap local storage.
- By removing dependencies on other services, you can improve your service availability. Having state managed with HA in the cluster isolates you from other service downtimes or latency issues.

## How to properly work with Reliable Services
Reliable Services enable you to easily create stateless and stateful services. Read the [introduction to Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction)
- Always honor the [cancellation token](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-lifecycle#stateful-service-primary-swaps) in the `RunAsync()` method for stateless and stateful services and the `ChangeRole()` method for stateful services. Without this, Service Fabric does not know if your service can be closed. For example, not honoring the cancellation token can result in much longer application upgrade times.
-	Open and close [Communication Listeners](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication) in a timely manner and honor the cancellation tokens.
-	Never mix sync code with async code. For example, do not use `.GetAwaiter().GetResult()` in your async calls; it needs to be async *all the way* through the call stack.

## How to properly work with Reliable Actors
Reliable Actors enables you to easily create stateful, virtual actors. Read the [introduction to Reliable Actors](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction)

- Strongly consider using pub/sub messaging between your actors for scaling the application. For example, the [open sourced SoCreate pub/sub](https://service-fabric-pub-sub.socreate.it/) or [Azure Service Bus](https://docs.microsoft.com/azure/service-bus/).
- Make the actor state as [granular as possible](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices).
- Manage the [actor's life-cycle](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices). Delete actors if you're not going to use them ever again. This is especially true when using the [VolatileState provider](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#state-persistence-and-replication) as all the state is stored in memory.
- Due to their [turn based concurrency](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction#concurrency) actors are best used as independent objects. Don't create graphs of multi-actor, synchronous method calls (each of which most likely becomes a separate network call) or have circular actor requests; these will significantly affect performance and scale.
- Don’t mix sync code with async code; it needs to be async all the way, to prevent performance issues.
- Don’t make long running calls in actors, it will block other calls to the same actor, due to the turn-based concurrency.
- If communicating with other services using [Service Fabric remoting](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-remoting) and you are creating a `ServiceProxyFactory`, then create the factory at the [actor service](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-using) level and *not* at actor level.


## Application diagnostics
- Be thorough in adding [application logging](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) in service calls. It helps in diagnostics of scenarios where services call each other. For example, when A->B->C->D the call could fail anywhere; if there is not enough logging, it is hard to diagnose. If the services are logging too much because of call volumes, at least be sure to log errors and warnings.

## IoT and messaging applications
When reading messages from [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/) use  [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor) that integrates with Service Fabric Reliable Services to maintain the state of reading from the Event Hub partitions and pushes new messages to your services via the `IEventProcessor::ProcessEventsAsync()` method.


## Design guidance on Azure
* Visit the [Azure architecture center](https://docs.microsoft.com/azure/architecture/microservices/) for design guidance on [building microservices on Azure](https://docs.microsoft.com/azure/architecture/microservices/)

* Visit [Get Started with Azure for Gaming](https://docs.microsoft.com/gaming/azure/) for design guidance on [using Service Fabric in gaming services](https://docs.microsoft.com/gaming/azure/reference-architectures/multiplayer-synchronous-sf)
