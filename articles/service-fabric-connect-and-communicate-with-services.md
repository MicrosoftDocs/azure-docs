<properties
   pageTitle="Microsoft Azure Service Fabric How to communicate with services"
   description="This article describes how you can connect to and communicate with services in Service Fabric applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="kunaldsingh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/29/2015"
   ms.author="kunalds"/>


# Communicating with services
In the microservices world the overall solution is composed of many different services where each one performs a specialized task. These microservices communicate with each other to enable the end-end workflow. There are also client applications that connect to and communicate with services. This document discusses how Service Fabric makes it easy for you to setup communication with services that you write with Service Fabric.

## Key concepts
These are some of the key concepts that you need to be aware of as you setup communication to services.
### Communication is represented as Client-Server
Service Fabric Communication APIs represent client-service type of interaction, even in the case where it is between two services running in the same cluster. A target service that will be connected to from a client or another service acts as a server and listens for incoming requests. The client, which can be just another service in the cluster, connects to the server and makes calls to it.
### Movement of services
In a distributed system the service instances that you run may move from one machine to another over time for various reasons such as load balancing when configured with load metrics for resource balancing or due to upgrades, failovers, scale-out, and other various situations. The impact of this is that the endpoint addresses of a service instance can change and to setup communication with the service instance the following loop needs to be executed. These details are abstracted from you if you use the Communication APIs provided by Service Fabric.

* **Resolve**: All services instances in Service Fabric have unique URIs, for example "fabric:/MyApplication/MyService" and these URIs do not change over time. Each service instance also exposes endpoints which can change when service instances are moved. This is analogous to websites which have constant URLs but the IP Address may change. And similar to the DNS in the world wide web which resolves website URLs to IP Addresses the Service Fabric platform also has a system service that resolves the URIs to the endpoints. This step involves resolving the URI of the service instance to an endpoint.

* **Connect**: Once the Service URI has been resolved to endpoint addresses the next step is to attempt a connection with that service. This connection may fail if the endpoint address has changed due to a service movement, which, for example, may have been caused by a machine failure or due to load balancing.

* **Retry**: If the connection attempt fails the preceding resolve and connect steps need to be retried and this cycle is repeated until the connection succeeds.

## Deciding the Communication API to use
As part of Service Fabric we provide a few different options for Communication APIs and the decision for which one will work best for you depends on the choice of the programming model, communication framework and programming language that your services are written in.
### Communication for Reliable Actors
For services written using Reliable Actors API all the communication details are abstracted and the communication happens as method calls on the ActorProxy and you can stop reading here.

### Communication options for Reliable Services
There are a couple of different options if your service was written using Reliable Services API. Your choice of a communication protocol will guide as to what Service Fabric communication APIs you may use.

* **There isn't a specific communication protocol that I need to use and I want something up and running quickly**: If you don't have a particular choice of communication framework then the ideal option for you is to use the [Default stack](service-fabric-reliable-services-communication-default.md) that allows for a similar model as the Actor communication model. This is the easiest and fastest way to get started with service communication. It provides strongly typed RPC communication that abstracts most of the communication details away so that invoking a method on a remote service in your code looks like calling a method on a local object instance. These classes abstract the resolution, connection, retry and error handling while setting up the communication channel and allows for a method call based communication model. For this the `ServiceCommunicationListener` class is to be used for the server side and the `ServiceProxy` class on the client side of the communication.

* **HTTP**: To leverage the flexibility that HTTP based communication provides you can use Service Fabric communication APIs that allow the communication mechanism to be defined while resolution, connection and retry logic is still abstracted from you. For example you can use Web API for specifying the communication mechanism and leverage the [`ICommunicationClient` and `ServicePartitionClient` classes](service-fabric-reliable-services-communication.md) to setup communication.
* **WCF**: If you have existing code that uses WCF as your communication framework then you can use the WcfCommunicationListener for the server side, and WcfCommunicationClient and ServicePartitionClient classes for the client. For more details see [this article](service-fabric-reliable-services-communication-wcf.md).

* **Other communication frameworks including custom  protocols**: If you are planning on using any other communication framework including custom communication protocols there are Service Fabric communication APIs which you can plugin your communication stack into while all the work to discover and connect is abstracted from you. See [this article](service-fabric-reliable-services-communication.md) for more details.

### Communication between services written in different programming languages
All ServiceFabric communication APIs are currently only available in C# so if have a service that is written in some other programming language such as Java or Node.JS then you will have to write your own communication mechanism.

## Next Steps
* [Default communication stack provided by Reliable Services Framework ](service-fabric-reliable-services-communication-default.md)
* [Reliable Services communication model](service-fabric-reliable-services-communication.md)
* [Getting Started with Microsoft Azure Service Fabric Web API services with OWIN self-host](service-fabric-reliable-services-communication-webapi.md)
* [WCF based communication stack for Reliable Services](service-fabric-reliable-services-communication-wcf.md)
