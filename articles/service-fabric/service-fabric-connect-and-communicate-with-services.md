<properties
   pageTitle="Communicate with and connect to services in Azure Service Fabric | Microsoft Azure"
   description="Learn how to connect to and communicate with services in Service Fabric applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="mfussell"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="02/12/2016"
   ms.author="mfussell"/>

# Communicate with services
In the microservices world, the overall solution is composed of many different services, where each service performs a specialized task. These microservices communicate with each other to enable the end-to-end workflow. There are also client applications that connect to and communicate with services. This document discusses how Azure Service Fabric makes it easy for you to set up communication with services that you write with Service Fabric.

## Key concepts
These are some of the key concepts that you need to be aware of as you set up communication to services.

### Communication is represented as client-server
Service Fabric Communication APIs represent client-server types of interactions, even when the interaction is between two services running in the same cluster. A target service, which will be connected to from a client or another service, acts as a server and listens for incoming requests. The client, which can be just another service in the cluster, connects to the server and makes calls to it.

### Movement of services
In a distributed system, the service instances that you run may move from one machine to another over time. This can happen for various reasons, including resource balancing when configured with load metrics for resource balancing, upgrades, failovers, scale-out. The impact of this is that the endpoint addresses of a service instance can change. To set up communication with the service instance, the following loop needs to be executed. These details are abstracted from you if you use the communication APIs provided by Service Fabric.

* **Resolve**: All named service instances in Service Fabric have unique names as URIs. For example, `"fabric:/MyApplication/MyService"` remains fixed for the named service. Each named service instance also exposes endpoints that can change when the named service instances are moved. This is analogous to websites that have constant URLs but where the IP address may change. And similar to the DNS on the web, which resolves website URLs to IP addresses, the Service Fabric has a system service called the Naming Service, that resolves the URIs to the endpoints. This step involves resolving the URI of the service instance to an endpoint.

* **Connect**: Once the named service URI has been resolved to an endpoint address, the next step is to attempt a connection with that service. This connection may fail if the endpoint address has changed due to a service movement, which, for example, may have been caused by a machine failure or resource balancing.

* **Retry**: If the connection attempt fails, the preceding resolve and connect steps need to be retried, and this cycle is repeated until the connection succeeds.

## Communication API options
As part of Service Fabric, we provide a few different options for Communication APIs. The decision about which one will work best for you depends on the choice of the programming model, the communication framework, and the programming language that your services are written in.

### Communication for Reliable Actors
For services written using the Reliable Actors API, all the communication details are abstracted. The communication happens as method calls on the ActorProxy, so you can stop reading here.

### Communication options for Reliable Services
There are a couple of different options if your service was written using the Reliable Services API. Your choice of a communication protocol will guide you as to what Service Fabric communication APIs you use.

* **No specific protocol:**  If you don't have a particular choice of communication framework, but you want to get something up and running quickly, then the ideal option for you is the [Default stack](service-fabric-reliable-services-communication-remoting.md), which allows for a similar model as the Actor communication model. This is the easiest and fastest way to get started with service communication. It provides strongly typed RPC communication that abstracts most of the communication details away, so that invoking a method on a remote service in your code looks like calling a method on a local object instance. These classes abstract the resolution, connection, retry, and error handling while setting up the communication channel, and allows for a method-call based communication model. For this, use the `ServiceRemotingListener` class on the server side and the `ServiceProxy` class on the client side of the communication.

* **HTTP**: To leverage the flexibility that HTTP based communication provides you can use Service Fabric communication APIs that allow the communication mechanism to be defined while resolution, connection, and retry logic is still abstracted from you. For example, you can use the Web API for specifying the communication mechanism, and leverage the [`ICommunicationClient` and `ServicePartitionClient` classes](service-fabric-reliable-services-communication.md) to set up communication.
* **WCF**: If you have existing code that uses WCF as your communication framework, then you can use the `WcfCommunicationListener` for the server side and `WcfCommunicationClient` and `ServicePartitionClient` classes for the client. For more details, see this article about [WCF-based implementation of the communication stack](service-fabric-reliable-services-communication-wcf.md).

* **Other communication frameworks including custom  protocols**: If you're planning on using any other communication framework including custom communication protocols, there are Service Fabric communication APIs  that you can plug your communication stack into, while all the work to discover and connect is abstracted from you. See this article about the [Reliable Service communication model](service-fabric-reliable-services-communication.md) for more details.

### Communication between services written in different programming languages
All Service Fabric communication APIs are currently only available in C#. This means that if you have a service that is written in some other programming language, such as Java or Node.JS, then you will have to write your own communication mechanism.

## Next steps
* [Default communication stack provided by Reliable Services Framework ](service-fabric-reliable-services-communication-remoting.md)
* [Reliable Services communication model](service-fabric-reliable-services-communication.md)
* [Getting started with Microsoft Azure Service Fabric Web API services with OWIN self-host](service-fabric-reliable-services-communication-webapi.md)
* [WCF-based communication stack for Reliable Services](service-fabric-reliable-services-communication-wcf.md)
