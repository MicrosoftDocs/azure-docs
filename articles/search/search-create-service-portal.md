---
title: 'Create a search service in the portal'
titleSuffix: Azure AI Search
description: Learn how to set up an Azure AI Search resource in the Azure portal. Choose resource groups, regions, and the SKU or pricing tier.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 12/12/2023
---

# Create an Azure AI Search service in the portal

[**Azure AI Search**](search-what-is-azure-search.md) is an Azure resource used for adding a full text search experience to custom apps.

If you have an Azure subscription, including a [trial subscription](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F), you can create a search service for free. Free services have limitations, but you can complete all of the quickstarts and most tutorials.

The easiest way to create search service is using the [Azure portal](https://portal.azure.com/), which is covered in this article. You can also use [Azure PowerShell](search-manage-powershell.md#create-or-delete-a-service), [Azure CLI](search-manage-azure-cli.md#create-or-delete-a-service), the [Management REST API](search-manage-rest.md#create-or-update-a-service), an [Azure Resource Manager service template](search-get-started-arm.md), or a [Bicep file](search-get-started-bicep.md).

[![Animated GIF](./media/search-create-service-portal/AnimatedGif-AzureSearch-small.gif)](./media/search-create-service-portal/AnimatedGif-AzureSearch.gif#lightbox)

## Before you start

The following service properties are fixed for the lifetime of the service. Because they're fixed, consider the usage implications as you fill in each property:

+ Service name becomes part of the URL endpoint ([review tips for helpful service names](#name-the-service)).
+ [Tier](search-sku-tier.md) (Free, Basic, Standard, and so forth) determines the underlying physical hardware and billing. Some features are tier-constrained.
+ [Service region](#choose-a-region) can determine the availability of certain scenarios. If you need high availability or [AI enrichment](cognitive-search-concept-intro.md), you'll need to create the resource in a region that provides the feature. 

## Subscribe (free or paid)

To try search for free, [open a free Azure account](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) and then create your search service by choosing the **Free** tier. You can have one free search service per Azure subscription. Free search services are intended for short-term evaluation of the product for non-production applications. If you decide you would like to continue using the service for a production application, create a new search service on a billable tier.

Alternatively, you can use free credits to try out paid Azure services, which means you can create your search service at **Basic** or above to get more capacity. Your credit card is never charged unless you explicitly change your settings and ask to be charged. Another approach is to [activate Azure credits in a Visual Studio subscription](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). A Visual Studio subscription gives you credits every month you can use for paid Azure services. 

Paid (or billable) search occurs when you choose a billable tier (Basic or above) when creating the resource on a billable Azure subscription.

## Find the Azure AI Search offering

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Click the plus sign (**"+ Create Resource"**) in the top-left corner.

1. Use the search bar to find "Azure AI Search".

:::image type="content" source="media/search-create-service-portal/find-search3.png" lightbox="media/search-create-service-portal/find-search3.png" alt-text="Screenshot of the Create Resource page in the portal." border="true":::

## Choose a subscription

If you've more than one subscription, choose one for your search service. If you're implementing [customer-managed encryption](search-security-manage-encryption-keys.md) or if you use other features that depend on managed service identities for [external data access](search-indexer-securing-resources.md), choose the same subscription as the one used for Azure Key Vault or other services for which managed identities are used.

## Set a resource group

A resource group is a container that holds related resources for your Azure solution. It's required for the search service. It's also useful for managing resources all-up, including costs. A resource group can consist of one service, or multiple services used together. For example, if you're using Azure AI Search to index an Azure Cosmos DB database, you could make both services part of the same resource group for management purposes. 

If you aren't combining resources into a single group, or if existing resource groups are filled with resources used in unrelated solutions, create a new resource group just for your Azure AI Search resource. 

:::image type="content" source="media/search-create-service-portal/new-resource-group.png" lightbox="media/search-create-service-portal/new-resource-group.png" alt-text="Screenshot of the Create Resource Group page in the portal." border="true":::

Over time, you can track current and projected costs all-up or you can view charges for individual resources. The following screenshot shows the kind of cost information you can expect to see when you combine multiple resources into one group.

:::image type="content" source="media/search-create-service-portal/resource-group-cost-management.png" lightbox="media/search-create-service-portal/resource-group-cost-management.png" alt-text="Screenshot of the manage costs page in the portal." border="true":::

> [!TIP]
> Resource groups simplify cleanup because deleting a group deletes all of the services within it. For prototype projects utilizing multiple services, putting all of them in the same resource group makes cleanup easier after the project is over.

## Name the service

In Instance Details, provide a service name in the **URL** field. The name is part of the URL endpoint against which API calls are issued: `https://your-service-name.search.windows.net`. For example, if you want the endpoint to be `https://myservice.search.windows.net`, you would enter `myservice`.

Service name requirements:

+ It must be unique within the search.windows.net namespace
+ It must be between 2 and 60 characters in length
+ You must use lowercase letters, digits, or dashes ("-")
+ Don't use dashes ("-") in the first 2 characters or as the last single character
+ You may not use consecutive dashes ("--") anywhere

> [!TIP]
> If you think you'll be using multiple services, we recommend including the region (or location) in the service name as a naming convention. Services within the same region can exchange data at no charge, so if Azure AI Search is in West US, and you have other services also in West US, a name like `mysearchservice-westus` can save you a trip to the properties page when deciding how to combine or attach resources.

## Choose a region

> [!IMPORTANT]
> Due to high demand:
> + Azure AI Search is currently unavaible for new instances in West Europe. If you don't immediately need semantic ranker or skillsets, choose Sweden Central because it has the most data center capacity. Otherwise, North Europe is another option.

Azure AI Search is available in most regions, as listed in the [**Products available by region**](https://azure.microsoft.com/global-infrastructure/services/?products=search) page.

If you use multiple Azure services, putting all of them in the same region minimizes or voids bandwidth charges. There are no charges for data exchanges among same-region services.

Two notable exceptions might lead to provisioning Azure services in separate regions:

+ [Outbound connections from Azure AI Search to Azure Storage](search-indexer-securing-resources.md). You might want Azure Storage in a different region if you're enabling a firewall.

+ Business continuity and disaster recovery (BCDR) requirements dictate creating multiple search services in [regional pairs](../availability-zones/cross-region-replication-azure.md#azure-paired-regions). For example, if you're operating in North America, you might choose East US and West US, or North Central US and South Central US, for each search service.

Some features are subject to regional availability. If you require any of following features, choose a region that provides them:

+ [AI enrichment](cognitive-search-concept-intro.md) requires Azure AI services to be in the same physical region as Azure AI Search. There are just a few regions that *don't* provide both. The [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=search) page indicates a common regional presence by showing two stacked check marks. An unavailable combination has a missing check mark. The time piece icon indicates future availability.

  :::image type="content" source="media/search-create-service-portal/region-availability.png" lightbox="media/search-create-service-portal/region-availability.png" alt-text="Screenshot of the regional availability page." border="true":::

+ Semantic ranker is an optional premium feature. Check the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=search) page to confirm the feature is available in your chosen region. 

Other features that have regional constraints:

+ [Availability Zones](search-reliability.md#availability-zones)
+ [Azure roles for data plane operations](search-security-rbac.md) (Azure public cloud only)

## Choose a tier

Azure AI Search is currently offered in [multiple pricing tiers](https://azure.microsoft.com/pricing/details/search/): Free, Basic, Standard, or Storage Optimized. Each tier has its own [capacity and limits](search-limits-quotas-capacity.md). Also the tier you select may impact the availability of certain features. See [Feature availability by tier](search-sku-tier.md#feature-availability-by-tier) for guidance.

Basic and Standard are the most common choices for production workloads, but initially many customers start with the Free service for evaluation purposes. Among the billable tiers, key differences are partition size and speed, and limits on the number of objects you can create.

:::image type="content" source="media/search-create-service-portal/select-pricing-tier.png" lightbox="media/search-create-service-portal/select-pricing-tier.png" alt-text="Screenshot of Select a pricing tier page." border="true":::

Remember, a pricing tier can't be changed once the service is created. If you need a higher or lower tier, you'll have to re-create the service.

## Create your service

After you've provided the necessary inputs, go ahead and create the service. 

:::image type="content" source="media/search-create-service-portal/new-service3.png" lightbox="media/search-create-service-portal/new-service3.png" alt-text="Screenshot of the Review and create the service page." border="true":::

Your service is deployed within minutes. You can monitor progress through Azure notifications. Consider pinning the service to your dashboard for easy access in the future.

:::image type="content" source="media/search-create-service-portal/monitor-notifications.png" lightbox="media/search-create-service-portal/monitor-notifications.png" alt-text="Screenshot of the monitor and pin the service page." border="true":::

## Configure authentication

Unless you're using the portal, programmatic access to your new service requires that you provide the URL endpoint and an authenticated connection. You can use either or both of these options:

+ [Connect using key-based authentication](search-security-api-keys.md)
+ [Connect using Azure roles](search-security-rbac.md) 

1. When setting up a programmatic connection, you'll need the search service endpoint. On the **Overview** page, locate and copy the URL endpoint on the right side of the page.

   :::image type="content" source="media/search-create-service-portal/get-endpoint.png" lightbox="media/search-create-service-portal/get-endpoint.png" alt-text="Screenshot of the service overview page with URL endpoint." border="true":::

1. To set authentication options, use the **Keys** page. Most quickstarts and tutorials use API keys for simplicity, but if you're setting up a service for production workloads, consider using Azure roles. You can copy keys from this page.

   :::image type="content" source="media/search-create-service-portal/set-authentication-options.png" lightbox="media/search-create-service-portal/set-authentication-options.png" alt-text="Screenshot of the keys page with authentication options." border="true":::

An endpoint and key aren't needed for portal-based tasks. The portal is already linked to your Azure AI Search resource with admin rights. For a portal walkthrough, start with [Quickstart: Create an Azure AI Search index in the portal](search-get-started-portal.md).

## Scale your service

After a search service is provisioned, you can [scale it to meet your needs](search-limits-quotas-capacity.md). If you chose the Standard tier, you can scale the service in two dimensions: replicas and partitions. For the Basic tier, you can only add replicas. For the free service, scale isn't available.

***Partitions*** allow your service to store and search through more documents.

***Replicas*** allow your service to handle a higher load of search queries.

Adding resources increases your monthly bill. The [pricing calculator](https://azure.microsoft.com/pricing/calculator/) can help you understand the billing ramifications of adding resources. Remember that you can adjust resources based on load. For example, you might increase resources to create a full initial index, and then reduce resources later to a level more appropriate for incremental indexing.

> [!IMPORTANT]
> A service must have [2 replicas for read-only SLA and 3 replicas for read/write SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

1. Go to your search service page in the Azure portal.
1. In the left-navigation pane, select **Settings** > **Scale**.
1. Use the slidebar to add resources of either type.

:::image type="content" source="media/search-create-service-portal/settings-scale.png" lightbox="media/search-create-service-portal/settings-scale.png" alt-text="Screenshot of the add capacity page." border="true":::

## When to add a second service

Most customers use just one service provisioned at a tier [sufficient for expected load](search-capacity-planning.md). One service can host multiple indexes, subject to the [maximum limits of the tier you select](search-limits-quotas-capacity.md#index-limits), with each index isolated from another. In Azure AI Search, requests can only be directed to one index, minimizing the chance of accidental or intentional data retrieval from other indexes in the same service.

Although most customers use just one service, service redundancy might be necessary if operational requirements include the following:

+ [Business continuity and disaster recovery (BCDR)](../availability-zones/cross-region-replication-azure.md). Azure AI Search doesn't provide instant failover in the event of an outage.

+ [Multi-tenant architectures](search-modeling-multitenant-saas-applications.md) sometimes call for two or more services.

+ Globally deployed applications might require search services in each geography to minimize latency.

> [!NOTE]
> In Azure AI Search, you cannot segregate indexing and querying operations; thus, you would never create multiple services for segregated workloads. An index is always queried on the service in which it was created (you cannot create an index in one service and copy it to another).

A second service isn't required for high availability. High availability for queries is achieved when you use 2 or more replicas in the same service. Replica updates are sequential, which means at least one is operational when a service update is rolled out. For more information about uptime, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

## Add more services to a subscription

Azure AI Search restricts the [number of resources](search-limits-quotas-capacity.md#subscription-limits) you can initially create in a subscription. If you exhaust your maximum limit, file a new support request to add more search services.

1. Sign in to the Azure portal and find your search service.

1. On the left-navigation pane, scroll down and select **New Support Request.**

1. In **Issue type**, choose **Service and subscription limits (quotas).**

1. Select the subscription that needs more quota.

1. Under **Quota type**, select **Search** and then select **Next**.

1. In the **Problem details** section, select **Enter details**.

1. Follow the prompts to select the location and tier for which you want to increase the limit.

1. Add the number of new services you would like to add to your quota. The value must not be empty and must between 0 to 100. For example, the maximum number of S2 services is 8. If you want 12 services, you would request 4 of S2 services.

1. When you're finished, select **Save and continue** to continue creating your support request.

1. Provide the additional information required to file the request, and then select **Next**.

1. On **Review + create**, review the details that you'll send to support, and then select **Create**. 

## Next steps

After provisioning a service, you can continue in the portal to create your first index.

> [!div class="nextstepaction"]
> [Quickstart: Create an Azure AI Search index in the portal](search-get-started-portal.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
