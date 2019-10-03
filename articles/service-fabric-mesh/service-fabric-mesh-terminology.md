---
title: Terminology for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about common terms for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: dkkapur
ms.author: dekapur
ms.date: 11/28/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt 
---
# Service Fabric Mesh terminology

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. This article details the terminology used by Azure Service Fabric Mesh to understand the terms used in the documentation.

## Service Fabric

[Service Fabric](/azure/service-fabric/) is an open source distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric is the orchestrator that powers Service Fabric Mesh. Service Fabric provides options for how you can build and run your microservices applications. You can use any framework to write your services and choose where to run the application from multiple environment choices.

## Application and service concepts

**Service Fabric Mesh Application**: Service Fabric Mesh Applications are described by the [Resource Model](/azure/service-fabric-mesh/service-fabric-mesh-service-fabric-resources) (YAML and JSON resource files) and can be deployed to any environment where Service Fabric runs.

**Service Fabric Native Application**: Service Fabric Native Applications are described by the [Native Application Model](/azure/service-fabric/service-fabric-application-model) (XML-based application and service manifests).  Service Fabric Native Applications cannot run in Service Fabric Mesh.

**Application**: A Service Fabric Mesh application is the unit of deployment, versioning, and lifetime of a Mesh application. The lifecycle of each application instance can be managed independently.  Applications are composed of one or more service code packages and settings. An application is defined using the Azure Resource Model (RM) schema.  Services are described as properties of the application resource in a RM template.  Networks and volumes used by the application are referenced by the application.  When creating an application, the application, service(s), network, and volume(s) are modeled using the Service Fabric Resource Model.

**Service**: A service in an application represents a microservice and performs a complete and standalone function. Each service is composed of one, or more, code packages that describe everything needed to run the container image associated with the code package.  The number of service replicas in an application can be scaled in and out.

**Code package**: Code packages describe everything needed to run the container image associated with the code package, including the following:

* Container name, version, and registry
* CPU and memory resources required for each container
* Network endpoints
* Volumes to mount in the container, referencing a separate volume resource.

## Deployment and application models 

To deploy your services, you need to describe how they should run. Service Fabric supports three different deployment models:

### Resource model
Service Fabric Resources are anything that can be deployed individually to Service Fabric; including applications, services, networks, and volumes. Resources are defined using a JSON file, which can be deployed to a cluster endpoint.  For Service Fabric Mesh, the Azure Resource Model schema is used. A YAML file schema can also be used to more easily author definition files. Resources can be deployed anywhere Service Fabric runs. The resource model is the simplest way to describe your Service Fabric applications. Its main focus is on simple deployment and management of containerized services. To learn more, read [Introduction to the Service Fabric Resource Model](/azure/service-fabric-mesh/service-fabric-mesh-service-fabric-resources).

### Native model
The native application model provides your applications with full low-level access to Service Fabric. Applications and services are defined as registered types in XML manifest files.

The native model supports the Reliable Services framework, which provides access to the Service Fabric runtime APIs and cluster management APIs in C# and Java. The native model also supports arbitrary containers and executables.

The native model is not supported in the Service Fabric Mesh environment.  For more information, see [programming model overview](/azure/service-fabric/service-fabric-choose-framework).

### Docker Compose 
[Docker Compose](https://docs.docker.com/compose/) is part of the Docker project. Service Fabric provides limited support for deploying applications using the Docker Compose model.

## Environments

Service Fabric is an open-source platform technology that several different services and products are based on. Microsoft provides the following options:

 - **Service Fabric Mesh**: A fully managed service for running Service Fabric applications in Microsoft Azure.
 - **Azure Service Fabric**: The Azure hosted Service Fabric cluster offering. It provides integration between Service Fabric and the Azure infrastructure, along with upgrade and configuration management of Service Fabric clusters.
 - **Service Fabric standalone**: A set of installation and configuration tools to [deploy Service Fabric clusters anywhere](/azure/service-fabric/service-fabric-deploy-anywhere) (on-premises or on any cloud provider). Not managed by Azure.
 - **Service Fabric development cluster**: Provides a local development experience on Windows, Linux, or Mac for development of Service Fabric applications.

## Environment, framework, and deployment model support matrix
Different environments have different level of support for frameworks and deployment models. The following table describes the supported framework and deployment model combinations.

| Type of Application | Described By | Azure Service Fabric Mesh | Azure Service Fabric Clusters (any OS)| Local cluster | Standalone cluster |
|---|---|---|---|---|---|
| Service Fabric Mesh Applications | Resource Model (YAML & JSON) | Supported |Not supported | Windows- supported, Linux and Mac- not supported | Windows- not supported |
|Service Fabric Native Applications | Native Application Model (XML) | Not Supported| Supported|Supported|Windows- supported|

The following table describes the different application models and the tooling that exists for them against Service Fabric.

| Type of Application | Described By | Visual Studio | Eclipse | SFCTL | AZ CLI | Powershell|
|---|---|---|---|---|---|---|
| Service Fabric Mesh Applications | Resource Model (YAML & JSON) | VS 2017 |Not supported |Not supported | Supported - Mesh environment only | Not Supported|
|Service Fabric Native Applications | Native Application Model (XML) | VS 2017 and VS 2015| Supported|Supported|Supported|Supported|

## Next steps

To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).

Find answers to [common questions](service-fabric-mesh-faq.md).
