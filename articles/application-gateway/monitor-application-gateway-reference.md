---
title: Monitoring Azure Application Gateway data reference  
description: Important reference material needed when you monitor Application Gateway 
author: greg-lindsay
ms.author: greglin
ms.topic: conceptual
ms.service: application-gateway
ms.custom: subject-monitoring
ms.date: 05/17/2023
---
<!-- VERSION 2.2
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring [servicename]" article for the service. -->

# Monitoring Azure Application Gateway data reference

See [Monitoring Azure Application Gateway](monitor-application-gateway.md) for details on collecting and analyzing monitoring data for Azure Application Gateway.

## Metrics

<!-- REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
<!-- Please keep headings in this order -->

<!--  OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](../cosmos-db/monitor-cosmos-db-reference.md#metrics). They even regroup the metrics into usage type vs. resource provider and type.
-->

<!-- Example format. Mimic the setup of metrics supported, but add extra information -->

### Application Gateway v2 metrics

Resource Provider and Type: [Microsoft.Network/applicationGateways](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkapplicationgateways)

#### Timing metrics
Application Gateway provides several built‑in timing metrics related to the request and response, which are all measured in milliseconds.

> [!NOTE]
>
> If the Application Gateway has more than one listener, then always filter by the *Listener* dimension while comparing different latency metrics to get more meaningful inference.


| Metric | Unit | Description|
|:-------|:-----|:------------|
|**Backend connect time**|Milliseconds|Time spent establishing a connection with the backend application.<br><br>This includes the network latency and the time taken by the backend server’s TCP stack to establish new connections. For TLS, it also includes the time spent on handshake.|
|**Backend first byte response time**|Milliseconds|Time interval between start of establishing a connection to backend server and receiving the first byte of the response header.<br><br>This approximates the sum of Backend connect time, time taken by the request to reach the backend from Application Gateway, time taken by backend application to respond (the time the server took to generate content, potentially fetch database queries), and the time taken by first byte of the response to reach the Application Gateway from the backend.|
|**Backend last byte response time**|Milliseconds|Time interval between start of establishing a connection to backend server and receiving the last byte of the response body.<br><br>This approximates the sum of backend first byte response time and data transfer time. This number may vary greatly depending on the size of objects requested and the latency of the server network.|
|**Application gateway total time**|Milliseconds|Average time that it takes for a request to be received, processed and its response to be sent.<br><br>This is the interval from the time when Application Gateway receives the first byte of the HTTP request to the time when the last response byte has been sent to the client. This includes the processing time taken by Application Gateway, the Backend last byte response time, the time taken by Application Gateway to send all the response, and the Client RTT.|
|**Client RTT**|Milliseconds|Average round-trip time between clients and Application Gateway.|

These metrics can be used to determine whether the observed slowdown is due to the client network, Application Gateway performance, the backend network and backend server TCP stack saturation, backend application performance, or large file size.

For example, if there’s a spike in *Backend first byte response time* trend but the *Backend connect time* trend is stable, then it can be inferred that the Application gateway to backend latency and the time taken to establish the connection is stable, and the spike is caused due to an increase in the response time of backend application. On the other hand, if the spike in *Backend first byte response time* is associated with a corresponding spike in *Backend connect time*, then it can be deduced that either the network between Application Gateway and backend server or the backend server TCP stack has saturated. 

If you notice a spike in *Backend last byte response time* but the *Backend first byte response time* is stable, then it can be deduced that the spike is because of a larger file being requested.

Similarly, if the *Application gateway total time* has a spike but the *Backend last byte response time* is stable, then it can either be a sign of performance bottleneck at the Application Gateway or a bottleneck in the network between client and Application Gateway. Additionally, if the *client RTT* also has a corresponding spike, then it indicates that the degradation is because of the network between client and Application Gateway.

#### Application Gateway metrics

| Metric | Unit | Description|
|:-------|:-----|:------------|
|**Bytes received**|Bytes|Count of bytes received by the Application Gateway from the clients. (This metric accounts for only the Request content size observed by the Application Gateway. It doesn't include data transfers such as TLS header negotiations, TCP/IP packet headers, or retransmissions.)|
|**Bytes sent**|Bytes|Count of bytes sent by the Application Gateway to the clients. (This metric accounts for only the Response Content size served by the Application Gateway. It doesn't include data transfers such as TCP/IP packet headers or retransmissions.)|
|**Client TLS protocol**|Count|Count of TLS and non-TLS requests initiated by the client that established connection with the Application Gateway. To view TLS protocol distribution, filter by the TLS Protocol dimension.|
|**Current capacity units**|Count|Count of capacity units consumed to load balance the traffic. There are three determinants to capacity unit - compute unit, persistent connections, and throughput. Each capacity unit is composed of at most: one compute unit, or 2500 persistent connections, or 2.22-Mbps throughput.|
|**Current compute units**|Count|Count of processor capacity consumed. Factors affecting compute unit are TLS connections/sec, URL Rewrite computations, and WAF rule processing.|
|**Current connections**|Count|The total number of concurrent connections active from clients to the Application Gateway.|
|**Estimated Billed Capacity units**|Count|With the v2 SKU, the pricing model is driven by consumption. Capacity units measure consumption-based cost that is charged in addition to the fixed cost. *Estimated Billed Capacity units indicate the number of capacity units using which the billing is estimated. This is calculated as the greater value between *Current capacity units* (capacity units required to load balance the traffic) and *Fixed billable capacity units* (minimum capacity units kept provisioned).|
|**Failed Requests**|Count|Number of requests that Application Gateway has served with 5xx server error codes. This includes the 5xx codes that are generated from the Application Gateway and the 5xx codes that are generated from the backend. The request count can be further filtered to show count per each/specific backend pool-http setting combination.|
|**Fixed Billable Capacity Units**|Count|The minimum number of capacity units kept provisioned as per the *Minimum scale units* setting (one instance translates to 10 capacity units) in the Application Gateway configuration.|
|**New connections per second**|Count|The average number of new TCP connections per second established from clients to the Application Gateway and from the Application Gateway to the backend members.|
|**Response Status**|Status code|HTTP response status returned by Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories.|
|**Throughput**|Bytes/sec|Number of bytes per second the Application Gateway has served. (This metric accounts for only the Content size served by the Application Gateway. It doesn't include data transfers such as TLS header negotiations, TCP/IP packet headers, or retransmissions.)|
|**Total Requests**|Count|Count of successful requests that Application Gateway has served. The request count can be further filtered to show count per each/specific backend pool-http setting combination.|

#### Backend metrics

| Metric | Unit | Description|
|:-------|:-----|:------------|
|**Backend response status**|Count|Count of HTTP response status codes returned by the backends. This doesn't include any response codes generated by the Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories.|
|**Healthy host count**|Count|The number of backends that are determined healthy by the health probe. You can filter on a per backend pool basis to show the number of healthy hosts in a specific backend pool.|
|**Unhealthy host count**|Count|The number of backends that are determined unhealthy by the health probe. You can filter on a per backend pool basis to show the number of unhealthy hosts in a specific backend pool.|
|**Requests per minute per Healthy Host**|Count|The average number of requests received by each healthy member in a backend pool in a minute. Specify the backend pool using the *BackendPool HttpSettings* dimension.|


### Application Gateway v1 metrics

#### Application Gateway metrics

| Metric | Unit | Description|
|:-------|:-----|:------------|
|**CPU Utilization**|Percent|Displays the CPU usage allocated to the Application Gateway. Under normal conditions, CPU usage should not regularly exceed 90%, as this may cause latency in the websites hosted behind the Application Gateway and disrupt the client experience. You can indirectly control or improve CPU usage by modifying the configuration of the Application Gateway by increasing the instance count or by moving to a larger SKU size, or doing both.|
|**Current connections**|Count|Count of current connections established with Application Gateway.|
|**Failed Requests**|Count|Number of requests that failed because of connection issues. This count includes requests that failed due to exceeding the *Request time-out* HTTP setting and requests that failed due to connection issues between Application Gateway and the backend. This count doesn't include failures due to no healthy backend being available. 4xx and 5xx responses from the backend are also not considered as part of this metric.|
|**Response Status**|Status code|HTTP response status returned by Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories.|
|**Throughput**|Bytes/sec|Number of bytes per second the Application Gateway has served.|
|**Total Requests**|Count|Count of successful requests that Application Gateway has served. The request count can be further filtered to show count per each/specific backend pool-http setting combination.|
|**Web Application Firewall Blocked Requests Count**|Count|Number of requests blocked by WAF.|
|**Web Application Firewall Blocked Requests Distribution**|Count|Number of requests blocked by WAF filtered to show count per each/specific WAF rule group or WAF rule ID combination.|
|**Web Application Firewall Total Rule Distribution**|Count|Number of requests received per each specific WAF rule group or WAF rule ID combination.|


<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).



## Metric Dimensions

<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com -->

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).


<!-- See https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

Azure Application Gateway supports dimensions for some of the metrics in Azure Monitor. Each metric includes a description that explains the available dimensions specifically for that metric.


## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for Azure Application Gateway. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

> [!NOTE]
> The Performance log is available only for the v1 SKU. For the v2 SKU, use [Metrics](#metrics) for performance data.

For more information, see [Backend health and diagnostic logs for Application Gateway](application-gateway-diagnostics.md#access-log)

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Application Gateway

Resource Provider and Type: [Microsoft.Network/applicationGateways](../azure-monitor/essentials/resource-logs-categories.md#microsoftnetworkapplicationgateways)

| Category | Display Name | Information|
|:---------|:-------------|------------------|
| **Activitylog**   | Activity log | Activity log entries are collected by default. You can use [Azure activity logs](../azure-monitor/essentials/activity-log.md) (formerly known as operational logs and audit logs) to view all operations that are submitted to your Azure subscription, and their status. |
|**ApplicationGatewayAccessLog**|Access log| You can use this log to view Application Gateway access patterns and analyze important information. This includes the caller's IP address, requested URL, response latency, return code, and bytes in and out. An access log is collected every 60 seconds. This log contains one record per instance of Application Gateway. The Application Gateway instance is identified by the instanceId property.|
| **ApplicationGatewayPerformanceLog**|Performance log|You can use this log to view how Application Gateway instances are performing. This log captures performance information for each instance, including total requests served, throughput in bytes, total requests served, failed request count, and healthy and unhealthy backend instance count. A performance log is collected every 60 seconds. The Performance log is available only for the v1 SKU. For the v2 SKU, use [Metrics](#metrics) for performance data.|
|**ApplicationGatewayFirewallLog**|Firewall log|You can use this log to view the requests that are logged through either detection or prevention mode of an application gateway that is configured with the web application firewall. Firewall logs are collected every 60 seconds.|


## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Application Gateway and available for query by Log Analytics. 


<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

|Resource Type | Notes |
|-------|-----|
| [Application Gateway](/azure/azure-monitor/reference/tables/tables-resourcetype#application-gateways) |Includes AzureActivity, AzureDiagnostics, and AzureMetrics |


For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

Azure Application Gateway uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
requestUri_s | The URI of the client request.|
Message | Informational messages such as "SQL Injection Attack"|
userAgent_s | User agent details of the client request|
ruleName_s | Request routing rule that is used to serve this request|
httpMethod_s | HTTP method of the client request|
instanceId_s | The Appgw instance to which the client request is routed to for evaluation|
httpVersion_s | HTTP version of the client request|
clientIP_s | IP from which is request is made|
host_s | Host header of the client request|
requestQuery_s | Query string as part of the client request|
sslEnabled_s | Does the client request have SSL enabled|


## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure Application Gateway](monitor-application-gateway.md) for a description of monitoring Azure Application Gateway.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
