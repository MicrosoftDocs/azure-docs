---
title: Storing state in Service Fabric Mesh applications on Azure | Microsoft Docs
description: Learn about reliably storing state in Service Fabric Mesh applications running on Azure.
services: service-fabric-mesh
keywords: 
author: mani-ramaswamy
ms.author: subramar
ms.date: 06/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Storing application state in Azure Service Fabric Mesh

Service state refers to the in-memory or on disk data that a service requires to function. It includes, for example, the data structures and member variables that the service reads and writes to do work. Depending on how the service is architected, it could also include files or other resources that are stored on disk. For example, the files a database would use to store data and transaction logs.

State can be externalized or co-located with the code that is manipulating the state. Externalization of state is typically done by using an external database or other data store that runs on different machines over the network or out of process on the same machine. In a calculator example, the data store could be a SQL database or instance of Azure Table Store. Every request to compute the sum performs an update on this data, and requests to the service to return the value result in the current value being fetched from the store. 

State can also be co-located with the code that manipulates the state. Stateful services in Service Fabric are typically built using this model. Service Fabric provides the infrastructure to ensure that this state is highly available, consistent, and durable, and that the services built this way can easily scale.

Service Fabric Mesh enables developers to easily build stateful services using either built-in low-latency container volume drivers or reliable collections (for example, dictionary or queue) that can be used with any programming model or framework. 

You can bring existing stateful applications using MongoDb, Cassandra, or SQL server or write your own application. State is made highly available within the application with no external dependencies.   

Using the volume driver for your containers, application state is not lost when the container fails over to a new host in Azure.  


To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)