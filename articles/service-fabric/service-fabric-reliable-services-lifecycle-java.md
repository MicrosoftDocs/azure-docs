---
title: Overview of the lifecycle of Azure Service Fabric Reliable Services | Microsoft Docs
description: Learn about the different lifecycle events in Service Fabric reliable services
services: Service-Fabric
documentationcenter: java
author: PavanKunapareddyMSFT
manager: timlt

ms.assetid:
ms.service: Service-Fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/30/2017
ms.author: pakunapa;
---

# Reliable services lifecycle overview
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-lifecycle.md)
> * [Java on Linux](service-fabric-reliable-services-lifecycle-java.md)
>
>

When thinking about the lifecycles of Reliable Services, the basics of the lifecycle are the most important. In general:

* During Startup
  * Services are constructed
  * They have an opportunity to construct and return zero or more listeners
  * Any returned listeners are opened, allowing communication with the service
  * The Service's runAsync method is called, allowing the service to do long running or background work
* During shutdown
  * The cancellation token passed to runAsync is canceled, and the listeners are closed
  * Once that is complete, the service object itself is destructed

There are details around the exact ordering of these events. In particular, the order of events may change slightly depending on whether the Reliable Service is Stateless or Stateful. In addition, for stateful services, we have to deal with the Primary swap scenario. During this sequence, the role of Primary is transferred to another replica (or comes back) without the service shutting down. Finally, we have to think about error or failure conditions.

## Stateless service startup
The lifecycle of a stateless service is fairly straightforward. Here's the order of events:

1. The Service is constructed
2. Then, in parallel two things happen:
    - `StatelessService.createServiceInstanceListeners()` is invoked and any returned listeners are Opened (`CommunicationListener.openAsync()` is called on each listener)
    - The service's runAsync method (`StatelessService.runAsync()`) is called
3. If present, the service's own onOpenAsync method is called (Specifically, `StatelessService.onOpenAsync()` is called. This is an uncommon override but it is available).

It is important to note that there is no ordering between the calls to create and open the listeners and runAsync. The listeners may open before runAsync is started. Similarly, runAsync may end up invoked before the communication listeners are open or have even been constructed. If any synchronization is required, it is left as an exercise to the implementer. Common solutions:

* Sometimes listeners can't function until some other information is created or work done. For stateless services that work can usually be done in the service's constructor, during the `createServiceInstanceListeners()` call, or as a part of the construction of the listener itself.
* Sometimes the code in runAsync does not want to start until the listeners are open. In this case additional coordination is necessary. One common solution is some flag within the listeners indicating when they have completed, which is checked in runAsync before continuing to actual work.

## Stateless service shutdown
When shutting down a stateless service, the same pattern is followed, just in reverse:

1. In parallel
    - Any open listeners are Closed (`CommunicationListener.closeAsync()` is called on each listener)
    - The cancellation token passed to `runAsync()` is canceled (checking the cancellation token's `isCancelled` property returns true, and if called the token's `throwIfCancellationRequested` method throws a `CancellationException`)
2. Once `closeAsync()` completes on each listener and `runAsync()` also completes, the service's `StatelessService.onCloseAsync()` method is called, if present (again this is an uncommon override).
3. After `StatelessService.onCloseAsync()` completes, the service object is destructed

## Stateful service startup
Stateful services have a similar pattern to stateless services, with a few changes. For starting up a stateful service, the order of events is as follows:

1. The service is constructed.
2. `StatefulServiceBase.onOpenAsync()` is called. This call is not commonly overridden in the service.
3. The following things happen in parallel:
    - `StatefulServiceBase.createServiceReplicaListeners()` is invoked. 
      - If the service is a Primary service, all returned listeners are opened. `CommunicationListener.openAsync()` is called on each listener.
      - If the service is a Secondary service, only those listeners marked as `listenOnSecondary = true` are opened. Having listeners that are open on secondaries is less common.
    - If the service is currently a Primary, the service's `StatefulServiceBase.runAsync()` method is called.
4. After all the replica listener's `openAsync()` calls finish and `runAsync()` is called, `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

Similar to stateless services, there's no coordination between the order in which the listeners are created and opened and when **runAsync** is called. If you need coordination, the solutions are much the same. There is one additional case for stateful service. Say that the calls that arrive at the communication listeners require information kept inside some [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). Because the communication listeners could open before the reliable collections are readable or writeable, and before **runAsync** could start, some additional coordination is necessary. The simplest and most common solution is for the communication listeners to return an error code that the client uses to know to retry the request.

## Stateful service shutdown
Like stateless services, the lifecycle events during shutdown are the same as during startup, but reversed. When a stateful service is being shut down, the following events occur:

1. In parallel:
    - Any open listeners are closed. `CommunicationListener.closeAsync()` is called on each listener.
    - The cancellation token passed to `runAsync()` is cancelled. A call to the cancellation token's `isCancelled()` method returns true, and if called, the token's `throwIfCancellationRequested()` method throws an `OperationCanceledException`.
2. After `closeAsync()` finishes on each listener and `runAsync()` also finishes, the service's `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

   > [!NOTE]  
   > The need to wait for **runAsync** to finish is only necessary if this replica is a Primary replica.

3. After the `StatefulServiceBase.onChangeRoleAsync()` method finishes, the `StatefulServiceBase.onCloseAsync()` method is called. This call is an uncommon override, but it is available.
3. After `StatefulServiceBase.onCloseAsync()` finishes, the service object is destructed.

## Stateful service Primary swaps
While a stateful service is running, only the Primary replicas of that stateful services have their communication listeners opened and their **runAsync** method called. Secondary replicas are constructed, but see no further calls. While a stateful service is running, the replica that's currently the Primary can change. What does this mean in terms of the lifecycle events that a replica can see? The behavior the stateful replica sees depends on whether it is the replica being demoted or promoted during the swap.

### For the Primary that's demoted
For the Primary replica that's demoted, Service Fabric needs this replica to stop processing messages and quit any background work it is doing. As a result, this step looks like it did when the service is shut down. One difference is that the service isn't destructed or closed because it remains as a Secondary. The following APIs are called:

1. In parallel:
    - Any open listeners are closed. `CommunicationListener.closeAsync()` is called on each listener.
    - The cancellation token passed to `runAsync()` is canceled. A check of the cancellation token's `isCancelled()` method returns true, and if called, the token's `throwIfCancellationRequested()` method throws an `OperationCanceledException`.
2. After `closeAsync()` finishes on each listener and `runAsync()` also finishes, the service's `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.

### For the Secondary that's promoted
Similarly, Service Fabric needs the Secondary replica that's promoted to start listening for messages on the wire and start any background tasks it needs to complete. As a result, this process looks like it did when the service is created, except that the replica itself already exists. The following APIs are called:

1. In parallel:
    - `StatefulServiceBase.createServiceReplicaListeners()` is invoked and any returned listeners are opened. `CommunicationListener.openAsync()` is called on each listener.
    - The service's `StatefulServiceBase.runAsync()` method is called.
2. After all the replica listener's `openAsync()` calls finish and `runAsync()` is called, `StatefulServiceBase.onChangeRoleAsync()` is called. This call is not commonly overridden in the service.


### Common issues during stateful service shutdown and Primary demotion
Service Fabric changes the Primary of a stateful service for a variety of reasons. The most common are [cluster rebalancing](service-fabric-cluster-resource-manager-balancing.md) and [application upgrade](service-fabric-application-upgrade.md). During these operations (as well as during normal service shutdown, like you'd see if the service was deleted), it is important that the service respect the `cancellationToken`. 

Services that do not handle cancellation cleanly can experience several issues. These operations are slow because Service Fabric waits for the services to stop gracefully. This can ultimately lead to failed upgrades that time out and roll back. Failure to honor the cancellation token can also cause imbalanced clusters. Clusters become unbalanced because nodes get hot, but the services can't be rebalanced because it takes too long to move them elsewhere. 

Because the services are stateful, it is also likely that they use the [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). In Service Fabric, when a Primary is demoted, one of the first things that happens is that write access to the underlying state is revoked. This leads to a second set of issues that can affect the service lifecycle. The collections return exceptions based on the timing and whether the replica is being moved or shut down. These exceptions should be handled correctly. Exceptions thrown by Service Fabric fall into permanent [(`FabricException`)](https://docs.microsoft.com/en-us/java/api/system.fabric.exception) and transient [(`FabricTransientException`)](https://docs.microsoft.com/en-us/java/api/system.fabric.exception._fabric_transient_exception) categories. Permanent exceptions should be logged and thrown while the transient exceptions can be retried based on some retry logic.

Handling the exceptions that come from use of the `ReliableCollections` in conjunction with service lifecycle events is an important part of testing and validating a Reliable Service. We recommend that you always run your service under load while performing upgrades and [chaos testing](service-fabric-controlled-chaos.md) before deploying to production. These basic steps help ensure that your service is correctly implemented and handles lifecycle events correctly.

## Notes on service lifecycle
* Both the `runAsync()` method and the `createServiceInstanceListeners/createServiceReplicaListeners` calls are optional. A service may have one of them, both, or neither. For example, if the service does all its work in response to user calls, there is no need for it to implement `runAsync()`. Only the communication listeners and their associated code are necessary. Similarly, creating and returning communication listeners is optional, as the service may have only background work to do, and so only needs to implement `runAsync()`
* It is valid for a service to complete `runAsync()` successfully and return from it. This is not considered a failure condition and would represent the background work of the service completing. For stateful reliable services `runAsync()` would be called again if the service were demoted from primary and then promoted back to primary.
* If a service exits from `runAsync()` by throwing some unexpected exception, this is a failure and the service object is shut down and a health error reported.
* While there is no time limit on returning from these methods, you immediately lose the ability to write and therefore cannot complete any real work. It is recommended that you return as quickly as possible upon receiving the cancellation request. If your service does not respond to these API calls in a reasonable amount of time Service Fabric may forcibly terminate your service. Usually this only happens during application upgrades or when a service is being deleted. This timeout is 15 minutes by default.
* Failures in the `onCloseAsync()` path result in `onAbort()` being called which is a last-chance best-effort opportunity for the service to clean up and release any resources that they have claimed.

## Next steps
* [Introduction to Reliable Services](service-fabric-reliable-services-introduction.md)
* [Reliable Services quick start](service-fabric-reliable-services-quick-start-java.md)
* [Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)
