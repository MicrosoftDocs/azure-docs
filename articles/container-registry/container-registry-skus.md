---
title: Azure Container Registry SKUs
description: Compare the different service tiers available in Azure Container Registry.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 05/06/2019
ms.author: danlep
---

# Azure Container Registry SKUs

Azure Container Registry (ACR) is available in multiple service tiers, known as SKUs. These SKUs provide predictable pricing and several options for aligning to the capacity and usage patterns of your private Docker registry in Azure.

| SKU | Managed | Description |
| --- | :-------: | ----------- |
| **Basic** | Yes | A cost-optimized entry point for developers learning about Azure Container Registry. Basic registries have the same programmatic capabilities as Standard and Premium (such as Azure Active Directory [authentication integration](container-registry-authentication.md#individual-login-with-azure-ad), [image deletion][container-registry-delete], and [webhooks][container-registry-webhook]). However, the included storage and image throughput are most appropriate for lower usage scenarios. |
| **Standard** | Yes | Standard registries offer the same capabilities as Basic, with increased included storage and image throughput. Standard registries should satisfy the needs of most production scenarios. |
| **Premium** | Yes | Premium registries provide the highest amount of included storage and concurrent operations, enabling high-volume scenarios. In addition to higher image throughput, Premium adds features including [geo-replication][container-registry-geo-replication] for managing a single registry across multiple regions, [content trust](container-registry-content-trust.md) for image tag signing, and [firewalls and virtual networks (preview)](container-registry-vnet.md) to restrict access to the registry. |
|  Classic (*not available after April 2019*) | No | This SKU enabled the initial release of the Azure Container Registry service in Azure. Classic registries are backed by a storage account that Azure creates in your subscription, which limits the ability for ACR to provide higher-level capabilities such as increased throughput and geo-replication. |

> [!IMPORTANT]
> The Classic registry SKU is being **deprecated**, and will be unavailable after **April 2019**. We recommend using Basic, Standard, or Premium for all new registries. All existing Classic registries should be upgraded prior to April 2019. For upgrade information, see [Upgrade a Classic registry][container-registry-upgrade].

The Basic, Standard, and Premium SKUs (collectively called *managed registries*) all provide the same programmatic capabilities. They also all benefit from [image storage][container-registry-storage] managed entirely by Azure. Choosing a higher-level SKU provides more performance and scale. With multiple service tiers, you can get started with Basic, then convert to Standard and Premium as your registry usage increases.

## SKU feature matrix

The following table details the features and limits of the Basic, Standard, and Premium service tiers.

[!INCLUDE [container-instances-limits](../../includes/container-registry-limits.md)]

## Changing SKUs

You can change a registry's SKU with the Azure CLI or in the Azure portal. You can move freely between managed SKUs as long as the SKU you're switching to has the required maximum storage capacity. When you switch to one of the managed SKUs from Classic, you cannot move back to Classic--it is a one-way conversion.

### Azure CLI

To move between SKUs in the Azure CLI, use the [az acr update][az-acr-update] command. For example, to switch to Premium:

```azurecli
az acr update --name myregistry --sku Premium
```

### Azure portal

In the container registry **Overview** in the Azure portal, select **Update**, then select a new **SKU** from the SKU drop-down.

![Update container registry SKU in Azure portal][update-registry-sku]

If you have a Classic registry, you can't select a managed SKU within the Azure portal. Instead, you must first [upgrade][container-registry-upgrade] to a managed registry.

## Pricing

For pricing information on each of the Azure Container Registry SKUs, see [Container Registry pricing][container-registry-pricing].

For details about pricing for data transfers, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/). 

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
[container-registry-delete]: container-registry-delete.md
[container-registry-webhook]: container-registry-webhook.md
