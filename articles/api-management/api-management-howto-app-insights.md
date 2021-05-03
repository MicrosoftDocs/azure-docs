---
title: Integrate Azure API Management with Azure Application Insights
titleSuffix: Azure API Management
description: Learn how to log and view events from Azure API Management in Azure Application Insights.
services: api-management
author: mikebudzynski

ms.service: api-management
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/25/2021
ms.author: apimpm

---

# How to integrate Azure API Management with Azure Application Insights

Azure API Management allows for easy integration with Azure Application Insights - an extensible service for web developers building and managing apps on multiple platforms. This guide walks through every step of such integration and describes strategies for reducing performance impact on your API Management service instance.

## Prerequisites

To follow this guide, you need to have an Azure API Management instance. If you don't have one, complete the [tutorial](get-started-create-service-instance.md) first.

## Create an Application Insights instance

Before you can use Application Insights, you first need to create an instance of the service. For steps to create an instance using the Azure portal, see [Workspace-based Application Insights resources](../azure-monitor/app/create-workspace-resource.md).
## Create a connection between Application Insights and API Management

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **Application Insights** from the menu on the left.
1. Click **+ Add**.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-1.png" alt-text="Screenshot that shows where to add a new connection":::
1. Select the previously created **Application Insights** instance and provide a short description.
1. Click **Create**.
1. You have just created an Application Insights logger with an instrumentation key. It should now appear in the list.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-2.png" alt-text="Screenshot that shows where to view the newly created Application Insights logger with instrumentation key":::

> [!NOTE]
> Behind the scene, a [Logger](/rest/api/apimanagement/2019-12-01/logger/createorupdate) entity is created in your API Management instance, containing the Instrumentation Key of the Application Insights instance.

## Enable Application Insights logging for your API

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **APIs** from the menu on the left.
1. Click on your API, in this case **Demo Conference API**. If configured, select a version.
1. Go to the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostics Logs** section.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-api-1.png" alt-text="App Insights logger":::
1. Check the **Enable** box.
1. Select your attached logger in the **Destination** dropdown.
1. Input **100** as **Sampling (%)** and select the **Always log errors** checkbox.
1. Select **Save**.

> [!WARNING]
> Overriding the default value **0** in the **Number of payload bytes to log** setting may significantly decrease the performance of your APIs.

> [!NOTE]
> Behind the scene, a [Diagnostic](/rest/api/apimanagement/2019-12-01/diagnostic/createorupdate) entity named 'applicationinsights' is created at the API level.

| Setting name                        | Value type                        | Description                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable                              | boolean                           | Specifies whether logging of this API is enabled.                                                                                                                                                                                                                                                                                                |
| Destination                         | Azure Application Insights logger | Specifies Azure Application Insights logger to be used                                                                                                                                                                                                                                                                                           |
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
| Advanced Options: Backend Response  |                                   | Specifies whether and how *backend responses* will be logged to Application Insights. *Backend response* is a response incoming to the Azure API Management service.                                                                                                                                                                       |

> [!NOTE]
> You can specify loggers on different levels - single API logger or a logger for all APIs.
>  
> If you specify both:
> + if they are different loggers, then both of them will be used (multiplexing logs),
> + if they are the same loggers but have different settings, then the one for single API (more granular level) will override the one for all APIs.

## What data is added to Application Insights

Application Insights receives:

+ *Request* telemetry item, for every incoming request (*frontend request*, *frontend response*),
+ *Dependency* telemetry item, for every request forwarded to a backend service (*backend request*, *backend response*),
+ *Exception* telemetry item, for every failed request:
    + failed because of a closed client connection
    + triggered an *on-error* section of the API policies
    + has a response HTTP status code matching 4xx or 5xx.
+ *Trace* telemetry item, if you configure a [trace](api-management-advanced-policies.md#Trace) policy. The `severity` setting in the `trace` policy must be equal to or greater than the `verbosity` setting in the Application Insights logging.

> [!NOTE]
> See [Application Insights limits](../azure-monitor/service-limits.md#application-insights) for information about the maximum size and number of metrics and events per Application Insights instance.

## Performance implications and log sampling

> [!WARNING]
> Logging all events may have serious performance implications, depending on incoming requests rate.

Based on internal load tests, enabling this feature caused a 40%-50% reduction in throughput when request rate exceeded 1,000 requests per second. Application Insights is designed to use statistical analysis for assessing application performances. It is not intended to be an audit system and is not suited for logging each individual request for high-volume APIs.

You can manipulate the number of requests being logged by adjusting the **Sampling** setting (see the preceding steps). A value of 100% means all requests are logged, while 0% reflects no logging. **Sampling** helps to reduce volume of telemetry, effectively preventing significant performance degradation, while still carrying the benefits of logging.

Skipping logging of headers and body of requests and responses will also have positive impact on alleviating performance issues.

## Video

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2pkXv]
>
>

## Next steps

+ Learn more about [Azure Application Insights](/azure/application-insights/).
+ Consider [logging with Azure Event Hubs](api-management-howto-log-event-hubs.md).
