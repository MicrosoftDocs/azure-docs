---
title: Publishing guide for container offers in Azure Marketplace 
description: This article describes the requirements to publish container offers in Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: dsindona

---

# Publishing guide for container offers

Container offers help you publish your container image to Azure Marketplace. Use this guide to understand the requirements for this offer. 

Container offers are transaction offers that are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

Use the *Container* offer type when your solution is a Docker container image provisioned as a Kubernetes-based Azure Container Service. 

> [!NOTE]
> Examples of a Kubernetes-based Azure Container Service are Azure Kubernetes Service or Azure Container Instances, the choice of Azure customers for a Kubernetes-based container runtime.  

Microsoft currently supports free and bring-your-own-license (BYOL) licensing models.

## Container offer requirements

| Requirement | Details |  
|:--- |:--- |  
| Billing and metering | <br>Support either the free or BYOL billing model.<br><br> |  
| Image built from a Dockerfile | <br>Container images must be based on the Docker image specification and must be built from a Dockerfile.<br> <br>For more information about building Docker images, see the "Usage" section of [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#usage).<br><br> |  
| Hosting in Azure Container Registry repository | <br>Container images must be hosted in an Azure Container Registry repository.<br> <br>For more information about working with Azure Container Registry, see [Quickstart: Create a private container registry by using the Azure portal](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal).<br><br> |  
| Image tagging | <br>Container images must contain at least 1 tag (maximum number of tags: 16).<br><br>For more information about tagging an image, see the "docker tag" page on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/tag) site.<br><br> |  

## Next steps

If you haven't already done so, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

To register for and start working in Partner Center:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [Create a consulting service offer](./partner-center-portal/create-consulting-service-offer.md) for more information.
