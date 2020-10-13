---
title: Registry service tiers and features
description: Learn about the features and limits in the Basic, Standard, and Premium service tiers (SKUs) of Azure Container Registry.
ms.topic: article
ms.date: 10/13/2020
---

# Azure Container Registry service tiers

Azure Container Registry is available in multiple service tiers (also known as SKUs). These tiers provide predictable pricing and several options for aligning to the capacity and usage patterns of your private Docker registry in Azure. Change your registry's service tier when your needs for registry performance, scale, or features change.

| Tier | Description |
| --- | ----------- |
| **Basic** | A cost-optimized entry point for developers learning about Azure Container Registry. Basic registries have the same programmatic capabilities as Standard and Premium (such as Azure Active Directory [authentication integration](container-registry-authentication.md#individual-login-with-azure-ad), [image deletion][container-registry-delete], and [webhooks][container-registry-webhook]). However, the included storage and image throughput are most appropriate for lower usage scenarios. |
| **Standard** | Standard registries offer the same capabilities as Basic, with increased included storage and image throughput. Standard registries should satisfy the needs of most production scenarios. |
| **Premium** | Premium registries provide the highest amount of included storage and concurrent operations, enabling high-volume scenarios. In addition to higher image throughput, Premium adds features such as [geo-replication][container-registry-geo-replication] for managing a single registry across multiple regions, [content trust](container-registry-content-trust.md) for image tag signing, [private link with private endpoints](container-registry-private-link.md) to restrict access to the registry. |

The Basic, Standard, and Premium tiers all provide the same programmatic capabilities. They also all benefit from [image storage][container-registry-storage] managed entirely by Azure. Choosing a higher-level tier provides more performance and scale. With multiple service tiers, you can get started with Basic, then convert to Standard and Premium as your registry usage increases.

## Service tier features and limits

The following table details the features and registry limits (quotas) of the Basic, Standard, and Premium service tiers.

[!INCLUDE [container-instances-limits](../../includes/container-registry-limits.md)]

## Registry throughput and throttling

When generating a high rate of registry operations such as Docker image pulls or pushes on your registry, use the service tier's limits for read and write operations and bandwidth as a guide for expected image throughput. However, additional factors will affect your registry performance in practice.

Each image pull or push potentially generates a large number of atomic read and/or write operations on the registry. A large number of operations will translate into fewer images pushed or pulled. The number depends on:

* image size, number of layers, and reuse of layers or base images across images
* additional API calls that might be required for each pull or push 

For details, see documentation for the [Docker HTTP API V2](https://docs.docker.com/registry/spec/api/).

For example, a push of a single 133 MB `nginx:latest` image to an Azure container registry requires multiple read and write operations, including: 

* Read operations to read the image manifest, if it exists in the registry
* Write operations to write each of 5 image layers
* Write operations to write the image manifest

Also, you could experience throttling of image pull or push operations when the registry determines the rate of requests is too high. For example, throttling could occur when you generate a burst of image pulls or pushes in a very short period, even when the average rate of read and write operations is within registry limits.

When evaluating or troubleshooting throughput of image pulls or pushes to a registry, also consider the configuration of your client environment. For example:

* your Docker daemon configuration for concurrent operations
* your network connection to the registry's data endpoint or endpoints

## Changing tiers

You can change a registry's service tier with the Azure CLI or in the Azure portal. You can move freely between tier as long as the tier you're switching to has the required maximum storage capacity. 

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
[az-acr-update]: /cli/azure/acr#az-acr-update
[container-registry-geo-replication]: container-registry-geo-replication.md
[container-registry-storage]: container-registry-storage.md
[container-registry-delete]: container-registry-delete.md
[container-registry-webhook]: container-registry-webhook.md
