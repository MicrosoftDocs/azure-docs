<properties
   pageTitle="Azure Service Fabric Actors Reentrancy"
   description="Introduction to Reentrancy for Azure Service Fabric Actors"
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
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


# Actor Reentrancy
Fabric Actors by default allows logical call context based reentrancy. This allows for actors to be reentrant if they are in the same call context chain. For example if Actor A sends message to Actor B who sends message to Actor C. As part of the message processing if Actor C calls Actor A, the message is reentrant so will be allowed. Any other messages that are part of different call context will be blocked on Actor A till it completes processing.

Actors that want to disallow logical call context based reentrancy can disable it by decorating the actor class with `ReentrantAttribute(ReentrancyMode.Disallowed)`.

```csharp
public enum ReentrancyMode
{
    LogicalCallContext = 1,
    Disallowed = 2
}
```

The following code shows actor class that sets the reentrancy mode to `ReentrancyMode.Disallowed`. In this case if an actor sends a reentrant message to another actor an exception of type `FabricException` will be thrown.

```csharp
[Reentrant(ReentrancyMode.Disallowed)]
class VoicemailBoxActor : Actor<VoicemailBox>, IVoicemailBoxActor
{
    ...
}
```
