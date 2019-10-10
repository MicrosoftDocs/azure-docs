---
title: Containers Offer Publishing Guide for Azure Marketplace
description: This article describes the requirements to publish Containers in the Marketplace
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security

author: ellacroi
manager: nunoc



ms.service: marketplace



ms.topic: article
ms.date: 07/09/2018
ms.author: ellacroi

---

# Containers Offer Publishing Guide

Container offers help you publish your container image to the Azure Marketplace. Use this guide to understand the requirements for this offer. 

These are transaction offers which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

Use the Container offer type when your solution is a Docker container image provisioned as a Kubernetes-based Azure container service.

>[!NOTE]
>For example, a Kubernetes-based Azure container service like Azure Kubernetes Service or Azure Container Instances, the choice of Azure customers for a Kubernetes-based container runtime.  

Microsoft currently supports free and bring-your-own-license (BYOL) licensing models.

## Containers Offer

| Requirement | Details |  
|:--- |:--- |  
| Billing and metering | Support either the free or BYOL billing model. |  
| Image built from Dockerfile | Container images must be based on the Docker image specification and must be built from a Dockerfile.<ul> <li>For more information about building docker images, visit the Usage section located at [docs.docker.com/engine/reference/builder/#usage](https://docs.docker.com/engine/reference/builder/#usage).</li> </ul> |  
| Hosting in ACR | Container images must be hosted in an Azure Container Registry (ACR) repository.<ul> <li>For more information about working with ACR, visit the Quickstart: Create a container registry using the Azure portal page located at [docs.microsoft.com/azure/container-registry/container-registry-get-started-portal](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal).</li> </ul> |  
| Image tagging | Container images must contain at least 1 tag (maximum tags: 16).<ul> <li>For more information about tagging an image, visit the docker tag page located at [docs.docker.com/engine/reference/commandline/tag](https://docs.docker.com/engine/reference/commandline/tag).</li> </ul> |  

## Next steps

If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace.

If you're registered and are creating a new offer or working on an existing one,

- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer.
- See [Containers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/containers/cpp-containers-offer) for more information.
