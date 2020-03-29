---
title: State storage options on Azure Service Fabric Mesh 
description: Learn about reliably storing state in Service Fabric Mesh applications running on Azure Service Fabric Mesh.
author: dkkapur
ms.author: dekapur
ms.date: 11/27/2018
ms.topic: conceptual
---
# State management with Service Fabric

Service Fabric supports many different options for state storage. For a conceptual overview of the state management patterns and Service Fabric, see [Service Fabric Concepts: State](/azure/service-fabric/service-fabric-concepts-state). All these same concepts apply whether your services run inside or outside of Service Fabric Mesh. 

With Service Fabric Mesh, you can easily deploy a new application and connect it to an existing data store hosted in Azure. Besides using any remote database, there are several options for storing data, depending on whether the service desires local or remote storage. 

## Volumes

Containers often make use of temporary disks. Temporary disks are ephemeral, however, so you get a new temporary disk and lose the information when a container crashes. It is also difficult to share information on temporary disks with other containers. Volumes are directories that get mounted inside your container instances that you can use to persist state. Volumes give you general-purpose file storage and allow you to read/write files using normal disk I/O file APIs. The Volume resource describes how to mount a directory and which backing storage to use. You can choose either Azure File storage or Service Fabric Volume disk to store data.

![Volumes][image3]

### Service Fabric Reliable Volume

Service Fabric Reliable Volume is a Docker volume driver used to mount a local volume to a container. Reads and writes are local operations and fast. Data is replicated out to secondary nodes, making it highly available. Failover is also fast. When a container crashes, it fails over to a node that already has a copy of your data. For an example, see [How to deploy an app with Service Fabric Reliable Volume](service-fabric-mesh-howto-deploy-app-sfreliable-disk-volume.md).

### Azure Files Volume

Azure Files Volume is a Docker volume driver used to mount an Azure Files share to a container. Azure Files storage uses network storage, so reads and writes take place over the network. Compared to Service Fabric Reliable Volume, Azure Files storage is less performant but provides a cheaper and fully reliable data option. For an example, see [How to deploy an app with Azure Files Volume](service-fabric-mesh-howto-deploy-app-azurefiles-volume.md).

## Next steps

For information on the application model, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)

[image3]: ./media/service-fabric-mesh-storing-state/volumes.png
