---
title: Image storage in Azure Container Registry
description: Overview of how your Docker container images are stored in Azure Container Registry.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 03/06/2018
ms.author: marsma
---

# Container image storage in Azure Container Registry

Every [Basic, Standard, or Premium](container-registry-skus.md) Azure container registry is backed by an Azure Storage account managed by Azure. This managed storage scheme provides several benefits, including SSE encryption of your images and geo-redundant storage for high availability. The following sections describe both the features and limits of image storage in Azure Container Registry (ACR).

## Encryption-at-rest

All container images are encrypted at rest using [Storage Service Encryption (SSE)](../storage/common/storage-service-encryption.md). Azure automatically encrypts your image data before storing it, and decrypts it on-the-fly when you or your applications and services pull an image.

## Geo-redundant storage

Container images are stored in [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage) storage accounts. Your images are automatically replicated to a secondary data center that is geographically distant from your registry's location. In the case of a regional failure, ACR automatically routes requests to this secondary region for continued access to your images.

## Indefinite storage

For as long as you keep your registry active, Azure Container Registry will maintain your images. You can delete images by using the Azure CLI, the REST API, or with the Azure portal.

## Capacity limits

ACR limits storage based on the selected SKU. Other than the Basic SKU, which is intended for single-developer workflows, ACR doesn't limit storage based on a pricing model. ACR limits storage based on a best practice for the number of active image typically maintained.

For additional details about pricing, see [Azure Container Registry pricing](http://aka.ms/acr/pricing).

## Image limits

ACR imposes no limits on the number of images, layers, or repositories within a registry.

## Backup

With GRS-backed storage, Azure Container Registry distributes images across multiple regional data centers for high availability. As such, ACR doesn't provide an automated export feature for backing up images to another storage account or platform. For a manual backup solution, you could iterate through the list of images in your registry, pull each image locally, then transfer them to an alternate storage platform.

## Next steps

For more information about the different Azure Container Registry SKUs (Basic, Standard, Premium), see [Azure Container Registry SKUs](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->
