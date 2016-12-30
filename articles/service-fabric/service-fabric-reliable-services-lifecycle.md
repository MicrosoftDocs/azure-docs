---
title: Overview of the lifecycle of Reliable Services | Microsoft Docs
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
ms.date: 12/30/2016
ms.author: masnider;
---

#Reliable Services Lifecycle Overview
When thinking about the lifecycles of Reliable Services, the basics of the lifecycle are the most important. In general:

* During Startup
  * Services are constructed
  * They have an opportunity to construct and return zero or more listeners
  * Any returned listeners are opened, allowing communication with the service
  * The Service's RunAsync method is called, allowing the service to do long running or background work
* During shutdown
  * The cancellation token passed to RunAsync is cancelled, and the listeners are closed
  * Once that is complete the service object itself is destructed

However, there are a lot of details around the exact ordering of these events. In particular the order of events may change slightly depending on whether the Reliable Service is Stateless or Stateful. In addition, for stateful services, we have to deal with the Primary swap scenario, where the role of Primary is transferred to another replica (or comes back) without the service fully shutting down.

In this article we will go through each of these scenarios in detail.

## Stateless Service startup
The lifecycle of a stateless service is fairly straightforward. Here's the order of events:

1. The Service is constructed
2. Then, in parallel two things happen:
    - `StatelessService.CreateServiceInstanceListeners()` is invoked and any returned listeners are Opened (`ICommunicationListener.OpenAsync()` is called on each listener)
    - The service's RunAsync method (`StatelessService.RunAsync()`) is called
3. Then the service's own OnOpenAsync method is called, if present (`StatelessService.OnOpenAsync()` is called This is an uncommon override but it is available).

It is important to note that there is no ordering between the calls to create and open the listeners and RunAsync. The listeners may open before RunAsync is started; similarly RunAsync may end up invoked before the communication listeners are open or have even been constructed. If any synchronization is required, it is left as an exercise to the implementer. Common solutions:

* If the listeners can't function until some other information is created or work done, for stateless services that work can usually be done in the service's constructor, during the `CreateServiceInstanceListeners()` call, or as a part of the construction of the listener itself.
* If the code in RunAsync does not want to start until the listeners are open, then some additional coordination is necessary, such as setting some flag within the listener(s) indicating when they have completed, which is checked in RunAsync before continuing to actual work.

## Stateless Service shutdown
When shutting down a stateless service, the same pattern is followed, just in reverse:

1. In parallel
    - Any open listeners are Closed (`ICommunicationListener.CloseAsync()` is called on each listener)
    - The cancellation token passed to `RunAsync()` is Cancelled (checking the cancellation token's `IsCancellationRequested` property will return true, and if called the token's `ThrowIfCancellationRequested` method will return an `OperationCancelledException`)
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes, the service's `StatelessService.OnCloseAsync()` method is called, if present (again this is an uncommon override but it is available).
3. After `StatelessService.OnCloseAsync()` completes, the service object is destructed

## Stateful Service Startup
Stateful services have a similar pattern to stateless services, with a few changes. When starting up a stateful service, the order of events is as follows:

1. The Service is constructed
2. `StatefulServiceBase.OnOpenAsync()` is called. (This is uncommonly overridden in the service.)
3. If the service replica in question is the Primary, then the following things happen in parallel, otherwise the service skips to step 4
    - `StatefulServiceBase.CreateServiceReplicaListeners()` is invoked and any returned listeners are Opened (`ICommunicationListener.OpenAsync()` is called on each listener)
    - The service's RunAsync method (`StatefulServiceBase.RunAsync()`) is called
4. Once all the replica listener's `OpenAsync()` calls complete and `RunAsync()` has been started (or these steps were skipped because this is a secondary), `StatefulServiceBase.OnChangeRoleAsync()` is called. (This is uncommonly overridden in the service.)

Similarly to statless services, note that there's no coordination between the order in which the listeners are created and opened and RunAsync being called. The solutions are much the same, with one additional case: say that the calls which are showing up to the communication listeners require information which would be kept inside some  [Reliable Collections](service-fabric-reliable-services-reliable-collections.md) in order to work. In this case, since it is possible that the communication listeners are open before the collections would be readable/writeable (and before RunAsync would have had a chance to set them up or populate them with any default information that might be necessary). In this case the simplest and most common solution is just for the communication listeners to return some basic error code which the client can use to know to try the request again.

## Stateful Service Shutdown
Just like with Statless services, the lifecycle events seen when a stateful service is being shut down are basically the same as those during startup, but reversed. When a stateful service is being shut down the following events occur:

1. In parallel
    - Any open listeners are Closed (`ICommunicationListener.CloseAsync()` is called on each listener)
    - The cancellation token passed to `RunAsync()` is Cancelled (checking the cancellation token's `IsCancellationRequested` property will return true, and if called the token's `ThrowIfCancellationRequested` method will return an `OperationCancelledException`)
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes (which should only have been necessary if this service replica was a Primary), the service's `StatefulServiceBase.OnChangeRoleAsync()` is called. (This is uncommonly overridden in the service.)
3. Once the `StatefulServiceBase.OnChangeRoleAsync()` method completes the `StatefulServiceBase.OnCloseAsync()` method is called (again this is an uncommon override but it is available).
3. After `StatefulServiceBase.OnCloseAsync()` completes, the service object is destructed.

## Stateful Service Primary Swaps
While a stateful service is running, only the Primary replicas of that stateful services have their communication listeners opened and their RunAsync method called. The secondary replicas are just constructed. While a stateful service is running however, which replica is currently the Primary can change. What does this mean in terms of the lifecycle events that a replica can see? The behavior the stateful replica will see depends on whether it is the replica being demoted or promoted during the swap.

### For the Primary being Demoted
Service Fabric needs this replica to stop processing messages and quit any background work it is doing, so this is going to look a lot like when the service is being shut down (except the Service won't actually be destructed or closed since it is going to hang around acting as a Secondary). The following APIs are called:

1. In parallel
    - Any open listeners are Closed (`ICommunicationListener.CloseAsync()` is called on each listener)
    - The cancellation token passed to `RunAsync()` is Cancelled (checking the cancellation token's `IsCancellationRequested` property will return true, and if called the token's `ThrowIfCancellationRequested` method will return an `OperationCancelledException`)
2. Once `CloseAsync()` completes on each listener and `RunAsync()` also completes, the service's `StatefulServiceBase.OnChangeRoleAsync()` is called. (This is uncommonly overridden in the service.)

### For the Secondary being Promoted
Similarly, Service Fabric needs this replica to start listening for messages on the wire (if it does that) and start any background tasks it cares about, so this process looks a lot like when the service is created, except the service replica itself already exists.

1. In parallel
    - `StatefulServiceBase.CreateServiceReplicaListeners()` is invoked and any returned listeners are Opened (`ICommunicationListener.OpenAsync()` is called on each listener)
    - The service's RunAsync method (`StatefulServiceBase.RunAsync()`) is called
4. Once all the replica listener's `OpenAsync()` calls complete and `RunAsync()` has been started (or these steps were skipped because this is a secondary), `StatefulServiceBase.OnChangeRoleAsync()` is called. (This is uncommonly overridden in the service.)

## Notes on Service Lifecycle
* Both the `RunAsync()` method and the `CreateServiceReplicaListeners/CreateServiceInstanceListeners` calls are optional. A service may have one of them, both, or neither. For example, if the service does all its work directly in response to user calls only, there is no need for it to implement `RunAsync()`, only the communication listeners and their associated code. Similarly, creating and returning communication listeners is optional, as the service may have only background work to do, and so only needs to implement `RunAsync()`
* While there is no time limit on returning from these methods, you immediately lose the ability to write to Reliable Collections and therefore cannot complete any real work. It is recommended that you return as quickly as possible upon receiving the cancellation request.
* For stateful services, there's additionally an option on ServiceReplicaListeners for them to be started up on secondary replicas. This is uncommon, but the only change in lifecycles is that `CreateServiceReplicaListeners()` will be called (and the resulting listeners Opened) even if the replica is a Secondary. Similary if the replica is later converted into a primary, the listeners will be closed, destructed, and new ones created and Opened as a part of the change to Primary.
* Failures in the `OnOpenAsync()`, and `OnCloseAsync()` paths will result in `OnAbort()` being called which is a last-chance best-effort opportunity for the service to clean up and release any resources that they have claimed.
