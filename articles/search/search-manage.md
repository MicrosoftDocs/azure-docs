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
ms.date: 12/21/2022
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

The overview page is the "home" page of each service. In the following screenshot, the areas on the screen enclosed in red boxes indicate tasks, tools, and tiles that you might use often, especially if you're new to the service.

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

<sup>2</sup> Switching a tier requires creating a new service or filing a support ticket to request a tier upgrade.

## Management tasks

Service administration includes the following tasks:

* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Rotate API keys](search-security-api-keys.md) used for admin and query operations
* [Control access to admin operations](search-security-rbac.md) through role-based security
* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network
* [Monitor service health and operations](monitor-azure-cognitive-search.md): storage, query volumes, and latency

There's feature parity across all modalities and languages except for preview management features. In general, preview management features are released through the Management REST API first. Programmatic support for service administration can be found in the following APIs and modules:

* [Management REST API reference](/rest/api/searchmanagement/)
* [Az.Search PowerShell module](search-manage-powershell.md)
* [az search Azure CLI module](search-manage-azure-cli.md)

You can also use the management client libraries in the Azure SDKs for .NET, Python, Java, and JavaScript. 

## Data collection and retention

Cognitive Search uses other Azure services for deeper monitoring and management. On the search service itself, the only saved customer data are the structures that support indexing, enrichment, and queries. These data structures include indexes, indexers, data sources, skillsets, and synonym maps. All other saved customer data, including debug session state and caching, is stored in Azure Storage.

Usage metrics (such as query latency and queries per second) are reported out to portal pages are pulled from internal logs on a rolling 30-day cycle. These metrics are collected and reported to the portal pages automatically as part of the portal experience. 

If your monitoring and diagnostic requirements exceed what the portal provides, you can add [Azure Monitor](../azure-monitor/index.yml) and adopt a supported approach for retaining log data. For more information about setting up resource logging for a search service, see [Collect and analyze log data](monitor-azure-cognitive-search.md).

Internally, Azure Cognitive Search retains telemetry for a longer period (more than 30 days) so that support engineers can troubleshoot problems on your service. The data retention period for telemetry is one and a half years. During that period, support engineers might access and reference this data under these scenarios:

* Diagnose an issue, improve a feature, or fix a bug.
* Proactively suggest to the original customer a workaround or alternative to a problem detected by Microsoft Support.

You can [file a support ticket](/azure/azure-portal/supportability/how-to-create-azure-support-request) to remove object names from the telemetry logs or to shorten the retention period. Specify the following categories when filing this request:

+ **Issue type**: Technical
+ **Problem type**: Setup and configuration
+ **Problem subtype**: Issue with security configuration of the service

## Administrator permissions

When you open the search service overview page, the Azure role assigned to your account determines what portal content is available to you. The overview page at the beginning of the article shows the portal content available to an Owner or Contributor.

Control plane roles include the following items:

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