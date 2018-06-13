---
title: Terminology for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about commonly asked questions and answers for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: 
author: mikkelhegn
ms.author: mikhegn
ms.date: 06/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Service Fabric Mesh terminology

Azure Service Fabric Mesh is a fully managed service enabling developers to deploy containerized applications without managing virtual machines, storage, or networking resources. This article details the terminology used by Azure Service Fabric Mesh to understand the terms used in the documentation.

## Service types

**Reliable Services**: Current Service Fabric programming model. Reliable Services do not run as-is on SeaBreeze. There will be a migration path with a sub-set of functionality to make Reliable services run on SeaBreeze.  
**Any Service**: Covers any type of service, which is not a Reliable Service. 
**Service Fabric Libraries**: In the Service Fabric Application world, there are no "programming models" as we know them today. Instead a normal .NET Core application will be able to leverage platform capabilities (e.g. stateful collections or volumes) simply by including NuGet packages, or just by running in the SeaBreeze environment. 

## Application models 

**Service Fabric Application**: Any application that runs on Service Fabric using the new YAML deployment model. These applications can run on any hosting platform. 
**Reliable Services Application**: Current Service Fabric XML application model. Reliable Services Applications cannot be deployed to Service Fabric Mesh. 

## Hosting platforms 

**Service Fabric Mesh (SeaBreeze (SB))**: Serverless Service Fabric application hosting platform in Azure. 
**Service Fabric (SF)**: Service Fabric base product. The orchestrator from Microsoft that powers SeaBreeze. 
**Azure Service Fabric (SFRP)**: Current Azure hosted Service Fabric offering. 
**Service Fabric Standalone**: Service Fabric clusters running anywhere, not managed by Azure (SFRP). 

## Next steps
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)