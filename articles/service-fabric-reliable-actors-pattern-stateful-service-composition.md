
<properties
   pageTitle="Azure Service Fabric Actors stateful service composition design pattern"
   description="Service Fabric Actors design pattern that uses Stateful actors to maintain state between service calls as well as cache previous service results. State can be persisted or transient."
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
   ms.date="04/01/2015"
   ms.author="claudioc"/>

# Service Fabric Actors design pattern: stateful service composition
Developers spent the last decade and a half building N-Tier stateless services in the enterprise. They built services on top of databases, they built high order services on top of other services, and they built orchestration engines and message oriented middleware to coordinate these services. As the user workloads evolve, whether demanding more interactivity or scale, stateless service-oriented architecture began to show its weaknesses.

## The old way: SOA Services
While SOA services scaled horizontally seamlessly due to their stateless nature, they created a bottleneck in the storage tier—concurrency and throughput. Accessing storage became more and more expensive. As a common practice most developers introduced caching to their solution to reduce the demand on storage but that solution was not without its drawbacks—another tier to manage, concurrent access to cache, semantic limitations and changes, and finally consistency. As detailed earlier in the Smart Cache pattern, the virtual actor model provides a perfect solution for this.

Some developers tried to solve the problem by replicating their storage tier. However, this approach didn’t scale well and quickly hits CAP boundaries.
The second challenge has evolved around changing requirements; both end-users and businesses are demanding interactive services—responding to requests in milliseconds rather than seconds as the norm. To respond, developers started building façade services on top of other services, in some cases 10s of services to create user-centric services. However composing multiple downstream services quickly showed latency issues.

Once again developers turned to caches and in-memory object stores, in some cases different implementations to meet performance requirements. They started building backend worker processes to build the cache periodically to minimize expensive on-demand cache population. Finally, they started deconstructing their workloads to isolate asynchronous operations from synchronous ones to gain more room for interactive operations to react to changes in state, which is particularly hard in SOA.

They introduced further tiers such as queues and workers adding more complexity to their solutions.
Essentially, developers started looking for solutions to build “stateful services,” in other words, collocate “state” and “service behaviour” to address user centric and interactive experiences. And this is where Azure Service Fabric Actors as a service composition tier comes in, not as a replacement for these services.

The diagram below illustrates the point:

![][1]

## Better solution with Actors
In the case of composing services, actors can be either stateless or stateful.

* Stateless Actors can used as proxies to the underlying services. These actors can dynamically scale across the Azure Service Fabric cluster and can cache certain information related to the service, such as its endpoint once it is discovered.
* Stateful actor can maintain state between service calls as well as cache previous service results. State can be persisted or transient.

This pattern is also applicable across many scenarios; in most cases, actors need to make external calls to invoke an operation on a particular service.
Let’s illustrate with an example using modern ecommerce applications. These applications are built on services that provides various functionality such as User Profile Management, Recommendations, Basket Management, Wish List Management, Purchasing, and many more.

Most developers wish to take a user-centric approach to their architecture, very similar to those developing social experiences since ecommerce experiences primarily revolve around users and products. This is usually achieved by shipping a façade of services most likely supported by a cache for performance reasons.

Now let’s talk about an actor based approach. A user actor can represent both the behaviour of the user (browsing the catalogue, liking a product, adding an item to basket, recommending a product to a friend) as well as the its composed state—their profile, items in the basket, list of items recommended by their friends, their purchase history, current geo-location, and so on.

## Using stateful Actors
First let’s look at an example where the user actor needs to populate its state from multiple services. We are not going to provide a code sample for this one because everything we have discussed in the Smart Cache pattern is also applicable here.
We can activate the user actor at login time, populating it with sufficient data from back-end services. Of course, as we have seen on many occasions earlier in this paper, whole and partial state can be prepopulated on demand, on a timer, or a bit of both and cached in the actor.
For this example, Profile and Wish List is illustrated below:

![][2]

For instance we can prepopulate frequent users’ state and make it ready when they login or populate it at login time for users who visit the service every month. We saw these patterns in the Smart Cache section.

When User 23 logs in, if not already activated, the user actor (23) is activated and fetches the relevant user profile information and wish list from back-end services. The user actor likely caches the information for subsequent calls. And if, for example, we need to add an item to the wish list we can write-behind or write-through as discussed earlier.
Secondly, let’s have a look at an example where the user clicks on the “like” button and likes a product. This action may require multiple invocations to multiple services as illustrated below: Send a “like” to catalogue service, trigger the next set of recommendations, and perhaps post an update to a social network.

This is illustrated below:

![][3]

## How Actors composition & Async communication can help
In fact, Azure Service Fabric Actors shines when we want to compose request/response style operations together with asynchronous operations. For instance, while “Like Product” immediately puts the liked item into the user’s wish list, posting to social networks and triggering the next set of recommendations can be asynchronous operations using buffers and timers.

One other key benefit of using a user actor with services is actors provide a natural place for cached state and most importantly react to changes in its state asynchronously. This is a particularly challenging scenario with stateless services.
For example, a user carries out a series of actions, perhaps part of a "user journey." These events can be captured in real time in the actor and we can assemble a stream, which we can query at event time or asynchronously on a timer to change the behaviour of the actor.

At this point SOA purists will no doubt have noticed that these are not services in the sense of actors as endpoints exposed over a language independent protocol. Azure Service Fabric Actors is neither an interoperation component nor a platform for service interoperation. Nevertheless, there really is nothing preventing us from thinking in terms of the granularity of SOA-style services when we model our actors or in modelling separation of concerns in the same way. Such services are known as “microservices.”
Likewise, there is absolutely nothing preventing us from putting a REST endpoint or a SOAP endpoint as an interop layer in front of Azure Service Fabric Actors.

Stateful service composition also applies to workflows and not just transactional scenarios such as ecommerce. Azure Service Fabric is designed as a workflow/orchestration engine so it can be used to model workflows involving service interactions and maintain the state of these interactions.

We see drawbacks of “stateless service” in building scalable services to provide dynamic experiences. Azure Service Fabric Actors, essentially by bringing state and behaviour together, helps developers build scalable and interactive experiences on top of their existing investments.


## Next Steps
[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smartcache.md)

[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors/stateful-service-composition-1.png
[2]: ./media/service-fabric-reliable-actors/stateful-service-composition-2.png
[3]: ./media/service-fabric-reliable-actors/stateful-service-composition-3.png
