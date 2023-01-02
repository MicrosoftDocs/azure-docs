---
title: Reference - Azure API Management resource log
description: Schema reference for the Azure API Management GatewayLogs resource log
services: api-management
author: dlepow

ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/14/2020
ms.author: danlep
---
# Reference: API Management resource log schema

This article provides a schema reference for the Azure API Management GatewayLogs resource log. Log entries also include fields in the [top-level common schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema).

To enable collection of the resource log in API Management, see [Monitor published APIs](api-management-howto-use-azure-monitor.md#resource-logs).

## GatewayLogs schema

The following properties are logged for each API request.

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| ApiId | string | API entity identifier for current request |
| ApimSubscriptionId | string | Subscription entity identifier for current request |
| ApiRevision | string | API revision for current request |
| BackendId | string | Backend entity identifier for current request |
| BackendMethod | string | HTTP method of the request sent to a backend |
| BackendProtocol | string | HTTP protocol version of the request sent to a backend |
| BackendRequestBody | string | Backend request body |
| BackendRequestHeaders | dynamic | Collection of HTTP headers sent to a backend |
| BackendResponseBody | string | Backend response body |
| BackendResponseCode | int | Code of the HTTP response received from a backend |
| BackendResponseHeaders | dynamic | Collection of HTTP headers received from a backend |
| BackendTime | long | Number of milliseconds spent on overall backend I/O (connecting, sending, and receiving bytes) |
| BackendUrl | string | URL of the request sent to a backend |
| Cache | string | Status of API Management cache involvement in request processing (hit, miss, none) |
| CacheTime | long | Number of milliseconds spent on overall API Management cache IO (connecting, sending and receiving bytes) |
| ClientProtocol | string | HTTP protocol version of the incoming request |
| ClientTime | long | Number of milliseconds spent on overall client I/O (connecting, sending, and receiving bytes) |
| ClientTlsVersion | string | TLS version used by client sending request |
| Errors | dynamic | Collection of error occurred during request processing |
| IsRequestSuccess | bool | HTTP request completed with response status code within 2xx or 3xx range |
| LastErrorElapsed | long | Number of milliseconds elapsed since gateway received request until the error occurred |
| LastErrorMessage | string | Error message |
| LastErrorReason | string | Error reason |
| LastErrorScope | string | Scope of the policy document containing policy caused the error |
| LastErrorSection | string | Section of the policy document containing policy caused the error |
| LastErrorSource | string | Naming of the policy or processing internal handler caused the error |
| Method | string | HTTP method of the incoming request |
| OperationId | string | Operation entity identifier for current request |
| ProductId | string | Product entity identifier for current request |
| RequestBody | string | Client request body |
| RequestHeaders | dynamic | Collection of HTTP headers sent by a client |
| RequestSize | int | Number of bytes received from a client during request processing |
| ResponseBody | string | Gateway response body |
| ResponseCode | int | Status code of the HTTP response sent to a client |
| ResponseHeaders | dynamic | Collection of HTTP headers sent to a client |
| ResponseSize | int | Number of bytes sent to a client during request processing |
| TotalTime | long | Number of milliseconds spent on overall HTTP request (from first byte received by API Management to last byte a client received back) |
| TraceRecords | dynamic | Records emitted by trace policies |
| Url | string | URL of the incoming request |
| UserId | string | User entity identifier for current request |


## Next steps

* For information about monitoring APIs in API Management, see [Monitor published APIs](api-management-howto-use-azure-monitor.md)
* Learn more about [Common and service-specific schema for Azure Resource Logs](../azure-monitor/essentials/resource-logs-schema.md)

