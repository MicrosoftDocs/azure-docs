---
title: Protocol support for HTTP headers in Azure Front Door
description: This article describes HTTP header protocols that Front Door supports.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 01/16/2023
ms.author: duau
---

# Protocol support for HTTP headers in Azure Front Door

This article outlines the protocol that Front Door supports with parts of the call path (see image). In the following sections, you'll find information about HTTP headers supported by Front Door.

:::image type="content" source="./media/front-door-http-headers-protocol/front-door-protocol-summary.png" alt-text="Diagram showing client making request to Front Door, which is forwarded to the backend. The response is sent from Front Door to the client." border="false":::

> [!IMPORTANT]
> Front Door doesn't certify any HTTP headers that aren't documented here.

## From client to the Front Door

Azure Front Door accepts most headers for the incoming request without modifying them. Some reserved headers are removed from the incoming request if sent, including headers with the X-FD-* prefix.

The debug request header, "X-Azure-DebugInfo", provides extra debugging information about the Front Door. You'll need to send "X-Azure-DebugInfo: 1" request header from the client to the AzureFront Door to receive [optional response headers](#optional-debug-response-headers) when Front Door response to the client. 

## From the Front Door to the backend

Azure Front Door includes headers for an incoming request unless they're removed because of restrictions. Front Door also adds the following headers:

| Header  | Example and description |
| ------------- | ------------- |
| Via |  *Via: 1.1 Azure* </br> Front Door adds the client's HTTP version followed by *Azure* as the value for the Via header. This header indicates the client's HTTP version and that Front Door was an intermediate recipient for the request between the client and the backend.  |
| X-Azure-ClientIP | *X-Azure-ClientIP: 127.0.0.1* </br> Represents the client IP address associated with the request being processed. For example, a request coming from a proxy might add the X-Forwarded-For header to indicate the IP address of the original caller. |
| X-Azure-SocketIP |  *X-Azure-SocketIP: 127.0.0.1* </br> Represents the socket IP address associated with the TCP connection that the current request originated from. A request's client IP address might not be equal to its socket IP address because the client IP can be arbitrarily overwritten by a user.|
| X-Azure-Ref | *X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz* </br> A unique reference string that identifies a request served by Front Door. It's used to search access logs and critical for troubleshooting.|
| X-Azure-RequestChain | *X-Azure-RequestChain: hops=1* </br> A header that Front Door uses to detect request loops, and users shouldn't take a dependency on it. |
| X-Azure-FDID | *X-Azure-FDID: 55ce4ed1-4b06-4bf1-b40e-4638452104da* <br/> A reference string that identifies the request came from a specific Front Door resource. The value can be seen in the Azure portal or retrieved using the management API. You can use this header in combination with IP ACLs to lock down your endpoint to only accept requests from a specific Front Door resource. See the FAQ for [more detail](front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-) |
| X-Forwarded-For | *X-Forwarded-For: 127.0.0.1* </br> The X-Forwarded-For (XFF) HTTP header field often identifies the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. If there's an existing XFF header, then Front Door appends the client socket IP to it or adds the XFF header with the client socket IP. |
| X-Forwarded-Host | *X-Forwarded-Host: contoso.azurefd.net* </br> The X-Forwarded-Host HTTP header field is a common method used to identify the original host requested by the client in the Host HTTP request header. This is because the host name from Front Door may differ for the backend server handling the request. Any previous value will be overridden by Front Door. |
| X-Forwarded-Proto | *X-Forwarded-Proto: http* </br> The X-Forwarded-Proto HTTP header field is often used to identify the originating protocol of an HTTP request. Front Door based on configuration might communicate with the backend by using HTTPS. This is true even if the request to the reverse proxy is HTTP. Any previous value will be overridden by Front Door. |
| X-FD-HealthProbe | X-FD-HealthProbe HTTP header field is used to identify the health probe from Front Door. If this header is set to 1, the request is from the health probe. It can be used to restrict access from Front Door with a particular value for the X-Forwarded-Host header field. |

## From the Front Door to the client

Any headers sent to Azure Front Door from the backend are also passed through to the client. Front Door also attaches the following headers to all responses to the client:

| Header  | Example and description |
| ------------- | ------------- |
| X-Azure-Ref |  *X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz* </br> This is a unique reference string that identifies a request served by Front Door, which is critical for troubleshooting as it's used to search access logs.|
| X-Cache | *X-Cache:* This header describes the caching status of the request. For more information, see [Caching with Azure Front Door](front-door-caching.md#response-headers). |

### Optional debug response headers

You need to send "X-Azure-DebugInfo: 1" request header to enable the following optional response headers.

| Header  | Example and description |
| ------------- | ------------- |
| X-Azure-OriginStatusCode |  *X-Azure-OriginStatusCode: 503* </br> This header contains the HTTP status code returned by the backend. Using this header you can identify the HTTP status code returned by the application running in your backend without going through backend logs. This status code might be different from the HTTP status code in the response sent to the client by Front Door. This header allows you to determine if the backend is misbehaving or if the issue is with the Front Door service. |
| X-Azure-InternalError | This header will contain the error code that Front Door comes across when processing the request. This error indicates the issue is internal to the Front Door service/infrastructure. Report issue to support.  |
| X-Azure-ExternalError | *X-Azure-ExternalError: 0x830c1011, The certificate authority is unfamiliar.* </br> This header shows the error code that Front Door servers come across while establishing connectivity to the backend server to process a request. This header will help identify issues in the connection between Front Door and the backend application. This header will include a detailed error message to help you identify connectivity issues to your backend (for example, DNS resolution, invalid cert, and so on.). |

## Next steps

* Learn how to [create an Azure Front Door profile](quickstart-create-front-door.md).
* Learn about [how Azure Front Door works](front-door-routing-architecture.md).
