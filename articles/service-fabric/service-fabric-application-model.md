---
title: Azure Service Fabric application model | Microsoft Docs
description: How to model and describe applications and services in Service Fabric.
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: mani-ramaswamy

ms.assetid: 17a99380-5ed8-4ed9-b884-e9b827431b02
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: atsenthi

---
# Model an application in Service Fabric
This article provides an overview of the Azure Service Fabric application model and how to define an application and service via manifest files.

## Understand the application model
An application is a collection of constituent services that perform a certain function or functions. A service performs a complete and standalone function and can start and run independently of other services.  A service is composed of code, configuration, and data. For each service, code consists of the executable binaries, configuration consists of service settings that can be loaded at run time, and data consists of arbitrary static data to be consumed by the service. Each component in this hierarchical application model can be versioned and upgraded independently.

![The Service Fabric application model][appmodel-diagram]

An application type is a categorization of an application and consists of a bundle of service types. A service type is a categorization of a service. The categorization can have different settings and configurations, but the core functionality remains the same. The instances of a service are the different service configuration variations of the same service type.  

Classes (or "types") of applications and services are described through XML files (application manifests and service manifests).  The manifests describe applications and services and are the templates against which applications can be instantiated from the cluster's image store.  Manifests are covered in detail in [Application and service manifests](service-fabric-application-and-service-manifests.md). The schema definition for the ServiceManifest.xml and ApplicationManifest.xml file is installed with the Service Fabric SDK and tools to *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*. The XML schema is documented in [ServiceFabricServiceModel.xsd schema documentation](service-fabric-service-model-schema.md).

The code for different application instances run as separate processes even when hosted by the same Service Fabric node. Furthermore, the lifecycle of each application instance can be managed (for example, upgraded) independently. The following diagram shows how application types are composed of service types, which in turn are composed of code, configuration, and data packages. To simplify the diagram, only the code/config/data packages for `ServiceType4` are shown, though each service type would include some or all those package types.

![Service Fabric application types and service types][cluster-imagestore-apptypes]

There can be one or more instances of a service type active in the cluster. For example, stateful service instances, or replicas, achieve high reliability by replicating state between replicas located on different nodes in the cluster. Replication essentially provides redundancy for the service to be available even if one node in a cluster fails. A [partitioned service](service-fabric-concepts-partitioning.md) further divides its state (and access patterns to that state) across nodes in the cluster.

The following diagram shows the relationship between applications and service instances, partitions, and replicas.

![Partitions and replicas within a service][cluster-application-instances]

> [!TIP]
> You can view the layout of applications in a cluster using the Service Fabric Explorer tool available at http://&lt;yourclusteraddress&gt;:19080/Explorer. For more information, see [Visualizing your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).
> 
> 


## Next steps
- Learn about [application scalability](service-fabric-concepts-scalability.md).
- Learn about service [state](service-fabric-concepts-state.md), [partitioning](service-fabric-concepts-partitioning.md), and [availability](service-fabric-availability-services.md).
- Read about how applications and services are defined in [Application and service manifests](service-fabric-application-and-service-manifests.md).
- [Application hosting models](service-fabric-hosting-model.md) describe relationship between replicas (or instances) of a deployed service and service-host process.

<!--Image references-->
[appmodel-diagram]: ./media/service-fabric-application-model/application-model.png
[cluster-imagestore-apptypes]: ./media/service-fabric-application-model/cluster-imagestore-apptypes.png
[cluster-application-instances]: media/service-fabric-application-model/cluster-application-instances.png


