<properties
   pageTitle="How Fabric Actors use the Service Fabric platform"
   description="This articles describes how Fabric Actors use the features of the Service Fabric platform. It covers Service Fabric platform concepts from the point of view of actor developers."
   services="service-fabric"
   documentationCenter=".net"
   authors="abhishekram"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/23/2015"
   ms.author="abhisram"/>

# How Fabric Actors use the Service Fabric platform

## Service Fabric application model concepts for actors
Actors use the Service Fabric application model to manage the application lifecycle. Every Actor type is mapped to a Service Fabric [Service type](service-fabric-application-model.md#describe-a-service). The actor code is [packaged](service-fabric-application-model.md#package-an-application) as a Service Fabric application and [deployed](service-fabric-deploy-remove-applications.md#deploy-an-application) to the cluster. Subsequent management (i.e. upgrades and eventual deletion) of the application is also performed using Service Fabric application management mechanisms. For more information, please see the topics on the [application model](service-fabric-application-model.md), [application deployment and removal](service-fabric-deploy-remove-applications.md), and [application upgrade](service-fabric-application-upgrade.md).

## Scalability for actor services
Cluster administrators can create one or more actor services of each service type in the cluster. Each of those actor services can have one or more partitions (similar to any other Service Fabric service). The ability to create multiple services of a service type (which maps to an actor type) and the ability to create multiple partitions for a service allow the actor application to scale. Please see the article on [scalability](service-fabric-concepts-scalability.md) for more information.

## Service Fabric partition concepts for stateless actors
Stateless actors are created within a partition of a Service Fabric stateless service. The actor ID determines which partition the actor is created under. The actor is created inside one or more [instances](service-fabric-availability-services.md#availability-of-service-fabric-stateless-services) within that partition. Indeed, it is possible that multiple instances within a partition each have an active actor with the same actor ID.

> [AZURE.TIP] The Fabric Actors runtime emits some [events related to stateless actor instances](service-fabric-fabact-diagnostics.md#events-related-to-stateless-actor-instances). They are useful in diagnostics and performance monitoring.

## Service Fabric partition concepts for stateful actors
Stateful actors are created within a partition of the Service Fabric stateful service. The actor ID determines which partition the actor is created under. Each partition of the service can have one or more [replicas](service-fabric-availability-services.md#availability-of-service-fabric-stateful-services) that are placed on different nodes in the cluster. Having multiple replicas provides reliability for the actor state. The resource manager optimizes the placement based on the available fault and upgrade domains in the cluster. Two replicas of the same partition are never placed on the same node. The actors are always created in the primary replica of the partition to which their actor ID maps to.

> [AZURE.TIP] The Fabric Actors runtime emits some [events related to stateful actor replicas](service-fabric-fabact-diagnostics.md#events-related-to-stateful-actor-replicas). They are useful in diagnostics and performance monitoring.

## Actor state provider choices
There are some default actor state providers that are included in the Actors runtime. In order to choose an appropriate state provider for an actor service, it is necessary to understand how the state providers use the underlying Service Fabric platform features to make the actor state highly available.

By default a stateful actor uses key value store actor state provider. This state provider is built on the distributed Key-Value store provided by Service Fabric platform. The state is durably saved on the local disk of the node hosting the primary [replica](service-fabric-availability-services.md#availability-of-service-fabric-stateful-services), as well as replicated and durably saved on the local disks of nodes hosting the secondary replicas. The state save is complete only when a quorum of replicas has committed the state to their local disks. The Key-Value store has advanced capabilities to detect inconsistencies such as false progress and correct them automatically.

The Actors runtime also includes a `VolatileActorStateProvider`. This state provider replicates the state to replicas but the state remains in-memory on the replica. If one replica goes down and comes back up, its state is rebuilt from the other replica. However if all of the replicas (copies of the state) go down simultaneously the state data will be lost. Therefore, this state provider is suitable for applications where the data can survive failures of few replicas and can survive the planned failovers such as upgrades. If all replicas (copies) are lost, then the data needs to be recreated using mechanisms external to Service Fabric. You can configure your stateful actor to use volatile actor state provider by adding the `VolatileActorStateProvider` attribute to the actor class or an assembly level attribute.

The following code snippet shows how to changes all actors in the assembly that does not have an explicit state provider attribute to use `VolatileActorStateProvider`.

```csharp
[assembly:Microsoft.ServiceFabric.Actors.VolatileActorStateProvider]
```

The following code snippet shows how to change the state provider for a particular actor type, `VoicemailBox` in this case, to be `VolatileActorStateProvider`.

```csharp
[VolatileActorStateProvider]
public class VoicemailBoxActor : Actor<VoicemailBox>, IVoicemailBoxActor
{
    public Task<List<Voicemail>> GetMessagesAsync()
    {
        return Task.FromResult(State.MessageList);
    }
    ...
}
```

Please note that changing the state provider requires the actor service to be recreated. State providers cannot be changed as part of the application upgrade.
