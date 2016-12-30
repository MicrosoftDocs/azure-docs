---
title: Overview of the Service Fabric Reliable Service programming model | Microsoft Docs
description: Learn about Service Fabric's Reliable Service programming model, and get started writing your own services.
services: Service-Fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: vturecek; mani-ramaswamy

ms.assetid: 0c88a533-73f8-4ae1-a939-67d17456ac06
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/30/2016
ms.author: masnider;

---
# Reliable Services overview
Azure Service Fabric simplifies writing and managing stateless and stateful Reliable Services. This document will talk about:

* The Reliable Services programming model for stateless and stateful services.
* The choices you have to make when writing a Reliable Service.
* Some scenarios and examples of when to use Reliable Services and how they are written.

Reliable Services is one of the programming models available on Service Fabric. The other is the Reliable Actor programming model, which provides a virtual Actor programming model on top of the Reliable Services model. For more information on the Reliable Actors programming model, see [Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md).

Service Fabric manages the lifetime of services, from provisioning and deployment through upgrade and deletion, via [Service Fabric application management](service-fabric-deploy-remove-applications.md).

## What are Reliable Services?
Reliable Services gives you a simple, powerful, top-level programming model to help you express what is important to your application. With the Reliable Services programming model, you get:

* Access to the rest of the Service Fabric programming APIs. Unlike Service Fabric Services modeled as [Guest Executables](service-fabric-deploy-existing-app.md), Reliable Services get to use the rest of the Service Fabric APIs directly, letting them query the system, report health about themselves and other entities in the cluster, receive notifications about configuration and code changes, find and communicate with other services, (optionally) make use of the [Reliable Collections](service-fabric-reliable-services-reliable-collections.md), and giving them access to many other capabilities.
* A simple model for running your own code that looks like programming models you are used to. Your code has a well-defined entry point and easily managed lifecycle.
* A pluggable communication model. Use the transport of your choice, such as HTTP with [Web API](service-fabric-reliable-services-communication-webapi.md), WebSockets, custom TCP protocols, or anything else. Reliable Services provide some great out-of-the-box options you can use, or you can provide your own.
* For stateful services, the Reliable Services programming model allows you to consistently and reliably store your state right inside your service by using [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). This is a simple set of highly available collection classes that will be familiar to anyone who has used C# collections. Traditionally, services needed external systems for Reliable state management. With Reliable Collections, you can store your state next to your compute with the same high availability and reliability you've come to expect from highly available external stores, and with the additional latency improvements that co-locating the compute and state provide.

Watch this Microsoft Virtual Academy video for an overview of Reliable services:
<center>
<a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=HhD9566yC_4106218965">
<img src="./media/service-fabric-reliable-services-introduction/ReliableServicesVid.png" WIDTH="360" HEIGHT="244" />
</a>
</center>

## What makes Reliable Services different?
Reliable Services in Service Fabric are different from services you may have written before. Service Fabric provides reliability, availability, consistency, and scalability.

* **Reliability**--Your service will stay up even in unreliable environments where your machines may fail or hit network issues, or in cases where the services themselves encounter errors and crash or fail. For stateful services, your state will be preserved even in the presence of network or other failures.
* **Availability**--Your service will be reachable and responsive as Service Fabric will maintain you desired number of running copies.
* **Scalability**--Services are decoupled from specific hardware, and they can grow or shrink as necessary through the addition or removal of hardware or other resources. Services are easily partitioned (especially in the stateful case) to ensure that the service can scale and handle partial failures. Services can be created and deleted dynamically via code, enabling more instances to be spun up as necessary, say in response to customer requests. Finally, Service Fabric encourages services to be lightweight and allows thousands of services to be provisioned within a single process, rather than requiring or dedicating entire OS instances or processes to a single instance of a particular workload.
* **Consistency**--Any information stored in this service can be guaranteed to be consistent, and changes, even across multiple reliable collections can be made in a transactionally atomic manner (more on this later).

## Service lifecycle
Whether your service is stateful or stateless, Reliable Services provide a simple lifecycle that lets you quickly plug in your code and get started.  There are just one or two methods that you need to implement to get your service up and running.

* **CreateServiceReplicaListeners/CreateServiceInstanceListeners** - This is where the service defines the communication stack that it wants to use. The communication stack, such as [Web API](service-fabric-reliable-services-communication-webapi.md), is what defines the listening endpoint or endpoints for the service (how clients will reach it). It also defines how the messages that appear will interact with the rest of the service code.
* **RunAsync** - This is where your service runs its business logic, and where it would kick off any background tasks that should run for the lifetime of the service. The cancellation token that is provided is a signal for when that work should stop. For example, if you have a service that needs to constantly pull messages out of a Reliable Queue and process them, this is where that work would happen.

> [!NOTE]
> For a detailed walkthrough of the lifecycle of reliable services, you can head over to [this article](service-fabric-reliable-services-lifecycle.md), but you may not need this level of detail at this time. If you're just trying to learn more about reliable services, read on!
>

## Example services
Knowing this programming model, let's take a quick look at two different services to see how these pieces fit together.

### Stateless Reliable Services
A stateless service is one where there is absolutely no state maintained within the service, or the state that is present is entirely disposable and doesn't require synchronization, replication, persistence, or high availability.

For example, consider a calculator that has no memory and receives all terms and operations to perform at once.

In this case, the `RunAsync()` of the service can be empty, since there is no background task-processing that the service needs to do. When the calculator service is created, it will return an `ICommunicationListener` (for example [Web API](service-fabric-reliable-services-communication-webapi.md)) that opens up a listening endpoint on some port. This listening endpoint will hook up to the different calculation methods (example: "Add(n1, n2)") that define the calculator's public API.

When a call is made from a client, the appropriate method is invoked, and the calculator service performs the operations on the data provided and returns the result. It doesn't store any state.

Not storing any internal state makes this example calculator very simple. But most services aren't truly stateless. Instead, they externalize their state to some other store. (For example, any web app that relies on keeping session state in a backing store or cache is not completely stateless.)

A common example of how stateless services are used in Service Fabric is as a front-end that exposes the public-facing API for a web application. The front-end service then talks to stateful services to complete a user request. In this case, calls from clients are directed to a known port, such as 80, where the stateless service is listening. This stateless service receives the call and determines whether the call is from a trusted party, as well as which service it's destined for.  Then, the stateless service forwards the call to the correct partition of the stateful service and waits for a response. When the stateless service receives a response, it replies back to the original client. An example of such a service is in our samples [here](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/tree/master/Services/WordCount/WordCount.WebService). Note that this is only one example of this pattern in the samples, there are others.

### Stateful Reliable Services
A stateful service is one that must have some portion of state kept consistent and present in order for the service to function. Consider a service that constantly computes a rolling average of some value based on updates it receives. To do this, it must have the current set of incoming requests it needs to process, as well as the current average. Any service that retrieves, processes, and stores information in an external store (such as an Azure blob or table store today) is stateful. It just keeps its state in the external state store.

Most services today store their state externally, since the external store is what provides reliability, availability, scalability, and consistency for that state. In Service Fabric, services aren't required to store their state externally; Service Fabric takes care of these requirements for both the service code and the service state.

Let's say we want to write a service that takes requests for a series of conversions that need to be performed on an image, and the image that needs to be converted.  For this service, it would return a communication listener (let's suppose it's a WebAPI) that opens up a communication port and allows submissions via an API like `ConvertImage(Image i, IList<Conversion> conversions)`. In this API, the service could take the information and store the request in a Reliable Queue, and then return some token to the client so it could keep track of the request (since the requests could take some time).

In this service, `RunAsync()` could be more complex. The service could have a loop inside its `RunAsync()` that pulls requests out of `IReliableQueue` performs the conversions listed, and stores the results in `IReliableDictionary`, so that when the client comes back, they can get their converted images. To ensure that even if something fails the image isn't lost, this Reliable Service would pull out of the queue, perform the conversions, and store the result in a transaction. In this case, the message is actually removed only from the queue and the results are stored in the result dictionary when the conversions are complete. Alternatively the service could pull the image out of the queue and immediately store it in a remote store to cut down on the amount of state it had to manage, but it would have to keep some additional metadata to remember where the file was stored and whether it had been successfully uploaded, and also to remove it from the store when it was done. Either way, if something fails in the middle (such as the machine this instance of the code is running on), the request remains in the queue waiting to be processed again.

One thing to note about this service is that it sounds like a normal .NET service! The only difference is that the data structures being used (`IReliableQueue` and `IReliableDictionary`) are provided by Service Fabric, and hence are made highly reliable, available, and consistent.

## When to use Reliable Services APIs
If any of the following characterize your application service needs, then you should consider Reliable Services APIs:

* You want your service's code (and optionally state) to be highly available and reliable
* You need to provide transactional behavior guarantees across multiple units of state (e.g., orders and order line items).
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
* [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
* [Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)
* [The Reliable Actors programming model](service-fabric-reliable-actors-introduction.md)
