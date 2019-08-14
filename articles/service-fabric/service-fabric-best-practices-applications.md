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
ms.date: 06/18/2019
ms.author: mfussell
---

# Azure Service Fabric application design best practices

This article provides best practice guidance for building applications and services on Azure Service Fabric.
 
## Get familiar with Service Fabric
* Read the [So you want to learn about Service Fabric?](service-fabric-content-roadmap.md) article.
* Read about [Service Fabric application scenarios](service-fabric-application-scenarios.md).
* Understand the programming model choices by reading [Service Fabric programming model overview](service-fabric-choose-framework.md).



## Application design guidance
Become familiar with the [general architecture](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric) of Service Fabric applications and their [design considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric#design-considerations).

### Choose an API gateway
Use an API gateway service that communicates to back-end services that can then be scaled out. The most common API gateway services used are:

- [Azure API Management](https://docs.microsoft.com/azure/service-fabric/service-fabric-api-management-overview), which is [integrated with Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-deploy-api-management).
- [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/), using the [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor) to read from Event Hub partitions.
- [Træfik reverse proxy](https://blogs.msdn.microsoft.com/azureservicefabric/2018/04/05/intelligent-routing-on-service-fabric-with-traefik/), using the [Azure Service Fabric provider](https://docs.traefik.io/configuration/backends/servicefabric/).
- [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/).

   > [!NOTE] 
   > Azure Application Gateway isn't directly integrated with Service Fabric. Azure API Management is typically the preferred choice.
- Your own custom-built [ASP.NET Core](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-aspnetcore) web application gateway.

### Stateless services
We recommended that you always start by building stateless services by using [Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction) and storing state in an Azure database, Azure Cosmos DB, or Azure Storage. Externalized state is the more familiar approach for most developers. This approach also enables you to take advantage of query capabilities on the store.  

### When to use stateful services
Consider stateful services when you have a scenario for low latency and need to keep the data close to the compute. Some example scenarios include IoT digital twin devices, game state, session state, caching data from a database, and long-running workflows to track calls to other services.

Decide on the data retention time frame:

- **Cached data**. Use caching when latency to external stores is an issue. Use a stateful service as your own data cache, or consider using the [open-source SoCreate Service Fabric Distributed Cache](https://github.com/SoCreate/service-fabric-distributed-cache). In this scenario, you don't need to be concerned if you lose all the data in the cache.
- **Time-bound data**. In this scenario, you need to keep data close to compute for a period of time for latency, but you can afford to lose the data in a *disaster*. For example, in many IoT solutions, data needs to be close to compute, such as when the average temperature over the past few days is being calculated, but if this data is lost, the specific data points recorded aren't that important. Also, in this scenario you don't typically care about backing up the individual data points. You only back up computed average values that are periodically written to external storage.  
- **Long-term data**. Reliable collections can store your data permanently. But in this case you need to [prepare for disaster recovery](https://docs.microsoft.com/azure/service-fabric/service-fabric-disaster-recovery), including [configuring periodic backup policies](https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-configure-periodic-backup) for your clusters. In effect, you configure what happens if your cluster is destroyed in a disaster, where you would need to create a new cluster, and how to deploy new application instances and recover from the latest backup.

Save costs and improve availability:
- You can reduce costs by using stateful services because you don't incur data access and transactions costs from the remote store, and because you don't need to use another service, like Azure Cache for Redis.
- Using stateful services primarily for storage and not for compute is expensive, and we don't recommend it. Think of stateful services as compute with cheap local storage.
- By removing dependencies on other services, you can improve your service availability. Managing state with HA in the cluster isolates you from other service downtimes or latency issues.

## How to work with Reliable Services
Service Fabric Reliable Services enables you to easily create stateless and stateful services. For more information, see the [introduction to Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction).
- Always honor the [cancellation token](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-lifecycle#stateful-service-primary-swaps) in the `RunAsync()` method for stateless and stateful services and the `ChangeRole()` method for stateful services. If you don't, Service Fabric doesn't know if your service can be closed. For example, if you don't honor the cancellation token, much longer application upgrade times can occur.
-	Open and close [communication listeners](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication) in a timely way, and honor the cancellation tokens.
-	Never mix sync code with async code. For example, don't use `.GetAwaiter().GetResult()` in your async calls. Use async *all the way* through the call stack.

## How to work with Reliable Actors
Service Fabric Reliable Actors enables you to easily create stateful, virtual actors. For more information, see the [introduction to Reliable Actors](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction).

- Seriously consider using pub/sub messaging between your actors for scaling your application. Tools that provide this service include the [open-source SoCreate Service Fabric Pub/Sub](https://service-fabric-pub-sub.socreate.it/) and [Azure Service Bus](https://docs.microsoft.com/azure/service-bus/).
- Make the actor state as [granular as possible](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices).
- Manage the [actor's life cycle](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#best-practices). Delete actors if you're not going to use them again. Deleting unneeded actors is especially important when you're using the [volatile state provider](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-state-management#state-persistence-and-replication), because all the state is stored in memory.
- Because of their [turn-based concurrency](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction#concurrency), actors are best used as independent objects. Don't create graphs of multi-actor, synchronous method calls (each of which most likely becomes a separate network call) or create circular actor requests. These will significantly affect performance and scale.
- Don’t mix sync code with async code. Use async consistently to prevent performance issues.
- Don’t make long-running calls in actors. Long-running calls will block other calls to the same actor, due to the turn-based concurrency.
- If you're communicating with other services by using [Service Fabric remoting](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-communication-remoting) and you're creating a `ServiceProxyFactory`, create the factory at the [actor-service](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-using) level and *not* at the actor level.


## Application diagnostics
Be thorough about adding [application logging](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) in service calls. It will help you diagnose scenarios in which services call each other. For example, when A calls B calls C calls D, the call could fail anywhere. If you don't have enough logging, failures are hard to diagnose. If the services are logging too much because of call volumes, be sure to at least log errors and warnings.

## IoT and messaging applications
When you're reading messages from [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) or [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/), use  [ServiceFabricProcessor](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/ServiceFabricProcessor). ServiceFabricProcessor integrates with Service Fabric Reliable Services to maintain the state of reading from the event hub partitions and pushes new messages to your services via the `IEventProcessor::ProcessEventsAsync()` method.


## Design guidance on Azure
* Visit the [Azure architecture center](https://docs.microsoft.com/azure/architecture/microservices/) for design guidance on [building microservices on Azure](https://docs.microsoft.com/azure/architecture/microservices/).

* Visit [Get Started with Azure for Gaming](https://docs.microsoft.com/gaming/azure/) for design guidance on [using Service Fabric in gaming services](https://docs.microsoft.com/gaming/azure/reference-architectures/multiplayer-synchronous-sf).
