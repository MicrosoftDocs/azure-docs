<properties
   pageTitle="Reliable Actors patterns and antipatterns | Microsoft Azure"
   description="Provides an overview of the actor programming model, design patterns that work well with Service Fabric Reliable Actors, and some antipatterns to avoid."
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

# Introduction to Reliable Actors design patterns

Azure Service Fabric's Reliable Actors programming model is a platform built on the actor model to solve real-world problems at cloud scale. Service Fabric is a platform for building highly reliable, scalable applications that are easy to develop and manage both for the cloud and on-premises.

This article is intended to be a practical discussion about practical problems. After reading through the various patterns, you should understand how you can use the Reliable Actors model to build enterprise and cloud solutions.

## Patterns

In this section, we will list a set of patterns and associated scenarios we established in engagements with customers.
These patterns represent classes of problems that are applicable to a wide range of solutions our customers are building on Microsoft Azure. While the scenarios are based on real cases, we have stripped out most of the domain-specific concerns to make the patterns clearer. You may find that much of the sample code is simple or obvious. We have included the code for the sake of completeness and not because it’s particularly clever or impressive.

The patterns presented here are not intended to be comprehensive or canonical. Some developers might solve the same problem or pattern in a different way than the ones we present.

[Pattern: Smart cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

### Actors, a brief history

The [paper](http://dl.acm.org/citation.cfm?id=1624804) by Carl Hewitt and his coauthors that originated the actor model was published in 1973. But only comparatively recently has the actor model gained attention as a means of dealing with concurrency and complexity in distributed systems.

The actor model supports fine-grained individual objects--actors--that are isolated from each other. They communicate via asynchronous message passing, which enables direct communication among actors. An actor executes by using single-thread semantics. Coupled with encapsulation of the actor’s state and isolation from other actors, this approach simplifies writing highly parallel systems. It does so by removing concurrency concerns from an actor’s code. Actors are created dynamically on the pool of available hardware resources.

[Erlang](http://www.erlang.org/)  is the most popular implementation of the actor model. Developers have started rediscovering the actor model, which has stimulated renewed interest in Erlang and the creation of new Erlang-like solutions, such as [Scala](http://www.scala-lang.org/) actors, [Akka](http://akka.io), [Akka.NET](http://getakka.net/), and [DCell](http://research.microsoft.com/pubs/75988/dcell.pdf).

## Benefits of Service Fabric Reliable Actors

The Reliable Actors programming model is an implementation of the actor model that borrows some ideas from Erlang and distributed objects systems. It then adds a layer of actor indirection and exposes the actors in an integrated programming model that leverages the Service Fabric platform.

The main benefits of Reliable Actors are **developer productivity**, even for nonexpert programmers, and **transparent scalability by default** that requires no special efforts from programmers. The Reliable Actors programming model uses a .NET library that runs on top of Service Fabric. It provides tools that make the development of complex distributed applications much easier. These tools also make the resulting applications scalable by design. We expand on each of these benefits below.
The programming model raises the productivity of both expert and nonexpert programmers by providing the following key abstractions, guarantees, and system services:

* **A familiar object-oriented programming (OOP) paradigm**. Actors are .NET classes that implement declared .NET actor interfaces with asynchronous methods and properties. Thus, actors appear to programmers as remote objects whose methods and properties can be directly invoked. This provides programmers with the familiar OOP paradigm by turning method calls into messages, routing them to the right endpoints, invoking the target actor’s methods, and dealing with failures and corner cases in a completely transparent way.

* **Single-threaded execution of actors**. The Reliable Actors runtime guarantees that an actor never executes on more than one thread at a time. Because of this and each actor's isolation from other actors, programmers never face concurrency at the actor level. Programmers never need to use locks or other synchronization mechanisms to control access to shared data. This feature alone makes development of distributed applications tractable for nonexpert programmers.

* **Transparent activation**. The runtime activates an actor as needed, only when there is a message for it to process. This cleanly separates the notion of the logical creation of an actor, which is visible to and controlled by the application code, from the physical activation of the actor in memory, which is transparent to the application. The Reliable Actors approach is similar to virtual memory in that it decides when to “page out” (deactivate) or “page in” (activate) an actor. The application has uninterrupted access to the full “memory space” of logically created actors, whether or not they are in physical memory at any given time. Transparent activation enables dynamic, adaptive load balancing via placement and migration of actors across the pool of hardware resources.

* **Location transparency**. An actor reference (proxy object) that a programmer uses to invoke an actor’s methods or pass them to other components contains only the logical identity of the actor. The translation of the actor’s logical identity to its physical location and the corresponding routing of messages are done transparently by the Reliable Actors runtime. The application code communicates with actors oblivious to their physical location, which may change over time due to failures or resource management. The location of an actor may also change because it is deactivated at the time that it is called.

* **Transparent integration with persistent store**. The Reliable Actors programming model allows for declarative mapping of actors’ in-memory state to a persistent store. It synchronizes updates, transparently guaranteeing that callers receive results only after the persistent state has been successfully updated.

* **High availability, failover support and application lifecycle management**. An actor's state is managed by the platform and replicated so that it can be restored if, for instance, a node in the cluster fails. Service Fabric also manages the application lifecycle and allows for application upgrades with no downtime. The Reliable Actors programming model is designed to guide programmers to success in scaling their applications and services through several orders of magnitude. This is achieved by incorporating proven best practices and patterns, and by providing efficient implementation of lower-level system functionality. Here are some key factors that enable scalability and performance of Service Fabric applications:

  * **Implicit fine-grained partitioning of application state**. By using actors as directly addressable entities, programmers implicitly break down the overall state of their applications. While the Reliable Actors programming model does not prescribe how big or small an actor should be, in most cases it makes sense to have a relative large number of actors--millions or more. Each of these millions of actors represents a natural entity of the application, such as a user account or purchase order. Given that actors are individually addressable and that their physical locations are abstracted away by the runtime, there is enormous flexibility in balancing load and dealing with hot spots. This is done in a transparent and generic way without any thought from application developers.

  * **Adaptive resource management**. Actors make no assumption about the locality of the other actors they interact with. Because of location transparency, the runtime can manage and adjust allocation of available hardware resources in a very dynamic way. It does so by making fine-grained decisions on the placement and migration of actors across the compute cluster in reaction to load and communication patterns, without failing incoming requests. By creating multiple replicas of a particular actor, the runtime can increase the throughput of the actor without making any changes to the application code.

  * **Multiplexed communication**. Actors in Service Fabric have logical endpoints, and messaging between them is multiplexed across a fixed set of all-to-all physical connections (TCP sockets). This allows the runtime to host a very large number (millions) of addressable entities with no OS overhead per actor. In addition, activation and deactivation of an actor does not incur the cost of registering or unregistering a physical endpoint, such as a TCP port or a HTTP URL.

  * **Efficient scheduling**. The Reliable Actors runtime schedules the execution of a large number of single-threaded actors across a custom thread pool by using a thread for each physical processor core. Actor code is written in nonblocking, continuation-based style (a requirement of the programming model), so the application code runs in a very efficient “cooperative” multithreaded manner with no contention. This allows the system to reach high throughput and run at very high CPU utilization (90 percent or more) with great stability. Growth in the number of actors in the system and the load does not lead to additional threads or other OS primitives, which helps the scalability of both individual nodes and the whole system.

  * **Explicit asynchrony**. The Reliable Actors programming model makes the asynchronous nature of a distributed application explicit and guides programmers to write nonblocking asynchronous code. This enables a large degree of distributed parallelism and overall throughput without the explicit use of multithreading.
