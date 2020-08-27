---
title: Container image storage 
description: Details on how your Docker container images are stored in Azure Container Registry, including security, redundancy, and capacity.
ms.topic: article
ms.date: 06/18/2020
---

# Container image storage in Azure Container Registry

Every [Basic, Standard, and Premium](container-registry-skus.md) Azure container registry benefits from advanced Azure storage features like encryption-at-rest for image data security and geo-redundancy for image data protection. The following sections describe both the features and limits of image storage in Azure Container Registry (ACR).

## Encryption-at-rest

All container images in your registry are encrypted at rest. Azure automatically encrypts an image before storing it, and decrypts it on-the-fly when you or your applications and services pull the image. Optionally apply an additional encryption layer with a [customer-managed key](container-registry-customer-managed-keys.md).

## Geo-redundant storage

Azure uses a geo-redundant storage scheme to guard against loss of your container images. Azure Container Registry automatically replicates your container images to multiple geographically distant data centers, preventing their loss in the event of a regional storage failure.

## Geo-replication

For scenarios requiring even more high-availability assurance, consider using the [geo-replication](container-registry-geo-replication.md) feature of Premium registries. Geo-replication helps guard against losing access to your registry in the event of a *total* regional failure, not just a storage failure. Geo-replication provides other benefits, too, like network-close image storage for faster pushes and pulls in distributed development or deployment scenarios.

## Scalable storage

Azure Container Registry allows you to create as many repositories, images, layers, or tags as you need, up to the [registry storage limit](container-registry-skus.md#service-tier-features-and-limits). 

Very high numbers of repositories and tags can impact the performance of your registry. Periodically delete unused repositories, tags, and images as part of your registry maintenance routine, and optionally set a [retention policy](container-registry-retention-policy.md) for untagged manifests. Deleted registry resources such as repositories, images, and tags *cannot* be recovered after deletion. For more information about deleting registry resources, see [Delete container images in Azure Container Registry](container-registry-delete.md).

## Storage cost

For full details about pricing, see [Azure Container Registry pricing][pricing].

## Next steps

For more information about Basic, Standard, and Premium container registries, see [Azure Container Registry service tiers](container-registry-skus.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com
[pricing]: https://aka.ms/acr/pricing

<!-- LINKS - Internal -->
