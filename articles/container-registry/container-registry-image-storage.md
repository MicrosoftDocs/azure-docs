---
title: Image storage in Azure Container Registry
description: Overview of how your Docker container images are stored in Azure Container Registry.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 03/02/2018
ms.author: marsma
---

# Container image storage in Azure Container Registry

Container images in your Azure container registry are automatically encrypted for added security, and stored in multiple regions for fault tolerance. This article discusses the details of how container images are stored in Azure.

## Image storage features

When you create a [Basic, Standard, or Premium](container-registry-skus.md) Azure Container Registry, images are stored in an Azure storage account managed by Azure. There are several benefits of the managed storage provided by Azure Container Registry:

### Encryption-at-rest

All container images are encrypted at rest using [Storage Service Encryption (SSE)](../storage/common/storage-service-encryption.md). Azure automatically encrypts your image data before storing it, and decrypts it on-the-fly when you or your applications and services pull an image.

### Geo-redundant storage for disaster failover

Container images are stored in [geo-redundant storage (GRS)](../storage/common/storage-redundancy#geo-redundant-storage) storage accounts managed by Azure. In the case of a regional failure, ACR will auto-route to backup storage accounts.

### Indefinite storage

For as long as you keep your registry active, ACR will maintain your images. You can delete images Azure CLI, the REST API, or with the Azure portal.

## Image storage limits

### Capacity limits

ACR limits storage based on the selected SKU. Other than the Basic SKU, which is intended for single-developer workflows, ACR doesn't limit storage based on a pricing model. ACR limits storage based on a best practice for the number of active image typically maintained. Please see [pricing](http://aka.ms/acr/pricing) for sizes.

### Image limits

ACR has no limits on the number of images, layers, or repositories within a registry.

## Backup

### Exporting images

 ACR shards images across multiple storage accounts, providing the highest availability. ACR does not currently support an export to a storage account feature. Using the catalog API, you may iterate through the list of images and pull them locally for alternate registry storage.

## Next steps

For more information about the different Azure Container Registry SKUs (Basic, Standard, Premium), see [Azure Container Registry SKUs](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->
