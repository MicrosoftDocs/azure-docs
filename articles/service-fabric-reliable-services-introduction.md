<properties
   pageTitle="Overview of the Service Fabric Reliable Service Programming Model"
   description="Learn about Service Fabric's Reliable Service programming model, and get started writing your own services."
   services="Service-Fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/13/2015"
   ms.author="masnider"/>

# Reliable Services Overview
Service Fabric makes writing reliable stateless and stateful services much easier than before. This guide will talk about:

1. The Reliable Service programming model for stateless and stateful services
2. The different choices you have to make when writing a reliable service
3. Some of the different scenarios and examples of when you would use Reliable Services and how they are written.

Reliable Services are one of the programming models available on top of Service Fabric. Another is the Reliable Actor programming model. For more on Reliable Actors, please check out [this page](../service-fabric-fabact-introduction).

A Service Fabric service is composed of configuration, application code, and optionally state.

Service  Fabric manages the lifetime of services from provisioning and deployment through upgrade and deletion via Service Fabric management [link to management capabilities here](../).

## What Are Reliable Services?
Reliable Services gives you a great, simple, top-level programming model to help you express what is important to your service. With the Reliable Service programming model you get:

1. A pluggable communication model - use the transport of your choice, like HTTP WebAPI, WebSockets, Custom TCP protocols, etc. Reliable Services provides some great out of the box options you can use, or allows you to provide your own.

2. A simplified model for running your own code - compared to lower level Service Fabric extensibility points the Reliable Service model looks like programming models that people are used to: your code has a well defined entry point and easily managed lifecycle.

3. For stateful reliable services, the Reliable Services layer provides simple reliable collections that Reliable Services can use to consistently and reliably manage state that they would otherwise have to constantly access other systems to get.

## What Makes Reliable Services Different?
Reliable Services in Service Fabric are different from services you may have written before because Service Fabric helps to guarantee reliability, availability, consistency, and scalability.  

+ <u>Reliability</u> - this means that your service will stay up, even if bad things are happening in the environment like machines failing or networking issues.

+ <u>Availability</u> - this means that your service will actually be available (you can have up services which can't be found or reached).

+ <u>Scalability</u> – Services are decoupled from specific hardware and can grow or shrink as necessary through the addition or removal of hardware or virtual resources. Services are easily partitioned (especially in the stateful case) in order to ensure that independent portions of the service can scale and respond to failures independently. Finally Service Fabric encourages services to be lightweight by allowing thousands of services to be provisioned within a single process, rather than requiring or dedicating entire OS instances to a single instance of a particular workload.

+ <u>Consistency</u> - this means that any information stored in this service can be guaranteed consistent (this only applies to stateful services - more on this later)

## Service Lifecycle
Whether your service is stateful or stateless, Reliable Services provide a simple lifecycle that let's you quickly plug your code in an get started.  There's really just one or two methods that you need to implement in order to get your service up and running.

+ CreateCommunicationListener - This is where the service defines the communications stack that it wants to use. The communication stack, such as WebAPI, is what defines the listening endpoint(s) for the service (how clients will reach it), as well as how those messages which show up end up interacting with the rest of the service code. For a stateless service, the communication stack usually defines the majority

+ RunAsync - This is where your service can "do work". The cancellation token that is provided is a signal for when that work should stop. For example, if you had as service that needed to constantly pull messages out of a ReliableQueue and process them, this would be where that work happened.

The major events in the lifecycle of a Reliable Service are as follows:
1. The Service Object (the thing that derives from StatelessService or StatefulService) is constructed
2. The CreateCommunicationListener method is called, giving the service a chance to return a communication listener of its choice.
  + Note that this is optional, though most services will expose some endpoint directly.
3. Once the CommunicationListener is created it is opened
  + CommunicationListeners have a method called Open(), which is called at this point and which returns the listeneing address for the service. If your Reliable Service uses one of the built in ICommunicationListeners then this is handled for you.
4. Once the communication listener is Open() the the RunAsync() call on the main service is called.
  + Note that RunAsync is optional - if the service does all its work directly in response to user calls only, then there is no need for it to implement RunAsync().

When the service is being shut down (either when it is deleted or just being moved from a particular location) the call order is the same, first Close() is called on the CommunicationListener, then the cancellation token that was passed to RunAsync() is cancelled.

## Example Services
Knowing this programming model, let's take a quick look at two different services to see how these pieces fit together.

### Stateless Reliable Services
A stateless service is one where there is literally no state maintained within the service, or in cases where the state that is present is entirely disposable and does not require synchronization, replication, persistence, or high availability

For example, consider a Calculator that has no memory, and which receives all terms and the operations to perform at once.

In this case, the RunAsync() of the service would be empty since there is no background task processing that the service needs to do. When the Calculator service was created it would return a CommunicationListener (say WebAPI) which opened up a listening endpoint on some port. This listening endoint would hook up to the different methods (ex: "Add(n1, n2)") which defined the Calculator's public API.

When a call is made from a client, the appropriate method is invoked, and the Calculator service performs the operations on the data provided and returns the result. It does not store any state.

Not storing any internal state makes this example Calculator really simple. However most services are not truly stateless - instead they externalize their state to some other store (for example, any web app that relies on keeping session state in a backing store or cache is not completely stateless).

A common example of how stateless services are used in Service Fabric is as gateways for clients that can't talk to stateful services themselves. In this case, calls from clients are directed to a known port like 80 where the stateless service is listening. This stateless service receives the call and determines if the call is from a trusted party, as well as what service it is destined for.  Then, the stateless service forwards the call to the correct partition of the stateful service, and waits for a response. When it receives a response, it replies back to the original client.

### Stateful Reliable Services
A stateful service is one that must have some portion of state kept consistent and present in order for the service to function. Consider a service which constantly computes a rolling average of some value based on updates it is receiving. In order to do this, it must have both the current set of incoming requests which it needs to process as well as the current average. Any service that retrieves, processes, and stores information in an external store (like Azure Blob or Table store today) is stateful - it just keeps its state in the external state store.

Most services today store their state externally since the external store is what provides reliability, availability, scalability, and consistency for that state. In Service Fabric, stateful services aren't required to store their state externally because Service Fabric takes care of these requirements both for the service code and the service state.

Let's say we wanted to write a service that took requests for a series of conversions that needed to be performed on an image, and the image that needed to be converted.  For this service it would return a CommunicationListener (let's suppose WebAPI) which opens up a communication port and allows submissions via an API like ConvertImage(Image i, IList<Conversion> conversions). In this API the service could take the information and store the request in a ReliableQueue, and then return some token to the client so it could keep track of the request (since the requests could take some time).  

In this service the RunAsync could be more complex: the service would have a loop inside its RunAsync that pulls requests out of the ReliableQueue, performs the conversions listed, and stores the results in a ReliableDictionary so that when the client comes back they can get their converted images. In order to ensure that even if something fails the image isn't lost, this reliable service would pull out of the Queue, perform the conversions, and store the result in a Transaction so that the message only is actually removed from the queue and the results stored in the result dictionary when the conversions are complete. If something fails in the middle (like the machine this instance of the code is running on), the request remains in the queue waiting to be processed again.

One thing to note about this service is that it sounds like a normal .NET service - the only difference is that the datastructures being using (ReliableQueue and ReliableDictionary) are provided by Service Fabric and hence are made highly reliable, available, and consistent.


## Next Steps
+ [Reliable Services Quick Start](../service-fabric-reliable-services-quick-start)
+ [Reliable Services Advanced Usage](../service-fabric-reliable-services-advanced-usage)
+ Check out the basic samples
  + Stateless
  + Stateful
+ Tutorials on Writing Services
  + Stateless
  + Stateful
+ Check out the advanced samples
+ Look at the Reliable Actor programming model
+ API Documentation
