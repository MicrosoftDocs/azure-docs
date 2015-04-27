<properties
   pageTitle="Overview of the Service Fabric Reliable Service Programming Model"
   description="Learn about Service Fabric's Reliable Service programming model, and get started writing your own services."
   services="Service-Fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor="jessebenson"/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/13/2015"
   ms.author="masnider;jesseb"/>

# Reliable Services Overview
Service Fabric simplifies writing and managing reliable stateless and stateful services. This guide will talk about:

1. The Reliable Service programming model for stateless and stateful services
2. The different choices you have to make when writing a reliable service
3. Some of the different scenarios and examples of when you would use Reliable Services and how they are written.

Reliable Services are one of the programming models available on Service Fabric. For more information on the Reliable Actors programming model, check out [the introduction](service-fabric-reliable-actors-introduction.md).

In Service Fabric, a service is composed of configuration, application code, and optionally state.

Service Fabric manages the lifetime of services from provisioning and deployment through upgrade and deletion via [Service Fabric application management](service-fabric-deploy-remove-applications.md).

## What Are Reliable Services?
Reliable Services gives you a simple, powerful, top-level programming model to help you express what is important to your application. With the Reliable Service programming model you get:

1. For stateful services, the Reliable Service programming model allows you to consistently and reliably store your state right inside your service using Reliable Collections: a simple set of highly-available collection classes that will be familiar to anyone who's used C# collections. Traditionally, services needed external systems for reliable state management. With Reliable Collections, you can store your state next to your compute with the same high-availability and reliability you've come to expect from highly-available external stores.

2. A simple model for running your own code that looks like programming models you are used to: your code has a well-defined entry point and easily managed lifecycle.

3. A pluggable communication model - use the transport of your choice, like HTTP WebAPI, WebSockets, custom TCP protocols, etc. Reliable Services provides some great out of the box options you can use, or allows you to provide your own.

## What Makes Reliable Services Different?
Reliable Services in Service Fabric are different from services you may have written before. Service Fabric helps to guarantee reliability, availability, consistency, and scalability.  

+ <u>Reliability</u> - your service will stay up, even if bad things are happening in the environment like machines failing or networking issues.

+ <u>Availability</u> - your service will actually be reachable and responsive (you can have up services which can't be found or reached).

+ <u>Scalability</u> – Services are decoupled from specific hardware and can grow or shrink as necessary through the addition or removal of hardware or virtual resources. Services are easily partitioned (especially in the stateful case) in order to ensure that independent portions of the service can scale and respond to failures independently. Finally Service Fabric encourages services to be lightweight by allowing thousands of services to be provisioned within a single process, rather than requiring or dedicating entire OS instances to a single instance of a particular workload.

+ <u>Consistency</u> - this means that any information stored in this service can be guaranteed consistent (this only applies to stateful services - more on this later)

## Service Lifecycle
Whether your service is stateful or stateless, Reliable Services provide a simple lifecycle that lets you quickly plug your code in and get started.  There's really just one or two methods that you need to implement in order to get your service up and running.

+ CreateCommunicationListener - This is where the service defines the communications stack that it wants to use. The communication stack, such as WebAPI, is what defines the listening endpoint(s) for the service (how clients will reach it), as well as how those messages which show up end up interacting with the rest of the service code.

+ RunAsync - This is where your service can "do work". The cancellation token that is provided is a signal for when that work should stop. For example, if you have a service that needs to constantly pull messages out of a ReliableQueue and process them, this would be where that work would happen.

The major events in the lifecycle of a Reliable Service are as follows:
1. The Service Object (the thing that derives from StatelessService or StatefulService) is constructed.
2. The CreateCommunicationListener method is called, giving the service a chance to return a communication listener of its choice.
  + Note that this is optional, though most services will expose some endpoint directly.
3. Once the CommunicationListener is created it is opened
  + CommunicationListeners have a method called Open(), which is called at this point and which returns the listening address for the service. If your Reliable Service uses one of the built in ICommunicationListeners, then this is handled for you.
4. Once the communication listener is Open(), the RunAsync() call on the main service is called.
  + Note that RunAsync is optional - if the service does all its work directly in response to user calls only, then there is no need for it to implement RunAsync().

When the service is being shut down (either when it is deleted or just being moved from a particular location) the call order is the same, first Close() is called on the CommunicationListener, then the cancellation token that was passed to RunAsync() is cancelled.

## Example Services
Knowing this programming model, let's take a quick look at two different services to see how these pieces fit together.

### Stateless Reliable Services
A stateless service is one where there is literally no state maintained within the service, or the state that is present is entirely disposable and does not require synchronization, replication, persistence, or high availability.

For example, consider a Calculator that has no memory, and which receives all terms and the operations to perform at once.

In this case, the RunAsync() of the service can be empty since there is no background task processing that the service needs to do. When the Calculator service is created it will return a CommunicationListener (for example WebAPI) which opens up a listening endpoint on some port. This listening endoint will hook up to the different methods (ex: "Add(n1, n2)") which define the Calculator's public API.

When a call is made from a client, the appropriate method is invoked, and the Calculator service performs the operations on the data provided and returns the result. It does not store any state.

Not storing any internal state makes this example Calculator really simple. However most services are not truly stateless - instead they externalize their state to some other store (for example, any web app that relies on keeping session state in a backing store or cache is not completely stateless).

A common example of how stateless services are used in Service Fabric is as a front-end that exposes the public-facing API for a web application. The front-end service then talks to stateful services to complete a user's request. In this case, calls from clients are directed to a known port like 80 where the stateless service is listening. This stateless service receives the call and determines if the call is from a trusted party, as well as what service it is destined for.  Then, the stateless service forwards the call to the correct partition of the stateful service, and waits for a response. When it receives a response, it replies back to the original client.

### Stateful Reliable Services
A stateful service is one that must have some portion of state kept consistent and present in order for the service to function. Consider a service which constantly computes a rolling average of some value based on updates it is receiving. In order to do this, it must have both the current set of incoming requests which it needs to process as well as the current average. Any service that retrieves, processes, and stores information in an external store (like Azure Blob or Table store today) is stateful - it just keeps its state in the external state store.

Most services today store their state externally since the external store is what provides reliability, availability, scalability, and consistency for that state. In Service Fabric, stateful services aren't required to store their state externally because Service Fabric takes care of these requirements both for the service code and the service state.

Let's say we wanted to write a service that took requests for a series of conversions that needed to be performed on an image, and the image that needed to be converted.  For this service it would return a CommunicationListener (let's suppose WebAPI) which opens up a communication port and allows submissions via an API like `ConvertImage(Image i, IList<Conversion> conversions)`. In this API the service could take the information and store the request in a ReliableQueue, and then return some token to the client so it could keep track of the request (since the requests could take some time).

In this service the RunAsync could be more complex: the service would have a loop inside its RunAsync that pulls requests out of the ReliableQueue, performs the conversions listed, and stores the results in a ReliableDictionary so that when the client comes back they can get their converted images. In order to ensure that even if something fails the image isn't lost, this reliable service would pull out of the Queue, perform the conversions, and store the result in a Transaction so that the message is only actually removed from the queue and the results stored in the result dictionary when the conversions are complete. If something fails in the middle (like the machine this instance of the code is running on), the request remains in the queue waiting to be processed again.

One thing to note about this service is that it sounds like a normal .NET service - the only difference is that the data structures being used (ReliableQueue and ReliableDictionary) are provided by Service Fabric and hence are made highly reliable, available, and consistent.

## When to Use Reliable Services APIs
If any of the following characterize your application service needs, then the Reliable Services APIs should be considered:

- You need to provide application behavior across multiple units of state (e.g. Orders and Order Line Items)

- Your application’s state can be naturally modelled as reliable dictionaries and queues

- Your state needs to be highly available with low latency access

- Your application needs to control the concurrency or granularity of transacted operations across one or more reliable collections

- You want to manage the communications or control the partitioning scheme for your service

- Your code needs a free-threaded runtime environment

- Your application needs to dynamically create or destroy reliable dictionaries or queues at runtime

- You need to programmatically control Service Fabric provided backup and restore features for your service’s state*

- Your application needs to maintain change history for its units of state*

- You wish to develop, or consume 3rd party developed, custom state providers*

> [AZURE.NOTE] *Above features available at SDK general availabity


## Next Steps
+ [Reliable Services Quick Start](./service-fabric-reliable-services-quick-start.md)
+ [Check out Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)
+ [Read the Reliable Actors programming model](service-fabric-reliable-actors-introduction.md)
