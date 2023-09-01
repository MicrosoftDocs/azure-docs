---
title: Integrate Azure API Management with Azure Application Insights
titleSuffix: Azure API Management
description: Learn how to log and view events from Azure API Management in Azure Application Insights.
services: api-management
author: dlepow

ms.service: api-management
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 06/02/2023
ms.author: danlep
ms.custom: engagement-fy23

---

# How to integrate Azure API Management with Azure Application Insights

You can easily integrate Azure Application Insights with Azure API Management. Azure Application Insights is an extensible service for web developers building and managing apps on multiple platforms. In this guide, you will:
* Walk through every step of the Application Insights integration into API Management.
* Learn strategies for reducing performance impact on your API Management service instance.

## Prerequisites

You need an Azure API Management instance. [Create one](get-started-create-service-instance.md) first.

## Create an Application Insights instance

To use Application Insights, [create an instance of the Application Insights service](/previous-versions/azure/azure-monitor/app/create-new-resource). To create an instance using the Azure portal, see [Workspace-based Application Insights resources](../azure-monitor/app/create-workspace-resource.md).

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
1. To enable [availability monitoring](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) of your API Management instance in Application Insights, select the **Add availability monitor** checkbox.
    * This setting regularly validates whether the API Management gateway endpoint is responding. 
    * Results appear in the **Availability** pane of the Application Insights instance.
1. Select **Create**.
1. Check that the new Application Insights logger now appears in the list.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-2.png" alt-text="Screenshot that shows where to view the newly created Application Insights logger.":::

> [!NOTE]
> Behind the scenes, a [Logger](/rest/api/apimanagement/current-ga/logger/create-or-update) entity is created in your API Management instance, containing the instrumentation key of the Application Insights instance.

> [!TIP]
> If you need to update the instrumentation key configured in the Application Insights logger, select the logger's row in the list (not the name of the logger). Enter the instrumentation key, and select **Save**.

## Enable Application Insights logging for your API

Use the following steps to enable Application Insights logging for an API. You can also enable Application Insights logging for all APIs.

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **APIs** from the menu on the left.
1. Click on your API, in this case **Demo Conference API**. If configured, select a version.

   > [!TIP]
   > To enable logging for all APIs, select **All APIs**.
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
- By default, the single API logger (more granular level) overrides the one for all APIs.
- If the loggers configured at the two levels are different, and you need both loggers to receive telemetry (multiplexing), please contact Microsoft Support. Please note that multiplexing is not supported if you're using the same logger (Application Insights destination) at the "All APIs" level and the single API level. For multiplexing to work correctly, you must configure different loggers at the "All APIs" and individual API level and request assistance from Microsoft support to enable multiplexing for your service.

## What data is added to Application Insights

Application Insights receives:

| Telemetry item | Description |
| -------------- | ----------- |
| *Request* | For every incoming request: <ul><li>*frontend request*</li><li>*frontend response*</li></ul> |
| *Dependency* | For every request forwarded to a backend service: <ul><li>*backend request*</li><li>*backend response*</li></ul> |
| *Exception* | For every failed request: <ul><li>Failed because of a closed client connection</li><li>Triggered an *on-error* section of the API policies</li><li>Has a response HTTP status code matching 4xx or 5xx</li></ul> |
| *Trace* | If you configure a [trace](trace-policy.md) policy. <br /> The `severity` setting in the `trace` policy must be equal to or greater than the `verbosity` setting in the Application Insights logging. |

> [!NOTE]
> See [Application Insights limits](../azure-monitor/service-limits.md#application-insights) for information about the maximum size and number of metrics and events per Application Insights instance.

## Emit custom metrics
You can emit [custom metrics](../azure-monitor/essentials/metrics-custom-overview.md) to Application Insights from your API Management instance. API Management emits custom metrics using the [emit-metric](emit-metric-policy.md) policy.

> [!NOTE]
> Custom metrics are a [preview feature](../azure-monitor/essentials/metrics-custom-overview.md) of Azure Monitor and subject to [limitations](../azure-monitor/essentials/metrics-custom-overview.md#design-limitations-and-considerations).

To emit custom metrics, perform the following configuration steps. 

1. Enable **Custom metrics (Preview)** with custom dimensions in your Application Insights instance. 

    1. Navigate to your Application Insights instance in the portal.
    1. In the left menu, select **Usage and estimated costs**.
    1. Select **Custom metrics (Preview)** > **With dimensions**.
    1. Select **OK**. 

1. Add the `"metrics": true` property to the `applicationInsights` diagnostic entity that's configured in API Management. Currently you must add this property using the API Management [Diagnostic - Create or Update](/rest/api/apimanagement/current-ga/diagnostic/create-or-update) REST API. For example:

    ```http
    PUT https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/providers/Microsoft.ApiManagement/service/{APIManagementServiceName}/diagnostics/applicationinsights

    {
        [...]
        {
        "properties": {
            "loggerId": "/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/providers/Microsoft.ApiManagement/service/{APIManagementServiceName}/loggers/{ApplicationInsightsLoggerName}",
            "metrics": true
            [...]
        }
    }
    ```
1. Ensure that the Application Insights logger is configured at the scope you intend to emit custom metrics (either all APIs, or a single API). For more information, see [Enable Application Insights logging for your API](#enable-application-insights-logging-for-your-api), earlier in this article.
1. Configure the `emit-metric` policy at a scope where Application Insights logging is configured (either all APIs, or a single API) and is enabled for custom metrics. For policy details, see the [`emit-metric`](emit-metric-policy.md) policy reference.

### Limits for custom metrics

Azure Monitor imposes [usage limits](../azure-monitor/essentials/metrics-custom-overview.md#quotas-and-limits) for custom metrics that may affect your ability to emit metrics from API  Management. For example, Azure Monitor currently sets a limit of 10 dimension keys per metric, and a limit of 50,000 total active time series per region in a subscription (within a 12 hour period). 

These limits have the following implications for configuring custom metrics in API Management:

* You can configure a maximum of 10 custom dimensions per `emit-metric` policy.

* The number of active time series generated by the `emit-metric` policy within a 12 hour period is the product of the number of unique values of each configured dimension during the period. For example, if three custom dimensions were configured in the policy, and each dimension had 10 possible values within the period, the `emit-metric` policy would contribute 1,000 (10 x 10 x 10) active time series.

* If you configure the `emit-metric` policy in multiple API Management instances that are in the same region in a subscription, all instances can contribute to the regional active time series limit.   

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

## Troubleshooting

Addressing the issue of telemetry data flow from API Management to Application Insights:
+ Investigate whether a linked Azure Monitor Private Link Scope (AMPLS) resource exists within the VNet where the API Management resource is connected. AMPLS resources have a global scope across subscriptions and are responsible for managing data query and ingestion for all Azure Monitor resources. It's possible that the AMPLS has been configured with a Private-Only access mode specifically for data ingestion. In such instances, include the Application Insights resource and its associated Log Analytics resource in the AMPLS. Once this addition is made, the API Management data will be successfully ingested into the Application Insights resource, resolving the telemetry data transmission issue.

## Next steps

+ Learn more about [Azure Application Insights](/azure/application-insights/).
+ Consider [logging with Azure Event Hubs](api-management-howto-log-event-hubs.md).
+ Learn about visualizing data from Application Insights using [Azure Managed Grafana](visualize-using-managed-grafana-dashboard.md)
