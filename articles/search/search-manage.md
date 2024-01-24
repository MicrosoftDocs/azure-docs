---
title: Portal administration
titleSuffix: Azure AI Search
description: Manage an Azure AI Search resource using the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
tags: azure-portal
ms.custom:
  - ignite-2023
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/12/2024
---

# Service administration for Azure AI Search in the Azure portal

> [!div class="op_single_selector"]
>
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Portal](search-manage.md)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

This article covers the Azure AI Search administration tasks that you can perform in the [Azure portal](https://portal.azure.com).

Depending on your permission level, the portal provides coverage of most search service operations, including:

* [Service administration](#management-tasks)
* Content management
* Content exploration

Each search service is managed as a standalone resource. The following image shows the portal pages for a single free search service called "demo-search-svc". 

## Overview (home) page

The overview page is the "home" page of each service. In the following screenshot, the red boxes indicate tasks, tools, and tiles that you might use often, especially if you're new to the service.

:::image type="content" source="media/search-manage/search-portal-overview-page.png" alt-text="Portal pages for a search service" border="true":::

| Area | Description |
|------|-------------|
| 1 | A command bar at the top of the page includes [Import data wizard](search-get-started-portal.md) and [Search explorer](search-explorer.md), used for prototyping and exploration. |
| 2 | The **Essentials** section lists service properties, such as the service endpoint, service tier, and replica and partition counts. |
| 3 | Tabbed pages in the center provide quick access to usage statistics and service health metrics.|
| 4 | Navigation links to existing indexes, indexers, data sources, and skillsets. |

### Read-only service properties

Several aspects of a search service are determined when the service is provisioned and can't be easily changed:

* Service name
* Service location <sup>1</sup>
* Service tier <sup>2</sup>

<sup>1</sup> Although there are ARM and bicep templates for service deployment, moving content is a manual effort.

<sup>2</sup> Switching a tier requires creating a new service or filing a support ticket to request a tier upgrade.

## Management tasks

Service administration includes the following tasks:

* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Manage API keys](search-security-api-keys.md) used for content access
* [Manage Azure roles](search-security-rbac.md) used for content and service access
* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network
* [Monitor service health and operations](monitor-azure-cognitive-search.md): storage, query volumes, and latency

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

## Administrator permissions

When you open the search service overview page, the Azure role assigned to your account determines what portal content is available to you. The overview page at the beginning of the article shows the portal content available to an Owner or Contributor.

Azure roles used for service administration include:

* Owner
* Contributor (same as Owner, minus the ability to assign roles)
* Reader (provides access to service information in the Essentials section and in the Monitoring tab)

By default, all search services start with at least one Owner. Owners, service administrators, and co-administrators have permission to create other administrators and other role assignments.

Also by default, search services start with API keys for content-related tasks that an Owner or Contributor might perform in the portal. However, it's possible to turn off [API key authentication](search-security-api-keys.md) and use [Azure role-based access control](search-security-rbac.md#built-in-roles-used-in-search) exclusively. If you turn off API keys, be sure to set up data access role assignments so that all features in the portal remain operational.

> [!TIP]
> By default, any owner or administrator can create or delete services. To prevent accidental deletions, you can [lock resources](../azure-resource-manager/management/lock-resources.md).

## Next steps

* Review [monitoring capabilities](monitor-azure-cognitive-search.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [resource logging](monitor-azure-cognitive-search.md) to monitor query and indexing workloads
