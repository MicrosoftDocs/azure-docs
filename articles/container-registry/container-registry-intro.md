---
title: Azure Container Registry introduction | Microsoft Docs
description: Introduction to the Azure Container Registry service, providing cloud-based, managed, private Docker registries.
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/01/2016
ms.author: stevelas
---
# What is Azure Container Registry?
> [!NOTE]
> Container Registry is currently in private preview.
> 
> 

Azure Container Registry is a managed Docker registry service to store and manage your private [Docker container](https://www.docker.com/what-docker) images. Container Registry gives you the ability to create and maintain private registry instances similar to the public [Docker Hub](http://hub.docker.com). Use your existing container deployment pipelines, or draw on the body of Docker community expertise, to work with container registries in Azure.

By creating a container registry within your subscription, you have full control over access and image names for all of your container deployments. Create a registry in the same Azure location as your deployments to take advantage of local, network-close storage of your container images. This can help reduce network latency in your deployments as well as reduce charges for storage ingress and egress.

For background about Docker and containers, see:

* [Docker user guide](https://docs.docker.com/engine/userguide/)
* [Docker containers as the new binaries of deployment](https://blogs.msdn.microsoft.com/stevelasker/2016/05/26/docker-containers-as-the-new-binaries-of-deployment/) 

## Key concepts
* **Registry** - You can create one or more container registries in your Azure subscription. Each registry is backed by a standard Azure [storage account](https://azure.microsoft.com/en-us/documentation/articles/storage-introduction/) in the same region. Configure your deployment targets to access container images in your registries. 
* **Repository** - A registry consists of one or more repositories, which are collections of related images. Azure Container Registry supports multilevel repository namespaces. This enables you to group collections of images related to a specific app, or a collection of apps to specific development or operational groups. For example:
  
  * `contoso.azurecr.io/aspnetcore:1.0.1` represents a corporate wide image
  * `contoso.azurecr.io/warrantydept/dotnet-build` represents an image used to build dotnet apps, shared across the warranty department
  * `contoso.azrecr.io/warrantydept/customersubmissions/web` represents a web image, grouped in the constomersubmissions app, owned by the warranty department
* **Image** - An image stored in a repository is a read-only snapshot of a Docker container. Use standard [Docker commands](https://docs.docker.com/engine/reference/commandline/) to push images into a repository, or pull an image from a repository.
* **Container** - A container defines a software application and its dependencies wrapped in a complete filesystem including code, runtime, system tools, and libraries. Run Docker containers based on images that you pull from a container registry. Containers running on a single machines share the same operating system kernel. Docker containers are fully portable to all major Linux distros, Mac, and Windows.

## Deployment targets
Deploy containers from an Azure container registry to a variety of deployment targets:

* **Scalable orchestration systems** that manage containerized applications across clusters of hosts, including [DC/OS](https://docs.mesosphere.com/), [Docker Swarm](https://docs.docker.com/swarm/), and [Kubernetes](http://kubernetes.io/docs/).
* **Azure services** that support building and running applications at scale, including [Container Service](https://azure.microsoft.com/en-us/documentation/services/container-service/), [App Service](https://azure.microsoft.com/en-us/documentation/services/app-service/), and [Batch](https://azure.microsoft.com/en-us/documentation/services/batch/). 

## Securing registry access
For private preview, securing a container registry is limited to basic authentication flows using usernames and passwords, managed with Azure Active Directory service principals. 

Integration with individual Azure Active Directory identities is planned for a future release. This feature will allow you to manage access to a registry with Active Directory groups. 

See [Authenticate with a container registry](container-registry-authentication.md) for more information.

## Login URLs
For private preview, the login URLs for your container registries are created with **-exp** in the domain name - for example, `contoso-exp.azurecr.io`. This is an indication that you are using an experimental version of the Container Registry service. In a future release, the login URLs will support multiple teams in what appears as a single registry, providing the ability for groups to manage their segmentation/sandbox of images. We aim to support multi-datacenter georeplication at a future date, and want to provide a stable image URL for developers to embed in their Dockerfiles and deployment files (docker-compose.yml). 

We hope to stabilize the login URLs in the coming weeks. We will provide a grace period to move your images from the `-exp` registry instances to the public preview instances.

> [!IMPORTANT]
> The **The Azure Container Registry service is NOT yet public**. On November 16, 2016, we will announce public preview availability at Connect().
> 
> 

## Support
For support, please email: [Azure Container Registry Discussions](mailto:acr-disc@microsoft.com)

## Next steps
* [Request Access to the ACR private preview](./container-registry-get-access.md)
* [Create a container registry using the Azure portal ](container-registry-get-started-portal.md)
* [Authenticate with a container registry](container-registry-authentication.md) 
* [Install the Azure CLI for Container Registry preview](./container-registry-get-started-azure-cli-install.md)
* [Create a container registry using the Azure CLI](container-registry-get-started-docker-cli.md)
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)

