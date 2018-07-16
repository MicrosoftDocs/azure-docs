---
title: Terminology for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about common terms for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: rwike77
ms.author: ryanwi
ms.date: 07/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt 
---
# Service Fabric Mesh terminology

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. This article details the terminology used by Azure Service Fabric Mesh to understand the terms used in the documentation.

## Service Fabric

Service Fabric is an open source distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric is the orchestrator that powers Service Fabric Mesh. Service Fabric provides options for how you can build and run your microservices applications. You can use any framework to write your services and choose where to run the application from multiple environment choices.

## Deployment and application models 

To deploy your services, you need to describe how they should run. Service Fabric supports three different deployment models:

### Resource model
Resources are anything that can be deployed individually to Service Fabric, including applications, services, networks, and volumes. Resources are defined using a YAML file or JSON file using the Azure Resource Model schema.

The resource model is the simplest way to describe your Service Fabric applications. Its main focus is on simple deployment and management of containerized services.

Resources can be deployed anywhere Service Fabric runs.

### Native model
The native application model provides your applications with full low-level access to Service Fabric. Applications and services are defined as registered types in XML manifest files.

The native model supports the Reliable Services framework, which provides access to the Service Fabric runtime APIs and cluster management APIs in C# and Java. The native model also supports arbitrary containers and executables.

The native model is not supported in the Service Fabric Mesh environment.

### Docker Compose 
[Docker Compose](https://docs.docker.com/compose/) is part of the Docker project. Service Fabric provides limited support for deploying applications using the Docker Compose model.

## Environments

Service Fabric is an open source platform technology that several different services and products are based on. Microsoft provides the following options:

 - **Service Fabric Mesh**: A fully managed service for running Service Fabric applications in Microsoft Azure.
 - **Azure Service Fabric**: The Azure hosted Service Fabric cluster offering. It provides integration between Service Fabric and the Azure infrastructure, along with upgrade and configuration management of Service Fabric clusters.
 - **Service Fabric standalone**: A set of installation and configuration tools to [deploy Service Fabric clusters anywhere](/azure/service-fabric/service-fabric-deploy-anywhere) (on-premises or on any cloud provider). Not managed by Azure.
 - **Service Fabric development cluster**: Provides a local development experience on Windows, Linux, or Mac for development of Service Fabric applications.

## Environment, framework, and deployment model support matrix
Different environments have different level of support for frameworks and deployment models. The following table describes the supported framework and deployment model combinations.

|Frameworks\Deployment model |Resource model |Manifest model | Compose|
|---|---|---|---|
|Reliable Actors and Reliable Services |Not supported |Supported |Not supported |
|Any other framework or language |Supported in containers |Supported as processes and in containers |Supported in containers |

The following table describes the supported environment and deployment model combinations.

|Environment\Deployment model |Resource model |Manifest model |Compose |
|---|---|---|---|
|Azure Service Fabric Mesh |Supported |Not supported|Not supported |
|All other environments |Supported (Some resources have prerequisites to work in an environment) |Supported |Limited Support |

## Next steps

To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)
