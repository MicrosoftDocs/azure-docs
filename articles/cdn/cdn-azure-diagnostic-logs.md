---
title: Diagnostic logs
titleSuffix: Azure Content Delivery Network
description: Learn how to use Azure diagnostic logs to save core analytics, which allows you to export usage metrics from your Azure Content Delivery Network endpoint.
services: cdn
author: duongau
manager: KumudD
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 02/27/2023
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Diagnostic logs - Azure Content Delivery Network

With Azure diagnostic logs, you can view core analytics and save them into one or more destinations including:

* Azure Storage account
* Log Analytics workspace
* Azure Event Hubs

This feature is available on CDN endpoints for all pricing tiers. 

Diagnostics logs allow you to export basic usage metrics from your CDN endpoint to different kinds sources so that you can consume them in a customized way. You can do the following types of data export:

* Export data to blob storage, export to CSV, and generate graphs in Excel.
* Export data to Event Hubs and correlate with data from other Azure services.
* Export data to Azure Monitor logs and view data in your own Log Analytics workspace

An Azure CDN profile is required for the following steps. Refer to [create an Azure CDN profile and endpoint](cdn-create-new-endpoint.md) before you continue.

## Enable logging with the Azure portal

Follow these steps enable logging for your Azure CDN endpoint:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, navigate to **All resources** > **your-cdn-profile**.

2. Select the CDN endpoint for which you want to enable diagnostics logs:

    :::image type="content" source="./media/cdn-diagnostics-log/02_browse-to-diagnostics-logs.png" alt-text="Select CDN endpoint." border="true":::

3. Select **Diagnostics logs** in the **Monitoring** section:

    :::image type="content" source="./media/cdn-diagnostics-log/03_diagnostics-logs-options.png" alt-text="Screenshot of the diagnostics logs button under monitoring menu." border="true":::

### Enable logging with Azure Storage

To use a storage account to store the logs, follow these steps:

 >[!NOTE] 
 >A storage account is required to complete these steps. Refer to: **[Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal&toc=%2fazure%2fstorage%2fblobs%2ftoc.json)** for more information.
	
1. For **Diagnostic setting name**, enter a name for your diagnostic log settings.
 
2. Select **Archive to a storage account**, then select **CoreAnalytics**. 

3. For **Retention (days)**, choose the number of retention days. A retention of zero days stores the logs indefinitely. 

4. Select the subscription and storage account for the logs.

    :::image type="content" source="./media/cdn-diagnostics-log/04_diagnostics-logs-storage.png" alt-text="Diagnostics logs - Storage." border="true":::

3. Select **Save**.

### Send to Log Analytics

To use Log Analytics for the logs, follow these steps:

>[!NOTE] 
>A log analytics workspace is required to complete these steps. Refer to: **[Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md)** for more information.
	
1. For **Diagnostic setting name**, enter a name for your diagnostic log settings.

2. Select **Send to Log Analytics**, then select **CoreAnalytics**. 

3. Select the subscription and Log Analytics workspace for the logs.

   :::image type="content" source="./media/cdn-diagnostics-log/05-la-workspace.png" alt-text="Diagnostics logs - Log Analytics." border="true":::

4. Select **Save**.

### Stream to an event hub

To use an event hub for the logs, follow these steps:

>[!NOTE] 
>An event hub is required to complete these steps. Refer to: **[Quickstart: Create an event hub using Azure portal](../event-hubs/event-hubs-create.md)** for more information.
	
1. For **Diagnostic setting name**, enter a name for your diagnostic log settings.

2. Select **Stream to an event hub**, then select **CoreAnalytics**. 

3. Select the subscription and event hub namespace for the logs.

   :::image type="content" source="./media/cdn-diagnostics-log/06-eventhub-namespace.png" alt-text="Diagnostics logs - Event hub." border="true":::

4. Select **Save**.


## Enable logging with PowerShell

The following example shows how to enable diagnostic logs via the Azure PowerShell Cmdlets.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Enable diagnostic logs in a storage account

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```

2. To enable Diagnostic Logs in a storage account, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $storageacct = <your-storage-account-name>
    $diagname = <your-diagnostic-setting-name>

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    $storage = Get-AzStorageAccount -ResourceGroupName $rsg -Name $storageacct

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -StorageAccountId $storage.id -Enabled $true -Categories CoreAnalytics
    ```

### Enable diagnostics logs for Log Analytics workspace

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```
2. To enable Diagnostic Logs for a Log Analytics workspace, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $workspacename = <your-log-analytics-workspace-name>
    $diagname = <your-diagnostic-setting-name>

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    $workspace = Get-AzOperationalInsightsWorkspace -ResourceGroupName $rsg -Name $workspacename

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -WorkspaceId $workspace.ResourceId -Enabled $true -Categories CoreAnalytics
    ```
### Enable diagnostics logs for event hub namespace

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```
2. To enable Diagnostic Logs for a Log Analytics workspace, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $eventhubname = <your-event-hub-namespace-name>
    $diagname = <your-diagnostic-setting-name>

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -EventHubName $eventhubname -Enabled $true -Categories CoreAnalytics
    ```

## Consuming diagnostics logs from Azure Storage
This section describes the schema of CDN core analytics, organization in an Azure storage account, and provides sample code to download the logs in a CSV file.

### Using Microsoft Azure Storage Explorer
To download the tool, see [Azure Storage Explorer](https://storageexplorer.com/). After downloading and installing the software, configure it to use the same Azure storage account that was configured as a destination to the CDN Diagnostics Logs.

1.	Open **Microsoft Azure Storage Explorer**
2.	Locate the storage account
3.	Expand the **Blob Containers** node under this storage account.
4.	Select the container named *insights-logs-coreanalytics*.
5.	Results show up on the right-hand pane, starting with the first level, as *resourceId=*. Continue selecting each level until you find the file *PT1H.json*. For an explanation of the path, see [Blob path format](cdn-azure-diagnostic-logs.md#blob-path-format).
6.	Each blob *PT1H.json* file represents the analytics logs for one hour for a specific CDN endpoint or its custom domain.
7.	The schema of the contents of this JSON file is described in the section schema of the core analytics logs.

#### Blob path format

Core analytics logs are generated every hour and the data is collected and stored inside a single Azure blob as a JSON payload. Storage explorer tool interprets '/' as a directory separator and shows the hierarchy. The path to the Azure blob appears as if there's a hierarchical structure and represents the blob name. The name of the blob follows the following naming convention:

`resourceId=/SUBSCRIPTIONS/{Subscription Id}/RESOURCEGROUPS/{Resource Group Name}/PROVIDERS/MICROSOFT.CDN/PROFILES/{Profile Name}/ENDPOINTS/{Endpoint Name}/ y=/m=/d=/h=/m=/PT1H.json`

**Description of fields:**

|Value|Description|
|-------|---------|
|Subscription ID	|ID of the Azure subscription in Guid format.|
|Resource Group Name |Name of the resource group to which the CDN resources belong.|
|Profile Name |Name of the CDN Profile|
|Endpoint Name |Name of the CDN Endpoint|
|Year|	Four-digit representation of the year, for example, 2017|
|Month|	Two-digit representation of the month number. 01=January ... 12=December|
|Day|	Two-digit representation of the day of the month|
|PT1H.json|	Actual JSON file where the analytics data is stored|

### Exporting the core analytics data to a CSV file

To access core analytics, sample code for a tool is provided. This tool allows downloading the JSON files into a flat comma-separated file format, which can be used to create charts or other aggregations.

Here's how you can use the tool:

1.	Visit the GitHub link: [https://github.com/Azure-Samples/azure-cdn-samples/tree/master/CoreAnalytics-ExportToCsv](https://github.com/Azure-Samples/azure-cdn-samples/tree/master/CoreAnalytics-ExportToCsv)
2.	Download the code.
3.	Follow the instructions to compile and configure.
4.	Run the tool.
5.	The resulting CSV file shows the analytics data in a simple flat hierarchy.

## Log data delays

The following table shows log data delays for **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Akamai**, and **Azure CDN Standard/Premium from Edgio**.

Microsoft log data delays | Edgio log data delays | Akamai log data delays
--- | --- | ---
Delayed by 1 hour. | Delayed by 1 hour and can take up to 2 hours to start appearing after endpoint propagation completion. | Delayed by 24 hours; if it was created more than 24 hours ago, it takes up to 2 hours to start appearing. If it was recently created, it can take up to 25 hours for the logs to start appearing.

## Diagnostic log types for CDN core analytics

Microsoft currently offers core analytics logs only, which contain metrics showing HTTP response statistics and egress statistics as seen from the CDN POPs/edges.

### Core analytics metrics details
The following table shows a list of metrics available in the core analytics logs for:

* **Azure CDN Standard from Microsoft**
* **Azure CDN Standard from Akamai**
* **Azure CDN Standard/Premium from Edgio**

Not all metrics are available from all providers, although such differences are minimal. The table also displays whether a given metric is available from a provider. The metrics are available for only those CDN endpoints that have traffic on them.


|Metric                     | Description | Microsoft | Edgio | Akamai |
|---------------------------|-------------|-----------|---------|--------|
| RequestCountTotal         | Total number of request hits during this period. | Yes | Yes |Yes |
| RequestCountHttpStatus2xx | Count of all requests that resulted in a 2xx HTTP code (for example, 200, 202). | Yes | Yes |Yes |
| RequestCountHttpStatus3xx | Count of all requests that resulted in a 3xx HTTP code (for example, 300, 302). | Yes | Yes |Yes |
| RequestCountHttpStatus4xx | Count of all requests that resulted in a 4xx HTTP code (for example, 400, 404). | Yes | Yes |Yes |
| RequestCountHttpStatus5xx | Count of all requests that resulted in a 5xx HTTP code (for example, 500, 504). | Yes | Yes |Yes |
| RequestCountHttpStatusOthers | Count of all other HTTP codes (outside of 2xx-5xx). | Yes | Yes |Yes |
| RequestCountHttpStatus200 | Count of all requests that resulted in a 200 HTTP code response. | Yes | No  |Yes |
| RequestCountHttpStatus206 | Count of all requests that resulted in a 206 HTTP code response. | Yes | No  |Yes |
| RequestCountHttpStatus302 | Count of all requests that resulted in a 302 HTTP code response. | Yes | No  |Yes |
| RequestCountHttpStatus304 | Count of all requests that resulted in a 304 HTTP code response. | Yes | No  |Yes |
| RequestCountHttpStatus404 | Count of all requests that resulted in a 404 HTTP code response. | Yes | No  |Yes |
| RequestCountCacheHit | Count of all requests that resulted in a Cache hit. The asset was served directly from the POP to the client. | Yes | Yes | No  |
| RequestCountCacheMiss | Count of all requests that resulted in a Cache miss. A Cache miss means the asset wasn't found on the POP closest to the client, and was retrieved from the origin. | Yes | Yes | No |
| RequestCountCacheNoCache | Count of all requests to an asset that are prevented from being cached because of a user configuration on the edge. | Yes | Yes | No |
| RequestCountCacheUncacheable | Count of all requests to assets that are prevented from getting cached by the asset's Cache-Control and Expires headers. This count indicates that it shouldn't be cached on a POP or by the HTTP client. | Yes | Yes | No |
| RequestCountCacheOthers | Count of all requests with cache status not covered by metrics listed previously. | No | Yes | No  |
| EgressTotal | Outbound data transfer in GB | Yes |Yes |Yes |
| EgressHttpStatus2xx | Outbound data transfer* for responses with 2xx HTTP status codes in GB. | Yes | Yes | No  |
| EgressHttpStatus3xx | Outbound data transfer for responses with 3xx HTTP status codes in GB. | Yes | Yes | No  |
| EgressHttpStatus4xx | Outbound data transfer for responses with 4xx HTTP status codes in GB. | Yes | Yes | No  |
| EgressHttpStatus5xx | Outbound data transfer for responses with 5xx HTTP status codes in GB. | Yes | Yes | No |
| EgressHttpStatusOthers | Outbound data transfer for responses with other HTTP status codes in GB. | Yes | Yes | No  |
| EgressCacheHit | Outbound data transfer for responses that were delivered directly from the CDN cache on the CDN POPs/Edges. | Yes | Yes | No |
| EgressCacheMiss. | Outbound data transfer for responses that weren't found on the nearest POP server, and retrieved from the origin server. | Yes | Yes | No |
| EgressCacheNoCache | Outbound data transfer for assets that are prevented from being cached because of a user configuration on the edge. | Yes | Yes | No |
| EgressCacheUncacheable | Outbound data transfer for assets that are prevented from getting cached by the asset's Cache-Control and, or Expires headers. Indicates that it shouldn't be cached on a POP or by the HTTP client. | Yes | Yes | No |
| EgressCacheOthers | Outbound data transfers for other cache scenarios. | No | Yes | No |

*Outbound data transfer refers to traffic delivered from CDN POP servers to the client.


### Schema of the core analytics logs 

All logs are stored in JSON format and each entry has string fields according to the following schema:

```json
    "records": [
        {
            "time": "2017-04-27T01:00:00",
            "resourceId": "<ARM Resource Id of the CDN Endpoint>",
            "operationName": "Microsoft.Cdn/profiles/endpoints/contentDelivery",
            "category": "CoreAnalytics",
            "properties": {
                "DomainName": "<Name of the domain for which the statistics is reported>",
                "RequestCountTotal": integer value,
                "RequestCountHttpStatus2xx": integer value,
                "RequestCountHttpStatus3xx": integer value,
                "RequestCountHttpStatus4xx": integer value,
                "RequestCountHttpStatus5xx": integer value,
                "RequestCountHttpStatusOthers": integer value,
                "RequestCountHttpStatus200": integer value,
                "RequestCountHttpStatus206": integer value,
                "RequestCountHttpStatus302": integer value,
                "RequestCountHttpStatus304": integer value,
                "RequestCountHttpStatus404": integer value,
                "RequestCountCacheHit": integer value,
                "RequestCountCacheMiss": integer value,
                "RequestCountCacheNoCache": integer value,
                "RequestCountCacheUncacheable": integer value,
                "RequestCountCacheOthers": integer value,
                "EgressTotal": double value,
                "EgressHttpStatus2xx": double value,
                "EgressHttpStatus3xx": double value,
                "EgressHttpStatus4xx": double value,
                "EgressHttpStatus5xx": double value,
                "EgressHttpStatusOthers": double value,
                "EgressCacheHit": double value,
                "EgressCacheMiss": double value,
                "EgressCacheNoCache": double value,
                "EgressCacheUncacheable": double value,
                "EgressCacheOthers": double value,
            }
        }

    ]
}
```

Where *time* represents the start time of the hour boundary for which the statistics is reported. A metric unsupported by a CDN provider, instead of a double or integer value, results in a null value. This null value indicates the absence of a metric, and is different from a value of 0. One set of these metrics per domain is configured on the endpoint.

Example properties:

```json
{
     "DomainName": "manlingakamaitest2.azureedge.net",
     "RequestCountTotal": 480,
     "RequestCountHttpStatus2xx": 480,
     "RequestCountHttpStatus3xx": 0,
     "RequestCountHttpStatus4xx": 0,
     "RequestCountHttpStatus5xx": 0,
     "RequestCountHttpStatusOthers": 0,
     "RequestCountHttpStatus200": 480,
     "RequestCountHttpStatus206": 0,
     "RequestCountHttpStatus302": 0,
     "RequestCountHttpStatus304": 0,
     "RequestCountHttpStatus404": 0,
     "RequestCountCacheHit": null,
     "RequestCountCacheMiss": null,
     "RequestCountCacheNoCache": null,
     "RequestCountCacheUncacheable": null,
     "RequestCountCacheOthers": null,
     "EgressTotal": 0.09,
     "EgressHttpStatus2xx": null,
     "EgressHttpStatus3xx": null,
     "EgressHttpStatus4xx": null,
     "EgressHttpStatus5xx": null,
     "EgressHttpStatusOthers": null,
     "EgressCacheHit": null,
     "EgressCacheMiss": null,
     "EgressCacheNoCache": null,
     "EgressCacheUncacheable": null,
     "EgressCacheOthers": null
}

```

## More resources

* [Azure Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md)
* [Core analytics via Azure CDN supplemental portal](./cdn-analyze-usage-patterns.md)
* [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md)
* [Azure Log Analytics REST API](/rest/api/loganalytics)
