---
title: Introduction to Azure Container Service for Kubernetes | Microsoft Docs
description: Azure Container Service for Kubernetes makes it simple to deploy and manage container-based applications on Azure.
services: container-service
documentationcenter: ''
author: gabrtv
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Kubernetes, Docker, Containers, Microservices, Azure

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: gamonroy
ms.custom: mvc

---

# Introduction to Azure Container Service (AKS)

Azure Container Service (AKS) makes it simple to create, configure, and manage a cluster of virtual machines that are preconfigured to run containerized applications. This enables you to use your existing skills, or draw upon a large and growing body of community expertise, to deploy and manage container-based applications on Microsoft Azure.

By using AKS, you can take advantage of the enterprise-grade features of Azure, while still maintaining application portability through Kubernetes and the Docker image format.

## Using Azure Container Service (AKS)
Our goal with AKS is to provide a container hosting environment by using open-source tools and technologies that are popular among our customers today. To this end, we expose the standard Kubernetes API endpoints. By using these standard endpoints, you can leverage any software that is capable of talking to a Kubernetes cluster. For example, you might choose [kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/), [helm](https://helm.sh/), or [draft](https://github.com/Azure/draft).

## Creating a Kubernetes cluster using Azure Container Service (AKS)
To begin using AKS, deploy an AKS cluster with the [Azure CLI](./kubernetes-walkthrough.md) or via the portal (search the Marketplace for **Azure Container Service**). If you are an advanced user who needs more control over the Azure Resource Manager templates, you can use the open source [acs-engine](https://github.com/Azure/acs-engine) project to build your own custom Kubernetes cluster and deploy it via the `az` CLI.

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

## Videos

Azure Container Service (AKS) - Azure Friday, October 2017:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Container-Orchestration-Simplified-with-Managed-Kubernetes-in-Azure-Container-Service-AKS/player]
>
>

Tools for Developing and Deploying Applications on Kubernetes - Azure OpenDev, June 2017:

> [!VIDEO https://channel9.msdn.com/Events/AzureOpenDev/June2017/Tools-for-Developing-and-Deploying-Applications-on-Kubernetes/player]
>
>

Learn more about deploying and managing AKS with the AKS quickstart.

> [!div class="nextstepaction"]
> [AKS Tutorial](./kubernetes-walkthrough.md)