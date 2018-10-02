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
ms.date: 07/12/2018
ms.author: vturecek
ms.custom: mvc, devcenter 

---
# Introduction to Service Fabric Resource Model

Service Fabric Resource Model describes a simple approach to define resources that comprise a Service Fabric Mesh application. The following types of resources are currently supported in this model:

- Applications
- Services
- Volumes
- Networks

Each resource is described declaratively in a resource file, which is a simple YAML or JSON document that describes the Mesh Application, and is provisioned by the Service Fabric platform.

## Resource overview

### Applications and Services

An Application resource is the unit of deployment, versioning, and lifetime of a Mesh application. It is composed of one, or more, of Service resources that represent a microservice. Each Service resource, in turn, is composed of one, or more, code packages that describe everything needed to run the container image associated with the code package, including the following:

- Container name, version, and registry
- CPU and memory resources required for each container
- Network endpoints
- Volumes to mount in the container, referencing a separate volume resource.

All the code packages defined as part of a Service resource are deployed and activated together as a group. The Service resource also describes how many instances of the service to run and also references other Resources (for example, Network resource) it depends upon.

If a Mesh Application is composed of more than one Service, they are not guaranteed to run together on the same node. Also, during an upgrade of the Application, failure of upgrading a single Service will result in all Services being rolled back to their previous version.



```yaml
    services:
      - name: helloWorldService
        properties:
          description: Hello world service.
          osType: linux
          codePackages:
            - name: helloworld
              image: myapp:1.0-alpine
              resources:
                requests:
                  cpu: 2
                  memoryInGB: 2
              endpoints:
                - name: helloWorldEndpoint
                  port: 8080
    replicaCount: 3
    networkRefs:
      - name: mynetwork
```

As alluded earlier, the lifecycle of each Application instance can be managed independently. For example, one Application instance can be upgraded independently from the other Application instances. Typically, you keep the number of services in an application fairly small, as the more services you put into an application, the more difficult it becomes to manage each service independently.

### Networks

Network resource is individually deployable resource, independent of an Application or Service resource that may refer to it as their dependency. It is used to create a private network for your applications. Multiple Services from different Applications can be part of the same network.

> [!NOTE]
> The current preview only supports a one to one mapping between applications and networks

### Volumes

Volumes are directories that get mounted inside your container instances that you can use to persist state. The Volume resource is a declarative way to describe how a directory is mounted and the backing storage for it.

## Programming models
Service resource only requires a container image to run, which is referenced in the code package(s) associated with the resource. You can run any code, written in any language, using any framework inside the container without requiring to know, or use, Service Fabric Mesh specific APIs. 

Your application code remains portable even outside of Service Fabric Mesh and your application deployments remain consistent regardless of the language or framework used to implement your services. Whether your application is ASP.NET Core, Go, or just a set of processes and scripts, the Service Fabric Mesh Resource deployment model remains the same. 

## Deployment

When deploying to Service Fabric Mesh, Resources are deployed as Azure Resource Manager templates to Azure through HTTP or the Azure CLI. 


## Next steps 
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)
