<properties
   pageTitle="Develop a Service Fabric service | Microsoft Azure"
   description="Conceptual information and tutorials that help you understand how to develop a Service Fabric service using the Reliable Actor or Reliable Services programming model."
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
   ms.date="09/25/2015"
   ms.author="ryanwi"/>

# Develop a Service Fabric service
This page has links to overviews, conceptual articles, and tutorials to help you learn how to develop an Azure Service Fabric service. Service Fabric offers two high-level programming models for building services: the Reliable Actors API and the Reliable Services API. Both are built on the same Service Fabric core, but they make different trade-offs between simplicity and flexibility in terms of concurrency, partitioning, and communication. It is useful to understand both models, so that you can choose the appropriate framework for a particular service within your application.

- [Choose a programming model](service-fabric-choose-framework.md)
- [Introduction to the Service Fabric Reliable Actors model](service-fabric-reliable-actors-introduction.md)
- [Reliable Services programming model introduction](../service-fabric/service-fabric-reliable-services-introduction.md)

## Reliable Actors programming model
 The Reliable Actors API provides an asynchronous, single-threaded Actor model. The Actors represent the units of state and computation that are distributed throughout the cluster to achieve high scalability. The Reliable Actors model leverages the distributed store provided by the underlying Service Fabric platform to provide highly available and consistent state management for application developers. To learn more, read:

- [Get started with Reliable Actors](service-fabric-reliable-actors-get-started.md)
- [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
- [How Reliable Actors use the Service Fabric platform](service-fabric-reliable-actors-platform.md)
- [Notes on Service Fabric Reliable Actors type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)
- [Node.js and Reliable Actors](service-fabric-node-and-reliable-actors-an-winning-combination.md)

Communicating with Actors is described in:

- [Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md#actor-communication)
- [Communicating with services](service-fabric-connect-and-communicate-with-services.md)

These articles discuss useful design patterns and scenarios:

- [Reliable Actors design patterns](service-fabric-reliable-actors-patterns-introduction.md)  
- [Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smart-cache.md)
- [Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)
- [Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)
- [Pattern: Stateful service composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)
- [Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)
- [Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)
- [Some anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

A simple, turn-based concurrency is provided for Reliable Actors methods. Concurrency, timers and reminders, and reentrancy are described in these articles:

- [Concurrency](service-fabric-reliable-actors-introduction.md#concurrency)
- [Events and performance counters related to concurrency](service-fabric-reliable-actors-diagnostics.md)
- [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
- [Actor timers](service-fabric-reliable-actors-timers-reminders.md)

Information on configuring Reliable Actors is found here:

- [KVSActorStateProvider configuration](../service-fabric/service-fabric-reliable-actors-kvsactorstateprovider-configuration.md)  
- [Configuring Reliable Actors--ReliableDictionaryActorStateProvider](../service-fabric/service-fabric-reliable-actors-reliabledictionarystateprovider-configuration.md)

Reliable Actors emit events and performance counters, which can be used to diagnose and monitor your service:

- [Actor diagnostics](service-fabric-reliable-actors-diagnostics.md)
- [Actor events](service-fabric-reliable-actors-events.md)


## Reliable Services programming model
The Reliable Services API gives you a simple, powerful, top-level programming model to help you express what is important to your application. To learn more, read:

- [Get started with Reliable Services](service-fabric-reliable-services-quick-start.md)
- [Architecture](service-fabric-reliable-services-platform-architecture.md)
- [Reliable Collections](service-fabric-reliable-services-reliable-collections.md)
- [Configuring stateful Reliable Services](../service-fabric/service-fabric-reliable-services-configuration.md)
- [Serialization](../service-fabric/service-fabric-reliable-services-serialization.md)
- [Reliable Services programming model advanced usage](../Service-Fabric/service-fabric-reliable-services-advanced-usage.md)

Reliable Services communication and the abstractions that clients can use to discover and communicate with the service endpoints are described in the following:

- [Communicating with services](service-fabric-connect-and-communicate-with-services.md)
- [Reliable Services communication model](service-fabric-reliable-services-communication.md)
- [Default communication stack provided by the Reliable Services framework](service-fabric-reliable-services-communication-remoting.md)
- [WCF-based communication stack for Reliable Services](service-fabric-reliable-services-communication-wcf.md)
- [Get started with Service Fabric Web API services with OWIN self-host](service-fabric-reliable-services-communication-webapi.md)

Reliable Services emit events and performance counters, which can be used to diagnose and monitor your service:

- [Stateful Reliable Services diagnostics](service-fabric-reliable-services-diagnostics.md)
