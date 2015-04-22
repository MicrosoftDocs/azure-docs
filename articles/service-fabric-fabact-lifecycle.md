<properties
   pageTitle="Azure Service Fabric Actors Lifecycle"
   description="Explains Lifecycle and Garbage Colelction for Azure Service Fabric Actors"
   services="service-fabric"
   documentationCenter=".net"
   authors="myamanbh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2015"
   ms.author="amanbha"/>


#Actor lifecycle and Garbage Collection
An Actor is activated when first call is made to it and its deactivated(Garbage Collected by framework) if it is not used for some period of time. To configure this time period please see section on Actor Garbage Collection below.

What happens on Actor Activation?

- When a call comes for an actor and it is not already active, a new actor is created.
- Its state is loaded (if it is a stateful actor)
- `OnActivateAsync` method (which can be overridden in  actor implementation) is called.
- It is added to an Active Actors table.

What happens on Actor Deactivation?

- When an actor is not used for some period of time, it is removed from the table of Active Actors.
- `OnDeactivateAsync` method (which can be overridden in actor implementation) is called which clears all the timers for the actor.

## Actor Garbage Collection
The framework periodically scans for actors that have not been used for some period of time, and deactivates them. Once they are deactivated they can be garbage collected by CLR.

What counts as “being used” for the purpose of garbage collection?

- Receiving a call.
- `IRemindable.ReceiveReminderAsync` method being invoked (applicable only if the actor uses reminders).

It is worth noting that if the actor uses timers and its timer callback is invoked, it does **not** count as "being used".

Before going into the details of garbage collection, it is important to define the following terms:

- *Scan interval* - This is the interval at which the framework scans its Active Actors table for actors that can be garbage collected. The default value for this is 1 minute.
- *Idle timeout* - This is the amount of time an actor needs to remain unused (idle) before it can be garbage collected. The default value for this is 60 minutes.

Typically you do not need to change these defaults. However, if necessary, these intervals can be changed at an assembly level for all actor types in that assembly or at an actor type level using the `ActorGarbageCollection` attribute. The example below shows the change in the garbage collection intervals for HelloActor.

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

To change default value of `ActorGarbageCollection` attribute at Assembly level, add following snippet to `AssemblyInfo.cs`.

```csharp
[assembly: ActorGarbageCollection(IdleTimeoutInSeconds = 10, ScanIntervalInSeconds = 2)]
```

For each actor in its Active Actors table, the framework keeps track of the amount of time it has been idle (i.e. not used). The framework checks each of the actors every `ScanIntervalInSeconds` to see if it can be garbage collected and collects it if has been idle for `IdleTimeoutInSeconds`.

Any time an actor gets used, its idle time reset to 0. After this, the actor can only be garbage collected if it again remains idle for `IdleTimeoutInSeconds`. Recall that an actor is considered to have been used if either an actor interface method an actor reminder callback is executed. An actor is **not** considered to have been used if its timer callback is executed.

Please note that an Actor will never get garbage collected while it is executing one of its methods, no matter how much time is spent in executing that method. This is quite obvious for actor interface methods and for reminder callbacks, because if either of these is being executed it means that the actor is in use and not idle. Therefore, it cannot be garbage collected. However, for timer callbacks, the implications of this rule are more subtle. When a timer callback runs the actor is not considered to be in use and its idle time is not reset to 0. However, the garbage collection of the actor is deferred until the timer callback has completed execution.
