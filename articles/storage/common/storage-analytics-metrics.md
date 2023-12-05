---
title: "Azure Storage Analytics metrics (classic)"
description: Learn how to use Storage Analytics metrics in Azure Storage. Learn about transaction and capacity metrics, how metrics are stored, enabling metrics, and more.
author: normesta
ms.service: azure-storage
ms.topic: conceptual
ms.date: 01/29/2021
ms.author: normesta
ms.reviewer: fryu
ms.subservice: storage-common-concepts
ms.custom: "monitoring, devx-track-csharp"
---

# Azure Storage Analytics metrics (classic)

On **August 31, 2023** Storage Analytics metrics, also referred to as *classic metrics* will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-storage-classic-metrics-will-be-retired-on-31-august-2023/). If you use classic metrics, make sure to transition to metrics in Azure Monitor prior to that date. This article helps you make the transition.

Azure Storage uses the Storage Analytics solution to store metrics that include aggregated transaction statistics and capacity data about requests to a storage service. Transactions are reported at the API operation level and at the storage service level. Capacity is reported at the storage service level. Metrics data can be used to:
- Analyze storage service usage.
- Diagnose issues with requests made against the storage service.
- Improve the performance of applications that use a service.

 Storage Analytics metrics are enabled by default for new storage accounts. You can configure metrics in the [Azure portal](https://portal.azure.com/), by using PowerShell, or by using the Azure CLI. For step-by-step guidance, see [Enable and manage Azure Storage Analytic metrics (classic)](./manage-storage-analytics-logs.md). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Set Service Properties operations to enable Storage Analytics for each service.

> [!NOTE]
> Storage Analytics metrics are available for Azure Blob storage, Azure Queue storage, Azure Table storage, and Azure Files.
> Storage Analytics metrics are now classic metrics. We recommend that you use [storage metrics in Azure Monitor](../blobs/monitor-blob-storage.md) instead of Storage Analytics metrics.

## Transaction metrics

 A robust set of data is recorded at hourly or minute intervals for each storage service and requested API operation, which includes ingress and egress, availability, errors, and categorized request percentages. For a complete list of the transaction details, see [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema).

 Transaction data is recorded at the service level and the API operation level. At the service level, statistics that summarize all requested API operations are written to a table entity every hour, even if no requests were made to the service. At the API operation level, statistics are only written to an entity if the operation was requested within that hour.

 For example, if you perform a **GetBlob** operation on your blob service, Storage Analytics Metrics logs the request and includes it in the aggregated data for the blob service and the **GetBlob** operation. If no **GetBlob** operation is requested during the hour, an entity isn't written to *$MetricsTransactionsBlob* for that operation.

 Transaction metrics are recorded for user requests and requests made by Storage Analytics itself. For example, requests by Storage Analytics to write logs and table entities are recorded.

## Capacity metrics

> [!NOTE]
>  Currently, capacity metrics are available only for the blob service.

 Capacity data is recorded daily for a storage account's blob service, and two table entities are written. One entity provides statistics for user data, and the other provides statistics about the `$logs` blob container used by Storage Analytics. The *$MetricsCapacityBlob* table includes the following statistics:

- **Capacity**: The amount of storage used by the storage account's blob service, in bytes.
- **ContainerCount**: The number of blob containers in the storage account's blob service.
- **ObjectCount**: The number of committed and uncommitted block or page blobs in the storage account's blob service.

  For more information about capacity metrics, see [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema).

## How metrics are stored

 All metrics data for each of the storage services is stored in three tables reserved for that service. One table is for transaction information, one table is for minute transaction information, and another table is for capacity information. Transaction and minute transaction information consists of request and response data. Capacity information consists of storage usage data. Hour metrics, minute metrics, and capacity for a storage account's blob service is accessed in tables that are named as described in the following table.

|Metrics level|Table names|Supported for versions|
|-------------------|-----------------|----------------------------|
|Hourly metrics, primary location|-   $MetricsTransactionsBlob<br />-   $MetricsTransactionsTable<br />-   $MetricsTransactionsQueue|Versions prior to August 15, 2013, only. While these names are still supported, we recommend that you switch to using the tables that follow.|
|Hourly metrics, primary location|-   $MetricsHourPrimaryTransactionsBlob<br />-   $MetricsHourPrimaryTransactionsTable<br />-   $MetricsHourPrimaryTransactionsQueue<br />-   $MetricsHourPrimaryTransactionsFile|All versions. Support for file service metrics is available only in version April 5, 2015, and later.|
|Minute metrics, primary location|-   $MetricsMinutePrimaryTransactionsBlob<br />-   $MetricsMinutePrimaryTransactionsTable<br />-   $MetricsMinutePrimaryTransactionsQueue<br />-   $MetricsMinutePrimaryTransactionsFile|All versions. Support for file service metrics is available only in version April 5, 2015, and later.|
|Hourly metrics, secondary location|-   $MetricsHourSecondaryTransactionsBlob<br />-   $MetricsHourSecondaryTransactionsTable<br />-   $MetricsHourSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|
|Minute metrics, secondary location|-   $MetricsMinuteSecondaryTransactionsBlob<br />-   $MetricsMinuteSecondaryTransactionsTable<br />-   $MetricsMinuteSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|
|Capacity (blob service only)|$MetricsCapacityBlob|All versions.|

 These tables are automatically created when Storage Analytics is enabled for a storage service endpoint. They're accessed via the namespace of the storage account, for example, `https://<accountname>.table.core.windows.net/Tables("$MetricsTransactionsBlob")`. The metrics tables don't appear in a listing operation and must be accessed directly via the table name.

## Metrics alerts

Consider setting up alerts in the [Azure portal](https://portal.azure.com) so you'll be automatically notified of important changes in the behavior of your storage services. For step-by-step guidance, see [Create metrics alerts](./manage-storage-analytics-logs.md).

If you use a Storage Explorer tool to download this metrics data in a delimited format, you can use Microsoft Excel to analyze the data. For a list of available Storage Explorer tools, see [Azure Storage client tools](./storage-explorers.md).

> [!IMPORTANT]
> There might be a delay between a storage event and when the corresponding hourly or minute metrics data is recorded. In the case of minute metrics, several minutes of data might be written at once. This issue can lead to transactions from earlier minutes being aggregated into the transaction for the current minute. When this issue happens, the alert service might not have all available metrics data for the configured alert interval, which might lead to alerts firing unexpectedly.
>

## Billing on storage metrics

Write requests to create table entities for metrics are charged at the standard rates applicable to all Azure Storage operations.

Read requests of metrics data by a client are also billable at standard rates.

The capacity used by the metrics tables is also billable. Use the following information to estimate the amount of capacity used for storing metrics data:

-   If each hour a service utilizes every API in every service, approximately 148 KB of data is stored every hour in the metrics transaction tables if you enabled a service-level and API-level summary.
-   If within each hour a service utilizes every API in the service, approximately 12 KB of data is stored every hour in the metrics transaction tables if you enabled only a service-level summary.
-   The capacity table for blobs has two rows added each day provided you opted in for logs. This scenario implies that every day the size of this table increases by up to approximately 300 bytes.

## Next steps

- [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema)
- [Storage Analytics logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)
- [Storage Analytics logging](storage-analytics-logging.md)
