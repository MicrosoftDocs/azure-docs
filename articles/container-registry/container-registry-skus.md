---
title: Registry service tiers and features
description: Learn about the features and limits (quotas) in the Basic, Standard, and Premium service tiers (SKUs) of Azure Container Registry.
ms.topic: article
ms.date: 05/18/2020
---

# Azure Container Registry service tiers

Azure Container Registry is available in multiple service tiers (also known as SKUs). These tiers provide predictable pricing and several options for aligning to the capacity and usage patterns of your private Docker registry in Azure.

| Tier | Description |
| --- | ----------- |
| **Basic** | A cost-optimized entry point for developers learning about Azure Container Registry. Basic registries have the same programmatic capabilities as Standard and Premium (such as Azure Active Directory [authentication integration](container-registry-authentication.md#individual-login-with-azure-ad), [image deletion][container-registry-delete], and [webhooks][container-registry-webhook]). However, the included storage and image throughput are most appropriate for lower usage scenarios. |
| **Standard** | Standard registries offer the same capabilities as Basic, with increased included storage and image throughput. Standard registries should satisfy the needs of most production scenarios. |
| **Premium** | Premium registries provide the highest amount of included storage and concurrent operations, enabling high-volume scenarios. In addition to higher image throughput, Premium adds features such as [geo-replication][container-registry-geo-replication] for managing a single registry across multiple regions, [content trust](container-registry-content-trust.md) for image tag signing, [private link with private endpoints](container-registry-private-link.md) to restrict access to the registry. |

The Basic, Standard, and Premium tiers all provide the same programmatic capabilities. They also all benefit from [image storage][container-registry-storage] managed entirely by Azure. Choosing a higher-level tier provides more performance and scale. With multiple service tiers, you can get started with Basic, then convert to Standard and Premium as your registry usage increases.

## Service tier features and limits

The following table details the features and registry limits of the Basic, Standard, and Premium service tiers.

[!INCLUDE [container-instances-limits](../../includes/container-registry-limits.md)]

## Changing tiers

You can change a registry's service tier with the Azure CLI or in the Azure portal. You can move freely between tiers as long as the tier you're switching to has the required maximum storage capacity. 

There is no registry downtime or impact on registry operations when you move between service tiers.

### Azure CLI

To move between service tiers in the Azure CLI, use the [az acr update][az-acr-update] command. For example, to switch to Premium:

```azurecli
az acr update --name myregistry --sku Premium
```

### Azure portal

In the container registry **Overview** in the Azure portal, select **Update**, then select a new **SKU** from the SKU drop-down.

![Update container registry SKU in Azure portal][update-registry-sku]

## Pricing

For pricing information on each of the Azure Container Registry service tiers, see [Container Registry pricing][container-registry-pricing].

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
[az-acr-update]: /cli/azure/acr#az_acr_update
[container-registry-geo-replication]: container-registry-geo-replication.md
[container-registry-storage]: container-registry-storage.md
[container-registry-delete]: container-registry-delete.md
[container-registry-webhook]: container-registry-webhook.md