---
title: Diagnostic logs settings reference | Azure API Management
description: Reference for settings to define the API data collected from Azure API Management and sent to Azure Monitor logs or Application Insights.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 11/18/2022
ms.author: danlep
ms.custom: engagement-fy23
---
# Diagnostics logs settings reference: API Management

This reference describes settings for API diagnostics logging from an API Management instance. To enable logging of API requests, see the following guidance:

* [Collect resource logs](api-management-howto-use-azure-monitor.md#resource-logs)
* [Integrate Azure API Management with Azure Application Insights](api-management-howto-app-insights.md)

> [!NOTE]
> Certain settings, where noted, apply only to logging to Application Insights.
>



| Setting                        | Type                   | Description                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable                              | boolean                           | Specifies whether logging of this API is enabled.  <br/><br/>Logging can be enabled for all APIs or for an individual API. Settings for an individual API override settings for all APIs, if enabled.                                                                                                                                                                                                                                |
| Destination                         | Azure Application Insights logger | Specifies logger to be used for Application Insights logging.                                                                                                                                                                                                                                                                                           |
| Sampling (%)                        | decimal                           | Values from 0 to 100 (percent). <br/> Specifies the percentage of requests that are logged. 0% sampling means zero requests logged, while 100% sampling means all requests logged. Default: 100<br/><br/> For performance impacts of Application Insights logging, see [Performance implications and log sampling](api-management-howto-app-insights.md#performance-implications-and-log-sampling). |
| Always log errors                   | boolean                           | If this setting is enabled, all failures are logged, regardless of the **Sampling** setting.   
| Log client IP address | boolean |  If this setting is enabled, the client IP address for API requests is logged.                                    |
| Verbosity         |                                   | Specifies the verbosity of the logs and whether custom traces that are configured in [trace](trace-policy.md) policies are logged.    <br/><br/>* Error - failed requests, and custom traces of severity `error`<br/>* Information -  failed and successful requests, and custom traces of severity `error` and `information`<br/> * Verbose - failed and successful requests, and custom traces of severity `error`, `information`, and `verbose`<br/><br/>Default: Information  | 
| Correlation protocol |  |  Specifies the protocol used to correlate telemetry sent by multiple components to Application Insights. Default: Legacy <br/><br/>For information, see [Telemetry correlation in Application Insights](../azure-monitor/app/distributed-tracing-telemetry-correlation.md).  |
| Headers to log              | list                              | Specifies the headers that are logged for requests and responses.  Default: no headers are logged.                                                                                                                                                                                                             |
| Number of payload bytes to log | integer                           | Specifies the number of initial bytes of the body that are logged for requests and responses. Maximum: 8,192. Default: 0                                                                                                                                                                                                   |
| Frontend Request  |                                   | Specifies whether and how *frontend requests* (requests incoming to the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log**, **Number of payload bytes to log**, or both.                                                                                                                                                                        |
| Frontend Response |                                   | Specifies whether and how *frontend responses* (responses outgoing from the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log**, **Number of payload bytes to log**, or both.                                                                                                                                                                   |
| Backend Request   |                                   | Specifies whether and how *backend requests* (requests outgoing from the API Management gateway) are logged.<br/><br/> If this setting is enabled, specify **Headers to log**, **Number of payload bytes to log**, or both.                                                                                                                                                                        |
| Backend Response  |                                   | Specifies whether and how *backend responses* (responses incoming to the API Management gateway) are logged. <br/><br/> If this setting is enabled, specify **Headers to log**, **Number of payload bytes to log**, or both.                                                     

## Next steps

* For more information, see the reference for the [Diagnostic](/rest/api/apimanagement/current-ga/diagnostic/) entity in the API Management REST API.
* Use the [trace](trace-policy.md) policy to add custom traces to Application Insights telemetry, resource logs, or request tracing. 
