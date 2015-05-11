<properties
   pageTitle="Develop a Service Fabric service"
   description="Conceptual information and tutorials that help you understand how to develop a Service Fabric service using the Reliable Actor or Reliable Services programming models."
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/21/2015"
   ms.author="ryanwi"/>

# Develop a Service Fabric service
This page has links to overview and conceptual articles and tutorial to help you learn to develop a Service Fabric service. Service Fabric offers two high-level programming models for building services: the reliable actor APIs and the reliable services APIs. While both are built on the same Service Fabric core, they make different trade-offs between simplicity and flexibility in terms of concurrency, partitioning, and communication. It is useful to understand both models so that you can choose the appropriate framework for a particular service within your application.

- [Choose a Programming Model](service-fabric-choose-framework.md)
- [Introduction to the Service Fabric Actor Model](service-fabric-reliable-actors-introduction.md)
- [Reliable Service Programming Model Introduction](service-fabric-reliable-services-introduction.md)
- [Communicating with services](service-fabric-connect-and-communicate-with-services.md)

## Reliable Actor programming model
 Reliable Actors provide an asynchronous, single-threaded actor model. The actors represent the unit of state and computation that are distributed throughout the cluster to achieve high scalability. Reliable Actor model leverages the distributed store provided by underlying Service Fabric platform to provide highly available and consistent state management for the application developers.  To learn more, read:

- [Get started with Reliable Actors](service-fabric-reliable-actors-get-started.md)
- [Actor lifecycle and Garbage Collection](service-fabric-reliable-actors-lifecycle.md)
- [How Fabric Actors use the Service Fabric platform](service-fabric-reliable-actors-platform.md)
- [Notes on Azure Service Fabric Actors type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)
- [Actor Model Design Patterns](service-fabric-reliable-actors-patterns-introduction.md)  
- [Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smart-cache.md)
- [Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)
- [Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)
- [Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)
- [Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)
- [Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)
- [Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)
- [Actor Events](service-fabric-reliable-actors-events.md)
- [Actor Reentrancy](service-fabric-reliable-actors-reentrancy.md)
- [Actor Timers](service-fabric-reliable-actors-timers-reminders.md)
- [Actor Diagnostics](service-fabric-reliable-actors-diagnostics.md) 
- [KVSActorStateProvider Configuration](service-fabric-reliable-actors-KVSActorstateprovider-configuration.md)  
- [Configuring Reliable Actors - ReliableDictionaryActorStateProvider](service-fabric-reliable-actors-reliabledictionarystateprovider-configuration.md)

## Reliable Service programming model
Reliable Services gives you a simple, powerful, top-level programming model to help you express what is important to your application. To learn more, read:

- [Get started with Relaible Services](service-fabric-reliable-services-quick-start.md)
- [Getting Started with Microsoft Azure Service Fabric Web API services with OWIN self-host (VS 2015 RC)](service-fabric-reliable-services-communication-webapi.md)
- [Reliable Services Programming Model Advanced Usage](service-fabric-reliable-services-advanced-usage.md)
- [Programming Model Overview](service-fabric-reliable-services-service-overview.md)  
- [Architecture](service-fabric-reliable-services-platform-architecture.md)
- [Reliable Collections](service-fabric-reliable-services-reliable-collections.md)
- [Configuring Stateful Reliable Services](service-fabric-reliable-services-configuration.md)
- [Default communication stack provided by Reliable Services Framework](service-fabric-reliable-services-communication-default.md)

