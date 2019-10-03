---
title: Reliable Actors on Service Fabric | Microsoft Docs
description: Describes how Reliable Actors are layered on Reliable Services and use the features of the Service Fabric platform.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: chackdan
editor: amanbha

ms.assetid: 45839a7f-0536-46f1-ae2b-8ba3556407fb
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 3/9/2018
ms.author: vturecek

---
# How Reliable Actors use the Service Fabric platform
This article explains how Reliable Actors work on the Azure Service Fabric platform. Reliable Actors run in a framework that is hosted in an implementation of a stateful reliable service called the *actor service*. The actor service contains all the components necessary to manage the lifecycle and message dispatching for your actors:

* The Actor Runtime manages lifecycle, garbage collection, and enforces single-threaded access.
* An actor service remoting listener accepts remote access calls to actors and sends them to a dispatcher to route to the appropriate actor instance.
* The Actor State Provider wraps state providers (such as the Reliable Collections state provider) and provides an adapter for actor state management.

These components together form the Reliable Actor framework.

## Service layering
Because the actor service itself is a reliable service, all the [application model](service-fabric-application-model.md), lifecycle, [packaging](service-fabric-package-apps.md), [deployment](service-fabric-deploy-remove-applications.md), upgrade, and scaling concepts of Reliable Services apply the same way to actor services.

![Actor service layering][1]

The preceding diagram shows the relationship between the Service Fabric application frameworks and user code. Blue elements represent the Reliable Services application framework, orange represents the Reliable Actor framework, and green represents user code.

In Reliable Services, your service inherits the `StatefulService` class. This class is itself derived from `StatefulServiceBase` (or `StatelessService` for stateless services). In Reliable Actors, you use the actor service. The actor service is a different implementation of the `StatefulServiceBase` class that implements the actor pattern where your actors run. Because the actor service itself is just an implementation of `StatefulServiceBase`, you can write your own service that derives from `ActorService` and implement service-level features the same way you would when inheriting `StatefulService`, such as:

* Service backup and restore.
* Shared functionality for all actors, for example, a circuit breaker.
* Remote procedure calls on the actor service itself and on each individual actor.

For more information, see [Implementing service-level features in your actor service](service-fabric-reliable-actors-using.md).

## Application model
Actor services are Reliable Services, so the application model is the same. However, the actor framework build tools generate some of the application model files for you.

### Service manifest
The actor framework build tools automatically generate the contents of your actor service's ServiceManifest.xml file. This file includes:

* Actor service type. The type name is generated based on your actor's project name. Based on the persistence attribute on your actor, the HasPersistedState flag is also set accordingly.
* Code package.
* Config package.
* Resources and endpoints.

### Application manifest
The actor framework build tools automatically create a default service definition for your actor service. The build tools populate the default service properties:

* Replica set count is determined by the persistence attribute on your actor. Each time the persistence attribute on your actor is changed, the replica set count in the default service definition is reset accordingly.
* Partition scheme and range are set to Uniform Int64 with the full Int64 key range.

## Service Fabric partition concepts for actors
Actor services are partitioned stateful services. Each partition of an actor service contains a set of actors. Service partitions are automatically distributed over multiple nodes in Service Fabric. Actor instances are distributed as a result.

![Actor partitioning and distribution][5]

Reliable Services can be created with different partition schemes and partition key ranges. The actor service uses the Int64 partitioning scheme with the full Int64 key range to map actors to partitions.

### Actor ID
Each actor that's created in the service has a unique ID associated with it, represented by the `ActorId` class. `ActorId` is an opaque ID value that can be used for uniform distribution of actors across the service partitions by generating random IDs:

```csharp
ActorProxy.Create<IMyActor>(ActorId.CreateRandom());
```
```Java
ActorProxyBase.create<MyActor>(MyActor.class, ActorId.newId());
```


Every `ActorId` is hashed to an Int64. This is why the actor service must use an Int64 partitioning scheme with the full Int64 key range. However, custom ID values can be used for an `ActorID`, including GUIDs/UUIDs, strings, and Int64s.

```csharp
ActorProxy.Create<IMyActor>(new ActorId(Guid.NewGuid()));
ActorProxy.Create<IMyActor>(new ActorId("myActorId"));
ActorProxy.Create<IMyActor>(new ActorId(1234));
```
```Java
ActorProxyBase.create(MyActor.class, new ActorId(UUID.randomUUID()));
ActorProxyBase.create(MyActor.class, new ActorId("myActorId"));
ActorProxyBase.create(MyActor.class, new ActorId(1234));
```

When you're using GUIDs/UUIDs and strings, the values are hashed to an Int64. However, when you're explicitly providing an Int64 to an `ActorId`, the Int64 will map directly to a partition without further hashing. You can use this technique to control which partition the actors are placed in.


## Next steps
* [Actor state management](service-fabric-reliable-actors-state-management.md)
* [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
* [Actors API reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.actors?redirectedfrom=MSDN&view=azure-dotnet)
* [.NET sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java sample code](https://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-platform/actor-service.png
[2]: ./media/service-fabric-reliable-actors-platform/app-deployment-scripts.png
[3]: ./media/service-fabric-reliable-actors-platform/actor-partition-info.png
[4]: ./media/service-fabric-reliable-actors-platform/actor-replica-role.png
[5]: ./media/service-fabric-reliable-actors-introduction/distribution.png
