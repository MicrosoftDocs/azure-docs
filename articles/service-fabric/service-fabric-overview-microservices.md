<properties
   pageTitle="Understanding Microservices | Microsoft Azure"
   description="An overview of why building cloud applications with a microservices approach is important for modern application development and how Azure Service Fabric provides a platform to achieve this"
   services="service-fabric"
   documentationCenter=".net"
   authors="msfussell"
   manager="timlt"
   editor="bscholl"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/18/2015"
   ms.author="mfussell"/>

# Why a microservices approach to building applications?
As software developers there is nothing new in how we think about factoring an application into component parts. It is the central paradigm of object orientation, software abstractions and componentization. Today this factorization tends to take the form of classes and interfaces between shared libraries and technology layers, typically through a tiered approach with a back-end store, middle-tier business logic and front-end UI.
What has changed over the last few years is that we, as developers, are building distributed applications for the cloud driven by the business.

The changing business needs are;

- The need to build and operate a service at scale to enable greater customer reach, say into new geographical regions or without having to deploy at customer locations.
- Faster delivery of features and capabilities to be able to respond to customer demands in an agile way.
- Improved resource utilization to reduce costs

It is these business needs that are affecting *how* we build applications.

## Monolithic vs. microservice design approach
All applications evolve over time. Successful applications evolve by being useful to people. Unsuccessful applications do not evolve and eventually are deprecated. The question only becomes, how much do you know about your requirements today and where you think these may go in the future? For example, if you are building a reporting application for a department and you are sure this will remain within the scope of your company and that the reports will be short lived, your choice on approach will be different than say, building a service for delivering video content to tens of millions of customers. Sometimes getting something out the door as proof of concept is the driving factor under the knowledge that the application can be redesigned later. There is little point in over-engineering something that never gets used. It’s the usual engineering trade-off. On the other hand, when companies talk about building for the cloud the expectation is growth and usage. The issue is that growth and scale are unpredictable and so we would like to be able to prototype fast but, at the same time, know we are on a path to deal with future success. This is the lean startup approach – build, measure, learn, iterate.

During the client-server era we tended to focus on building tiered applications using specific technologies in each tier. The term ‘monolithic’ application has emerged for these since the interfaces tended to be between the tiers and usually within the tier a more tightly coupled design was used between components. i.e. developers designed and factored with classes compiled into libraries and linked these together into a few exes and dlls. There are benefits to this monolithic design approach. They can be simpler to design, have faster calls between components since these are often over IPC, everyone tests a single product and this tends to be more people resource efficient.  The downside is that the application is tightly coupled within the tiered layers, you cannot scale individual components, if you need to perform fixes or upgrades you have to wait on others to finish their testing and it becomes more difficult to be agile.

Microservices address these downsides and more closely align with the business requirements described above, but they themselves have both an upside and a downside. The benefits of microservices are that each one typically encapsulates simpler business functionality, they can be scaled-up or down, tested, deployed and managed independently. Importantly the benefits of a microservice approach are that teams tend to be more business scenario driven rather than technology driven, which the tiered approach encouraged. What this means in practice is that smaller teams develop the microservice based on a customer scenario, using any technologies of their choice. In other words the organization doesn’t need to standardize on tech in order to maintain their monoliths and that individual teams owning services can do what makes sense for them based on either team expertise or what’s most appropriate for the problem that service is trying to solve. Of course in practice having a set of recommended technologies is preferable for example choosing a particular NoSql store, or web application framework.
The downside of microservices is managing the increased number of separate entities, dealing with the more complex deployments, and versioning, having more network traffic between the microservices and the corresponding network latencies. Having lots of chatty, very granular services is a recipe for performance nightmare, and without tools to help view these dependencies it is hard to “see” the whole system. Ultimately standards are what make the microservice approach work, by agreeing on how to communicate and being tolerant to only the things you need from a service rather than rigid contracts. It is important to define these contacts up front in the design since services are going to be updated inpdendently of one another. Another description coined when designing with a microservices approach is “fine-grained SOA”.


***At its simplest, the microservices design approach is about a decoupled federation of services, with independent changes to each and agreed standards to communicate***


As more cloud apps are produced, more people are discovering that this decomposition of the overall app into independent scenario focused services is a better longer term approach. 
## Comparison between application development approaches

![Service Fabric Platform][Image1]

(1) A monolith app contains domain specific functionality and is normally divided by functional layers such as web, business and data.

(2) You scale monolithic apps by cloning it on multiple servers/VMs/containers.

(3) A microservice application separates functionality into separate smaller services.

(4) This approach scales out by deploying each service independently, creating instances of these services across servers/VMs/containers.


Designing with a microservice approach is not a panacea for all projects, however it does align closer with the business objectives described earlier. Also starting with a monolithic approach may be acceptable if you know that later you have the opportunity to rework the code into a micoservice design if necessary. More common is that you have a monolith app today and you can slowly break this apart in stages starting with the functional areas that need to be more scalable or agile.

To summarize, the microservice approach is to compose your application of many smaller services running in containers deployed across a cluster of machines where each service is developed by a smaller team focusing on a scenarios and where each service is independently tested, versioned, deployed and scaled, so that the application as a whole can evolve. 

## What is a microservice?

There are different definitions of microservices and searching the internet provides many good resources who provide their viewpoint and definition. However, most of the following characteristics are widely agreed upon; 

- Encapsulate a customer or business scenario. What is the problem you are solving?
- Are developed by a small engineering team
- Can be written in any programming language and use any framework 
- Consist of code and optionally state that is independently versioned, deployed, and scaled
- Interacts with other microservices over well-defined interfaces and protocols 
- Has a unique name (URL) that can be used to resolve its location.
- Remains consistent and available in the presence of failures

You can summarize this into; 

***Microservices applications are composed of small, independently versioned and scalable customer focused services that communicate with each other over standard protocols with well-defined interfaces***


We covered the first two points above in the preceding section and we will now expand and clarify the others.

### Can be written in any programming language and use any framework
As developers we should be free to choose whatever language or framework that we want depending on our skills or the needs of the service. In some services, you might value the performance benefits of C++ above all else whereas in others the ease of managed development in C# or Java might be most important. In some cases, you may need to use a specific 3rd party library, data storage technology, or means of exposing the service to clients. 

Having chosen a technology this bring us to the operational or lifecycle management and scaling of the service.

### Code and state that is independently versioned, deployed, and scaled  

However you choose to write your microservices, each should be independently deployed, upgraded and scaled for both the code and optionally the state. This actually is one of the harder problems to solve since it does come down to your choice of technologies and, for scaling, understanding how to partition (or shard) both the code and state. When the code and state use separate technologies (which today they tend to do) the deployment scripts for your microservice need to be able to cope with scaling them both. This is also about agility and flexibility where I can upgrade some of the microservices with having to upgrade all of them at once.
Returning to the monolithic vs. microservice approach for a moment the diagram below shows the differences in the approach to storing state.

### State storage between application styles
![Service Fabric Platform][Image2]

***On the left the monolithic approach with a single database and tiers of specific technologies.***

***On the right the microservices approach a graph of interconnected microservices where state is typically scoped to the microservice and a variety of technologies are used.***

In a monolithic approach typically there is a single database used by the application. The advantage is that this is single location and makes it easy to deploy. Each component can have a single table to store its state. The hard part is that teams need to be strict in separating state and inevitably there is the temptation to simply add a new column to an existing customer table, do a join between tables and generally create dependencies at the storage layer. Once this happens all bets are off on scaling individual components.  In the microservices approach each service manages and stores its own state meaning that it is responsible for scaling both code and state together for the demands of the service. The downside to this is when there is a need create any views, or queries, of your applications’ data, since you will now need to query across these disparate state stores. Typically, this is solved by having a separate microservice that builds a view across a collection of microservices. If you have the need to perform multiple ad-hoc queries on the data, each microservice should consider writing its data into a data warehousing service for offline analytics.


Versioning is specific to the deployed version of the microservice and is required so that multiple different versions can be rolled out and run side by side. Versioning addresses the scenarios where a newer version of a microservice fails during upgrade and needs to be rolled back to the earlier version. The other scenario for versioning is performing A/B style testing where different users experience different versions of the service. For example, it is common to upgrade a microservices for a specific set of customers to test new functionality, before rolling this out more widely.  After lifecycle management of microservices this then brings us to communication between them. 


### Interacts with other microservices over well-defined interfaces and protocols

Little has to be covered on this topic other than to read the extensive literature on SOA published over the last 10 years, since much of this was geared towards communication patterns. Generally, today this comes down to using a REST approach with http and tcp protocols and XML or JSON as the serialization format. From an interface perspective this is about embracing the web design approach. But there is nothing stopping you from using binary protocols or your own data formats, just be prepared for people to have a harder time using your microservices if these are openly available. 

### Has a unique name (URL) that can be used to resolve its location

Remember how we keep saying that the microservice approach is like the web. Like the web your microservice needs to be addressable wherever it is running. If you are thinking about machines and which one is running a particular microservices things will go bad quickly. In the same way that DNS resolves a particular URL to a particular machine, your microservice needs to have a unique name to discover where it currently is. Microservices hence need addressable names that make them independent from the infrastructure that they are running on. Of course this implies that there is an  interaction between how your service is deployed and how it is discovered since there needs to be a service registry. Equally there needs to be an interaction between when machine failures occur and what happens to your microservice so that the registry service can tell you where it is now running. This brings us to the next topic on resilience and consistency.
 
### Remains consistent and available in the presence of failures

Dealing with unexpected failures is one of the hardest problems to solve especially in a distributed system. Much of the code that we write as developers is handling exceptions and this is also where most time is spent in testing. But the problem is more involved than writing code to handle failures, what happens when the machine where the microservice is running fails? Not only do you need to detect this microservice failure (a hard problem on its own) but you need something to restart your microservice.  A microservice needs to be resilient to failures and have the ability to restart often on another machine for availability reasons. This also comes down to what state was saved on behalf of the microservice, where can it recover this state from and is it able to restart successfully? In other words, there is the need to be resilient in the compute (i.e. the process is restarted) as well as the resilience in the state, or data (there was no data loss and the data remains consistent). 

The problems of resiliency are compounded during other scenarios such as when failures happen during an application upgrade. The microservice, working in conjunction with the deployment system, needs to not only recover, but then decide whether it can continue to move forward to the newer version or instead rollback to the previous versions to maintain a consistent state. Questions such as are there enough machines available to keep moving forward and how do you recover previous versions of the microservice need to be taken into account. This requires the microservice to emit health information to be able to make these decisions.

### Reports health and diagnostics

Seemingly obvious and often overlooked it is essential that a microservice reports its health and diagnostics otherwise there is little insight from an operations perspective. The challenge comes in seeing the correlation of diagnostic events across a set of independent services with each one logging independently and dealing with machine clock skews to make sense of the event order. In the same way that you interact with a microservice over agreed protocols and data formats there emerges a need for standardization of how to log health and diagnostic events that ultimately end up in an event store that can be queried and viewed.  In a microservices approach it is key that the different teams agree on a single logging format, since there needs a consistent approach to viewing diagnostic events in the application as a whole.

Health is different from diagnostics. Health is about the microservice reporting its current state so that actions can be taken. The most obvious of these is working with the upgrade and deployment mechanisms to maintain availability. For example, a service may be currently unhealthy due to a process crash, or machine reboot but is still operational. The last thing you need is to make this worse by performing an upgrade when the best thing is to do an investigation first, or allow time for the microservice to recover. Health events from a microservice thereby allows us to make informed decisions and in effect help create self-healing services. 

## Service Fabric as a microservices platform

Service Fabric was born out of Microsoft’s transition from delivering box products, that were typically monolithic in style, to delivering services and was primarily driven by the experience of building and operating large services such as Azure SQL databases, Document DB and other core Azure services.  We entirely approached the business needs for scale, agility, independent teams and let the platform evolve over time as more and more services adopted it. Importantly, Service Fabric had to run anywhere not just in Azure but also in standalone Windows Server deployments.

***The aim of Service Fabric is to solve the hard problems of building and running a service such as failures, upgrades, utilizing infrastructure resources efficiently so that teams can solve business problems using a microservices approach***

Service Fabric provides two broad areas to help you build applications with a microservices approach. 

- A platform consisting of a set of system services that take care of deployments, upgrades, detecting and restarting failed services, discovery of where services currently are running, state management, health monitoring etc. These system services in effect enable many of the characteristics of microservices described above.

-  Programming APIs, or frameworks, to help you built applications as microservices. The supplied programing APIs are called [Reliable Actors and Reliable Services](service-fabric-choose-framework.md). You can of course use any code of your choice to build your microservice, but by using these, not only does this make the job more straightforward, but they integrate with the platform at a deeper level so, for example, you get health and diagnostics information or you can take advantage of the built in high availability.

***Service Fabric is agnostic to how you build your service and you can use any technology. 
However, it does provide built in programming APIs that makes it very easy to build microservices***

### Are microservices right for my application?

Maybe. What we experienced was that as more and more teams in Microsoft were told to build for the cloud for business reasons, many of them realized the benefits of taking the microservices-like approach. Bing, for example, has been doing this in search for years. For other teams this was very new and they found that there were hard problems that needed to be solved, which was not their core strength. This is why Service Fabric gained traction as the technology of choice for building services.

The objective of Service Fabric is to reduce the complexities of building applications with a microservice approach so that you do not have to go through as many costly redesigns. Start small, scale when needed, deprecate services, add new ones, evolve with customer usage, that’s the approach.  We also know that in reality there are many other problems yet to be solved to really make microservices more approachable for the majority of developers. Containers and the actor programming model are both examples of small steps in that direction and we are sure that more innovations will emerge to make this easier.
 
<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

* For more information: 
	* [Overview of Service Fabric](service-fabric-overview.md)
	* [Technical Overview](service-fabric-technical-overview.md)
* Setup your Service Fabric [development environment](service-fabric-get-started.md)
* Choosing a [programming model framework](service-fabric-choose-framework.md) for your service.

[Image1]: media/service-fabric-overview-microservices/monolithic-vs-micro.png
[Image2]: media/service-fabric-overview-microservices/statemonolithic-vs-micro.png