<properties
   pageTitle="Overview of Service Fabric and Containers | Microsoft Azure"
   description="An overview of Service Fabric and the use of containers to deploy microservice applications. This article provides an overview of how containers can be used and the capabilities available in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="msfussell"
   manager=""
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/25/2016"
   ms.author="msfussell"/>

# Preview: Service Fabric and containers 

>[AZURE.NOTE] This feature is in preview for Linux and not currently available on Windows Server. This will be in preview for Windows Server on the next release of Service Fabric after Windows Server 2016 GA and supported in the subsequent release after that.

## Introduction
Service Fabric is an [orchestrator](service-fabric-cluster-resource-manager-introduction.md) of services across a cluster of machines. Services can be developed in many ways from using the [Service Fabric programming models ](service-fabric-choose-framework.md) to deploying [guest executables](service-fabric-deploy-existing-app.md). By default Service Fabric deploys and activates these services as processes. Processes provide the fastest activation and highest density usage of the resources in cluster. Service Fabric can also deploy services in container images and importantly you can mix both services in processes and services in containers together in the same application. You get the best of both worlds depending on your scenario.

## What are containers?
Containers are encapsulated, individually deployable components running as isolated instances on the same kernel, leveraging operating system level virtualization. This means that each application, its runtime, dependencies, and system libraries run inside a container with full, private access to their own isolated view of operating system constructs. Along with portability, this degree of security and resource isolation is the main benefit for using containers with Service Fabric, which otherwise runs services in processes. 

Containers are a virtualization technology that virtualizes the underlying OS from applications. They provide an immutable environment for applications to run with varying degree of isolation. Containers run directly on top of the kernel and have an isolated view of the filesystem and other resources. Compared to VMs, containers have the following advantages:

1.  **Small in size**: Containers use a single storage space and smaller deltas for each layer thus being more efficient.

2.  **Fast boot up time**: Containers don’t have to boot an OS, so can be up and available much faster than VMs, typically seconds.

3.  **Portability**: A containerized application image can be ported to run in the cloud or on premise, inside VMs or directly on physical machines.

4.  **Provide resource governance** to limit the physical resources a container can consume on its host.

## Container types
Service Fabric supports the following types of containers:

### Docker containers on linux
Docker provides higher level APIs to create and manage containers on top of Linux kernel containers and provides Docker Hub as a central repository for storing and retrieving container images. 

### Windows Server containers
Windows Server 2016 provides two different types of containers that differ in the level of isolation provided. Windows Server containers are similar to Docker containers in that they have namespace and file system isolation but share the kernel with the host they are running on. On Linux, this isolation has traditionally been provided by cgroups and namespaces, and Windows Server containers behave similarly. 

Windows Hyper-V containers provide a higher degree of isolation and security since each container does not share the OS kernel either among them or with the host. With this higher level of security isolation, Hyper-V Containers are particularly targeted at hostile, multi-tenant scenarios.

The following figure shows the different types of virtualization and isolation levels available in the OS.
![Service Fabric platform][Image1]

## Scenarios for using containers
Some typically examples of when to use containers include

1. **IIS lift and shift**. If you have some existing ASP.NET MVC apps that you would like to continue to use, rather than migrate them to ASP.NET core, put them into a container. These ASP.NET MVC apps are dependent on IIS. You can package these into container images from the pre-created IIS image and deploy them with Service Fabric. See [Container Images on Windows Server](https://msdn.microsoft.com/virtualization/windowscontainers/quick_start/quick_start_images) on how to create IIS images.


2. **Mix containers and Service Fabric microservices**. Use an existing container image for part of your application. For example, you could use the [NGINX container](https://hub.docker.com/_/nginx/) for the web frontend of your application and stateful services built with Reliable Services for the more intensive backend computation. An example of this scenario includes gaming applications


3. **Reduce impact of "noisy neighbors" services**. The resource governance ability of containers enables you to restrict the resource a service uses on a host. If there are services that may consume large number of resources and hence affect the performance of others, (e.g. a long running query like operation) consider putting these into containers with resource governance.

## Service Fabric support for containers
Service Fabric currently supports deployment of Docker containers on Linux and Windows Server containers on Windows Server 2016. Support for Hyper-V containers will be added in a future release. 

In the Service Fabric [application model](service-fabric-application-model.md), a container represents an application host in which multiple service replicas are placed. The following scenarios are supported for containers:

1.	**Guest containers**: Identical to the [guest executable scenario](service-fabric-deploy-existing-app.md)  where you can deploy existing applications in a container. For example nodejs, javascript or any code (EXEs).


2.	**Stateless services inside containers**: These are stateless services using the Reliable Services and the Reliable Actors programming models. This is currently only supported on Linux. Support for stateless services in Windows containers will be added in future release.

 
3.	**Stateful services inside containers**: These are stateful services using the Reliable Actors programming model on Linux. Reliable Services are not currently supported on Linux.  Support for stateful services in Windows containers will be added in future release.

Service Fabric has several container capabilities that help you with building applications that are composed of microservices that are containerized. These are called containerized services. The capabilities include;

- Container image deployment and activation
- Resource governance
- Repository authentication
- Container port to host port mapping
- Container-to-container discovery and communication
- Ability to configure and set environment variables

## Next steps
In this article, you learned about containers, that Service Fabric is a container orchestrator and the features that Service Fabric provides to support containers. As a next step we will go over examples of each of the features to show you how to use them. 

[Deploy a container to Service Fabric](service-fabric-deploy-container.md)

[Image1]: media/service-fabric-containers/Service-Fabric-Types-of-Isolation.png

