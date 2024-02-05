---
title: Monitor Azure Files
description: Start here to learn how to monitor Azure Files.
ms.date: 02/05/2024
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
   - Filename: "monitor-files-reference.md".
-->

# Monitor Azure Files

<!-- Intro -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-intro.md)]

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

>[!IMPORTANT]
>Metrics and logs in Azure Monitor support only Azure Resource Manager storage accounts. Azure Monitor doesn't support classic storage accounts. If you want to use metrics or logs on a classic storage account, you need to migrate to an Azure Resource Manager storage account. For more information, see [Migrate to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview).

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. -->
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-insights.md)]
<!-- Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->
Azure Storage insights offer a unified view of storage performance, capacity, and availability. See [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md).

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-resource-types.md)]

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Azure Files, see [Azure Files monitoring data reference](monitor-files-reference.md#metrics).
<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. Optional. If your service uses containers/Prometheus metrics, add the following include and information. 
[!INCLUDE [horz-monitor-container-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
<!-- Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System metrics. Optional. If your service uses system-imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-system-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
<!-- Add service-specific information about your system-imported metrics here.-->

<!-- ## Custom metrics. Optional. If your service uses custom imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]
<!-- Custom imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information. 
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]
<!-- Non-Monitor metrics service-specific information. Add service-specific information about your non-Azure Monitor metrics here.-->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Files, see [Azure Files monitoring data reference](monitor-files-reference.md#resource-logs).
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->
<a name="collection-and-routing"></a>
### Azure Files diagnostic settings

When you create the diagnostic setting, choose **file** as the type of storage that you want to enable logs for. Then, specify one of the following categories of operations for which you want to collect logs.

| Category | Description |
|:---|:---|
| StorageRead | Read operations on objects. |
| StorageWrite | Write operations on objects. |
| StorageDelete | Delete operations on objects. |

The **audit** resource log category group allows you to collect the baseline of resource logs that Microsoft deems necessary for auditing your resource. What's collected is dynamic, and Microsoft may change it over time as new resource log categories become available. If you choose the **audit** category group, you can't specify any other resource categories, because the system decides which logs to collect. For more information, see [Diagnostic settings in Azure Monitor: Resource logs](/azure/azure-monitor/essentials/diagnostic-settings#resource-logs).

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

#### Destination limitations

For general destination limitations, see [Destination limitations](/azure/azure-monitor/essentials/diagnostic-settings#destination-limitations). The following limitations apply only to monitoring Azure Storage accounts.

- You can't send logs to the same storage account that you're monitoring with this setting. 
  This situation would lead to recursive logs in which a log entry describes the writing of another log entry. You must create an account or use another existing account to store log information.

- You can't set a retention policy. 

  If you archive logs to a storage account, you can manage the retention policy of a log container by defining a lifecycle management policy. To learn how, see [Optimize costs by automatically managing the data lifecycle](../blobs/lifecycle-management-overview.md).

  If you send logs to Log Analytics, you can manage the data retention period of Log Analytics at the workspace level or even specify different retention settings by data type. To learn how, see [Change the data retention period](/azure/azure-monitor/logs/data-retention-archive).

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information. 
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
<!-- Add service-specific information about your imported logs here. -->

<!-- ## Other logs. Optional section.
If your service has other logs that aren't resource logs or in the activity log, add information that states what they are and what they cover here. You can describe how to route them in a later section. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
<a name="analyzing-logs"></a>
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze metrics for Azure Files

For a list of all Azure Monitor supported metrics, which includes Azure Files, see [Azure Monitor supported metrics](/azure/azure-monitor/essentials/metrics-supported#microsoftstoragestorageaccountsfileservices).

Metrics for Azure Files are in these namespaces:

- Microsoft.Storage/storageAccounts
- Microsoft.Storage/storageAccounts/fileServices

### [Azure portal](#tab/azure-portal)

You can analyze metrics for Azure Storage with metrics from other Azure services by using Metrics Explorer. Open Metrics Explorer by choosing **Metrics** from the **Azure Monitor** menu. For details on using this tool, see [Analyze metrics with Azure Monitor metrics explorer](../../azure-monitor/essentials/analyze-metrics.md). 

For metrics that support dimensions, you can filter the metric with the desired dimension value.  For a complete list of the dimensions that Azure Storage supports, see [Metrics dimensions](storage-files-monitoring-reference.md#metrics-dimensions).

### [PowerShell](#tab/azure-powershell)

#### List the metric definition

You can list the metric definition of your storage account or the Azure Files service. Use the [Get-AzMetricDefinition](/powershell/module/az.monitor/get-azmetricdefinition) cmdlet.

In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Azure Files service.  You can find these resource IDs on the **Properties** pages of your storage account in the Azure portal.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetricDefinition -ResourceId $resourceId
```

#### Read metric values

You can read account-level metric values of your storage account or the Azure Files service. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetric -ResourceId $resourceId -MetricNames "UsedCapacity" -TimeGrain 01:00:00
```

#### Read metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetric -ResourceId $resourceId -MetricNames "UsedCapacity" -TimeGrain 01:00:00
```
```powershell
$resourceId = "<resource-ID>"
$dimFilter = [String](New-AzMetricFilter -Dimension ApiName -Operator eq -Value "GetFile" 3> $null)
Get-AzMetric -ResourceId $resourceId -MetricName Transactions -TimeGrain 01:00:00 -MetricFilter $dimFilter -AggregationType "Total"
```


### [Azure CLI](#tab/azure-cli)

#### List the account-level metric definition

You can list the metric definition of your storage account or the Azure Files service. Use the [az monitor metrics list-definitions](/cli/azure/monitor/metrics#az-monitor-metrics-list-definitions) command.
 
In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Azure Files service. You can find these resource IDs on the **Properties** pages of your storage account in the Azure portal.

```azurecli-interactive
   az monitor metrics list-definitions --resource <resource-ID>
```

#### Read account-level metric values

You can read the metric values of your storage account or the Azure Files service. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli-interactive
   az monitor metrics list --resource <resource-ID> --metric "UsedCapacity" --interval PT1H
```
#### Read metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli
az monitor metrics list --resource <resource-ID> --metric "Transactions" --interval PT1H --filter "ApiName eq 'GetFile' " --aggregation "Total" 
```

### [.NET](#tab/dotnet) 

Azure Monitor provides the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/) to read metric definition and values. The [sample code](https://azure.microsoft.com/resources/samples/monitor-dotnet-metrics-api/) shows how to use the SDK with different parameters. You need to use `0.18.0-preview` or a later version for storage metrics.
 
In these examples, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the Azure Files service. You can find these resource IDs on the **Properties** pages of your storage account in the Azure portal.

Replace the `<subscription-ID>` variable with the ID of your subscription. For guidance on how to obtain values for `<tenant-ID>`, `<application-ID>`, and `<AccessKey>`, see [Use the portal to create a Microsoft Entra application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md). 

#### List the account-level metric definition

The following example shows how to list a metric definition at the account level:

```csharp
    public static async Task ListStorageMetricDefinition()
    {
        var resourceId = "<resource-ID>";
        var subscriptionId = "<subscription-ID>";
        var tenantId = "<tenant-ID>";
        var applicationId = "<application-ID>";
        var accessKey = "<AccessKey>";


        MonitorManagementClient readOnlyClient = AuthenticateWithReadOnlyClient(tenantId, applicationId, accessKey, subscriptionId).Result;
        IEnumerable<MetricDefinition> metricDefinitions = await readOnlyClient.MetricDefinitions.ListAsync(resourceUri: resourceId, cancellationToken: new CancellationToken());

        foreach (var metricDefinition in metricDefinitions)
        {
            // Enumerate metric definition:
            //    Id
            //    ResourceId
            //    Name
            //    Unit
            //    MetricAvailabilities
            //    PrimaryAggregationType
            //    Dimensions
            //    IsDimensionRequired
        }
    }

```

#### Read account-level metric values

The following example shows how to read `UsedCapacity` data at the account level:

```csharp
    public static async Task ReadStorageMetricValue()
    {
        var resourceId = "<resource-ID>";
        var subscriptionId = "<subscription-ID>";
        var tenantId = "<tenant-ID>";
        var applicationId = "<application-ID>";
        var accessKey = "<AccessKey>";

        MonitorClient readOnlyClient = AuthenticateWithReadOnlyClient(tenantId, applicationId, accessKey, subscriptionId).Result;

        Microsoft.Azure.Management.Monitor.Models.Response Response;

        string startDate = DateTime.Now.AddHours(-3).ToUniversalTime().ToString("o");
        string endDate = DateTime.Now.ToUniversalTime().ToString("o");
        string timeSpan = startDate + "/" + endDate;

        Response = await readOnlyClient.Metrics.ListAsync(
            resourceUri: resourceId,
            timespan: timeSpan,
            interval: System.TimeSpan.FromHours(1),
            metricnames: "UsedCapacity",

            aggregation: "Average",
            resultType: ResultType.Data,
            cancellationToken: CancellationToken.None);

        foreach (var metric in Response.Value)
        {
            // Enumerate metric value
            //    Id
            //    Name
            //    Type
            //    Unit
            //    Timeseries
            //        - Data
            //        - Metadatavalues
        }
    }

```

#### Read multidimensional metric values

For multidimensional metrics, you need to define metadata filters if you want to read metric data on specific dimension values.

The following example shows how to read metric data on the metric supporting multidimension:

```csharp
    public static async Task ReadStorageMetricValueTest()
    {
        // Resource ID for Azure Files
        var resourceId = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/default";
        var subscriptionId = "<subscription-ID}";
        // How to identify Tenant ID, Application ID and Access Key: https://azure.microsoft.com/documentation/articles/resource-group-create-service-principal-portal/
        var tenantId = "<tenant-ID>";
        var applicationId = "<application-ID>";
        var accessKey = "<AccessKey>";

        MonitorManagementClient readOnlyClient = AuthenticateWithReadOnlyClient(tenantId, applicationId, accessKey, subscriptionId).Result;

        Microsoft.Azure.Management.Monitor.Models.Response Response;

        string startDate = DateTime.Now.AddHours(-3).ToUniversalTime().ToString("o");
        string endDate = DateTime.Now.ToUniversalTime().ToString("o");
        string timeSpan = startDate + "/" + endDate;
        // It's applicable to define meta data filter when a metric support dimension
        // More conditions can be added with the 'or' and 'and' operators, example: BlobType eq 'BlockBlob' or BlobType eq 'PageBlob'
        ODataQuery<MetadataValue> odataFilterMetrics = new ODataQuery<MetadataValue>(
            string.Format("BlobType eq '{0}'", "BlockBlob"));

        Response = readOnlyClient.Metrics.List(
                        resourceUri: resourceId,
                        timespan: timeSpan,
                        interval: System.TimeSpan.FromHours(1),
                        metricnames: "BlobCapacity",
                        odataQuery: odataFilterMetrics,
                        aggregation: "Average",
                        resultType: ResultType.Data);

        foreach (var metric in Response.Value)
        {
            //Enumerate metric value
            //    Id
            //    Name
            //    Type
            //    Unit
            //    Timeseries
            //        - Data
            //        - Metadatavalues
        }
    }

```

---

#### Analyze workload performance

You can use Azure Monitor to analyze workloads that utilize Azure Files. Follow these steps.

1. Go to your storage account in the [Azure portal](https://portal.azure.com). 
1. From the left navigation, select **Data storage** > **File shares**. Select the file share you want to monitor.
1. From the left navigation, select **Monitoring** > **Metrics**.
1. When using Azure Monitor for Azure Files, it’s important to always select the **Files** metric namespace. Select **Add metric**.
1. Under **Metric namespace** select **File**.

:::image type="content" source="media/analyze-files-metrics/add-metric-namespace-file.png" alt-text="Screenshot showing how to select the Files metric namespace." lightbox="media/analyze-files-metrics/add-metric-namespace-file.png":::

#### Monitor availability

In Azure Monitor, the **Availability** metric can be useful when something is visibly wrong from either an application or user perspective, or when troubleshooting alerts.

When using this metric with Azure Files, it’s important to always view the aggregation as **Average** as opposed to **Max** or **Min**. Using **Average** helps you understand what percentage of your requests are experiencing errors, and if they are within the [SLA for Azure Files](https://azure.microsoft.com/support/legal/sla/storage/).

:::image type="content" source="media/analyze-files-metrics/transaction-metrics-menu.png" alt-text="Screenshot showing the available transaction metrics in Azure Monitor." lightbox="media/analyze-files-metrics/transaction-metrics-menu.png":::

#### Monitor latency

The two most important latency metrics are **Success E2E Latency** and **Success Server Latency**. These metrics are ideal to select when starting any performance investigation. **Average** is the recommended aggregation. As previously mentioned, Max and Min can sometimes be misleading.

In the following charts, the blue line indicates how much time is spent in total latency (Success E2E Latency), and the pink line indicates time spent only in the Azure Files service (Success Server Latency).

This chart is an example of a client machine that mounts an Azure file share from an on-premises environment. This configuration likely represents a typical user connecting from either an office, home, or other remote location. You'll see that the physical distance between the client and Azure region closely correlates to the corresponding client-side latency, which represents the difference between the E2E and Server latency.

:::image type="content" source="media/analyze-files-metrics/latency-remote.png" alt-text="Screenshot showing latency metrics with a remote user connecting to an Azure file share." lightbox="media/analyze-files-metrics/latency-remote.png" border="false":::

In comparison, the following chart shows a situation where both the client and the Azure file share are located within the same region. Note that the client-side latency is only 0.17ms compared to 43.9ms in the first chart. This example illustrates why minimizing client-side latency is imperative in order to achieve optimal performance.

:::image type="content" source="media/analyze-files-metrics/latency-same-region.png" alt-text="Screenshot showing latency metrics when the client and Azure file share are located in the same region." lightbox="media/analyze-files-metrics/latency-same-region.png" border="false":::

Another latency indicator to look that for might suggest a problem is an increased frequency or abnormal spikes in **Success Server Latency**.  This situation is commonly due to throttling due to exceeding the Azure Files [scale limits](storage-files-scale-targets.md) for standard file shares, or an under-provisioned [Azure Files Premium Share](understanding-billing.md#provisioning-method).

For more information, see [Troubleshoot high latency, low throughput, or low IOPS](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=%2Fazure%2Fstorage%2Ffiles%2Ftoc.json&tabs=windows#high-latency-low-throughput-or-low-iops).

#### Monitor utilization

Utilization metrics that measure the amount of data being transmitted (throughput) or operations being serviced (IOPS) are commonly used to determine how much work is being performed by the application or workload. Transaction metrics can determine the number of operations or requests against the Azure Files service over various time granularity. 

If you're using the **Egress** or **Ingress** metrics to determine the volume of inbound or outbound data, use the **Sum** aggregation to determine the total amount of data being transmitted to and from the file share over a 1 minute to 1 day time granularity. Other aggregations such as **Average**, **Max**, and **Min** only display the value of the individual I/O size, which is why most customers typically see 1 MiB when using the **Max** aggregation.  While it can be useful to understand the size of your largest, smallest, or even average I/O size, it isn't possible to display the distribution of I/O size generated by the workload's usage pattern.

You can also select **Apply splitting** on response types (success, failures, errors) or API operations (read, write, create, close) to display more details as shown in the following chart.

:::image type="content" source="media/analyze-files-metrics/utilization-apply-splitting.png" alt-text="Screenshot showing utilization metrics split by API name." lightbox="media/analyze-files-metrics/utilization-apply-splitting.png" border="false":::

To determine the average I/O per second (IOPS) for your workload, first determine the total number of transactions over a minute and then divide that number by 60 seconds. For example, 120,000 transactions in 1 minute / 60 seconds = 2,000 average IOPS.

To determine the average throughput for your workload, take the total amount of transmitted data by combining the **Ingress** and **Egress** metrics (total throughput) and divide that by 60 seconds. For example, 1 GiB total throughput over 1 minute / 60 seconds = 17 MiB average throughput.

#### Monitor utilization by maximum IOPS and bandwidth (premium only)

Because Azure Premium file shares are billed on a provisioned model in which each GiB of storage capacity that you provision entitles you to more IOPS and throughput, it's often useful to determine maximum IOPS and bandwidth. Whereas throughput measures the actual amount of data successfully transmitted, bandwidth refers to the maximum data transfer rate.

With Azure Premium file shares, you can use **Transactions by Max IOPS** and **Bandwidth by Max MiB/s** metrics to display what your workload is achieving at peak times. Using these metrics to analyze your workload helps you understand true capability at scale, as well as establish a baseline to understand the impact of more throughput and IOPS so you can optimally provision your Azure Premium file share.

The following chart shows a workload that generated 2.63 million transactions over 1 hour. When 2.63 million transactions is divided by 3,600 seconds, we get an average of 730 IOPS.

:::image type="content" source="media/analyze-files-metrics/transactions-sum.png" alt-text="Screenshot showing the transactions generated by a workload over one hour." lightbox="media/analyze-files-metrics/transactions-sum.png" border="false":::

Now when we compare the average IOPS against the **Transactions by Max IOPS**, we see that under peak load we were achieving 1,840 IOPS, which is a better representation of the workload's ability at scale.

:::image type="content" source="media/analyze-files-metrics/transactions-by-max-iops.png" alt-text="Screenshot showing transactions by max IOPS." lightbox="media/analyze-files-metrics/transactions-by-max-iops.png" border="false":::

Select **Add metric** to combine the **Ingress** and **Egress metrics** on a single graph. The result shows that 76.2 GiB (78,028 MiB) were transferred over one hour, which produces an average throughput of 21.67 MiB over that same hour.

:::image type="content" source="media/analyze-files-metrics/ingress-egress-sum.png" alt-text="Screenshot showing how to combine ingress and egress metrics into a single graph." lightbox="media/analyze-files-metrics/ingress-egress-sum.png" border="false":::

Compared against the **Bandwidth by Max MiB/s**, we achieved 123 MiB/s at peak.

:::image type="content" source="media/analyze-files-metrics/bandwidth-by-max-mibs.png" alt-text="Screenshot showing bandwidth by max MIBS." lightbox="media/analyze-files-metrics/bandwidth-by-max-mibs.png" border="false":::

### Analyze logs for Azure Files

You can access resource logs either as a blob in a storage account, as event data, or through Log Analytics queries. For information about how to find those logs, see [Azure resource logs](/azure/azure-monitor/essentials/resource-logs).

Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its file endpoint but not in its table or queue endpoints, only logs that pertain to the Azure File service are created. Azure Storage logs contain detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

#### Log authenticated requests

 The following types of authenticated requests are logged:

- Successful requests
- Failed requests, including timeout, throttling, network, authorization, and other errors
- Requests that use Kerberos, NTLM or shared access signature (SAS), including failed and successful requests
- Requests to analytics data (classic log data in the **$logs** container and classic metric data in the **$metric** tables)

Requests made by the Azure Files service itself, such as log creation or deletion, aren't logged. 

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->
Here are some queries that you can enter in the **Log search** bar to help you monitor your Azure file shares. These queries work with the [new language](../../azure-monitor/logs/log-query-overview.md).

- View SMB errors over the last week

```Kusto
StorageFileLogs
| where Protocol == "SMB" and TimeGenerated >= ago(7d) and StatusCode contains "-"
| sort by StatusCode
```
- Create a pie chart of SMB operations over the last week

```Kusto
StorageFileLogs
| where Protocol == "SMB" and TimeGenerated >= ago(7d) 
| summarize count() by OperationName
| sort by count_ desc
| render piechart
```

- View REST errors over the last week

```Kusto
StorageFileLogs
| where Protocol == "HTTPS" and TimeGenerated >= ago(7d) and StatusText !contains "Success"
| sort by StatusText asc
```

- Create a pie chart of REST operations over the last week

```Kusto
StorageFileLogs
| where Protocol == "HTTPS" and TimeGenerated >= ago(7d) 
| summarize count() by OperationName
| sort by count_ desc
| render piechart
```

To view the list of column names and descriptions for Azure Files, see [StorageFileLogs](/azure/azure-monitor/reference/tables/storagefilelogs).

For more information on how to write queries, see [Log Analytics tutorial](../../azure-monitor/logs/log-analytics-tutorial.md).

<!-- ### Azure Files service-specific analytics. Optional section.
Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-alerts.md)]

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

### Create common alert rules

The following sections describe how to create alert rules for common Azure Files alerts.

#### Create an alert if a file share is throttled

To create an alert that notifies you if a file share is being throttled, follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).
2. In the **Condition** tab, select the **Transactions** metric.
3. In the **Dimension name** drop-down list, select **Response type**. 
4. In the **Dimension values** drop-down list, select the appropriate response types for your file share.
    For standard file shares, select the following response types:

    - `SuccessWithShareIopsThrottling`
    - `SuccessWithThrottling`
    - `ClientShareIopsThrottlingError`

    For premium file shares, select the following response types:

    - `SuccessWithShareEgressThrottling`
    - `SuccessWithShareIngressThrottling`
    - `SuccessWithShareIopsThrottling`
    - `ClientShareEgressThrottlingError`
    - `ClientShareIngressThrottlingError`
    - `ClientShareIopsThrottlingError`

   > [!NOTE]
   > If the response types aren't listed in the **Dimension values** drop-down, this means the resource hasn't been throttled. To add the dimension values, next to the **Dimension values** drop-down list, select **Add custom value**, enter the response type (for example, **SuccessWithThrottling**), select **OK**, and then repeat these steps to add all applicable response types for your file share.

5. For **premium file shares**, select the **Dimension name** drop-down and select **File Share**. For **standard file shares**, skip to step 7.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Throttling alerts for standard file shares are triggered if any file share within the storage account is throttled, and the alert won't identify which file share was throttled. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

6. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.
7. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation). 

    > [!TIP]
    > If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you're using a dynamic threshold, the metric chart displays the calculated thresholds based on recent data.

8. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.
9. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 
10. Select **Review + create** to create the alert.

#### Create an alert if the Azure file share size is 80% of capacity

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).
2. In the **Condition** tab of the **Create an alert rule** dialog box, select the **File Capacity** metric.
3. For **premium file shares**, select the **Dimension name** drop-down list, and then select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

4. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.
5. Enter the **Threshold value** in bytes. For example, if the file share size is 100 TiB and you want to receive an alert when the file share size is 80% of capacity, the threshold value in bytes is 87960930222080.
6. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation).
7. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.
8. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 
9. Select **Review + create** to create the alert.

#### Create an alert if the Azure file share egress exceeds 500 GiB in a day

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).
2. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Egress** metric.
3. For **premium file shares**, select the **Dimension name** drop-down list and select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

4. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.
5. Enter **536870912000** bytes for Threshold value. 
6. From the **Check every** drop-down list, select the frequency of evaluation.
7. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.
8. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 
9. Select **Review + create** to create the alert.

#### Create an alert for high server latency

To create an alert for high server latency (average), follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).
2. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Success Server Latency** metric.
3. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

   > [!NOTE]
   > To alert on the overall latency experience, leave **Dimension values** unchecked. To alert on the latency of specific transactions, select the API Name in the drop-down list. For example, selecting the Read and Write API names with the equal operator will only display latency for data transactions. Selecting the Read and Write API name with the not equal operator only displays latency for metadata transactions.

4. Define the **Alert Logic** by selecting either Static or Dynamic. For Static, select **Average** Aggregation, **Greater than** Operator, and Threshold value. For Dynamic, select **Average** Aggregation, **Greater than** Operator, and Threshold Sensitivity.

   > [!TIP]
   > If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently experiencing high latency. If you're using a dynamic threshold, the metric chart displays the calculated thresholds based on recent data. We recommend using the Dynamic logic with Medium threshold sensitivity and further adjust as needed. To learn more, see [Understanding dynamic thresholds](../../azure-monitor/alerts/alerts-dynamic-thresholds.md#understand-dynamic-thresholds-charts).

5. Define the lookback period and frequency of evaluation.
6. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.
7. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity.
8. Select **Review + create** to create the alert.

<!-- ### Advisor recommendations -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

Other Azure Files monitoring content:
- [Azure Files monitoring data reference](monitor-files-reference.md). A reference of the logs and metrics created by Azure Files.
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

