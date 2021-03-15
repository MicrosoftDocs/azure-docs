---
title: 'Azure Front Door Standard/Premium (Preview) Logging'
description: This article explains how logging works in Azure Front Door Standard/Premium.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: article
ms.date: 03/15/2021
ms.author: duau
---

# Azure Front Door Standard/Premium (Preview) Logging

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door provides different logging to help you track, monitor, and debug your Front Door. 

* Access logs have detailed information about every request that AFD receives and help you analyze and monitor access patterns, and debug issues. 
* Activity logs provide visibility into the operations done on Azure resources.  
* Health Probe logs provides the logs for every failed probe to your origin. 
* Web Application Firewall (WAF) logs provide detailed information of requests that gets logged through either detection or prevention mode of an Azure Front Door endpoint. A custom domain that gets configured with WAF can also be viewed through these logs.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Access Logs, health probe logs and WAF logs aren't enabled by default. Use the steps below to enable logging. Activity log entries are collected by default, and you can view them in the Azure portal. Logs can have delays up to a few minutes. 

You have three options for storing your logs: 

* **Storage account:** Storage accounts are best used for scenarios when logs are stored for a longer duration and reviewed when needed. 
* **Event hubs:** Event hubs are a great option for integrating with other security information and event management (SIEM) tools or external data stores. For example: Splunk/DataDog/Sumo. 
* **Azure Log Analytics:** Azure Log Analytics in Azure Monitor is best used for general real-time monitoring and analysis of Azure Front Door performance.

## Configure Logs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for Azure Front Door Standard/Premium and select the Azure Front Door profile.

1. In the profile, go to **Monitoring**, select **Diagnostic Setting**. Select **Add diagnostic setting**.

   :::image type="content" source="../media/how-to-logging/front-door-logging-1.png" alt-text="Screenshot of diagnostic settings landing page.":::

1. Under **Diagnostic settings**, enter a name for **Diagnostic settings name**.

1. Select the **log** from **FrontDoorAccessLog**, **FrontDoorHealthProbeLog**, and **FrontDoorWebApplicationFirewallLog**.

1. Select the **Destination details**. Destination options are: 

    * **Send to Log Analytics**
        * Select the *Subscription* and *Log Analytics workspace*.
    * **Archive to a storage account**
        * Select the *Subscription* and the *Storage Account*. and set **Retention (days)**.
    * **Stream to an event hub**
        * Select the *Subscription, Event hub namespace, Event hub name (optional)*, and *Event hub policy name*. 

     :::image type="content" source="../media/how-to-logging/front-door-logging-2.png" alt-text="Screenshot of diagnostic settings page.":::

1. Click on **Save**.

## Access Log

Azure Front Door currently provides individual API requests with each entry having the following schema and logged in JSON format as shown below. 

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
| Latency | The length of time from the time AFD edge server receives a client's request to the time that AFD sends the last byte of response to client,  in milliseconds. This field doesn't take into account network latency and TCP buffering. |
| RequestProtocol | The protocol that the client specified in the request: HTTP, HTTPS. |
| SecurityProtocol | The TLS/SSL protocol version used by the request or null if no encryption. Possible values include: SSLv3, TLSv1, TLSv1.1, TLSv1.2 |
| SecurityCipher | When the value for Request Protocol is HTTPS, this field indicates the TLS/SSL cipher negotiated by the client and AFD for encryption. |
| Endpoint | The domain name of AFD endpoint, for example, contoso.z01.azurefd.net |
| HttpStatusCode | The HTTP status code returned from AFD. |
| Pop | The edge pop, which responded to the user request.  |
| Cache Status | Provides the status code of how the request gets handled by the CDN service when it comes to caching. Possible values are HIT: The HTTP request was served from AFD edge POP cache. <br> **MISS**: The HTTP request was served from origin. <br/> **PARTIAL_HIT**: Some of the bytes from a request got served from AFD edge POP cache while some of the bytes got served from origin for object chunking scenarios. <br> **CACHE_NOCONFIG**: Forwarding requests without caching settings, including bypass scenario. <br/> **PRIVATE_NOSTORE**: No cache configured in caching settings by customers. <br> **REMOTE_HIT**: The request was served by parent node cache. <br/> **N/A**:** Request that was denied by Signed URL and Rules Set. |
| MatchedRulesSetName | The names of the rules that were processed. |
| RouteName | The name of the route that the request matched. |
| ClientPort | The IP port of the client that made the request. |
| Referrer | The URL of the site that originated the request. |
| TimetoFirstByte | The length of time in milliseconds from AFD receives the request to the time the first byte gets sent to client, as measured on Azure Front Door. This property doesn't measure the client data. |
| ErrorInfo | This field provides detailed info of the error token for each response. <br> **NoError**: Indicates no error was found. <br> **CertificateError**: Generic SSL certificate error. <br> **CertificateNameCheckFailed**: The host name in the SSL certificate is invalid or doesn't match. <br> **ClientDisconnected**: Request failure because of client network connection. <br> **ClientGeoBlocked**: The client was blocked due geographical location of the IP. <br> **UnspecifiedClientError**: Generic client error. <br> **InvalidRequest**: Invalid request. It might occur because of malformed header, body, and URL. <br> **DNSFailure**: DNS Failure. <br> **DNSTimeout**: The DNS query to resolve the backend timed out. <br> **DNSNameNotResolved**: The server name or address couldn't be resolved. <br> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. <br> **OriginConnectionError**: Generic origin connection error. <br> **OriginConnectionRefused**: The connection with the origin wasn't established. <br> **OriginError**: Generic origin error. <br> **OriginInvalidRequest**: An invalid request was sent to the origin. <br> **ResponseHeaderTooBig**: The origin returned a too large of a response header. <br> **OriginInvalidResponse**:** Origin returned an invalid or unrecognized response. <br> **OriginTimeout**: The timeout period for origin request expired. <br> **ResponseHeaderTooBig**: The origin returned a too large of a response header. <br> **RestrictedIP**: The request was blocked because of restricted IP. <br> **SSLHandshakeError**: Unable to establish connection with origin because of SSL hand shake failure. <br> **SSLInvalidRootCA**: The RootCA was invalid. <br> **SSLInvalidCipher**: Cipher was invalid for which the HTTPS connection was established. <br> **OriginConnectionAborted**: The connection with the origin was disconnected abnormally. <br> **OriginConnectionRefused**: The connection with the origin wasn't established. <br> **UnspecifiedError**: An error occurred that didn’t fit in any of the errors in the table. |
| OriginURL | The full URL of the origin where requests are being sent. Composed of the scheme, host header, port, path, and query string. <br> **URL rewrite**: If there's a URL rewrite rule in Rule Set, path refers to rewritten path. <br> **Cache on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |
| OriginIP | The origin IP that served the request. <br> **Cache hit on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |
| OriginName| The full DNS name (hostname in origin URL) to the origin. <br> **Cache hit on edge POP** If it's a cache hit on edge POP, the origin is N/A. <br> **Large request** If the requested content is large with multiple chunked requests going back to the origin, this field will correspond to the first request to the origin. For more information, see Object Chunking for more details. |

## Health Probe Log

Health probe logs provide logging for every failed probe to help you diagnose your origin. The logs will provide you information that you can use to bring the origin back to service. Some scenarios this log can be useful for are:

* You noticed Azure Front Door traffic was sent to some of the origins. For example, only three out of four origins receiving traffic. You want to know if the origins are receiving probes and if not the reason for the failure.  

* You noticed the origin health % is lower than expected and want to know which origin failed and the reason of the failure.

### Health Probe Log Properties

Each health probe log has the following schema.

| Property | Description |
| --- | --- |
| HealthProbeId  | A unique ID to identify the request. |
| Time | Probe complete time |
| HttpMethod | HTTP method used by the health probe request. Values include GET and HEAD, based on health probe configurations. |
| Result | Status of health probe to origin, value includes success, and other error text. |
| HttpStatusCode  | The HTTP status code returned from the origin. |
| ProbeURL (target) | The full URL of the origin where requests are being sent. Composed of the scheme, host header, path, and query string. |
| OriginName  | The origin where requests are being sent. This field helps locate origins of interest if origin is configured to FDQN. |
| POP | The edge pop, which sent out the probe request. |
| Origin IP | Target origin IP. This field is useful in locating origins of interest if you configure origin using FDQN. |
| TotolaLatency | The time from AFDX edge sends the request to origin to the time origin sends the last response to AFDX edge. |
| ConnectionLatency| Duration Time spent on setting up the TCP connection to send the HTTP Probe request to origin. | 
| DNSResolution Latency | Duration Time spent on DNS resolution if the origin is configured to be an FDQN instead of IP. N/A if the origin is configured to IP. |

### Health Probe Log Sample in JSON

`{ "records": [ { "time": "2021-02-02T07:15:37.3640748Z",
      "resourceId": "/SUBSCRIPTIONS/27CAFCA8-B9A4-4264-B399-45D0C9CCA1AB/RESOURCEGROUPS/AFDXPRIVATEPREVIEW/PROVIDERS/MICROSOFT.CDN/PROFILES/AFDXPRIVATEPREVIEW-JESSIE",
      "category": "FrontDoorHealthProbeLog",
      "operationName": "Microsoft.Cdn/Profiles/FrontDoorHealthProbeLog/Write",
      "properties": { "healthProbeId": "9642AEA07BA64675A0A7AD214ACF746E",
        "POP": "MAA",
        "httpVerb": "HEAD",
        "result": "OriginError",
        "httpStatusCode": "400",
        "probeURL": "http://afdxprivatepreview.blob.core.windows.net:80/",
        "originName": "afdxprivatepreview.blob.core.windows.net",
        "originIP": "52.239.224.228:80",
        "totalLatencyMilliseconds": "141",
        "connectionLatencyMilliseconds": "68",
        "DNSLatencyMicroseconds": "1814" } } ]
} `

## Activity Logs

Activity logs provide information about the operations done on Azure Front Door Standard/Premium. The logs include details about what, who and when a write operation was done on Azure Front Door. 

> [!NOTE]
> Activity logs don't include GET operations. They also don't include operations that you perform by using either the Azure portal or the original Management API. 

Access activity logs in your Front Door or all the logs of your Azure resources in Azure Monitor.

To view activity logs:

1. Select your Front Door profile.

1. Select **Activity log.**

1. Choose a filtering scope and then select **Apply**.

## Next steps

- Learn about [Azure Front Door Standard/Premium (Preview) Reports](how-to-reports.md).
- Learn about [Azure Front Door Standard/Premium (Preview) real time monitoring metrics](how-to-monitor-metrics.md).
