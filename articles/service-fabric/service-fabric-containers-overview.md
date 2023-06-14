---
title: Overview of Service Fabric and containers 
description: An overview of Service Fabric and the use of containers to deploy microservice applications. This article provides an overview of how containers can be used and the available capabilities in Service Fabric.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric and containers

## Introduction

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers.

Service Fabric is Microsoft's [container orchestrator](service-fabric-cluster-resource-manager-introduction.md) for deploying microservices across a cluster of machines. Service Fabric benefits from the lessons learned during its years running services at Microsoft at massive scale.

Microservices can be developed in many ways from using the [Service Fabric programming models](service-fabric-choose-framework.md), [ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md), to deploying [any code of your choice](service-fabric-guest-executables-introduction.md). Or, if you just want to [deploy and manage containers](service-fabric-containers-overview.md), Service Fabric is also a great choice.

By default, Service Fabric deploys and activates these services as processes. Processes provide the fastest activation and highest density usage of the resources in a cluster. Service Fabric can also deploy services in container images. You can also mix services in processes, and services in containers, in the same application.

To jump right in and try out containers on Service Fabric, try a quickstart, tutorial, or sample:  

[Quickstart: Deploy a Linux container application to Service Fabric](service-fabric-quickstart-containers-linux.md)  
[Quickstart: Deploy a Windows container application to Service Fabric](service-fabric-quickstart-containers.md)  
[Containerize an existing .NET app](service-fabric-host-app-in-a-container.md)  
[Service Fabric Container Samples](https://azure.microsoft.com/resources/samples/service-fabric-containers/)  

## What are containers

Containers solve the problem of running applications reliably in different computing environments by providing an immutable environment for the application to run in. Containers wrap an application and all of its dependencies, such as libraries and configuration files, into its own isolated 'box' that contains everything needed to run the software inside the container. Wherever the container runs, the application inside it always has everything it needs to run such as the right versions of its dependent libraries, any configuration files, and anything else it needs to run.

Containers run directly on top of the kernel and have an isolated view of the file system and other resources. An application in a container has no knowledge of any other applications or processes outside of its container. Each application and its runtime, dependencies, and system libraries run inside a container with full, private access to the container's own isolated view of the operating system. In addition to making it easy to provide all of your application's dependencies it needs to run in different computing environments, security and resource isolation are important benefits of using containers with Service Fabric--which otherwise runs services in a process.

Compared to virtual machines, containers have the following advantages:

* **Small**: Containers use a single storage space and layer versions and updates to increase efficiency.
* **Fast**: Containers don’t have to boot an entire operating system, so they can start much faster--typically in seconds.
* **Portability**: A containerized application image can be ported to run in the cloud, on premises, inside virtual machines, or directly on physical machines.
* **Resource governance**: A container can limit the physical resources that it can consume on its host.

## Service Fabric support for containers

Service Fabric supports the deployment of Docker containers on Linux, and Windows Server containers on Windows Server 2016 and later, along with support for Hyper-V isolation mode.

Container runtimes compatible with ServiceFabric:
- Linux: Docker
- Windows:
   - Windows Server 2022: Mirantis Container Runtime 
   - Windows Server 2019/2016: DockerEE


#### Docker containers on Linux

Docker provides APIs to create and manage containers on top of Linux kernel containers. Docker Hub provides a central repository to store and retrieve container images.
For a Linux-based tutorial, see [Create your first Service Fabric container application on Linux](service-fabric-get-started-containers-linux.md).

#### Windows Server containers

Windows Server 2016 and later provide two different types of containers that differ by level of isolation. Windows Server containers and Docker containers are similar because both have namespace and file system isolation, while sharing the kernel with the host they are running on. On Linux, this isolation has traditionally been provided by cgroups and namespaces, and Windows Server containers behave similarly.

Windows containers with Hyper-V support provide more isolation and security because no container shares the operating system kernel with any other container, or with the host. With this higher level of security isolation, Hyper-V enabled containers are targeted at potentially hostile, multi-tenant scenarios.
For a Windows-based tutorial, see [Create your first Service Fabric container application on Windows](service-fabric-get-started-containers.md).

The following figure shows the different types of virtualization and isolation levels available.
![Service Fabric platform][Image1]

## Scenarios for using containers

Here are typical examples where a container is a good choice:

* **IIS lift and shift**: You can put an existing [ASP.NET MVC](https://www.asp.net/mvc) app in a container instead of migrating it to ASP.NET Core. These ASP.NET MVC apps depend on Internet Information Services (IIS). You can package these applications into container images from the precreated IIS image and deploy them with Service Fabric. See [Container Images on Windows Server](/virtualization/windowscontainers/quick-start/quick-start-windows-server) for information about Windows containers.

* **Mix containers and Service Fabric microservices**: Use an existing container image for part of your application. For example, you might use the [NGINX container](https://hub.docker.com/_/nginx/) for the web front end of your application and stateful services for the more intensive back-end computation.

* **Reduce impact of "noisy neighbors" services**: You can use the resource governance ability of containers to restrict the resources that a service uses on a host. If services might consume many resources and affect the performance of others (such as a long-running, query-like operation), consider putting these services into containers that have resource governance.

> [!NOTE]
> A Service Fabric cluster is single tenant by design and hosted applications are considered **trusted**. If you are considering hosting **untrusted applications**, please see [Hosting untrusted applications in a Service Fabric cluster](service-fabric-best-practices-security.md#hosting-untrusted-applications-in-a-service-fabric-cluster).

Service Fabric provides an [application model](service-fabric-application-model.md) in which a container represents an application host in which multiple service replicas are placed. Service Fabric also supports a [guest executable scenario](service-fabric-guest-executables-introduction.md) in which you don't use the built-in Service Fabric programming models but instead package an existing application, written using any language or framework, inside a container. This scenario is the common use-case for containers.

You can also run [Service Fabric services inside a container](service-fabric-services-inside-containers.md). Support for running Service Fabric services inside containers is currently limited.

Service Fabric provides several container capabilities that help you build applications that are composed of containerized microservices, such as:

* Container image deployment and activation.
* Resource governance including setting resource values by default on Azure clusters.
* Repository authentication.
* Container port to host port mapping.
* Container-to-container discovery and communication.
* Ability to configure and set environment variables.
* Ability to set security credentials on the container.
* A choice of different networking modes for containers.

For a comprehensive overview of container support on Azure, such as how to create a Kubernetes cluster with Azure Kubernetes Service, how to create a private Docker registry in Azure Container Registry, and more, see [Azure for Containers](../containers/index.yml).

## Next steps

In this article, you learned about the support Service Fabric provides for running containers. Next, we will go over examples of each of the features to show you how to use them.

[Create your first Service Fabric container application on Linux](service-fabric-get-started-containers-linux.md)  
[Create your first Service Fabric container application on Windows](service-fabric-get-started-containers.md)  
[Learn more about Windows Containers](/virtualization/windowscontainers/about/)

[Image1]: media/service-fabric-containers/Service-Fabric-Types-of-Isolation.png
