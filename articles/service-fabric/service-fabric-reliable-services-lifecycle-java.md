---
title: Azure Service Fabric Reliable Services lifecycle | Microsoft Docs
description: Learn about the lifecycle events in Service Fabric Reliable Services.
services: service-fabric
documentationcenter: java
author: PavanKunapareddyMSFT
manager: chackdan

ms.assetid:
ms.service: service-fabric
ms.devlang: java
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/30/2017
ms.author: pakunapa
---

# Reliable Services lifecycle
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-lifecycle.md)
> * [Java on Linux](service-fabric-reliable-services-lifecycle-java.md)
>
>

Reliable Services is one of the programming models available in Azure Service Fabric. When learning about the lifecycle of Reliable Services, it's most important to understand the basic lifecycle events. The exact ordering of events depends on configuration details. 

In general, the Reliable Services lifecycle includes the following events:

* During startup:
  * Services are constructed.
  * Services have an opportunity to construct and return zero or more listeners.
  * Any returned listeners are opened, for communication with the service.
  * The service's `runAsync` method is called, so the service can do long-running or background work.
* During shutdown:
  * The cancellation token that was passed to `runAsync` is canceled, and the listeners are closed.
  * The service object itself is destructed.

The order of events in Reliable Services might change slightly depending on whether the reliable service is stateless or stateful. 

Also, for stateful services, you must address the primary swap scenario. During this sequence, the role of primary is transferred to another replica (or comes back) without the service shutting down. 

Finally, you have to think about error or failure conditions.

## Stateless service startup
The lifecycle of a stateless service is fairly straightforward. Here's the order of events:

1. The service is constructed.
2. These events occur in parallel:
    - `StatelessService.createServiceInstanceListeners()` is invoked, and any returned listeners are opened. `CommunicationListener.openAsync()` is called on each listener.
    - The service's `runAsync` method (`StatelessService.runAsync()`) is called.
3. If present, the service's own `onOpenAsync` method is called. Specifically, `StatelessService.onOpenAsync()` is called. This is an uncommon override, but it is available.

It's important to note that there is no ordering between the call to create and open the listeners and the call to `runAsync`. The listeners might open before `runAsync` is started. Similarly, `runAsync` might be invoked before the communication listeners are open, or before they have even been constructed. If any synchronization is required, it must be done by the implementer. Here are some common solutions:

* Sometimes listeners can't function until other information is created or other work is done. For stateless services, that work usually can be done in the service's constructor. It can be done during the `createServiceInstanceListeners()` call, or as part of the construction of the listener itself.
* Sometimes the code in `runAsync` won't start until the listeners are open. In this case, additional coordination is necessary. A common solution is to add a flag in the listeners. The flag indicates when the listeners have finished. The `runAsync` method checks this before continuing the actual work.

## Stateless service shutdown
When shutting down a stateless service, the same pattern is followed, but in reverse:

1. These events occur in parallel:
    - Any open listeners are closed. `CommunicationListener.closeAsync()` is called on each listener.
    - The cancellation token that was passed to `runAsync()` is canceled. Checking the cancellation token's `isCancelled` property returns `true`, and if called, the token's `throwIfCancellationRequested` method throws a `CancellationException`.
2. When `closeAsync()` finishes on each listener and `runAsync()` also finishes, the service's `StatelessService.onCloseAsync()` method is called, if it's present. Again, this is not a common override, but it can be used to safely close resources, stop background processing, finish saving external state, or close down existing connections.
3. After `StatelessService.onCloseAsync()` finishes, the service object is destructed.

## Stateful service startup
Stateful services have a pattern that is similar to stateless services, with a few changes.  Here's the order of events for starting a stateful service:

1. The service is constructed.
2. `StatefulServiceBase.onOpenAsync()` is called. This call is not commonly overridden in the service.
3. These events occur in parallel:
    - `StatefulServiceBase.createServiceReplicaListeners()` is invoked. 
      - If the service is a primary service, all returned listeners are opened. `CommunicationListener.openAsync()` is called on each listener.
      - If the service is a secondary service, only listeners marked as `listenOnSecondary = true` are opened. Having listeners that are open on secondaries is less common.
    - If the service is currently a primary, the service's `StatefulServiceBase.runAsync()` method is called.
4. After all the replica listener's `openAsync()` calls finish and `runAsync()` is called, `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

Similar to stateless services, in stateful service, there's no coordination between the order in which the listeners are created and opened and when `runAsync` is called. If you need coordination, the solutions are much the same. But there's one additional case for stateful service. Say that the calls that arrive at the communication listeners require information kept inside some [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). Because the communication listeners might open before the Reliable Collections are readable or writeable, and before `runAsync` starts, some additional coordination is necessary. The simplest and most common solution is for the communication listeners to return an error code. The client uses the error code to know to retry the request.

## Stateful service shutdown
Like stateless services, the lifecycle events during shutdown are the same as during startup, but reversed. When a stateful service is being shut down, the following events occur:

1. These events occur in parallel:
    - Any open listeners are closed. `CommunicationListener.closeAsync()` is called on each listener.
    - The cancellation token that was passed to `runAsync()` is canceled. A call to the cancellation token's `isCancelled()` method returns `true`, and if called, the token's `throwIfCancellationRequested()` method throws an `OperationCanceledException`.
2. After `closeAsync()` finishes on each listener and `runAsync()` also finishes, the service's `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

   > [!NOTE]  
   > Waiting for `runAsync` to finish is necessary only if this replica is a primary replica.

3. After the `StatefulServiceBase.onChangeRoleAsync()` method finishes, the `StatefulServiceBase.onCloseAsync()` method is called. This call is an uncommon override, but it is available.
3. After `StatefulServiceBase.onCloseAsync()` finishes, the service object is destructed.

## Stateful service primary swaps
While a stateful service is running, communication listeners are opened and the `runAsync` method is called only for the primary replicas of that stateful services. Secondary replicas are constructed, but see no further calls. While a stateful service is running, the replica that's currently the primary can change. The lifecycle events that a stateful replica can see depends on whether it is the replica being demoted or promoted during the swap.

### For the demoted primary
Service Fabric needs the primary replica that's demoted to stop processing messages and stop any background work. This step is similar to when the service is shut down. One difference is that the service isn't destructed or closed, because it remains as a secondary. The following events occur:

1. These events occur in parallel:
    - Any open listeners are closed. `CommunicationListener.closeAsync()` is called on each listener.
    - The cancellation token that was passed to `runAsync()` is canceled. A check of the cancellation token's `isCancelled()` method returns `true`. If called, the token's `throwIfCancellationRequested()` method throws an `OperationCanceledException`.
2. After `closeAsync()` finishes on each listener and `runAsync()` also finishes, the service's `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

### For the promoted secondary
Similarly, Service Fabric needs the secondary replica that's promoted to start listening for messages on the wire, and to start any background tasks that it needs to complete. This process is similar to when the service is created. The difference is that the replica itself already exists. The following events occur:

1. These events occur in parallel:
    - `StatefulServiceBase.createServiceReplicaListeners()` is invoked and any returned listeners are opened. `CommunicationListener.openAsync()` is called on each listener.
    - The service's `StatefulServiceBase.runAsync()` method is called.
2. After all the replica listener's `openAsync()` calls finish and `runAsync()` is called, `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

### Common issues during stateful service shutdown and primary demotion
Service Fabric changes the primary of a stateful service for multiple reasons. The most common reasons are [cluster rebalancing](service-fabric-cluster-resource-manager-balancing.md) and [application upgrade](service-fabric-application-upgrade.md). During these operations, it's important that the service respects the `cancellationToken`. This also applies during normal service shutdown, such as if the service was deleted.

Services that don't handle cancellation cleanly can experience several issues. These operations are slow because Service Fabric waits for the services to stop gracefully. This can ultimately lead to failed upgrades that time out and rollback. Failure to honor the cancellation token also can cause imbalanced clusters. Clusters become unbalanced because nodes get hot. However, the services can't be rebalanced because it takes too long to move them elsewhere. 

Because the services are stateful, it's also likely that the services use [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). In Service Fabric, when a primary is demoted, one of the first things that happens is that write access to the underlying state is revoked. This leads to a second set of issues that might affect the service lifecycle. The collections return exceptions based on the timing and whether the replica is being moved or shut down. It's important to handle these exceptions correctly. 

Exceptions thrown by Service Fabric are either permanent [(`FabricException`)](https://docs.microsoft.com/java/api/system.fabric.exception) or transient [(`FabricTransientException`)](https://docs.microsoft.com/java/api/system.fabric.exception.fabrictransientexception). Permanent exceptions should be logged and thrown. Transient exceptions can be retried based on retry logic.

An important part of testing and validating Reliable Services is handling the exceptions that come from using the `ReliableCollections` in conjunction with service lifecycle events. We recommend that you always run your service under load. You should also perform upgrades and [chaos testing](service-fabric-controlled-chaos.md) before deploying to production. These basic steps help ensure that your service is implemented correctly, and that it handles lifecycle events correctly.

## Notes on service lifecycle
* Both the `runAsync()` method and the `createServiceInstanceListeners/createServiceReplicaListeners` calls are optional. A service might have one, both, or neither. For example, if the service does all its work in response to user calls, there's no need for it to implement `runAsync()`. Only the communication listeners and their associated code are necessary.  Similarly, creating and returning communication listeners is optional. The service might have only background work to do, so it only needs to implement `runAsync()`.
* It's valid for a service to complete `runAsync()` successfully and return from it. This isn't considered a failure condition. It represents the background work of the service finishing. For stateful Reliable Services, `runAsync()` would be called again if the service is demoted from primary, and then promoted back to primary.
* If a service exits from `runAsync()` by throwing some unexpected exception, this is a failure. The service object is shut down, and a health error is reported.
* Although there's no time limit on returning from these methods, you immediately lose the ability to write. Therefore, you can't complete any real work. We recommend that you return as quickly as possible upon receiving the cancellation request. If your service doesn't respond to these API calls in a reasonable amount of time, Service Fabric might forcibly terminate your service. Usually, this happens only during application upgrades or when a service is being deleted. This timeout is 15 minutes by default.
* Failures in the `onCloseAsync()` path result in `onAbort()` being called. This call is a last-chance, best-effort opportunity for the service to clean up and release any resources that they have claimed. This is generally called when a permanent fault is detected on the node, or when Service Fabric cannot reliably manage the service instance's lifecycle due to internal failures.
* `OnChangeRoleAsync()` is called when the stateful service replica is changing role, for example to primary or secondary. Primary replicas are given write status (are allowed to create and write to Reliable Collections). Secondary replicas are given read status (can only read from existing Reliable Collections). Most work in a stateful service is performed at the primary replica. Secondary replicas can perform read-only validation, report generation, data mining, or other read-only jobs.

## Next steps
* [Introduction to Reliable Services](service-fabric-reliable-services-introduction.md)
* [Reliable Services quickstart](service-fabric-reliable-services-quick-start-java.md)

