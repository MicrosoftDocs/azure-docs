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

Azure Container Registry (ACR) is available in several service tiers, [known as SKUs](container-registry-skus.md). The initial release of ACR offered a single SKU, Classic, that lacks several features inherent to the [Basic, Standard, and Premium SKUs](container-registry-skus.md) (collectively known as *managed* SKUs). This article dtails how to migrate your unmanaged Classic registry to one of the managed SKUs so that you can take advantage of their enhanced feature set.

## Why upgrade?

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

When you change a Classic registry to a managed registry, Azure must copy all existing container images from the ACR-created storage account in your subscription to a storage account managed by Azure. Depending on the size of your registry, this process can take a few minutes to several hours.

During the conversion process, all `docker push` operations are blocked, while `docker pull` continues to function.

Once the migration is complete, the storage account in your subscription that originally backed your Classic registry is longer used by ACR.

>[!IMPORTANT]
> Upgrading from Classic to one of the managed SKUs is a **one-way process**. Once you've converted a Classic registry to Basic, Standard, or Premium, you cannot revert to Classic. You can, however, freely move between managed SKUs with sufficient capacity for your registry.

## How to upgrade

You can upgrade an unmanaged Classic registry to one of the managed SKUs in several ways. In the following sections, we describe the process for using the [Azure CLI][azure-cli] and the [Azure portal][azure-portal].

## Upgrade in Azure CLI

To upgrade a Classic registry in the Azure CLI, execute the [az acr update][az-acr-update] command and specify the new SKU for the registry. In the following example, a Classic registry named *myclassicregistry* is upgraded to the Premium SKU:

```azurecli-interactive
az acr update -n myclassicregistry --sku Premium
```

When the migration is complete, you should see output similar to the following:

```
SUCESS OUTPUT HERE
```

If you specify a managed registry SKU whose maximum capacity is less than the size of your Classic registry, you'll receive the following error:

```
FAIL OUTPUT HERE
```

## Upgrade in Azure portal

When you upgrade a Classic registry by using the Azure portal, Azure automatically select

![Classic registry upgrade button in the Azure portal UI][update-classic-01-upgrade]

![Classic registry upgrade confirmation in the Azure portal UI][update-classic-02-confirm]

![Classic registry upgrade progress in the Azure portal UI][update-classic-03-updating]

![Classic registry upgrade completion state in the Azure portal UI][update-classic-04-updated]

## Next steps

**Azure Container Registry Roadmap**

Visit the [ACR Roadmap](https://aka.ms/acr/roadmap) on GitHub to find information about upcoming features in the service.

**Azure Container Registry UserVoice**

Submit and vote on new feature suggestions in [ACR UserVoice](https://feedback.azure.com/forums/903958-azure-container-registry).

<!-- IMAGES -->
[update-classic-01-upgrade]: ./media/container-registry-upgrade\update-classic-01-upgrade.png
[update-classic-02-confirm]: ./media/container-registry-upgrade\update-classic-02-confirm.png
[update-classic-03-updating]: ./media/container-registry-upgrade\update-classic-03-updating.png
[update-classic-04-updated]: ./media/container-registry-upgrade\update-classic-04-updated.png

<!-- LINKS - external -->


<!-- LINKS - internal -->
[az-acr-update]: /cli/azure/acr#az_acr_update
[azure-cli]: /cli/azure/install-azure-cli
[azure-portal]: https://portal.azure.com