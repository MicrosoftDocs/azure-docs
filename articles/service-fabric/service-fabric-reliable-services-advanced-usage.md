---
title: Advanced usage of Reliable Services | Microsoft Docs
description: Learn about advanced usage of Service Fabric's Reliable Services for added flexibility in your services.
services: Service-Fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: masnider

ms.assetid: f2942871-863d-47c3-b14a-7cdad9a742c7
ms.service: Service-Fabric
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/10/2017
ms.author: vturecek

---
# Advanced usage of the Reliable Services programming model
Azure Service Fabric simplifies writing and managing reliable stateless and stateful services. This guide talks about advanced usages of Reliable Services to gain more control and flexibility over your services. Prior to reading this guide, familiarize yourself with [the Reliable Services programming model](service-fabric-reliable-services-introduction.md).

Both stateful and stateless services have two primary entry points for user code:

* `RunAsync(C#) / runAsync(Java)` is a general-purpose entry point for your service code.
* `CreateServiceReplicaListeners(C#)` and `CreateServiceInstanceListeners(C#) / createServiceInstanceListeners(Java)` is for opening communication listeners for client requests.

For most services, these two entry points are sufficient. In rare cases when more control over a service's lifecycle is required, additional lifecycle events are available.

## Stateless service instance lifecycle
A stateless service's lifecycle is very simple. A stateless service can only be opened, closed, or aborted. `RunAsync` in a stateless service is executed when a service instance is opened, and canceled when a service instance is closed or aborted.

Although `RunAsync` should be sufficient in almost all cases, the open, close, and abort events in a stateless service are also available:

* `Task OnOpenAsync(IStatelessServicePartition, CancellationToken) - C# / CompletableFuture<String> onOpenAsync(CancellationToken) - Java`
    OnOpenAsync is called when the stateless service instance is about to be used. Extended service initialization tasks can be started at this time.
* `Task OnCloseAsync(CancellationToken) - C# / CompletableFuture onCloseAsync(CancellationToken) - Java`
    OnCloseAsync is called when the stateless service instance is going to be gracefully shut down. This can occur when the service's code is being upgraded, the service instance is being moved due to load balancing, or a transient fault is detected. OnCloseAsync can be used to safely close any resources, stop any background processing, finish saving external state, or close down existing connections.
* `void OnAbort() - C# / void onAbort() - Java`
    OnAbort is called when the stateless service instance is being forcefully shut down. This is generally called when a permanent fault is detected on the node, or when Service Fabric cannot reliably manage the service instance's lifecycle due to internal failures.

## Stateful service replica lifecycle

> [!NOTE]
> Stateful reliable services are not supported in Java yet.
>
>

A stateful service replica's lifecycle is much more complex than a stateless service instance. In addition to open, close, and abort events, a stateful service replica undergoes role changes during its lifetime. When a stateful service replica changes role, the `OnChangeRoleAsync` event is triggered:

* `Task OnChangeRoleAsync(ReplicaRole, CancellationToken)`
    OnChangeRoleAsync is called when the stateful service replica is changing role, for example to primary or secondary. Primary replicas are given write status (are allowed to create and write to Reliable Collections). Secondary replicas are given read status (can only read from existing Reliable Collections). Most work in a stateful service is performed at the primary replica. Secondary replicas can perform read-only validation, report generation, data mining, or other read-only jobs.

In a stateful service, only the primary replica has write access to state and thus is generally when the service is performing actual work. The `RunAsync` method in a stateful service is executed only when the stateful service replica is primary. The `RunAsync` method is canceled when a primary replica's role changes away from primary, as well as during the close and abort events.

Using the `OnChangeRoleAsync` event allows you to perform work depending on replica role as well as in response to role change.

A stateful service also provides the same four lifecycle events as a stateless service, with the same semantics and use cases:

```csharp
* Task OnOpenAsync(IStatefulServicePartition, CancellationToken)
* Task OnCloseAsync(CancellationToken)
* void OnAbort()
```

## Next steps
For more advanced topics related to Service Fabric, see the following articles:

* [Configuring stateful Reliable Services](service-fabric-reliable-services-configuration.md)
* [Service Fabric health introduction](service-fabric-health-introduction.md)
* [Using system health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
* [Configuring Services with the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-configure-services.md)
