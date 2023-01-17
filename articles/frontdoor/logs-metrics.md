---
title: Logs and metrics - Azure Front Door | Microsoft Docs
description: This article explains how Azure Front Door records telemetry by using Azure Monitor logs and metrics.
services: front-door
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/16/2023
ms.author: jodowns
---

# Logs and metrics tracked by Azure Front Door

Azure Front Door provides several features to help you monitor your application, track requests, and debug your Front Door configuration. Telemetry is captured and managed by [Azure Monitor](TODO).

## Metrics

Azure Front Door measures and sends its metrics in 60-second intervals. The metrics can take up to 3 minutes to be processed by Azure Monitor and to appear in the portal. Metrics can be displayed in charts or grids, and are accessible through the Azure portal, PowerShell, the Azure CLI, and the Azure Monitor APIs. For more information, see [Azure Monitor metrics](../../azure-monitor/essentials/data-platform-metrics.md).  

The metrics listed in the table below are recorded and stored free of charge. You can enable additional metrics or storage for an extra cost.

| Metrics  | Description | Dimensions |
| ------------- | ------------- | ------------- |
| Bytes Hit ratio | The percentage of traffic that was served from the Azure Front Door cache, computed against the total egress. </br> **Byte Hit Ratio** = (egress from edge - egress from origin)/egress from edge. </br> **Scenarios excluded in bytes hit ratio calculation**:</br> 1. You explicitly configure no cache either through the Rules Engine or query string caching behavior. </br> 2. You explicitly configure cache-control directive with no-store or private cache. </br>3. Byte hit ratio can be low if most of the traffic is forwarded to origin rather than served from caching based on your configurations or scenarios. | Endpoint |
| RequestCount | The number of client requests served by CDN. | Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| ResponseSize | The number of bytes sent as responses from Front Door to clients. |Endpoint, client Country, client Region, HTTP Status, HTTP Status Group |
| TotalLatency | The total time from the client request received by CDN **until the last response byte send from CDN to client**. |Endpoint, Client Country, Client Region, HTTP Status, HTTP Status Group |
| RequestSize | The number of bytes sent as requests from clients to AFD. | Endpoint, Client Country, client Region, HTTP status, HTTP Status Group |
| 4XX % ErrorRate | The percentage of all the client requests for which the response status code is 4XX. | Endpoint, Client Country, Client Region |
| 5XX % ErrorRate | The percentage of all the client requests for which the response status code is 5XX. | Endpoint, Client Country, Client Region |
| OriginRequestCount  | The number of requests sent from AFD to origin | Endpoint, Origin, HTTP Status, HTTP Status Group |
| OriginLatency | The time calculated from when the request was sent by AFD edge to the backend until AFD received the last response byte from the backend. | Endpoint, Origin |
| OriginHealth% | The percentage of successful health probes from AFD to origin.| Origin, Origin Group |
| WAF request count | Matched WAF request. | Action, Rule Name, Policy Name |

> [!NOTE]
> If a request to the the origin times out, the value for the Http Status dimension is **0**.

## Logs

Logs track all requests that pass through Azure Front Door. Logs can take a few minutes to be stored and processed. Several types of logs are recorded:

* [Access logs](#access-log) track detailed information about every request that Azure Front Door receives. They help you to analyze and monitor access patterns, and debug issues.
* [Health probe logs](#health-probe-log) track the requests that Azure Front Door's health probes make to your origins. They help you to find and resolve origin health issues.
* [Web application firewall (WAF) logs](#web-application-firewall-log) provide detailed information about requests that are processed by the Azure Front Door WAF. When your WAF is enabled, requests are logged whether the WAF is configured to use detection or prevention mode.
* [Activity logs](#activity-logs) provide visibility into the operations done on Azure resources, such as configuration changes to your Azure Front Door profile.

Access logs, health probe logs, and WAF logs aren't enabled by default. To enable and store your diagnostic logs, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).

Activity log entries are collected by default, and you can view them in the Azure portal.

## Access log

Azure Front Door logs each request into the access log. Each access log entry contains the information listed below.

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
| Cache Status | Provides the status code of how the request gets handled by the CDN service when it comes to caching. Possible values are HIT: The HTTP request was served from AFD edge POP cache. <br> **MISS**: The HTTP request was served from origin. <br/> **PARTIAL_HIT**: Some of the bytes from a request got served from AFD edge POP cache while some of the bytes got served from origin for object chunking scenarios. <br> **CACHE_NOCONFIG**: Forwarding requests without caching settings, including bypass scenario. <br/> **PRIVATE_NOSTORE**: No cache configured in caching settings by customers. <br> **REMOTE_HIT**: The request was served by parent node cache. <br/> **N/A**: Request that was denied by Signed URL and Rules Set. |
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

Each health probe log has the following schema.

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

The following example JSON file shows a health probe log entry.

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

For more information on the Front Door web application firewall (WAF) logs, see [Azure Web Application Firewall monitoring and logging](../../web-application-firewall/afds/waf-front-door-monitor.md).

## Activity logs

Activity logs provide information about the operations done to manage your Azure Front Door Standard/Premium. The logs include details about each write operation that was performed on an Azure Front Door resource, including when the operation occurred, who performed it, and what the operation was. Access activity logs in your Front Door or all the logs of your Azure resources in Azure Monitor.

> [!NOTE]
> Activity logs don't include read operations. They also don't include operations that you perform by using either the Azure portal or the original Management API.

## Next steps

To enable and store your diagnostic logs, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).
