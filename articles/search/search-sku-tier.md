---
title: Choose a pricing tier
titleSuffix: Azure Cognitive Search
description: 'Azure Cognitive Search can be provisioned in these tiers: Free, Basic, and Standard, and Standard is available in various resource configurations and capacity levels.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/01/2020
ms.custom: contperf-fy21q2 
---

# Choose a pricing tier for Azure Cognitive Search

When you [create a search service](search-create-service-portal.md), you choose a pricing tier that's fixed for the lifetime of the service. The tier you select determines:

+ Quantity of indexes and other objects you can create (maximum limits)
+ Size and speed of partitions (physical storage)
+ Billable rate, a fixed monthly cost, but also an incremental cost if you add partitions or replicas

Additionally, a few [premium features](#premium-features) come with tier requirements.

## Tier descriptions

Tiers include **Free**, **Basic**, **Standard**, and **Storage Optimized**. Standard and Storage Optimized are available with several configurations and capacities.

The following screenshot from Azure portal shows the available tiers, minus pricing (which you can find in the portal and on the [pricing page](https://azure.microsoft.com/pricing/details/search/). 

![Pricing tiers of Azure Cognitive Search](media/search-sku-tier/tiers.png "Pricing tiers of Azure Cognitive Search")

**Free** creates a limited search service for smaller projects, like running tutorials and code samples. Internally, replicas and partitions are shared among multiple subscribers. You cannot scale a free service or run significant workloads.

**Basic** and **Standard** are the most commonly used billable tiers, with **Standard** being the default. With dedicated resources under your control, you can deploy larger projects, optimize performance, and increase capacity.

Some tiers are optimized for certain types of work. For example, **Standard 3 High Density (S3 HD)** is a *hosting mode* for S3, where the underlying hardware is optimized for a large number of smaller indexes and is intended for multitenancy scenarios. S3 HD has the same per-unit charge as S3, but the hardware is optimized for fast file reads on a large number of smaller indexes.

**Storage Optimized** tiers offer larger storage capacity at a lower price per TB than the Standard tiers. The primary tradeoff is higher query latency, which you should validate for your specific application requirements. To learn more about the performance considerations of this tier, see [Performance and optimization considerations](search-performance-optimization.md).

You can find out more about the various tiers on the [pricing page](https://azure.microsoft.com/pricing/details/search/), in the [Service limits in Azure Cognitive Search](search-limits-quotas-capacity.md) article, and on the portal page when you're provisioning a service.

<a name="premium-features"></a>

## Feature availability by tier

Most features are available on all tiers, including the free tier. In a few cases, the tier you choose will impact your ability to implement a feature. The following table describes feature constraints that are related to service tier.

| Feature | Limitations |
|---------|-------------|
| [indexers](search-indexer-overview.md) | Indexers are not available on S3 HD.  |
| [AI enrichment](search-security-manage-encryption-keys.md) | Runs on the Free tier but not recommended. |
| [Customer-managed encryption keys](search-security-manage-encryption-keys.md) | Not available on the Free tier. |
| [IP firewall access](service-configure-firewall.md) | Not available on the Free tier. |
| [Private endpoint (integration with Azure Private Link)](service-create-private-endpoint.md) | For inbound connections to a search service, not available on the Free tier. For outbound connections by indexers to other Azure resources, not available on Free or S3 HD. For indexers that use skillsets, not available on Free, Basic, S1, or S3 HD.|

Resource-intensive features might not work well unless you give it sufficient capacity. For example, [AI enrichment](cognitive-search-concept-intro.md) has long-running skills that time out on a Free service unless the dataset is small.

## Billable events

A solution built on Azure Cognitive Search can incur costs in the following ways:

+ [Cost of the service](#service-costs) itself, running 24x7, at minimum configuration (one partition and replica), at the base rate. You can think of this as the fixed cost of running the service.

+ Adding capacity (replicas or partitions), where costs increase at increments of the billable rate

+ Bandwidth charges (outbound data transfer)

+ Add-on services required for specific capabilities or features:

  + AI enrichment (requires [Cognitive Services](https://azure.microsoft.com/pricing/details/cognitive-services/))
  + knowledge store (requires [Azure Storage](https://azure.microsoft.com/pricing/details/storage/))
  + incremental enrichment (requires [Azure Storage](https://azure.microsoft.com/pricing/details/storage/), applies to AI enrichment)
  + customer-managed keys and double encryption (requires [Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault/))
  + private endpoints for a no-internet access model (requires [Azure Private Link](https://azure.microsoft.com/pricing/details/private-link/))

### Service costs

Unlike virtual machines or other resources that can be "paused" to avoid charges, an Azure Cognitive Search service is always available on hardware dedicated for your exclusive use. As such, creating a service is a billable event that starts when you create the service, and ends when you delete the service. 

The minimum charge is the first search unit (one replica x one partition) at the billable rate. This minimum is fixed for the lifetime of the service because the service can't run on anything less than this configuration. Beyond the minimum, you can add replicas and partitions independently of each other. Incremental increases in capacity through replicas and partitions will increase your bill based on the following formula: [(replicas x partitions x rate)](#search-units), where the rate you're charged depends on the pricing tier you select.

When you're estimating the cost of a search solution, keep in mind that pricing and capacity aren't linear. (Doubling capacity more than doubles the cost.) For an example of how of the formula works, see [How to allocate replicas and partitions](search-capacity-planning.md#how-to-allocate-replicas-and-partitions).

### Bandwidth charges

Using [indexers](search-indexer-overview.md) can affect billing if the Azure data source is in a different region from Azure Cognitive Search. In this scenario, this is a cost for moving outbound data from the Azure data source to Azure Cognitive Search. 

You can eliminate data egress charges entirely if you create the Azure Cognitive Search service in the same region as your data. Here's some information from the [bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/):

+ Microsoft doesn't charge for any inbound data to any service on Azure.
+ There is no outbound data charge from Azure Cognitive Search. For example, if your search service is in West US, and an Azure Web app is in East US, Microsoft doesn't charge for the query response payloads that originate from West US.
+ In multi-service solutions, there's no charge for data crossing the wire when all services are in the same region.

Charges do apply for outbound data if services are in different regions. These charges aren't actually part of your Azure Cognitive Search bill. They're mentioned here because if you're using data or AI-enriched indexers to pull data from different regions, you'll see costs reflected in your overall bill.

### AI enrichment with Cognitive Services

For [AI enrichment](cognitive-search-concept-intro.md), you should plan to [attach a billable Azure Cognitive Services resource](cognitive-search-attach-cognitive-services.md), in the same region as Azure Cognitive Search, at the S0 pricing tier for pay-as-you-go processing. There's no fixed cost associated with attaching Cognitive Services. You pay only for the processing you need.

| Operation | Billing impact |
|-----------|----------------|
| Document cracking, text extraction | Free |
| Document cracking, image extraction | Billed according to the number of images extracted from your documents. In an [indexer configuration](/rest/api/searchservice/create-indexer#indexer-parameters), **imageAction** is the parameter that triggers image extraction. If **imageAction** is set to "none" (the default), you won't be charged for image extraction. The rate for image extraction is documented on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page for Azure Cognitive Search.|
| [Built-in cognitive skills](cognitive-search-predefined-skills.md) | Billed at the same rate as if you had performed the task by using Cognitive Services directly. |
| Custom skills | A custom skill is functionality you provide. The cost of using a custom skill depends entirely on whether custom code is calling other metered services. |

The [incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) feature allows you to provide a cache that enables the indexer to be more efficient at running only the cognitive skills that are necessary if you modify your skillset in the future, saving you time and money.

<a name="search-units"></a>

## Billing formula (R x P = SU)

The most important billing concept to understand for Azure Cognitive Search operations is the *search unit* (SU). Because Azure Cognitive Search depends on both replicas and partitions for indexing and queries, it doesn't make sense to bill by just one or the other. Instead, billing is based on a composite of both.

SU is the product of the *replicas* and *partitions* used by a service: **(R x P = SU)**.

Every service starts with one SU (one replica multiplied by one partition) as the minimum. The maximum for any service is 36 SUs. This maximum can be reached in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, for example. It's common to use less than total capacity (for example, a 3-replica, 3-partition service billed as 9 SUs). See the [Partition and replica combinations](search-capacity-planning.md#chart) chart for valid combinations.

The billing rate is hourly per SU. Each tier has a progressively higher rate. Higher tiers come with larger and speedier partitions, and this contributes to an overall higher hourly rate for that tier. You can view the rates for each tier on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page.

Most customers bring just a portion of total capacity online, holding the rest in reserve. For billing, the number of partitions and replicas that you bring online, calculated by the SU formula, determines what you pay on an hourly basis.

## Next steps

Cost management is an integral part of capacity planning. As a next step, continue with the following article for guidance on how to estimate capacity and manage costs.

> [!div class="nextstepaction"]
> [How to manage costs and estimate capacity in Azure Cognitive Search](search-sku-manage-costs.md)