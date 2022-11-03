---
title: Diagnostic log settings reference | Azure API Management
description: Reference for settings to configure collection of Azure Monitor logs or Application Insights logs from Azure API Management
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 11/03/2022
ms.author: danlep
ms.custom: engagement-fy23
---
# Diagnostic log collection settings reference: API Management

This reference describes settings to manage collection of API diagnostic logs for an API Management instance that enables logging for [Azure Monitor]() or [Application Insights]().

For more information, see the reference for the [Diagnostic](/rest/api/apimanagement/current-ga/diagnostic/) entity in the API Management REST API.



| Setting name                        | Value type                        | Description                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable                              | boolean                           | Specifies whether logging of this API is enabled.                                                                                                                                                                                                                                                                                                |
| Destination                         | Azure Application Insights logger | Specifies Azure Application Insights logger to be used.                                                                                                                                                                                                                                                                                           |
| Sampling (%)                        | decimal                           | Values from 0 to 100 (percent). <br/> Specifies the percentage of requests that will be logged to Application Insights. 0% sampling means zero requests logged, while 100% sampling means all requests logged. <br/> Use this setting to reduce effect on performance when logging requests to Application Insights. See [Performance implications and log sampling](#performance-implications-and-log-sampling). |
| Always log errors                   | boolean                           | If this setting is selected, all failures will be logged to Application Insights, regardless of the **Sampling** setting.   
| Log client IP address | |  If this setting is selected, the client IP address for API requests will be logged to Application Insights.                                         |
| Verbosity         |                                   | Specifies the verbosity level. Only custom traces with higher severity level will be logged. Default: Information.      | 
| Correlation protocol |  |  Select protocol used to correlate telemetry sent by multiple components. Default: Legacy <br/>For information, see [Telemetry correlation in Application Insights](../azure-monitor/app/correlation.md).  |
| Basic Options: Headers to log              | list                              | Specifies the headers that will be logged to Application Insights for requests and responses.  Default: no headers are logged.                                                                                                                                                                                                             |
| Basic Options: Number of payload bytes to log | integer                           | Specifies how many first bytes of the body are logged to Application Insights for requests and responses.  Default: 0.                                                                                                                                                                                                    |
| Advanced Options: Frontend Request  |                                   | Specifies whether and how *frontend requests* will be logged to Application Insights. *Frontend request* is a request incoming to the Azure API Management service.                                                                                                                                                                        |
| Advanced Options: Frontend Response |                                   | Specifies whether and how *frontend responses* will be logged to Application Insights. *Frontend response* is a response outgoing from the Azure API Management service.                                                                                                                                                                   |
| Advanced Options: Backend Request   |                                   | Specifies whether and how *backend requests* will be logged to Application Insights. *Backend request* is a request outgoing from the Azure API Management service.                                                                                                                                                                        |
| Advanced Options: Backend Response  |                                   | Specifies whether and how *backend responses* will be logged to Application Insights. *Backend response* is a response incoming to the Azure API Management service.                                                      
