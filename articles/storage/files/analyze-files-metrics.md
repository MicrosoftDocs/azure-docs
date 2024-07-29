---
title: Analyze Azure Files metrics with Azure Monitor
description: Learn to use Azure Monitor to monitor workload performance, throughput, and IOPS. Analyze Azure Files metrics such as availability, latency, and utilization.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/08/2024
ms.author: kendownie
ms.custom: monitoring, devx-track-azurepowershell
---

# Use Azure Monitor to Analyze Azure Files metrics

Understanding how to monitor file share performance is critical to ensuring that your application is running as efficiently as possible. This article shows you how to use [Azure Monitor](/azure/azure-monitor/overview) to analyze Azure Files metrics such as availability, latency, and utilization.

See [Monitor Azure Files](storage-files-monitoring.md) for details on the monitoring data you can collect for Azure Files and how to use it.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Supported metrics

Metrics for Azure Files are in these namespaces: 

- Microsoft.Storage/storageAccounts
- Microsoft.Storage/storageAccounts/fileServices

For a list of available metrics for Azure Files, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md#supported-metrics-for-microsoftstoragestorageaccountsfileservices).

For a list of all Azure Monitor supported metrics, which includes Azure Files, see [Azure Monitor supported metrics](/azure/azure-monitor/reference/supported-metrics/metrics-index#supported-metrics-per-resource-type).

## View Azure Files metrics data

You can view Azure Files metrics by using the Azure portal, PowerShell, Azure CLI, or .NET.

### [Azure portal](#tab/azure-portal)

You can analyze metrics for Azure Storage with metrics from other Azure services by using Azure Monitor Metrics Explorer. Open metrics explorer by choosing **Metrics** from the **Azure Monitor** menu. For details on using this tool, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics). 

For metrics that support dimensions, you can filter the metric with the desired dimension value.  For a complete list of the dimensions that Azure Storage supports, see [Metrics dimensions](storage-files-monitoring-reference.md#metrics-dimensions).

### [PowerShell](#tab/azure-powershell)

#### List the metric definition

You can list the metric definition of your storage account or the Azure Files service. Use the [Get-AzMetricDefinition](/powershell/module/az.monitor/get-azmetricdefinition) cmdlet.

In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Azure Files service.  You can find these resource IDs on the **Properties** pages of your storage account in the Azure portal.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetricDefinition -ResourceId $resourceId
```

#### Reading metric values

You can read account-level metric values of your storage account or the Azure Files service. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetric -ResourceId $resourceId -MetricNames "UsedCapacity" -TimeGrain 01:00:00
```

#### Reading metric values with dimensions

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
#### Reading metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli
az monitor metrics list --resource <resource-ID> --metric "Transactions" --interval PT1H --filter "ApiName eq 'GetFile' " --aggregation "Total" 
```

### [.NET](#tab/dotnet) 

Azure Monitor provides the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/) to read metric definition and values. The [sample code](https://azure.microsoft.com/resources/samples/monitor-dotnet-metrics-api/) shows how to use the SDK with different parameters. You need to use `0.18.0-preview` or a later version for storage metrics.
 
In these examples, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the Azure Files service. You can find these resource IDs on the **Properties** pages of your storage account in the Azure portal.

Replace the `<subscription-ID>` variable with the ID of your subscription. For guidance on how to obtain values for `<tenant-ID>`, `<application-ID>`, and `<AccessKey>`, see [Use the portal to create a Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). 

### List the account-level metric definition

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

### Reading account-level metric values

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

### Reading multidimensional metric values

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

## Monitor workload performance

You can use Azure Monitor to analyze workloads that utilize Azure Files. Follow these steps.

1. Go to your storage account in the [Azure portal](https://portal.azure.com). 
1. From the left navigation, select **Data storage** > **File shares**. Select the file share you want to monitor.
1. From the left navigation, select **Monitoring** > **Metrics**.
1. When using Azure Monitor for Azure Files, it’s important to always select the **Files** metric namespace. Select **Add metric**.
1. Under **Metric namespace** select **File**.

:::image type="content" source="media/analyze-files-metrics/add-metric-namespace-file.png" alt-text="Screenshot showing how to select the Files metric namespace." lightbox="media/analyze-files-metrics/add-metric-namespace-file.png":::

### Monitor availability

In Azure Monitor, the **Availability** metric can be useful when something is visibly wrong from either an application or user perspective, or when troubleshooting alerts.

When using this metric with Azure Files, it’s important to always view the aggregation as **Average** as opposed to **Max** or **Min**. Using **Average** will help you understand what percentage of your requests are experiencing errors, and if they are within the [SLA for Azure Files](https://azure.microsoft.com/support/legal/sla/storage/).

:::image type="content" source="media/analyze-files-metrics/transaction-metrics-menu.png" alt-text="Screenshot showing the available transaction metrics in Azure Monitor." lightbox="media/analyze-files-metrics/transaction-metrics-menu.png":::

### Monitor latency

The two most important latency metrics are **Success E2E Latency** and **Success Server Latency**. These are ideal metrics to select when starting any performance investigation. **Average** is the recommended aggregation. As previously mentioned, Max and Min can sometimes be misleading.

In the following charts, the blue line indicates how much time is spent in total latency (Success E2E Latency), and the pink line indicates time spent only in the Azure Files service (Success Server Latency).

This chart is an example of a client machine that has mounted an Azure file share from an on-premises environment. This will likely represent a typical user connecting from either an office, home, or other remote location. You'll see that the physical distance between the client and Azure region is closely correlated to the corresponding client-side latency, which represents the difference between the E2E and Server latency.

:::image type="content" source="media/analyze-files-metrics/latency-remote.png" alt-text="Screenshot showing latency metrics with a remote user connecting to an Azure file share." lightbox="media/analyze-files-metrics/latency-remote.png" border="false":::

In comparison, the following chart shows a situation where both the client and the Azure file share are located within the same region. Note that the client-side latency is only 0.17ms compared to 43.9ms in the first chart. This illustrates why minimizing client-side latency is imperative in order to achieve optimal performance.

:::image type="content" source="media/analyze-files-metrics/latency-same-region.png" alt-text="Screenshot showing latency metrics when the client and Azure file share are located in the same region." lightbox="media/analyze-files-metrics/latency-same-region.png" border="false":::

Another latency indicator to look that for might suggest a problem is an increased frequency or abnormal spikes in **Success Server Latency**.  This is commonly due to throttling due to exceeding the Azure Files [scale limits](storage-files-scale-targets.md) for standard file shares, or an under-provisioned [Azure Files Premium Share](understanding-billing.md#provisioning-method).

For more information, see [Troubleshoot high latency, low throughput, or low IOPS](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=%2Fazure%2Fstorage%2Ffiles%2Ftoc.json&tabs=windows#high-latency-low-throughput-or-low-iops).

### Monitor utilization

Utilization metrics that measure the amount of data being transmitted (throughput) or operations being serviced (IOPS) are commonly used to determine how much work is being performed by the application or workload. Transaction metrics can determine the number of operations or requests against the Azure Files service over various time granularity. 

If you're using the **Egress** or **Ingress** metrics to determine the volume of inbound or outbound data, use the **Sum** aggregation to determine the total amount of data being transmitted to and from the file share over a 1 minute to 1 day time granularity. Other aggregations such as **Average**, **Max**, and **Min** only display the value of the individual I/O size. This is why most customers will typically see 1 MiB when using the **Max** aggregation.  While it can be useful to understand the size of your largest, smallest, or even average I/O size, it isn't possible to display the distribution of I/O size generated by the workload's usage pattern.

You can also select **Apply splitting** on response types (success, failures, errors) or API operations (read, write, create, close) to display additional details as shown in the following chart.

:::image type="content" source="media/analyze-files-metrics/utilization-apply-splitting.png" alt-text="Screenshot showing utilization metrics split by API name." lightbox="media/analyze-files-metrics/utilization-apply-splitting.png" border="false":::

To determine the average I/O per second (IOPS) for your workload, first determine the total number of transactions over a minute and then divide that number by 60 seconds. For example, 120,000 transactions in 1 minute / 60 seconds = 2,000 average IOPS.

To determine the average throughput for your workload, take the total amount of transmitted data by combining the **Ingress** and **Egress** metrics (total throughput) and divide that by 60 seconds. For example, 1 GiB total throughput over 1 minute / 60 seconds = 17 MiB average throughput.

### Monitor utilization by maximum IOPS and bandwidth (premium only)

Because Azure Premium file shares are billed on a provisioned model in which each GiB of storage capacity that you provision entitles you to more IOPS and throughput, it's often useful to determine maximum IOPS and bandwidth. Whereas throughput measures the actual amount of data successfully transmitted, bandwidth refers to the maximum data transfer rate.

With Azure Premium file shares, you can use **Transactions by Max IOPS** and **Bandwidth by Max MiB/s** metrics to display what your workload is achieving at peak times. Using these metrics to analyze your workload will help you understand true capability at scale, as well as establish a baseline to understand the impact of more throughput and IOPS so you can optimally provision your Azure Premium file share.

The following chart shows a workload that generated 2.63 million transactions over 1 hour. When 2.63 million transactions is divided by 3,600 seconds, we get an average of 730 IOPS.

:::image type="content" source="media/analyze-files-metrics/transactions-sum.png" alt-text="Screenshot showing the transactions generated by a workload over one hour." lightbox="media/analyze-files-metrics/transactions-sum.png" border="false":::

Now when we compare the average IOPS against the **Transactions by Max IOPS**, we see that under peak load we were achieving 1,840 IOPS, which is a better representation of the workload's ability at scale.

:::image type="content" source="media/analyze-files-metrics/transactions-by-max-iops.png" alt-text="Screenshot showing transactions by max IOPS." lightbox="media/analyze-files-metrics/transactions-by-max-iops.png" border="false":::

Select **Add metric** to combine the **Ingress** and **Egress metrics** on a single graph. This displays that 76.2 GiB (78,028 MiB) was transferred over one hour, which gives us an average throughput of 21.67 MiB over that same hour.

:::image type="content" source="media/analyze-files-metrics/ingress-egress-sum.png" alt-text="Screenshot showing how to combine ingress and egress metrics into a single graph." lightbox="media/analyze-files-metrics/ingress-egress-sum.png" border="false":::

Compared against the **Bandwidth by Max MiB/s**, we achieved 123 MiB/s at peak.

:::image type="content" source="media/analyze-files-metrics/bandwidth-by-max-mibs.png" alt-text="Screenshot showing bandwidth by max MIBS." lightbox="media/analyze-files-metrics/bandwidth-by-max-mibs.png" border="false":::

## Related content

- [Monitor Azure Files](storage-files-monitoring.md)
- [Azure Files monitoring data reference](storage-files-monitoring-reference.md)
- [Create monitoring alerts for Azure Files](files-monitoring-alerts.md)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
- [Understand Azure Files performance](understand-performance.md)
- [Troubleshoot ClientOtherErrors](/troubleshoot/azure/azure-storage/files-client-other-errors?toc=/azure/storage/files/toc.json)
