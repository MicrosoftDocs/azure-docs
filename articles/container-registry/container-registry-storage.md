---
title: Image storage in Azure Container Registry
description: Details on how your Docker container images are stored in Azure Container Registry, including security, redundancy, and capacity.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 03/14/2018
ms.author: marsma
---

# Container image storage in Azure Container Registry

Every [Basic, Standard, and Premium](container-registry-skus.md) Azure container registry benefits from advanced Azure storage features like encryption-at-rest for image data security and geo-redundancy for high availability. The following sections describe both the features and limits of image storage in Azure Container Registry (ACR).

## Encryption-at-rest

All container images in your registry are encrypted at rest. Azure automatically encrypts your image data before storing it, and decrypts it on-the-fly when you or your applications and services pull an image.

## Geo-redundant storage

Azure uses a geo-redundant storage scheme to help ensure high availability of your container registry. Your images are automatically replicated to data centers that are geographically distant from your registry's primary location. In the event of a regional failure, Azure Container Registry automatically and transparently routes requests to a healthy region for continued access to your images.

## Image limits

The following table describes the container image and storage limits in place for Azure container registries.

| Resource | Limit |
| -------- | :---- |
| Repostories | No limit |
| Images | No limit |
| Layers | No limit |
| Tags | No limit|
| Storage | 5 TB |

Very high numbers of repositories and tags can impact the performance of your registry. Periodically delete unused repositories, tags, and images by using the [Azure CLI](/cli/azure/acr), the ACR [REST API](/rest/api/containerregistry/), or the [Azure portal][portal] as part of your registry management routine. Deleted registry resources like repositories, images, and tags can *not* be recovered after deletion.

## Storage cost

The Basic, Standard, and Premium service tiers are priced at a daily rate that aligns with their performance capabilities and feature set, up to a certain storage threshold. The Standard and Premium tiers enable storage above these thresholds, and the overage (the amount above the threshold) is charged at the same per-day rate for both tiers.

For full details about pricing, see [Azure Container Registry pricing][pricing].

## Backup

With GRS-backed storage, Azure Container Registry distributes images across multiple regional data centers for high availability. ACR doesn't currently provide an automated export feature for backing up images to another storage account or platform. For a manual backup solution, you can iterate through the list of images in your registry, pull each image locally, then transfer them to an alternate storage platform.

## Next steps

For more information about the different Azure Container Registry SKUs (Basic, Standard, Premium), see [Azure Container Registry SKUs](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com
[pricing]: http://aka.ms/acr/pricing

<!-- LINKS - Internal -->
