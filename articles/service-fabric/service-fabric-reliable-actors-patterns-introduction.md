<properties
   pageTitle="Azure Service Fabric Actors introduction to patterns & anti-patterns"
   description="design patterns that work well with Service Fabric Actors"
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

# Introduction to Reliable Actors design patterns
Service Fabric's Reliable Actors programming model is a platform built around the actor model to solve real world problems at cloud scale. Azure Service Fabric is a platform for building highly reliable, scalable applications for both cloud and on premise that are easy to develop and manage.
This article is intended to be a practical paper about practical problems.  after reading through the various patterns, you should be able to understand how you can use the Service Fabric Actor Model to build solutions “enterprise” or “cloud” solutions.

## Patterns
In this section, we will list a set of patterns and associated scenarios we harnessed during our engagements with customers.
These patterns represent classes of problems that are applicable to a wide range of solutions our customers are building on Microsoft Azure.
While the scenarios are based on real cases we have stripped out most of the domain-specific concerns to make the patterns clearer for the reader. You may find that much of the sample code is simple or obvious. We are including that code for the sake of completeness and not because it’s anything particularly clever or impressive.

The patterns presented in this paper are not intended to be comprehensive or canonical — some developers might solve the same problem or pattern a different way than we present.

[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

### Learn more about Actors, a brief history
The [paper](http://dl.acm.org/citation.cfm?id=1624804) by Hewitt et al. that is the origin of the actor model was published in 1973 yet it is only comparatively recently that the actor model has been gaining more attention as a means of dealing with concurrency and complexity in distributed systems.
The actor model supports fine-grain individual objects—actors—that are isolated from each other. They communicate via asynchronous message passing, which enables direct communications between actors. An actor executes with single-thread semantics. Coupled with encapsulation of the actor’s state and isolation from other actors, this simplifies writing highly parallel systems by removing concurrency concerns from the actor’s code. Actors are dynamically created on the pool of available hardware resources.

[Erlang](http://www.erlang.org/)  is the most popular implementation of the actor model. Developers have started rediscovering the actor model, which stimulated renewed interest in Erlang and creation of new Erlang-like solutions: [Scala](http://www.scala-lang.org/) actors, [Akka](http://akka.io), [Akka.net](http://getakka.net/), [DCell](http://research.microsoft.com/pubs/75988/dcell.pdf).

## Brief Look at Azure Service Fabric
Azure Fabric Actors is an implementation of the actor model that borrows some ideas from Erlang and distributed objects systems, adds a layer of actor indirection, and exposes them in an integrated, programming model that leverages the Azure Service Fabric platform.

The main benefits of Azure Fabric Actors are: 1) **developer productivity**, even for non-expert programmers; and 2) **transparent scalability by default** with no special effort from the programmer. Azure Fabric Actors is a.NET library that runs on top of Azure Fabric and tools that make development of complex distributed applications much easier and make the resulting applications scalable by design. We expand on each of these benefits below.
The Azure Fabric Actors programming model raises productivity of both expert and non-expert programmers by providing the following key abstractions, guarantees and system services.

* *Familiar object-oriented programming (OOP) paradigm*. Actors are .NET classes that implement declared .NET actor interfaces with asynchronous methods and properties. Thus actors appear to the programmer as remote objects whose methods/properties can be directly invoked. This provides the programmer the familiar OOP paradigm by turning method calls into messages, routing them to the right endpoints, invoking the target actor’s methods and dealing with failures and corner cases in a completely transparent way.

* *Single-threaded execution of actors.* The Azure Fabric runtime guarantees that an actor never executes on more than one thread at a time. Combined with the isolation from other actors, the programmer never faces concurrency at the actor level, and hence never needs to use locks or other synchronization mechanisms to control access to shared data. This feature alone makes development of distributed applications tractable for non-expert programmers.

* *Transparent activation.* The Azure Fabric runtime activates an actor as-needed, only when there is a message for it to process. This cleanly separates the notion of logical creation of an actor, which is visible to and controlled by application code, and physical activation of the actor in memory, which is transparent to the application. Azure Fabric Actors is similar to virtual memory in that it decides when to “page out” (deactivate) or “page in” (activate) an actor; the application has uninterrupted access to the full “memory space” of logically created actors, whether or not they are in physical memory at any particular point in time. Transparent activation enables dynamic, adaptive load balancing via placement and migration of actors across the pool of hardware resources.

* *Location transparency.* An actor reference (proxy object) that the programmer uses to invoke the actor’s methods or pass to other components only contains the logical identity of the actor. The translation of the actor’s logical identity to its physical location and the corresponding routing of messages are done transparently by the Azure Fabric runtime. Application code communicates with actors oblivious to their physical location, which may change over time due to failures or resource management, or because an actor is deactivated at the time it is called.

* *Transparent integration with persistent store.* Azure Fabric Actors allows for declarative mapping of actors’ in-memory state to persistent store. It synchronizes updates, transparently guaranteeing that callers receive results only after the persistent state has been successfully updated.

* *High Availability, Failover support & Application Lifecycle Management.* Azure Fabric Actors’ state is managed by the platform and replicated in such a way that it can be restored if, for instance, a node in the cluster fails. The Azure Service Fabric also manages the application lifecycle and allows zero-down time application upgrades.  
The Azure Fabric Actors programming model is designed to guide programmers down a path of likely success in scaling their application or service through several orders of magnitude. This is done by incorporating proven best practices and patterns, and providing an efficient implementation of lower level system functionality. Here are some key factors that enable scalability and performance of Azure Fabric applications.

* *Implicit fine grain partitioning of application state.* By using actors as directly addressable entities, programmers implicitly breaks down the overall state of their applications. While the Azure Fabric Actors programming model does not prescribe how big or small an actor should be, in most cases it makes sense to have a relative large number of actors – millions or more – with each representing a natural entity of the application, such as a user account, a purchase order, etc. With actors being individually addressable and their physical location abstracted away by the runtime, Azure Fabric Actors has enormous flexibility in balancing load and dealing with hot spots in a transparent and generic way without any thought from the application developer.

* *Adaptive resource management.* With actors making no assumption about locality of other actors they interact with and because of the location transparency, the Azure Fabric runtime can manage and adjust allocation of available HW resources in a very dynamic way by making fine grain decisions on placement/migration of actors across the compute cluster in reaction to load and communication patterns without failing incoming requests. By creating multiple replicas of a particular actor the runtime can increase throughput of the actor if necessary without making any changes to the application code.

* *Multiplexed communication.* Actors in Azure Fabric have logical endpoints, and messaging between them is multiplexed across a fixed set of all-to-all physical connections (TCP sockets). This allows the Azure Fabric Actors runtime to host a very large number (millions) of addressable entities with zero OS overhead per actor. In addition, activation/deactivation of an actor does not incur the cost of registering/unregistering a physical endpoint, such as a TCP port or a HTTP URL.

* *Efficient scheduling.* The Azure Fabric runtime schedules execution of a large number of single-threaded actors across a custom thread pool with a thread per physical processor core. With actor code written in the non-blocking continuation-based style (a requirement of the Azure Fabric Actors programming model) application code runs in a very efficient “cooperative” multi-threaded manner with no contention. This allows the system to reach high throughput and run at very high CPU utilization (up to 90 + %) with great stability. The fact that a growth in the number of actors in the system and the load does not lead to additional threads or other OS primitives helps scalability of individual nodes and the whole system.

* *Explicit asynchrony.* The Azure Fabric Actors programming model makes the asynchronous nature of a distributed application explicit and guides programmers to write non-blocking asynchronous code. This enables a large degree of distributed parallelism and overall throughput without the explicit use of multi-threading.
