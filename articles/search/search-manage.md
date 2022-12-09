---
title: Service administration in the portal
titleSuffix: Azure Cognitive Search
description: Manage an Azure Cognitive Search service, a hosted cloud search service on Microsoft Azure, using the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
tags: azure-portal
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/23/2022
---
# Service administration for Azure Cognitive Search in the Azure portal

> [!div class="op_single_selector"]
>
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Portal](search-manage.md)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

Azure Cognitive Search is a fully managed, cloud-based search service used for building a rich search experience into custom apps. This article covers the administration tasks that you can perform in the [Azure portal](https://portal.azure.com) for a search service that you've already created.

Depending on your permission level, the portal covers virtually all aspects of search service operations, including:

* [Service administration](#management-tasks)
* Content management
* Content exploration

Each search service is managed as a standalone resource. The following image shows the portal pages for a single free search service called "demo-search-svc". 

## Overview (home) page

The overview page is the "home" page of each service. Below, the areas on the screen enclosed in red boxes indicate tasks, tools, and tiles that you might use often, especially if you are new to the service.

:::image type="content" source="media/search-manage/search-portal-overview-page.png" alt-text="Portal pages for a search service" border="true":::

| Area | Description |
|------|-------------|
| 1  | The **Essentials** section lists service properties, such as the service endpoint, service tier, and replica and partition counts. |
| 2 | A command bar at the top of the page includes [Import data](search-get-started-portal.md) and [Search explorer](search-explorer.md), used for prototyping and exploration. |
| 3 | Tabbed pages in the center provide quick access to usage statistics, service health metrics, and access to all of the existing indexes, indexers, data sources, and skillsets.|
| 4 | Navigation links are to the left. |

### Read-only service properties

Several aspects of a search service are determined when the service is provisioned and can't be easily changed:

* Service name
* Service location <sup>1</sup>
* Service tier <sup>2</sup>

<sup>1</sup> Although there are ARM and bicep templates for service deployment, moving content is a manual job.

<sup>2</sup> Switching tiers requires creating a new service or filing a support ticket to request a tier upgrade.

## Management tasks

Service administration includes the following tasks:

* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Rotate API keys](search-security-api-keys.md) used for admin and query operations
* [Control access to admin operations](search-security-rbac.md) through role-based security
* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network
* [Monitor service health and operations](monitor-azure-cognitive-search.md): storage, query volumes, and latency

There is feature parity across all modalities and languages except for preview management features. In general, preview management features are released through the Management REST API first. Programmatic support for service administration can be found in the following APIs and modules:

* [Management REST API reference](/rest/api/searchmanagement/)
* [Az.Search PowerShell module](search-manage-powershell.md)
* [az search Azure CLI module](search-manage-azure-cli.md)

You can also use the management client libraries in the Azure SDKs for .NET, Python, Java, and JavaScript. 

## Data collection and retention

Cognitive Search uses other Azure services for deeper monitoring and management. By itself, the only persistent data stored within the search service are the structures that support indexing, enrichment, and queries. These structures include indexes, indexers, data sources, skillsets, and synonym maps. All other saved data, including debug session state and caching, is placed in Azure Storage.

Metrics reported out to portal pages are pulled from internal logs on a rolling 30-day cycle. For user-controlled log retention and more events, you will need [Azure Monitor](../azure-monitor/index.yml) and a supported approach for retaining log data.  For more information about setting up resource logging for a search service, see [Collect and analyze log data](monitor-azure-cognitive-search.md).

## Administrator permissions

When you open the search service overview page, the Azure role assigned to your account determines what portal content is available to you. The overview page at the beginning of the article shows the portal content available to an Owner or Contributor.

Control plane roles include the following:

* Owner
* Contributor (same as Owner, minus the ability to assign roles)
* Reader (access to service information and the Monitoring tab)

If you want a combination of control plane and data plane permissions, consider Search Service Contributor. For more information, see [Built-in roles](search-security-rbac.md#built-in-roles-used-in-search).

> [!TIP]
> By default, any Owner or Co-owner can create or delete services. To prevent accidental deletions, you can  [lock resources](../azure-resource-manager/management/lock-resources.md).

## Next steps

* Review [monitoring capabilities](monitor-azure-cognitive-search.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [resource logging](monitor-azure-cognitive-search.md) to monitor query and indexing workloads