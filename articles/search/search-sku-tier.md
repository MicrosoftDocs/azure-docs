---
title: Choose a pricing tier
titleSuffix: Azure Cognitive Search
description: 'Learn about the pricing tiers (or SKUs) for Azure Cognitive Search. A search service can be provisioned at these tiers: Free, Basic, and Standard. Standard is available in various resource configurations and capacity levels.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/15/2021
ms.custom: contperf-fy21q2 
---

# Choose a pricing tier for Azure Cognitive Search

When you [create a search service](search-create-service-portal.md), you choose a pricing tier (or SKU) that's fixed for the lifetime of the service. The tier you select determines:

+ Upper limits of indexes and other objects you can create
+ Size and speed of partitions (physical storage)
+ Billable rate as a fixed monthly cost, but also an incremental cost if you add capacity

In a few instances, the tier you choose determines the availability of [premium features](#premium-features).

You'll set the pricing tier when creating the service in Azure portal. If you're provisioning a service through PowerShell or Azure CLI instead, the tier is specified through the **`-Sku`** parameter.

## Tier descriptions

Tiers include **Free**, **Basic**, **Standard**, and **Storage Optimized**. Standard and Storage Optimized are available with several configurations and capacities. The following screenshot from Azure portal shows the available tiers, minus pricing (which you can find in the portal and on the [pricing page](https://azure.microsoft.com/pricing/details/search/). 

:::image type="content" source="media/search-sku-tier/tiers.png" alt-text="Pricing tier chart" border="true":::

**Free** creates a limited search service for smaller projects, like running tutorials and code samples. Internally, system resources are shared among multiple subscribers. You cannot scale a free service or run significant workloads.

**Basic** and **Standard** are the most commonly used billable tiers, with **Standard** being the default. With dedicated resources under your control, you can deploy larger projects, optimize performance, and increase capacity.

Some tiers are designed for certain types of work. For example, **Standard 3 High Density (S3 HD)** is a *hosting mode* for S3, where the underlying hardware is optimized for a large number of smaller indexes and is intended for multitenancy scenarios. S3 HD has the same per-unit charge as S3, but the hardware is optimized for fast file reads on a large number of smaller indexes.

**Storage Optimized** tiers offer larger storage capacity at a lower price per TB than the Standard tiers. The primary tradeoff is higher query latency, which you should validate for your specific application requirements. To learn more about the performance considerations of this tier, see [Performance and optimization considerations](search-performance-optimization.md).

You can find out more about the various tiers on the [pricing page](https://azure.microsoft.com/pricing/details/search/), in the [Service limits in Azure Cognitive Search](search-limits-quotas-capacity.md) article, and on the portal page when you're provisioning a service.

<a name="premium-features"></a>

## Feature availability by tier

Most features are available on all tiers, including the free tier. In a few cases, the tier you choose will impact your ability to implement a feature. The following table describes feature constraints that are related to service tier.

| Feature | Limitations |
|---------|-------------|
| [indexers](search-indexer-overview.md) | Indexers are not available on S3 HD.  |
| [AI enrichment](search-security-manage-encryption-keys.md) | Runs on the Free tier but not recommended. |
| [Managed or trusted identities for outbound (indexer) access](search-howto-managed-identities-data-sources.md) | Not available on the Free tier.|
| [Customer-managed encryption keys](search-security-manage-encryption-keys.md) | Not available on the Free tier. |
| [IP firewall access](service-configure-firewall.md) | Not available on the Free tier. |
| [Private endpoint (integration with Azure Private Link)](service-create-private-endpoint.md) | For inbound connections to a search service, not available on the Free tier. For outbound connections by indexers to other Azure resources, not available on Free or S3 HD. For indexers that use skillsets, not available on Free, Basic, S1, or S3 HD.|

Resource-intensive features might not work well unless you give it sufficient capacity. For example, [AI enrichment](cognitive-search-concept-intro.md) has long-running skills that time out on a Free service unless the dataset is small.

## Upper limits

Tiers determine the  maximum storage of the service itself, as well as the maximum number of indexes, indexers, data sources, skillsets, and synonym maps that you can create. For a full break out of all limits, see [Service limits in Azure Cognitive Search](search-limits-quotas-capacity.md). 

## Partition size and speed

Tier pricing includes details about per-partition storage that ranges from 2 GB for Basic, up to 2 TB for Storage Optimized (L2) tiers. Other hardware characteristics, such as speed of operations, latency, and transfer rates, are not published, but tiers that are designed for specific solution architectures are built on hardware that has the features to support those scenarios.

## Billing rates

Tiers have different billing rates, with higher rates for tiers that run on more expensive hardware or provide more expensive features. The billing rate is what you see in the [Azure pricing pages](https://azure.microsoft.com/pricing/details/search/) for Azure Cognitive Search.

The billing rate is fixed for the tier, but it's applied to *search units* (SU), which you can adjust in response to the expected workload. The scalability architecture in Azure Cognitive Search is based on flexible combinations of replicas and partitions so that you can vary capacity depending on whether you need more query or indexing power. *Replicas* are instances of the search engine. *Partitions* are modules of storage. An *SU* is just a billing concept that represents the composite of replicas and partitions in use by your service.

Mathematically, SU is the product of the number of *replicas* and *partitions* used by your service (SU = replica * partition). Every service requires at least one replica and one partition. As such, the minimum SU is 1 X 1, or 1. Hypothetically, if the billing rates were $100, $200, and $300 for progressively higher tiers, the billing formula indicates that you could expect to pay approximately $100, $200, or $300 a month depending on which tier you chose, at the minimum configuration. 

In practice, integration of other Azure services and processes can make cost estimates more involved. For more information, see [How to estimate costs of a search service](search-sku-manage-costs.md).

## Next steps

The best way to choose a pricing tier is to start with a least-cost tier, and then allow experience and testing inform your decision to keep the service or create a new one at a higher tier. For next steps, we recommend that you create a search service at a tier that can accommodate the level of testing you propose to do, and then review the following guidance for recommendations on estimating cost and capacity.

+ [Create a search service](search-create-service-portal.md)
+ [Estimate costs](search-sku-manage-costs.md)
+ [Estimate capacity](search-sku-manage-costs.md)

<!-- Start with a Free tier and build an initial index by using a subset of your data to understand its characteristics. The data structure in Azure Cognitive Search is an inverted index structure. The size and complexity of an inverted index is determined by content. Remember that highly redundant content tends to result in a smaller index than highly irregular content. So content characteristics rather than the size of the dataset determine index storage requirements.

After you have an initial estimate of your index size, [provision a billable service](search-create-service-portal.md) on one of the tiers discussed in this article: Basic, Standard, or Storage Optimized. Relax any artificial constraints on data sizing and [rebuild your index](search-howto-reindex.md) to include all the data that you want to be searchable.

[Allocate partitions and replicas](search-capacity-planning.md) as needed to get the performance and scale you require.

If performance and capacity are fine, you're done. Otherwise, re-create a search service at a different tier that more closely aligns with your needs.

> [!NOTE]
> If you have questions, post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure support](https://azure.microsoft.com/support/options/). -->