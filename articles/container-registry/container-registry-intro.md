---
title: Introduction to Azure Container Registry
description: Get basic information about the Azure service that provides cloud-based, managed container registries.
author: tejaswikolli-web
ms.topic: overview
ms.date: 10/31/2023
ms.author: tejaswikolli
ms.service: container-registry
ms.custom: mvc
---

# Introduction to Azure Container Registry

Azure Container Registry is a managed registry service based on the open-source Docker Registry 2.0. Create and maintain Azure container registries to store and manage your container images and related artifacts.

Use container registries with your existing container development and deployment pipelines, or use Azure Container Registry tasks to build container images in Azure. Build on demand, or fully automate builds with triggers such as source code commits and base image updates.

To learn more about Docker and registry concepts, see the [Docker overview on Docker Docs](https://docs.docker.com/engine/docker-overview/) and [About registries, repositories, and images](container-registry-concepts.md).

## Use cases

Pull images from an Azure container registry to various deployment targets:

* *Scalable orchestration systems* that manage containerized applications across clusters of hosts, including [Kubernetes](https://kubernetes.io/docs/), [DC/OS](https://dcos.io/), and [Docker Swarm](https://docs.docker.com/get-started/swarm-deploy/).
* *Azure services* that support building and running applications at scale, such as [Azure Kubernetes Service (AKS)](../aks/index.yml), [App Service](../app-service/index.yml), [Batch](../batch/index.yml), and [Service Fabric](../service-fabric/index.yml).

Developers can also push to a container registry as part of a container development workflow. For example, you can target a container registry from a continuous integration and continuous delivery (CI/CD) tool such as [Azure Pipelines](/azure/devops/pipelines/ecosystems/containers/acr-template) or [Jenkins](https://jenkins.io/).

Configure Azure Container Registry tasks to automatically rebuild application images when their base images are updated, or automate image builds when your team commits code to a Git repository. Create multi-step tasks to automate building, testing, and patching container images in parallel in the cloud.

Azure provides tooling like the Azure CLI, the Azure portal, and API support to manage your container registries. Optionally, install the [Docker extension](https://code.visualstudio.com/docs/azure/docker) and the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) for Visual Studio Code. You can use these extensions to pull images from a container registry, push images to a container registry, or run Azure Container Registry tasks, all within Visual Studio Code.

## Key features

* **Registry service tiers**: Create one or more container registries in your Azure subscription. Registries are available in three tiers: [Basic, Standard, and Premium](container-registry-skus.md). Each tier supports webhook integration, registry authentication with Microsoft Entra ID, and delete functionality.

  Take advantage of local, network-close storage of your container images by creating a registry in the same Azure location as your deployments. Use the [geo-replication](container-registry-geo-replication.md) feature of Premium registries for advanced replication and container image distribution.

* **Security and access**: You log in to a registry by using the Azure CLI or the standard `docker login` command. Azure Container Registry transfers container images over HTTPS, and it supports TLS to help secure client connections.

  > [!IMPORTANT]
  > As of January 13, 2020, Azure Container Registry requires all secure connections from servers and applications to use TLS 1.2. Enable TLS 1.2 by using any recent Docker client (version 18.03.0 or later).

  You [control access](container-registry-authentication.md) to a container registry by using an Azure identity, a Microsoft Entra [service principal](../active-directory/develop/app-objects-and-service-principals.md), or a provided admin account. Use Azure role-based access control (RBAC) to assign specific registry permissions to users or systems.

  Security features of the Premium service tier include [content trust](container-registry-content-trust.md) for image tag signing, and [firewalls and virtual networks (preview)](container-registry-vnet.md) to restrict access to the registry. Microsoft Defender for Cloud optionally integrates with Azure Container Registry to [scan images](/azure/container-registry/scan-images-defender) whenever you push an image to a registry.

* **Supported images and artifacts**: When images are grouped in a repository, each image is a read-only snapshot of a Docker-compatible container. Azure container registries can include both Windows and Linux images. You control image names for all your container deployments.

  Use standard [Docker commands](https://docs.docker.com/engine/reference/commandline/) to push images into a repository or pull an image from a repository. In addition to Docker container images, Azure Container Registry stores [related content formats](container-registry-image-formats.md) such as [Helm charts](container-registry-helm-repos.md) and images built to the [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md).

* **Automated image builds**: Use [Azure Container Registry tasks](container-registry-tasks-overview.md) to streamline building, testing, pushing, and deploying images in Azure. For example, use Azure Container Registry tasks to extend your development inner loop to the cloud by offloading `docker build` operations to Azure. Configure build tasks to automate your container OS and framework patching pipeline, and build images automatically when your team commits code to source control.

  [Multi-step tasks](container-registry-tasks-overview.md#multi-step-tasks) provide step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps define individual build and push operations for container images. They can also define the execution of one or more containers, in which each step uses a container as its execution environment.

## Related content

* [Create a container registry by using the Azure portal](container-registry-get-started-portal.md)
* [Create a container registry by using the Azure CLI](container-registry-get-started-azure-cli.md)
* [Automate container builds and maintenance by using Azure Container Registry tasks](container-registry-tasks-overview.md)
