<properties
   pageTitle="Reliable Actors lifecycle | Microsoft Azure"
   description="Explains Service Fabric Reliable Actor lifecycle, garbage collection, and manually deleting actors and their state"
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2016"
   ms.author="vturecek"/>


# Actor lifecycle, automatic garbage collection, and manual delete
An actor is activated the first time a call is made to any of its methods. An actor is deactivated (garbage collected by the Actors runtime) if it is not used for a configurable period of time. An actor and its state can also be deleted manually at any time.

## Actor activation

- When a call comes for an actor and one is not already active, a new actor is created.
- The actor's state is loaded (if it is a stateful actor).
- The `OnActivateAsync` method (which can be overridden in the actor implementation) is called.
- The actor is added to an Active Actors table.

## Actor deactivation

- When an actor is not used for some period of time, it is removed from the Active Actors table.
- The `OnDeactivateAsync` method (which can be overridden in the actor implementation) is called. This clears all the timers for the actor.

> [AZURE.TIP] The Fabric Actors runtime emits some [events related to actor activation and deactivation](service-fabric-reliable-actors-diagnostics.md#actor-activation-and-deactivation-events). They are useful in diagnostics and performance monitoring.

## Actor garbage collection
The Actors runtime periodically scans for actors that have not been used for some period of time, and it deactivates them. Once the actors are deactivated, they can be garbage collected by the common language runtime (CLR). Garbage collection only cleans up the actor object; it does **not** remove state stored in the actor's State Manager. 

What counts as “being used” for the purpose of garbage collection?

- Receiving a call
- `IRemindable.ReceiveReminderAsync` method being invoked (applicable only if the actor uses reminders)

It is worth noting that if the actor uses timers and its timer callback is invoked, it does **not** count as "being used".

Before we go into the details of garbage collection, it is important to define the following terms:

- *Scan interval*. This is the interval at which the Actors runtime scans its Active Actors table for actors that can be garbage collected. The default value for this is 1 minute.
- *Idle timeout*. This is the amount of time that an actor needs to remain unused (idle) before it can be garbage collected. The default value for this is 60 minutes.

Typically, you do not need to change these defaults. However, if necessary, these intervals can be changed at an assembly level for all actor types in that assembly or at an actor-type level by using the `ActorGarbageCollection` attribute. The example below shows the change in the garbage collection intervals for HelloActor.

```csharp
[ActorGarbageCollection(IdleTimeoutInSeconds = 10, ScanIntervalInSeconds = 2)]
class HelloActor : Actor, IHello
{
    public Task<string> SayHello(string greeting)
    {
        return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
    }
}
```

To change the default value of the `ActorGarbageCollection` attribute at the assembly level, add following snippet to `AssemblyInfo.cs`.

```csharp
[assembly: ActorGarbageCollection(IdleTimeoutInSeconds = 10, ScanIntervalInSeconds = 2)]
```

For each actor in its Active Actors table, the Actors runtime keeps track of the amount of time that it has been idle (i.e. not used). The Actors runtime checks each of the actors every `ScanIntervalInSeconds` to see if it can be garbage collected and collects it if it has been idle for `IdleTimeoutInSeconds`.

Anytime an actor is used, its idle time is reset to 0. After this, the actor can be garbage collected only if it again remains idle for `IdleTimeoutInSeconds`. Recall that an actor is considered to have been used if either an actor interface method an actor reminder callback is executed. An actor is **not** considered to have been used if its timer callback is executed.

The diagram below contains an example to illustrate these concepts.

![Example of idle time][1]

The example assumes that there is only one active actor in the Active Actors table. The example shows the impact of actor method calls, reminders, and timers on the lifetime of this actor. The following points about the example are worth mentioning:

- ScanInterval and IdleTimeout are set to 5 and 10 respectively. (Units do not matter here, since our purpose is only to illustrate the concept.)
- The scan for actors to be garbage collected happens at T=0,5,10,15,20,25, as defined by the scan interval of 5.
- A periodic timer fires at T=4,8,12,16,20,24, and its callback executes. It does not impact the idle time of the actor.
- An actor method call at T=7 resets the idle time to 0 and delays the garbage collection of the actor.
- An actor reminder callback executes at T=14 and further delays the garbage collection of the actor.
- During the garbage collection scan at T=25, the actor's idle time finally exceeds the idle timeout of 10, and the actor is garbage collected.

Note that an actor will never be garbage collected while it is executing one of its methods, no matter how much time is spent in executing that method. As mentioned earlier, the execution of actor interface methods and reminder callbacks prevents garbage collection by resetting the actor's idle time to 0. The execution of timer callbacks does not reset the idle time to 0. However, the garbage collection of the actor is deferred until the timer callback has completed execution.

## Deleting actors and their state

Gabrage collection of deactivated actors only cleans up the actor object, but it does not remove data that is stored in an actor's State Manager. When an actor is re-activated, its data is again made available to it through the State Manager. In cases where actors store data in State Manager and are deactivated but never re-activated, it may be necessary to clean up their data.

The [Actor Service](service-fabric-reliable-actors-platform.md) provides a function for deleting actors from a remote caller:

```C#
ActorId actorToDelete = new ActorId(id);

IActorService myActorServiceProxy = ActorServiceProxy.Create(
    new Uri("fabric:/MyApp/MyService"), actorToDelete);
            
await myActorServiceProxy.DeleteActorAsync(actorToDelete, cancellationToken)
```

Deleting an actor has the following effects depending on whether or not the actor is currently active:
- **Active Actor:**
 - Actor is removed from active actors list and is deactivated.
 - Its state is deleted permanently.
- **Inactive Actor:**
 - Its state is deleted permanently.

Note that an actor cannot call delete on itself from one of its actor methods because the actor cannot be deleted while executing within an actor call context, in which the runtime has obtained a lock around the actor call to enforce single-threaded access.

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-lifecycle/garbage-collection.png
