<properties
   pageTitle="Some Azure Service Fabric Actors antipatterns | Microsoft Azure"
   description="Some potential pitfalls for customers who are learning Azure Service Fabric Actors"
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
   ms.date="08/11/2015"
   ms.author="vturecek"/>

# Reliable Actors design pattern: Some antipatterns

We've identified the following potential pitfalls for customers who are learning Azure Service Fabric Reliable Actors:

* Treat Reliable Actors as a transactional system. Service Fabric Reliable Actors isn't a two-phase, commit-based system that offers atomicity, consistency, isolation, and durability (ACID). If you don't implement the optional persistence, and the machine where the actor is running dies, its current state will die with it. The actor will come up on another node very quickly, but unless you have implemented the backing persistence, the state will be gone. However, by leveraging retries, duplicate filtering, and/or idempotent design, you can still achieve a high level of reliability and consistency.

* Block. Everything you do in Reliable Actors should be asynchronous. This is usually easy, because asynchronous APIs are prolific now in the Microsoft platform. But if you have to interact with a system that provides only a blocking API, you need to put that in a wrapper that explicitly uses the .NET thread pool.

* Overarchitect and let the environment work. It can be hard for developers who are accustomed to worrying about concurrent collections and locks, or using tools to compile objects from XML, to just code a class that does simple things, such as assigning a value to a variable or scheduling work. Scheduled tasks are built in, and locks aren't needed. State is not a mortal enemy. For developers who have done a lot of server-side work in large-scale environments, this can take some getting used to.

* Make a single actor the bottleneck. It's easy to become trapped with this one by having millions of actors funnel into a single instance of another actor. Use the aggregation approach that we demonstrate in the [distributed computation design pattern](service-fabric-reliable-actors-pattern-distributed-computation.md).

* Map entity models blindly. This is for developers who are coming from a relational universe, where problems are modeled using entities and their relationships. While this approach is still useful for understanding the subject domain, it should be coupled with service-oriented thinking and blended with the behavior.
