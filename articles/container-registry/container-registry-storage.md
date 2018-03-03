---
title: Image storage in Azure Container Registry
description: Details on how your Docker container images are stored in Azure Container Registry, including security, redundancy, and capacity.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 03/06/2018
ms.author: marsma
---

# Container image storage in Azure Container Registry

Every [Basic, Standard, and Premium](container-registry-skus.md) Azure container registry is backed by an Azure Storage account managed by Azure. This managed storage scheme provides several benefits, including encryption-at-rest for image data security and geo-redundant storage for high availability. The following sections describe both the features and limits of image storage in Azure Container Registry (ACR).

## Managed storage

Azure manages the storage of your container images in an Azure Storage account dedicated only to your registry, containing only your images. This storage account is managed entirely by Azure, so it doesn't appear in your subscription. Because Azure manages the account, role-based access control is simplified by requiring you to manage permissions only for the registry, and not the storage account backing your images.

## Encryption-at-rest

All container images are encrypted at rest using [Storage Service Encryption (SSE)](../storage/common/storage-service-encryption.md). Azure automatically encrypts your image data before storing it, and decrypts it on-the-fly when you or your applications and services pull an image. Azure manages the encryption keys for you; you cannot currently use your own encryption keys.

## Geo-redundant storage

Container images are stored in [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage) storage accounts. Your images are automatically replicated to a secondary data center that is geographically distant from your registry's primary location. In the event of a regional failure, Azure Container Registry automatically and transparently routes requests to this secondary region for continued access to your images. For even more redundancy, consider using ACR's [geo-replication feature](container-registry-geo-replication.md).

## Capacity limits

To help protect against unexpected charges due to abnormal registry usage, Azure Container Registry enforces capacity limits for each of the service tiers (SKUs). For example, Premium registries are limited to 5 TB. These limits are enforced primarily as a safety measure; for example, to mitigate a misbehaving script pushing massive numbers of images to the registry. These capacity limits aren't expected to be reached during normal production usage of a registry.

## Image count limits

Azure Container Registry imposes no limits on the number of images, layers, tags, or repositories in a registry. However, very high numbers of repositories and tags can impact the performance of your registry.

Periodically delete unused repositories, tags, and images by using the [Azure CLI](/cli/azure/acr), the ACR [REST API](/rest/api/containerregistry/), or the [Azure portal][portal] as part of your registry management routine. Deleted registry resources like repositories, images, and tags can *not* be recovered after deletion.

## Storage cost

The Basic, Standard, and Premium service tiers are priced according to their intended usage and feature set, but do not differ in the cost of image storage. For details about pricing, see [Azure Container Registry pricing][pricing].

## Backup

With GRS-backed storage, Azure Container Registry distributes images across multiple regional data centers for high availability. As such, ACR doesn't provide an automated export feature for backing up images to another storage account or platform. For a manual backup solution, you can iterate through the list of images in your registry, pull each image locally, then transfer them to an alternate storage platform.

## Next steps

For more information about the different Azure Container Registry SKUs (Basic, Standard, Premium), see [Azure Container Registry SKUs](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com
[pricing]: http://aka.ms/acr/pricing

<!-- LINKS - Internal -->
