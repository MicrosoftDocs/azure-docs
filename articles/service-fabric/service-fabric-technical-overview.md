<properties
   pageTitle="Technical Overview"
   description="A technical overview of Service Fabric. Discusses key concepts and architectural overview"
   services="service-fabric"
   documentationCenter=".net"
   authors="msfussell"
   manager="timlt"
   editor="chackdan;subramar"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/25/2015"
   ms.author="mfussell"/>

# Technical overview of Service Fabric

Service Fabric is a distributed systems platform that makes it easy to build scalable, reliable, low-latency, and easily managed applications for the cloud. This means that you can focus on your business needs and let Service Fabric take care of ensuring your application is always available and scales.

## Key concepts

**Cluster** - A network connected set of virtual or physical machines into which application instances are deployed.  Clusters can scale to thousands of machines.

**Node** - An addressable unit in a cluster. Nodes have characteristics such as placement properties and unique IDs. Nodes can join a cluster and correlate to an operating system instance with Fabric.exe running.

**Application / Application Type** - A collection of (micro)services. Think of an application type as a container for one or more service types.  Please refer to the [Application Model](service-fabric-application-model.md) article to understand how a cluster (which itself consists of multiple nodes) may consist of multiple ApplicationTypes.

**Service / Service Type** - Code and configuration that performs a standalone function (it can start and run independently), for example, a queue service or database service. An ApplicationType may consist of one ore more ServiceTypes. There are two kinds of services types:

- Stateless service: A service that has state where the state is persisted to external storage, such as Azure Databases or Azure Table store. If a node on which an instance of this service is active goes down, another instance is automatically started on another node.

- Stateful service: A service that has state and achieves reliability through replication between replicas on other nodes in the cluster. Stateful services have a primary and multiple secondary replicas. If a node on which a replica of this service is active goes down, a new replica is started on another node and if this was the primary replica, a secondary replica is automatically promoted to a new primary.

**Application Instance** - In a cluster you can create many application instances of an application type, each of which has a specific name. Each application instance can be independently managed and versioned from other application instances of the same type or different type. Additionally they define resource and security isolation.

**Service Instance** -  Code that has been instantiated for a service type. Each service instance has a unique name starting with `fabric:/` and is associated with an particular named application instance.

**Application Package** - The collection of service code packages and the configuration files combined for a particular application. These are the physical files that are deployed and is simply a file and folder format layout. For example, an application package for an email application could contain a queue service package, a frontend service package, and a database service package.

**Programming Models** - There are two programming models available in Service Fabric to build applications:

- Reliable Services - An API to build stateless and stateful services based on `StatelessService` and `StatefulService` .NET classes, storing state in .NET reliable collections (Dictionary and Queue) and with the ability to plug in a variety of communication stacks such as Web API and WCF. This programming model is suitable for applications where you need to perform compute across multiple units of state.

- Reliable Actors - An API to build stateless and stateful objects through the virtual Actor programming model which is suitable for applications with multiple independent units of state and compute.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
To learn more about Service Fabric, see:

- [Application Model](service-fabric-application-model.md)
- [Application Scenarios](service-fabric-application-scenarios.md)
 