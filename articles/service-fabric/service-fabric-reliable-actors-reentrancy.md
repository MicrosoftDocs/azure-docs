---
title: Reentrancy in Azure Service Fabric actors | Microsoft Docs
description: Introduction to reentrancy for Service Fabric Reliable Actors.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: amanbha

ms.assetid: be23464a-0eea-4eca-ae5a-2e1b650d365e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: vturecek

---
# Reliable Actors reentrancy
The Reliable Actors runtime, by default, allows logical call context-based reentrancy. This allows for actors to be reentrant if they are in the same call context chain. For example, Actor A sends a message to Actor B, who sends a message to Actor C. As part of the message processing, if Actor C calls Actor A, the message is reentrant, so it will be allowed. Any other messages that are part of a different call context will be blocked on Actor A until it finishes processing.

There are two options available for actor reentrancy defined in the `ActorReentrancyMode` enum:

* `LogicalCallContext` (default behavior)
* `Disallowed` - disables reentrancy

```csharp
public enum ActorReentrancyMode
{
    LogicalCallContext = 1,
    Disallowed = 2
}
```
```Java
public enum ActorReentrancyMode
{
    LogicalCallContext(1),
    Disallowed(2)
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
```Java
static class Program
{
    static void Main()
    {
        try
        {
            ActorConcurrencySettings actorConcurrencySettings = new ActorConcurrencySettings();
            actorConcurrencySettings.setReentrancyMode(ActorReentrancyMode.Disallowed);

            ActorServiceSettings actorServiceSettings = new ActorServiceSettings();
            actorServiceSettings.setActorConcurrencySettings(actorConcurrencySettings);

            ActorRuntime.registerActorAsync(
                Actor1.getClass(),
                (context, actorType) -> new FabricActorService(
                    context,
                    actorType, () -> new Actor1(),
                    null,
                    stateProvider,
                    actorServiceSettings, timeout);

            Thread.sleep(Long.MAX_VALUE);
        }
        catch (Exception e)
        {
            throw e;
        }
    }
}
```


## Next steps
* Learn more about reentrancy in the [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
