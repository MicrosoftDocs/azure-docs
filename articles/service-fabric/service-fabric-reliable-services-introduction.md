---
title: Overview of the Reliable Service programming model 
description: Learn about Service Fabric's Reliable Service programming model, and get started writing your own services.
author: masnider
ms.topic: conceptual
ms.date: 3/9/2018
ms.author: masnider
ms.custom: sfrev
---
# Reliable Services overview

Azure Service Fabric simplifies writing and managing stateless and stateful services. This topic covers:

* The Reliable Services programming model for stateless and stateful services.
* The choices you have to make when writing a Reliable Service.
* Some scenarios and examples of when to use Reliable Services and how they are written.

*Reliable Services* is one of the programming models available on Service Fabric. Another is the *Reliable Actor* programming model, which provides a [Virtual Actor](https://research.microsoft.com/en-us/projects/orleans/) application framework on top of the Reliable Services model. For more information on Reliable Actors, see [Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md).

Service Fabric manages the lifetime of services, from provisioning and deployment through upgrade and deletion, via [Service Fabric application management](service-fabric-deploy-remove-applications.md).

## What are Reliable Services

Reliable Services gives you a simple, powerful, top-level programming model to help you express what is important to your application. With the Reliable Services programming model, you get:

* Access to Service Fabric APIs. Unlike Service Fabric services modeled as [Guest Executables](service-fabric-guest-executables-introduction.md), Reliable Services can use Service Fabric APIs directly. This allows services to:
  * Query the system
  * Report health about entities in the cluster
  * Receive notifications about configuration and code changes
  * Find and communicate with other services,
  * Use the [Reliable Collections](service-fabric-reliable-services-reliable-collections.md)
  * Access many other capabilities, all from a first-class programming model in several programming languages.
* A simple model for running your own code that feels like other familiar programming models. Your code has a well-defined entry point and easily managed lifecycle.
* A pluggable communication model. Use the transport of your choice, such as HTTP with [Web API](service-fabric-reliable-services-communication-webapi.md), WebSockets, custom TCP protocols, or anything else. Reliable Services provide some great out-of-the-box options you can use, or you can provide your own.
* For stateful services, the Reliable Services programming model allows you to consistently and reliably store your state right inside your service by using [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). Reliable Collections are a simple set of highly available and reliable collection classes that will be familiar to anyone who has used C# collections. Traditionally, services needed external systems for Reliable state management. With Reliable Collections, you can store your state next to your compute with the same high availability and reliability you've come to expect from highly available external stores. This model also improves latency because you are co-locating the compute and state it needs to function.

## What makes Reliable Services different

Reliable Services are different from services you may have written before, because Service Fabric provides:

* **Reliability** - Your service stays up even in unreliable environments where your machines fail or hit network issues, or in cases where the services themselves encounter errors and crash or fail. For stateful services, your state is preserved even in the presence of network or other failures.
* **Availability** - Your service is reachable and responsive. Service Fabric maintains your desired number of running copies.
* **Scalability** - Services are decoupled from specific hardware, and they can grow or shrink as necessary through the addition or removal of hardware or other resources. Services are easily partitioned (especially in the stateful case) to ensure that the service can scale and handle partial failures. Services can be created and deleted dynamically via code, enabling more instances to be spun up as necessary, for example in response to customer requests. Finally, Service Fabric encourages services to be lightweight. Service Fabric allows thousands of services to be provisioned within a single process, rather than requiring or dedicating entire OS instances or processes to a single instance of a service.
* **Consistency** - Any information stored in a Reliable Service can be guaranteed to be consistent. This is true even across multiple Reliable Collections within a service. Changes across collections within a service can be made in a transactionally atomic manner.

## Service lifecycle

Whether your service is stateful or stateless, Reliable Services provide a simple lifecycle that lets you quickly plug in your code and get started.  Getting a new service up and running requires you to implement two methods:

* **CreateServiceReplicaListeners/CreateServiceInstanceListeners** - This method is where the service defines the communication stack(s) that it wants to use. The communication stack, such as [Web API](service-fabric-reliable-services-communication-webapi.md), is what defines the listening endpoint or endpoints for the service (how clients reach the service). It also defines how the messages that appear interact with the rest of the service code.
* **RunAsync** - This method is where your service runs its business logic, and where it would kick off any background tasks that should run for the lifetime of the service. The cancellation token that is provided is a signal for when that work should stop. For example, if the service needs to pull messages out of a Reliable Queue and process them, this is where that work happens.

If you're learning about reliable services for the first time, read on! If you're looking for a detailed walkthrough of the lifecycle of reliable services, check out [Reliable Services lifecycle overview](service-fabric-reliable-services-lifecycle.md).

## Example services

Let's take a closer look how the Reliable Services model works with both stateless and stateful services.

### Stateless Reliable Services

A *stateless service* is one where there is no state maintained within the service across calls. Any state that is present is entirely disposable and doesn't require synchronization, replication, persistence, or high availability.

For example, consider a calculator that has no memory and receives all terms and operations to perform at once.

In this case, the `RunAsync()` (C#) or `runAsync()` (Java) of the service can be empty, since there is no background task-processing that the service needs to do. When the calculator service is created, it returns an `ICommunicationListener` (C#) or `CommunicationListener` (Java) (for example [Web API](service-fabric-reliable-services-communication-webapi.md)) that opens up a listening endpoint on some port. This listening endpoint hooks up to the different calculation methods (example: "Add(n1, n2)") that define the calculator's public API.

When a call is made from a client, the appropriate method is invoked, and the calculator service performs the operations on the data provided and returns the result. It doesn't store any state.

Not storing any internal state makes this example calculator simple. But most services aren't truly stateless. Instead, they externalize their state to some other store. (For example, any web app that relies on keeping session state in a backing store or cache is not stateless.)

A common example of how stateless services are used in Service Fabric is as a front-end that exposes the public-facing API for a web application. The front-end service then talks to stateful services to complete a user request. In this case, calls from clients are directed to a known port, such as 80, where the stateless service is listening. This stateless service receives the call and determines whether the call is from a trusted party and which service it's destined for.  Then, the stateless service forwards the call to the correct partition of the stateful service and waits for a response. When the stateless service receives a response, it replies to the original client. An example of such a service is the *Service Fabric Getting Started* sample ([C#](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started) / [Java](https://github.com/Azure-Samples/service-fabric-java-getting-started)), among other Service Fabric samples in that repo.

### Stateful Reliable Services

A *stateful service* is one that must have some portion of state kept consistent and present in order for the service to function. Consider a service that constantly computes a rolling average of some value based on updates it receives. To do this, it must have the current set of incoming requests it needs to process and the current average. Any service that retrieves, processes, and stores information in an external store (such as an Azure blob or table store today) is stateful. It just keeps its state in the external state store.

Most services today store their state externally, since the external store is what provides reliability, availability, scalability, and consistency for that state. In Service Fabric, services aren't required to store their state externally. Service Fabric takes care of these requirements for both the service code and the service state.

Let's say we want to write a service that processes images. To do this, the service takes in an image and the series of conversions to perform on that image. This service returns a communication listener (let's suppose it's a WebAPI) that exposes an API like `ConvertImage(Image i, IList<Conversion> conversions)`. When it receives a request, the service stores it in a `IReliableQueue`, and returns some ID to the client so it can track the request.

In this service, `RunAsync()` could be more complex. The service has a loop inside its `RunAsync()` that pulls requests out of `IReliableQueue` and performs the conversions requested. The results get stored in an `IReliableDictionary` so that when the client comes back they can get their converted images. To ensure that even if something fails the image isn't lost, this Reliable Service would pull out of the queue, perform the conversions, and store the result all in a single transaction. In this case, the message is removed from the queue and the results are stored in the result dictionary only when the conversions are complete. Alternatively, the service could pull the image out of the queue and immediately store it in a remote store. This reduces the amount of state the service has to manage, but increases complexity since the service has to keep the necessary metadata to manage the remote store. With either approach, if something failed in the middle the request remains in the queue waiting to be processed.

Although this service sounds like a typical .NET service, the difference is that the data structures being used (`IReliableQueue` and `IReliableDictionary`) are provided by Service Fabric, and are highly reliable, available, and consistent.

## When to use Reliable Services APIs

Consider Reliable Services APIs if:

* You want your service's code (and optionally state) to be highly available and reliable.
* You need transactional guarantees across multiple units of state (for example, orders and order line items).
* Your application’s state can be naturally modeled as Reliable Dictionaries and Queues.
* Your applications code or state needs to be highly available with low latency reads and writes.
* Your application needs to control the concurrency or granularity of transacted operations across one or more Reliable Collections.
* You want to manage the communications or control the partitioning scheme for your service.
* Your code needs a free-threaded runtime environment.
* Your application needs to dynamically create or destroy Reliable Dictionaries or Queues or whole Services at runtime.
* You need to programmatically control Service Fabric-provided backup and restore features for your service’s state.
* Your application needs to maintain change history for its units of state.
* You want to develop or consume third-party-developed, custom state providers.

## Next steps

* [Reliable Services quickstart](service-fabric-reliable-services-quick-start.md)
* [Reliable collections](service-fabric-reliable-services-reliable-collections.md)
* [The Reliable Actors programming model](service-fabric-reliable-actors-introduction.md)
