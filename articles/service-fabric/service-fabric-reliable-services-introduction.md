<properties
   pageTitle="Overview of the Service Fabric reliable service programming model | Microsoft Azure"
   description="Learn about Service Fabric's reliable service programming model, and get started writing your own services."
   services="Service-Fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor="jessebenson; mani-ramaswamy"/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/17/2015"
   ms.author="masnider;jesseb"/>

# Reliable services overview
Azure Service Fabric simplifies writing and managing reliable stateless and stateful services. This document will talk about:

1. The reliable services programming model for stateless and stateful services.
2. The choices you have to make when writing a reliable service.
3. Some scenarios and examples of when to use reliable services and how they are written.

Reliable services is one of the programming models available on Service Fabric. For more information on the reliable actors programming model, see [Introduction to Service Fabric reliable actors](service-fabric-reliable-actors-introduction.md).

In Service Fabric, a service is composed of configuration, application code, and (optionally) state.

Service Fabric manages the lifetime of services, from provisioning and deployment through upgrade and deletion, via [Service Fabric application management](service-fabric-deploy-remove-applications.md).

## What are reliable services?
Reliable services gives you a simple, powerful, top-level programming model to help you express what is important to your application. With the reliable services programming model, you get:

1. For stateful services, the reliable services programming model allows you to consistently and reliably store your state right inside your service by using reliable collections. This is a simple set of highly available collection classes that will be familiar to anyone who has used C# collections. Traditionally, services needed external systems for reliable state management. With reliable collections, you can store your state next to your compute with the same high availability and reliability you've come to expect from highly available external stores, and with the additional latency improvements that co-locating the compute and state provide.

2. A simple model for running your own code that looks like programming models you are used to. Your code has a well-defined entry point and easily managed lifecycle.

3. A pluggable communication model. Use the transport of your choice, such as HTTP with [Web API](service-fabric-reliable-services-communication-webapi.md), WebSockets, custom TCP protocols, etc. Reliable services provide some great out-of-the-box options you can use, or you can provide your own.

## What makes reliable services different?
Reliable services in Service Fabric is different from services you may have written before. Service Fabric provides reliability, availability, consistency, and scalability.  

+ **Reliability**--Your service will stay up even in unreliable environments where your machines may fail or hit network issues.

+ **Availability**--Your service will be reachable and responsive. (This doesn't mean that you can't have services that can't be found or reached from outside.)

+ **Scalability**--Services are decoupled from specific hardware, and they can grow or shrink as necessary through the addition or removal of hardware or virtual resources. Services are easily partitioned (especially in the stateful case) to ensure that independent portions of the service can scale and respond to failures independently. Finally, Service Fabric encourages services to be lightweight by allowing thousands of services to be provisioned within a single process, rather than requiring or dedicating entire OS instances to a single instance of a particular workload.

+ **Consistency**--Any information stored in this service can be guaranteed to be consistent (this applies only to stateful services - more on this later)

## Service lifecycle
Whether your service is stateful or stateless, reliable services provide a simple lifecycle that lets you quickly plug in your code and get started.  There are just one or two methods that you need to implement to get your service up and running.

+ **CreateServiceReplicaListeners/CreateServiceInstanceListeners** - This is where the service defines the communication stack that it wants to use. The communication stack, such as [Web API](service-fabric-reliable-services-communication-webapi.md), is what defines the listening endpoint or endpoints for the service (how clients will reach it). It also defines how the messages that appear end up interacting with the rest of the service code.

+ **RunAsync** - This is where your service runs its business logic. The cancellation token that is provided is a signal for when that work should stop. For example, if you have a service that needs to constantly pull messages out of a reliable queue and process them, this is where that work would happen.

The major events in the lifecycle of a reliable service are:

1. The service object (the thing that derives from the stateless service or stateful service) is constructed.

2. The CreateServiceReplicaListeners/CreateServiceInstanceListeners method is called, giving the service a chance to return one or more communication listeners of its choice.
  + Note that this is optional, although most services will expose some endpoint directly.

3. Once the communication listeners are created, it is opened.
  + Communication listeners have a method called OpenAsync(), which is called at this point and which returns the listening address for the service. If your reliable service uses one of the built-in ICommunicationListeners, this is handled for you.

4. Once the communication listener is open, the RunAsync() method on the main service is called.
  + Note that RunAsync is optional. If the service does all its work directly in response to user calls only, there is no need for it to implement RunAsync().

When the service is being shut down (when it's deleted, upgraded, or just being moved from a particular location) the call order is the same: First, CloseAsync() is called on the communication listeners, then the cancellation token that was passed to RunAsync() is canceled.

## Example services
Knowing this programming model, let's take a quick look at two different services to see how these pieces fit together.

### Stateless reliable services
A stateless service is one where there is literally no state maintained within the service, or the state that is present is entirely disposable and doesn't require synchronization, replication, persistence, or high availability.

For example, consider a calculator that has no memory and receives all terms and operations to perform at once.

In this case, the RunAsync() of the service can be empty, since there is no background task-processing that the service needs to do. When the calculator service is created, it will return an ICommunicationListener (for example [Web API](service-fabric-reliable-services-communication-webapi.md)) that opens up a listening endpoint on some port. This listening endpoint will hook up to the different methods (example: "Add(n1, n2)") that define the calculator's public API.

When a call is made from a client, the appropriate method is invoked, and the calculator service performs the operations on the data provided and returns the result. It doesn't store any state.

Not storing any internal state makes this example calculator very simple. But most services aren't truly stateless. Instead, they externalize their state to some other store. (For example, any web app that relies on keeping session state in a backing store or cache is not completely stateless.)

A common example of how stateless services are used in Service Fabric is as a front-end that exposes the public-facing API for a web application. The front-end service then talks to stateful services to complete a user request. In this case, calls from clients are directed to a known port, such as 80, where the stateless service is listening. This stateless service receives the call and determines whether the call is from a trusted party, as well as which service it's destined for.  Then, the stateless service forwards the call to the correct partition of the stateful service and waits for a response. When the stateless service receives a response, it replies back to the original client.

### Stateful reliable services
A stateful service is one that must have some portion of state kept consistent and present in order for the service to function. Consider a service that constantly computes a rolling average of some value based on updates it receives. To do this, it must have the current set of incoming requests it needs to process, as well as the current average. Any service that retrieves, processes, and stores information in an external store (such as an Azure blob or table store today) is stateful. It just keeps its state in the external state store.

Most services today store their state externally, since the external store is what provides reliability, availability, scalability, and consistency for that state. In Service Fabric, stateful services aren't required to store their state externally; Service Fabric takes care of these requirements for both the service code and the service state.

Let's say we want to write a service that takes requests for a series of conversions that need to be performed on an image, and the image that needs to be converted.  For this service, it would return a communication listener (let's suppose Web API) that opens up a communication port and allows submissions via an API like `ConvertImage(Image i, IList<Conversion> conversions)`. In this API, the service could take the information and store the request in a reliable queue, and then return some token to the client so it could keep track of the request (since the requests could take some time).

In this service, RunAsync could be more complex. The service could have a loop inside its RunAsync that pulls requests out of IReliableQueue, performs the conversions listed, and stores the results in IReliableDictionary, so that when the client comes back, they can get their converted images. To ensure that even if something fails the image isn't lost, this reliable service would pull out of the queue, perform the conversions, and store the result in a transaction. In this case, the message is actually removed only from the queue and the results are stored in the result dictionary when the conversions are complete. If something fails in the middle (such as the machine this instance of the code is running on), the request remains in the queue waiting to be processed again.

One thing to note about this service is that it sounds like a normal .NET service. The only difference is that the data structures being used (IReliableQueue and IReliableDictionary) are provided by Service Fabric, and hence are made highly reliable, available, and consistent.

## When to Use reliable services APIs
If any of the following characterize your application service needs, then you should consider reliable services APIs:

- You need to provide application behavior across multiple units of state (e.g., orders and order line items).

- Your application’s state can be naturally modeled as reliable dictionaries and queues.

- Your state needs to be highly available with low latency access.

- Your application needs to control the concurrency or granularity of transacted operations across one or more reliable collections.

- You want to manage the communications or control the partitioning scheme for your service.

- Your code needs a free-threaded runtime environment.

- Your application needs to dynamically create or destroy reliable dictionaries or queues at runtime.

- You need to programmatically control Service Fabric-provided backup and restore features for your service’s state*.

- Your application needs to maintain change history for its units of state*.

- You want to develop or consume third-party-developed, custom state providers*.

> [AZURE.NOTE] *Features available at SDK general availability.


## Next steps
+ [Reliable services quick start](service-fabric-reliable-services-quick-start.md)
+ [Reliable services advanced usage](service-fabric-reliable-services-advanced-usage.md)
+ [The reliable actors programming model](service-fabric-reliable-actors-introduction.md)
