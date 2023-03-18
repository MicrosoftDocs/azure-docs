---
title: Monitoring Copy Logs in Azure Storage Mover
description: Learn how to monitor the status of Azure Storage Mover migration jobs.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/17/2023
---

# Monitoring Azure Storage Mover copy and job logs

When you use a migration tool to move your critical data from on-premise sources to Azure destination targets, you want to monitor copy operations for outages and errors. Monitoring includes metrics and logs that provide visibility into the success of your migration. **Copy logs** and **Job run logs** are especially useful because they allow you to trace the migration result of individual files. Metrics relating to **Job run metrics** are also available, and can be analyzed to help pinpoint periods of low performance and other trends.

Logs and metrics can be sent or streamed to the destinations listed in the following table. To ensure the security of data in transit, we strongly encourage you to configure Transport Layer Security (TLS). All destination endpoints support TLS 1.2.

| Destination                           | Description |
|:--------------------------------------|:------------|
| **Log Analytics workspace**           | Metrics are converted to log form. This option might not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.
| **Azure Storage account**             | Archiving logs and metrics to a Storage account is useful for audit, static analysis, or backup. Compared to using Azure Monitor Logs or a Log Analytics workspace, Storage is less expensive, and logs can be kept there indefinitely.  |
| **Azure Event Hubs**                  | When you send logs and metrics to Event Hubs, you can stream data to external systems such as third-party SIEMs and other Log Analytics solutions.  |
| **Azure Monitor partner integrations**| Specialized integrations can be made between Azure Monitor and other non-Microsoft monitoring platforms. Integration is useful when you're already using one of the partners.  |

This article describes the monitoring data reported from Azure Storage Mover, and how you can use the features of Azure Monitor to analyze errors during the migration. All other destinations are outside the scope of this article, but can be referenced in the [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring&tabs=portal) article.

## What is Azure Monitor?

Azure Storage Mover sends copy and job run monitoring data to Azure Monitor, Azure's full stack monitoring service. The Azure Monitor service provides a complete set of features to monitor your Azure resources and resources in other clouds and on-premises.

One of Azure Monitor's most useful features is the Log Analytics tool. The Log Analytics tool is designed to help you monitor your migration projects by enabling you to  edit and run log queries against your copy and job logs.

You can read more about Azure Monitor by visiting the [Azure Monitor overview](../azure-monitor/overview.md) article.

## Configuring Azure Monitor and Storage Mover

Before you can view the logs generated during your migration, you'll need to ensure that you've configured both Azure Monitor and your Storage Mover instance. This section briefly describes how to configure an Azure Monitor Log Analytics Workspace and Storage Mover diagnostic settings. After completing the following steps, you'll be able to query the data provided by your Storage Mover resource.

### Create a Log Analytics workspace

Storage Mover collects copy and job logs, and stores the information in an Azure Log Analytics workspace. You can create multiple workspaces, but each workspace must have a unique workspace ID and resource ID for a given resource group. After you've created a workspace you can configure Storage Mover to save its data there. If you don't have an existing worksapce, you can quickly create one in the Azure portal.

Enter **Log Analytics** in the search box and select **Log Analytics workspaces**. In the content pane, select either **Create** or **Create log analytics workspace** to create a workspace. Provide values for the **Subscription**, **Resource Group**, **Name**, and **Region** fields, and select **Review + Crerate**.

:::image type="content" source="media/log-monitoring/create-workspace-sml.png" lightbox="media/log-monitoring/create-workspace-lrg.png" alt-text="This image illustrates the methods of creating an Azure Analytics Workspace." :::

You can get more detailed information about Log Analytics and its features by visiting the [Log Analytics overview](/azure/azure-monitor/logs/log-analytics-overview) article. If you prefer to view a tutorial, you can visit the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial) instead.

### Configure Storage Mover diagnostic settings

After an analytics workspace has been created, you can specify it as the destination in which Storage Mover logs and metrics can be displayed.

There are two options for configuring Storage Mover to send logs to your analytics workspace. First, you have the option to configure diagnostic settings during the initial deployment of your top-level Storage Mover resource. The following example shows how to specify diagnostic settings in the Azure portal during Storage Mover resource creation.

:::image type="content" source="media/log-monitoring/configure-monitoring-sml.png" lightbox="media/log-monitoring/configure-monitoring-lrg.png" alt-text="This image highlights the ability to enable monitoring during initial deployment." :::

You also have the option to add a diagnostic setting to a Storage Mover resource after it's been deployed. To add the diagnostic setting, navigate to the Storage Mover resource. In the menu pane, select **Diagnostic settings** and then select **Add diagnostic setting** as shown in the following example.

:::image type="content" source="media/log-monitoring/diagnostic-settings-sml.png" lightbox="media/log-monitoring/diagnostic-settings-lrg.png" alt-text="This image highlights the ability to add a diagnostic setting after deployment." :::

## Monitoring data

Azure Blob Storage collects the same kinds of monitoring data as other Azure resources, which are described in [Monitoring data from Azure resources](../../azure-monitor/essentials/monitor-azure-resource.md#monitoring-data).

See [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md) for detailed information on the metrics and logs metrics created by Azure Blob Storage.

Metrics and logs in Azure Monitor support only Azure Resource Manager storage accounts. Azure Monitor doesn't support classic storage accounts. If you want to use metrics or logs on a classic storage account, you need to migrate to an Azure Resource Manager storage account. For more information, see [Migrate to Azure Resource Manager](../../virtual-machines/migration-classic-resource-manager-overview.md).

You can continue using classic metrics and logs if you want to. In fact, classic metrics and logs are available in parallel with metrics and logs in Azure Monitor. The support remains in place until Azure Storage ends the service on legacy metrics and logs.

## Collection and routing

Platform metrics and the Activity log are collected and stored automatically, but can be routed to other locations by using a diagnostic setting.  

Resource Logs aren't collected and stored until you create a diagnostic setting and route them to one or more locations.

To collect resource logs, you must create a diagnostic setting. When you create the setting, choose **blob** as the type of storage that you want to enable logs for. Then, specify one of the following categories of operations for which you want to collect logs.

| Category | Description |
|:---|:---|
| StorageRead | Read operations on objects. |
| StorageWrite | Write operations on objects. |
| StorageDelete | Delete operations on objects. |

> [!NOTE]
> Data Lake Storage Gen2 doesn't appear as a storage type. That's because Data Lake Storage Gen2 is a set of capabilities available to Blob storage.

See [Create diagnostic setting to collect platform logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, and PowerShell. You can also find links to information about how to create a diagnostic setting by using an Azure Resource Manager template or an Azure Policy definition.

## Destination limitations

For general destination limitations, see [Destination limitations](../../azure-monitor/essentials/diagnostic-settings.md#destination-limitations). The following limitations apply only to monitoring Azure Storage accounts.

- You can't send logs to the same storage account that you're monitoring with this setting. 

  This would lead to recursive logs in which a log entry describes the writing of another log entry. You must create an account or use another existing account to store log information.

- You can't set a retention policy. 

  If you archive logs to a storage account, you can manage the retention policy of a log container by defining a lifecycle management policy. To learn how, see [Optimize costs by automating Azure Blob Storage access tiers](lifecycle-management-overview.md).

  If you send logs to Log Analytics, you can manage the data retention period of Log Analytics at the workspace level or even specify different retention settings by data type. To learn how, see [Change the data retention period](../../azure-monitor/logs/data-retention-archive.md).

## Analyzing metrics

For a list of all Azure Monitor support metrics, which includes Azure Blob Storage, see [Azure Monitor supported metrics](../../azure-monitor/essentials/metrics-supported.md).

### [Azure portal](#tab/azure-portal)

You can analyze metrics for Azure Storage with metrics from other Azure services by using Metrics Explorer. Open Metrics Explorer by choosing **Metrics** from the **Azure Monitor** menu. For details on using this tool, see [Getting started with Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md).

This example shows how to view **Transactions** at the account level.

![Screenshot of accessing metrics in the Azure portal](./media/monitor-blob-storage/access-metrics-portal.png)

For metrics that support dimensions, you can filter the metric with the desired dimension value. This example shows how to view **Transactions** at the account level on a specific operation by selecting values for the **API Name** dimension.

![Screenshot of accessing metrics with dimension in the Azure portal](./media/monitor-blob-storage/access-metrics-portal-with-dimension.png)

For a complete list of the dimensions that Azure Storage supports, see [Metrics dimensions](monitor-blob-storage-reference.md#metrics-dimensions).

Metrics for Azure Blob Storage are in these namespaces:

- Microsoft.Storage/storageAccounts
- Microsoft.Storage/storageAccounts/blobServices

### [PowerShell](#tab/azure-powershell)

#### List the metric definition

You can list the metric definition of your storage account or the Blob storage service. Use the [Get-AzMetricDefinition](/powershell/module/az.monitor/get-azmetricdefinition) cmdlet.

In this example, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the resource ID of the Blob storage service. You can find these resource IDs on the **Endpoints** pages of your storage account in the Azure portal.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetricDefinition -ResourceId $resourceId
```

#### Reading metric values

You can read account-level metric values of your storage account or the Blob storage service. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
   $resourceId = "<resource-ID>"
   Get-AzMetric -ResourceId $resourceId -MetricName "UsedCapacity" -TimeGrain 01:00:00
```

#### Reading metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [Get-AzMetric](/powershell/module/Az.Monitor/Get-AzMetric) cmdlet.

```powershell
$resourceId = "<resource-ID>"
$dimFilter = [String](New-AzMetricFilter -Dimension ApiName -Operator eq -Value "GetBlob" 3> $null)
Get-AzMetric -ResourceId $resourceId -MetricName Transactions -TimeGrain 01:00:00 -MetricFilter $dimFilter -AggregationType "Total"
```

### [Azure CLI](#tab/azure-cli)

For a list of all Azure Monitor support metrics, which includes Azure Blob Storage, see [Azure Monitor supported metrics](../../azure-monitor/essentials/metrics-supported.md).

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

#### Reading metric values with dimensions

When a metric supports dimensions, you can read metric values and filter them by using dimension values. Use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command.

```azurecli
az monitor metrics list --resource <resource-ID> --metric "Transactions" --interval PT1H --filter "ApiName eq 'GetBlob' " --aggregation "Total" 
```

### [.NET](#tab/dotnet)

Azure Monitor provides the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/) to read metric definition and values. The [sample code](https://azure.microsoft.com/resources/samples/monitor-dotnet-metrics-api/) shows how to use the SDK with different parameters. You need to use `0.18.0-preview` or a later version for storage metrics.

In these examples, replace the `<resource-ID>` placeholder with the resource ID of the entire storage account or the Blob storage service. You can find these resource IDs on the **Endpoints** pages of your storage account in the Azure portal.

Replace the `<subscription-ID>` variable with the ID of your subscription. For guidance on how to obtain values for `<tenant-ID>`, `<application-ID>`, and `<AccessKey>`, see [Use the portal to create an Azure AD application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md).

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
            // Enumrate metric definition:
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

#### Reading account-level metric values

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
            // Enumrate metric value
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

#### Reading multidimensional metric values

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
            //Enumrate metric value
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

## Analyzing logs

You can access resource logs either as a blob in a storage account, as event data, or through Log Analytics queries. For information about how to find those logs, see [Azure resource logs](../../azure-monitor/essentials/resource-logs.md).

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](../../azure-monitor/essentials/resource-logs-schema.md). The schema for Azure Blob Storage resource logs is found in [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md).

To get the list of SMB and REST operations that are logged, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages).

Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its file endpoint but not in its table or queue endpoints, only logs that pertain to the Azure Blob Storage service are created. Azure Storage logs contain detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

The [Activity log](../../azure-monitor/essentials/activity-log.md) is a type of platform log located in Azure that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.  

When you view a storage account in the Azure portal, the operations called by the portal are also logged. For this reason, you may see operations logged in a storage account even though you haven't written any data to the account.

### Log authenticated requests

 The following types of authenticated requests are logged:

- Successful requests
- Failed requests, including time-out, throttling, network, authorization, and other errors
- Requests that use a shared access signature (SAS) or OAuth, including failed and successful requests
- Requests to analytics data (classic log data in the **$logs** container and class metric data in the **$metric** tables)

Requests made by the Blob storage service itself, such as log creation or deletion, aren't logged. For a full list of the logged data, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage log format](monitor-blob-storage-reference.md).

> [!NOTE]
> Azure Monitor currently filters out logs that describe activity in the "insights-logs-" container. You can track activities in that container by using storage analytics (classic logs).

### Log anonymous requests

 The following types of anonymous requests are logged:

- Successful requests
- Server errors
- Time out errors for both client and server
- Failed GET requests with the error code 304 (Not Modified)

All other failed anonymous requests aren't logged. For a full list of the logged data, see [Storage logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage log format](monitor-blob-storage-reference.md).

### Sample Kusto queries

If you send logs to Log Analytics, you can access those logs by using Azure Monitor log queries. For more information, see [Log Analytics tutorial](../../azure-monitor/logs/log-analytics-tutorial.md).

Here are some queries that you can enter in the **Log search** bar to help you monitor your Blob storage. These queries work with the [new language](../../azure-monitor/logs/log-query-overview.md).

> [!IMPORTANT]
> When you select **Logs** from the storage account resource group menu, Log Analytics is opened with the query scope set to the current resource group. This means that log queries will only include data from that resource group. If you want to run a query that includes data from other resources or data from other Azure services, select **Logs** from the **Azure Monitor** menu. See [Log query scope and time range in Azure Monitor Log Analytics](../../azure-monitor/logs/scope.md) for details.

Use these queries to help you monitor your Azure Storage accounts:

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

## Alerts

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](../../azure-monitor/alerts/alerts-metric-overview.md), [logs](../../azure-monitor/alerts/alerts-unified-log.md), and the [activity log](../../azure-monitor/alerts/activity-log-alerts.md). 

The following table lists some example scenarios to monitor and the proper metric to use for the alert:

| Scenario | Metric to use for alert |
|-|-|
| Blob Storage service is throttled. | Metric: Transactions<br>Dimension name: Response type |
| Blob Storage requests are successful 99% of the time. | Metric: Availability<br>Dimension names: Geo type, API name, Authentication |
| Blob Storage egress has exceeded 500 GiB in one day. | Metric: Egress<br>Dimension names: Geo type, API name, Authentication |

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## FAQ

**Does Azure Storage support metrics for Managed Disks or Unmanaged Disks?**

No. Azure Compute supports the metrics on disks. For more information, see [Per disk metrics for Managed and Unmanaged Disks](https://azure.microsoft.com/blog/per-disk-metrics-managed-disks/).

**What does a dashed line in an Azure Metric chart indicate?**

Some Azure metrics charts, such as the ones that display availability and latency data, use a dashed line to indicate that there's a missing value (also known as null value) between two known time grain data points. For example, if in the time selector you picked `1 minute` time granularity, but the metric was reported at 07:26, 07:27, 07:29, and 07:30, then a dashed line connects 07:27 and 07:29 because there's a minute gap between those two data points. A solid line connects all other data points. The dashed line drops down to zero when the metric uses count and sum aggregation. For the avg, min or max aggregations, a dashed line connects the two nearest known data points. Also, when the data is missing on the rightmost or leftmost side of the chart, the dashed line expands to the direction of the missing data point.

**How do I track availability of my storage account?**

You can configure a resource health alert based on the [Azure Resource Health](../../service-health/resource-health-overview.md) service to track the availability of your storage account. If there are no transactions on the account, then the alert reports based on the health of the Storage cluster where your storage account is located.

## Next steps

Get started with any of these guides.

| Guide | Description |
|---|---|
| [Gather metrics from your Azure Blob Storage containers](/training/modules/gather-metrics-blob-storage/) | Create charts that show metrics (Contains step-by-step guidance). |
| [Monitor, diagnose, and troubleshoot your Azure Storage](/training/modules/monitor-diagnose-and-troubleshoot-azure-storage/) | Troubleshoot storage account issues (contains step-by-step guidance). |
| [Monitor storage with Azure Monitor Storage insights](../common/storage-insights-overview.md) | A unified view of storage performance, capacity, and availability |
| [Best practices for monitoring Azure Blob Storage](blob-storage-monitoring-scenarios.md) | Guidance for common monitoring and troubleshooting scenarios. | 
| [Getting started with Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md) | A tour of Metrics Explorer. 
| [Overview of Log Analytics in Azure Monitor](../../azure-monitor/logs/log-analytics-overview.md) | A tour of Log Analytics. |
| [Azure Monitor Metrics overview](../../azure-monitor/essentials/data-platform-metrics.md) | The basics of metrics and metric dimensions  |
| [Azure Monitor Logs overview](../../azure-monitor/logs/data-platform-logs.md)| The basics of logs and how to collect and analyze them |
| [Transition to metrics in Azure Monitor](../common/storage-metrics-migration.md) | Move from Storage Analytics metrics to metrics in Azure Monitor. |
| [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md) | A reference of the logs and metrics created by Azure Blob Storage |
| [Troubleshoot performance issues](../common/troubleshoot-storage-performance.md?toc=/azure/storage/blobs/toc.json)| Common performance issues and guidance about how to troubleshoot them. |
| [Troubleshoot availability issues](../common/troubleshoot-storage-availability.md?toc=/azure/storage/blobs/toc.json)| Common availability issues and guidance about how to troubleshoot them.|
| [Troubleshoot client application errors](../common/troubleshoot-storage-client-application-errors.md?toc=/azure/storage/blobs/toc.json)| Common issues with connecting clients and how to troubleshoot them.|