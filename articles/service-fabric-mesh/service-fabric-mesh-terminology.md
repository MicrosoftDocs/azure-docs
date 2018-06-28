---
title: Terminology for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about common terms for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: rwike77
ms.author: ryanwi
ms.date: 06/26/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Service Fabric Mesh terminology

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. This article details the terminology used by Azure Service Fabric Mesh to understand the terms used in the documentation.

## Service Fabric

Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric is the orchestrator that powers Service Fabric Mesh.  Service Fabric provides options for how you can build and run your microservices applications. You can use any framework to write your services and choose where to run the application from multiple environment choices.

## Frameworks

[Service Fabric](/azure/service-fabric/service-fabric-overview) as a platform is agnostic to the framework you choose for writing services.  For example, can write services using ASP.NET, Java, Node.js, or Python. The Service Fabric ecosystem also provides frameworks, which enable you to take advantage of platform features (such as highly available state). [Reliable services](/azure/service-fabric/service-fabric-reliable-services-introduction) and [reliable actors](/azure/service-fabric/service-fabric-reliable-actors-introduction) are specific examples of Service Fabric frameworks.

## Deployment models

To deploy your services, you need to describe how they should run. Service Fabric supports three different deployment models.

**Resource model**: Describes Service Fabric applications and resources. Resources are defined using a YAML file or JSON file (using the Azure Resource Model schema). Applications described using the resource model are deployed as running instances.

**Manifest model**: Describes reliable services applications.  Application and service types are defined using XML manifest files.  Multiple instances of application and service types can run at the same time.

**Docker Compose**: A tool for defining and running multi-container Docker applications. [Compose](https://docs.docker.com/compose/) is part of the Docker project. Service Fabric provides limited support for deploying applications using the Compose model.

## Environments

Service Fabric is the platform technology, which several different services and products are based on. Microsoft provides the following options:

**Service Fabric Mesh**: A fully managed service for running Service Fabric applications in Microsoft Azure.

**Azure Service Fabric**: The Azure hosted Service Fabric cluster offering. It provides integration between Service Fabric and the Azure infrastructure, along with upgrade and configuration management of Service Fabric clusters.

**Service Fabric standalone**: A set of installation and configuration tools to [deploy Service Fabric clusters anywhere](/azure/service-fabric/service-fabric-deploy-anywhere) (on-premises or on any cloud provider). Not managed by Azure.

**Service Fabric onebox or development cluster**: Provides the developer experience on Windows, Linux, or Mac for creating Service Fabric applications.

## Environment, framework, and deployment model support matrix
Different environments have different level of support for frameworks and deployment models. The following table describes the supported framework and deployment model combinations.

|Frameworks\Deployment model |Resource model |Manifest model | Compose|
|---|---|---|---|
|Reliable Actors and Reliable Services |Not supported |Supported |Not supported |
|Any other framework |Supported in containers |Supported as processes and in containers |Supported in containers |

The following table describes the supported environment and deployment model combinations.

|Environment\Deployment model |Resource model |Manifest model |Compose |
|---|---|---|---|
|Azure Service Fabric Mesh |Supported |Not supported|Not supported |
|All other environments |Supported (Some resources have prerequisites to work in an environment) |Supported |Limited Support |

## Next steps

To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)
