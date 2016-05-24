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
   ms.date="03/25/2016"
   ms.author="vturecek"/>


# Reliable Actors reentrancy
The Reliable Actors runtime, by default, allows logical call context-based reentrancy. This allows for actors to be reentrant if they are in the same call context chain. For example, Actor A sends a message to Actor B, who sends a message to Actor C. As part of the message processing, if Actor C calls Actor A, the message is reentrant, so it will be allowed. Any other messages that are part of a different call context will be blocked on Actor A until it finishes processing.

Actors that want to disallow logical call context-based reentrancy can disable it by decorating the actor class with `ReentrantAttribute(ReentrancyMode.Disallowed)`.

```csharp
public enum ReentrancyMode
{
    LogicalCallContext = 1,
    Disallowed = 2
}
```

The following code shows an actor class that sets the reentrancy mode to `ReentrancyMode.Disallowed`. In this case, if an actor sends a reentrant message to another actor, an exception of type `FabricException` will be thrown.

```csharp
[Reentrant(ReentrancyMode.Disallowed)]
class MyActor : Actor, IMyActor
{
    ...
}
```

## Next steps
 - [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
 - [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure/servicefabric-samples)
