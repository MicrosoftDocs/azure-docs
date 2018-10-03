---
title: Use Azure Storage Analytics to collect logs and metrics data | Microsoft Docs
description: Storage Analytics enables you to track metrics data for all storage services, and to collect logs for Blob, Queue, and Table storage.
services: storage
author: roygara
ms.service: storage
ms.devlang: dotnet
ms.topic: article
ms.date: 03/03/2017
ms.author: rogarana
ms.component: common
---
# Storage Analytics

Azure Storage Analytics performs logging and provides metrics data for a storage account. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

To use Storage Analytics, you must enable it individually for each service you want to monitor. You can enable it from the [Azure Portal](https://portal.azure.com). For details, see [Monitor a storage account in the Azure Portal](storage-monitor-storage-account.md). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the [Get Blob Service Properties](https://msdn.microsoft.com/library/hh452239.aspx), [Get Queue Service Properties](https://msdn.microsoft.com/library/hh452243.aspx), [Get Table Service Properties](https://msdn.microsoft.com/library/hh452238.aspx), and [Get File Service Properties](https://msdn.microsoft.com/library/mt427369.aspx) operations to enable Storage Analytics for each service.

The aggregated data is stored in a well-known blob (for logging) and in well-known tables (for metrics), which may be accessed using the Blob service and Table service APIs.

Storage Analytics has a 20 TB limit on the amount of stored data that is independent of the total limit for your storage account. For more information about billing and data retention policies, see [Storage Analytics and Billing](https://msdn.microsoft.com/library/hh360997.aspx). For more information about storage account limits, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md).

## About Storage Analytics logging
Storage Analytics logs detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

Log entries are created only if there is storage service activity. For example, if a storage account has activity in its Blob service but not in its Table or Queue services, only logs pertaining to the Blob service will be created.

Storage Analytics Logging is not available for Azure Files.

### Logging authenticated requests
The following types of authenticated requests are logged:

* Successful requests.
* Failed requests, including timeout, throttling, network, authorization, and other errors.
* Requests using a Shared Access Signature (SAS), including failed and successful requests.
* Requests to analytics data.

Requests made by Storage Analytics itself, such as log creation or deletion, are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/library/hh343260.aspx) and [Storage Analytics Log Format](https://msdn.microsoft.com/library/hh343259.aspx) topics.

### Logging anonymous requests
The following types of anonymous requests are logged:

* Successful requests.
* Server errors.
* Timeout errors for both client and server.
* Failed GET requests with error code 304 (Not Modified).

All other failed anonymous requests are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/library/hh343260.aspx) and [Storage Analytics Log Format](https://msdn.microsoft.com/library/hh343259.aspx) topics.

### How logs are stored
All logs are stored in block blobs in a container named $logs, which is automatically created when Storage Analytics is enabled for a storage account. The $logs container is located in the blob namespace of the storage account, for example: `http://<accountname>.blob.core.windows.net/$logs`. This container cannot be deleted once Storage Analytics has been enabled, though its contents can be deleted.

> [!NOTE]
> The $logs container is not displayed when a container listing operation is performed, such as the [ListContainers](https://msdn.microsoft.com/library/azure/dd179352.aspx) method. It must be accessed directly. For example, you can use the [ListBlobs](https://msdn.microsoft.com/library/azure/dd135734.aspx) method to access the blobs in the `$logs` container.
> As requests are logged, Storage Analytics will upload intermediate results as blocks. Periodically, Storage Analytics will commit these blocks and make them available as a blob.
> 
> 

Duplicate records may exist for logs created in the same hour. You can determine if a record is a duplicate by checking the **RequestId** and **Operation** number.

### Log naming conventions
Each log will be written in the following format.

    <service-name>/YYYY/MM/DD/hhmm/<counter>.log

The following table describes each attribute in the log name.

| Attribute | Description |
| --- | --- |
| <service-name> |The name of the storage service. For example: blob, table, or queue. |
| YYYY |The four-digit year for the log. For example: 2011. |
| MM |The two-digit month for the log. For example: 07. |
| DD |The two-digit month for the log. For example: 07. |
| hh |The two-digit hour that indicates the starting hour for the logs, in 24-hour UTC format. For example: 18. |
| mm |The two-digit number that indicates the starting minute for the logs. This value is unsupported in the current version of Storage Analytics, and its value will always be 00. |
| <counter> |A zero-based counter with six digits that indicates the number of log blobs generated for the storage service in an hour time period. This counter starts at 000000. For example: 000001. |

The following is a complete sample log name that combines the previous examples.

    blob/2011/07/31/1800/000001.log

The following is a sample URI that can be used to access the previous log.

    https://<accountname>.blob.core.windows.net/$logs/blob/2011/07/31/1800/000001.log

When a storage request is logged, the resulting log name correlates to the hour when the requested operation completed. For example, if a GetBlob request was completed at 6:30 P.M. on 7/31/2011, the log would be written with the following prefix: `blob/2011/07/31/1800/`

### Log metadata
All log blobs are stored with metadata that can be used to identify what logging data the blob contains. The following table describes each metadata attribute.

| Attribute | Description |
| --- | --- |
| LogType |Describes whether the log contains information pertaining to read, write, or delete operations. This value can include one type or a combination of all three, separated by commas. Example 1: write; Example 2: read,write; Example 3: read,write,delete. |
| StartTime |The earliest time of an entry in the log, in the form of YYYY-MM-DDThh:mm:ssZ. For example: 2011-07-31T18:21:46Z. |
| EndTime |The latest time of an entry in the log, in the form of YYYY-MM-DDThh:mm:ssZ. For example: 2011-07-31T18:22:09Z. |
| LogVersion |The version of the log format. Currently the only supported value is 1.0. |

The following list displays complete sample metadata using the previous examples.

* LogType=write
* StartTime=2011-07-31T18:21:46Z
* EndTime=2011-07-31T18:22:09Z
* LogVersion=1.0

### Accessing logging data
All data in the `$logs` container can be accessed by using the Blob service APIs, including the .NET APIs provided by the Azure managed library. The storage account administrator can read and delete logs, but cannot create or update them. Both the log's metadata and log name can be used when querying for a log. It is possible for a given hour's logs to appear out of order, but the metadata always specifies the timespan of log entries in a log. Therefore, you can use a combination of log names and metadata when searching for a particular log.

## About Storage Analytics metrics
Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to a storage service. Transactions are reported at both the API operation level as well as at the storage service level, and capacity is reported at the storage service level. Metrics data can be used to analyze storage service usage, diagnose issues with requests made against the storage service, and to improve the performance of applications that use a service.

To use Storage Analytics, you must enable it individually for each service you want to monitor. You can enable it from the [Azure Portal](https://portal.azure.com). For details, see [Monitor a storage account in the Azure Portal](storage-monitor-storage-account.md). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the **Get Service Properties** operations to enable Storage Analytics for each service.

### Transaction metrics
A robust set of data is recorded at hourly or minute intervals for each storage service and requested API operation, including ingress/egress, availability, errors, and categorized request percentages. You can see a complete list of the transaction details in the [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/hh343264.aspx) topic.

Transaction data is recorded at two levels – the service level and the API operation level. At the service level, statistics summarizing all requested API operations are written to a table entity every hour even if no requests were made to the service. At the API operation level, statistics are only written to an entity if the operation was requested within that hour.

For example, if you perform a **GetBlob** operation on your Blob service, Storage Analytics Metrics will log the request and include it in the aggregated data for both the Blob service as well as the **GetBlob** operation. However, if no **GetBlob** operation is requested during the hour, an entity will not be written to the `$MetricsTransactionsBlob` for that operation.

Transaction metrics are recorded for both user requests and requests made by Storage Analytics itself. For example, requests by Storage Analytics to write logs and table entities are recorded. For more information about how these requests are billed, see [Storage Analytics and Billing](https://msdn.microsoft.com/library/hh360997.aspx).

### Capacity metrics
> [!NOTE]
> Currently, capacity metrics are only available for the Blob service. Capacity metrics for the Table service and Queue service will be available in future versions of Storage Analytics.
> 
> 

Capacity data is recorded daily for a storage account's Blob service, and two table entities are written. One entity provides statistics for user data, and the other provides statistics about the `$logs` blob container used by Storage Analytics. The `$MetricsCapacityBlob` table includes the following statistics:

* **Capacity**: The amount of storage used by the storage account's Blob service, in bytes.
* **ContainerCount**: The number of blob containers in the storage account's Blob service.
* **ObjectCount**: The number of committed and uncommitted block or page blobs in the storage account's Blob service.

For more information about the capacity metrics, see [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/hh343264.aspx).

### How metrics are stored
All metrics data for each of the storage services is stored in three tables reserved for that service: one table for transaction information, one table for minute transaction information, and another table for capacity information. Transaction and minute transaction information consists of request and response data, and capacity information consists of storage usage data. Hour metrics, minute metrics, and capacity for a storage account's Blob service can be accessed in tables that are named as described in the following table.

| Metrics level | Table names | Supported versions |
| --- | --- | --- |
| Hourly metrics, primary location |$MetricsTransactionsBlob <br/>$MetricsTransactionsTable <br/> $MetricsTransactionsQueue |Versions prior to 2013-08-15 only. While these names are still supported, it's recommended that you switch to using the tables listed below. |
| Hourly metrics, primary location |$MetricsHourPrimaryTransactionsBlob <br/>$MetricsHourPrimaryTransactionsTable <br/>$MetricsHourPrimaryTransactionsQueue |All versions, including 2013-08-15. |
| Minute metrics, primary location |$MetricsMinutePrimaryTransactionsBlob <br/>$MetricsMinutePrimaryTransactionsTable <br/>$MetricsMinutePrimaryTransactionsQueue |All versions, including 2013-08-15. |
| Hourly metrics, secondary location |$MetricsHourSecondaryTransactionsBlob <br/>$MetricsHourSecondaryTransactionsTable <br/>$MetricsHourSecondaryTransactionsQueue |All versions, including 2013-08-15. Read-access geo-redundant replication must be enabled. |
| Minute metrics, secondary location |$MetricsMinuteSecondaryTransactionsBlob <br/>$MetricsMinuteSecondaryTransactionsTable <br/>$MetricsMinuteSecondaryTransactionsQueue |All versions, including 2013-08-15. Read-access geo-redundant replication must be enabled. |
| Capacity (Blob service only) |$MetricsCapacityBlob |All versions, including 2013-08-15. |

These tables are automatically created when Storage Analytics is enabled for a storage account. They are accessed via the namespace of the storage account, for example: `https://<accountname>.table.core.windows.net/Tables("$MetricsTransactionsBlob")`

### Accessing metrics data
All data in the metrics tables can be accessed by using the Table service APIs, including the .NET APIs provided by the Azure managed library. The storage account administrator can read and delete table entities, but cannot create or update them.

## Billing for Storage Analytics
All metrics data is written by the services of a storage account. As a result, each write operation performed by Storage Analytics is billable. Additionally, the amount of storage used by metrics data is also billable.

The following actions performed by Storage Analytics are billable:

* Requests to create blobs for logging. 
* Requests to create table entities for metrics.

If you have configured a data retention policy, you are not charged for delete transactions when Storage Analytics deletes old logging and metrics data. However, delete transactions from a client are billable. For more information about retention policies, see [Setting a Storage Analytics Data Retention Policy](https://msdn.microsoft.com/library/azure/hh343263.aspx).

### Understanding billable requests
Every request made to an account's storage service is either billable or non-billable. Storage Analytics logs each individual request made to a service, including a status message that indicates how the request was handled. Similarly, Storage Analytics stores metrics for both a service and the API operations of that service, including the percentages and count of certain status messages. Together, these features can help you analyze your billable requests, make improvements on your application, and diagnose issues with requests to your services. For more information about billing, see [Understanding Azure Storage Billing - Bandwidth, Transactions, and Capacity](http://blogs.msdn.com/b/windowsazurestorage/archive/2010/07/09/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity.aspx).

When looking at Storage Analytics data, you can use the tables in the [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/library/azure/hh343260.aspx) topic to determine what requests are billable. Then you can compare your logs and metrics data to the status messages to see if you were charged for a particular request. You can also use the tables in the previous topic to investigate availability for a storage service or individual API operation.

## Next steps
### Setting up Storage Analytics
* [Monitor a storage account in the Azure Portal](storage-monitor-storage-account.md)
* [Enabling and Configuring Storage Analytics](https://msdn.microsoft.com/library/hh360996.aspx)

### Storage Analytics logging
* [About Storage Analytics Logging](https://msdn.microsoft.com/library/hh343262.aspx)
* [Storage Analytics Log Format](https://msdn.microsoft.com/library/hh343259.aspx)
* [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/library/hh343260.aspx)

### Storage Analytics metrics
* [About Storage Analytics Metrics](https://msdn.microsoft.com/library/hh343258.aspx)
* [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/hh343264.aspx)
* [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/library/hh343260.aspx)  

