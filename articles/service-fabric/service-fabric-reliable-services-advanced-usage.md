<properties
   pageTitle="Advanced usage of the Reliable Services programming model | Microsoft Azure"
   description="Learn about advanced usage of Service Fabric's Reliable Service programming model for added flexibility in your services."
   services="Service-Fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor="masnider"/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/17/2015"
   ms.author="jesseb"/>

# Advanced usage of the Reliable Services programming model
Azure Service Fabric simplifies writing and managing reliable stateless and stateful services. This guide will talk about advanced usages of the Reliable Services programming model to gain more control and flexibility over your services. Prior to reading this guide, familiarize yourself with [the Reliable Services programming model](service-fabric-reliable-services-introduction.md).

## Base classes for stateless services
The StatelessService base class provides RunAsync() and CreateServiceInstanceListeners(), which is sufficient for the majority of stateless services. The StatelessServiceBase class underlies StatelessService and exposes additional service lifecycle events. You can derive from StatelessServiceBase if you need additional control or flexibility. See the developer reference documentation on [StatelessService](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.services.statelessservice.aspx) and [StatelessServiceBase](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.services.statelessservicebase.aspx) for more information.

- `void OnInitialize(StatelessServiceInitializiationParameters)`
    OnInitialize is the first method called by Service Fabric. Service initialization information is provided, such as the service name, partition ID, instance ID, and code package information. No complex processing should be done here. Lengthy initialization should be done in OnOpenAsync.

- `Task OnOpenAsync(IStatelessServicePartition, CancellationToken)`
    OnOpenAsync is called when the stateless service instance is about to be used. Extended service initialization tasks can be started at this time.

- `Task OnCloseAsync(CancellationToken)`
    OnCloseAsync is called when the stateless service instance is going to be gracefully shut down. This can occur when the service's code is being upgraded, the service instance is being moved due to load balancing, or a transient fault is detected. OnCloseAsync can be used to safely close any resources, stop any background processing, finish saving external state, or close down existing connections.

- `void OnAbort()`
    OnAbort is called when the stateless service instance is being forcefully shut down. This is generally called when a permanent fault is detected on the node, or when Service Fabric cannot reliably manage the service instance's lifecycle due to internal failures.

## Base classes for stateful services
The StatefulService base class should be sufficient for most stateful services. Similar to stateless services, the StatefulServiceBase class underlies StatefulService and exposes additional service lifecycle events. Additionally, you can use it to provide a custom reliable state provider and optionally support communication listeners on secondaries. You can derive from StatefulServiceBase if you need additional control or flexibility. See the developer reference documentation on [StatefulService](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.services.statefulservice.aspx) and [StatefulServiceBase](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.services.statefulservicebase.aspx) for more information.

- `Task OnChangeRoleAsync(ReplicaRole, CancellationToken)`
    OnChangeRoleAsync is called when the stateful service is changing roles, for example to primary or secondary. Primary replicas are given write status (are allowed to create and write to the reliable collections). Secondary replicas are given read status (can only read from existing reliable collections). You can start or update the background tasks in response to role changes, such as performing read-only validation, report generation, or data mining on a secondary.

- `IStateProviderReplica CreateStateProviderReplica()`
    A stateful service is expected to have a reliable state provider. StatefulService uses the ReliableStateManager class, which provides the reliable collections (e.g. dictionaries and queues). You can override this method to configure the ReliableStateManager class by passing a ReliableStateManagerConfiguration to its constructor. You can then provide custom state serializers, specify what happens when data may have been lost, and configure the replicator/state providers.

StatefulServiceBase also provides the same four lifecycle events as StatelessServiceBase, with the same semantics and use cases:

- `void OnInitialize(StatefulServiceInitializiationParameters)`
- `Task OnOpenAsync(IStatefulServicePartition, CancellationToken)`
- `Task OnCloseAsync(CancellationToken)`
- `void OnAbort()`

## Next steps
For more advanced topics related to Service Fabric, see the following articles:

- [Configuring stateful Reliable Services](service-fabric-reliable-services-configuration.md)

- [Service Fabric health introduction](service-fabric-health-introduction.md)

- [Using system health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

- [Placement constraints overview](service-fabric-placement-constraint.md)
