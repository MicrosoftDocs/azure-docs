---
title: Storing state in Service Fabric Mesh applications on Azure | Microsoft Docs
description: Learn about reliably storing state in Service Fabric Mesh applications running on Azure.
services: service-fabric-mesh
keywords: 
author: rwike77
ms.author: ryanwi
ms.date: 06/19/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Storing application state in Azure Service Fabric Mesh

Service state refers to the in-memory or on-disk data that a service requires to function. It includes, for example, the data structures and member variables that the service reads and writes to do work. Depending on how the service is architected, it could also include files or other resources that are stored on disk. For example, the files a database would use to store data and transaction logs.  In microservices applications, services can be either stateless or stateful.  Stateless services persist service state to an external data store or don't persist state at all.  Stateful services manage their own state and keep their data private to that service, accessible only through it's API. Service state is typically persisted to the host.

Stateless services can externalize or save state outside of the service. Externalization of state is typically done using an external database or other data store that runs on different machines over the network or out of process on the same machine. For example, an external data store could be a SQL database, a MongoDB database, an instance of [Azure Table storage](/azure/storage/tables/table-storage-overview), or [Azure Cosmos DB](/azure/cosmos-db/introduction). When the service moves to a different host or crashes, the required data must be fetched from the external data store when the service restarts. With Service Fabric Mesh, you can easily deploy a new application and connect it to an existing data store hosted in Azure.  External data stores can also be used by an application to optionally/periodically write data into cold data stores for offline backup or analysis.

Stateful services often co-locate the code with the service state. Stateful services in [Service Fabric](/azure/service-fabric-overview) and [Service Fabric Mesh](service-fabric-mesh-overview.md) are typically built using this model. The Service Fabric runtime provides the infrastructure to ensure that this state is highly available, consistent, and durable, and that the services built this way can easily scale.  When the service moves to a different host or crashes, service state is immediately available when the service restarts.

Service Fabric Mesh enables developers to easily build stateful services using built-in low-latency container volume drivers. The service requests a volume, backed by a specific [Azure Files](/azure/storage/files/storage-files-introduction) file share.  The file share mounts to a specific location within the containerized application and the application writes files to this location. Using the volume driver for your containers, application state is not lost when the service fails over to a new host in Azure.

To learn more about developing applications for Service Fabric Mesh, read about the [application model](service-fabric-mesh-application-model.md)