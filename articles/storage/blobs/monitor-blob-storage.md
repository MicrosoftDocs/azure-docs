---
title: Monitor Azure Blob Storage
description: Start here to learn how to monitor Azure Blob Storage.
ms.date: 02/07/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: normesta
ms.author: normesta
ms.service: azure-blob-storage
---

# Monitor Azure Blob Storage

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

>[!IMPORTANT]
>Metrics and logs in Azure Monitor support only Azure Resource Manager storage accounts. Azure Monitor doesn't support classic storage accounts. If you want to use metrics or logs on a classic storage account, you need to migrate to an Azure Resource Manager storage account. For more information, see [Migrate to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview).

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Azure Storage insights offer a unified view of storage performance, capacity, and availability. See [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Azure Blob Storage, see [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md#metrics).

<a name="collection-and-routing"></a>
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Blob Storage, see [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md#resource-logs).
> [!NOTE]
> Data Lake Storage doesn't appear as a storage type because Data Lake Storage is a set of capabilities available to Blob storage.

#### Destination limitations

For general destination limitations, see [Destination limitations](/azure/azure-monitor/essentials/diagnostic-settings#destination-limitations). The following limitations apply only to monitoring Azure Storage accounts.

- You can't send logs to the same storage account that you're monitoring with this setting. 
  This would lead to recursive logs in which a log entry describes the writing of another log entry. You must create an account or use another existing account to store log information.

- You can't set a retention policy. 

  If you archive logs to a storage account, you can manage the retention policy of a log container by defining a lifecycle management policy. To learn how, see [Optimize costs by automating Azure Blob Storage access tiers](lifecycle-management-overview.md).

  If you send logs to Log Analytics, you can manage the data retention period of Log Analytics at the workspace level or even specify different retention settings by data type. To learn how, see [Change the data retention period](/azure/azure-monitor/logs/data-retention-archive).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<a name="analyzing-logs"></a>
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze metrics for Azure Blob Storage

Metrics for Azure Blob Storage are in these namespaces:

- Microsoft.Storage/storageAccounts
- Microsoft.Storage/storageAccounts/blobServices

For a complete list of the dimensions that Azure Storage supports, see [Metrics dimensions](monitor-blob-storage-reference.md#metrics-dimensions).

### [Azure portal](#tab/azure-portal)

You can analyze metrics for Azure Storage with metrics from other Azure services by using Metrics Explorer. Open Metrics Explorer by choosing **Metrics** from the **Azure Monitor** menu. For details on using this tool, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics).

This example shows how to view **Transactions** at the account level.

![Screenshot of accessing metrics in the Azure portal](./media/monitor-blob-storage/access-metrics-portal.png)

For metrics that support dimensions, you can filter the metric with the desired dimension value. This example shows how to view **Transactions** at the account level on a specific operation by selecting values for the **API Name** dimension.

![Screenshot of accessing metrics with dimension in the Azure portal](./media/monitor-blob-storage/access-metrics-portal-with-dimension.png)

### [PowerShell](#tab/azure-powershell)

#### List the metric definition

You can list the metric definition of your storage account or the Blob storage service. Use the [Get-AzMetricDefinition](/powershell/module/az.monitor/get-azmetricdefinition) cmdlet.

In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Blob storage service. You can find these resource IDs on the **Endpoints** pages of your storage account in the Azure portal.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetricDefinition -ResourceId $resourceId
```

#### Read metric values

You can read account-level metric values of your storage account or the Blob storage service. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetric -ResourceId $resourceId -MetricName "UsedCapacity" -TimeGrain 01:00:00
```

#### Read metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
$resourceId = "<resource-ID>"
$dimFilter = [String](New-AzMetricFilter -Dimension ApiName -Operator eq -Value "GetBlob" 3> $null)
Get-AzMetric -ResourceId $resourceId -MetricName Transactions -TimeGrain 01:00:00 -MetricFilter $dimFilter -AggregationType "Total"
```

### [Azure CLI](#tab/azure-cli)

#### List the account-level metric definition

You can list the metric definition of your storage account or the Blob storage service. Use the [az monitor metrics list-definitions](/cli/azure/monitor/metrics#az-monitor-metrics-list-definitions) command.

In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Blob storage service. You can find these resource IDs on the **Endpoints** pages of your storage account in the Azure portal.

```azurecli
   az monitor metrics list-definitions --resource <resource-ID>
```

#### Read account-level metric values

You can read the metric values of your storage account or the Blob storage service. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli
   az monitor metrics list --resource <resource-ID> --metric "UsedCapacity" --interval PT1H
```

#### Read metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli
az monitor metrics list --resource <resource-ID> --metric "Transactions" --interval PT1H --filter "ApiName eq 'GetBlob' " --aggregation "Total" 
```

### [.NET](#tab/dotnet)

Azure Monitor provides the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/) to read metric definition and values. The [sample code](https://azure.microsoft.com/resources/samples/monitor-dotnet-metrics-api/) shows how to use the SDK with different parameters. You need to use `0.18.0-preview` or a later version for storage metrics.

In these examples, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the Blob storage service. You can find these resource IDs on the **Endpoints** pages of your storage account in the Azure portal.

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
        // Resource ID for blob storage
        var resourceId = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/blobServices/default";
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

---

### Analyze logs for Azure Blob Storage

You can access resource logs either as a blob in a storage account, as event data, or through Log Analytics queries. For information about how to find those logs, see [Azure resource logs](/azure/azure-monitor/essentials/resource-logs).

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages).

Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its file endpoint but not in its table or queue endpoints, only logs that pertain to the Azure Blob Storage service are created. Azure Storage logs contain detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

When you view a storage account in the Azure portal, the operations called by the portal are also logged. For this reason, you may see operations logged in a storage account even though you haven't written any data to the account.

#### Log authenticated requests

 The following types of authenticated requests are logged:

- Successful requests
- Failed requests, including time-out, throttling, network, authorization, and other errors
- Requests that use a shared access signature (SAS) or OAuth, including failed and successful requests
- Requests to analytics data (classic log data in the **$logs** container and class metric data in the **$metric** tables)

Requests made by the Blob storage service itself, such as log creation or deletion, aren't logged. For a full list of the logged data, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage log format](monitor-blob-storage-reference.md).

> [!NOTE]
> Azure Monitor currently filters out logs that describe activity in the "insights-logs-" container.

#### Log anonymous requests

 The following types of anonymous requests are logged:

- Successful requests
- Server errors
- Time out errors for both client and server
- Failed GET requests with the error code 304 (Not Modified)

All other failed anonymous requests aren't logged. For a full list of the logged data, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage log format](monitor-blob-storage-reference.md).

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Here are some queries that you can enter in the **Log search** bar to help you monitor your Blob storage. These queries work with the [new language](/azure/azure-monitor/logs/log-query-overview).

- To list the 10 most common errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText !contains "Success"
    | summarize count() by StatusText
    | top 10 by count_ desc
    ```

- To list the top 10 operations that caused the most errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText !contains "Success"
    | summarize count() by OperationName
    | top 10 by count_ desc
    ```

- To list the top 10 operations with the longest end-to-end latency over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d)
    | top 10 by DurationMs desc
    | project TimeGenerated, OperationName, DurationMs, ServerLatencyMs, ClientLatencyMs = DurationMs - ServerLatencyMs
    ```

- To list all operations that caused server-side throttling errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText contains "ServerBusy"
    | project TimeGenerated, OperationName, StatusCode, StatusText
    ```

- To list all requests with anonymous access over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and AuthenticationType == "Anonymous"
    | project TimeGenerated, OperationName, AuthenticationType, Uri
    ```

- To create a pie chart of operations used over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d)
    | summarize count() by OperationName
    | sort by count_ desc
    | render piechart
    ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Blob Storage alert rules
The following table lists common and recommended alert rules for Azure Blob Storage and the proper metric to use for the alert:

| Alert type | Condition | Description |
|-|-|-|
| Metric | Blob Storage service is throttled. | Transactions<br>Dimension name: Response type |
| Metric | Blob Storage requests are successful 99% of the time. | Availability<br>Dimension names: Geo type, API name, Authentication |
| Metric | Blob Storage egress has exceeded 500 GiB in one day. | Egress<br>Dimension names: Geo type, API name, Authentication |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

Other Blob Storage monitoring content:
- [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md). A reference of the logs and metrics created by Azure Blob Storage.
- [Best practices for monitoring Azure Blob Storage](blob-storage-monitoring-scenarios.md). Guidance for common monitoring and troubleshooting scenarios.
- [Metrics and logs FAQ](storage-blob-faq.yml#metrics-and-logs).

Overall Azure Storage monitoring content:
- [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md). Get a unified view of storage performance, capacity, and availability.
- [Transition to metrics in Azure Monitor](../common/storage-metrics-migration.md). Move from Storage Analytics metrics to metrics in Azure Monitor.
- [Troubleshoot performance issues](../common/troubleshoot-storage-performance.md?toc=/azure/storage/blobs/toc.json). See common performance issues and guidance about how to troubleshoot them.
- [Troubleshoot availability issues](../common/troubleshoot-storage-availability.md?toc=/azure/storage/blobs/toc.json). See common availability issues and guidance about how to troubleshoot them.
- [Troubleshoot client application errors](../common/troubleshoot-storage-client-application-errors.md?toc=/azure/storage/blobs/toc.json). See common issues with connecting clients and how to troubleshoot them.

Azure Monitor content:
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource). General details on monitoring Azure resources.
- [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics). The basics of metrics and metric dimensions.
- [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs). The basics of logs and how to collect and analyze them.
- [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics). A tour of Metrics Explorer.
- [Overview of Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview). A tour of Log Analytics.

Training modules:
- [Gather metrics from your Azure Blob Storage containers](/training/modules/gather-metrics-blob-storage/). Create charts that show metrics, with step-by-step guidance.
- [Monitor, diagnose, and troubleshoot your Azure Storage](/training/modules/monitor-diagnose-and-troubleshoot-azure-storage/). Troubleshoot storage account issues, with step-by-step guidance.

