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
An Actor is activated when first call is made to it and its deactivated(Garbage Collected by framework) if it's not used for some period of time. To configure this time period please see section on Actor Garbage Collection below.

What happens on Actor Activation?
- When a call comes for an actor and it's not already active, a new actor is created.
Its state is loaded (if it’s a stateful actor)
- OnActivateAsync method (which can be overridden in  actor implementation) is called.
- Its added to an Active Actors table.

What happens on Actor Deactivation?
- When an actor is not used for some period of time, its removed from the table of Active Actors.
- OnDeactivateAsync method (which can be overridden in  actor implementation) is called which clears all the timers for the actor.

## Actor Garbage Collection
The framework periodically scans for actors that have not been used for some period of time, and deactivates them. Once they are deactivated they can be garbage collected by CLR.

What counts as “being used” for the purpose of garbage collection?

- Receiving a call.
- Activation of a Reminder

By default the framework scans the actors every 60 seconds and collects the actors that are not used for more than 60 minutes. So if an Actor was activated at time T1, framework will scan every 60 seconds to see if Actor can be garbage collected and after T1 + 3600 seconds it will be collected. Now if the Actor gets reused at T1 + 3000 seconds, then framework will wait again for 3600 seconds before collecting it, scanning every 60 seconds. Please note that an Actor will never get garbage collected while it is executing one of its method, no matter how much time is spent in the method call. The idle timeout countdown starts only after the actor is truly idle, i.e. it is not executing any of the actor methods, actor timer callbacks or actor reminder callbacks.

While the actor will not get garbage collected during the execution of the timer callback, the actor timers will not activate the actor nor it can keep the actor alive (keep it from being garbage collected). See the description at the end of the example below.

Typically you do not need to change these settings. These intervals can be changed at an assembly level for all actor types in that assembly or at an actor type level by  ActorGarbageCollection attribute.

The example below shows the change in the garbage collection intervals for HelloActor.  
```csharp
[ActorGarbageCollection(IdleTimeoutInSeconds = 10, ScanIntervalInSeconds = 2)]
class HelloActor : Actor, Ihello
{
    public Task<string> SayHello(string greeting)
    {
        return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
    }
}
```
The framework scans for actors every ScanIntervalInSeconds to see if it can be garbage collected and collects it if it's not being used for IdleTimeoutInSeconds. If Actor gets reused, then idle time for Actor is reset to 0.

In the example above, if an Actor was activated at time T1, framework will scan every 2 seconds to see if Actor can be garbage collected and after T1+10 it will be collected, if the actor does not get reused. Now if the Actor gets reused at T1+3 seconds, then framework will wait again for 10 seconds before collecting it, scanning every 2 seconds.

Note that as mentioned previously, if the actor spends more than 10 seconds inside a method execution, it will not be garbage collected. However while the actor will not get garbage collected during the execution of the timer callback, the actor timers will not activate the actor nor it can keep the actor alive (keep it from being garbage collected). If the HelloActor in the above example had an actor timer that fired every second, after being activated at T1 the actor will get garbage collected at time T1 + 10 seconds, if the actor is not used (actor method call / reminder callback) in that duration.

To change default value of ActorGarbageCollection attribute at Assembly level, add following snippet to AssemblyInfo.cs
```csharp
[assembly: ActorGarbageCollection(IdleTimeoutInSeconds = 10, ScanIntervalInSeconds = 2)]
```
