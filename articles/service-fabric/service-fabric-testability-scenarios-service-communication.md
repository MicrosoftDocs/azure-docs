<properties 
   pageTitle="Service Fabric Testability Scenarios: Service Communication" 
   description="Service-to-service communication is a critical integration point of a Service Fabric application. This article discusses design consideration and testing techniques." 
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
   ms.date="08/25/2015"
   ms.author="vturecek"/>

# Service Fabric Testability Scenarios: Service Communication

Microservices and service-oriented architectural styles surface naturally in Service Fabric. In these types of distributed architectures, componentized microservice applications are typically composed of multiple services that need to talk to each other. Even in the simplest case, you generally have at least a stateless web service and a stateful data storage service that need to communicate.

Service-to-service communication is a critical integration point of an application as each service exposes a remote API to other services. Working with a set of API boundaries involving I/O generally requires some care with a good amount of testing and validation. 

There are numerous considerations to make when these service boundaries are wired together in a distributed system:

 - **Transport protocol**. Will it be HTTP for increased interoperability, or a custom binary protocol for maximum throughput?
 - **Error handling**. How are permanent and transient errors handled and what happens when a service moves to a different node?
 - **Timeouts and latency**. In multi-tiered applications, how does each service layer handle latency through the stack and up to the user?

Whether you're using one of the built-in service communication components provided by Service Fabric or building your own, testing the interaction between your services is a critical part of ensuring resiliency in your application.

## Where's my service?

Service instances may move around over time, especially when configured with load metrics for custom-tailored optimal resource balancing. Upgrades, failovers, scale-out, and other various situations that occur over the lifetime of a distributed system are where Service Fabric moves your service instances to maximize availability.

As services move around in the cluster, there are two scenarios your clients and other services should be prepared to handle when talking to a service:

 + The service instance or partition replica has moved since the last time you talked to it. This is a normal part of a service lifecycle and should be expected to happen during the lifetime of your application.
 + The service instance or partition replica is in the process of moving. Although failover of a service from one node to another occurs very quickly in Service Fabric, there may be a delay in availability if the communication component of your service is slow to start.

Handling these scenarios gracefully is important for a smooth-running system. To do so, we need to make a few considerations:

+ Every service that can be connected to has an *address* that it listens on (HTTP, WebSockets, etc.). When a service instance or partition has moved, its address endpoint will change (it's been moved to a different node with a different IP address). If you're using the built-in communication components, they will handle re-resolving service addresses for you. 
+ There may be a temporary increase in service latency as the service instance starts up its listener again, depending on how quickly the service opens it after being moved.
+ Any existing connections will need to be closed and re-opened again when the service opens on a new node. A graceful node shut down or restart allows time for existing connections to be gracefully shut down.

### Test it: move service instances

Using Service Fabric's Testability tools, we can author a test scenario to test these situations in different ways.

1. Move a stateful service's primary replica.
 
    The primary replica of a stateful service partition can be moved for any number of reasons. Use this to target the primary replica of a specific partition to see how your services react to the move in a very controlled manner.

    ```powershell

    PS > Move-ServiceFabricPrimaryReplica -PartitionId 6faa4ffa-521a-44e9-8351-dfca0f7e0466 -ServiceName fabric:/MyApplication/MyService

    ```

2. Stop a node.

    When a node is stopped, Service Fabric will move all the services instances or partitions that were on that node to one of the other available nodes in the cluster. Use this to test a stituation where a node is lost from your cluster and all of the service instances and replicas on that node have to move.

    A node can be stopped using the Stop-ServiceFabricNode PowerShell cmdlet:

    ```powershell

    PS > Restart-ServiceFabricNode -NodeName Node.1

    ```

    
    


### Service Availability

Service Fabric is a platform that is designed to provide high-availability of your services. However, underlying infrastructure problems can still cause unavailability in extreme cases. Thus it is important to also test for such a scenario.

Stateful services use a quorum-based system for replicating state for high-availability. This means a quorum of replicas need to be available in order to perform write operations. In rare cases, such as widespread hardware failure, a quorum of replicas may not be available. In this case, you will not be able to perform write operations, but you will still be able to perfom read operations.

### Test it: write operation unavailability

Service Fabric's Testability tools allow you to inject a fault that induces quorum loss to test this type of scenario. Although rare, it is important that clients and services that depend on stateful service are prepared to handle situations where they cannot make write requests to the stateful service. At the same time it is also important that the stateful service itself is aware of this possibiliy and can gracefully communicate it to callers. 

Quorum loss can be induced using the Invoke-ServiceFabricPartitionQuorumLoss PowerShell cmdlet:

```powershell

PS > Invoke-ServiceFabricPartitionQuorumLoss -ServiceName fabric:/Myapplication/MyService -QuorumLossMode PartialQuorumLoss -QuorumLossDurationInSeconds 20

```

In this example, we set `QuorumLossMode` to `PartialQuorumLoss` to indicate we want to induce quorum loss without taking down all replicas, so that read operations are still possible. To test a scenario where an entire partition is unavailable, you can set this switch to `FullQuorumLoss`.

## Next steps

[Learn more about Testability Actions](service-fabric-testability-actions.md)

[Learn more about Testability Scenarios](service-fabric-testability-scenarios.md) 
