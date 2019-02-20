---
title: Manage state in Azure Service Fabric services| Microsoft Docs
description: Learn how to define and manage service state in Service Fabric services.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: f5e618a5-3ea3-4404-94af-122278f91652
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider

---
# Service state
**Service state** refers to the in-memory or on disk data that a service requires to function. It includes, for example, the data structures and member variables that the service reads and writes to do work. Depending on how the service is architected, it could also include files or other resources that are stored on disk. For example, the files a database would use to store data and transaction logs.

As an example service, let's consider a calculator. A basic calculator service takes two numbers and returns their sum. Performing this calculation involves no member variables or other information.

Now consider the same calculator, but with an additional method for storing and returning the last sum it has computed. This service is now stateful. Stateful means it contains some state that it writes to when it computes a new sum and reads from when you ask it to return the last computed sum.

In Azure Service Fabric, the first service is called a stateless service. The second service is called a stateful service.

## Storing service state
State can be either externalized or co-located with the code that is manipulating the state. Externalization of state is typically done by using an external database or other data store that runs on different machines over the network or out of process on the same machine. In our calculator example, the data store could be a SQL database or instance of Azure Table Store. Every request to compute the sum performs an update on this data, and requests to the service to return the value result in the current value being fetched from the store. 

State can also be co-located with the code that manipulates the state. Stateful services in Service Fabric are typically built using this model. Service Fabric provides the infrastructure to ensure that this state is highly available, consistent, and durable, and that the services built this way can easily scale.

## Next steps
For more information on Service Fabric concepts, see the following articles:

* [Availability of Service Fabric services](service-fabric-availability-services.md)
* [Scalability of Service Fabric services](service-fabric-concepts-scalability.md)
* [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)
* [Service Fabric Reliable Services](service-fabric-reliable-services-introduction.md)
