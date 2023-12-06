---
title: Monitoring Azure Operator Insights data reference #Required; *your official service name*  
description: Important reference material needed when you monitor Azure Operator Insights 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.topic: reference
ms.service: operator-insights
ms.custom: horz-monitor
ms.date: 12/15/2023
---
<!-- VERSION 2.3
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring Azure Operator Insights" article for the service. -->

# Monitoring Azure Operator Insights data reference

See [Monitoring Azure Operator Insights](monitor-operator-insights.md) for details on collecting and analyzing monitoring data for Azure Operator Insights.

## Metrics

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
> Please keep headings in this order.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> 2 options here depending on the level of extra content you have. -->

------------**OPTION 1 EXAMPLE** ---------------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.
>
> Example format. There should be AT LEAST one Resource Provider/Resource Type here.

This section lists all the automatically collected platform metrics collected for Azure Operator Insights.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machine | [Microsoft.Compute/virtualMachine](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachinescaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescaleset) 



--------------**OPTION 2 EXAMPLE** -------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](https://learn.microsoft.com/azure/cosmos-db/monitor-cosmos-db-reference#metrics). They even regroup the metrics into usage type vs. resource provider and type.
> 
> Example format. Mimic the setup of metrics supported, but add extra information -->

### Virtual Machine metrics

Resource Provider and Type: [Microsoft.Compute/virtualMachines](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines)

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |

### Virtual machine scale set metrics

Namespace- [Microsoft.Compute/virtualMachinesscaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescalesets) 

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |


> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
>  Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please  keep headings in this order -->
> If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).


Azure Operator Insights does not have any metrics that contain dimensions.

*OR*

Azure Operator Insights has the following dimensions associated with its metrics.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> See https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |

## Resource logs

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for Azure Operator Insights. 
Azure operator insights exposes 5 categories of logs for end users by name "Digestion", "Ingestion", "IngestionDelete", "ReadStorage" and "DatabaseQuery".

### Digestion
The audit log category for the digestion operation performed by dataproduct.

### Ingestion
The audit log category for any write operation performed on the input storage of a dataproduct.

### IngestionDelete
The audit log category for any delete operation performed on the input storage of a dataproduct.

### ReadStorage
The audit log category for any read operation performed on the output storage of a dataproduct.

### DatabaseQuery
The audit log category for any query operation performed on the database of a dataproduct.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

------------**OPTION 1 EXAMPLE** ---------------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the resource log category types collected for Azure Operator Insights.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

--------------**OPTION 2 EXAMPLE** -------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> Example format. Add extra information

### Web Sites

Resource Provider and Type: [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

### Web Site Slots

Resource Provider and Type: [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

--------------**END Examples** -------------

## Azure Monitor Logs tables

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Operator Insights and available for query by Log Analytics. 

### AOIDigestion
The audit log schema of the digestion by dataproduct is as follows

| Column | Type | Description |
|---|---|---|
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| Level | string | The level of the log |
| Message | string | The log message |
| FilePath | string | The path of the file that was digested |
| Datatype | string | The datatype of the file that was digested |

### AOIStorage
The audit log schema for the operations on the dataproduct's storage is as follows

| Column | Type | Description |
|---|---|---|
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| Location | string | The location of the resource |
| Category | string | The category or type of the log, it can be Ingestion for uploading of file to input storage or IngestionDelete for deleting of file from inut storage or ReadStorage for read operation on output storage |
| OperationName | string | The name of this operation |
| Etag | string | The ETag identifier for the returned object, in quotes |
| ServiceType | string | The service associated with this request |
| ObjectKey | string | Fully qualified path of the object in the storage |
| LastModifiedTime | datetime | The Last Modified Time (LMT) for the returned object. This field is empty for operations that can return multiple objects |
| MetricResponseType | string | Records the metric response for correlation between metrics and logs |
| ServerLatencyMs | Double | The total time expressed in milliseconds to perform the requested operation. This value doesn't include network latency (the time to read the incoming request and send the response to the requester) |
| RequestHeaderSize | long | The size of the request header expressed in bytes. If a request is unsuccessful, this value might be empty |
| ResponseHeaderSize | long | The size of the response header expressed in bytes. If a request is unsuccessful, this value might be empty |
| TlsVersion | string | The TLS version used in the connection of request |
| OperationVersion | string | The storage service version that was specified when the request was made |
| SchemaVersion | string | The schema version of the log |
| StatusCode | string | The HTTP status code for the request. If the request is interrupted, this value might be set to Unknown |
| StatusText | string | The status of the requested operation |
| DurationMs | Double | The total time, expressed in milliseconds, to perform the requested operation. This includes the time to read the incoming request, and to send the response to the requester |
| CallerIpAddress | string | The IP address of the requester, including the port number |
| CorrelationId | string | The ID that is used to correlate logs across resources |
| Uri | string | Uniform resource identifier that is requested |
| Protocol | string | The protocol that is used in the operation |
| AuthenticationType | string | The type of authentication that was used to make the request |
| AuthenticationHash | string | The hash of authentication token |
| RequesterObjectId | string | The OAuth object ID of the requester |
| RequesterTenantId | string | The OAuth tenant ID of identity |
| RequesterAppId | string | The Open Authorization (OAuth) application ID that is used as the requester |
| RequesterAudience | string | The OAuth audience of the request |
| RequesterTokenIssuer | string | The OAuth token issuer |
| RequesterUpn | string | The User Principal Names of requestor |
| AuthorizationDetails | json | Detailed policy information used to authorize the request |
| UserAgentHeader | string | The User-Agent header value, in quotes |
| ReferrerHeader | string | The Referer header value |
| ClientRequestId | string | The x-ms-client-request-id header value of the request |
| OperationCount | int | The number of each logged operation that is involved in the request. This count starts with an index of 0. Some requests require more than one operation, such as a request to copy a blob. Most requests perform only one operation |
| RequestBodySize | long | The size of the request packets, expressed in bytes, that are read by the storage service. If a request is unsuccessful, this value might be empty |
| ResponseBodySize | long | The size of the response packets written by the storage service, in bytes. If a request is unsuccessful, this value may be empty |
| RequestMd5 | string | The value of either the Content-MD5 header or the x-ms-content-md5 header in the request. The MD5 hash value specified in this field represents the content in the request |
| ResponseMd5 | string | The value of the MD5 hash calculated by the storage service |
| ConditionsUsed | string | A semicolon-separated list of key-value pairs that represent a condition |
| ContentLengthHeader | long | The value of the Content-Length header for the request sent to the storage service |
| SasExpiryStatus | string | Records any violations in the request SAS token as per the SAS policy set in the storage account |
| SourceUri | string | Records the source URI for operations |
| DestinationUri | string | Records the destination URI for operations |
| AccessTier | string | The access tier of the storage account |
| SourceAccessTier | string | The source tier of the storage account |
| RehydratePriority | string | The priority used to rehydrate an archived blob |

### AOIDatabaseQuery
The audit log schema for the queries run on dataproduct's database is as follows

| Column | Type | Description |
|---|---|---|
| Location | string | The location of the resource |
| ApplicationName | string | The name of the application that invoked the query |
| CacheDiskHits | long | Disk cache hits |
| CacheDiskMisses | long | Disk cache misses |
| CacheMemoryHits | long | Memory cache hits |
| CacheMemoryMisses | long | Memory cache misses |
| CacheShardsBypassBytes | long | Shards cache bypass bytes |
| CacheShardsColdHits | long | Shards cold cache hits |
| CacheShardsColdMisses | long | Shards cold cache misses |
| CacheShardsHotHits | long | Shards hot cache hits |
| CacheShardsHotMisses | long | Shards hot cache misses |
| CorrelationId | string | The client request ID |
| DatabaseName | string | The name of the database that the command ran on |
| DurationMs | Double | Command duration |
| MaxDataScannedTime | datetime | Maximum data scan time |
| MinDataScannedTime | datetime | Minimum data scan time |
| FailureReason | string | The failure reason |
| LastUpdatedOn | datetime | Time (UTC) at which this command ended |
| MemoryPeak | long | Memory peak |
| OperationName | string | The name of this operation |
| Principal | string | The principal that invoked the query |
| _ResourceId | string | A unique identifier for the resource that the record is associated with |
| RootActivityId | string | The root activity ID |
| ScannedExtentsCount | long | Scanned extents count |
| ScannedRowsCount | long | Scanned rows count |
| StartedOn | datetime | Time (UTC) at which this command started |
| State | string | The state the command ended with |
| TableCount | int | Table count |
| TablesStatistics | dynamic | Tables statistics |
| Text | string | The text of the invoked query |
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| TotalCPU | string | Total CPU duration |
| ComponentFault | string | The entity that caused the query to fail. For example, if the query result is too large, the ComponentFault will be 'Client'. If an internal error occured, it will be 'Server' |
| TotalExtentsCount | long | Total extents count |
| TotalRowsCount | long | Total rows count |
| User | string | The user that invoked the query |
| WorkloadGroup | string | The workload group the query was classified to |

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> Link to relevant bookmark in https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  

### Diagnostics tables

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please keep heading in this order
> 
> If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

Azure Operator Insights uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please keep heading in this order -->

The following table lists the operations that Azure Operator Insights may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> Fill in the table with the operations that can be created in the Activity log for the service by gathering the links for your namespaces or otherwise explaning what's available. For example, see the bookmark https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftbatch

| Namespace | Description |
|:---|:---|
| | |
| | |

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> NOTE: Any additional operations may be hard to find or not listed anywhere.  Please ask your PM for at least any additional list of what messages could be written to the activity log. You can contact azmondocs@microsoft.com for help if needed. -->

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTIONAL. Please keep heading in this order -->

The following schemas are in use by Azure Operator Insights
### Digestion
The audit log schema of the digestion by dataproduct is as follows

| Column | Type | Description |
|---|---|---|
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| Level | string | The level of the log |
| Message | string | The log message |
| FilePath | string | The path of the file that was digested |
| Datatype | string | The datatype of the file that was digested |

### Ingestion, IngestionDelete and ReadStorage
The audit log schema for the operations on the dataproduct's storage is as follows

| Column | Type | Description |
|---|---|---|
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| Location | string | The location of the resource |
| Category | string | The category or type of the log, it can be Ingestion for uploading of file to input storage or IngestionDelete for deleting of file from inut storage or ReadStorage for read operation on output storage |
| OperationName | string | The name of this operation |
| Etag | string | The ETag identifier for the returned object, in quotes |
| ServiceType | string | The service associated with this request |
| ObjectKey | string | Fully qualified path of the object in the storage |
| LastModifiedTime | datetime | The Last Modified Time (LMT) for the returned object. This field is empty for operations that can return multiple objects |
| MetricResponseType | string | Records the metric response for correlation between metrics and logs |
| ServerLatencyMs | Double | The total time expressed in milliseconds to perform the requested operation. This value doesn't include network latency (the time to read the incoming request and send the response to the requester) |
| RequestHeaderSize | long | The size of the request header expressed in bytes. If a request is unsuccessful, this value might be empty |
| ResponseHeaderSize | long | The size of the response header expressed in bytes. If a request is unsuccessful, this value might be empty |
| TlsVersion | string | The TLS version used in the connection of request |
| OperationVersion | string | The storage service version that was specified when the request was made |
| SchemaVersion | string | The schema version of the log |
| StatusCode | string | The HTTP status code for the request. If the request is interrupted, this value might be set to Unknown |
| StatusText | string | The status of the requested operation |
| DurationMs | Double | The total time, expressed in milliseconds, to perform the requested operation. This includes the time to read the incoming request, and to send the response to the requester |
| CallerIpAddress | string | The IP address of the requester, including the port number |
| CorrelationId | string | The ID that is used to correlate logs across resources |
| Uri | string | Uniform resource identifier that is requested |
| Protocol | string | The protocol that is used in the operation |
| AuthenticationType | string | The type of authentication that was used to make the request |
| AuthenticationHash | string | The hash of authentication token |
| RequesterObjectId | string | The OAuth object ID of the requester |
| RequesterTenantId | string | The OAuth tenant ID of identity |
| RequesterAppId | string | The Open Authorization (OAuth) application ID that is used as the requester |
| RequesterAudience | string | The OAuth audience of the request |
| RequesterTokenIssuer | string | The OAuth token issuer |
| RequesterUpn | string | The User Principal Names of requestor |
| AuthorizationDetails | json | Detailed policy information used to authorize the request |
| UserAgentHeader | string | The User-Agent header value, in quotes |
| ReferrerHeader | string | The Referer header value |
| ClientRequestId | string | The x-ms-client-request-id header value of the request |
| OperationCount | int | The number of each logged operation that is involved in the request. This count starts with an index of 0. Some requests require more than one operation, such as a request to copy a blob. Most requests perform only one operation |
| RequestBodySize | long | The size of the request packets, expressed in bytes, that are read by the storage service. If a request is unsuccessful, this value might be empty |
| ResponseBodySize | long | The size of the response packets written by the storage service, in bytes. If a request is unsuccessful, this value may be empty |
| RequestMd5 | string | The value of either the Content-MD5 header or the x-ms-content-md5 header in the request. The MD5 hash value specified in this field represents the content in the request |
| ResponseMd5 | string | The value of the MD5 hash calculated by the storage service |
| ConditionsUsed | string | A semicolon-separated list of key-value pairs that represent a condition |
| ContentLengthHeader | long | The value of the Content-Length header for the request sent to the storage service |
| SasExpiryStatus | string | Records any violations in the request SAS token as per the SAS policy set in the storage account |
| SourceUri | string | Records the source URI for operations |
| DestinationUri | string | Records the destination URI for operations |
| AccessTier | string | The access tier of the storage account |
| SourceAccessTier | string | The source tier of the storage account |
| RehydratePriority | string | The priority used to rehydrate an archived blob |

### DatabaseQuery
The audit log schema for the queries run on dataproduct's database is as follows

| Column | Type | Description |
|---|---|---|
| Location | string | The location of the resource |
| ApplicationName | string | The name of the application that invoked the query |
| CacheDiskHits | long | Disk cache hits |
| CacheDiskMisses | long | Disk cache misses |
| CacheMemoryHits | long | Memory cache hits |
| CacheMemoryMisses | long | Memory cache misses |
| CacheShardsBypassBytes | long | Shards cache bypass bytes |
| CacheShardsColdHits | long | Shards cold cache hits |
| CacheShardsColdMisses | long | Shards cold cache misses |
| CacheShardsHotHits | long | Shards hot cache hits |
| CacheShardsHotMisses | long | Shards hot cache misses |
| CorrelationId | string | The client request ID |
| DatabaseName | string | The name of the database that the command ran on |
| DurationMs | Double | Command duration |
| MaxDataScannedTime | datetime | Maximum data scan time |
| MinDataScannedTime | datetime | Minimum data scan time |
| FailureReason | string | The failure reason |
| LastUpdatedOn | datetime | Time (UTC) at which this command ended |
| MemoryPeak | long | Memory peak |
| OperationName | string | The name of this operation |
| Principal | string | The principal that invoked the query |
| _ResourceId | string | A unique identifier for the resource that the record is associated with |
| RootActivityId | string | The root activity ID |
| ScannedExtentsCount | long | Scanned extents count |
| ScannedRowsCount | long | Scanned rows count |
| StartedOn | datetime | Time (UTC) at which this command started |
| State | string | The state the command ended with |
| TableCount | int | Table count |
| TablesStatistics | dynamic | Tables statistics |
| Text | string | The text of the invoked query |
| TimeGenerated | datetime | The time (UTC) at which this event was generated |
| TotalCPU | string | Total CPU duration |
| ComponentFault | string | The entity that caused the query to fail. For example, if the query result is too large, the ComponentFault will be 'Client'. If an internal error occured, it will be 'Server' |
| TotalExtentsCount | long | Total extents count |
| TotalRowsCount | long | Total rows count |
| User | string | The user that invoked the query |
| WorkloadGroup | string | The workload group the query was classified to |

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. JSON messages, API responses not listed in the REST API docs and other similar types of info can be put here.

## See Also

- See [Monitoring Azure Azure Operator Insights](monitor-operator-insights.md) for a description of monitoring Azure Azure Operator Insights.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.