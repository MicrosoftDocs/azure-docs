---
title: Azure Container Registry SKUs
description: Compare the different service tiers available in Azure Container Registry.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 08/30/2018
ms.author: danlep
---

# Azure Container Registry SKUs

Azure Container Registry (ACR) is available in multiple service tiers, known as SKUs. These SKUs provide predictable pricing and several options for aligning to the capacity and usage patterns of your private Docker registry in Azure.

| SKU | Managed | Description |
| --- | :-------: | ----------- |
| **Basic** | Yes | A cost-optimized entry point for developers learning about Azure Container Registry. Basic registries have the same programmatic capabilities as Standard and Premium (Azure Active Directory authentication integration, image deletion, and web hooks). However, the included storage and image throughput are most appropriate for lower usage scenarios. |
| **Standard** | Yes | Standard registries offer the same capabilities as Basic, with increased included storage and image throughput. Standard registries should satisfy the needs of most production scenarios. |
| **Premium** | Yes | Premium registries provide the highest amount of included storage and concurrent operations, enabling high-volume scenarios. In addition to higher image throughput, Premium adds features like [geo-replication][container-registry-geo-replication] for managing a single registry across multiple regions, and [content trust (preview)](container-registry-content-trust.md) for image tag signing. |
| Classic<sup>1</sup> | No | This SKU enabled the initial release of the Azure Container Registry service in Azure. Classic registries are backed by a storage account that Azure creates in your subscription, which limits the ability for ACR to provide higher-level capabilities such as increased throughput and geo-replication. |

<sup>1</sup> The Classic SKU will be **deprecated** in **March 2019**. Use Basic, Standard, or Premium for all new container registries.

Choosing a higher-level SKU provides more performance and scale, however, all managed SKUs provide the same programmatic capabilities. With multiple service tiers, you can get started with Basic, then convert to Standard and Premium as your registry usage increases.

## Managed vs. unmanaged

The Basic, Standard, and Premium SKUs are collectively known as *managed* registries, and Classic registries as *unmanaged*. The primary difference between the two is how your container images are stored.

### Managed (Basic, Standard, Premium)

Managed registries benefit from image storage managed entirely by Azure. That is, a storage account that stores your images does not appear within your Azure subscription. There are several benefits gained by using one of the managed registry SKUs, discussed in-depth in [Container image storage in Azure Container Registry][container-registry-storage]. This article focuses on the managed registry SKUs and their capabilities.

### Unmanaged (Classic)

> [!IMPORTANT]
> The Classic SKU is being deprecated, and will be unavailable after March 2019. Use Basic, Standard, or Premium for all new registries.

Classic registries are "unmanaged" in the sense that the storage account that backs a Classic registry resides within *your* Azure subscription. As such, you are responsible for the management of the storage account in which your container images are stored. With unmanaged registries, you can't switch between SKUs as your needs change (other than [upgrading][container-registry-upgrade] to a managed registry), and several features of managed registries are unavailable (for example, container image deletion, [geo-replication][container-registry-geo-replication], and [webhooks][container-registry-webhook]).

For more information about upgrading a Classic registry to one of the managed SKUs, see [Upgrade a Classic registry][container-registry-upgrade].

## SKU feature matrix

The following table details the features and limits of the Basic, Standard, and Premium service tiers.

[!INCLUDE [container-instances-limits](../../includes/container-registry-limits.md)]

## Changing SKUs

You can change a registry's SKU with the Azure CLI or in the Azure portal. You can move freely between managed SKUs as long as the SKU you're switching to has the required maximum storage capacity. If you switch to one of the managed SKUs from Classic, you cannot move back to Classic--it is a one-way conversion.

### Azure CLI

To move between SKUs in the Azure CLI, use the [az acr update][az-acr-update] command. For example, to switch to Premium:

```azurecli
az acr update --name myregistry --sku Premium
```

### Azure portal

In the container registry **Overview** in the Azure portal, select **Update**, then select a new **SKU** from the SKU drop-down.

![Update container registry SKU in Azure portal][update-registry-sku]

If you have a Classic registry, you can't select a managed SKU within the Azure portal. Instead, you must first [upgrade][container-registry-upgrade] to a managed registry (see [Changing from Classic](#changing-from-classic)).

## Changing from Classic

There are additional considerations to take into account when migrating an unmanaged Classic registry to one of the managed Basic, Standard, or Premium SKUs. If your Classic registry contains a large number of images and is many gigabytes in size, the migration process can take some time. Additionally, `docker push` operations are disabled until the migration is complete.

For details on upgrading your Classic registry to one of the managed SKUs, see [Upgrade a Classic container registry][container-registry-upgrade].

## Pricing

For pricing information on each of the Azure Container Registry SKUs, see [Container Registry pricing][container-registry-pricing].

## Next steps

**Azure Container Registry Roadmap**

Visit the [ACR Roadmap][acr-roadmap] on GitHub to find information about upcoming features in the service.

**Azure Container Registry UserVoice**

Submit and vote on new feature suggestions in [ACR UserVoice][container-registry-uservoice].

<!-- IMAGES -->
[update-registry-sku]: ./media/container-registry-skus/update-registry-sku.png

<!-- LINKS - External -->
[acr-roadmap]: https://aka.ms/acr/roadmap
[container-registry-pricing]: https://azure.microsoft.com/pricing/details/container-registry/
[container-registry-uservoice]: https://feedback.azure.com/forums/903958-azure-container-registry

<!-- LINKS - Internal -->
[az-acr-update]: /cli/azure/acr#az-acr-update
[container-registry-geo-replication]: container-registry-geo-replication.md
[container-registry-upgrade]: container-registry-upgrade.md
[container-registry-storage]: container-registry-storage.md
[container-registry-webhook]: container-registry-webhook.md
