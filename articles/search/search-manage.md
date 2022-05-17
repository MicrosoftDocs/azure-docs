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
ms.date: 05/16/2022
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

Depending on your permission level, the portal supports [service administration tasks](#management-tasks), content management tasks, and content exploration. As such, the portal provides broad spectrum access to all aspects of search service operations.

Each search service is managed as a standalone resource. The following sections show the portal pages for a single free search service called "demo-search-svc".

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
* Service location (although there are ARM and bicep templates for service deployment, moving content is a manual process)
* Service tier (switch tiers requires creating a new service or filing a support ticket)

## Management tasks

Service administration includes the following tasks:

* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Manage API keys](search-security-api-keys.md) used for admin and query operations
* [Control access to admin operations](search-security-rbac.md) through role-based security
* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network
* [Monitor service health and operations](monitor-azure-cognitive-search.md): storage, query volumes, and latency

There is feature parity across all modalities and languages, with the exception of preview management features. Most preview management features are released through the Management REST API first. Programmatic support for service administration can be found in the following APIs and modules:

* [Management REST APIs](/rest/api/searchmanagement/)
* [Az.Search PowerShell module](search-manage-powershell.md)
* [az search Azure CLI module](search-manage-azure-cli.md)

You can also use the management client libraries in the Azure SDKs for .NET, Python, Java, and JavaScript. 

## Data collection

Cognitive Search leverages other Azure services for deeper monitoring and management. By itself, the only data stored within the search service is object content (indexes, indexer and data source definitions, and other objects). Metrics reported out to portal pages are pulled from internal logs on a rolling 30-day cycle. For user-controlled log retention and additional events, you will need [Azure Monitor](../azure-monitor/index.yml). For more information about setting up diagnostic logging for a search service, see [Collect and analyze log data](monitor-azure-cognitive-search.md).

## Administrator permissions

When you open the search service overview page, the permissions assigned to your account determine what pages are available to you. The overview page at the beginning of the article shows the portal pages an administrator or contributor will see.

In Azure resource, administrative rights are granted through role assignments. In the context of Azure Cognitive Search, [role assignments](search-security-rbac.md) will determine who can allocate replicas and partitions or manage API keys, regardless of whether they are using the portal, [PowerShell](search-manage-powershell.md), [Azure CLI](search-manage-azure-cli.md),or the [Management REST APIs](/rest/api/searchmanagement):

> [!TIP]
> Provisioning or decommissioning the service itself can be done by an Azure subscription administrator or co-administrator. Using Azure-wide mechanisms, you can lock a subscription or resource to prevent accidental or unauthorized deletion of your search service by users with admin rights. For more information, see [Lock resources to prevent unexpected deletion](../azure-resource-manager/management/lock-resources.md).

## Next steps

* Review [monitoring capabilities](monitor-azure-cognitive-search.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [diagnostic logging](monitor-azure-cognitive-search.md) to monitor query and indexing workloads