<properties
   pageTitle="Reliable Actors reentrancy | Microsoft Azure"
   description="Introduction to reentrancy for Service Fabric Reliable Actors"
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor="amanbha"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/06/2016"
   ms.author="vturecek"/>


# Reliable Actors reentrancy
The Reliable Actors runtime, by default, allows logical call context-based reentrancy. This allows for actors to be reentrant if they are in the same call context chain. For example, Actor A sends a message to Actor B, who sends a message to Actor C. As part of the message processing, if Actor C calls Actor A, the message is reentrant, so it will be allowed. Any other messages that are part of a different call context will be blocked on Actor A until it finishes processing.


There are two options available for actor reentrancy defined in the `ActorReentrancyMode` enum:

 - `LogicalCallContext` (default behavior)
 - `Disallowed` - disables reentrancy

```csharp
public enum ActorReentrancyMode
{
    LogicalCallContext = 1,
    Disallowed = 2
}
```

Reentrancy can be configured in an `ActorService`'s settings during registration. The setting applies to all actor instances created in the actor service.

The following example shows an actor service that sets the reentrancy mode to `ActorReentrancyMode.Disallowed`. In this case, if an actor sends a reentrant message to another actor, an exception of type `FabricException` will be thrown.

```csharp
static class Program
{
    static void Main()
    {
        try
        {
            ActorRuntime.RegisterActorAsync<Actor1>(
                (context, actorType) => new ActorService(
                    context, 
                    actorType, () => new Actor1(), 
                    settings: new ActorServiceSettings()
                    {
                        ActorConcurrencySettings = new ActorConcurrencySettings()
                        {
                            ReentrancyMode = ActorReentrancyMode.Disallowed
                        }
                    }))
                .GetAwaiter().GetResult();

            Thread.Sleep(Timeout.Infinite);
        }
        catch (Exception e)
        {
            ActorEventSource.Current.ActorHostInitializationFailed(e.ToString());
            throw;
        }
    }
}
```

## Next steps
 - [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
 - [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure/servicefabric-samples)
