---
title: Upgrade a Classic Azure container registry
description: Take advantage of the expanded feature set of Basic, Standard, and Premium managed container registries by upgrading your Classic unmanaged container registry.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 12/12/2017
ms.author: marsma
---

# Upgrade a Classic container registry

Azure Container Registry (ACR) is available in several service tiers, [known as SKUs](container-registry-skus.md). The initial release of ACR offered a single SKU, Classic, that lacks features inherent to the [Basic, Standard, and Premium SKUs](container-registry-skus.md) (collectively known as *managed* registries). This article describes these differences, and includes details about migrating an unmanaged Classic registry to one of the managed SKUs.

### Why upgrade?

Because of the limited capabilities of Classic registries, we recommend all Classic registries be upgraded Basic, Standard, or Premium. These higher-level SKUs more deeply integrate the registry into the capabilities of Azure. Some of these capabilities include:

* Azure Active Directory integration for [individual login](container-registry-authentication.md#individual-login-with-azure-ad)
* Image and tag deletion support
* [Geo-replication](container-registry-geo-replication.md)
* [Webhooks](container-registry-webhook.md)

Most of all, a Classic registry depends on the storage account that Azure automatically provisioned in your Azure subscription when you created the registry. By contrast, the Basic, Standard, and Premium SKUs take advantage of *managed storage*. That is, Azure transparently manages the storage of your images for you--a separate storage account is not created in your own subscription.

Some of the benefits of managed storage provided by Basic, Standard, and Premium registries:

* Container images are [encrypted at rest](../storage/common/storage-service-encryption.md).
* Images are stored using [geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage), assuring backup of your images with multi-region replication.
* Ability to [move to between SKUs](#changing-skus), enabling higher throughput when you choose a higher-level SKU. With each SKU, ACR can meet your throughput requirements as your needs increase. The underlying implementation of how ACR achieves the desired throughput is expressed as *intent* (by selecting higher SKUs), without you having to manage the details of the implementation.

## Migration considerations

When you change a Classic registry to Basic, Standard, or Premium, Azure copies existing container images from the associated storage account in your subscription to a storage account managed by Azure. This process can take some time.

During conversion, `docker pull` continues to function, however, `docker push` is blocked until conversion is complete.

Once completed, the subscription storage account is no longer used by ACR.

## How to upgrade

TODO: **DETAIL MIGRATION STEPS HERE**

## Next steps

**Azure Container Registry Roadmap**

Visit the [ACR Roadmap](https://aka.ms/acr/roadmap) on GitHub to find information about upcoming features in the service.

**Azure Container Registry UserVoice**

Submit and vote on new feature suggestions in [ACR UserVoice](https://feedback.azure.com/forums/903958-azure-container-registry).