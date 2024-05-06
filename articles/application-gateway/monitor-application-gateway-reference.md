---
title: Monitoring data reference for Azure Application Gateway
description: This article contains important reference material you need when you monitor Azure Application Gateway.
ms.date: 05/06/2024
ms.custom: horz-monitor
ms.topic: reference
author: greg-lindsay
ms.author: greglin
ms.service: application-gateway
---

# Azure Application Gateway monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Application Gateway](monitor-application-gateway.md) for details on the data you can collect for Application Gateway and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/applicationGateways

The following table lists the metrics available for the Microsoft.Network/applicationGateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE[Microsoft.Network/applicationgateways](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-network-applicationgateways-metrics-include.md)]

### Timing metrics

Application Gateway provides several built‑in timing metrics related to the request and response, which are all measured in milliseconds.

- Backend connect time
- Backend first byte response time
- Backend last byte response time
- Application gateway total time
- Client RTT

See [metrics table](#supported-metrics-for-microsoftnetworkapplicationgateways) for details.

These metrics can be used to determine whether the observed slowdown is due to the client network, Application Gateway performance, the backend network and backend server TCP stack saturation, backend application performance, or large file size.

For example, if there’s a spike in *Backend first byte response time* trend but the *Backend connect time* trend is stable, then it can be inferred that the Application gateway to backend latency and the time taken to establish the connection is stable, and the spike is caused due to an increase in the response time of backend application. On the other hand, if the spike in *Backend first byte response time* is associated with a corresponding spike in *Backend connect time*, then it can be deduced that either the network between Application Gateway and backend server or the backend server TCP stack has saturated.

If you notice a spike in *Backend last byte response time* but the *Backend first byte response time* is stable, then it can be deduced that the spike is because of a larger file being requested.

Similarly, if the *Application gateway total time* has a spike but the *Backend last byte response time* is stable, then it can either be a sign of performance bottleneck at the Application Gateway or a bottleneck in the network between client and Application Gateway. Additionally, if the *client RTT* also has a corresponding spike, then it indicates that the degradation is because of the network between client and Application Gateway.

### Application Gateway metrics

For Application Gateway, the following metrics are available:

- Bytes received
- Bytes sent
- Client TLS protocol
- Current capacity units
- Current compute units
- Current connections
- Estimated Billed Capacity units
- Failed Requests
- Fixed Billable Capacity Units
- New connections per second
- Response Status
- Throughput
- Total Requests

See [metrics table](#supported-metrics-for-microsoftnetworkapplicationgateways) for details.

### Backend metrics

- Backend response status
- Healthy host count
- Unhealthy host count
- Requests per minute per Healthy Host

See [metrics table](#supported-metrics-for-microsoftnetworkapplicationgateways) for details.

### Backend health API

See [Application Gateways - Backend Health](/rest/api/application-gateway/application-gateways/backend-health?tabs=HTTP) for details of the API call to retrieve the backend health of an application gateway.

Sample Request:

```http
POST
https://management.azure.com/subscriptions/subid/resourceGroups/rg/providers/Microsoft.Network/
applicationGateways/appgw/backendhealth?api-version=2021-08-01
```

After sending this POST request, you should see an HTTP 202 Accepted response. In the response headers, find the Location header and send a new GET request using that URL.

```http
GET
https://management.azure.com/subscriptions/subid/providers/Microsoft.Network/locations/region-name/operationResults/GUID?api-version=2021-08-01
```

### Application Gateway TLS/TCP proxy monitoring

Application Gateway supports TLS/TCP proxy monitoring.

#### TLS/TCP proxy metrics

With layer 4 proxy feature now available with Application Gateway, there are some Common metrics that apply to both layer 7 and layer 4. There are some layer 4 specific metrics. The following list summarizes the metrics are the applicable for layer 4 usage.

- Current Connections
- New Connections per second
- Throughput
- Healthy host count
- Unhealthy host count
- Client RTT
- Backend Connect Time
- Backend First Byte Response Time

See [metrics table](#supported-metrics-for-microsoftnetworkapplicationgateways) for details.

These metrics apply to layer 4 only.

| Metric | Description | Type | Dimension |
|:-------|:------------|:-----|:----------|
| Backend Session Duration | The total time of a backend connection. The average time duration from the start of a new connection to its termination. | L4-specific | Listener, BackendServer, BackendPool, BackendHttpSetting`*` |
| Connection Lifetime | The total time of a client connection to application gateway. The average time duration from the start of a new connection to its termination in milliseconds. | L4-specific | Listener |

`*` BackendHttpSetting dimension includes both layer 7 and layer 4 backend settings.

#### TLS/TCP proxy logs

Application Gateway's Layer 4 proxy provides log data through access logs. These logs are only generated and published if they're configured in the diagnostic settings of your gateway. For more information, see [Supported categories for Azure Monitor resource logs](/azure/azure-monitor/essentials/resource-logs-categories#microsoftnetworkapplicationgateways).

| Category | Resource log category |
|:--------------|:----------------------------------------------------------------------|
| ResourceGroup | The resource group to which the application gateway resource belongs. |
| SubscriptionId |The subscription ID of the application gateway resource. |
| ResourceProvider |This value is MICROSOFT.NETWORK for application gateway. |
| Resource |The name of the application gateway resource. |
| ResourceType |This value is APPLICATIONGATEWAYS. |
| ruleName |The name of the routing rule that served the connection request. |
| instanceId |Application Gateway instance that served the request. |
| clientIP |Originating IP for the request. |
| receivedBytes |Data received from client to gateway, in bytes. |
| sentBytes |Data sent from gateway to client, in bytes. |
| listenerName |The name of the listener that established the frontend connection with client. |
| backendSettingName |The name of the backend setting used for the backend connection. |
| backendPoolName |The name of the backend pool from which a target server was selected to establish the backend connection. |
| protocol |TCP (Irrespective of it being TCP or TLS, the protocol value is always TCP). |
| sessionTime |session duration, in seconds (this value is for the client->appgw session) |
| upstreamSentBytes |Data sent to backend server, in bytes. |
| upstreamReceivedBytes |Data received from backend server, in bytes. |
| upstreamSessionTime |session duration, in seconds (this value is for the appgw->backend session) |
| sslCipher |Cipher suite being used for TLS communication (for TLS protocol listeners). |
| sslProtocol |SSL/TLS protocol being used (for TLS protocol listeners). |
| serverRouted |The backend server IP and port number to which the traffic was routed. |
| serverStatus |200 - session completed successfully. 400 - client data couldn't be parsed. 500 - internal server error. 502 - bad gateway. For example, when an upstream server couldn't be reached. 503 - service unavailable. For example, if access is limited by the number of connections. |
| ResourceId |Application Gateway resource URI |

### TLS/TCP proxy backend health

Application Gateway's layer 4 proxy provides the capability to monitor the health of individual members of the backend pools through the portal and REST API.

:::image type="content" source="./media/monitor-application-gateway-reference/backend-health.png" alt-text="Screenshot shows health for individual members of backend pools.":::

### Application Gateway v1 metrics

| Metric | Unit | Description|
|:-------|:-----|:------------|
|**CPU Utilization**|Percent|Displays the CPU usage allocated to the Application Gateway. Under normal conditions, CPU usage shouldn't regularly exceed 90%, because this situation might cause latency in the websites hosted behind the Application Gateway and disrupt the client experience. You can indirectly control or improve CPU usage by modifying the configuration of the Application Gateway by increasing the instance count or by moving to a larger SKU size, or doing both.|
|**Current connections**|Count|Count of current connections established with Application Gateway.|
|**Failed Requests**|Count|Number of requests that failed because of connection issues. This count includes requests that failed due to exceeding the *Request time-out* HTTP setting and requests that failed due to connection issues between Application Gateway and the backend. This count doesn't include failures due to no healthy backend being available. 4xx and 5xx responses from the backend are also not considered as part of this metric.|
|**Response Status**|Status code|HTTP response status returned by Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories.|
|**Throughput**|Bytes/sec|Number of bytes per second the Application Gateway served.|
|**Total Requests**|Count|Count of successful requests that Application Gateway served. The request count can be further filtered to show count per each/specific backend pool-http setting combination.|
|**Web Application Firewall Blocked Requests Count**|Count|Number of requests blocked by WAF.|
|**Web Application Firewall Blocked Requests Distribution**|Count|Number of requests blocked by WAF filtered to show count per each/specific WAF rule group or WAF rule ID combination.|
|**Web Application Firewall Total Rule Distribution**|Count|Number of requests received per each specific WAF rule group or WAF rule ID combination.|

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Action
- BackendHttpSetting
- BackendPool
- BackendServer
- BackendSettingsPool
- Category
- CountryCode
- CustomRuleID
- HttpStatusGroup
- Listener
- Method
- Mode
- PolicyName
- PolicyScope
- RuleGroup
- RuleGroupID
- RuleId
- RuleSetName
- TlsProtocol

> [!NOTE]
>
> If the Application Gateway has more than one listener, then always filter by the *Listener* dimension while comparing different latency metrics to get more meaningful inference.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/applicationGateways

[!INCLUDE [Microsoft.Network/applicationgateways](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-network-applicationgateways-logs-include.md)]

> [!NOTE]
> The Performance log is available only for the v1 SKU. For the v2 SKU, use Application Gateway v2 metrics for performance data.

### Diagnostics tables

Azure Application Gateway uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table to store resource log information. The following columns are relevant.

| Property | Description |
|:--- |:---|
| requestUri_s | The URI of the client request.|
| Message | Informational messages such as "SQL Injection Attack"|
| userAgent_s | User agent details of the client request|
| ruleName_s | Request routing rule that is used to serve this request|
| httpMethod_s | HTTP method of the client request|
| instanceId_s | The Appgw instance to which the client request is routed to for evaluation|
| httpVersion_s | HTTP version of the client request|
| clientIP_s | IP from which is request is made|
| host_s | Host header of the client request|
| requestQuery_s | Query string as part of the client request|
| sslEnabled_s | Does the client request have SSL enabled|

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Application Gateway Microsoft.Network/applicationGateways

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AGWAccessLogs](/azure/azure-monitor/reference/tables/agwaccesslogs#columns)
- [AGWPerformanceLogs](/azure/azure-monitor/reference/tables/agwperformancelogs#columns)
- [AGWFirewallLogs](/azure/azure-monitor/reference/tables/agwfirewalllogs#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [applicationGateways resource provider operations](/azure/role-based-access-control/resource-provider-operations#networking)

## Related content

- See [Monitor Azure Application Gateway](monitor-application-gateway.md) for a description of monitoring Application Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
