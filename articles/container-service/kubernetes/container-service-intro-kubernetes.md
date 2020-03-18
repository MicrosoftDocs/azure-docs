---
title: (DEPRECATED) Introduction to Azure Container Service for Kubernetes
description: Azure Container Service for Kubernetes makes it simple to deploy and manage container-based applications on Azure.
author: gabrtv

ms.service: container-service
ms.topic: overview
ms.date: 07/21/2017
ms.author: gamonroy
ms.custom: mvc
---

# (DEPRECATED) Introduction to Azure Container Service for Kubernetes

> [!TIP]
> For the updated version this article that uses Azure Kubernetes Service, see [Azure Kubernetes Service (AKS) overview](../../aks/intro-kubernetes.md).

[!INCLUDE [ACS deprecation](../../../includes/container-service-kubernetes-deprecation.md)]

Azure Container Service for Kubernetes makes it simple to create, configure, and manage a cluster of virtual machines that are preconfigured to run containerized applications. This enables you to use your existing skills, or draw upon a large and growing body of community expertise, to deploy and manage container-based applications on Microsoft Azure.

By using Azure Container Service, you can take advantage of the enterprise-grade features of Azure, while still maintaining application portability through Kubernetes and the Docker image format.

## Using Azure Container Service for Kubernetes
Our goal with Azure Container Service is to provide a container hosting environment by using open-source tools and technologies that are popular among our customers today. To this end, we expose the standard Kubernetes API endpoints. By using these standard endpoints, you can leverage any software that is capable of talking to a Kubernetes cluster. For example, you might choose [kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/), [helm](https://helm.sh/), or [draft](https://github.com/Azure/draft).

## Creating a Kubernetes cluster using Azure Container Service
To begin using Azure Container Service, deploy an Azure Container Service cluster with the [Azure CLI](container-service-kubernetes-walkthrough.md) or via the portal (search the Marketplace for **Azure Container Service**). If you are an advanced user who needs more control over the Azure Resource Manager templates, you can use the open source [acs-engine](https://github.com/Azure/acs-engine) project to build your own custom Kubernetes cluster and deploy it via the `az` CLI.

### Using Kubernetes
Kubernetes automates deployment, scaling, and management of containerized applications. It has a rich set of features including:
* Automatic binpacking
* Self-healing
* Horizontal scaling
* Service discovery and load balancing
* Automated rollouts and rollbacks
* Secret and configuration management
* Storage orchestration
* Batch execution

Architectural diagram of Kubernetes deployed via Azure Container Service:

![Azure Container Service configured to use Kubernetes.](media/acs-intro/kubernetes.png)

## Videos

Kubernetes Support in Azure Container Services (Azure Friday, January 2017):

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Kubernetes-Support-in-Azure-Container-Services/player]
>
>

Tools for Developing and Deploying Applications on Kubernetes (Azure OpenDev, June 2017):

> [!VIDEO https://channel9.msdn.com/Events/AzureOpenDev/June2017/Tools-for-Developing-and-Deploying-Applications-on-Kubernetes/player]
>
>

## Next steps

Explore the [Kubernetes Quickstart](container-service-kubernetes-walkthrough.md) to begin exploring Azure Container Service today.
