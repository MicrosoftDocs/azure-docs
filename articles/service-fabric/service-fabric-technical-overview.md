<properties
   pageTitle="Service Fabric technical overview | Microsoft Azure"
   description="A technical overview of Service Fabric. Discusses key concepts and architectural overview."
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

Azure Service Fabric is a distributed systems platform that makes it easy to build scalable, reliable, low-latency, and easily managed applications for the cloud. This means that you can focus on your business needs and let Service Fabric take care of ensuring that your application is always available and scales.

## Key concepts

**Cluster**: A network-connected set of virtual or physical machines into which application instances are deployed.  Clusters can scale to thousands of machines.

**Node**: An addressable unit in a cluster. Nodes have characteristics such as placement properties and unique IDs. Nodes can join a cluster and correlate to an operating system instance with Fabric.exe running.

**Application/application type**: A collection of (micro)services. Think of an application type as a container for one or more service types.  Please refer to the [application model](service-fabric-application-model.md) article to understand how a cluster (which itself consists of multiple nodes) may consist of multiple application types.

**Service/service type**: Code and configuration that perform a standalone function (it can start and run independently), for example, a queue service or database service. An application type may consist of one ore more service types. There are two kinds of services types:

- Stateless service: A service that has state where the state is persistent to external storage, such as Azure databases or Azure Table store. If a node on which an instance of this service is active goes down, another instance is automatically started on another node.

- Stateful service: A service that has state and achieves reliability through replication between replicas on other nodes in the cluster. Stateful services have a primary and multiple secondary replicas. If a node on which a replica of this service is active goes down, a new replica is started on another node. If the node that goes down is the primary replica, a secondary replica is automatically promoted to a new primary.

**Application instance**: In a cluster, you can create many application instances of an application type, each of which has a specific name. Each application instance can be independently managed and versioned from other application instances of the same type or a different type. Additionally, they define resource and security isolation.

**Service instance**: Code that has been instantiated for a service type. Each service instance has a unique name starting with `fabric:/` and is associated with a particular named application instance.

**Application package**: The collection of service code packages and the configuration files combined for a particular application. These are the physical files that are deployed, and they are simply in a file and folder format layout. For example, an application package for an email application could contain a queue service package, a front-end service package, and a database service package.

**Programming models**: There are two programming models available in Service Fabric to build applications:

- Reliable services: An API to build stateless and stateful services based on `StatelessService` and `StatefulService` .NET classes and store state in .NET reliable collections (dictionary and queue). They also have the ability to plug in a variety of communication stacks, such as Web API and WCF. This programming model is suitable for applications where you need to perform compute across multiple units of state.

- Reliable actors: An API to build stateless and stateful objects through the virtual actor programming model that is suitable for applications with multiple independent units of state and compute.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
To learn more about Service Fabric, see:

- [Application model](service-fabric-application-model.md)
- [Application scenarios](service-fabric-application-scenarios.md)
