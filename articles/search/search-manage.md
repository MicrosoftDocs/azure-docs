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
ms.date: 04/06/2021
---
# Service administration for Azure Cognitive Search in the Azure portal

> [!div class="op_single_selector"]
>
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](/rest/api/searchmanagement/)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Portal](search-manage.md)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

Azure Cognitive Search is a fully managed, cloud-based search service used for building a rich search experience into custom apps. This article covers the administration tasks that you can perform in the [Azure portal](https://portal.azure.com) for a search service that you've already created. The portal allows you to perform all [management tasks](#management-tasks) related to the service, as well as content management and exploration. As such, the portal provides broad spectrum access to all aspects of search service operations.

Each search service is managed as a standalone resource. The following image shows the portal pages for a single free search service called "demo-search-svc". Although you might be accustomed to using Azure PowerShell or Azure CLI for service management, it makes sense to become familiar with the tools and capabilities that the portal pages provide. Some tasks are just easier and faster to perform in the portal than through code. 

## Overview (home) page

The overview page is the "home" page of each service. Below, the areas on the screen enclosed in red boxes indicate tasks, tools, and tiles that you might use often, especially if you are new to the service.

:::image type="content" source="media/search-manage/search-portal-overview-page.png" alt-text="Portal pages for a search service" border="true":::

| Area | Description |
|------|-------------|
| 1  | The **Essentials** section shows you service properties including the endpoint used when setting up connections. It also shows you tier, replica, and partition counts at a glance. |
| 2 | At the top of the page are a series of commands for invoking interactive tools or managing the service. Both [Import data](search-get-started-portal.md) and [Search explorer](search-explorer.md) are commonly used for prototyping and exploration. |
| 3 | Below the **Essentials** section, are a series of tabbed subpages for quick access to usage statistics, service health metrics, and access to all of the existing indexes, indexers, data sources, and skillsets on your service. If you select an index or another object, additional pages become available to show object composition, settings, and status (if applicable). |
| 4 | To the left, you can access links that open additional pages for accessing API keys used on connections, configuring the service, configuring security, monitoring operations, automating tasks, and getting support. |

### Read-only service properties

Several aspects of a search service are determined when the service is provisioned and cannot be changed:

* Service name (you cannot rename a search service)
* Service location (you cannot easily move an intact search service to another region. Although there is a template, moving the content is a manual process)
* Service tier (you cannot switch from S1 to S2, for example, without creating a new service)

## Management tasks

Service administration is lightweight by design, and is often defined by the tasks you can perform relative to the service itself:

* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Manage API keys](search-security-api-keys.md) used for admin and query operations
* [Control access to admin operations](search-security-rbac.md) through role-based security
* [Configure IP firewall rules](service-configure-firewall.md) to restrict access by IP address
* [Configure a private endpoint](service-create-private-endpoint.md) using Azure Private Link and a private virtual network
* [Monitor service health](search-monitor-usage.md): storage, query volumes, and latency

You can also enumerate all of the objects created on the service: indexes, indexers, data sources, skillsets, and so forth. The portal's overview page shows you all of the content that exists on your service. The vast majority of operations on a search service are content-related.

The same management tasks performed in the portal can also be handled programmatically through the [Management REST APIs](/rest/api/searchmanagement/), [Az.Search PowerShell module](search-manage-powershell.md), [az search Azure CLI module](search-manage-azure-cli.md), and the Azure SDKs for .NET, Python, Java, and JavaScript. Administrative tasks are fully represented across portal and all programmatic interfaces. There is no specific administrative task that is available in only one modality.

Cognitive Search leverages other Azure services for deeper monitoring and management. By itself, the only data stored within the search service is object content (indexes, indexer and data source definitions, and other objects). Metrics reported out to portal pages are pulled from internal logs on a rolling 30-day cycle. For user-controlled log retention and additional events, you will need [Azure Monitor](../azure-monitor/index.yml). For more information about setting up diagnostic logging for a search service, see [Collect and analyze log data](search-monitor-logs.md).

## Administrator permissions

When you open the search service overview page, the permissions assigned to your account determine what pages are available to you. The overview page at the beginning of the article shows the portal pages an administrator or contributor will see.

In Azure resource, administrative rights are granted through role assignments. In the context of Azure Cognitive Search, [role assignments](search-security-rbac.md) will determine who can allocate replicas and partitions or manage API keys, regardless of whether they are using the portal, [PowerShell](search-manage-powershell.md), [Azure CLI](search-manage-azure-cli.md),or the [Management REST APIs](/rest/api/searchmanagement):

> [!TIP]
> Provisioning or decommissioning the service itself can be done by an Azure subscription administrator or co-administrator. Using Azure-wide mechanisms, you can lock a subscription or resource to prevent accidental or unauthorized deletion of your search service by users with admin rights. For more information, see [Lock resources to prevent unexpected deletion](../azure-resource-manager/management/lock-resources.md).

## Next steps

* Review [monitoring capabilities](search-monitor-usage.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [diagnostic logging](search-monitor-logs.md) to monitor query and indexing workloads