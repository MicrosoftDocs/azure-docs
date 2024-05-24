---
title: Portal administration
titleSuffix: Azure AI Search
description: Manage an Azure AI Search resource using the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/23/2024
---

# Service administration for Azure AI Search in the Azure portal

> [!div class="op_single_selector"]
>
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)

In Azure AI Search, the [Azure portal](https://portal.azure.com) supports a broad range of administrative and content management operations so that you don't have to write code unless you want automation. 

Each search service is managed as a standalone resource. Your role assignment determines what operations are exposed in the portal.

## Portal and administrator permissions

Portal access is through [role assignments](search-security-rbac.md). By default, all search services start with at least one Owner. Owners, service administrators, and co-administrators have permission to create other administrators and other role assignments. They have full access to all portal pages and operations.

Contributors and Search Service Contributors have the same access as Owner, minus the ability to assign roles.

Readers have access to service information in the Essentials section and in the Monitoring tab. Access is limited. A reader can get basic information about a search service, but not enough to set up a connection or confirm the existence of objects on the service. 

For data plane tasks, such as creating and configuring indexes and indexers: on a default system, the portal attempts admin API keys first, even if there are role assignments. If [keys are disabled](search-security-rbac.md#disable-api-key-authentication), here's the portal experience for the following roles:

* Search Index Data Contributor can see the list of indexers, and access an individual one to see its historical runs and status, but cannot run, reset, create, update, or delete it.

* A Search Index Data Reader can query the indexes.

In short, if you want unrestricted access to portal features, including the ability to run the Import data wizards, you should have Contributor or Search Servicer Contributor permissions.

> [!TIP]
> By default, any owner or administrator can create or delete services. To prevent accidental deletions, you can [lock resources](../azure-resource-manager/management/lock-resources.md).

## Azure portal at a glance

The overview page is the "home" page of each service. In the following screenshot, the red boxes indicate tasks, tools, and tiles that you might use often, especially if you're new to the service.

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

### Check capacity and understand billing

By default, a search service is created in a minimum configuration of one replica and partition each. You can [add capacity](search-capacity-planning.md) by adding replicas and partitions, but we recommend waiting until volumes require it. Many customers run production workloads on the minimum configuration.

Some features add to the cost of running the service:

+ [How you're charged for Azure AI Search](search-sku-manage-costs.md#how-youre-charged-for-azure-ai-search) explains which features have billing impact.
+ [(Optional) disable semantic ranking](semantic-how-to-enable-disable.md) at the service level to prevent usage of the feature.

### Configure network security

By default, a search service accepts authenticated and authorized requests over public internet connections. Network security restricts access through firewall rules, or by disabling public connections and allowing requests only from Azure virtual networks.

* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address.
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network.

[Security in Azure AI Search](search-security-overview.md) explains inbound and outbound calls in Azure AI Search.

### Enable diagnostic logging

[Enable diagnostic logging](monitor-azure-cognitive-search.md) to track user activity. If you skip this step, you still get [activity logs](../azure-monitor/essentials/activity-log.md)  and [platform metrics](../azure-monitor/essentials/data-platform-metrics.md#types-of-metrics) automatically, but if you want index and query usage information, you should enable diagnostic logging and choose a destination for logged operations. 

We recommend Log Analytics Workspace for durable storage so that you can run system queries in the portal.

Internally, Microsoft collects telemetry data about your service and the platform. It's stored internally in Microsoft data centers and made globally available to Microsoft support engineers when you open a support ticket.

| Monitoring data | Retention |
|-----------------|-----------|
| Activity logs | 90 days on a rolling schedule |
| Platform metrics | 93 days on a rolling schedule, except that portal visualization is limited to a 30 day window |
| Resource logs | User-managed |
| Telemetry | One and a half years |

> [!NOTE]
> See the ["Data residency"](search-security-overview.md#data-residency) section of the security overview article for more information about data location and privacy.

### Enable semantic ranking

Semantic ranking is free for the first 1,000 requests per month, but you must opt-in to get the free quota. 

In Azure portal, under **Settings** on the leftmost pane, select **Semantic ranker** and then choose the Free plan. For more information, see [Enable semantic ranker](semantic-how-to-enable-disable.md).

### Configure user access

Initially, only an owner has access to search service information and operations. [Assign roles](search-security-rbac.md) to extend access, or provide users with a search endpoint with an API key.

A search service is always created with [API keys](search-security-api-keys.md). An admin API key grants read-write access to all data plane operations. You can't delete admin API keys but you can [disable API keys](search-security-rbac.md#disable-api-key-authentication) if you want all users to access data plane operations through role assignments.

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