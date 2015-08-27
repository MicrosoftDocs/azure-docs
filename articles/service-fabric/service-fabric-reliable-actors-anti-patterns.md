<properties
   pageTitle="Some Azure Service Fabric Actors anti-patterns"
   description="Some potential pitfalls for customers who are learning Azure Service Fabric Actors"
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
   ms.date="08/11/2015"
   ms.author="claudioc"/>

# Reliable Actors design pattern: Some anti-patterns

We identified the following potential pitfalls for customers who are learning Service Fabric Reliable Actors:

* Treat Reliable Actors as a transactional system. Service Fabric Reliable Actors is not a two phase commit-based system offering ACID. If we do not implement the optional persistence, and the machine the actor is running on dies, its current state will go with it. The actor will be coming up on another node very fast, but unless we have implemented the backing persistence, the state will be gone. However, between leveraging retries, duplicate filtering, and/or idempotent design, you can achieve a high level of reliability and consistency.

* Block. Everything we do in Reliable Actors should be asynchronous. This is usually easy because async APIs are prolific now in the Microsoft platform. But if, for some reason, we must interact with a system that only provides a blocking API, we are going to need to put that in a wrapper that explicitly uses the .NET Thread Pool.

* Over architect. Let the environment work. It can be hard for developers who are accustomed to worrying about concurrent collections and locks, or using tools to compile objects from XML, to simply just code a class that does simple things like assign a value to a variable or schedule work. Scheduled tasks are built in. Locks are not needed. State is not a mortal enemy. This takes some getting used to for many folks who’ve done a lot of server side work in large scale environments.

* Make a single actor the bottleneck. It is often too easy to be trapped with this one, having millions of actors funnelling into a single instance of another actor. Use the aggregation approach that we demonstrated in the [distributed computation design pattern](service-fabric-reliable-actors-pattern-distributed-computation.md).

* Map entity models blindly. This is for developers who are coming from a relational universe where problems are modelled using entities and their relationships. While this approach is still useful for understanding the subject domain, it should be coupled with service-oriented thinking and blended with the behavior.
