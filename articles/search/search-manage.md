---
title: Portal administration
titleSuffix: Azure AI Search
description: Manage an Azure AI Search resource using the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.custom:
  - ignite-2023
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/04/2024
---

# Service administration for Azure AI Search in the Azure portal

> [!div class="op_single_selector"]
>
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)

In Azure AI Search, the [Azure portal](https://portal.azure.com) supports a broad range of administrative and content management operations so that you don't have to write code unless you want automation. 

Each search service is managed as a standalone resource. Your permissions and role assignment determine what operations are available to you.

## Administrator permissions

Portal access is through [role assignments](search-security-rbac.md). By default, all search services start with at least one Owner. Owners, service administrators, and co-administrators have permission to create other administrators and other role assignments. They have full access to all portal pages and operations.

Contributors and Search Service Contributors have the same access to operations as Owner, minus the ability to assign roles.

Readers have access to service information in the Essentials section and in the Monitoring tab. It's very limited. A reader can get basic information about a search service, but not enough to set up a connection or confirm the existance of objects on the service.

Data plane roles such as Search Index Data Contributor and Search Index Data Reader don't have portal access.

> [!TIP]
> By default, any owner or administrator can create or delete services. To prevent accidental deletions, you can [lock resources](../azure-resource-manager/management/lock-resources.md).

## Service information in the Azure portal

The overview page is the "home" page of each service. In the following screenshot, the red boxes indicate tasks, tools, and tiles that you might use often, especially if you're new to the service.

:::image type="content" source="media/search-manage/search-portal-overview-page.png" alt-text="Portal pages for a search service" border="true":::

| Area | Description |
|------|-------------|
| 1 | A command bar at the top of the page includes [Import data wizard](search-get-started-portal.md) and [Search explorer](search-explorer.md), used for prototyping and exploration. |
| 2 | The **Essentials** section lists service properties, such as the service endpoint, service tier, and replica and partition counts. |
| 3 | Tabbed pages in the center provide quick access to usage statistics and service health metrics.|
| 4 | Navigation links to existing indexes, indexers, data sources, and skillsets. |

You can't change the search service name, subuscription, resource group, region (location), or tier. Switching tiers requires creating a new service or filing a support ticket to request a tier upgrade, which is only supported for Basic and higher.

## Day-one management checklist

On a new search service, we recommend the following tasks:

### Step one: Enable diagnostic logging

[Enable diagnostic logging](monitor-azure-cognitive-search.md)

### Step two: Configure access

Initially, only an owner has access to search service information and operations. You must [assign roles](search-security-rbac.md) to extend access, or provide users with a search endpoint with an API key.

A search service is always created with [API keys](search-security-api-keys.md). An admin API key grants read-write access to all data plane operations. .

### Step three: Check capacity and understand billing

By default, a search service is created with the minimum configuration of one replica and partition each. You 
* [Modify capacity](search-capacity-planning.md) by adding or removing replicas and partitions

* Configure network security. By default, a search service accepts authenticated and authorized requests over public internet connections. Network security restricts access through firewall rules, or by disabling public connections and allowing requests only from Azure virtual networks.

  * [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
  * [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network


There's feature parity across all modalities and languages except for preview management features. In general, preview management features are released through the Management REST API first. Programmatic support for service administration can be found in the following APIs and modules:

* [Management REST API reference](/rest/api/searchmanagement/)
* [Az.Search PowerShell module](search-manage-powershell.md)
* [az search Azure CLI module](search-manage-azure-cli.md)

You can also use the management client libraries in the Azure SDKs for .NET, Python, Java, and JavaScript. 

## Data collection and retention

Because Azure AI Search is a [monitored resource](../azure-monitor/monitor-reference.md), you can review the built-in [**activity logs**](../azure-monitor/essentials/activity-log.md) and [**platform metrics**](../azure-monitor/essentials/data-platform-metrics.md#types-of-metrics) for insights into service operations. Activity logs and the data used to report on platform metrics are retained for the periods described in the following table.

If you opt in for [**resource logging**](../azure-monitor/essentials/resource-logs.md), you'll specify durable storage over which you'll have full control over data retention and data access through Kusto queries. For more information on how to set up resource logging in Azure AI Search, see [Collect and analyze log data](monitor-azure-cognitive-search.md).

Internally, Microsoft collects telemetry data about your service and the platform. It's stored internally in Microsoft data centers and made globally available to Microsoft support engineers when you open a support ticket.

| Monitoring data | Retention |
|-----------------|-----------|
| Activity logs | 90 days on a rolling schedule |
| Platform metrics | 93 days on a rolling schedule, except that portal visualization is limited to a 30 day window |
| Resource logs | User-managed |
| Telemetry | One and a half years |

> [!NOTE]
> See the ["Data residency"](search-security-overview.md#data-residency) section of the security overview article for more information about data location and privacy.



## Next steps

* Review [monitoring capabilities](monitor-azure-cognitive-search.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [resource logging](monitor-azure-cognitive-search.md) to monitor query and indexing workloads
