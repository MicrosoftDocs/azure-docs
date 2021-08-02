---
title: Reference - Azure API Management resource log
description: Schema reference for the Azure API Management GatewayLogs resource log
services: api-management
author: dlepow

ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/14/2020
ms.author: apimpm
---
# Reference: API Management resource log schema

This article provides a schema reference for the Azure API Management GatewayLogs resource log. Log entries also include fields in the [top-level common schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema).

To enable collection of the resource log in API Management, see [Monitor published APIs](api-management-howto-use-azure-monitor.md#resource-logs).

## GatewayLogs schema

The following properties are logged for each API request.

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| method | string | HTTP method of the incoming request |
| url | string | URL of the incoming request |
| responseCode | integer | Status code of the HTTP response sent to a client |
| responseSize | integer | Number of bytes sent to a client during request processing | 
| cache | string | Status of API Management cache involvement in request processing (hit, miss, none) | 
| apiId | string | API entity identifier for current request | 
| operationId | string | Operation entity identifier for current request | 
| clientProtocol | string | HTTP protocol version of the incoming request |
| clientTime | integer | Number of milliseconds spent on overall client I/O (connecting, sending, and receiving bytes) | 
| apiRevision | string | API revision for current request | 
| clientTlsVersion| string | TLS version used by client sending request |
| lastError | object | For an unsuccessful request, details about the last request processing error | 
| backendMethod | string | HTTP method of the request sent to a backend |
| backendUrl | string | URL of the request sent to a backend |
| backendResponseCode | integer | Code of the HTTP response received from a backend |
| backedProtocol | string | HTTP protocol version of the request sent to a backend |
| backendTime | integer | Number of milliseconds spent on overall backend IO (connecting, sending, and receiving bytes) | 


## Next steps

* For information about monitoring APIs in API Management, see [Monitor published APIs](api-management-howto-use-azure-monitor.md)
* Learn more about [Common and service-specific schema for Azure Resource Logs](../azure-monitor/essentials/resource-logs-schema.md)

