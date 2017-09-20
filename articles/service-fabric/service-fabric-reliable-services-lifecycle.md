---
title: Overview of the lifecycle of Azure Service Fabric Reliable Services | Microsoft Docs
description: Learn about the different lifecycle events in Service Fabric reliable services
services: Service-Fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: vturecek;

ms.assetid:
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider
---

# Reliable services lifecycle overview
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-lifecycle.md)
> * [Java on Linux](service-fabric-reliable-services-lifecycle-java.md)
>
>

When thinking about the lifecycles of Reliable Services, the basics of the lifecycle are the most important. In general:

- During Startup
  - Services are constructed
  - They have an opportunity to construct and return zero or more listeners
  - Any returned listeners are opened, allowing communication with the service
  - The Service's RunAsync method is called, allowing the service to do long running or background work
- During shutdown
  - The cancellation token passed to RunAsync is canceled, and the listeners are closed
  - Once that is complete, the service object itself is destructed

There are details around the exact ordering of these events. In particular, the order of events may change slightly depending on whether the Reliable Service is Stateless or Stateful. In addition, for stateful services, we have to deal with the Primary swap scenario. During this sequence, the role of Primary is transferred to another replica (or comes back) without the service shutting down. Finally, we have to think about error or failure conditions.

## Stateless service startup
The lifecycle of a stateless service is fairly straightforward. Here's the order of events:

1. The Service is constructed
2. Then, in parallel two things happen:
    - `StatelessService.CreateServiceInstanceListeners()` is invoked and any returned listeners are Opened. `ICommunicationListener.OpenAsync()` is called on each listener
    - The service's `StatelessService.RunAsync()` method is called
3. If present, the service's `StatelessService.OnOpenAsync()` method is called. This is an uncommon override, but it is available.

It is important to note that there is no ordering between the calls to create and open the listeners and RunAsync. The listeners may open before RunAsync is started. Similarly, RunAsync may end up invoked before the communication listeners are open or have even been constructed. If any synchronization is required, it is left as an exercise to the implementer. Common solutions:

  - Sometimes listeners can't function until some other information is created or work done. For stateless services that work can usually be done in other locations, such as: 
    - in the service's constructor
    - during the `CreateServiceInstanceListeners()` call
    - as a part of the construction of the listener itself
  - Sometimes the code in RunAsync does not want to start until the listeners are open. In this case additional coordination is necessary. One common solution is some flag within the listeners indicating when they have completed. This flag is then checked in RunAsync before continuing to actual work.

## Stateless service shutdown
When shutting down a stateless service, the same pattern is followed, just in reverse:

1. In parallel
    - Any open listeners are Closed. `ICommunicationListener.CloseAsync()` is called on each listener.
    - The cancellation token passed to `RunAsync()` is canceled. Checking the cancellation token's `IsCancellationRequested` property returns true, and if called the token's `ThrowIfCancellationRequested` method throws an `OperationCanceledException`.
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes, the service's `StatelessService.OnCloseAsync()` method is called, if present. It is uncommon to override `StatelessService.OnCloseAsync()`.
3. After `StatelessService.OnCloseAsync()` completes, the service object is destructed

## Stateful service Startup
Stateful services have a similar pattern to stateless services, with a few changes. When starting up a stateful service, the order of events is as follows:

1. The Service is constructed
2. `StatefulServiceBase.OnOpenAsync()` is called. This is uncommonly overridden in the service.
3. The following things happen in parallel
    - `StatefulServiceBase.CreateServiceReplicaListeners()` is invoked 
      - If the service is a Primary all returned listeners are Opened. `ICommunicationListener.OpenAsync()` is called on each listener.
      - If the service is a Secondary, only those listeners marked as `ListenOnSecondary = true` are opened. Having listeners that are open on Secondaries is less common.
    - The if the Service is currently a Primary, the service's `StatefulServiceBase.RunAsync()` method is called
4. Once all the replica listener's `OpenAsync()` calls complete and `RunAsync()` is called, `StatefulServiceBase.OnChangeRoleAsync()` is called. This is uncommonly overridden in the service.

Similarly to stateless services, there's no coordination between the order in which the listeners are created and opened and when RunAsync is called. If you need coordination, the solutions are much the same. THere is one additional case: say that the calls arriving at the communication listeners require information kept inside some [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). Because the communication listeners could open before the reliable collections are readable or writeable, and before RunAsync could start, some additional coordination is necessary. The simplest and most common solution is for the communication listeners to return some error code that the client uses to know to retry the request.

## Stateful service Shutdown
Similarly to Stateless services, the lifecycle events during shutdown are the same as during startup, but reversed. When a stateful service is being shut down, the following events occur:

1. In parallel
    - Any open listeners are Closed. `ICommunicationListener.CloseAsync()` is called on each listener.
    - The cancellation token passed to `RunAsync()` is canceled. Checking the cancellation token's `IsCancellationRequested` property returns true, and if called the token's `ThrowIfCancellationRequested` method throws an `OperationCanceledException`.
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes, the service's `StatefulServiceBase.OnChangeRoleAsync()` is called. (This is uncommonly overridden in the service.)
    - Waiting for RunAsync to complete is only necessary if this service replica was a Primary.
3. Once the `StatefulServiceBase.OnChangeRoleAsync()` method completes, the `StatefulServiceBase.OnCloseAsync()` method is called. This is an uncommon override, but it is available.
3. After `StatefulServiceBase.OnCloseAsync()` completes, the service object is destructed.

## Stateful service primary swaps
While a stateful service is running, only the Primary replicas of that stateful services have their communication listeners opened and their RunAsync method called. Secondary are constructed but see no further calls. While a stateful service is running however, which replica is currently the Primary can change. What does this mean in terms of the lifecycle events that a replica can see? The behavior the stateful replica sees depends on whether it is the replica being demoted or promoted during the swap.

### For the primary being demoted
Service Fabric needs this replica to stop processing messages and quit any background work it is doing. As a result, this step looks similar to when the service is being shut down. One difference is that the Service isn't destructed or closed since it remains as a Secondary. The following APIs are called:

1. In parallel
    - Any open listeners are Closed. `ICommunicationListener.CloseAsync()` is called on each listener.
    - The cancellation token passed to `RunAsync()` is canceled. Checking the cancellation token's `IsCancellationRequested` property returns true, and if called the token's `ThrowIfCancellationRequested` method throws an `OperationCanceledException`.
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes, the service's `StatefulServiceBase.OnChangeRoleAsync()` is called. This is uncommonly overridden in the service.

### For the secondary being promoted
Similarly, Service Fabric needs this replica to start listening for messages on the wire and start any background tasks it cares about. As a result, this process looks similar to when the service is created, except that the replica itself already exists. The following APIs are called:

1. In parallel
    - `StatefulServiceBase.CreateServiceReplicaListeners()` is invoked and any returned listeners are Opened. `ICommunicationListener.OpenAsync()` is called on each listener.
    - The service's `StatefulServiceBase.RunAsync()` method is called
2. Once all the replica listener's `OpenAsync()` calls complete and `RunAsync()` has been called,  `StatefulServiceBase.OnChangeRoleAsync()` is called. This is uncommonly overridden in the service.

### Common issues during stateful service shutdown and primary demotion
Service Fabric changes the Primary of a stateful service for a variety of reasons. The most common are [cluster rebalancing](service-fabric-cluster-resource-manager-balancing.md) and [application upgrade](service-fabric-application-upgrade.md). During these operations (as well as during normal service shutdown, like you'd see if the service was deleted), it is important that the service respect the `CancellationToken`. Services that do not handle cancellation cleanly will experience several issues. In particular, these operations will be slow since Service Fabric waits for the services to stop gracefully. This can ultimately lead to failed upgrades that time out and roll back. Failure to honor the cancellation token can also cause imbalanced clusters because nodes get hot but the services can't be rebalanced since it takes too long to move them elsewhere. 

Since the services are stateful, it is also likely that they are using the [Reliable Collections](service-fabric-reliable-services-reliable-collections.md). In Service Fabric, when a Primary is demoted, one of the first things that happens is that write access to the underlying state is revoked. This leads to a second set of issues that can impact the service lifecycle. The collections return Exceptions based on the timing and whether the replica is being moved or shut down. These exceptions should be handled correctly. Exceptions thrown by Service Fabric fall into permanent [(`FabricException`)](https://docs.microsoft.com/en-us/dotnet/api/system.fabric.fabricexception?view=azure-dotnet) and transient [(`FabricTransientException`)](https://docs.microsoft.com/en-us/dotnet/api/system.fabric.fabrictransientexception?view=azure-dotnet) categories. Permanent exceptions should be logged and thrown, while the transient exceptions may be retried based on some retry logic.

Handling the exceptions that come from use of the `ReliableCollections` in conjunction with service lifecycle events is an important part of testing and validating a Reliable Service. The recommendation is always to run your service under load while performing upgrades and [chaos testing](service-fabric-controlled-chaos.md) before ever deploying to production. These basic steps help ensure that your service is correctly implemented and handles lifecycle events correctly.


## Notes on service lifecycle
  - Both the `RunAsync()` method and the `CreateServiceReplicaListeners/CreateServiceInstanceListeners` calls are optional. A service may have one of them, both, or neither. For example, if the service does all its work in response to user calls, there is no need for it to implement `RunAsync()`. Only the communication listeners and their associated code are necessary. Similarly, creating and returning communication listeners is optional, as the service may have only background work to do, and so only needs to implement `RunAsync()`
  - It is valid for a service to complete `RunAsync()` successfully and return from it. Completing is not a failure condition. Completing `RunAsync()` indicates that the background work of the service has completed. For stateful reliable services, `RunAsync()` is called again if the replica were demoted from Primary to Secondary and then promoted back to Primary.
  - If a service exits from `RunAsync()` by throwing some unexpected exception, this constitutes a failure. The service object is shut down and a health error reported.
  - While there is no time limit on returning from these methods, you immediately lose the ability to write to Reliable Collections and therefore cannot complete any real work. It is recommended that you return as quickly as possible upon receiving the cancellation request. If your service does not respond to these API calls in a reasonable amount of time Service Fabric may forcibly terminate your service. Usually this only happens during application upgrades or when a service is being deleted. This timeout is 15 minutes by default.
  - Failures in the `OnCloseAsync()` path result in `OnAbort()` being called which is a last-chance best-effort opportunity for the service to clean up and release any resources that they have claimed.

## Next steps
- [Introduction to Reliable Services](service-fabric-reliable-services-introduction.md)
- [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
- [Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)
