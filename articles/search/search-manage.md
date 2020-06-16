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
ms.date: 11/04/2019
---
# Service administration for Azure Cognitive Search in the Azure portal
> [!div class="op_single_selector"]
> * [PowerShell](search-manage-powershell.md)
> * [REST API](https://docs.microsoft.com/rest/api/searchmanagement/)
> * [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.search)
> * [Portal](search-manage.md)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

Azure Cognitive Search is a fully managed, cloud-based search service used for building a rich search experience into custom apps. This article covers the service administration tasks that you can perform in the [Azure portal](https://portal.azure.com) for a search service that you've already provisioned. Service administration is lightweight by design, limited to the following tasks:

> [!div class="checklist"]
> * Manage access to the *api-keys* used for read or write access to your service.
> * Adjust service capacity by changing the allocation of partitions and replicas.
> * Monitor resource usage, relative to maximum limits of your service tier.

Notice that *upgrade* is not listed as an administrative task. Because resources are allocated when the service is provisioned, moving to a different tier requires a new service. For details, see [Create an Azure Cognitive Search service](search-create-service-portal.md).

You can monitor query volume and other metrics, and use those insights to adjust your service for faster response times. For more information, see [Monitor usage and query metrics](search-monitor-usage.md) and [Performance and optimization](search-performance-optimization.md).

<a id="admin-rights"></a>

## Administrator rights
Provisioning or decommissioning the service itself can be done by an Azure subscription administrator or co-administrator.

Within a service, anyone with access to the service URL and an admin api-key has read-write access to the service. Read-write access provides the ability to add, delete, or modify server objects, including api-keys, indexes, indexers, data sources, schedules, and role assignments as implemented through [RBAC-defined roles](search-security-rbac.md).

All user interaction with Azure Cognitive Search falls within one of these modes: read-write access to the service (administrator rights), or read-only access to the service (query rights). For more information, see [Manage the api-keys](search-security-api-keys.md).

<a id="sys-info"></a>

## Logging and system information
Azure Cognitive Search does not expose log files for an individual service either through the portal or programmatic interfaces. At the Basic tier and above, Microsoft monitors all Azure Cognitive Search services for 99.9% availability per service level agreements (SLA). If the service is slow or request throughput falls below SLA thresholds, support teams review the log files available to them and address the issue.

In terms of general information about your service, you can obtain information in the following ways:

* In the portal, on the service dashboard, through notifications, properties, and status messages.
* Using [PowerShell](search-manage-powershell.md) or the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/) to [get service properties](https://docs.microsoft.com/rest/api/searchmanagement/services), or status on index resource usage.


<a id="sub-5"></a>

## Monitor resource usage
In the dashboard, resource monitoring is limited to the information shown in the service dashboard and a few metrics that you can obtain by querying the service. On the service dashboard, in the Usage section, you can quickly determine whether partition resource levels are adequate for your application. You can provision external resources, such as Azure monitoring, if you want to capture and persist logged events. For more information, see [Monitoring Azure Cognitive Search](search-monitor-usage.md).

Using the search service REST API, you can get a count on documents and indexes programmatically: 

* [Get Index Statistics](https://docs.microsoft.com/rest/api/searchservice/Get-Index-Statistics)
* [Count Documents](https://docs.microsoft.com/rest/api/searchservice/count-documents)

## Disaster recovery and service outages

Although we can salvage your data, Azure Cognitive Search does not provide instant failover of the service if there is an outage at the cluster or data center level. If a cluster fails in the data center, the operations team will detect and work to restore service. You will experience downtime during service restoration, but you can request service credits to compensate for service unavailability per the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

If continuous service is required in the event of catastrophic failures outside of Microsoft’s control, you could [provision an additional service](search-create-service-portal.md) in a different region and implement a geo-replication strategy to ensure indexes are fully redundant across all services.

Customers who use [indexers](search-indexer-overview.md) to populate and refresh indexes can handle disaster recovery through geo-specific indexers leveraging the same data source. Two services in different regions, each running an indexer, could index the same data source to achieve geo-redundancy. If you are indexing from data sources that are also geo-redundant, be aware that Azure Cognitive Search indexers can only perform incremental indexing (merging updates from new, modified, or deleted documents) from primary replicas. In a failover event, be sure to re-point the indexer to the new primary replica. 

If you do not use indexers, you would use your application code to push objects and data to different search services in parallel. For more information, see [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md).

## Backup and restore

Because Azure Cognitive Search is not a primary data storage solution, we do not provide a formal mechanism for self-service backup and restore. However, you can use the **index-backup-restore** sample code in this [Azure Cognitive Search .NET sample repo](https://github.com/Azure-Samples/azure-search-dotnet-samples) to backup your index definition and snapshot to a series of JSON files, and then use these files to restore the index, if needed. This tool can also move indexes between service tiers.

Otherwise, your application code used for creating and populating an index is the de facto restore option if you delete an index by mistake. To rebuild an index, you would delete it (assuming it exists), recreate the index in the service, and reload by retrieving data from your primary data store.

<a id="scale"></a>

## Scale up or down
Every search service starts with a minimum of one replica and one partition. If you signed up for a [tier that provides dedicated resources](search-limits-quotas-capacity.md), click the **SCALE** tile in the service dashboard to adjust resource usage.

When you add capacity through either resource, the service uses them automatically. No further action is required on your part, but there is a slight delay before the impact of the new resource is realized. It can take 15 minutes or more to provision additional resources.

 ![][10]

### Add replicas
Increasing queries per second (QPS) or achieving high availability is done by adding replicas. Each replica has one copy of an index, so adding one more replica translates to one more index available for handling service query requests. A minimum of 3 replicas are required for high availability (see [Capacity Planning](search-capacity-planning.md) for details).

A search service having more replicas can load balance query requests over a larger number of indexes. Given a level of query volume, query throughput is going to be faster when there are more copies of the index available to service the request. If you are experiencing query latency, you can expect a positive impact on performance once the additional replicas are online.

Although query throughput goes up as you add replicas, it does not precisely double or triple as you add replicas to your service. All search applications are subject to external factors that can impinge on query performance. Complex queries and network latency are two factors that contribute to variations in query response times.

### Add partitions
It's more common to add replicas, but when storage is constrained, you can add partitions to get more capacity. The tier at which you provisioned the service determines whether partitions can be added. The Basic tier is locked at one partition. Standard tiers and above support additional partitions.

Partitions are added in multiples of 12 (specifically, 1, 2, 3, 4, 6, or 12). This is an artifact of sharding. An index is created in 12 shards, which can all be stored on 1 partition or equally divided into 2, 3, 4, 6, or 12 partitions (one shard per partition).

### Remove replicas
After periods of high query volumes, you can use the slider to reduce replicas after search query loads have normalized (for example, after holiday sales are over). There are no further steps required on your part. Lowering the replica count relinquishes virtual machines in the data center. Your query and data ingestion operations will now run on fewer VMs than before. The minimum requirement is one replica.

### Remove partitions
In contrast with removing replicas, which requires no extra effort on your part, you might have some work to do if you are using more storage than can be reduced. For example, if your solution is using three partitions, downsizing to one or two partitions will generate an error if the new storage space is less than required for hosting your index. As you might expect, your choices are to delete indexes or documents within an associated index to free up space, or keep the current configuration.

There is no detection method that tells you which index shards are stored on specific partitions. Each partition provides approximately 25 GB in storage, so you will need to reduce storage to a size that can be accommodated by the number of partitions you have. If you want to revert to one partition, all 12 shards will need to fit.

To help with future planning, you might want to check storage (using [Get Index Statistics](https://docs.microsoft.com/rest/api/searchservice/Get-Index-Statistics)) to see how much you actually used. 

<a id="next-steps"></a>

## Next steps
Once you understand the concepts behind service administration, consider using [PowerShell](search-manage-powershell.md) to automate tasks.

We also recommend reviewing the [performance and optimization article](search-performance-optimization.md).

<!--Image references-->
[10]: ./media/search-manage/Azure-Search-Manage-3-ScaleUp.png



