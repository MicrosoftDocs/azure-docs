---
title: Private Docker container registries in Azure | Microsoft Docs
description: Introduction to the Azure Container Registry service, providing cloud-based, managed, private Docker registries.
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.assetid: ee2b652b-fb7c-455b-8275-b8d4d08ffeb3
ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---
# Introduction to private Docker container registries


Azure Container Registry is a managed [Docker registry](https://docs.docker.com/registry/) service based on the open-source Docker Registry 2.0. Create and maintain Azure container registries to store and manage your private [Docker container](https://www.docker.com/what-docker) images. Use container registries in Azure with your existing container development and deployment pipelines, and draw on the body of Docker community expertise.

For background about Docker and containers, see:

* [Docker user guide](https://docs.docker.com/engine/userguide/)




## Use cases
Pull images from an Azure container registry to various deployment targets:

* **Scalable orchestration systems** that manage containerized applications across clusters of hosts, including [DC/OS](https://docs.mesosphere.com/), [Docker Swarm](https://docs.docker.com/swarm/), and [Kubernetes](http://kubernetes.io/docs/).
* **Azure services** that support building and running applications at scale, including [Container Service](../container-service/index.md), [App Service](/app-service/index.md), [Batch](../batch/index.md), [Service Fabric](../service-fabric/index.md), and others.

Developers can also push to a container registry as part of a container development workflow. For example, target a container registry from a continuous integration and deployment tool such as [Visual Studio Team Services](https://www.visualstudio.com/docs/overview) or [Jenkins](https://jenkins.io/).





## Key concepts
* **Registry** - Create one or more container registries in your Azure subscription. Each registry is backed by a standard Azure [storage account](../storage/storage-introduction.md) in the same location. Take advantage of local, network-close storage of your container images by creating a registry in the same Azure location as your deployments. A fully qualified registry name has the form `myregistry.azurecr.io`.

  You [control access](container-registry-authentication.md) to a container registry using an Azure Active Directory-backed [service principal](../active-directory/active-directory-application-objects.md) or a provided admin account. Run the standard `docker login` command to authenticate with a registry.

* **Repository** - A registry contains one or more repositories, which are groups of container images. Azure Container Registry supports multilevel repository namespaces. This feature enables you to group collections of images related to a specific app, or a collection of apps to specific development or operational teams. For example:

  * `myregistry.azurecr.io/aspnetcore:1.0.1` represents a corporate-wide image
  * `myregistry.azurecr.io/warrantydept/dotnet-build` represents an image used to build .NET apps, shared across the warranty department
  * `myregistry.azrecr.io/warrantydept/customersubmissions/web` represents a web image, grouped in the customer submissions app, owned by the warranty department

* **Image** - Stored in a repository, each image is a read-only snapshot of a Docker container. Azure container registries can include both Windows and Linux images. You control image names for all your container deployments. Use standard [Docker commands](https://docs.docker.com/engine/reference/commandline/) to push images into a repository, or pull an image from a repository.

* **Container** - A container defines a software application and its dependencies wrapped in a complete filesystem including code, runtime, system tools, and libraries. Run Docker containers based on Windows or Linux images that you pull from a container registry. Containers running on a single machine share the operating system kernel. Docker containers are fully portable to all major Linux distros, Mac, and Windows.




## Next steps
* [Create a container registry using the Azure portal](container-registry-get-started-portal.md)
* [Create a container registry using the Azure CLI](container-registry-get-started-azure-cli.md)
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)
* To build a continuous integration and deployment workflow using Visual Studio Team Services, Azure Container Service, and Azure Container Registry, see [this tutorial](../container-service/container-service-docker-swarm-setup-ci-cd.md).
* If you want to set up your own Docker private registry in Azure (without a public endpoint), see [Deploying Your Own Private Docker Registry on Azure](../virtual-machines/virtual-machines-linux-docker-registry-in-blob-storage.md).
