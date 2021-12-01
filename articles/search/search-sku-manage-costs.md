---
title: Plan and manage costs
titleSuffix: Azure Cognitive Search
description: 'Learn about billable events, the billing model, and tips for cost control when running a Cognitive Search service.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/18/2021
---

# Plan and manage costs of an Azure Cognitive Search service

This article explains the billing model and billable events of Azure Cognitive Search, and provides direction for managing the costs.

As a first step, estimate baseline costs by using the Azure pricing calculator. Alternatively, estimated costs and tier comparisons can also be found in the [Select a pricing tier](search-create-service-portal.md#choose-a-pricing-tier) page when creating a service.

Azure provides built-in cost management that cuts across service boundaries to provide inclusive cost monitoring and the ability to set budgets and define alerts. The costs of running a search service will vary depending on capacity and which features you use. After you create your search service, optimize capacity so that you pay only for what you need. 

## Understand the billing model

Capacity is a primary determinant of billing. In Azure Cognitive Search, there is a fixed component, but the scalability architecture is based on flexible combinations of replicas and partitions so that you can vary capacity depending on whether you need more query or indexing power, or less.

The amount of resources used by your search service, multiplied by the billing rate established by the service tier, determines the baseline cost of running the service. For billing purposes, there are two simple formulas to be aware of:

| Formula | Description |
|---------|-------------|
| **R x P = SU** | System capacity, defined as the number of replicas used, multiplied by the number of partitions used, equals the quantity of *search units* (SU)  used by a service. An SU is a unit of resource, and it can be either a partition or a replica. |
| **SU * billing rate = monthly spend** | The number of SUs multiplied by the billing rate of the tier at which you provisioned the service is the primary determinant of your overall monthly bill. Some features or workloads have dependencies on other Azure services, which can increase the cost of your solution at the subscription level. The billable events section below identifies features that can add to your bill. |

### SU minimum and maximum values

Every service starts with one SU (one replica multiplied by one partition) as the minimum, and this is the fixed cost of running the service.

The maximum capacity for any service is 36 SUs. This maximum can be reached in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, for example. It's common to use less than total capacity (for example, a 3-replica, 3-partition service billed as 9 SUs). See the [Partition and replica combinations](search-capacity-planning.md#chart) chart for valid combinations.

### Billing rate

The billing rate is hourly per SU. Each tier has a progressively higher rate. Higher tiers come with larger and faster partitions, and this contributes to an overall higher hourly rate for that tier. You can view the rates for each tier on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page.

Most customers bring just a portion of total capacity online, holding the rest in reserve. For billing, the number of partitions and replicas that you bring online, calculated by the SU formula, determines the hourly rate. 

## Billable events

The following table lists the billable events in an Azure Cognitive Search solution.

| Event | Description |
|-------|-------------|
| Service creation | The fixed cost of the service itself, running 24x7, at minimum configuration (one partition and replica), at the base rate. |
| [Bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/)  | Applicable to [indexers](search-indexer-overview.md) and skills that extract content from resources in remote regions. There is no data egress charge for same-region data access, or for pushing data into a search source. Cognitive Search does not have a meter for outbound query responses. |
| Add capacity | Adding either replicas or partitions is an incremental increase at the billable rate. If high availability is a business requirement, you'll need three replicas to meet the Service Level Agreement (SLA) requirement for Azure Cognitive Search.|
| Add premium features | Some features have dependencies on other billable Azure resources, or require additional infrastructure to support larger workloads. The following list identifies premium features. |

### Add-on services required for premium features

| Feature | Description |
|---------|-------------|
| [AI enrichment](cognitive-search-concept-intro.md) | Using billable skills (requires [Cognitive Services](https://azure.microsoft.com/pricing/details/cognitive-services/)). Image extraction is also billable. More details are in the following section. |
| [Knowledge store](knowledge-store-concept-intro.md) | Stores output from AI enrichment. It requires a billable [Azure Storage](https://azure.microsoft.com/pricing/details/storage/)) account. |
| [Enrichment cache (preview)](cognitive-search-incremental-indexing-conceptual.md) | Applies to AI enrichment. It requires a billable [Azure Storage](https://azure.microsoft.com/pricing/details/storage/)) account. </br></br>Caching can significantly lower the cost of skillset processing by caching and reusing enrichments that are unaffected by changes made to a skillset. Caching requires a billable Azure Storage, but the cumulative cost of skillset execution is typically lower if existing enrichments can be reused.|
| [Customer-managed keys](search-security-manage-encryption-keys.md)| Provides double encryption of sensitive content. It requires a billable [Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault/)). |
| [Private endpoints](service-create-private-endpoint.md) | Used for a no-internet data access model. It requires [Azure Private Link](https://azure.microsoft.com/pricing/details/private-link/)). |
| [Semantic search](semantic-search-overview.md) |This is a metered, premium feature on Standard tiers (see the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) for costs). You can [disable semantic search](semantic-search-overview.md#disable-semantic-search) to prevent accidental usage.|

### Drill-down into AI enrichment billing

For [AI enrichment](cognitive-search-concept-intro.md) using billable skills, you should plan to [attach a billable Azure Cognitive Services resource](cognitive-search-attach-cognitive-services.md), in the same region as Azure Cognitive Search, at the S0 pricing tier for pay-as-you-go processing. There's no fixed cost associated with attaching Cognitive Services. You pay only for the processing you need.

| Operation | Billing impact |
|-----------|----------------|
| Document cracking, text extraction | Free |
| Document cracking, image extraction | Billed according to the number of images extracted from your documents. In an [indexer configuration](/rest/api/searchservice/create-indexer#indexer-parameters), **imageAction** is the parameter that triggers image extraction. If **imageAction** is set to "none" (the default), you won't be charged for image extraction. See the [pricing page](https://azure.microsoft.com/pricing/details/search/) page for image extract charges. |
| [Built-in skills](cognitive-search-predefined-skills.md) based on Cognitive Services | Billed at the same rate as if you had performed the task by using Cognitive Services directly. You can process 20 documents per indexer per day for free. Larger or more frequent workloads require a key. |
| [Built-in skills](cognitive-search-predefined-skills.md) that do not add enrichments | None. Non-billable utility skills include Conditional, Shaper, Text Merge, Text Split. There is no billing impact, no Cognitive Services key requirement, and no 20 document limit. |
| Custom skills | A custom skill is functionality you provide. The cost of using a custom skill depends entirely on whether custom code is calling other metered services.  There is no Cognitive Services key requirement and no 20 document limit on custom skills.|
| [Custom Entity Lookup](cognitive-search-skill-custom-entity-lookup.md) | Metered by Azure Cognitive Search. See the [pricing page](https://azure.microsoft.com/pricing/details/search/#pricing) for details. |

## Manage costs

Cost management is built into the Azure infrastructure. Review [Billing and cost management](../cost-management-billing/cost-management-billing-overview.md) for more information about tracking costs, tools, and APIs.

1. Create all resources in the same region, or in as few regions as possible, to minimize or eliminate bandwidth charges.

1. Scale up for resource-intensive operations like indexing, and then readjust downwards for regular query workloads. If there are predictable patterns to your workloads, you might be able to synchronize scale with activity (you would need to write code to automate this).

   When estimating the cost of a search solution, keep in mind that pricing and capacity aren't linear (doubling capacity more than doubles the cost on the same tier). Also, at some point, switching up to a higher tier can give you better and faster performance at roughly the same price point. For more information and an example, see [Upgrade to a Standard S2 tier](search-performance-tips.md#tip-upgrade-to-a-standard-s2-tier).

1. Consider Azure Web App for your front-end application so that requests and responses stay within the data center boundary.

## FAQ

**Can I temporarily shut down a search service to save on costs?**

Search runs as a continuous service. Dedicated resources are always operational, allocated for your exclusive use for the lifetime of your service. To stop billing entirely, you must delete the service. Deleting a service is permanent and also deletes its associated data.

**Can I change the billing rate (tier) of an existing search service?**

In-place upgrade or downgrade is not supported. Changing a service tier requires provisioning a new service at the desired tier.

## Next steps

+ Learn more on how pricing works with Azure Cognitive Search. See [Azure Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/).
+ Learn more about [replicas and partitions](search-sku-tier.md).
+ Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Take the [Cost Management](/learn/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
