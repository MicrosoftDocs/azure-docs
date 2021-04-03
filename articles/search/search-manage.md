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

Azure Cognitive Search is a fully managed, cloud-based search service used for building a rich search experience into custom apps. This article covers the service administration tasks that you can perform in the [Azure portal](https://portal.azure.com) for a search service that you've already provisioned. 

Service administration is lightweight by design, scoped to the following tasks:

* [Monitor service health](search-monitor-usage.md): storage, query volumes, and latency
* [Manage API keys](search-security-api-keys.md) used for admin and query operations
* [Adjust capacity](search-capacity-planning.md) by adding or removing replicas and partitions
* [Control access](search-security-rbac.md) to admin operations through role-based security

The same tasks performed in the portal can also be handled programmatically through the [Management REST APIs](/rest/api/searchmanagement/) and [Az.Search PowerShell module](search-manage-powershell.md). Administrative tasks are fully represented across portal and programmatic interfaces. There is no specific administrative task that is available in only one modality.

Cognitive Search leverages other Azure services for deeper monitoring and management. By itself, the only data stored within the search service is object content (indexes, indexer and data source definitions, and other objects). Metrics reported out to portal pages are pulled from internal logs on a rolling 30-day cycle. For user-controlled log retention and additional events, you will need [Azure Monitor](../azure-monitor/index.yml). For more information about setting up diagnostic logging for a search service, see [Collect and analyze log data](search-monitor-logs.md).

## Read-only service properties

Several aspects of a search service are determined when the service is provisioned and cannot be changed later:

* Service name (you cannot rename a search service)
* Service location (you cannot easily move an intact search service to another region)
* Service tier (you cannot switch from S1 to S2, for example, without creating a new service)

## Administrator permissions

In Azure resource, administrative rights are granted through role assignments. In the context of Azure Cognitive Search, [role assignments](search-security-rbac.md) will determine who can allocate replicas and partitions or manage API keys, regardless of whether they are using the portal, [PowerShell](search-manage-powershell.md), [Azure CLI](search-manage-azure-cli.md),or the [Management REST APIs](/rest/api/searchmanagement/search-howto-management-rest-api):

> [!TIP]
> Provisioning or decommissioning the service itself can be done by an Azure subscription administrator or co-administrator. Using Azure-wide mechanisms, you can lock a subscription or resource to prevent accidental or unauthorized deletion of your search service by users with admin rights. For more information, see [Lock resources to prevent unexpected deletion](../azure-resource-manager/management/lock-resources.md).

## Disaster recovery and service outages

Although we can salvage your data, Azure Cognitive Search does not provide instant failover of the service if there is an outage at the cluster or data center level. If a cluster fails in the data center, the operations team will detect and work to restore service. You will experience downtime during service restoration, but you can request service credits to compensate for service unavailability per the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

If continuous service is required in the event of catastrophic failures outside of Microsoft’s control, you could [provision an additional service](search-create-service-portal.md) in a different region and implement a geo-replication strategy to ensure indexes are fully redundant across all services.

Customers who use [indexers](search-indexer-overview.md) to populate and refresh indexes can handle disaster recovery through geo-specific indexers leveraging the same data source. Two services in different regions, each running an indexer, could index the same data source to achieve geo-redundancy. If you are indexing from data sources that are also geo-redundant, be aware that Azure Cognitive Search indexers can only perform incremental indexing (merging updates from new, modified, or deleted documents) from primary replicas. In a failover event, be sure to re-point the indexer to the new primary replica. 

If you do not use indexers, you would use your application code to push objects and data to different search services in parallel. For more information, see [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md).

## Backup and restore alternatives

Because Azure Cognitive Search is not a primary data storage solution, Microsoft does not provide a formal mechanism for self-service backup and restore. However, you can use the **index-backup-restore** sample code in this [Azure Cognitive Search .NET sample repo](https://github.com/Azure-Samples/azure-search-dotnet-samples) to backup your index definition and snapshot to a series of JSON files, and then use these files to restore the index, if needed. This tool can also move indexes between service tiers.

Otherwise, your application code used for creating and populating an index is the de facto restore option if you delete an index by mistake. To rebuild an index, you would delete it (assuming it exists), recreate the index in the service, and reload by retrieving data from your primary data store.

## Next steps

* Review [monitoring capabilities](search-monitor-usage.md) available in the portal
* Automate with [PowerShell](search-manage-powershell.md) or [Azure CLI](search-manage-azure-cli.md)
* Review [security features](search-security-overview.md) to protect content and operations
* Enable [diagnostic logging](search-monitor-logs.md) to monitor query and indexing workloads