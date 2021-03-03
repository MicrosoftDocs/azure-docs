---
title: Container image storage 
description: Details on how your container images and other artifacts are stored in Azure Container Registry, including security, redundancy, and capacity.
ms.topic: article
ms.date: 03/02/2021
ms.custom: references_regions
---

# Container image storage in Azure Container Registry

Every [Basic, Standard, and Premium](container-registry-skus.md) Azure container registry benefits from advanced Azure storage features like encryption-at-rest for image data security and geo-redundancy for image data protection. The following sections describe both the features and limits of image storage in Azure Container Registry (ACR).

## Encryption-at-rest

All container images and other artifacts in your registry are encrypted at rest. Azure automatically encrypts an image before storing it, and decrypts it on-the-fly when you or your applications and services pull the image. Optionally apply an extra encryption layer with a [customer-managed key](container-registry-customer-managed-keys.md).

## Geo-redundant storage

For container registries deployed in most regions, Azure uses a geo-redundant storage scheme to help guard against loss of your container images and other artifacts. Azure Container Registry automatically replicates your container images to multiple geographically distant data centers, preventing their loss if a regional storage failure occurs.

> [!IMPORTANT]
> * If a regional storage failure occurs, registry data can only be recovered by contacting Azure Support. 
> * Due to data residency requirements in Brazil South, and Southeast Asia, Azure Container Registry data in those regions is stored on [local geo only](https://azure.microsoft.com/global-infrastructure/geographies/). For Southeast Asia, all the data are stored in Singapore. For Brazil South, all data are stored in Brazil. When the region is lost due to a significant disaster, Microsoft will not be able to recover your Azure Container Registry data.

## Geo-replication

For scenarios requiring even more high-availability assurance, consider using the [geo-replication](container-registry-geo-replication.md) feature of Premium registries. Geo-replication helps guard against losing access to your registry in the event of a *total* regional failure, not just a storage failure. Geo-replication provides other benefits, too, like network-close image storage for faster pushes and pulls in distributed development or deployment scenarios.

## Zone redundancy

To create a resilient and high-availability Azure container registry, optionally enable [zone redundancy](zone-redundancy.md) in select Azure regions. A feature of the Premium service tier, Zone redundancy uses Azure [availability zones](../availability-zones/az-overview.md) to replicate your registry to a minimum of three separate zones in each enabled region. Combine geo-replication and zone redundancy to enhance both the reliability and performance of a registry. 

## Scalable storage

Azure Container Registry allows you to create as many repositories, images, layers, or tags as you need, up to the [registry storage limit](container-registry-skus.md#service-tier-features-and-limits). 

High numbers of repositories and tags can affect the performance of your registry. Periodically delete unused repositories, tags, and images as part of your registry maintenance routine, and optionally set a [retention policy](container-registry-retention-policy.md) for untagged manifests. Deleted registry resources such as repositories, images, and tags *cannot* be recovered after deletion. For more information about deleting registry resources, see [Delete container images in Azure Container Registry](container-registry-delete.md).

## Storage cost

For full details about pricing, see [Azure Container Registry pricing][pricing].

## Next steps

For more information about Basic, Standard, and Premium container registries, see [Azure Container Registry service tiers](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com
[pricing]: https://aka.ms/acr/pricing

<!-- LINKS - Internal -->
