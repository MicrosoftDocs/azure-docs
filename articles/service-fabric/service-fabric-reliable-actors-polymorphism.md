<properties
   pageTitle="Polymorphism in the Reliable Actor Framework | Microsoft Azure"
   description="This article describes how you can implement hierarchical types and interfaces with the Reliable Actor framework."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/14/2015"
   ms.author="seanmck"/>

# Polymorphism in the Reliable Actor framework

The Reliable Actor framework simplifies distributed systems programming by allowing you to build your service using many of the same techniques that you would use in object-oriented design. One of those techniques in polymporphism, allowing types and interfaces to inherit from more generalized parents. Inheritance in the actor framework generally follows the .NET model with a few additional constraints.

## Interfaces

The actor framework requires you to define at least one interface to be implemented by your actor type. This interface is used to generate a proxy class that can be used by clients to communicate with your actors. Interfaces can inherit from other interfaces as long as every interface implemented by an actor type and all of its parents ultimately derive from IActor, the platform-defined base interface for actors. Thus, the classic polymorphism example using shapes might look something like this:

![Interface hierarchy for shape actors][shapes-interface-hierarchy]

## Types



## Next steps

<!-- Image references -->

[shapes-interface-hierarchy]: ./media/service-fabric-reliable-actors-polymorphism/Shapes-Interface-Hierarchy.png
