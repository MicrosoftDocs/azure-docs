---
title: Service administration for Azure Search in the portal - Azure Search
description: Manage an Azure Search service, a hosted cloud search service on Microsoft Azure, using the Azure portal.
author: HeidiSteen
manager: cgronlun
tags: azure-portal
services: search
ms.service: search
ms.topic: conceptual
ms.date: 03/08/2019
ms.author: heidist
ms.custom: seodec2018
---
# Service administration for Azure Search in the Azure portal
> [!div class="op_single_selector"]
> * [PowerShell](search-manage-powershell.md)
> * [REST API](https://docs.microsoft.com/rest/api/searchmanagement/)
> * [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.search)
> * [Portal](search-manage.md)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

Azure Search is a fully managed, cloud-based search service used for building a rich search experience into custom apps. This article covers the service administration tasks that you can perform in the [Azure portal](https://portal.azure.com) for a search service that you've already provisioned. Service administration is lightweight by design, limited to the following tasks:

> [!div class="checklist"]
> * Manage access to the *api-keys* used for read or write access to your service.
> * Adjust service capacity by changing the allocation of partitions and replicas.
> * Monitor resource usage, relative to maximum limits of your service tier.

Notice that *upgrade* is not listed as an administrative task. Because resources are allocated when the service is provisioned, moving to a different tier requires a new service. For details, see [Create an Azure Search service](search-create-service-portal.md).

> [!Tip]
> Looking for help on how to analyze search traffic or query performance? You can monitor query volume, which terms people search for, and how successful search results are in guiding customers to specific documents in your index. For more information, see [Search Traffic Analytics for Azure Search](search-traffic-analytics.md), [Monitor usage and query metrics](search-monitor-usage.md), and [Performance and optimization](search-performance-optimization.md).

<a id="admin-rights"></a>

## Administrator rights
Provisioning or decommissioning the service itself can be done by an Azure subscription administrator or co-administrator.

Within a service, anyone with access to the service URL and an admin api-key has read-write access to the service. Read-write access provides the ability to add, delete, or modify server objects, including api-keys, indexes, indexers, data sources, schedules, and role assignments as implemented through [RBAC-defined roles](search-security-rbac.md).

All user interaction with Azure Search falls within one of these modes: read-write access to the service (administrator rights), or read-only access to the service (query rights). For more information, see [Manage the api-keys](search-security-api-keys.md).

<a id="sys-info"></a>

## Logging and system information
Azure Search does not expose log files for an individual service either through the portal or programmatic interfaces. At the Basic tier and above, Microsoft monitors all Azure Search services for 99.9% availability per service level agreements (SLA). If the service is slow or request throughput falls below SLA thresholds, support teams review the log files available to them and address the issue.

In terms of general information about your service, you can obtain information in the following ways:

* In the portal, on the service dashboard, through notifications, properties, and status messages.
* Using [PowerShell](search-manage-powershell.md) or the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/) to [get service properties](https://docs.microsoft.com/rest/api/searchmanagement/services), or status on index resource usage.
* Via [search traffic analytics](search-traffic-analytics.md), as noted previously.

<a id="sub-5"></a>

## Monitor resource usage
In the dashboard, resource monitoring is limited to the information shown in the service dashboard and a few metrics that you can obtain by querying the service. On the service dashboard, in the Usage section, you can quickly determine whether partition resource levels are adequate for your application. You can provision external resources, such as Azure monitoring, if you want to capture and persist logged events. For more information, see [Monitoring Azure Search](search-monitor-usage.md).

Using the Search Service REST API, you can get a count on documents and indexes programmatically: 

* [Get Index Statistics](https://docs.microsoft.com/rest/api/searchservice/Get-Index-Statistics)
* [Count Documents](https://docs.microsoft.com/rest/api/searchservice/count-documents)

## Disaster recovery and service outages

Although we can salvage your data, Azure Search does not provide instant failover of the service if there is an outage at the cluster or data center level. If a cluster fails in the data center, the operations team will detect and work to restore service. You will experience downtime during service restoration, but you can request service credits to compensate for service unavailability per the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

If continuous service is required in the event of catastrophic failures outside of Microsoft’s control, you could [provision an additional service](search-create-service-portal.md) in a different region and implement a geo-replication strategy to ensure indexes are fully redundant across all services.

Customers who use [indexers](search-indexer-overview.md) to populate and refresh indexes can handle disaster recovery through geo-specific indexers leveraging the same data source. Two services in different regions, each running an indexer, could index the same data source to achieve geo-redundancy. If you are indexing from data sources that are also geo-redundant, be aware that Azure Search indexers can only perform incremental indexing from primary replicas. In a failover event, be sure to re-point the indexer to the new primary replica. 

If you do not use indexers, you would use your application code to push objects and data to different search services in parallel. For more information, see [Performance and optimization in Azure Search](search-performance-optimization.md).

## Backup and restore

Because Azure Search is not a primary data storage solution, we do not provide a formal mechanism for self-service backup and restore. Your application code used for creating and populating an index is the de facto restore option if you delete an index by mistake. 

To rebuild an index, you would delete it (assuming it exists), recreate the index in the service, and reload by retrieving data from your primary data store.


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
Most service applications have a built-in need for more replicas rather than partitions. For those cases where an increased document count is required, you can add partitions if you signed up for Standard service. Basic tier does not provide for additional partitions.

At the Standard tier, partitions are added in multiples of 12 (specifically, 1, 2, 3, 4, 6, or 12). This is an artifact of sharding. An index is created in 12 shards, which can all be stored on 1 partition or equally divided into 2, 3, 4, 6, or 12 partitions (one shard per partition).

### Remove replicas
After periods of high query volumes, you can use the slider to reduce replicas after search query loads have normalized (for example, after holiday sales are over). There are no further steps required on your part. Lowering the replica count relinquishes virtual machines in the data center. Your query and data ingestion operations will now run on fewer VMs than before. The minimum requirement is one replica.

### Remove partitions
In contrast with removing replicas, which requires no extra effort on your part, you might have some work to do if you are using more storage than can be reduced. For example, if your solution is using three partitions, downsizing to one or two partitions will generate an error if the new storage space is less than required for hosting your index. As you might expect, your choices are to delete indexes or documents within an associated index to free up space, or keep the current configuration.

There is no detection method that tells you which index shards are stored on specific partitions. Each partition provides approximately 25 GB in storage, so you will need to reduce storage to a size that can be accommodated by the number of partitions you have. If you want to revert to one partition, all 12 shards will need to fit.

To help with future planning, you might want to check storage (using [Get Index Statistics](https://docs.microsoft.com/rest/api/searchservice/Get-Index-Statistics)) to see how much you actually used. 

<a id="advanced-deployment"></a>

## Best practices on scale and deployment
This 30-minute video reviews best practices for advanced deployment scenarios, including geo-distributed workloads. You can also see [Performance and optimization in Azure Search](search-performance-optimization.md) for help pages that cover the same points.

> [!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON319/player]
> 
> 

<a id="next-steps"></a>

## Next steps
Once you understand the concepts behind service administration, consider using [PowerShell](search-manage-powershell.md) to automate tasks.

We also recommend reviewing the [performance and optimization article](search-performance-optimization.md).

Another recommendation is to watch the video noted in the previous section. It provides deeper coverage of the techniques mentioned in this section.

<!--Image references-->
[10]: ./media/search-manage/Azure-Search-Manage-3-ScaleUp.png



