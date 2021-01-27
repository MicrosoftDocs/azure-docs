---
title: Estimate costs
titleSuffix: Azure Cognitive Search
description: 'Learn about billable events, the pricing model, and tips for managing the cost of running a Cognitive Search service.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/15/2021
---

# How to estimate and manage costs of an Azure Cognitive Search service

In this article, learn about the pricing model, billable events, and tips for managing the cost of running an Azure Cognitive Search service.

## Pricing model

The scalability architecture in Azure Cognitive Search is based on flexible combinations of replicas and partitions so that you can vary capacity depending on whether you need more query or indexing power, and pay only for what you need.

The amount of resources used by your search service, multiplied by the billing rate established by the service tier, determines the cost of running the service. Costs and capacity are tightly bound. When estimating costs, understanding the capacity required to run your indexing and query workloads gives you the best idea as to what projected costs will be.

For billing purposes, there are two simple formulas to be aware of:

| Formula | Description |
|---------|-------------|
| **R x P = SU** | Number of replicas used, multiplied by the number of partitions used, equals the quantity of *search units* (SU)  used by a service. An SU is a unit of resource, and it can be either a partition or a replica. |
| **SU * billing rate = monthly spend** | The number of SUs multiplied by the billing rate of the tier at which you provisioned the service is the primary determinant of your overall monthly bill. Some features or workloads have dependencies on other Azure services, which can increase the cost of your solution at the subscription level. The billable events section below identifies features that can add to your bill. |

Every service starts with one SU (one replica multiplied by one partition) as the minimum. The maximum for any service is 36 SUs. This maximum can be reached in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, for example. It's common to use less than total capacity (for example, a 3-replica, 3-partition service billed as 9 SUs). See the [Partition and replica combinations](search-capacity-planning.md#chart) chart for valid combinations.

The billing rate is hourly per SU. Each tier has a progressively higher rate. Higher tiers come with larger and speedier partitions, and this contributes to an overall higher hourly rate for that tier. You can view the rates for each tier on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page.

Most customers bring just a portion of total capacity online, holding the rest in reserve. For billing, the number of partitions and replicas that you bring online, calculated by the SU formula, determines what you pay on an hourly basis. 

## Billable events

A solution built on Azure Cognitive Search can incur costs in the following ways:

+ [Cost of the service](#service-costs) itself, running 24x7, at minimum configuration (one partition and replica), at the base rate. You can think of this as the fixed cost of running the service.

+ Adding capacity (replicas or partitions), where costs increase at increments of the billable rate. If high availability is a business requirement, you'll need 3 replicas.

+ Bandwidth charges (outbound data transfer)

+ Add-on services required for specific capabilities or features:

  + AI enrichment (requires [Cognitive Services](https://azure.microsoft.com/pricing/details/cognitive-services/))
  + knowledge store (requires [Azure Storage](https://azure.microsoft.com/pricing/details/storage/))
  + incremental enrichment (requires [Azure Storage](https://azure.microsoft.com/pricing/details/storage/), applies to AI enrichment)
  + customer-managed keys and double encryption (requires [Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault/))
  + private endpoints for a no-internet access model (requires [Azure Private Link](https://azure.microsoft.com/pricing/details/private-link/))

### Service costs

Unlike virtual machines or other resources that can be "paused" to avoid charges, an Azure Cognitive Search service is always available on hardware dedicated for your exclusive use. As such, creating a service is a billable event that starts when you create the service, and ends when you delete the service. 

The minimum charge is the first search unit (one replica x one partition) at the billable rate. This minimum is fixed for the lifetime of the service because the service can't run on anything less than this configuration. 

Beyond the minimum, you can add replicas and partitions independently of each other. Incremental increases in capacity through replicas and partitions will increase your bill based on the following formula: **(replicas x partitions x billing rate)**, where the rate you're charged depends on the pricing tier you select.

When you're estimating the cost of a search solution, keep in mind that pricing and capacity aren't linear (doubling capacity more than doubles the cost). For an example of how of the formula works, see [How to allocate replicas and partitions](search-capacity-planning.md#how-to-allocate-replicas-and-partitions).

### Bandwidth charges

Using [indexers](search-indexer-overview.md) can affect billing if the Azure data source is in a different region from Azure Cognitive Search. In this scenario, there could be a cost for moving outbound data from the Azure data source to Azure Cognitive Search. For details, refer to the pricing pages of the Azure data platform in question.

You can eliminate data egress charges entirely if you create the Azure Cognitive Search service in the same region as your data. Here's some information from the [bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/):

+ Inbound data: Microsoft doesn't charge for any inbound data to any service on Azure. 

+ Outbound data:  Outbound data refers to query results. Cognitive Search does not charge for outbound data, but outbound charges from Azure are possible if services are in different regions.

  These charges aren't actually part of your Azure Cognitive Search bill. They're mentioned here because if you're sending results to other regions or non-Azure apps, you could see those costs reflected in your overall bill.

### AI enrichment with Cognitive Services

For [AI enrichment](cognitive-search-concept-intro.md), you should plan to [attach a billable Azure Cognitive Services resource](cognitive-search-attach-cognitive-services.md), in the same region as Azure Cognitive Search, at the S0 pricing tier for pay-as-you-go processing. There's no fixed cost associated with attaching Cognitive Services. You pay only for the processing you need.

| Operation | Billing impact |
|-----------|----------------|
| Document cracking, text extraction | Free |
| Document cracking, image extraction | Billed according to the number of images extracted from your documents. In an [indexer configuration](/rest/api/searchservice/create-indexer#indexer-parameters), **imageAction** is the parameter that triggers image extraction. If **imageAction** is set to "none" (the default), you won't be charged for image extraction. The rate for image extraction is documented on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page for Azure Cognitive Search.|
| [Built-in cognitive skills](cognitive-search-predefined-skills.md) | Billed at the same rate as if you had performed the task by using Cognitive Services directly. |
| Custom skills | A custom skill is functionality you provide. The cost of using a custom skill depends entirely on whether custom code is calling other metered services. |

The [incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) feature allows you to provide a cache that enables the indexer to be more efficient at running only the cognitive skills that are necessary if you modify your skillset in the future, saving you time and money.

## Tips for managing costs

The following guidance can help you lower costs or manage costs more effectively:

+ Create all resources in the same region, or in as few regions as possible, to minimize or eliminate bandwidth charges.

+ Consolidate all services into one resource group, such as Azure Cognitive Search, Cognitive Services, and any other Azure services used in your solution. In the Azure portal, find the resource group and use the **Cost Management** commands for insight into actual and projected spending.

+ Consider Azure Web App for your front-end application so that requests and responses stay within the data center boundary.

+ Scale up for resource-intensive operations like indexing, and then readjust downwards for regular query workloads. Start with the minimum configuration for Azure Cognitive Search (one SU composed of one partition and one replica), and then monitor user activity to identify usage patterns that would indicate a need for more capacity. If there is a predictable pattern, you might be able to synchronize scale with activity (you would need to write code to automate this).

+ Cost management is built into the Azure infrastructure. Review [Billing and cost management](../cost-management-billing/cost-management-billing-overview.md) for more information about tracking costs, tools, and APIs.

Shutting down a search service on a temporary basis is not possible. Dedicated resources are always operational, allocated for your exclusive use for the lifetime of your service. Deleting a service is permanent and also deletes its associated data.

In terms of the service itself, the only way to lower your bill is to reduce replicas and partitions to a level that still provides acceptable performance and [SLA compliance](https://azure.microsoft.com/support/legal/sla/search/v1_0/), or create a service at a lower tier (S1 hourly rates are lower than S2 or S3 rates). Assuming you provision your service at the lower end of your load projections, if you outgrow the service, you can create a second larger-tiered service, rebuild your indexes on the second service, and then delete the first one.

## Next steps

Learn how to monitor and manage costs across your Azure subscription.

> [!div class="nextstepaction"]
> [Azure Cost Management and Billing documentation](../cost-management-billing/cost-management-billing-overview.md)