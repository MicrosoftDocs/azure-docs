
<properties
   pageTitle="Stateful service composition pattern | Microsoft Azure"
   description="Service Fabric Reliable Actors design pattern that uses stateful actors to maintain state between service calls and to cache previous service results."
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
   ms.date="08/05/2015"
   ms.author="vturecek"/>

# Reliable Actors design pattern: Stateful service composition

Developers have spent the last decade and a half building N-Tier stateless services in the enterprise. They build services on top of databases. They build high order services on top of other services. And they then build orchestration engines and message-oriented middleware to coordinate these services. As user workloads evolve, to address demands for more interactivity or greater scale, stateless service-oriented architecture (SOA) has begun to show weaknesses.

## The old way: SOA services

While SOA services seamlessly scale horizontally, due to their stateless nature, they created bottlenecks in storage tier-concurrency and throughput. This makes it increasingly expensive to access storage. As a common practice, most developers introduce caching to their solution to reduce the demand on storage. This solution isn't without its drawbacks, though. It requires another tier to manage, concurrent access to cache, semantic limitations and changes, and consistency. As detailed [in the smart cache pattern](service-fabric-reliable-actors-pattern-smart-cache.md), the virtual actor model provides a perfect solution to these issues.
Some developers try to solve their SOA problems by replicating the storage tier. This approach doesn’t scale well, though, and it quickly hits Common Alerting Protocol boundaries.

The second challenge has evolved around changing requirements. Both users and businesses demand interactive services that can respond to requests in milliseconds, rather than seconds, as the norm. To meet this demand, developers began building façade services on top of other services. In some cases, dozens of façade services have been built to create user-centric services. But the addition of multiple downstream services quickly creates latency issues.

Developers have also turned to caches and in-memory object stores. In some cases, these have used different implementations to meet performance requirements. In this approach, developers typically build back-end worker processes to build the cache periodically. This minimizes expensive on-demand cache population. They then deconstruct their workloads to isolate asynchronous operations from synchronous ones. This gains more room for interactive operations to react to changes in state, which is particularly hard in SOA.

They often also introduce further tiers, such as queues and workers. These can add even more complexity to their solutions.

Essentially, developers have been looking for solutions to build “stateful services” that collocate “state” and “service behavior” to address user-centric and interactive experiences. This is where the Azure Service Fabric Reliable Actors model as a service composition tier comes in, not as a replacement for these services.

The diagram below illustrates this point:

![Reliable actors, service composition, and state persistence][1]

## Implement better solutions with actors

For composing services, actors can be either stateless or stateful.

* Stateless actors can used as proxies for the underlying services. These actors can dynamically scale across the Service Fabric cluster and can cache certain information related to the service. This can include its endpoint once it is discovered.
* Stateful actors can maintain state between service calls, as well as cache previous service results. State can be persisted or transient.

This pattern is applicable across many scenarios. In most cases, an actor needs to make an external call to invoke an operation on a particular service. Let’s illustrate this by using an example from a modern e-commerce application. Such applications are built on services that provide a range of functionality, including user profile management, recommendations, basket management, wish list management, and purchasing.

Most e-commerce developers try to take a user-centric approach to their architecture--one that's similar to developing for social experiences. This is because e-commerce experiences also revolve primarily around users and products. Developer solutions are usually achieved by shipping a façade of services that, for performance reasons, are most likely supported by a cache.

Contrast that with an actor-based approach. A user actor can represent both the behavior of the user (such as browsing the catalog, liking a product, adding an item to basket, or recommending a product to a friend). But it can also represent the user's composed state, including the user's profile, the items in the basket, the items recommended by friends, the user's purchase history, and the user's current geolocation.

## Populate state by using stateful actors

First, let’s look at an example where a user actor needs to populate its state from multiple services. We are not going to provide a code sample for this, because everything we have discussed [in the smart cache pattern](service-fabric-reliable-actors-pattern-smart-cache.md) is also applicable here.
A user actor can be activated at logon and populated with sufficient data from back-end services. Whole and partial state can also be prepopulated on demand, on a timer, or by using both, and this can be cached in the actor.
For this example, **Profile** and **Wish List** services are illustrated below:

![Profile and Wish List services][2]

Developers can prepopulate the state for frequent users and make it ready when they logon. Developers can also populate the state at the time of logon for users who visit the service each month. You can also see these patterns in the smart cache section.

When User 23 (as shown in the image above) logs on, the user actor (23) is activated, if it hasn't already been activated. The user actor then fetches the relevant user profile information and wish list from back-end services. The user actor also likely caches the information for subsequent calls. If, for example, an item needs to be added to the wish list, this can be achieved by writing behind or writing through, as discussed earlier.

Now let’s look at an example where a user clicks on the **Like** button to like a product. This action may require multiple invocations to multiple services. These actions can include sending a “like” to the catalog service, triggering the next set of recommendations, and posting an update to a social network.

This is illustrated below:

![Liking a product and Wish List, Profile, and Catalog services][3]

## How Actors composition and asynchronous communication can help
The Service Fabric Reliable Actors programming model shines when a developer wants to compose request/response-style operations together with asynchronous operations. For example, while liking a product immediately adds the liked item to the user’s wish list, posting to social networks and triggering the next set of recommendation operations can be made asynchronous by using buffers and timers.

Another key benefit of using a user actor for services is that the actor provides a natural location for cached state. Most importantly, the actor also reacts to changes in its state asynchronously. This is a particularly challenging scenario with stateless services.
For example, a user can carry out a series of actions as part of a "user journey," and these events can be captured in real time in an actor. A stream can then be assembled that can be queried at event time or asynchronously on a timer to change the behavior of the actor.

By this point, SOA purists will no doubt have noticed that these are not services in the sense of actors as endpoints exposed over a language-independent protocol. The Service Fabric Reliable Actors model is neither an interoperation component nor a platform for service interoperation. Yet there is nothing preventing developers from thinking in terms of the granularity of SOA-style services when they model actors or the separation of concerns in the same way. Such services are known as microservices. There is also nothing preventing developers from putting a REST or SOAP endpoint as an interoperation layer in front of Service Fabric Actors.

Further, stateful service composition also applies to workflows, and not just transactional scenarios such as e-commerce. Service Fabric is designed as a workflow/orchestration engine. It can be used to model workflows that involve service interactions and maintain the state of these interactions.

You can see the drawbacks of “stateless service” in building scalable services that provide dynamic experiences. By bringing state and behavior together, the Service Fabric Reliable Actors programming model helps developers build scalable and interactive experiences on top of their existing investments.


## Next steps

[Pattern: Smart cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-stateful-service-composition/stateful-service-composition-1.png
[2]: ./media/service-fabric-reliable-actors-pattern-stateful-service-composition/stateful-service-composition-2.png
[3]: ./media/service-fabric-reliable-actors-pattern-stateful-service-composition/stateful-service-composition-3.png
