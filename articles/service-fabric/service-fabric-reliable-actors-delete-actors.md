---
title: Delete Azure Service Fabric actors | Microsoft Docs
description: Learn how to manually delete Service Fabric Reliable Actors and their state.
services: service-fabric
documentationcenter: .net
author: amanbha
manager: chackdan
editor: vturecek

ms.assetid: b91384cc-804c-49d6-a6cb-f3f3d7d65a8e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/19/2018
ms.author: amanbha

---
# Delete Reliable Actors and their state
Garbage collection of deactivated actors only cleans up the actor object, but it does not remove data that is stored in an actor's State Manager. When an actor is reactivated, its data is again made available to it through the State Manager. In cases where actors store data in State Manager and are deactivated but never reactivated, it may be necessary to clean up their data.

The [Actor Service](service-fabric-reliable-actors-platform.md) provides a function for deleting actors from a remote caller:

```csharp
ActorId actorToDelete = new ActorId(id);

IActorService myActorServiceProxy = ActorServiceProxy.Create(
    new Uri("fabric:/MyApp/MyService"), actorToDelete);

await myActorServiceProxy.DeleteActorAsync(actorToDelete, cancellationToken)
```
```Java
ActorId actorToDelete = new ActorId(id);

ActorService myActorServiceProxy = ActorServiceProxy.create(
    new Uri("fabric:/MyApp/MyService"), actorToDelete);

myActorServiceProxy.deleteActorAsync(actorToDelete);
```

Deleting an actor has the following effects depending on whether or not the actor is currently active:

* **Active Actor**
  * Actor is removed from active actors list and is deactivated.
  * Its state is deleted permanently.
* **Inactive Actor**
  * Its state is deleted permanently.

An actor cannot call delete on itself from one of its actor methods because the actor cannot be deleted while executing within an actor call context, in which the runtime has obtained a lock around the actor call to enforce single-threaded access.

For more information on Reliable Actors, read the following:
* [Actor timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
* [Actor events](service-fabric-reliable-actors-events.md)
* [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
* [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
* [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
* [C# Sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java Sample code](https://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-lifecycle/garbage-collection.png
