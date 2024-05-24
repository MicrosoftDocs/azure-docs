---
title: 'Create a search service in the portal'
titleSuffix: Azure AI Search
description: Learn how to set up an Azure AI Search resource in the Azure portal. Choose resource groups, regions, and a pricing tier.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - references_regions
  - build-2024
ms.topic: conceptual
ms.date: 05/21/2024
---

# Create an Azure AI Search service in the portal

[**Azure AI Search**](search-what-is-azure-search.md) is a vector and full text information retrieval solution for the enterprise, and for traditional and generative AI scenarios.

If you have an Azure subscription, including a [trial subscription](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F), you can create a search service for free. Free services have limitations, but you can complete all of the quickstarts and most tutorials, except for those featuring semantic ranking (it requires a billable service).

The easiest way to create a service is using the [Azure portal](https://portal.azure.com/), which is covered in this article. You can also use [Azure PowerShell](search-manage-powershell.md#create-or-delete-a-service), [Azure CLI](search-manage-azure-cli.md#create-or-delete-a-service), the [Management REST API](search-manage-rest.md#create-or-update-a-service), an [Azure Resource Manager service template](search-get-started-arm.md), a [Bicep file](search-get-started-bicep.md), or [Terraform](search-get-started-terraform.md).

[![Animated GIF](./media/search-create-service-portal/AnimatedGif-AzureSearch-small.gif)](./media/search-create-service-portal/AnimatedGif-AzureSearch.gif#lightbox)

## Before you start

The following service properties are fixed for the lifetime of the service. Consider their usage implications as you fill in each property:

+ Service name becomes part of the URL endpoint ([review tips for helpful service names](#name-the-service)).
+ [Tier](search-sku-tier.md) (Free, Basic, Standard, and so forth) determines the underlying physical hardware and billing. Some features are tier-constrained.
+ [Service region](#choose-a-region) can determine the availability of certain scenarios and higher storage limits. If you need availability zones or [AI enrichment](cognitive-search-concept-intro.md) or more storage, create the resource in a region that provides the feature. 

## Subscribe (free or paid)

To try search for free, [open a free Azure account](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) and then create your search service by choosing the **Free** tier. You can have one free search service per Azure subscription. Free search services are intended for short-term evaluation of the product for nonproduction applications. If you want to move forward with a production application, create a new search service on a billable tier.

Alternatively, you can use free credits to try out paid Azure services. With this approach, you can create your search service at **Basic** or higher to get more capacity. Your credit card is never charged unless you explicitly change your settings and ask to be charged. Another approach is to [activate Azure credits in a Visual Studio subscription](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). A Visual Studio subscription gives you credits every month you can use for paid Azure services. 

Paid (or billable) search occurs when you choose a billable tier (Basic or higher) when creating the resource on a billable Azure subscription.

## Find the Azure AI Search offering

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select (**Create Resource"**) in the top-left corner.

1. Use the search bar to find "Azure AI Search*.

:::image type="content" source="media/search-create-service-portal/find-search3.png" lightbox="media/search-create-service-portal/find-search3.png" alt-text="Screenshot of the Create Resource page in the portal." border="true":::

## Choose a subscription

If you have more than one subscription, choose one for your search service. If you're implementing [customer-managed encryption](search-security-manage-encryption-keys.md) or if you use other features that depend on managed service identities for [external data access](search-indexer-securing-resources.md), choose the same subscription as the one used for Azure Key Vault or other services for which managed identities are used.

## Set a resource group

A resource group is a container that holds related resources for your Azure solution. It's useful for consolidating same-solution resources, monitoring costs, and for checking the creation date of your search service.

:::image type="content" source="media/search-create-service-portal/new-resource-group.png" lightbox="media/search-create-service-portal/new-resource-group.png" alt-text="Screenshot of the Create Resource Group page in the portal." border="true":::

Over time, you can track current and projected costs all-up or you can view charges for individual resources. The following screenshot shows the kind of cost information you can expect to see when you combine multiple resources into one group.

:::image type="content" source="media/search-create-service-portal/resource-group-cost-management.png" lightbox="media/search-create-service-portal/resource-group-cost-management.png" alt-text="Screenshot of the Managing costs page in the portal." border="true":::

> [!TIP]
> Resource groups simplify cleanup because deleting a resource group deletes everything within it.

## Name the service

In Instance Details, provide a service name in the **URL** field. The name is part of the endpoint against which API calls are issued: `https://your-service-name.search.windows.net`. For example, if you want the endpoint to be `https://myservice.search.windows.net`, you would enter `myservice`.

Service name requirements:

+ Unique within the search.windows.net namespace
+ Between 2-60 characters in length
+ Consist of lowercase letters, digits, or dashes (`-`)
+ Don't use dashes in the first two characters or as the last single character
+ Don't use consecutive dashes anywhere

> [!TIP]
> If you have multiple search services, it helps to include the region (or location) in the service name as a naming convention. A name like `mysearchservice-westus` can save you a trip to the properties page when deciding how to combine or attach resources.

## Choose a region

> [!IMPORTANT]
> Due to high demand, Azure AI Search is currently unavailable for new instances in West Europe. If you don't immediately need semantic ranker or skillsets, choose Sweden Central because it has the most data center capacity. Otherwise, North Europe is another option.

Azure AI Search is available in most regions, as listed in the [**Products available by region**](https://azure.microsoft.com/global-infrastructure/services/?products=search) page.

We strongly recommend the following regions because they provide [more storage per partition](search-limits-quotas-capacity.md#service-limits), three to seven times more depending on the tier, at the same billing rate. Extra capacity applies to search services created after specific dates.

### Roll out on May 2024

| Country | Regions providing extra capacity per partition |
|---------|------------------------------------------------|
| **United States** | East US 2 EUAP/PPE |
| **South Africa** | South Africa North​ |
| **Germany** | Germany North​, Germany West Central​ ​|
| **Azure Government** | Texas, Arizona, Virginia |

### Roll out on April 2024

| Country | Regions providing extra capacity per partition |
|---------|------------------------------------------------|
| **United States** | East US​, East US 2, ​Central US​, North Central US​, South Central US​, West US​, West US 2​, West US 3​, West Central US​ |
| **United Kingdom** | UK South​, UK West​ ​ |
| **United Arab Emirates** | UAE North​​ |
| **Switzerland** | Switzerland West​ |
| **Sweden** | Sweden Central​​ |
| **South Africa** | South Africa North​ |
| **Poland** | Poland Central​​ |
| **Norway** | Norway East​​ |
| **Korea** | Korea Central, Korea South​ ​ |
| **Japan** | Japan East, Japan West​ |
| **Italy** | Italy North​​ |
| **India** | Central India, Jio India West​ ​ |
| **France** | France Central​​ |
| **Europe** | North Europe​​ |
| **Canada** | Canada Central​, Canada East​​ |
| **Bazil** | Brazil South​​ |
| **Asia Pacific** |  East Asia, Southeast Asia​ ​ |
| **Australia** | Australia East​, Australia Southeast​​ |

If you use multiple Azure services, putting all of them in the same region minimizes or voids bandwidth charges. There are no charges for data exchanges among same-region services.

Two notable exceptions might warrant provisioning Azure services in separate regions:

+ [Outbound connections from Azure AI Search to Azure Storage](search-indexer-securing-resources.md). You might want search and storage in different regions if you're enabling a firewall.

+ Business continuity and disaster recovery (BCDR) requirements dictate creating multiple search services in [regional pairs](../availability-zones/cross-region-replication-azure.md#azure-paired-regions). For example, if you're operating in North America, you might choose East US and West US, or North Central US and South Central US, for each search service.

Some features are subject to [regional availability](https://azure.microsoft.com/global-infrastructure/services/?products=search):

+ [Availability Zones](search-reliability.md#availability-zones)
+ [Azure roles for data plane operations](search-security-rbac.md) (Azure public cloud only)
+ [Semantic ranker](semantic-search-overview.md), per the [**Products available by region**](https://azure.microsoft.com/global-infrastructure/services/?products=search) page.
+ [AI enrichment](cognitive-search-concept-intro.md) requires Azure AI services to be in the same physical region as Azure AI Search. There are just a few regions that *don't* provide both. 

The [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=search) page indicates a common regional presence by showing two stacked check marks. An unavailable combination has a missing check mark. The time piece icon indicates future availability.

  :::image type="content" source="media/search-create-service-portal/region-availability.png" lightbox="media/search-create-service-portal/region-availability.png" alt-text="Screenshot of the Regional availability page." border="true":::

## Choose a tier

Azure AI Search is offered in [multiple pricing tiers](https://azure.microsoft.com/pricing/details/search/): Free, Basic, Standard, or Storage Optimized. Each tier has its own [capacity and limits](search-limits-quotas-capacity.md). There are also several [features that are tier-dependent](search-sku-tier.md#feature-availability-by-tier).

Basic and Standard are the most common choices for production workloads, but many customers start with the Free service. Among the billable tiers, key differences are partition size and speed, and limits on the number of objects you can create.

:::image type="content" source="media/search-create-service-portal/select-pricing-tier.png" lightbox="media/search-create-service-portal/select-pricing-tier.png" alt-text="Screenshot of Select a pricing tier page." border="true":::

Search services created after April 3, 2024 have larger partitions and higher vector quotas.

Remember, a pricing tier can't be changed once the service is created. If you need a higher or lower tier, you should re-create the service.

## Create your service

After you've provided the necessary inputs, go ahead and create the service. 

:::image type="content" source="media/search-create-service-portal/new-service3.png" lightbox="media/search-create-service-portal/new-service3.png" alt-text="Screenshot of the Review and create the service page." border="true":::

Your service is deployed within minutes. You can monitor progress through Azure notifications. Consider pinning the service to your dashboard for easy access in the future.

:::image type="content" source="media/search-create-service-portal/monitor-notifications.png" lightbox="media/search-create-service-portal/monitor-notifications.png" alt-text="Screenshot of the Monitor and pin the service page." border="true":::

## Configure authentication

Unless you're using the portal, programmatic access to your new service requires that you provide the URL endpoint and an authenticated connection. You can use either or both of these options:

+ [Connect using key-based authentication](search-security-api-keys.md)
+ [Connect using Azure roles](search-security-rbac.md) 

1. When setting up a programmatic connection, you need the search service endpoint. On the **Overview** page, locate and copy the URL endpoint on the right side of the page.

   :::image type="content" source="media/search-create-service-portal/get-endpoint.png" lightbox="media/search-create-service-portal/get-endpoint.png" alt-text="Screenshot of the service Overview page with URL endpoint." border="true":::

1. To set authentication options, use the **Keys** page. Most quickstarts and tutorials use API keys for simplicity, but if you're setting up a service for production workloads, consider using Azure roles. You can copy keys from this page.

   :::image type="content" source="media/search-create-service-portal/set-authentication-options.png" lightbox="media/search-create-service-portal/set-authentication-options.png" alt-text="Screenshot of the Keys page with authentication options." border="true":::

An endpoint and key aren't needed for portal-based tasks. The portal is already linked to your Azure AI Search resource with admin rights. For a portal walkthrough, start with [Quickstart: Create an Azure AI Search index in the portal](search-get-started-portal.md).

## Scale your service

After a search service is provisioned, you can [scale it to meet your needs](search-limits-quotas-capacity.md). On a billable tier, you can scale the service in two dimensions: replicas and partitions. For the free service, scale up isn't available and replica and partition configuration isn't offered.

***Partitions*** allow your service to store and search through more documents.

***Replicas*** allow your service to handle a higher load of search queries.

Adding resources increases your monthly bill. The [pricing calculator](https://azure.microsoft.com/pricing/calculator/) can help you understand the billing ramifications of adding resources. Remember that you can adjust resources based on load. For example, you might increase resources to create a full initial index, and then reduce resources later to a level more appropriate for incremental indexing.

> [!IMPORTANT]
> A service must have [2 replicas for read-only SLA and 3 replicas for read/write SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

1. Go to your search service page in the Azure portal.
1. In the left-navigation pane, select **Settings** > **Scale**.
1. Use the slidebar to add resources of either type.

:::image type="content" source="media/search-create-service-portal/settings-scale.png" lightbox="media/search-create-service-portal/settings-scale.png" alt-text="Screenshot of the scale page." border="true":::

## When to add a second service

Most customers use just one service provisioned at a tier [sufficient for expected load](search-capacity-planning.md). One service can host multiple indexes, subject to the [maximum limits of the tier you select](search-limits-quotas-capacity.md#index-limits), with each index isolated from another. In Azure AI Search, requests can only be directed to one index, minimizing the chance of accidental or intentional data retrieval from other indexes in the same service.

Although most customers use just one service, service redundancy might be necessary if operational requirements include the following:

+ [Business continuity and disaster recovery (BCDR)](../availability-zones/cross-region-replication-azure.md). Azure AI Search doesn't provide instant failover if there's an outage.

+ [Multitenant architectures](search-modeling-multitenant-saas-applications.md) sometimes call for two or more services.

+ Globally deployed applications might require search services in each geography to minimize latency.

> [!NOTE]
> In Azure AI Search, you cannot segregate indexing and querying operations; thus, you would never create multiple services for segregated workloads. An index is always queried on the service in which it was created (you cannot create an index in one service and copy it to another).

A second service isn't required for high availability. High availability for queries is achieved when you use two or more replicas in the same service. Replica updates are sequential, which means at least one is operational when a service update is rolled out. For more information about uptime, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

## Add more services to a subscription

Azure AI Search restricts the [number of search services](search-limits-quotas-capacity.md#subscription-limits) you can initially create in a subscription. If you exhaust your maximum limit, you can request more quota.

You must have Owner or Contributor permissions on the subscription to request quota.

Maximum quota for a given tier and region combination is an extra 100 search services over the baseline quota (which means 106, 108, or 116 [depending on the tier](search-limits-quotas-capacity.md#subscription-limits)). You can't increase quota for the Free tier.

1. Sign in to the Azure portal, search for "quotas" in your dashboard, and then select the **Quotas** service.

   :::image type="content" source="media/search-create-service-portal/quota-search.png" lightbox="media/search-create-service-portal/quota-search.png" alt-text="Screenshot of the quota search term and Quotas service in the results.":::

1. In the Quota's Overview page, select **Search**.

   :::image type="content" source="media/search-create-service-portal/quota-overview-page.png" lightbox="media/search-create-service-portal/quota-overview-page.png" alt-text="Screenshot of the search tile in the Quota's overview page.":::

1. Set filters so that you can review existing quota for search services in the current subscription. We recommend filtering by usage.

1. Find the region and tier that needs more quota and select the **Edit** pencil icon to begin your request.

   :::image type="content" source="media/search-create-service-portal/quota-pencil-edit.png" lightbox="media/search-create-service-portal/quota-pencil-edit.png" alt-text="Screenshot of the My Quotas page with a region at maximum quota.":::

1. In **Quota details**, specify the location, tier, and a new limit for your subscription quota. None of the values can be empty. The new limit must be greater than the current limit, and equal to or lower than the number in the auto-approved quota increase column. For example, for the Basic tier in a given region, if the current limit is 16, your new limit can be between 17 and 80.

   | Tier | Default limit | Auto-approved quota increase | Combined total |
   |--|--|--|--|
   | Basic | 16 | 80 | 96 |
   | S1 | 16 | 30 | 46 |
   | S2 | 8 | 10 | 18 |
   | S3, S3HD | 6 | 10 | 16 |
   | L1, L2 | 6 |  10 | 16 |

1. Submit the request.

1. Monitor notifications in the Azure portal for status updates on the new limit. Most requests are approved within 24 hours.

## Next steps

After provisioning a service, you can continue in the portal to create your first index.

> [!div class="nextstepaction"]
> [Quickstart: Create an Azure AI Search index in the portal](search-get-started-portal.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
