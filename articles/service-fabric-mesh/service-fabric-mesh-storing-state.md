---
title: State storage options on Azure Service Fabric Mesh | Microsoft Docs
description: Learn about reliably storing state in Service Fabric applications running on Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: rwike77
ms.author: ryanwi
ms.date: 06/19/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# State management with Service Fabric
Service Fabric supports many different options for state storage. For a conceptual overview of the state management patterns and Service Fabric, see [Service Fabric Concepts: State](/azure/service-fabric/service-fabric-concepts-state). All these same concepts apply whether your services run inside or outside of Service Fabric Mesh. 

## State storage options in Azure Service Fabric Mesh
With Service Fabric Mesh, you can easily deploy a new application and connect it to an existing data store hosted in Azure. Besides using any remote database, there are several options for storing data, depending on whether the service desires local or remote storage. 

* Locally stored replicated data
  * Reliable Collections (not available in preview)
    * A library which implements data structures like queues and key-value pairs to use in the service
    * This gives the easiest and fastest way to interact with data, while providing easy partition routing in combination with Intelligent Routing in Service Fabric Mesh
  * Service Fabric volume driver (not available in preview)
    * A docker volume driver to mount a local volume to a container
    * This gives you the ultimate flexibility in storing data locally, through any API, which supports file storage.

* Remote storage
  * Azure Files volume driver
    * A docker volume driver to mount an Azure Files share to a container
    * Gives you a less performant, but also cheaper full flexible and reliable data option, through any API, which supports file storage.

## Next steps

For information on the application model, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)