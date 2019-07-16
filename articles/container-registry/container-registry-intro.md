---
title: Private Docker container registries in Azure - overview
description: Introduction to the Azure Container Registry service, providing cloud-based, managed, private Docker registries.
services: container-registry
author: stevelas

ms.service: container-registry
ms.topic: overview
ms.date: 06/28/2019
ms.author: stevelas
ms.custom: "seodec18, mvc"
---
# Introduction to private Docker container registries in Azure

Azure Container Registry is a managed, private Docker registry service based on the open-source Docker Registry 2.0. Create and maintain Azure container registries to store and manage your private Docker container images.

Use Azure container registries with your existing container development and deployment pipelines, or use Azure Container Registry Tasks to build container images in Azure. Build on demand, or fully automate builds with triggers such as source code commits and base image updates.

For more about Docker and registry concepts, see the [Docker overview](https://docs.docker.com/engine/docker-overview/) and [About registries, repositories, and images](container-registry-concepts.md).

## Use cases

Pull images from an Azure container registry to various deployment targets:

* **Scalable orchestration systems** that manage containerized applications across clusters of hosts, including [Kubernetes](https://kubernetes.io/docs/), [DC/OS](https://docs.mesosphere.com/), and [Docker Swarm](https://docs.docker.com/swarm/).
* **Azure services** that support building and running applications at scale, including [Azure Kubernetes Service (AKS)](../aks/index.yml), [App Service](../app-service/index.yml), [Batch](../batch/index.yml), [Service Fabric](/azure/service-fabric/), and others.

Developers can also push to a container registry as part of a container development workflow. For example, target a container registry from a continuous integration and delivery tool such as [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines.md) or [Jenkins](https://jenkins.io/).

Configure ACR Tasks to automatically rebuild application images when their base images are updated, or automate image builds when your team commits code to a Git repository. Create multi-step tasks to automate building, testing, and patching multiple container images in parallel in the cloud.

Azure provides tooling including Azure Command-Line Interface, Azure portal, and API support to manage your Azure container registries. Optionally install the [Docker Extension for Visual Studio Code](https://code.visualstudio.com/docs/azure/docker) and the [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) extension to work with your Azure container registries. Pull and push images to an Azure container registry, or run ACR Tasks, all within Visual Studio Code.

## Key features

* **Registry SKUs** - Create one or more container registries in your Azure subscription. Registries are available in three SKUs: [Basic, Standard, and Premium](container-registry-skus.md), each of which supports webhook integration, registry authentication with Azure Active Directory, and delete functionality. Take advantage of local, network-close storage of your container images by creating a registry in the same Azure location as your deployments. Use the [geo-replication](container-registry-geo-replication.md) feature of Premium registries for advanced replication and container image distribution scenarios. 

  You [control access](container-registry-authentication.md) to a container registry using an Azure identity, an Azure Active Directory-backed [service principal](../active-directory/develop/app-objects-and-service-principals.md), or a provided admin account. Log in to the registry using the Azure CLI or the standard `docker login` command.

* **Supported images and artifacts** - Grouped in a repository, each image is a read-only snapshot of a Docker-compatible container. Azure container registries can include both Windows and Linux images. You control image names for all your container deployments. Use standard [Docker commands](https://docs.docker.com/engine/reference/commandline/) to push images into a repository, or pull an image from a repository. In addition to Docker container images, Azure Container Registry stores [related content formats](container-registry-image-formats.md) such as [Helm charts](container-registry-helm-repos.md) and images built to the [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md).

* **Azure Container Registry Tasks** - Use [Azure Container Registry Tasks](container-registry-tasks-overview.md) (ACR Tasks) to streamline building, testing, pushing, and deploying images in Azure. For example, use ACR Tasks to extend your development inner-loop to the cloud by offloading `docker build` operations to Azure. Configure build tasks to automate your container OS and framework patching pipeline, and build images automatically when your team commits code to source control.

  [Multi-step tasks](container-registry-tasks-overview.md#multi-step-tasks) provide step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps define individual container image build and push operations. They can also define the execution of one or more containers, with each step using the container as its execution environment.

## Next steps

* [Create a container registry using the Azure portal](container-registry-get-started-portal.md)
* [Create a container registry using the Azure CLI](container-registry-get-started-azure-cli.md)
* [Automate container builds and maintenance with ACR Tasks](container-registry-tasks-overview.md)
