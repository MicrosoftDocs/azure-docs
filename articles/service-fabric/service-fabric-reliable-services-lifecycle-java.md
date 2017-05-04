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
ms.date: 03/09/2017
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
    - The cancellation token passed to `runAsync()` is canceled (checking the cancellation token's `isCancelled` property returns true, and if called the token's `throwIfCancellationRequested` method returns an `CancellationException`)
2. Once `closeAsync()` completes on each listener and `runAsync()` also completes, the service's `StatelessService.onCloseAsync()` method is called, if present (again this is an uncommon override).
3. After `StatelessService.onCloseAsync()` completes, the service object is destructed

## Notes on service lifecycle
* Both the `runAsync()` method and the `createServiceInstanceListeners` calls are optional. A service may have one of them, both, or neither. For example, if the service does all its work in response to user calls, there is no need for it to implement `runAsync()`. Only the communication listeners and their associated code are necessary. Similarly, creating and returning communication listeners is optional, as the service may have only background work to do, and so only needs to implement `runAsync()`
* It is valid for a service to complete `runAsync()` successfully and return from it. This is not considered a failure condition and would represent the background work of the service completing. For stateful reliable services `runAsync()` would be called again if the service were demoted from primary and then promoted back to primary.
* If a service exits from `runAsync()` by throwing some unexpected exception, this is a failure and the service object is shut down and a health error reported.
* While there is no time limit on returning from these methods, you immediately lose the ability to write and therefore cannot complete any real work. It is recommended that you return as quickly as possible upon receiving the cancellation request. If your service does not respond to these API calls in a reasonable amount of time Service Fabric may forcibly terminate your service. Usually this only happens during application upgrades or when a service is being deleted. This timeout is 15 minutes by default.
* Failures in the `onCloseAsync()` path result in `onAbort()` being called which is a last-chance best-effort opportunity for the service to clean up and release any resources that they have claimed.

> [!NOTE]
> Stateful reliable services are not supported in java yet.
>
>

## Next steps
* [Introduction to Reliable Services](service-fabric-reliable-services-introduction.md)
* [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
* [Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)
