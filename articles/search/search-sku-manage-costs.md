---
title: Plan and manage costs
titleSuffix: Azure AI Search
description: 'Learn about billable events, the billing model, and tips for cost control when running an Azure AI Search service.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/01/2022
---

# Plan and manage costs of an Azure AI Search service

This article explains the billing model and billable events of Azure AI Search, and provides direction for managing the costs.

As a first step, estimate your baseline costs by using the Azure pricing calculator. Alternatively, estimated costs and tier comparisons can also be found in the [Select a pricing tier](search-create-service-portal.md#choose-a-tier) page when creating a service.

Azure provides built-in cost management that cuts across service boundaries to provide inclusive cost monitoring and the ability to set budgets and define alerts. The costs of running a search service will vary depending on capacity and which features you use. After you create your search service, optimize capacity so that you pay only for what you need. 

<a name="billable-events"></a>

## Understand the billing model

Azure AI Search runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other additional infrastructure costs that might accrue.

### How you're charged for Azure AI Search

When you create or use Search resources, you're charged for the following meters:

+ You're charged an hourly rate based on the [pricing tier](search-sku-tier.md) of your search service, prorated to the hour.

+ The charge is applied per the number of search units (SU) allocated to the service. Search units are [units of capacity](search-capacity-planning.md). Total SU is the product of replicas and partitions (R x P = SU) used by your service.

Billing is based on capacity (SUs) and the costs of running premium features, such as [AI enrichment](cognitive-search-concept-intro.md), [Semantic ranking](semantic-search-overview.md), and [Private endpoints](service-create-private-endpoint.md). Meters associated with premium features are listed in the following table.

| Meter | Unit |
|-------|------|
| Image extraction (AI enrichment) <sup>1, 2</sup> | Per 1000 images. See the [pricing page](https://azure.microsoft.com/pricing/details/search/#pricing). |
| Custom Entity Lookup skill (AI enrichment) <sup>1</sup> | Per 1000 text records. See the [pricing page](https://azure.microsoft.com/pricing/details/search/#pricing) |
| [Built-in skills](cognitive-search-predefined-skills.md)  (AI enrichment) <sup>1</sup> | Number of transactions, billed at the same rate as if you had performed the task by calling Azure AI services directly. You can process 20 documents per indexer per day for free. Larger or more frequent workloads require a multi-resource Azure AI services key. |
| [Semantic ranking](semantic-search-overview.md) <sup>1</sup> | Number of queries of "queryType=semantic", billed at a progressive rate. See the [pricing page](https://azure.microsoft.com/pricing/details/search/#pricing). |
| [Shared private link](search-indexer-howto-access-private.md) <sup>1</sup> | [Billed for bandwidth](https://azure.microsoft.com/pricing/details/private-link/) as long as the shared private link exists and is used. |

<sup>1</sup> Applies only if you use or enable the feature.

<sup>2</sup> In an [indexer configuration](/rest/api/searchservice/create-indexer#indexer-parameters), "imageAction" is the parameter that triggers image extraction. If "imageAction" is set to "none" (the default), you won't be charged for image extraction. Costs are incurred when "imageAction" parameter is set *and* you include OCR, Image Analysis, or Document Extraction in a skillset.

There is no meter on the number of queries, query responses, or documents ingested, although [service limits](search-limits-quotas-capacity.md) do apply at each tier.

Data traffic might also incur networking costs. See the [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).

Several premium features such as [knowledge store](knowledge-store-concept-intro.md), [Debug Sessions](cognitive-search-debug-session.md), and [enrichment cache](cognitive-search-incremental-indexing-conceptual.md) have a dependency on Azure Storage. The meters for Azure Storage apply in this case, and the associated storage costs of using these features will be included in the Azure Storage bill.

[Customer-managed keys](search-security-manage-encryption-keys.md) provide double encryption of sensitive content. This feature requires a billable [Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault/)).

Skillsets can include [billable built-in skills](cognitive-search-predefined-skills.md), non-billable built-in utility skills, and custom skills. Non-billable utility skills include Conditional, Shaper, Text Merge, Text Split. There is no billing impact when using them, no Azure AI services key requirement, and no 20 document limit. 

A custom skill is functionality you provide. The cost of using a custom skill depends entirely on whether custom code is calling other metered services.  There is no Azure AI services key requirement and no 20 document limit on custom skills.

## Monitor costs

Cost management is built into the Azure infrastructure. Review [Billing and cost management](../cost-management-billing/cost-management-billing-overview.md) for more information about tracking costs, tools, and APIs.

## Minimize costs

Follow these guidelines to minimize costs of an Azure AI Search solution.

1. If possible, create all resources in the same region, or in as few regions as possible, to minimize or eliminate bandwidth charges.

1. [Scale up](search-capacity-planning.md) for resource-intensive operations like indexing, and then readjust downwards for regular query workloads. If there are predictable patterns to your workloads, you might be able to synchronize scale up to coincide with the expected volume (you would need to write code to automate this).

   When estimating the cost of a search solution, keep in mind that pricing and capacity aren't linear (doubling capacity more than doubles the cost on the same tier). Also, at some point, switching up to a higher tier can give you better and faster performance at roughly the same price point. For more information and an example, see [Upgrade to a Standard S2 tier](search-performance-tips.md#tip-upgrade-to-a-standard-s2-tier).

1. Consider [Azure Web App](../app-service/overview.md) for your front-end application so that requests and responses stay within the data center boundary.

1. If you're using [AI enrichment](cognitive-search-concept-intro.md), there is an extra charge for blob storage, but the cumulative cost goes down if you enable [enrichment caching](cognitive-search-incremental-indexing-conceptual.md).

## Create budgets

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you extra money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do more data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## FAQ

**Can I temporarily shut down a search service to save on costs?**

Search runs as a continuous service. Dedicated resources are always operational, allocated for your exclusive use for the lifetime of your service. To stop billing entirely, you must delete the service. Deleting a service is permanent and also deletes its associated data.

**Can I change the billing rate (tier) of an existing search service?**

In-place upgrade or downgrade is not supported. Changing a service tier requires provisioning a new service at the desired tier.

## Next steps

+ Learn more on how pricing works with Azure AI Search. See [Azure AI Search pricing page](https://azure.microsoft.com/pricing/details/search/).
+ Learn more about [replicas and partitions](search-sku-tier.md).
+ Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
+ Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
