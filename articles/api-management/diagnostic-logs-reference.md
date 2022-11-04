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

This reference describes settings to manage the information collected in API diagnostic logs generated from an API Management instance. You can enable logging of API diagnostic logs to [Azure Monitor](api-management-howto-use-azure-monitor.md) or [Application Insights](api-management-howto-app-insights.md).

For more information about these settings, see the reference for the [Diagnostic](/rest/api/apimanagement/current-ga/diagnostic/) entity in the API Management REST API.

> [!NOTE]
> Certain settings, where noted, apply only to logging to Application Insights.
>



| Setting                        | Type                   | Description                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable                              | boolean                           | Specifies whether logging of this API is enabled.                                                                                                                                                                                                                                                                                                |
| Destination                         | Azure Application Insights logger | Specifies logger to be used for Application Insights logging.                                                                                                                                                                                                                                                                                           |
| Sampling (%)                        | decimal                           | Values from 0 to 100 (percent). <br/> Specifies the percentage of requests that are logged. 0% sampling means zero requests logged, while 100% sampling means all requests logged. Default: 100<br/><br/> For performance impacts of Application Insights logging, see [Performance implications and log sampling](api-management-howto-app-insights.md#performance-implications-and-log-sampling). |
| Always log errors                   | boolean                           | If this setting is enabled, all failures are logged, regardless of the **Sampling** setting.   
| Log client IP address | boolean |  If this setting is enabled, the client IP address for API requests is logged.                                    |
| Verbosity         |                                   | Specifies the severity level of the request traces that are logged.    <br/><br/>* Error - only failed requests are logged<br/>* Information -  failed and successful requests are logged<br/> * Verbose - Complete [request traces](api-management-howto-api-inspector.md) are logged<br/><br/>Default: Information  | 
| Correlation protocol |  |  Specifies the protocol used to correlate telemetry sent by multiple components to Application Insights. Default: Legacy <br/><br/>For information, see [Telemetry correlation in Application Insights](../azure-monitor/app/correlation.md).  |
| Headers to log              | list                              | Specifies the headers that are logged for requests and responses.  Default: no headers are logged.                                                                                                                                                                                                             |
| Number of payload bytes to log | integer                           | Specifies the number of initial bytes of the body that are logged for requests and responses.  Default: 0                                                                                                                                                                                                   |
| Frontend Request  |                                   | Specifies whether and how *frontend requests* (requests incoming to the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log** and/or **Number of payload bytes to log**.                                                                                                                                                                        |
| Frontend Response |                                   | Specifies whether and how *frontend responses* (responses outgoing from the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log** and/or **Number of payload bytes to log**.                                                                                                                                                                   |
| Backend Request   |                                   | Specifies whether and how *backend requests* (requests outgoing from the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log** and/or **Number of payload bytes to log**.                                                                                                                                                                        |
| Backend Response  |                                   | Specifies whether and how *backend responses* (responses incoming to the API Management gateway) are logged. <br/><br/> If this setting is enabled, specify **Headers to log** and/or **Number of payload bytes to log**.                                                     
