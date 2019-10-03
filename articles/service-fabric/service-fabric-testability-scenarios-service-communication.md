---
title: 'Testability: Service communication | Microsoft Docs'
description: Service-to-service communication is a critical integration point of a Service Fabric application. This article discusses design considerations and testing techniques.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: chackdan
editor: ''

ms.assetid: 017557df-fb59-4e4a-a65d-2732f29255b8
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: vturecek

---
# Service Fabric testability scenarios: Service communication
Microservices and service-oriented architectural styles surface naturally in Azure Service Fabric. In these types of distributed architectures, componentized microservice applications are typically composed of multiple services that need to talk to each other. In even the simplest cases, you generally have at least a stateless web service and a stateful data storage service that need to communicate.

Service-to-service communication is a critical integration point of an application, because each service exposes a remote API to other services. Working with a set of API boundaries that involves I/O generally requires some care, with a good amount of testing and validation.

There are numerous considerations to make when these service boundaries are wired together in a distributed system:

* *Transport protocol*. Will you use HTTP for increased interoperability, or a custom binary protocol for maximum throughput?
* *Error handling*. How will permanent and transient errors be handled? What will happen when a service moves to a different node?
* *Timeouts and latency*. In multitiered applications, how will each service layer handle latency through the stack and to the user?

Whether you use one of the built-in service communication components provided by Service Fabric or you build your own, testing the interactions between your services is critical to ensuring resiliency in your application.

## Prepare for services to move
Service instances may move around over time. This is especially true when they are configured with load metrics for custom-tailored optimal resource balancing. Service Fabric moves your service instances to maximize their availability even during upgrades, failovers, scale-out, and other situations that occur over the lifetime of a distributed system.

As services move around in the cluster, your clients and other services should be prepared to handle two scenarios when they talk to a service:

* The service instance or partition replica has moved since the last time you talked to it. This is a normal part of a service lifecycle, and it should be expected to happen during the lifetime of your application.
* The service instance or partition replica is in the process of moving. Although failover of a service from one node to another occurs very quickly in Service Fabric, there may be a delay in availability if the communication component of your service is slow to start.

Handling these scenarios gracefully is important for a smooth-running system. To do so, keep in mind that:

* Every service that can be connected to has an *address* that it listens on (for example, HTTP or WebSockets). When a service instance or partition moves, its address endpoint changes. (It moves to a different node with a different IP address.) If you're using the built-in communication components, they will handle re-resolving service addresses for you.
* There may be a temporary increase in service latency as the service instance starts up its listener again. This depends on how quickly the service opens the listener after the service instance is moved.
* Any existing connections need to be closed and reopened after the service opens on a new node. A graceful node shutdown or restart allows time for existing connections to be shut down gracefully.

### Test it: Move service instances
By using Service Fabric's testability tools, you can author a test scenario to test these situations in different ways:

1. Move a stateful service's primary replica.
   
    The primary replica of a stateful service partition can be moved for any number of reasons. Use this to target the primary replica of a specific partition to see how your services react to the move in a very controlled manner.
   
    ```powershell
   
    PS > Move-ServiceFabricPrimaryReplica -PartitionId 6faa4ffa-521a-44e9-8351-dfca0f7e0466 -ServiceName fabric:/MyApplication/MyService
   
    ```
2. Stop a node.
   
    When a node is stopped, Service Fabric moves all of the service instances or partitions that were on that node to one of the other available nodes in the cluster. Use this to test a situation where a node is lost from your cluster and all of the service instances and replicas on that node have to move.
   
    You can stop a node by using the PowerShell **Stop-ServiceFabricNode** cmdlet:
   
    ```powershell
   
    PS > Stop-ServiceFabricNode -NodeName Node_1
   
    ```

## Maintain service availability
As a platform, Service Fabric is designed to provide high availability of your services. But in extreme cases, underlying infrastructure problems can still cause unavailability. It is important to test for these scenarios, too.

Stateful services use a quorum-based system to replicate state for high availability. This means that a quorum of replicas needs to be available to perform write operations. In rare cases, such as a widespread hardware failure, a quorum of replicas may not be available. In these cases, you will not be able to perform write operations, but you will still be able to perform read operations.

### Test it: Write operation unavailability
By using the testability tools in Service Fabric, you can inject a fault that induces quorum loss as a test. Although such a scenario is rare, it is important that clients and services that depend on a stateful service are prepared to handle situations where they cannot make write requests to it. It is also important that the stateful service itself is aware of this possibility and can gracefully communicate it to callers.

You can induce quorum loss by using the PowerShell **Invoke-ServiceFabricPartitionQuorumLoss** cmdlet:

```powershell

PS > Invoke-ServiceFabricPartitionQuorumLoss -ServiceName fabric:/Myapplication/MyService -QuorumLossMode QuorumReplicas -QuorumLossDurationInSeconds 20

```

In this example, we set `QuorumLossMode` to `QuorumReplicas` to indicate that we want to induce quorum loss without taking down all replicas. This way, read operations are still possible. To test a scenario where an entire partition is unavailable, you can set this switch to `AllReplicas`.

## Next steps
[Learn more about testability actions](service-fabric-testability-actions.md)

[Learn more about testability scenarios](service-fabric-testability-scenarios.md)

