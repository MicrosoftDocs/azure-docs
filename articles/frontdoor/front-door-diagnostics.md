---
title: Monitor metrics and logs - Azure Front Door
description: This article describes the different metrics and logs that Azure Front Door records.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/02/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Monitor metrics and logs in Azure Front Door

Azure Front Door provides several features to help you monitor your application, track requests, and debug your Front Door configuration.

Logs and metrics are stored and managed by [Azure Monitor](../azure-monitor/overview.md).

::: zone pivot="front-door-standard-premium"

[Reports](standard-premium/how-to-reports.md) provide insight into how your traffic is flowing through Azure Front Door, the web application firewall (WAF), and to your application.

## Metrics

Azure Front Door measures and sends its metrics in 60-second intervals. The metrics can take up to 3 minutes to be processed by Azure Monitor, and they might not appear until processing is completed. Metrics can also be displayed in charts or grids, and are accessible through the Azure portal, Azure PowerShell, the Azure CLI, and the Azure Monitor APIs. For more information, see [Azure Monitor metrics](../azure-monitor/essentials/data-platform-metrics.md).  

The metrics listed in the following table are recorded and stored free of charge for a limited period of time. For an extra cost, you can store for a longer period of time.

| Metrics  | Description | Dimensions |
| ------------- | ------------- | ------------- |
| Byte Hit Ratio | The percentage of traffic that was served from the Azure Front Door cache, computed against the total egress traffic. The byte hit ratio is  low if most of the traffic is forwarded to the origin rather than served from the cache. <br/><br/> **Byte Hit Ratio** = (egress from edge - egress from origin)/egress from edge. <br/><br/> Scenarios excluded from bytes hit ratio calculations:<ul><li>You explicitly disable caching, either through the Rules Engine or query string caching behavior.</li><li>You explicitly configure a `Cache-Control` directive with the `no-store` or `private` cache directives.</li></ul> | Endpoint |
| Origin Health Percentage | The percentage of successful health probes sent from Azure Front Door to origins.| Origin, Origin Group |
| Origin Latency | The time calculated from when the request was sent by the Azure Front Door edge to the origin until Azure Front Door received the last response byte from the origin. | Endpoint, Origin |
| Origin Request Count  | The number of requests sent from Azure Front Door to origins. | Endpoint, Origin, HTTP Status, HTTP Status Group |
| Percentage of 4XX | The percentage of all the client requests for which the response status code is 4XX. | Endpoint, Client Country, Client Region |
| Percentage of 5XX | The percentage of all the client requests for which the response status code is 5XX. | Endpoint, Client Country, Client Region |
| Request Count | The number of client requests served through Azure Front Door, including requests served entirely from the cache. | Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| Request Size | The number of bytes sent in requests from clients to Azure Front Door. | Endpoint, Client Country, client Region, HTTP Status, HTTP Status Group |
| Response Size | The number of bytes sent as responses from Front Door to clients. |Endpoint, client Country, client Region, HTTP Status, HTTP Status Group |
| Total Latency | The total time taken from when the client request was received by Azure Front Door until the last response byte was sent from Azure Front Door to the client. |Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| Web Application Firewall Request Count | The number of requests processed by the Azure Front Door web application firewall. | Action, Policy Name, Rule Name |

> [!NOTE]
> If a request to the origin times out, the value of the *Http Status* dimension is **0**.

## Logs

Logs track all requests that pass through Azure Front Door. It can take a few minutes for logs to be processed and stored.

There are multiple Front Door logs, which you can use for different purposes:

- [Access logs](#access-log) can be used to identify slow requests, determine error rates, and understand how Front Door's caching behavior is working for your solution.
- Web application firewall (WAF) logs can be used to detect potential attacks, and false positive detections that might indicate legitimate requests that the WAF blocked. For more information on the WAF logs, see [Azure Web Application Firewall monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md).
- [Health probe logs](#health-probe-log) can be used to identify origins that are unhealthy or that don't respond to requests from some of Front Door's geographically distributed PoPs.
- [Activity logs](#activity-logs) provide visibility into the operations performed on your Azure resources, such as configuration changes to your Azure Front Door profile.

Access logs and WAF logs include a *tracking reference*, which is also propagated in requests to origins and to client responses by using the `X-Azure-Ref` header. You can use the tracking reference to gain an end-to-end view of your application request processing.

Access logs, health probe logs, and WAF logs aren't enabled by default. To enable and store your diagnostic logs, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md). Activity log entries are collected by default, and you can view them in the Azure portal.

## <a name="access-log"></a>Access log

Information about every request is logged into the access log. Each access log entry contains the information listed in the following table.

| Property | Description |
|----------|-------------| 
| TrackingReference | The unique reference string that identifies a request served by Azure Front Door. The tracking reference is sent to the client and to the origin by using the `X-Azure-Ref` headers. Use the tracking reference when searching for a specific request in the access or WAF logs. |
| Time | The date and time when the Azure Front Door edge delivered requested contents to client (in UTC). |
| HttpMethod | HTTP method used by the request: DELETE, GET, HEAD, OPTIONS, PATCH, POST, or PUT. |
| HttpVersion | The HTTP version that the client specified in the request. |
| RequestUri | The URI of the received request. This field contains the full scheme, port, domain, path, and query string. |
| HostName | The host name in the request from client. If you enable custom domains and have wildcard domain (`*.contoso.com`), the HostName log field's value is `subdomain-from-client-request.contoso.com`. If you use the Azure Front Door domain (`contoso-123.z01.azurefd.net`), the HostName log field's value is `contoso-123.z01.azurefd.net`. |
| RequestBytes | The size of the HTTP request message in bytes, including the request headers and the request body. |
| ResponseBytes | The size of the HTTP response message in bytes. |
| UserAgent | The user agent that the client used. Typically, the user agent identifies the browser type. |
| ClientIp | The IP address of the client that made the original request. If there was an `X-Forwarded-For` header in the request, then the client IP address is taken from the header. |
| SocketIp | The IP address of the direct connection to the Azure Front Door edge. If the client used an HTTP proxy or a load balancer to send the request, the value of SocketIp is the IP address of the proxy or load balancer. |
| timeTaken | The length of time from when the Azure Front Door edge received the client's request to the time that Azure Front Door sent the last byte of the response to the client, in seconds. This field doesn't take into account network latency and TCP buffering. |
| RequestProtocol | The protocol that the client specified in the request. Possible values include: **HTTP**, **HTTPS**. |
| SecurityProtocol | The TLS/SSL protocol version used by the request, or null if the request didn't use encryption. Possible values include: **SSLv3**, **TLSv1**, **TLSv1.1**, **TLSv1.2**. |
| SecurityCipher | When the value for the request protocol is HTTPS, this field indicates the TLS/SSL cipher negotiated by the client and Azure Front Door. |
| Endpoint | The domain name of the Azure Front Door endpoint, such as `contoso-123.z01.azurefd.net`. |
| HttpStatusCode | The HTTP status code returned from Azure Front Door. If the request to the origin timed out, the value for the HttpStatusCode field is **0**. If the client closed the connection, the value for the HttpStatusCode field is **499**. |
| Pop | The Azure Front Door edge point of presence (PoP) that responded to the user request.  |
| Cache Status | How the request was handled by the Azure Front Door cache. Possible values are: <ul><li>**HIT** and **REMOTE_HIT**: The HTTP request was served from the Azure Front Door cache.</li><li>**MISS**: The HTTP request was served from origin. </li><li> **PARTIAL_HIT**: Some of the bytes were served from the Front Door edge PoP cache, and other bytes were served from the origin. This status indicates an [object chunking](./front-door-caching.md#delivery-of-large-files) scenario. </li><li> **CACHE_NOCONFIG**: The request was forwarded without caching settings, including bypass scenarios. </li><li> **PRIVATE_NOSTORE**: There was no cache configured in the caching settings by the customer. </li><li> **N/A**: The request was denied by a signed URL or the Rules Engine.</li></ul> |
| MatchedRulesSetName | The names of the Rules Engine rules that were processed. |
| RouteName | The name of the route that the request matched. |
| ClientPort | The IP port of the client that made the request. |
| Referrer | The URL of the site that originated the request. |
| TimetoFirstByte | The length of time, in seconds, from when the Azure Front Door edge received the request to the time the first byte was sent to client, as measured by Azure Front Door. This property doesn't measure the client data. |
| ErrorInfo | If an error occurred during the processing of the request, this field provides detailed information about the error. Possible values are: <ul><li> **NoError**: Indicates no error was found. </li><li> **CertificateError**: Generic SSL certificate error. </li><li> **CertificateNameCheckFailed**: The host name in the SSL certificate is invalid or doesn't match the requested URL. </li><li> **ClientDisconnected**: The request failed because of a client network connection issue. </li><li> **ClientGeoBlocked**: The client was blocked due to the geographical location of the IP address. </li><li> **UnspecifiedClientError**: Generic client error. </li><li> **InvalidRequest**: Invalid request. This response indicates a malformed header, body, or URL. </li><li> **DNSFailure**: A failured occurred during DNS resolution. </li><li> **DNSTimeout**: The DNS query to resolve the origin IP address timed out. </li><li> **DNSNameNotResolved**: The server name or address couldn't be resolved. </li><li> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. </li><li> **OriginConnectionError**: Generic origin connection error. </li><li> **OriginConnectionRefused**: The connection with the origin wasn't established. </li><li> **OriginError**: Generic origin error. </li><li> **ResponseHeaderTooBig**: The origin returned a too large of a response header. </li><li> **OriginInvalidResponse**: The origin returned an invalid or unrecognized response. </li><li> **OriginTimeout**: The timeout period for the origin request expired. </li><li> **ResponseHeaderTooBig**: The origin returned a too large of a response header. </li><li> **RestrictedIP**: The request was blocked because of restricted IP address. </li><li> **SSLHandshakeError**: Azure Front Door was unable to establish a connection with the origin because of an SSL handshake failure. </li><li> **SSLInvalidRootCA**: The root certification authority's certificate was invalid. </li><li> **SSLInvalidCipher**: The HTTPS connection was established using an invalid cipher. </li><li> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. </li><li> **OriginConnectionRefused**: The connection with the origin wasn't established. </li><li> **UnspecifiedError**: An error occurred that didn’t fit in any of the errors in the table. </li></ul> |
| OriginURL | The full URL of the origin where the request was sent. The URL is composed of the scheme, host header, port, path, and query string. <br> **URL rewrite**: If the request URL was rewritten by the Rules Engine, the path refers to the rewritten path. <br> **Cache on edge PoP**: If the request was served from the Azure Front Door cache, the origin is **N/A**. <br> **Large request**: If the requested content is large and there are multiple chunked requests going back to the origin, this field corresponds to the first request to the origin. For more information, see [Object Chunking](./front-door-caching.md#delivery-of-large-files). |
| OriginIP | The IP address of the origin that served the request. <br> **Cache on edge PoP**: If the request was served from the Azure Front Door cache, the origin is **N/A**. <br> **Large request**: If the requested content is large and there are multiple chunked requests going back to the origin, this field corresponds to the first request to the origin. For more information, see [Object Chunking](./front-door-caching.md#delivery-of-large-files). |
| OriginName| The full hostname (DNS name) of the origin. <br> **Cache on edge PoP**: If the request was served from the Azure Front Door cache, the origin is **N/A**. <br> **Large request**: If the requested content is large and there are multiple chunked requests going back to the origin, this field corresponds to the first request to the origin. For more information, see [Object Chunking](./front-door-caching.md#delivery-of-large-files). |

## Health probe log

Azure Front Door logs every failed health probe request. These logs can help you to diagnose problems with an origin. The logs provide you with information that you can use to investigate the failure reason and then bring the origin back to a healthy status.

Some scenarios this log can be useful for are:

- You noticed Azure Front Door traffic was sent to a subset of the origins. For example, you might have noticed that only three out of four origins receive traffic. You want to know if the origins are receiving and responding to health probes so you know whether the origins are healthy.
- You noticed the origin health percentage metric is lower than you expected. You want to know which origins are recorded as unhealthy and the reason for the health probe failures.

Each health probe log entry has the following schema:

| Property | Description |
| --- | --- |
| HealthProbeId  | A unique ID to identify the health probe request. |
| Time | The date and time when the health probe was sent (in UTC). |
| HttpMethod | The HTTP method used by the health probe request. Values include **GET** and **HEAD**, based on the health probe's configuration. |
| Result | The status of health probe. The value is either **success** or a description of the error the probe received. |
| HttpStatusCode  | The HTTP status code returned by the origin. |
| ProbeURL | The full target URL to where the probe request was sent. The URL is composed of the scheme, host header, path, and query string. |
| OriginName  | The name of the origin that the health probe was sent to. This field helps you to locate origins of interest if origin is configured to use an FDQN. |
| POP | The edge PoP that sent the probe request. |
| Origin IP | The IP address of the origin that the health probe was sent to. |
| TotalLatency | The time from when the Azure Front Door edge sent the health probe request to the origin to when the origin sent the last response to Azure Front Door. |
| ConnectionLatency| The time spent setting up the TCP connection to send the HTTP probe request to the origin. | 
| DNSResolution Latency | The time spent on DNS resolution. This field only has a value if the origin is configured to be an FDQN instead of an IP address. If the origin is configured to use an IP address, the value is **N/A**. |

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

Activity logs provide information about the management operations on your Azure Front Door resources. The logs include details about each write operation that was performed on an Azure Front Door resource, including when the operation occurred, who performed it, and what the operation was.

> [!NOTE]
> Activity logs don't include read operations. They also might not include all operations that you perform by using either the Azure portal or classic management APIs.

For more information, see [View your activity logs](./standard-premium/how-to-logs.md#view-your-activity-logs).

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
>If a request to the origin times out, the value for HttpStatusCode is set to **0**.

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
| HttpStatusCode | The HTTP status code returned from the proxy. If a request to the origin times out, the value for HttpStatusCode is set to **0**.|
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
| ErrorInfo | This field contains the specific type of error for further troubleshooting. </br> Possible values include: </br> **NoError**: Indicates no error was found. </br> **CertificateError**: Generic SSL certificate error.</br> **CertificateNameCheckFailed**: The host name in the SSL certificate is invalid or doesn't match. </br> **ClientDisconnected**: Request failure because of client network connection. </br> **UnspecifiedClientError**: Generic client error. </br> **InvalidRequest**: Invalid request. It might occur because of malformed header, body, and URL. </br> **DNSFailure**: DNS Failure. </br> **DNSNameNotResolved**: The server name or address couldn't be resolved. </br> **OriginConnectionAborted**: The connection with the origin was stopped abruptly. </br> **OriginConnectionError**: Generic origin connection error. </br> **OriginConnectionRefused**: The connection with the origin wasn't able to established. </br> **OriginError**: Generic origin error. </br> **OriginInvalidResponse**: Origin returned an invalid or unrecognized response. </br> **OriginTimeout**: The timeout period for origin request expired. </br> **ResponseHeaderTooBig**: The origin returned too large of a response header. </br> **RestrictedIP**: The request was blocked because of restricted IP. </br> **SSLHandshakeError**: Unable to establish connection with origin because of SSL hand shake failure. </br> **UnspecifiedError**: An error occurred that didn’t fit in any of the errors in the table. </br> **SSLMismatchedSNI**:The request was invalid because the HTTP message header didn't match the value presented in the TLS SNI extension during SSL/TLS connection setup.|

### Sent to origin shield deprecation

The raw log property **isSentToOriginShield** has been deprecated and replaced by a new field **isReceivedFromClient**. Use the new field if you're already using the deprecated field. 

Raw logs include logs generated from both CDN edge (child POP) and origin shield. Origin shield refers to parent nodes that are strategically located across the globe. These nodes communicate with origin servers and reduce the traffic load on origin. 

For every request that goes to an origin shield, there are two log entries:

* One for edge nodes
* One for origin shield. 

To differentiate the egress or responses from the edge nodes vs. origin shield, you can use the field **isReceivedFromClient** to get the correct data. 

If the value is false, then it means the request is responded from origin shield to edge nodes. This approach is effective to compare raw logs with billing data. Charges aren't incurred for egress from origin shield to the edge nodes. Charges are incurred for egress from the edge nodes to clients. 

**Kusto query sample to exclude logs generated on origin shield in Log Analytics.**

`AzureDiagnostics 
| where Category == "FrontdoorAccessLog" and isReceivedFromClient_b == true`

> [!NOTE]
> For various routing configurations and traffic behaviors, some of the fields like backendHostname, cacheStatus, isReceivedFromClient, and POP field may respond with different values. The following table explains the different values these fields will have for various scenarios:

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
