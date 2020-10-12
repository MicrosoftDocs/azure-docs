---
title: API Management diagnostic log reference |Microsoft Docs
description: [add description]
services: api-management
author: vladvino

ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/12/2020
ms.author: apimpm
---
# Reference for API Management diagnostic log schema

This reference lists fields in the ApiManagementGatewayLogs table.

## Schema

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| tenantID | | |
| sourceSystem | | |
| timeGenerated (UTC) | date-time | Timestamp of when the gateway starts process the request ||
| operationName | string | Constant value 'Microsoft.ApiManagement/GatewayLogs' |
| correlationId | string | Unique http request identifier assigned by API Management |
| region | string | Name of the Azure region where the Gateway that processed the request was located |
| isRequestSuccess | boolean | True if the HTTP request completed with response status code within 2xx or 3xx range |
| category | string | Constant value 'GatewayLogs' |
| totalTime | integer | Number of milliseconds from the moment gateway received request until the moment response sent in full. It includes clienTime, cacheTime, and backendTime. |
| callerIpAddress | string | IP address of immediate Gateway caller (can be an intermediary) |
| method | string | HTTP method of the incoming request |
| url | string | URL of the incoming request |
| clientProtocol | string | HTTP protocol version of the incoming request |
| responseCode | integer | Status code of the HTTP response sent to a client |
| responseSize | integer | Number of bytes sent to a client during request processing | 
| cache | string | Status of API Management cache involvement in request processing (i.e., hit, miss, none) | 
| apiId | string | API entity identifier for current request | 
| lastErrorSource | object | Last request processing error | 
| lastErrorSection | object | Last request processing error | 
| lastErrorReason | object | Last request processing error | 
| lastErrorMessage | object | Last request processing error | 
| apiRevision | string |  | 
| clientTlsVersion| string |  |
| Type | string | |
| _resourceId | string | ID of the API Management resource /SUBSCRIPTIONS/\<subscription>/RESOURCEGROUPS/\<resource-group>/PROVIDERS/MICROSOFT.APIMANAGEMENT/SERVICE/\<name> |
| properties | object | Properties of the current request |
| httpStatusCodeCategory | string | Category of http response status code: Successful (301 or less or 304 or 307), Unauthorized (401, 403, 429), Erroneous (400, between 500 and 600), Other |




| backendMethod | string | HTTP method of the request sent to a backend |
| backendUrl | string | URL of the request sent to a backend |
| backendResponseCode | integer | Code of the HTTP response received from a backend |
| backendProtocol | string | HTTP protocol version of the request sent to a backend | 
| requestSize | integer | Number of bytes received from a client during request processing | 

| cacheTime | integer | Number of milliseconds spent on overall API Management cache IO (connecting, sending, and receiving bytes) | 
| backendTime | integer | Number of milliseconds spent on overall backend IO (connecting, sending and receiving bytes) | 
| clientTime | integer | Number of milliseconds spent on overall client IO (connecting, sending and receiving bytes) | 

| operationId | string | Operation entity identifier for current request | 
| productId | string | Product entity identifier for current request | 
| userId | string | User entity identifier for current request | 
| apimSubscriptionId | string | Subscription entity identifier for current request | 
| backendId | string | Backend entity identifier for current request | 
| LastError | object | Last request processing error | 
| elapsed | integer | Number of milliseconds elapsed between when the gateway received the request  and the moment the error occurred | 
| source | string | Name of the policy or processing internal handler caused the error | 
| scope | string | Scope of the policy document containing the policy that caused the error | 
| section | string | Section of the policy document containing the policy that caused the error | 
| reason | string | Error reason | 
| message | string | Error message | 
| LastError | object | Last request processing error | 


| time | date-time | Timestamp of when the gateway starts process the request |
| durationMs | integer | Number of milliseconds from the moment gateway received request until the moment response sent in full. It includes clienTime, cacheTime, and backendTime. |

## Next steps


