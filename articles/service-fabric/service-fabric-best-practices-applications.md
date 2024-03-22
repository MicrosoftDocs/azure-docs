---
title: Azure Service Fabric application design best practices 
description: Best practices and design considerations for developing applications and services using Azure Service Fabric.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric application design best practices

This article provides best practice guidance for building applications and services on Azure Service Fabric.
 
## Get familiar with Service Fabric
* Read the [So you want to learn about Service Fabric?](service-fabric-content-roadmap.md) article.
* Read about [Service Fabric application scenarios](service-fabric-application-scenarios.md).
* Understand the programming model choices by reading [Service Fabric programming model overview](service-fabric-choose-framework.md).



## Application design guidance
Become familiar with the [general architecture](/azure/architecture/reference-architectures/microservices/service-fabric) of Service Fabric applications and their [design considerations](/azure/architecture/reference-architectures/microservices/service-fabric#design-considerations).

### Choose an API gateway
Use an API gateway service that communicates to back-end services that can then be scaled out. The most common API gateway services used are:

- [Azure API Management](./service-fabric-api-management-overview.md), which is [integrated with Service Fabric](./service-fabric-tutorial-deploy-api-management.md).
- [Træfik reverse proxy](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric), using the [Azure Service Fabric provider](https://docs.traefik.io/v1.6/configuration/backends/servicefabric/).
- [Azure Application Gateway](../application-gateway/index.yml).

   > [!NOTE] 
   > Azure Application Gateway isn't directly integrated with Service Fabric. Azure API Management is typically the preferred choice.
- Your own custom-built [ASP.NET Core](./service-fabric-reliable-services-communication-aspnetcore.md) web application gateway.

### Stateless services
We recommended that you always start by building stateless services by using [Reliable Services](./service-fabric-reliable-services-introduction.md) and storing state in an Azure database, Azure Cosmos DB, or Azure Storage. Externalized state is the more familiar approach for most developers. This approach also enables you to take advantage of query capabilities on the store.  

### When to use stateful services
Consider stateful services when you have a scenario for low latency and need to keep the data close to the compute. Some example scenarios include IoT digital twin devices, game state, session state, caching data from a database, and long-running workflows to track calls to other services.

Decide on the data retention time frame:

- **Cached data**. Use caching when latency to external stores is an issue. Use a stateful service as your own data cache, or consider using the [open-source SoCreate Service Fabric Distributed Cache](https://github.com/SoCreate/service-fabric-distributed-cache). In this scenario, you don't need to be concerned if you lose all the data in the cache.
- **Time-bound data**. In this scenario, you need to keep data close to compute for a period of time for latency, but you can afford to lose the data in a *disaster*. For example, in many IoT solutions, data needs to be close to compute, such as when the average temperature over the past few days is being calculated, but if this data is lost, the specific data points recorded aren't that important. Also, in this scenario you don't typically care about backing up the individual data points. You only back up computed average values that are periodically written to external storage.  
- **Long-term data**. Reliable collections can store your data permanently. But in this case you need to [prepare for disaster recovery](./service-fabric-disaster-recovery.md), including [configuring periodic backup policies](./service-fabric-backuprestoreservice-configure-periodic-backup.md) for your clusters. In effect, you configure what happens if your cluster is destroyed in a disaster, where you would need to create a new cluster, and how to deploy new application instances and recover from the latest backup.

Save costs and improve availability:
- You can reduce costs by using stateful services because you don't incur data access and transactions costs from the remote store, and because you don't need to use another service, like Azure Cache for Redis.
- Using stateful services primarily for storage and not for compute is expensive, and we don't recommend it. Think of stateful services as compute with cheap local storage.
- By removing dependencies on other services, you can improve your service availability. Managing state with HA in the cluster isolates you from other service downtimes or latency issues.

## How to work with Reliable Services
Service Fabric Reliable Services enables you to easily create stateless and stateful services. For more information, see the [introduction to Reliable Services](./service-fabric-reliable-services-introduction.md).
- Always honor the [cancellation token](./service-fabric-reliable-services-lifecycle.md#stateful-service-primary-swaps) in the `RunAsync()` method for stateless and stateful services and the `ChangeRole()` method for stateful services. If you don't, Service Fabric doesn't know if your service can be closed. For example, if you don't honor the cancellation token, much longer application upgrade times can occur.
-    Open and close [communication listeners](./service-fabric-reliable-services-communication.md) in a timely way, and honor the cancellation tokens.
-    Never mix sync code with async code. For example, don't use `.GetAwaiter().GetResult()` in your async calls. Use async *all the way* through the call stack.

## How to work with Reliable Actors
Service Fabric Reliable Actors enables you to easily create stateful, virtual actors. For more information, see the [introduction to Reliable Actors](./service-fabric-reliable-actors-introduction.md).

- Seriously consider using pub/sub messaging between your actors for scaling your application. Tools that provide this service include the [open-source SoCreate Service Fabric Pub/Sub](https://service-fabric-pub-sub.socreate.it/) and [Azure Service Bus](/azure/service-bus/).
- Make the actor state as [granular as possible](./service-fabric-reliable-actors-state-management.md#best-practices).
- Manage the [actor's life cycle](./service-fabric-reliable-actors-state-management.md#best-practices). Delete actors if you're not going to use them again. Deleting unneeded actors is especially important when you're using the [volatile state provider](./service-fabric-reliable-actors-state-management.md#state-persistence-and-replication), because all the state is stored in memory.
- Because of their [turn-based concurrency](./service-fabric-reliable-actors-introduction.md#concurrency), actors are best used as independent objects. Don't create graphs of multi-actor, synchronous method calls (each of which most likely becomes a separate network call) or create circular actor requests. These will significantly affect performance and scale.
- Don't mix sync code with async code. Use async consistently to prevent performance issues.
- Don't make long-running calls in actors. Long-running calls will block other calls to the same actor, due to the turn-based concurrency.
- If you're communicating with other services by using [Service Fabric remoting](./service-fabric-reliable-services-communication-remoting.md) and you're creating a `ServiceProxyFactory`, create the factory at the [actor-service](./service-fabric-reliable-actors-using.md) level and *not* at the actor level.


## Application diagnostics
Be thorough about adding [application logging](./service-fabric-diagnostics-event-generation-app.md) in service calls. It will help you diagnose scenarios in which services call each other. For example, when A calls B calls C calls D, the call could fail anywhere. If you don't have enough logging, failures are hard to diagnose. If the services are logging too much because of call volumes, be sure to at least log errors and warnings.

## Design guidance on Azure
* Visit the [Azure architecture center](/azure/architecture/microservices/) for design guidance on [building microservices on Azure](/azure/architecture/microservices/).

* Visit [Get Started with Azure for Gaming](/gaming/azure/) for design guidance on using Service Fabric in gaming services.
