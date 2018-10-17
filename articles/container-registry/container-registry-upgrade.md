---
title: Upgrade a Classic Azure container registry
description: Take advantage of the expanded feature set of Basic, Standard, and Premium managed container registries by upgrading your unmanaged Classic container registry.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 08/28/2018
ms.author: danlep
---

# Upgrade a Classic container registry

Azure Container Registry (ACR) is available in several service tiers, [known as SKUs](container-registry-skus.md). The initial release of ACR offered a single SKU, Classic, that lacks several features inherent to the Basic, Standard, and Premium SKUs (collectively known as *managed* registries).

The Classic SKU is being deprecated, and will be unavailable after March 2019. This article details how to migrate your unmanaged Classic registry to one of the managed SKUs so that you can take advantage of their enhanced feature set.

## Why upgrade?

The Classic registry SKU is being **deprecated**, and will be unavailable from **March 2019**. All existing Classic registries should be upgraded prior to March 2019.

Because of the planned deprecation and limited capabilities of Classic unmanaged registries, all Classic registries be upgraded to Basic, Standard, or Premium managed registries. These higher-level SKUs more deeply integrate the registry into the capabilities of Azure.

Managed registries provide:

* Azure Active Directory integration for [individual login](container-registry-authentication.md#individual-login-with-azure-ad)
* Image and tag deletion support
* [Geo-replication](container-registry-geo-replication.md)
* [Webhooks](container-registry-webhook.md)

The Classic registry depends on the storage account that Azure automatically provisions in your Azure subscription when you create the registry. By contrast, the Basic, Standard, and Premium SKUs take advantage of Azure's [advanced storage features](container-registry-storage.md) by transparently handling the storage of your images for you. A separate storage account is not created in your own subscription.

Managed registry storage provides the following benefits:

* Container images are [encrypted at rest](container-registry-storage.md#encryption-at-rest).
* Images are stored using [geo-redundant storage](container-registry-storage.md#geo-redundant-storage), assuring backup of your images with multi-region replication.
* Ability to freely [move between SKUs](container-registry-skus.md#changing-skus), enabling higher throughput when you choose a higher-level SKU. With each SKU, ACR can meet your throughput requirements as your needs increase.
* Unified security model for the registry and its storage provides simplified rights management. You manage permissions only for the container registry, without having to also manage permissions for a separate storage account.

For additional details on image storage in ACR, see [Container image storage in Azure Container Registry](container-registry-storage.md).

## Migration considerations

When you change a Classic registry to a managed registry, Azure must copy all existing container images from the ACR-created storage account in your subscription to a storage account managed by Azure. Depending on the size of your registry, this process can take a few minutes to several hours.

During the conversion process, all `docker push` operations are blocked, while `docker pull` continues to function.

Do not delete or modify the contents of the storage account backing your Classic registry during the conversion process. Doing so can result in the corruption of your container images.

Once the migration is complete, the storage account in your subscription that originally backed your Classic registry is longer used by ACR. After you've verified that the migration was successful, consider deleting the storage account to help minimize cost.

>[!IMPORTANT]
> Upgrading from Classic to one of the managed SKUs is a **one-way process**. Once you've converted a Classic registry to Basic, Standard, or Premium, you cannot revert to Classic. You can, however, freely move between managed SKUs with sufficient capacity for your registry.

## How to upgrade

You can upgrade an unmanaged Classic registry to one of the managed SKUs in several ways. In the following sections, we describe the process for using the [Azure CLI][azure-cli] and the [Azure portal][azure-portal].

## Upgrade in Azure CLI

To upgrade a Classic registry in the Azure CLI, execute the [az acr update][az-acr-update] command and specify the new SKU for the registry. In the following example, a Classic registry named *myclassicregistry* is upgraded to the Premium SKU:

```azurecli-interactive
az acr update --name myclassicregistry --sku Premium
```

When the migration is complete, you should see output similar to the following. Notice that the `sku` is "Premium" and the `storageAccount` is "null," indicating that Azure now manages the image storage for this registry.

```JSON
{
  "adminUserEnabled": false,
  "creationDate": "2017-12-12T21:23:29.300547+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
  "location": "eastus",
  "loginServer": "myregistry.azurecr.io",
  "name": "myregistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "name": "Premium",
    "tier": "Premium"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

If you specify a managed registry SKU whose maximum capacity is less than the size of your Classic registry, you'll receive an error message similar to the following.

`Cannot update the registry SKU due to reason: Registry size 12936251113 bytes exceeds the quota value 10737418240 bytes for SKU Basic. The suggested SKU is Standard.`

If you receive a similar error, run the [az acr update][az-acr-update] command again and specify the suggested SKU, which is the next-highest level SKU that can accommodate your images.

## Upgrade in Azure portal

When you upgrade a Classic registry by using the Azure portal, Azure automatically selects the lowest-level SKU that can accommodate your images. For example, if your registry contains 12 GiB in images, Azure automatically selects and converts the Classic registry to Standard (100 GiB maximum).

To upgrade your Classic registry by using the Azure portal, navigate to the container registry **Overview** and select **Upgrade to managed registry**.

![Classic registry upgrade button in the Azure portal UI][update-classic-01-upgrade]

Select **OK** to confirm that you want to upgrade to a managed registry.

![Classic registry upgrade confirmation in the Azure portal UI][update-classic-02-confirm]

During migration, the portal indicates that the registry's **Provisioning state** is *Updating*. As mentioned earlier, `docker push` operations are disabled during the migration, and you must not delete or update the storage account used by the Classic registry while the migration is in progress--doing so can result in image corruption.

![Classic registry upgrade progress in the Azure portal UI][update-classic-03-updating]

When the migration is complete, the **Provisioning state** indicates *Succeeded*, and you can once again `docker push` to your registry.

![Classic registry upgrade completion state in the Azure portal UI][update-classic-04-updated]

## Next steps

Once you've upgraded a Classic registry to Basic, Standard, or Premium, Azure no longer uses the storage account that originally backed the Classic registry. To reduce cost, consider deleting the storage account or the Blob container within the account that contains your old container images.

<!-- IMAGES -->
[update-classic-01-upgrade]: ./media/container-registry-upgrade\update-classic-01-upgrade.png
[update-classic-02-confirm]: ./media/container-registry-upgrade\update-classic-02-confirm.png
[update-classic-03-updating]: ./media/container-registry-upgrade\update-classic-03-updating.png
[update-classic-04-updated]: ./media/container-registry-upgrade\update-classic-04-updated.png

<!-- LINKS - internal -->
[az-acr-update]: /cli/azure/acr#az-acr-update
[azure-cli]: /cli/azure/install-azure-cli
[azure-portal]: https://portal.azure.com