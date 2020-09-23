---
title: Monitoring metrics and raw logs for Azure CDN from Microsoft
description: This article describes the Azure CDN from Microsoft monitoring metrics and raw logs.
services: cdn
author: asudbring
manager: KumudD
ms.service: azure-cdn
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 09/25/2020
ms.author: allensu
---

# Monitoring Metrics and Raw Logs for Azure CDN from Microsoft
With Azure CDN from Microsoft, you can monitor resources in the following ways to help you troubleshoot, track, and debug issues. 

* Raw logs provide rich information about every request that CDN receives. Raw logs differ from activity logs. Activity logs provide visibility into the operations done on Azure resources.
* Metrics, which displays 4 key metrics on CDN, including Byte Hit Ratio, Request Count, Response Size and Total Latency. It also provides different dimensions to break down metrics.
* Alert, which allows customer to setup alert for key metrics
* Additional metrics, which allows customers to leverage Azure Log Analytics to enable additional metrics of value. We also provide query samples for a few other metrics under Azure Log Analytics.

> [!IMPORTANT]
> The HTTP raw logs feature is available for Azure CDN from Microsoft.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Configuration - Azure portal

### Azure portal

To configure Raw logs for your Azure CDN from Microsoft profile: 

1. From the Azure portal menu, select **All Resources** >> **\<your-CDN-profile>**.

2. Under **Monitoring**, select **Diagnostics settings**.

3. Select **+ Add diagnostic setting**.

    :::image type="content" source="./media/cdn-raw-logs/raw-logs-01.png" alt-text="Add diagnostic setting for CDN profile." border="true":::
    
    > [!IMPORTANT]
    > Raw logs is only available in the profile level while aggregated http status code logs are available in the endpoint level.

4. Under **Diagnostic settings**, enter a name for the diagnostic setting under **Diagnostic settings name**.

5. Select the **AzureCdnAccessLog** and set the retention in days.

6. Select the **Destination details**. Destination options are:
    * **Send to Log Analytics**
        * Select the **Subscription** and **Log Analytics workspace**.
    * **Archive to a storage account**
        * Select the **Subscription** and the **Storage Account**.
    * **Stream to an event hub**
        * Select the **Subscription**, **Event hub namespace**, **Event hub name (optional)**, and **Event hub policy name**.

    :::image type="content" source="./media/cdn-raw-logs/raw-logs-02.png" alt-text="Configure destination for log settings." border="true":::

7. Select **Save**.

## Configuration - Azure PowerShell

Use [Set-AzDiagnosticSetting](https://docs.microsoft.com/powershell/module/az.monitor/set-azdiagnosticsetting?view=latest) to configure the diagnostic setting for raw logs.

Retention data is defined by the **-RetentionInDays** option in the command.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Enable diagnostic logs in a storage account

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```

2. To enable Diagnostic Logs in a storage account, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    ## Variables for the commands ##
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $storageacct = <your-storage-account-name>
    $diagname = <your-diagnostic-setting-name>
    $days = '30'

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    $storage = Get-AzStorageAccount -ResourceGroupName $rsg -Name $storageacct

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -StorageAccountId $storage.id -Enabled $true -Category AzureCdnAccessLog -RetentionEnabled 1 -RetentionInDays $days
    ```

### Enable diagnostics logs for Log Analytics workspace

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```
2. To enable Diagnostic Logs for a Log Analytics workspace, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    ## Variables for the commands ##
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $workspacename = <your-log-analytics-workspace-name>
    $diagname = <your-diagnostic-setting-name>
    $days = '30'

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    $workspace = Get-AzOperationalInsightsWorkspace -ResourceGroupName $rsg -Name $workspacename

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -WorkspaceId $workspace.ResourceId -Enabled $true -Category AzureCdnAccessLog -RetentionEnabled 1 -RetentionInDays $days
    ```
### Enable diagnostics logs for event hub namespace

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```
2. To enable Diagnostic Logs for an event hub namespace, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    ## Variables for the commands ##
    $rsg = <your-resource-group-name>
    $cdnprofile = <your-cdn-profile-name>
    $cdnendpoint = <your-cdn-endpoint-name>
    $evthubnamespace = <your-event-hub-namespace-name>
    $diagname = <your-diagnostic-setting-name>

    $cdn = Get-AzCdnEndpoint -ResourceGroupName $rsg -ProfileName $cdnprofile -EndpointName $cdnendpoint

    $eventhub = Get-AzEventHubNamespace -ResourceGroupName $rsg -Name $eventhubname

    Set-AzDiagnosticSetting -Name $diagname -ResourceId $cdn.id -EventHubName $eventhub.id -Enabled $true -Category AzureCdnAccessLog -RetentionEnabled 1 -RetentionInDays $days
    ```

## Raw logs properties

Azure CDN from Microsoft Service currently provides Raw logs. Raw logs provide individual API requests with each entry having the following schema: 

| Property              | Description                                                                                                                                                                                          |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TrackingReference     | The unique reference string that identifies a request served by Front Door, also sent as X-Azure-Ref header to the client. Required for searching details in the access logs for a specific request. |
| HttpMethod            | HTTP method used by the request.                                                                                                                                                                     |
| HttpVersion           | Type of the request or connection.                                                                                                                                                                   |
| RequestUri            | URI of the received request.                                                                                                                                                                         |
| RequestBytes          | The size of the HTTP request message in bytes, including the request headers and the request body.                                                                                                   |
| ResponseBytes         | Bytes sent by the backend server as the response.                                                                                                                                                    |
| UserAgent             | The browser type that the client used.                                                                                                                                                               |
| ClientIp              | The IP address of the client that made the request.                                                                                                                                                  |
| TimeTaken             | The length of time that the action took, in milliseconds.                                                                                                                                            |
| SecurityProtocol      | The TLS/SSL protocol version used by the request or null if no encryption.                                                                                                                           |
| Endpoint              | The CDN endpoint host has configured under the parent CDN profile.                                                                                                                                   |
| Backend Host name     | The name of the backend host or origin where requests are being sent.                                                                                                                                |
| Sent to origin shield </br> (deprecated) * **See note on deprecation below.** | If true, it means that request was answered from origin shield cache instead of the edge pop. Origin shield is a parent cache used to improve cache hit ratio.                                       |
| isReceivedFromClient | If true, it means that the request came from the client. If false, the request is a miss in the edge (child POP) and is responded from origin shield (parent POP). 
| HttpStatusCode        | The HTTP status code returned from the proxy.                                                                                                                                                        |
| HttpStatusDetails     | Resulting status on the request. Meaning of this string value can be found at a Status reference table.                                                                                              |
| Pop                   | The edge pop, which responded to the user request. POPs' abbreviations are airport codes of their respective metros.                                                                                   |
| Cache Status          | Signifies if the object was returned from cache or came from the origin.                                                                                                             |
> [!NOTE]
> The logs can be viewed under your Log Analytics profile by running a query. A sample query would look like:
    ```
    AzureDiagnostics | where Category == "AzureCdnAccessLog"
    ```

### Sent to origin shield deprecation
The raw log property **isSentToOriginShield** has been deprecated and replaced by a new field **isReceivedFromClient**. Use the new field if you're already using the deprecated field. 

Raw logs include logs generated from both CDN edge (child POP) and origin shield. Origin shield refers to parent nodes that are strategically located across the globe. These nodes communicate with origin servers and reduce the traffic load on origin. 

For every request that goes to origin shield, there are 2-log entries:

* One for edge nodes
* One for origin shield. 

To differentiate the egress or responses from the edge nodes vs. origin shield, you can use the field isReceivedFromClient to get the correct data. 

If the value is false, then it means the request is responded from origin shield to edge nodes. This approach is effective to compare raw logs with billing data. Charges aren't incurred for egress from origin shield to the edge nodes. Charges are incurred for egress from the edge nodes to clients. 

**Kusto query sample to exclude logs generated on origin shield in Log Analytics.**

```kusto
AzureDiagnostics 
| where OperationName == "Microsoft.Cdn/Profiles/AccessLog/Write" and Category == "AzureCdnAccessLog"  
| where isReceivedFromClient == true

```

> [!IMPORTANT]
> The HTTP Raw logs feature is available automatically for any profiles created or updated after **25th February 2020**. For CDN profiles created earlier, one should update the CDN endpoint after setting up logging. For example, one can navigate to geo filtering under CDN endpoints and block any country/region not relevant to their workload and hit save.


## Metrics
Azure CDN from Microsoft is integrated with Azure Monitor and publishes 4 CDN metrics to help track, troubleshoot and debug issues. The Metrics are displayed in charts and also accessible via PowerShell, CLI and API. The CDN metrics are free of charge.

If there are requests flowing through Azure CDN from Microsoft, it measures and sends its metrics in 60-second intervals and takes up to 3 mins to appear in the portal. For more information, see Azure Monitor metrics.

**Metrics supported by Azure CDN from Microsoft**

| Metrics         | Description                                                                                                      | Dimension                                                                                   |
|-----------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Bytes Hit ratio* | The percentage of egress from CDN cache, computed against the total egress.                                      | Endpoint                                                                                    |
| RequestCount    | The number of client requests served by CDN.                                                                     | Endpoint </br> Client country </br> Client region </br> HTTP status </br> HTTP status group |
| ResponseSize    | The number of bytes sent as responses from CDN edge to clients.                                                  |Endpoint </br> Client country </br> Client region </br> HTTP status </br> HTTP status group                                                                                          |
| TotalLatency    | The total time from the client request received by CDN **until the last response byte send from CDN to client**. |Endpoint </br> Client country </br> Client region </br> HTTP status </br> HTTP status group                                                                                             |

***Bytes Hit Ration = (egress from edge - egress from origin)/egress from edge**

Scenarios excluded in bytes hit ratio calculation:

* You explicitly configure no cache either through Rules Engine or Query String caching behavior.
* You explicitly configure cache-control directive with no-store or private cache.

### Metrics configuration

1. From the Azure portal menu, select **All Resources** >> **\<your-CDN-profile>**.
2. Under **Monitoring**, select **Metrics**.
3. Select **Add metric**, select the metric to add:
4. Select **Add filter** to add a filter:
5. Select **Apply** splitting to see trend by different dimensions:
6. Select **New chart** to add a new chart:

### Alerting
You can also setup alerts on Microsoft CDN by clicking on **Alert** and **+ New alert rule** for metrics listed in Metrics section. Alert will be charged based on Azure Monitor. For more details about alerts, please refer to Azure Monitor Alert.

### Additional Metrics
In addition to default metrics, you can enable additional metrics using Azure Log Analytics and Raw Log for additional cost. For more information about cost, please refer to Azure Monitor.

1. Follow steps above in raw log to send raw log to log analytics.
2. Click on the Log Analytics workspace you created:
3. Go to Logs under the Log Analytics Workspace, use Kusto query to retrieve different Metrics.  You can refer to the Microsoft CDN Kusto query samples in Logs under selected Analytics Workspace and do further analysis on additional metrics. You can refer to Help on the upper right to learn more about Kusto query language.
4. You can also view data by Chart and click Pin to dashboard.
5. Setup alerts for Metrics of interest. For example, you want to monitor 4XX error code and receive alerts based on your needs.
6. Add New alert rule per your needs, you can also choose to send notification via email, SMS and secure webhook, webhook, Function, etc. For more details, please refer to Azure Monitor Alert action groups.  


 

## Next Steps
In this article, you enabled HTTP raw logs for the Microsoft CDN service.

For more information on Azure CDN and the other Azure services mentioned in this article, see:

* [Analyze](cdn-log-analysis.md) Azure CDN usage patterns.

* Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview).

* Configure [Log Analytics in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal).
