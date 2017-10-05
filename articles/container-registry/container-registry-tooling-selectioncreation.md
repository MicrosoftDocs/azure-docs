---
title: Tooling the selection and creation of a Azure Container Registry | Microsoft Docs
description: Overview for tooling the selection or creation of an Azure Container Registry.
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: ''
tags: ''
keywords: ''

ms.assetid: 128a937a-766a-41eb-b9ec-35b6c2e27417
ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/04/2017
ms.author: stevelas
ms.custom: ''
---
# Tooling Selection and Creation of Azure Container Registries
When building tooling that integrates with the Azure Container Registry, there are a set of common questions that developers ask. This article highlights the reasoning behind the default values.

# Selection vs. Creation
Containers are quickly becoming the new unit of deployment, and generally aren't built to a specific host. Containers are being used across various different services. Customers may deploy images to ACS, App Services, Azure Batch, Machine Learning, VMs or simply use images for local build and test environments. 

Customers may have different registries for Development and Production, or may have different registries for different development groups or organizations. Many companies will create corporate registries for their corporate standard images. While development teams maintain their own registries. However, limiting a registry to a single deployment will overly constrain the scenario to share images across multiple hosts. 

For this reason, when tooling the association of a registry with a new container host, defaulting to the selection of existing registries will promote this best practice behavior. 

# Network Close Deployments
One of the main reasons for deploying a private registry is to have it network-close to your container hosts.
Docker images have a great layering construct that allows for incremental deployments. However, new nodes will need to pull all layers required for a given image. This initial docker pull can quickly add up to multiple gigabytes. Having a private registry close to your deployment will minimize the network latency. 
Further, all public clouds implement network egress fees. Pulling images from one data center to anther will add network egress fees, in addition to the latency. 
To minimize latency and network egress fees, configure the container registry to the same region as your deployment. If you're managing multiple regions, use the [geo-replication](container-registry-overview-geo-replication.md) feature of ACR to manage multiple regions as one registry.

# Defaults for Creating Azure Container Registries
Creating a new container registry has a few required values. Many of these may have logical defaults.

