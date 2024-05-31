---
title: Monitor Azure Files using Azure Monitor
description: Learn how to monitor Azure Files and analyze metrics and logs using Azure Monitor. 
ms.date: 05/10/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

# Monitor Azure Files

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

>[!IMPORTANT]
>Metrics and logs in Azure Monitor support only Azure Resource Manager storage accounts. Azure Monitor doesn't support classic storage accounts. If you want to use metrics or logs on a classic storage account, you need to migrate to an Azure Resource Manager storage account. For more information, see [Migrate to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview).

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Azure Storage insights offer a unified view of storage performance, capacity, and availability. See [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md#metrics).

<a name="collection-and-routing"></a>
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md#resource-logs).

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

### Destination limitations

For general destination limitations, see [Destination limitations](/azure/azure-monitor/essentials/diagnostic-settings#destination-limitations). The following limitations apply only to monitoring Azure Storage accounts.

- You can't send logs to the same storage account that you're monitoring with this setting. 
  This situation would lead to recursive logs in which a log entry describes the writing of another log entry. You must create an account or use another existing account to store log information.

- You can't set a retention policy. 

  If you archive logs to a storage account, you can manage the retention policy of a log container by defining a lifecycle management policy. To learn how, see [Optimize costs by automatically managing the data lifecycle](../blobs/lifecycle-management-overview.md).

  If you send logs to Log Analytics, you can manage the data retention period of Log Analytics at the workspace level or even specify different retention settings by data type. To learn how, see [Change the data retention period](/azure/azure-monitor/logs/data-retention-archive).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze metrics for Azure Files

Metrics for Azure Files are in these namespaces: 

- Microsoft.Storage/storageAccounts
- Microsoft.Storage/storageAccounts/fileServices

For a list of available metrics for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

For a list of all Azure Monitor supported metrics, which includes Azure Files, see [Azure Monitor supported metrics](/azure/azure-monitor/essentials/metrics-supported#microsoftstoragestorageaccountsfileservices).

For detailed instructions on how to access and analyze Azure Files metrics such as availability, latency, and utilization, see [Analyze Azure Files metrics using Azure Monitor](analyze-files-metrics.md).

<a name="analyzing-logs"></a>
### Analyze logs for Azure Files

You can access resource logs either as a blob in a storage account, as event data, or through Log Analytics queries. For information about how to send resource logs to different destinations, see [Azure resource logs](/azure/azure-monitor/essentials/resource-logs).

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its file endpoint but not in its table or queue endpoints, only logs that pertain to the Azure File service are created. Azure Storage logs contain detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

#### Log authenticated requests

 The following types of authenticated requests are logged:

- Successful requests
- Failed requests, including timeout, throttling, network, authorization, and other errors
- Requests that use Kerberos, NTLM or shared access signature (SAS), including failed and successful requests
- Requests to analytics data (classic log data in the **$logs** container and classic metric data in the **$metric** tables)

Requests made by the Azure Files service itself, such as log creation or deletion, aren't logged. 

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Here are some queries that you can enter in the **Log search** bar to help you monitor your Azure file shares. These queries work with the [new language](../../azure-monitor/logs/log-query-overview.md).

- View SMB errors over the last week.

  ```Kusto
  StorageFileLogs
  | where Protocol == "SMB" and TimeGenerated >= ago(7d) and StatusCode contains "-"
  | sort by StatusCode
  ```
- Create a pie chart of SMB operations over the last week.

  ```Kusto
  StorageFileLogs
  | where Protocol == "SMB" and TimeGenerated >= ago(7d) 
  | summarize count() by OperationName
  | sort by count_ desc
  | render piechart
  ```

- View REST errors over the last week.

  ```Kusto
  StorageFileLogs
  | where Protocol == "HTTPS" and TimeGenerated >= ago(7d) and StatusText !contains "Success"
  | sort by StatusText asc
  ```

- Create a pie chart of REST operations over the last week.

  ```Kusto
  StorageFileLogs
  | where Protocol == "HTTPS" and TimeGenerated >= ago(7d) 
  | summarize count() by OperationName
  | sort by count_ desc
  | render piechart
  ```

To view the list of column names and descriptions for Azure Files, see [StorageFileLogs](/azure/azure-monitor/reference/tables/storagefilelogs#columns).

For more information on how to write queries, see [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Files alert rules
The following table lists common and recommended alert rules for Azure Files and the proper metric to use for the alert.

> [!TIP]  
> If you create an alert and it's too noisy, adjust the threshold value and alert logic.

| Alert type | Condition | Description |
|-|-|-|
|Metric | File share is throttled. | Transactions<br>Dimension name: Response type <br>Dimension name: FileShare (premium file share only) |
|Metric | File share size is 80% of capacity. | File Capacity<br>Dimension name: FileShare (premium file share only) |
|Metric | File share egress exceeds 500 GiB in one day. | Egress<br>Dimension name: FileShare (premium file share only) |
|Metric | High server latency. | Success Server Latency<br>Dimension name: API Name, for example Read and Write API|
|Metric | File share availability is less than 99.9%. | Availability<br>Dimension name: FileShare (premium file share only) |

For instructions on how to create alerts on throttling, capacity, egress, and high server latency, see [Create monitoring alerts for Azure Files](files-monitoring-alerts.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]


## Related content

Other Azure Files monitoring content:
- [Azure Files monitoring data reference](storage-files-monitoring-reference.md). A reference of the logs and metrics created by Azure Files.
- [Understand Azure Files performance](understand-performance.md)

Overall Azure Storage monitoring content:
- [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md). Get a unified view of storage performance, capacity, and availability.
- [Transition to metrics in Azure Monitor](../common/storage-metrics-migration.md). Move from Storage Analytics metrics to metrics in Azure Monitor.
- [Troubleshoot performance issues](../common/troubleshoot-storage-performance.md?toc=/azure/storage/files/toc.json). See common performance issues and guidance about how to troubleshoot them.
- [Troubleshoot availability issues](../common/troubleshoot-storage-availability.md?toc=/azure/storage/files/toc.json). See common availability issues and guidance about how to troubleshoot them.
- [Troubleshoot client application errors](../common/troubleshoot-storage-client-application-errors.md?toc=/azure/storage/files/toc.json). See common issues with connecting clients and how to troubleshoot them.
- [Troubleshoot ClientOtherErrors](/troubleshoot/azure/azure-storage/files-client-other-errors?toc=/azure/storage/files/toc.json)

Azure Monitor content:
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource). General details on monitoring Azure resources.
- [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics). The basics of metrics and metric dimensions.
- [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs). The basics of logs and how to collect and analyze them.
- [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics). A tour of Metrics Explorer.
- [Overview of Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview). A tour of Log Analytics.

Training modules:
- [Monitor, diagnose, and troubleshoot your Azure Storage](/training/modules/monitor-diagnose-and-troubleshoot-azure-storage/). Troubleshoot storage account issues, with step-by-step guidance.

