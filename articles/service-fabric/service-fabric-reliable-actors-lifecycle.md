---
title: Overview the Azure Service Fabric actor lifecycle | Microsoft Docs
description: Explains Service Fabric Reliable Actor lifecycle, garbage collection, and manually deleting actors and their state
services: service-fabric
documentationcenter: .net
author: amanbha
manager: timlt
editor: vturecek

ms.assetid: b91384cc-804c-49d6-a6cb-f3f3d7d65a8e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/06/2017
ms.author: amanbha

---
# Actor lifecycle, automatic garbage collection, and manual delete
An actor is activated the first time a call is made to any of its methods. An actor is deactivated (garbage collected by the Actors runtime) if it is not used for a configurable period of time. An actor and its state can also be deleted manually at any time.

## Actor activation
When an actor is activated, the following occurs:

* When a call comes for an actor and one is not already active, a new actor is created.
* The actor's state is loaded if it's maintaining state.
* The `OnActivateAsync` (C#) or `onActivateAsync` (Java) method (which can be overridden in the actor implementation) is called.
* The actor is now considered active.

## Actor deactivation
When an actor is deactivated, the following occurs:

* When an actor is not used for some period of time, it is removed from the Active Actors table.
* The `OnDeactivateAsync` (C#) or `onDeactivateAsync` (Java) method (which can be overridden in the actor implementation) is called. This clears all the timers for the actor. Actor operations like state changes should not be called from this method.

> [!TIP]
> The Fabric Actors runtime emits some [events related to actor activation and deactivation](service-fabric-reliable-actors-diagnostics.md#list-of-events-and-performance-counters). They are useful in diagnostics and performance monitoring.
>
>

### Actor garbage collection
When an actor is deactivated, references to the actor object are released and it can be garbage collected normally by the common language runtime (CLR) or java virtual machine (JVM) garbage collector. Garbage collection only cleans up the actor object; it does **not** remove state stored in the actor's State Manager. The next time the actor is activated, a new actor object is created and its state is restored.

What counts as “being used” for the purpose of deactivation and garbage collection?

* Receiving a call
* `IRemindable.ReceiveReminderAsync` method being invoked (applicable only if the actor uses reminders)

> [!NOTE]
> if the actor uses timers and its timer callback is invoked, it does **not** count as "being used".
>
>

Before we go into the details of deactivation, it is important to define the following terms:

* *Scan interval*. This is the interval at which the Actors runtime scans its Active Actors table for actors that can be deactivated and garbage collected. The default value for this is 1 minute.
* *Idle timeout*. This is the amount of time that an actor needs to remain unused (idle) before it can be deactivated and garbage collected. The default value for this is 60 minutes.

Typically, you do not need to change these defaults. However, if necessary, these intervals can be changed through `ActorServiceSettings` when registering your [Actor Service](service-fabric-reliable-actors-platform.md):

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        ActorRuntime.RegisterActorAsync<MyActor>((context, actorType) =>
                new ActorService(context, actorType,
                    settings:
                        new ActorServiceSettings()
                        {
                            ActorGarbageCollectionSettings =
                                new ActorGarbageCollectionSettings(10, 2)
                        }))
            .GetAwaiter()
            .GetResult();
    }
}
```

```Java
public class Program
{
    public static void main(String[] args)
    {
        ActorRuntime.registerActorAsync(
                MyActor.class,
                (context, actorTypeInfo) -> new FabricActorService(context, actorTypeInfo),
                timeout);
    }
}
```
For each active actor, the actor runtime keeps track of the amount of time that it has been idle (i.e. not used). The actor runtime checks each of the actors every `ScanIntervalInSeconds` to see if it can be garbage collected and collects it if it has been idle for `IdleTimeoutInSeconds`.

Anytime an actor is used, its idle time is reset to 0. After this, the actor can be garbage collected only if it again remains idle for `IdleTimeoutInSeconds`. Recall that an actor is considered to have been used if either an actor interface method or an actor reminder callback is executed. An actor is **not** considered to have been used if its timer callback is executed.

The following diagram shows the lifecycle of a single actor to illustrate these concepts.

![Example of idle time][1]

The example shows the impact of actor method calls, reminders, and timers on the lifetime of this actor. The following points about the example are worth mentioning:

* ScanInterval and IdleTimeout are set to 5 and 10 respectively. (Units do not matter here, since our purpose is only to illustrate the concept.)
* The scan for actors to be garbage collected happens at T=0,5,10,15,20,25, as defined by the scan interval of 5.
* A periodic timer fires at T=4,8,12,16,20,24, and its callback executes. It does not impact the idle time of the actor.
* An actor method call at T=7 resets the idle time to 0 and delays the garbage collection of the actor.
* An actor reminder callback executes at T=14 and further delays the garbage collection of the actor.
* During the garbage collection scan at T=25, the actor's idle time finally exceeds the idle timeout of 10, and the actor is garbage collected.

An actor will never be garbage collected while it is executing one of its methods, no matter how much time is spent in executing that method. As mentioned earlier, the execution of actor interface methods and reminder callbacks prevents garbage collection by resetting the actor's idle time to 0. The execution of timer callbacks does not reset the idle time to 0. However, the garbage collection of the actor is deferred until the timer callback has completed execution.

## Manually deleting actors and their state
Garbage collection of deactivated actors only cleans up the actor object, but it does not remove data that is stored in an actor's State Manager. When an actor is re-activated, its data is again made available to it through the State Manager. In cases where actors store data in State Manager and are deactivated but never re-activated, it may be necessary to clean up their data.  For examples of how to delete actors, read [delete actors and their state](service-fabric-reliable-actors-delete-actors.md).

## Next steps
* [Actor timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
* [Actor events](service-fabric-reliable-actors-events.md)
* [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
* [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
* [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
* [C# Sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java Sample code](http://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-lifecycle/garbage-collection.png
