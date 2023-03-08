---
title: Delete Azure Service Fabric actors 
description: Learn how to manually and fully delete Reliable Actors and their state in an Azure Service Fabric application.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
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
* [Actor API reference documentation](/previous-versions/azure/dn971626(v=azure.100))
* [C# Sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java Sample code](https://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-lifecycle/garbage-collection.png
