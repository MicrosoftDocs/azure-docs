---
title: Portal administration
titleSuffix: Azure AI Search
description: Manage an Azure AI Search resource using the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/18/2024
---

# Service administration for Azure AI Search in the Azure portal

> [!div class="op_single_selector"]
>
> + [PowerShell](search-manage-powershell.md)
> + [Azure CLI](search-manage-azure-cli.md)
> + [REST API](search-manage-rest.md)

In Azure AI Search, the [Azure portal](https://portal.azure.com) supports a broad range of administrative and content management operations so that you don't have to write code unless you want automation. 

Each search service is managed as a standalone resource. Your role assignment determines what operations are exposed in the portal.

## Portal and administrator permissions

Portal access is through [role assignments](search-security-rbac.md). By default, all search services start with at least one Service Administrator or Owner. Service administrators, co-administrators, and owners have permission to create other administrators and other role assignments. They have full access to all portal pages and operations on a default search service.

If you disable API keys on a search service and use roles only, administrators must grant themselves data plane role assignments for full access to objects and data. These role assignments include Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader.

> [!TIP]
> By default, any owner or administrator can create or delete services. To prevent accidental deletions, you can [lock resources](../azure-resource-manager/management/lock-resources.md).

## Azure portal at a glance

The overview page is the home page of each service. In the following screenshot, the red boxes indicate tasks, tools, and tiles that you might use often, especially if you're new to the service.

:::image type="content" source="media/search-manage/search-portal-overview-page.png" alt-text="Portal pages for a search service" border="true":::

| Area | Description |
|------|-------------|
| 1 | A command bar at the top of the page includes [Import data wizard](search-get-started-portal.md) and [Search explorer](search-explorer.md), used for prototyping and exploration. |
| 2 | The **Essentials** section lists service properties, such as the service endpoint, service tier, and replica and partition counts. |
| 3 | Tabbed pages in the center provide quick access to usage statistics and service health metrics. |
| 4 | Navigation links to existing indexes, indexers, data sources, and skillsets. |

You can't change the search service name, subscription, resource group, region (location), or tier. Switching tiers requires creating a new service or filing a support ticket to request a tier upgrade, which is only supported for Basic and higher.

## Day-one management checklist

On a new search service, we recommend these configuration tasks.

### Enable role-based access

A search service is always created with [API keys](search-security-api-keys.md) and uses key-based authentication by default. However, using Microsoft Entra ID and role assignments is a more secure option because it eliminates storing and passing keys in plain text.

1. [Enable roles](search-security-enable-roles.md) on your search service. We recommend the roles-only option.

1. For administration, [assign data plane roles](search-security-rbac.md) to replace the functionality lost when you disable API keys. Role assignments include Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader. You need all three.

   Sometimes it can take five to ten minutes for role assignments to take effect. Until that happens, the following message appears in the portal pages used for data plane operations.

   :::image type="content" source="media/search-security-rbac/you-do-not-have-access.png" alt-text="Screenshot of portal message indicating insufficient permissions.":::

1. Continue to [add more role assignments](search-security-rbac.md) for solution developers and apps.

### Configure a managed identity

If you plan to use indexers for automated indexing, applied AI, or integrated vectorization, you should [configure the search service to use a managed identity](search-howto-managed-identities-data-sources.md). You can then add role assignments on other Azure services that authorize your search service to access data and operations.

For integrated vectorization, a search service identity needs:

+ Storage Blob Data Reader on Azure Storage
+ Cognitive Services Data User on an Azure AI multiservice account

It can take several minutes for role assignments to take effect.

Before moving on to network security, consider testing all points of connection to validate role assignments. Run either the [Import data wizard](search-get-started-portal.md) or the [Import and vectorize data wizard](search-get-started-portal-image-search.md) to test permissions. 

### Configure network security

By default, a search service accepts authenticated and authorized requests over public internet connections. Network security restricts access through firewall rules, or by disabling public connections and allowing requests only from Azure virtual networks.

+ [Configure network access](service-configure-firewall.md) to restrict access by IP addresses.
+ [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network.

[Security in Azure AI Search](search-security-overview.md) explains inbound and outbound calls in Azure AI Search.

### Check capacity and understand billing

By default, a search service is created in a minimum configuration of one replica and partition each. You can [add capacity](search-capacity-planning.md) by adding replicas and partitions, but we recommend waiting until volumes require it. Many customers run production workloads on the minimum configuration.

Some features add to the cost of running the service:

+ [How you're charged for Azure AI Search](search-sku-manage-costs.md#how-youre-charged-for-azure-ai-search) explains which features have billing impact.
+ [(Optional) disable semantic ranking](semantic-how-to-enable-disable.md) at the service level to prevent usage of the feature.

### Enable diagnostic logging

[Enable diagnostic logging](monitor-azure-cognitive-search.md) to track user activity. If you skip this step, you still get [activity logs](../azure-monitor/essentials/activity-log.md)  and [platform metrics](../azure-monitor/essentials/data-platform-metrics.md#types-of-metrics) automatically, but if you want index and query usage information, you should enable diagnostic logging and choose a destination for logged operations. 

We recommend Log Analytics Workspace for durable storage so that you can run system queries in the portal.

Internally, Microsoft collects telemetry data about your service and the platform. To learn more about data retention, see [Retention of metrics](/azure/azure-monitor/essentials/data-platform-metrics#retention-of-metrics).

> [!NOTE]
> See the ["Data residency"](search-security-overview.md#data-residency) section of the security overview article for more information about data location and privacy.

### Enable semantic ranking

Semantic ranking is free for the first 1,000 requests per month, but you must opt in to get the free quota. 

In Azure portal, under **Settings** on the leftmost pane, select **Semantic ranker** and then choose the Free plan. For more information, see [Enable semantic ranker](semantic-how-to-enable-disable.md).

### Provide connection information to developers

Developers need the following information to connect to Azure AI Search:

+ An endpoint or URL, provided on the **Overview** page.
+ An API key from the **Keys** page, or a role assignment (contributor is recommended).

We recommend portal access for the following wizards and tools: [Import data wizard](search-get-started-portal.md), [Import and vectorize data](search-get-started-portal-import-vectors.md), [Search explorer](search-explorer.md). Recall that a user must be a contributor or above to run the import wizards.

## Next steps

Programmatic support for service administration can be found in the following APIs and modules:

* [Management REST API reference](/rest/api/searchmanagement/)
* [Az.Search PowerShell module](search-manage-powershell.md)
* [az search Azure CLI module](search-manage-azure-cli.md)

You can also use the management client libraries in the Azure SDKs for .NET, Python, Java, and JavaScript. 

There's feature parity across all modalities and languages, except for preview management features. As a general rule, preview management features are released through the Management REST API first. 