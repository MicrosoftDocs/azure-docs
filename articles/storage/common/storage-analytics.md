---
title: Use Azure Storage analytics to collect logs and metrics data
description: Storage Analytics enables you to track metrics data for all storage services, and to collect logs for Blob, Queue, and Table storage.
author: normesta
ms.service: azure-storage
ms.topic: conceptual
ms.date: 03/03/2017
ms.author: normesta
ms.reviewer: fryu
ms.subservice: storage-common-concepts
ms.custom: monitoring
---

# Storage Analytics

Azure Storage Analytics performs logging and provides metrics data for a storage account. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

To use Storage Analytics, you must enable it individually for each service you want to monitor. You can enable it from the [Azure portal](https://portal.azure.com). For details, see [Monitor a storage account in the Azure portal](./manage-storage-analytics-logs.md). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties), [Set Queue Service Properties](/rest/api/storageservices/set-queue-service-properties), [Set Table Service Properties](/rest/api/storageservices/set-table-service-properties), and [Set File Service Properties](/rest/api/storageservices/Get-File-Service-Properties) operations to enable Storage Analytics for each service.

The aggregated data is stored in a well-known blob (for logging) and in well-known tables (for metrics), which may be accessed using the Blob service and Table service APIs.

Storage Analytics has a 20 TB limit on the amount of stored data that is independent of the total limit for your storage account. For more information about storage account limits, see [Scalability and performance targets for standard storage accounts](scalability-targets-standard-account.md).

For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md).

## Billing for Storage Analytics

All metrics data is written by the services of a storage account. As a result, each write operation performed by Storage Analytics is billable. Additionally, the amount of storage used by metrics data is also billable.

The following actions performed by Storage Analytics are billable:

- Requests to create blobs for logging.
- Requests to create table entities for metrics.

If you have configured a data retention policy, you can reduce the spending by deleting old logging and metrics data. For more information about retention policies, see [Setting a Storage Analytics Data Retention Policy](/rest/api/storageservices/Setting-a-Storage-Analytics-Data-Retention-Policy).

### Understanding billable requests

Every request made to an account's storage service is either billable or non-billable. Storage Analytics logs each individual request made to a service, including a status message that indicates how the request was handled. Similarly, Storage Analytics stores metrics for both a service and the API operations of that service, including the percentages and count of certain status messages. Together, these features can help you analyze your billable requests, make improvements on your application, and diagnose issues with requests to your services. For more information about billing, see [Understanding Azure Storage Billing - Bandwidth, Transactions, and Capacity](/archive/blogs/windowsazurestorage/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity).

When looking at Storage Analytics data, you can use the tables in the [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) topic to determine what requests are billable. Then you can compare your logs and metrics data to the status messages to see if you were charged for a particular request. You can also use the tables in the previous topic to investigate availability for a storage service or individual API operation.

## Next steps

- [Monitor a storage account in the Azure portal](./manage-storage-analytics-logs.md)
- [Storage Analytics Metrics](storage-analytics-metrics.md)
- [Storage Analytics Logging](storage-analytics-logging.md)
