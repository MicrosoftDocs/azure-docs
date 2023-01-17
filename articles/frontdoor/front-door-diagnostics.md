---
title: Monitor metrics and logs in - Azure Front Door
description: This article describes the different metrics and logs that Azure Front Door records.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/17/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Monitor metrics and logs in Azure Front Door

Azure Front Door provides several features to help you monitor your application, track requests, and debug your Front Door configuration. Telemetry is stored and managed by [Azure Monitor](../azure-monitor/overview.md).

::: zone pivot="front-door-standard-premium"

## Metrics

Azure Front Door measures and sends its metrics in 60-second intervals. The metrics can take up to 3 minutes to be processed by Azure Monitor and to appear in the portal. Metrics can be displayed in charts or grids, and are accessible through the Azure portal, PowerShell, the Azure CLI, and the Azure Monitor APIs. For more information, see [Azure Monitor metrics](../azure-monitor/essentials/data-platform-metrics.md).  

The metrics listed in the table below are recorded and stored free of charge. You can enable additional metrics or storage for an extra cost.

| Metrics  | Description | Dimensions |
| ------------- | ------------- | ------------- |
| Byte Hit Ratio | The percentage of traffic that was served from the Azure Front Door cache, computed against the total egress. </br> **Byte Hit Ratio** = (egress from edge - egress from origin)/egress from edge. </br> **Scenarios excluded in bytes hit ratio calculation**:</br> 1. You explicitly configure no cache either through the Rules Engine or query string caching behavior. </br> 2. You explicitly configure cache-control directive with no-store or private cache. </br>3. Byte hit ratio can be low if most of the traffic is forwarded to origin rather than served from caching based on your configurations or scenarios. | Endpoint |
| Origin Health Percentage | The percentage of successful health probes sent from Azure Front Door to origins.| Origin, Origin Group |
| Origin Latency | The time calculated from when the request was sent by the Azure Front Door edge to the origin until Azure Front DOor received the last response byte from the backend. | Endpoint, Origin |
| Origin Request Count  | The number of requests sent from Azure Front Door to origins. | Endpoint, Origin, HTTP Status, HTTP Status Group |
| Percentage of 4XX | The percentage of all the client requests for which the response status code is 4XX. | Endpoint, Client Country, Client Region |
| Percentage of 5XX | The percentage of all the client requests for which the response status code is 5XX. | Endpoint, Client Country, Client Region |
| Request Count | The number of client requests served through Azure Front Door, including requests served entirely from the cache. | Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| Request Size | The number of bytes sent in requests from clients to Azure Front Door. | Endpoint, Client Country, client Region, HTTP Status, HTTP Status Group |
| Response Size | The number of bytes sent as responses from Front Door to clients. |Endpoint, client Country, client Region, HTTP Status, HTTP Status Group |
| Total Latency | The total time taken from when the client request was received by Azure Front Door until the last response byte was sent from Azure Front Door to the client. |Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| Web Application Firewall Request Count | The numer of requests processed by the Azure Front Door web application firewall. | Action, Policy Name, Rule Name |

> [!NOTE]
> If a request to the the origin times out, the value of the *Http Status* dimension is **0**.

## Logs

Logs track all requests that pass through Azure Front Door. Logs can take a few minutes to be stored and processed. The following logs are collected:

There are multiple Front Door logs, which you can use for different purposes:

- [Access logs](#access-log) can be used to identify slow requests, determine error rates, and understand how Front Door's caching behavior is working for your solution.
- [Web application firewall (WAF) logs](#web-application-firewall-log) can be used to detect potential attacks, as well as false positive detections that might indicate legitimate requests that the WAF blocked.
- [Health probe logs](#health-probe-log) can be used to identify origins that are unhealthy or that don't respond to requests from some of Front Door's geographically distributed PoPs.
* [Activity logs](#activity-logs) provide visibility into the operations done on Azure resources, such as configuration changes to your Azure Front Door profile.

The activity log and web application firewall log includes a *tracking reference*, which is also propagated to the origin through the `X-Azure-Ref` request header. You can use the tracking reference to gain an end-to-end view of your application request processing. 

Access logs, health probe logs, and WAF logs aren't enabled by default. To enable and store your diagnostic logs, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md). Activity log entries are collected by default, and you can view them in the Azure portal.

## Access log

Information about every request is logged into the access log. Each access log entry contains the information listed below.

| Property | Description |
|----------|-------------| 
| TrackingReference | The unique reference string that identifies a request served by AFD, also sent as X-Azure-Ref header to the client. Required for searching details in the access logs for a specific request. |
| Time | The date and time when the AFD edge delivered requested contents to client (in UTC). |
| HttpMethod | HTTP method used by the request: DELETE, GET, HEAD, OPTIONS, PATCH, POST, or PUT. |
| HttpVersion | The HTTP version that the viewer specified in the request. |
| RequestUri | URI of the received request. This field is a full scheme, port, domain, path, and query string |
| HostName | The host name in the request from client. If you enable custom domains and have wildcard domain (*.contoso.com), hostname is a.contoso.com. if you use Azure Front Door domain (contoso.azurefd.net), hostname is contoso.azurefd.net. |
| RequestBytes | The size of the HTTP request message in bytes, including the request headers and the request body. The number of bytes of data that the viewer included in the request, including headers. |
| ResponseBytes | Bytes sent by the backend server as the response. |
| UserAgent | The browser type that the client used. |
| ClientIp | The IP address of the client that made the original request. If there was an X-Forwarded-For header in the request, then the Client IP is picked from the same. |
| SocketIp | The IP address of the direct connection to AFD edge. If the client used an HTTP proxy or a load balancer to send the request, the value of SocketIp is the IP address of the proxy or load balancer. |
| timeTaken | The length of time from the time AFD edge server receives a client's request to the time that AFD sends the last byte of response to client,  in milliseconds. This field doesn't take into account network latency and TCP buffering. |
| RequestProtocol | The protocol that the client specified in the request: HTTP, HTTPS. |
| SecurityProtocol | The TLS/SSL protocol version used by the request or null if no encryption. Possible values include: SSLv3, TLSv1, TLSv1.1, TLSv1.2 |
| SecurityCipher | When the value for Request Protocol is HTTPS, this field indicates the TLS/SSL cipher negotiated by the client and AFD for encryption. |
| Endpoint | The domain name of AFD endpoint, for example, contoso.z01.azurefd.net |
| HttpStatusCode | The HTTP status code returned from Azure Front Door. If a request to the the origin timeout, the value for HttpStatusCode is set to **0**.|
| Pop | The edge pop, which responded to the user request.  |
| Cache Status | How request was handled by the Azure Front Door cache. Possible values are: <br/> **HIT**: The HTTP request was served from AFD edge POP cache. <br> **MISS**: The HTTP request was served from origin. <br/> **PARTIAL_HIT**: Some of the bytes from a request got served from AFD edge POP cache while some of the bytes got served from origin for object chunking scenarios. <br> **CACHE_NOCONFIG**: Forwarding requests without caching settings, including bypass scenario. <br/> **PRIVATE_NOSTORE**: No cache configured in caching settings by customers. <br> **REMOTE_HIT**: The request was served by parent node cache. <br/> **N/A**: The request was denied by a signed URL or the Rules Engine. |
| MatchedRulesSetName | The names of the rules that were processed. |
| RouteName | The name of the route that the request matched. |
| ClientPort | The IP port of the client that made the request. |
| Referrer | The URL of the site that originated the request. |
| TimetoFirstByte | The length of time in milliseconds from AFD receives the request to the time the first byte gets sent to client, as measured on Azure Front Door. This property doesn't measure the client data. |
| ErrorInfo | This field provides detailed info of the error token for each response. <br> **NoError**: Indicates no error was found. <br> **CertificateError**: Generic SSL certificate error. <br> **CertificateNameCheckFailed**: The host name in the SSL certificate is invalid or doesn't match. <br> **ClientDisconnected**: Request failure because of client network connection. <br> **ClientGeoBlocked**: The client was blocked due geographical location of the IP. <br> **UnspecifiedClientError**: Generic client error. <br> **InvalidRequest**: Invalid request. It might occur because of malformed header, body, and URL. <br> **DNSFailure**: DNS Failure. <br> **DNSTimeout**: The DNS query to resolve the backend timed out. <br> **DNSNameNotResolved**: The server name or address couldn't be resolved. <br> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. <br> **OriginConnectionError**: Generic origin connection error. <br> **OriginConnectionRefused**: The connection with the origin wasn't established. <br> **OriginError**: Generic origin error. <br> **OriginInvalidRequest**: An invalid request was sent to the origin. <br> **ResponseHeaderTooBig**: The origin returned a too large of a response header. <br> **OriginInvalidResponse**: Origin returned an invalid or unrecognized response. <br> **OriginTimeout**: The timeout period for origin request expired. <br> **ResponseHeaderTooBig**: The origin returned a too large of a response header. <br> **RestrictedIP**: The request was blocked because of restricted IP. <br> **SSLHandshakeError**: Unable to establish connection with origin because of SSL hand shake failure. <br> **SSLInvalidRootCA**: The RootCA was invalid. <br> **SSLInvalidCipher**: Cipher was invalid for which the HTTPS connection was established. <br> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. <br> **OriginConnectionRefused**: The connection with the origin wasn't established. <br> **UnspecifiedError**: An error occurred that didn’t fit in any of the errors in the table. |
| OriginURL | The full URL of the origin where requests are being sent. Composed of the scheme, host header, port, path, and query string. <br> **URL rewrite**: If there's a URL rewrite rule in Rule Set, path refers to rewritten path. <br> **Cache on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |
| OriginIP | The origin IP that served the request. <br> **Cache hit on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |
| OriginName| The full DNS name (hostname in origin URL) to the origin. <br> **Cache hit on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |

## Health probe log

Health probe logs provide logging for every failed probe to help you diagnose your origin. The logs will provide you information that you can use to bring the origin back to service. Some scenarios this log can be useful for are:

* You noticed Azure Front Door traffic was sent to some of the origins. For example, only three out of four origins receiving traffic. You want to know if the origins are receiving probes and if not the reason for the failure.  

* You noticed the origin health percentage is lower than expected and want to know which origin failed and the reason of the failure.

Each health probe log entry has the following schema:

| Property | Description |
| --- | --- |
| HealthProbeId  | A unique ID to identify the request. |
| Time | Probe complete time |
| HttpMethod | HTTP method used by the health probe request. Values include GET and HEAD, based on health probe configurations. |
| Result | Status of health probe to origin, which is either success, or a description of the error the probe received. |
| HttpStatusCode  | The HTTP status code returned from the origin. |
| ProbeURL (target) | The full URL of the origin where requests are being sent. Composed of the scheme, host header, path, and query string. |
| OriginName  | The origin where requests are being sent. This field helps locate origins of interest if origin is configured to FDQN. |
| POP | The edge pop, which sent out the probe request. |
| Origin IP | Target origin IP. This field is useful in locating origins of interest if you configure origin using FDQN. |
| TotalLatency | The time from AFDX edge sends the request to origin to the time origin sends the last response to AFDX edge. |
| ConnectionLatency| Duration Time spent on setting up the TCP connection to send the HTTP Probe request to origin. | 
| DNSResolution Latency | Duration Time spent on DNS resolution if the origin is configured to be an FDQN instead of IP. N/A if the origin is configured to IP. |

The following example JSON snippet shows a health probe log entry for a failed health probe request.

```json
{
  "records": [
    {
      "time": "2021-02-02T07:15:37.3640748Z",
      "resourceId": "/SUBSCRIPTIONS/27CAFCA8-B9A4-4264-B399-45D0C9CCA1AB/RESOURCEGROUPS/AFDXPRIVATEPREVIEW/PROVIDERS/MICROSOFT.CDN/PROFILES/AFDXPRIVATEPREVIEW-JESSIE",
      "category": "FrontDoorHealthProbeLog",
      "operationName": "Microsoft.Cdn/Profiles/FrontDoorHealthProbeLog/Write",
      "properties": {
        "healthProbeId": "9642AEA07BA64675A0A7AD214ACF746E",
        "POP": "MAA",
        "httpVerb": "HEAD",
        "result": "OriginError",
        "httpStatusCode": "400",
        "probeURL": "http://afdxprivatepreview.blob.core.windows.net:80/",
        "originName": "afdxprivatepreview.blob.core.windows.net",
        "originIP": "52.239.224.228:80",
        "totalLatencyMilliseconds": "141",
        "connectionLatencyMilliseconds": "68",
        "DNSLatencyMicroseconds": "1814"
      }
    }
  ]
}
```

## Web application firewall log

For more information on the Front Door web application firewall (WAF) logs, see [Azure Web Application Firewall monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md).

## Activity logs

Activity logs provide information about the operations done to manage your Azure Front Door Standard/Premium. The logs include details about each write operation that was performed on an Azure Front Door resource, including when the operation occurred, who performed it, and what the operation was. Access activity logs in your Front Door or all the logs of your Azure resources in Azure Monitor.

> [!NOTE]
> Activity logs don't include read operations. They also don't include operations that you perform by using either the Azure portal or the original Management API.

## Next steps

To enable and store your diagnostic logs, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).

::: zone-end

::: zone pivot="front-door-classic"

When using Azure Front Door (classic), you can monitor resources in the following ways:

- **Metrics**. Azure Front Door currently has eight metrics to view performance counters.
- **Logs**. Activity and diagnostic logs allow performance, access, and other data to be saved or consumed from a resource for monitoring purposes.

##  <a name="metrics"></a>Metrics

Metrics are a feature for certain Azure resources that allow you to view performance counters in the portal. The following are available Front Door metrics:

| Metric | Metric Display Name | Unit | Dimensions | Description |
| --- | --- | --- | --- | --- |
| RequestCount | Request Count | Count | HttpStatus</br>HttpStatusGroup</br>ClientRegion</br>ClientCountry | The number of client requests served by Front Door.  |
| RequestSize | Request Size | Bytes | HttpStatus</br>HttpStatusGroup</br>ClientRegion</br>ClientCountry | The number of bytes sent as requests from clients to Front Door. |
| ResponseSize | Response Size | Bytes | HttpStatus</br>HttpStatusGroup</br>ClientRegion</br>ClientCountry | The number of bytes sent as responses from Front Door to clients. |
| TotalLatency | Total Latency | Milliseconds | HttpStatus</br>HttpStatusGroup</br>ClientRegion</br>ClientCountry | The total time from the client request received by Front Door until the last response byte sent from AFD to client. |
| BackendRequestCount | Backend Request Count | Count | HttpStatus</br>HttpStatusGroup</br>Backend | The number of requests sent from Front Door to backends. |
| BackendRequestLatency | Backend Request Latency | Milliseconds | Backend | The time calculated from when the request was sent by Front Door to the backend until Front Door received the last response byte from the backend. |
| BackendHealthPercentage | Backend Health Percentage | Percent | Backend</br>BackendPool | The percentage of successful health probes from Front Door to backends. |
| WebApplicationFirewallRequestCount | Web Application Firewall Request Count | Count | PolicyName</br>RuleName</br>Action | The number of client requests processed by the application layer security of Front Door. |

## <a name="activity-log"></a>Activity logs

Activity logs provide information about the operations done on an Azure Front Door (classic) profile. They also determine the what, who, and when for any write operations (put, post, or delete) done against an Azure Front Door (classic) profile.

>[!NOTE]
>If a request to the the origin timeout, the value for HttpStatusCode is set to **0**.

Access activity logs in your Front Door or all the logs of your Azure resources in Azure Monitor. To view activity logs:

1. Select your Front Door instance.

1. Select **Activity log**.

    :::image type="content" source="./media/front-door-diagnostics/activity-log.png" alt-text="Activity log":::

1. Choose a filtering scope, and then select **Apply**.

> [!NOTE]
> Activity log doesn't include any GET operations or operations that you perform by using either the Azure portal or the original Management API.
>

## <a name="diagnostic-logging"></a>Diagnostic logs

Diagnostic logs provide rich information about operations and errors that are important for auditing and troubleshooting. Diagnostic logs differ from activity logs.

Activity logs provide insights into the operations done on Azure resources. Diagnostic logs provide insight into operations that your resource has done. For more information, see [Azure Monitor diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md).

:::image type="content" source="./media/front-door-diagnostics/diagnostic-log.png" alt-text="Diagnostic logs":::

To configure diagnostic logs for your Azure Front Door (classic):

1. Select your Azure Front Door (classic) profile.

1. Choose **Diagnostic settings**.

1. Select **Turn on diagnostics**. Archive diagnostic logs along with metrics to a storage account, stream them to an event hub, or send them to Azure Monitor logs.

Front Door currently provides diagnostic logs. Diagnostic logs provide individual API requests with each entry having the following schema:

| Property  | Description |
| ------------- | ------------- |
| BackendHostname | If request was being forwarded to a backend, this field represents the hostname of the backend. This field will be blank if the request gets redirected or forwarded to a regional cache (when caching gets enabled for the routing rule). |
| CacheStatus | For caching scenarios, this field defines the cache hit/miss at the POP |
| ClientIp | The IP address of the client that made the request. If there was an X-Forwarded-For header in the request, then the Client IP is picked from the same. |
| ClientPort | The IP port of the client that made the request. |
| HttpMethod | HTTP method used by the request. |
| HttpStatusCode | The HTTP status code returned from the proxy. If a request to the the origin timeout, the value for HttpStatusCode is set to **0**.|
| HttpStatusDetails | Resulting status on the request. Meaning of this string value can be found at a Status reference table. |
| HttpVersion | Type of the request or connection. |
| POP | Short name of the edge where the request landed. |
| RequestBytes | The size of the HTTP request message in bytes, including the request headers and the request body. |
| RequestUri | URI of the received request. |
| ResponseBytes | Bytes sent by the backend server as the response.  |
| RoutingRuleName | The name of the routing rule that the request matched. |
| RulesEngineMatchNames | The names of the rules that the request matched. |
| SecurityProtocol | The TLS/SSL protocol version used by the request or null if no encryption. |
| SentToOriginShield </br> (deprecated) * **See notes on deprecation in the following section.**| If true, it means that request was answered from origin shield cache instead of the edge pop. Origin shield is a parent cache used to improve cache hit ratio. |
| isReceivedFromClient | If true, it means that the request came from the client. If false, the request is a miss in the edge (child POP) and is responded from origin shield (parent POP). |
| TimeTaken | The length of time from first byte of request into Front Door to last byte of response out, in seconds. |
| TrackingReference | The unique reference string that identifies a request served by Front Door, also sent as X-Azure-Ref header to the client. Required for searching details in the access logs for a specific request. |
| UserAgent | The browser type that the client used. |
| ErrorInfo | This field contains the specific type of error for further troubleshooting. </br> Possible values include: </br> **NoError**: Indicates no error was found. </br> **CertificateError**: Generic SSL certificate error.</br> **CertificateNameCheckFailed**: The host name in the SSL certificate is invalid or doesn't match. </br> **ClientDisconnected**: Request failure because of client network connection. </br> **UnspecifiedClientError**: Generic client error. </br> **InvalidRequest**: Invalid request. It might occur because of malformed header, body, and URL. </br> **DNSFailure**: DNS Failure. </br> **DNSNameNotResolved**: The server name or address couldn't be resolved. </br> **OriginConnectionAborted**: The connection with the origin was stopped abruptly. </br> **OriginConnectionError**: Generic origin connection error. </br> **OriginConnectionRefused**: The connection with the origin wasn't able to established. </br> **OriginError**: Generic origin error. </br> **OriginInvalidResponse**: Origin returned an invalid or unrecognized response. </br> **OriginTimeout**: The timeout period for origin request expired. </br> **ResponseHeaderTooBig**: The origin returned too large of a response header. </br> **RestrictedIP**: The request was blocked because of restricted IP. </br> **SSLHandshakeError**: Unable to establish connection with origin because of SSL hand shake failure. </br> **UnspecifiedError**: An error occurred that didn’t fit in any of the errors in the table. </br> **SSLMismatchedSNI**:The request was invalid because the HTTP message header did not match the value presented in the TLS SNI extension during SSL/TLS connection setup.|

### Sent to origin shield deprecation

The raw log property **isSentToOriginShield** has been deprecated and replaced by a new field **isReceivedFromClient**. Use the new field if you're already using the deprecated field. 

Raw logs include logs generated from both CDN edge (child POP) and origin shield. Origin shield refers to parent nodes that are strategically located across the globe. These nodes communicate with origin servers and reduce the traffic load on origin. 

For every request that goes to origin shield, there are 2-log entries:

* One for edge nodes
* One for origin shield. 

To differentiate the egress or responses from the edge nodes vs. origin shield, you can use the field **isReceivedFromClient** to get the correct data. 

If the value is false, then it means the request is responded from origin shield to edge nodes. This approach is effective to compare raw logs with billing data. Charges aren't incurred for egress from origin shield to the edge nodes. Charges are incurred for egress from the edge nodes to clients. 

**Kusto query sample to exclude logs generated on origin shield in Log Analytics.**

`AzureDiagnostics 
| where Category == "FrontdoorAccessLog" and isReceivedFromClient_b == true`

> [!NOTE]
> For various routing configurations and traffic behaviors, some of the fields like backendHostname, cacheStatus, isReceivedFromClient, and POP field may respond with different values. The below table explains the different values these fields will have for various scenarios:

| Scenarios | Count of log entries | POP | BackendHostname | isReceivedFromClient | CacheStatus |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Routing rule without caching enabled | 1 | Edge POP code | Backend where request was forwarded | True | CONFIG_NOCACHE |
| Routing rule with caching enabled. Cache hit at the edge POP | 1 | Edge POP code | Empty | True | HIT |
| Routing rule with caching enabled. Cache misses at edge POP but cache hit at parent cache POP | 2 | 1. Edge POP code</br>2. Parent cache POP code | 1. Parent cache POP hostname</br>2. Empty | 1. True</br>2. False | 1. MISS</br>2. HIT |
| Routing rule with caching enabled. Caches miss at edge POP but PARTIAL cache hit at parent cache POP | 2 | 1. Edge POP code</br>2. Parent cache POP code | 1. Parent cache POP hostname</br>2. Backend that helps populate cache | 1. True</br>2. False | 1. MISS</br>2. PARTIAL_HIT |
| Routing rule with caching enabled. Cache PARTIAL_HIT at edge POP but cache hit at parent cache POP | 2 | 1. Edge POP code</br>2. Parent cache POP code | 1. Edge POP code</br>2. Parent cache POP code | 1. True</br>2. False | 1. PARTIAL_HIT</br>2. HIT |
| Routing rule with caching enabled. Cache misses at both edge and parent cache POP | 2 | 1. Edge POP code</br>2. Parent cache POP code | 1. Edge POP code</br>2. Parent cache POP code | 1. True</br>2. False | 1. MISS</br>2. MISS |
| Error processing the request |  |  |  |  | N/A |

> [!NOTE]
> For caching scenarios, the value for Cache Status will be partial_hit when some of the bytes for a request get served from the Azure Front Door edge or origin shield cache while some of the bytes get served from the origin for large objects.

Azure Front Door uses a technique called object chunking. When a large file is requested, the Azure Front Door retrieves smaller pieces of the file from the origin. After the Azure Front Door POP server receives a full or byte-ranges of the file requested, the Azure Front Door edge server requests the file from the origin in chunks of 8 MB.

After the chunk arrives at the Azure Front Door edge, it's cached and immediately served to the user. The Azure Front Door then prefetches the next chunk in parallel. This prefetch ensures the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file gets downloaded (if requested), all byte ranges are available (if requested), or the client closes the connection. For more information on the byte-range request, see RFC 7233. The Azure Front Door caches any chunks as they're received. The entire file doesn't need to be cached on the Front Door cache. Ensuing requests for the file or byte ranges are served from the Azure Front Door cache. If not all the chunks are cached on the Azure Front Door, prefetch is used to request chunks from the origin. This optimization relies on the ability of the origin server to support byte-range requests. If the origin server doesn't support byte-range requests, this optimization isn't effective.

## Next steps

- Learn how to [create an Azure Front Door (classic) profile](quickstart-create-front-door.md)
- Learn [how Azure Front Door (classic) works](front-door-routing-architecture.md)

::: zone-end
