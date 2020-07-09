---
title: Metrics and Raw Logs for Azure CDN from Microsoft
description: This article describes the Azure CDN from Microsoft metrics and RAW logs.
services: cdn
author: asudbring
manager: KumudD
ms.service: azure-cdn
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/09/2020
ms.author: allensu
---

# Monitoring Metrics and Raw Logs for Azure CDN from Microsoft
Azure CDN from Microsoft, you can monitor resources in the following ways to help you troubleshoot, track, and debug issues. 

* Raw logs, which log every request to CDN edge with rich fields
* Metrics, which displays 4 key metrics on CDN
* Alert, which allows you to setup alert for key metrics
* Additional metrics, which allows you to leverage Azure Log Analytics to enable additional metrics.

You will learn how to stream raw logs to Azure Data Explorer if you are already using it to build reports, metrics and alerts for other Azure resources.

> [!IMPORTANT]
> The HTTP raw logs feature is available for Azure CDN from Microsoft.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Raw Log
Raw log provides rich information about every request that Microsoft CDN receives. Raw logs allow customers to send logs to Azure storage, Event hub or Log Analytics for further analysis. With logs, customers can include CDN into their self-built analytics platform, build customized analysis on CDN for diagnostics and informed decisions. For Azure customers already using Azure Monitor Log Analytics, they can include CDN as well. In this case, customers need to pay for Azure Monitor Log Analytics.
Please note that raw logs include logs generated from both CDN edge (child POP) and origin shield. Origin shield refers to parent nodes that are strategically located across the global to help communicate with origin servers and reduce the traffic load on origin. For every request that goes to origin shield, there will be two log entries- one for edge nodes and the other one for origin shield. In order to differentiate the egress or responses from the edge nodes vs. origin shield, you can use the field isReceivedfromClient to get the right data. If the value is false, then it means the request is responded from origin shield to edge nodes. This approach might be handy to help compare raw logs with billing data as we do not charge for egress from origin shield to the edge nodes and only charge for egress from the edge nodes to clients. 

Here is a Kusto query sample of how to exclude logs generated on origin shield.

```kusto
AzureDiagnostics | where OperationName == "Microsoft.Cdn/Profiles/AccessLog/Write" and Category == "AzureCdnAccessLog" | where isReceivedfromClient == true
```

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Configuration

To configure Raw logs for your Azure CDN from Microsoft profile: 

1. From the Azure portal menu, select **All Resources** >> **\<your-CDN-profile>**.

2. Under **Monitoring**, select **Diagnostics settings**.

3. Select **+ Add diagnostic setting**.

    ![CDN diagnostic setting](./media/cdn-raw-logs/raw-logs-01.png)

    > [!IMPORTANT]
    > Raw logs is only available in the profile level while aggregated http status code logs are available in the endpoint level.

4. Under **Diagnostic settings**, enter a name for the diagnostic setting under **Diagnostic settings name**.

5. Select the **log** and set the retention in days.

6. Select the **Destination details**. Destination options are:
    * **Send to Log Analytics**
        * Select the **Subscription** and **Log Analytics workspace**.
    * **Archive to a storage account**
        * Select the **Subscription** and the **Storage Account**.
    * **Stream to an event hub**
        * Select the **Subscription**, **Event hub namespace**, **Event hub name (optional)**, and **Event hub policy name**.

    ![CDN diagnostic setting](./media/cdn-raw-logs/raw-logs-02.png)

7. Select **Save**.

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
| Sent to origin shield | If true, it means that request was answered from origin shield cache instead of the edge pop. Origin shield is a parent cache used to improve cache hit ratio.                                       |
| HttpStatusCode        | The HTTP status code returned from the proxy.                                                                                                                                                        |
| HttpStatusDetails     | Resulting status on the request. Meaning of this string value can be found at a Status reference table.                                                                                              |
| Pop                   | The edge pop, which responded to the user request. POPs' abbreviations are airport codes of their respective metros.                                                                                   |
| Cache Status          | Signifies if the object was returned from cache or came from the origin.                                                                                                             |
> [!IMPORTANT]
> The HTTP Raw logs feature is available automatically for any profiles created or updated after **25th February 2020**. For CDN profiles created earlier, one should update the CDN endpoint after setting up logging. For example, one can navigate to geo filtering under CDN endpoints and block any country/region not relevant to their workload and hit save. 

> [!NOTE]
> The logs can be viewed under your Log Analytics profile by running a query. A sample query would look like:
    ```
    AzureDiagnostics | where Category == "AzureCdnAccessLog"
    ```

## Metrics
Azure CDN from Microsoft is integrated with Azure Monitor and publishes 4 CDN metrics to help track, troubleshoot and debug issues. The Metrics are displayed in charts and also accessible via PowerShell, CLI and API. The CDN metrics are free of charge.

If there are requests flowing through Azure CDN from Microsoft, it measures and sends its metrics in 60-second intervals and takes up to 3 mins to appear in the portal. For more information, see Azure Monitor metrics.

**Metrics supported by Azure CDN from Microsoft**
| Metrics | Description | Notes |
|-|-|-|
| Cache hit ratio | The percentage of egress from CDN cache, computed against the total egress. | Cache Hit Ratio = (edge - egress from origin)/egress from edge <br>Scenarios for cache hit ratio calculation:<ul><li> HIT at edge</li><li> MISS at edge and HIT at origin shield </li><li> PARTIAL_HIT at edge and HIT at origin shield</li><li> MISS at edge and MISS at origin shield</li></ul> <br> Scenarios excluded in cache hit ratio calculation: <ul><li> Customer explicitly configure to not cache</li><li>Cache-control directive with no-store or private cache </li></ul> <br> Dimensions: Endpoint
| RequestCount | The number of client requests served by CDN | Dimensions: Endpoint, client country, client region, HTTP status, HTTP status group |
| ResponseSize | The number of bytes sent as responses from CDN edge to clients. | Dimensions: Endpoint, client country, client region, HTTP status, HTTP status group |
| TotalLatency | The total time from the client request received by CDN until the last response byte sent from CDN to client. | Dimensions: Endpoint, client country, client region, HTTP status, HTTP status group |

### Metrics dimensions
Customer is also able to look at different dimensions by endpoint, by client country, by client region, HTTP status code or status code group to further understand their user distribution and how CDN is performing. Cache hit ratio will only have endpoint as the dimension.

### Metrics configuration

1. From the Azure portal menu, select **All Resources** >> **\<your-CDN-profile>**.
2. Under **Monitoring**, select **Metrics**.

## Next Steps
In this article, you enabled HTTP raw logs for the Microsoft CDN service.

For more information on Azure CDN and the other Azure services mentioned in this article, see:

* [Analyze](cdn-log-analysis.md) Azure CDN usage patterns.

* Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview).

* Configure [Log Analytics in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal).
