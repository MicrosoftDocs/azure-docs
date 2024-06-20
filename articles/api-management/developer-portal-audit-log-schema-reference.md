---
title: Reference - Azure API Management developer portal audit log
description: Schema reference for the Azure API Management DeveloperPortalAuditLogs log. Entries include properties that are logged for requests to the developer portal. 
services: api-management
author: dlepow

ms.service: api-management
ms.custom: mvc
ms.topic: reference
ms.date: 05/14/2024
ms.author: danlep
---
# Reference: Developer portal audit log schema

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article provides a schema reference for the Azure API Management DeveloperPortalAuditLogs resource log. 

To enable collection of the resource log in API Management, see [Enable logging of developer portal usage](developer-portal-enable-usage-logs.md).

## DeveloperPortalAuditLogs schema

The following fields are logged for each request to the developer portal.

| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| Sku | string | Pricing tier |
| DeploymentVersion | string | API Management code base version |
| Level | int | Log level as number from 1 - 5.<br/><br/> `1 - 2`: errors<br/> `3`: warnings<br/> `4 - 5`: tracing logs|
| resourceId | string | Azure Resource Manager resource identifier<br/><br/>Example: `/SUBSCRIPTIONS/MYSUBSCRIPTION/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.APIMANAGEMENT/SERVICE/MYAPIMSERVICE`|
| category | string | `DeveloperPortalAuditLogs`|
| resultType | string | Result type, either `Succeeded` or `Failed`|
| operationName | string | `Microsoft.ApiManagement/CustomerDevPortalAuditDiagnosticLogs` |
| eventTime | string | Date and time in UTC of an event<br/><br/> Example: `2024-05-13T09:15:26.012166Z`|
| apimClient | string | Value taken from `X-Ms-Apim-Client` HTTP header sent on each request by developer portal webpage. Each part is separated by `|` character. Contains information about service type, domain name, API used, and user authorization status<br/><br/>Example: `dev-portal|myapimservice123.developer.azure-api.net|getApis-unauthorized`|
| activityId | string | Unique log GUID|
| properties | dynamic \| object | Object representing additional log information|

### Properties

| Field name  | Type  | Description  | 
| ------------- | ------------- | ------------- |
| hashedUserId  | string \| null  | Hashed user ID or `null` if the request is anonymous  | 
| timestamp  | string  | Date and time in UTC when the request was made<br/><br/> Example: `2024-05-13T09:15:26.4496706Z`  | 
| requestPath  | string  | HTTP request URL path<br/><br/>Example: `/apis` or `/tags`  | 
| requestMethod  | string  | HTTP request method  | 
| userAgent  | string  | Browser's user agent string taken from HTTP request header. Identifies browser, browser version, and operating system.<br/><br/>Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36`  | 
| responseCode  | int  | HTTP response code  | 
| region  | string  | Azure region name<br/><br/>Example: `Brazil South`  | 
| serviceName  | string  | Name of the API Management service   | 


## Related content

* [ApiManagementGatewayLogs schema reference](gateway-log-schema-reference.md)
* Learn more about [Common and service-specific schema for Azure Resource Logs](../azure-monitor/essentials/resource-logs-schema.md)

