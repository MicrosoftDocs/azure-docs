---
title: Integrate Azure API Management with Azure Application Insights
titleSuffix: Azure API Management
description: Learn how to log and view events from Azure API Management in Azure Application Insights.
services: api-management
author: dlepow

ms.service: api-management
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/27/2021
ms.author: danlep

---

# How to integrate Azure API Management with Azure Application Insights

You can easily integrate Azure Application Insights with Azure API Management. Azure Application Insights is an extensible service for web developers building and managing apps on multiple platforms. In this guide, you will:
* Walk through every step of the Application Insights integration into API Management.
* Learn strategies for reducing performance impact on your API Management service instance.

## Prerequisites

You need an Azure API Management instance. [Create one](get-started-create-service-instance.md) first.

## Create an Application Insights instance

To use Application Insights, [create an instance of the Application Insights service](../azure-monitor/app/create-new-resource.md). To create an instance using the Azure portal, see [Workspace-based Application Insights resources](../azure-monitor/app/create-workspace-resource.md).

> [!NOTE]
> The Application Insights resource **can be** in a different subscription or even a different tenant than the API Management resource.

## Create a connection between Application Insights and API Management

> [!NOTE]
> If your Application Insights resource is in a different tenant, then you will have to create the logger using the [REST API](/rest/api/apimanagement/current-ga/logger/create-or-update)

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **Application Insights** from the menu on the left.
1. Select **+ Add**.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-1.png" alt-text="Screenshot that shows where to add a new connection":::
1. Select the **Application Insights** instance you created earlier and provide a short description.
1. To enable [availability monitoring](../azure-monitor/app/monitor-web-app-availability.md) of your API Management instance in Application Insights, select the **Add availability monitor** checkbox.
    * This setting regularly validates whether the API Management gateway endpoint is responding. 
    * Results appear in the **Availability** pane of the Application Insights instance.
1. Select **Create**.
1. Check that the new Application Insights logger with an instrumentation key now appears in the list.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-2.png" alt-text="Screenshot that shows where to view the newly created Application Insights logger with instrumentation key":::

> [!NOTE]
> Behind the scenes, a [Logger](/rest/api/apimanagement/current-ga/logger/create-or-update) entity is created in your API Management instance, containing the instrumentation key of the Application Insights instance.

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
1. Leave the rest of the settings as is. For details about the settings, see [Diagnostic logs settings reference](diagnostic-logs-reference.md).

    > [!WARNING]
    > Overriding the default **Number of payload bytes to log** value **0** may significantly decrease the performance of your APIs.

1. Select **Save**.
1. Behind the scenes, a [Diagnostic](/rest/api/apimanagement/current-ga/diagnostic/create-or-update) entity named `applicationinsights` is created at the API level.

> [!NOTE]
> Requests are successful once API Management sends the entire response to the client.


## Loggers for a single API or all APIs

You can specify loggers on different levels: 
+ Single API logger
+ A logger for all APIs
 
Specifying *both*:
+ if they are different loggers, both of them will be used (multiplexing logs).
+ if they are the same loggers with different settings, the single API logger (more granular level) will override the one for all APIs.

## What data is added to Application Insights

Application Insights receives:

| Telemetry item | Description |
| -------------- | ----------- |
| *Request* | For every incoming request: <ul><li>*frontend request*</li><li>*frontend response*</li></ul> |
| *Dependency* | For every request forwarded to a backend service: <ul><li>*backend request*</li><li>*backend response*</li></ul> |
| *Exception* | For every failed request: <ul><li>Failed because of a closed client connection</li><li>Triggered an *on-error* section of the API policies</li><li>Has a response HTTP status code matching 4xx or 5xx</li></ul> |
| *Trace* | If you configure a [trace](api-management-advanced-policies.md#Trace) policy. <br /> The `severity` setting in the `trace` policy must be equal to or greater than the `verbosity` setting in the Application Insights logging. |

### Emit custom metrics
You can emit custom metrics by configuring the [`emit-metric`](api-management-advanced-policies.md#emit-metrics) policy. 

To make Application Insights pre-aggregated metrics available in API Management, you'll need to manually enable custom metrics in the service.
1. Use the [`emit-metric`](api-management-advanced-policies.md#emit-metrics) policy with the [Create or Update API](/rest/api/apimanagement/current-ga/api-diagnostic/create-or-update).
1. Add `"metrics":true` to the payload, along with any other properties.

> [!NOTE]
> See [Application Insights limits](../azure-monitor/service-limits.md#application-insights) for information about the maximum size and number of metrics and events per Application Insights instance.

## Performance implications and log sampling

> [!WARNING]
> Logging all events may have serious performance implications, depending on incoming requests rate.

Based on internal load tests, enabling the logging feature caused a 40%-50% reduction in throughput when request rate exceeded 1,000 requests per second. Application Insights is designed to assess application performances using statistical analysis. It's not:
* Intended to be an audit system.
* Suited for logging each individual request for high-volume APIs.

You can manipulate the number of logged requests by [adjusting the **Sampling** setting](#enable-application-insights-logging-for-your-api). A value of 100% means all requests are logged, while 0% reflects no logging. 

**Sampling** helps to reduce telemetry volume, effectively preventing significant performance degradation while still carrying the benefits of logging.

To improve performance issues, skip:
* Request and responses headers.
* Body logging.

## Video

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2pkXv]
>
>

## Next steps

+ Learn more about [Azure Application Insights](/azure/application-insights/).
+ Consider [logging with Azure Event Hubs](api-management-howto-log-event-hubs.md).
+ - Learn about visualizing data from Application Insights using [Azure Managed Grafana](visualize-using-managed-grafana-dashboard.md)