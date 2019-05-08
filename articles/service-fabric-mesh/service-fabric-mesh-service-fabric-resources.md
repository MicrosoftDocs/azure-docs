---
title: Introduction to Azure Service Fabric Resource Model | Microsoft Docs
description: Learn about the Service Fabric Resource Model, a simplified approach to defining Service Fabric Mesh applications.
services: service-fabric-mesh
documentationcenter: .net
author: vturecek
manager: timlt
editor: ''
ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/23/2018
ms.author: vturecek
ms.custom: mvc, devcenter 

---
# Introduction to Service Fabric Resource Model

The Service Fabric Resource Model describes a simple approach to define resources that comprise a Service Fabric Mesh application. Individual resources can be deployed to any Service Fabric environment.  The Service Fabric Resource Model is also compatible with the Azure Resource Manager Model. The following types of resources are currently supported in this model:

- Applications and services
- Networks
- Gateways
- Secrets and Secrets/Values
- Volumes

Each resource is described declaratively in a resource file, which is a simple YAML or JSON document that describes the Mesh Application, and is provisioned by the Service Fabric platform.

## Applications and Services

An Application resource is the unit of deployment, versioning, and lifetime of a Mesh application. It is composed of one, or more, Service resources that represent a microservice. Each Service resource, in turn, is composed of one, or more, code packages that describe everything needed to run the container image associated with the code package.

![Apps and services][Image1]

A Service resource declares the following:

- Container name, version, and registry
- CPU and memory resources required for each container
- Network endpoints
- References to other resources such as networks, volumes, and secrets 

All the code packages defined as part of a Service resource are deployed and activated together as a group. The Service resource also describes how many instances of the service to run and also references other Resources (for example, Network resource) it depends upon.

If a Mesh Application is composed of more than one Service, they are not guaranteed to run together on the same node. Also, during an upgrade of the Application, failure of upgrading a single Service will result in all Services being rolled back to their previous version.

As alluded earlier, the lifecycle of each Application instance can be managed independently. For example, one Application instance can be upgraded independently from the other Application instances. Typically, you keep the number of services in an application fairly small, as the more services you put into an application, the more difficult it becomes to manage each service independently.

## Networks

Network resource is individually deployable resource, independent of an Application or Service resource that may refer to it as their dependency. It is used to create a network for your applications. Multiple Services from different Applications can be part of the same network.  For more information, read about [networking in Service Fabric Mesh applications](service-fabric-mesh-networks-and-gateways.md).

> [!NOTE]
> The current preview only supports a one to one mapping between applications and networks

![Network and gateway][Image2]

## Gateways
A Gateway resource connects two networks and routes traffic.  A gateway allows your services to communicate with external clients and provides an ingress into your service(s).  A gateway can also be used to connect your Mesh application with your own, existing virtual network. For more information, read about [networking in Service Fabric Mesh applications](service-fabric-mesh-networks-and-gateways.md).

![Network and gateway][Image2]

## Secrets

Secrets resources are deployable independent of an application or service resource that may refer to it as their dependency. It is used to securely deliver Secrets to your applications. Multiple services from different applications can reference values of the same Secret.

## Volumes

Containers often make temporary disks available. Temporary disks are ephemeral, however, so you get a new temporary disk and lose the information when a container crashes. It is also difficult to share information on temporary disks with other containers. Volumes are directories that get mounted inside your container instances that you can use to persist state. Volumes give you general-purpose file storage and allow you to read/write files using normal disk I/O file APIs. The Volume resource is a declarative way to describe how a directory is mounted and the backing storage for it (either Azure Files Volume or Service Fabric Reliable Volume).  For more information, read [storing state](service-fabric-mesh-storing-state.md#volumes).

![Volumes][Image3]

## Programming models
Service resource only requires a container image to run, which is referenced in the code package(s) associated with the resource. You can run any code, written in any language, using any framework inside the container without requiring to know, or use, Service Fabric Mesh specific APIs. 

Your application code remains portable even outside of Service Fabric Mesh and your application deployments remain consistent regardless of the language or framework used to implement your services. Whether your application is ASP.NET Core, Go, or just a set of processes and scripts, the Service Fabric Mesh Resource deployment model remains the same. 

## Packaging and deployment

Service Fabric Mesh applications based on the resource model are packaged as Docker containers.  Service Fabric Mesh is a shared, multi-tenant environment and containers give you a high level of isolation.  These applications are described using a JSON format or a YAML format (which is then converted to JSON). When deploying a Mesh application to Azure Service Fabric Mesh, the JSON used to describe the application is an Azure Resource Manager template. Resources are mapped to Azure resources.  When deploying a Mesh application to a Service Fabric cluster (standalone or Azure-hosted), the JSON used to describe the application is a format similar to an Azure Resource Manager template.  Once deployed, Mesh applications can be managed through HTTP interfaces or the Azure CLI. 


## Next steps 
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)

[Image1]: media/service-fabric-mesh-service-fabric-resources/AppsAndServices.png
[Image2]: media/service-fabric-mesh-service-fabric-resources/NetworkAndGateway.png
[Image3]: media/service-fabric-mesh-service-fabric-resources/volumes.png
