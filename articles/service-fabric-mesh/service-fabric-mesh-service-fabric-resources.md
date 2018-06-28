---
title: Introduction to Azure Service Fabric resources | Microsoft Docs
description: Learn about the Service Fabric resources, the simple, unified way to deploy and manage Service Fabric applications.
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
ms.date: 06/26/2018
ms.author: vturecek
ms.custom: mvc, devcenter

---
# Introduction to Service Fabric resources

Service Fabric resources are a simple, unified way to deploy and manage applications anywhere Service Fabric runs. 

## How it works

A Service Fabric resource describes how something should run in the Service Fabric environment. The following types of resources are currently supported:

- Applications and services
- Volumes
- Networks

Each resource is described declaratively in a resource file. A resource file is a simple YAML or JSON document that describes how to run an instance of an application, service, volume, or network. Service Fabric will then ensure the resource continues to run as described in the resource file.

## Resource overview

### Applications and services

A service resource describes how to run a set of container images together. The container images can be anything, such as an IIS web server with a web application, or a single microservice. 

Each service resource contains any number of *code packages*. A code package describes everything needed to run a single container image, including:

- Container name, version, and registry
- CPU and memory resources required for each container
- Network endpoints
- Volumes to mount in the container, referencing a separate volume resource.

All the code packages defined in a service resource are always deployed and activated together as a group. This means each instance of a service will include all code packages together on the same node. The service resource also describes how many instances of the service to run, and the network the service belongs to.


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
    replicaCount: 5
    networkRefs:
      - name: mynetwork
```

An application resource is a way to group services that should be deployed and upgraded together as a unit. This does not mean services will always run together on the same node. However, during an application upgrade, if the upgrade of one service fails, all services are rolled back to their previous version.

The lifecycle of each application instance can be managed independently. For example, one application can be upgraded independently from other application. Typically, you keep the number of services in an application fairly small, as the more services you put into an application, the more difficult it becomes to manage each service independently.

### Networks

Networks are individually deployable resources, just like applications and services. A network resource is used to create a private network for your applications. Multiple services from different applications can be part of the same network.

> [!NOTE]
> The current preview only supports a one to one mapping between applications and networks

### Volumes

Volumes are directories that get mounted inside your container instances that you can use to write files. The volume resource is a declarative way to describe how a volume is mounted and the backing storage for the volume.

## Programming models
Service resources only define a container image to run. There are no frameworks or base classes you need to implement in your service code. Instead, you can run any code, written in any language, using any framework inside the container without implementing Service Fabric-specific APIs. 

Your application code remains portable even outside of Service Fabric and your application deployments remain consistent regardless of the language or framework used to implement your services. Whether your application is ASP.NET Core, Go, or just a set of processes and scripts, the service resource deployment model remains the same. 

## Deployment

Service Fabric resources can be deployed anywhere Service Fabric runs. When deploying to Service Fabric locally, in your own datacenter, or in the cloud, resources are deployed to your cluster's HTTP management endpoint or through the Service Fabric CLI. When deploying to Service Fabric Mesh, resources are deployed as Azure Resource Manager templates to Azure through HTTP or the Azure CLI. You can deploy the same Service Fabric resource to any of these Service Fabric environments without making any changes to your application code.


## Next steps 
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)