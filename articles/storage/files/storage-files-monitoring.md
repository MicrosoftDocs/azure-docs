---
title: Monitor Azure Files
description: Start here to learn how to monitor Azure Files.
ms.date: 02/13/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Files with the official name of your service.
2. Search and replace files with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.
At a minimum your service should have the following two articles:
1. The primary monitoring article (based on this template)
   - Title: "Monitor Azure Files"
   - TOC title: "Monitor"
   - Filename: "monitor-files.md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Azure Files monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "storage-files-monitoring-reference.md".
-->

# Monitor Azure Files

<!-- Intro -->
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

>[!IMPORTANT]
>Metrics and logs in Azure Monitor support only Azure Resource Manager storage accounts. Azure Monitor doesn't support classic storage accounts. If you want to use metrics or logs on a classic storage account, you need to migrate to an Azure Resource Manager storage account. For more information, see [Migrate to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview).

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. -->
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]
<!-- Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->
Azure Storage insights offer a unified view of storage performance, capacity, and availability. See [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md).

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md#metrics).
<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. Optional. If your service uses containers/Prometheus metrics, add the following include and information. 
[!INCLUDE [horz-monitor-container-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
<!-- Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System metrics. Optional. If your service uses system-imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-system-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
<!-- Add service-specific information about your system-imported metrics here.-->

<!-- ## Custom metrics. Optional. If your service uses custom imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]
<!-- Custom imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information. 
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]
<!-- Non-Monitor metrics service-specific information. Add service-specific information about your non-Azure Monitor metrics here.-->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
<a name="collection-and-routing"></a>
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md#resource-logs).
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

### Destination limitations

For general destination limitations, see [Destination limitations](/azure/azure-monitor/essentials/diagnostic-settings#destination-limitations). The following limitations apply only to monitoring Azure Storage accounts.

- You can't send logs to the same storage account that you're monitoring with this setting. 
  This situation would lead to recursive logs in which a log entry describes the writing of another log entry. You must create an account or use another existing account to store log information.

- You can't set a retention policy. 

  If you archive logs to a storage account, you can manage the retention policy of a log container by defining a lifecycle management policy. To learn how, see [Optimize costs by automatically managing the data lifecycle](../blobs/lifecycle-management-overview.md).

  If you send logs to Log Analytics, you can manage the data retention period of Log Analytics at the workspace level or even specify different retention settings by data type. To learn how, see [Change the data retention period](/azure/azure-monitor/logs/data-retention-archive).

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information. 
[!INCLUDE [horz-monitor-imported-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
<!-- Add service-specific information about your imported logs here. -->

<!-- ## Other logs. Optional section.
If your service has other logs that aren't resource logs or in the activity log, add information that states what they are and what they cover here. You can describe how to route them in a later section. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
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

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->
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

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ### Azure Files alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

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

<!-- ### Advisor recommendations -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

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

