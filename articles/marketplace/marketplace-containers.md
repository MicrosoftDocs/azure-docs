---
title: Publishing guide for container offers in Azure Marketplace 
description: This article describes the requirements to publish container offers in Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 11/30/2020
---

# Publishing guide for Azure container offers

Azure container offers help you publish your container image to Azure Marketplace. Use this guide to understand the requirements for this offer type.

Azure container offers are transaction offers that are deployed and billed through Azure Marketplace. The listing option that a user sees is "Get It Now."

Use the Azure Container offer type when your solution is a Docker container image that's set up as a Kubernetes-based Azure Container instance.

> [!NOTE]
> An Azure Container instance is a run time docker instance that provides the fastest and simplest way to run a container in Azure, without having to manage any virtual machines and without having to adopt a higher-level service. Container instances can be deployed directly to Azure or orchestrated by Azure Kubernetes Services or Azure Kubernetes Service Engine.  

Microsoft currently supports free and bring-your-own-license (BYOL) licensing models.

## Container offer requirements

| Requirement | Details |  
|:--- |:--- |  
| Billing and metering | Support either the free or BYOL billing model.<br><br> |  
| Image built from a Dockerfile | Container images must be based on the Docker image specification and built from a Dockerfile.<br> <br>For more information about building Docker images, see the "Usage" section of [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#usage).<br><br> |  
| Hosting in an Azure Container Registry repository | Container images must be hosted in an Azure Container Registry repository.<br> <br>For more information about working with Azure Container Registry, see [Quickstart: Create a private container registry by using the Azure portal](../container-registry/container-registry-get-started-portal.md).<br><br> |  
| Image tagging | Container images must contain at least one tag (maximum number of tags: 16).<br><br>For more information about tagging an image, see the `docker tag` page on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/tag) site.<br><br> |  

## Next steps

- To prepare technical assets for a container offer, see [Create Azure container technical assets](create-azure-container-technical-assets.md).

- To create an Azure container offer, see [Create an Azure container offer in Azure Marketplace](create-azure-container-offer.md) for more information.
