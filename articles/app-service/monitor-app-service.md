---
title: Monitor Azure App Service
description: Learn about options in Azure App Service for monitoring resources for availability, performance, and operation.
ms.date: 03/11/2026
ms.custom: horz-monitor
ms.topic: concept-article
author: msangapu-msft
ms.author: msangapu
ms.service: azure-app-service
---

# Monitor Azure App Service

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## App Service monitoring

Azure App Service provides several options for monitoring resources for availability, performance, and operation. Options include diagnostic settings, Application Insights, log stream, metrics, quotas and alerts, and activity logs.

On the Azure portal page for your web app, you can select **Diagnose and solve problems** from the left navigation to access complete App Service diagnostics for your app. For more information about the App Service diagnostics tool, see [Azure App Service diagnostics overview](overview-diagnostics.md).

App Service provides built-in diagnostics logging to assist with debugging apps. For more information about the built-in logs, see [Stream diagnostics logs](troubleshoot-diagnostic-logs.md#stream-logs).

You can also use Azure Health check to monitor App Service instances. For more information, see [Monitor App Service instances using Health check](monitor-instances-health-check.md).

If you're using ASP.NET Core, ASP.NET, Java, Node.js, or Python, we recommend [enabling observability with Application Insights](/azure/azure-monitor/app/opentelemetry-enable). To learn more about observability experiences offered by Application Insights, see [Application Insights overview](/azure/azure-monitor/app/app-insights-overview).

### Monitoring scenarios

The following table lists monitoring methods to use for different scenarios.

|Scenario|Monitoring method |
|----------|-----------|
|I want to monitor platform metrics and logs | [Azure Monitor platform metrics](#platform-metrics)|
|I want to monitor application performance and usage | (Azure Monitor) [Application Insights](#application-insights)|
|I want to monitor built-in logs for testing and development|[Log stream](troubleshoot-diagnostic-logs.md#stream-logs)|
|I want to monitor resource limits and configure alerts|[Quotas and alerts](web-sites-monitor.md)|
|I want to monitor web app resource events|[Activity logs](#activity-log)|
|I want to monitor metrics visually|[Metrics](web-sites-monitor.md#metrics-granularity-and-retention-policy)|

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Application Insights

For supported [App Service stacks](/azure/azure-monitor/app/codeless-overview), you can turn on [Application Insights](/azure/azure-monitor/app/app-insights-overview) from the Azure portal without changing your code. Use a [connection string](/azure/azure-monitor/app/connection-strings) to connect the app to your [Application Insights resource](/azure/azure-monitor/app/create-workspace-resource). For more information, see [Application Insights overview](/azure/azure-monitor/app/app-insights-overview) and [Connection strings in Application Insights](/azure/azure-monitor/app/connection-strings).

> [!TIP]
> If you need custom telemetry, unsupported hosting scenarios, or more control over configuration, use [code-based instrumentation](/azure/azure-monitor/app/opentelemetry-enable) for your stack.

In the Azure portal, open your app, select **Application Insights** > **Enable**, create or select a resource, and then select **Apply monitoring settings**. App Service restarts the app.

#### [ASP.NET Core](#tab/aspnetcore)

##### Support and requirements

Use supported .NET [Long Term Support (LTS)](/dotnet/core/releases-and-support) releases. ASP.NET Core follows the .NET support policy. [Trim self-contained deployments](/dotnet/core/deploying/trimming/trim-self-contained) aren't supported.

##### Telemetry collected

Select **Recommended** to turn on monitoring or **Disabled** to turn it off. **Recommended** collects requests, dependencies, exceptions, and browser monitoring.

##### Configure monitoring

App Service doesn't provide extra extension settings for ASP.NET Core. To change sampling, enrichment, or custom telemetry, use code-based instrumentation. For more information, see [Enable OpenTelemetry with Application Insights for ASP.NET Core](/azure/azure-monitor/app/opentelemetry-enable?tabs=aspnetcore).

##### Client-side monitoring

Client-side monitoring is on by default with **Recommended**. To turn it off, set `APPINSIGHTS_JAVASCRIPT_ENABLED` to `false` in App Service app settings and restart the app.

##### Deploy at scale

For automated deployments, add these app settings. `ApplicationInsightsAgent_EXTENSION_VERSION` selects the App Service-managed site extension line: `~2` on Windows or `~3` on Linux. App Service updates the site extension automatically and applies updates after restart. With version `2.8.9`, App Service uses the preinstalled site extension. The example shows only the app settings section. Keep any other app settings that your app already uses.

| App setting | Value | Required | Use |
|---|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | `<connection string>` | Yes | Connects the app to Application Insights. |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~2` on Windows or `~3` on Linux | Yes | Turns on the App Service-managed site extension. |
| `XDT_MicrosoftApplicationInsights_Mode` | `recommended` or `disabled` | Yes | Sets the collection mode. |
| `XDT_MicrosoftApplicationInsights_PreemptSdk` | `1` | Yes | Required for ASP.NET Core App Service autoinstrumentation. |

The following example uses Linux. Use `~2` on Windows.

<details>
<summary>Example template snippet</summary>

```json
"siteConfig": {
  "appSettings": [
    {
      "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "value": "<connection string>"
    },
    {
      "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
      "value": "~3"
    },
    {
      "name": "XDT_MicrosoftApplicationInsights_Mode",
      "value": "recommended"
    },
    {
      "name": "XDT_MicrosoftApplicationInsights_PreemptSdk",
      "value": "1"
    }
  ]
}
```

</details>

To generate a baseline template, create a web app with Application Insights enabled in the Azure portal and download the automation template from **Review + create**.

#### [.NET](#tab/net)

##### Support and requirements

Use supported ASP.NET and .NET Framework releases. Modern .NET uses [Long Term Support (LTS)](/dotnet/core/releases-and-support) releases, but ASP.NET Core apps use the ASP.NET Core tab. For support details, see [ASP.NET official support policy](https://dotnet.microsoft.com/platform/support/policy/aspnet).

##### Telemetry collected

Select **Basic** or **Recommended**. The following table summarizes the collection levels.

| Telemetry or capability | Basic | Recommended |
|---|---|---|
| Usage trends and availability-to-transaction correlation | Yes | Yes |
| Host-process unhandled exceptions | Yes | Yes |
| Improves application performance monitoring (APM) metrics under load when sampling is enabled | Yes | Yes |
| CPU, memory, and I/O trends | No | Yes |
| Correlation across request and dependency boundaries | No | Yes |

##### Configure monitoring

To configure adaptive sampling, use app settings that start with `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_`.

Common settings include:

- `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage`
- `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage`
- `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_EvaluationInterval`
- `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MaxTelemetryItemsPerSecond`

To turn off adaptive sampling, set `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage` to `100`. For more information, see [Configure adaptive sampling for ASP.NET applications](/azure/azure-monitor/app/sampling#configuring-adaptive-sampling-for-aspnet-applications) and [Monitor .NET and Node.js applications with Application Insights (Classic API)](/azure/azure-monitor/app/classic-api).

##### Client-side monitoring

Client-side monitoring is off by default. To turn it on, set `APPINSIGHTS_JAVASCRIPT_ENABLED` to `true` in App Service app settings and restart the app. To turn it off, remove the app setting or set it to `false`. The combination of `APPINSIGHTS_JAVASCRIPT_ENABLED` and `urlCompression` isn't supported.

##### Deploy at scale

For automated deployments, add these app settings. `ApplicationInsightsAgent_EXTENSION_VERSION` selects the App Service-managed site extension line. Use `~2` for ASP.NET apps. App Service updates the site extension automatically and applies updates after restart. With version `2.8.9`, App Service uses the preinstalled site extension. The example shows only the app settings section. Keep any other app settings that your app already uses.

| App setting | Value | Required | Use |
|---|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | `<connection string>` | Yes | Connects the app to Application Insights. |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~2` | Yes | Turns on the App Service-managed site extension. |
| `XDT_MicrosoftApplicationInsights_Mode` | `default` or `recommended` | Yes | Sets the collection level. `default` maps to **Basic**. |
| `InstrumentationEngine_EXTENSION_VERSION` | `~1` | No | Turns on the binary rewrite engine. This setting can increase cold start time. |
| `XDT_MicrosoftApplicationInsights_BaseExtensions` | `~1` | No | Captures SQL and Azure Table text with dependency calls. This setting requires `InstrumentationEngine_EXTENSION_VERSION` and can increase cold start time. |

<details>
<summary>Example template snippet</summary>

```json
"siteConfig": {
  "appSettings": [
    {
      "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "value": "<connection string>"
    },
    {
      "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
      "value": "~2"
    },
    {
      "name": "XDT_MicrosoftApplicationInsights_Mode",
      "value": "recommended"
    }
  ]
}
```

</details>

To generate a baseline template, create a web app with Application Insights enabled in the Azure portal and download the automation template from **Review + create**.

#### [Java](#tab/java)

##### Support and requirements

App Service adds the Application Insights Java 3.x agent. For Spring Boot native image apps, use the [Azure Monitor OpenTelemetry Distro / Application Insights in Spring Boot native image Java application](https://aka.ms/AzMonSpringNative) instead. Snapshot Debugger isn't available for Java applications.

##### Telemetry collected

The Java agent autocollects requests, dependencies, logs, metrics, and heartbeats. It autocollects logs from Log4j, Logback, JBoss Logging, and `java.util.logging`. If your app uses Micrometer or Spring Boot Actuator, those metrics are autocollected too.

##### Configure monitoring

Use `APPLICATIONINSIGHTS_CONFIGURATION_CONTENT` for inline JSON or `APPLICATIONINSIGHTS_CONFIGURATION_FILE` for a file path. If you configure the agent in the Azure portal, don't include the connection string or preview settings. For supported settings and example JSON, see [Configuration options: Azure Monitor Application Insights for Java](/azure/azure-monitor/app/java-standalone-config). To add custom telemetry, see [Add, modify, and filter telemetry](/azure/azure-monitor/app/opentelemetry-add-modify?tabs=java#modify-telemetry).

##### Client-side monitoring

To enable client-side monitoring, use the [Browser SDK Loader (Preview)](/azure/azure-monitor/app/javascript-sdk?tabs=javascriptwebsdkloaderscript#add-the-javascript-code) with the Java agent. For more information, see [Configuration options: Azure Monitor Application Insights for Java](/azure/azure-monitor/app/java-standalone-config#browser-sdk-loader-preview).

##### Deploy at scale

For automated deployments, add these app settings. `ApplicationInsightsAgent_EXTENSION_VERSION` selects the App Service-managed Java agent line: `~2` on Windows or `~3` on Linux. App Service updates the agent automatically and applies updates after restart. The example shows only the app settings section. Keep any other app settings that your app already uses.

| App setting | Value | Required | Use |
|---|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | `<connection string>` | Yes | Connects the app to Application Insights. |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~2` on Windows or `~3` on Linux | Yes | Turns on the App Service-managed Java agent. |
| `XDT_MicrosoftApplicationInsights_Java` | `1` | Windows only | Turns on the Java agent on Windows. |
| `APPLICATIONINSIGHTS_CONFIGURATION_CONTENT` or `APPLICATIONINSIGHTS_CONFIGURATION_FILE` | Valid JSON or a file path | No | Adds custom Java agent configuration. |

The following example uses Linux. On Windows, also set `XDT_MicrosoftApplicationInsights_Java` to `1`.

<details>
<summary>Example template snippet</summary>

```json
"siteConfig": {
  "appSettings": [
    {
      "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "value": "<connection string>"
    },
    {
      "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
      "value": "~3"
    }
  ]
}
```

</details>

To generate a baseline template, create a web app with Application Insights enabled in the Azure portal and download the automation template from **Review + create**.

#### [Node.js](#tab/nodejs)

##### Support and requirements

App Service supports Node.js autoinstrumentation on Linux for code-based apps and custom containers, and on Windows for code-based apps. This integration is in public preview. Snapshot Debugger isn't available for Node.js applications.

##### Telemetry collected

The attached agent collects requests, dependencies, exceptions, traces, and heartbeats. Add the JavaScript SDK separately if you need browser data.

##### Configure monitoring

Use `APPLICATIONINSIGHTS_CONFIGURATION_CONTENT` for inline JSON or `APPLICATIONINSIGHTS_CONFIGURATION_FILE` for a file path that contains valid JSON. For supported settings and example JSON, see [Node.js configuration](https://github.com/microsoft/ApplicationInsights-node.js#configuration).

##### Client-side monitoring

To enable client-side monitoring, [add the JavaScript SDK to your application](/azure/azure-monitor/app/javascript-sdk?tabs=javascriptwebsdkloaderscript#add-the-javascript-code).

##### Deploy at scale

For automated deployments, add these app settings. `ApplicationInsightsAgent_EXTENSION_VERSION` selects the App Service-managed Node.js agent line: `~2` on Windows or `~3` on Linux. App Service updates the agent automatically and applies updates after restart. The example shows only the app settings section. Keep any other app settings that your app already uses.

| App setting | Value | Required | Use |
|---|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | `<connection string>` | Yes | Connects the app to Application Insights. |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~2` on Windows or `~3` on Linux | Yes | Turns on the App Service-managed Node.js agent. |
| `XDT_MicrosoftApplicationInsights_NodeJS` | `1` | Windows only | Turns on the Node.js agent on Windows. |
| `APPLICATIONINSIGHTS_CONFIGURATION_CONTENT` or `APPLICATIONINSIGHTS_CONFIGURATION_FILE` | Valid JSON or a file path | No | Adds custom Node.js agent configuration. |

The following example uses Linux. On Windows, also set `XDT_MicrosoftApplicationInsights_NodeJS` to `1`.

<details>
<summary>Example template snippet</summary>

```json
"siteConfig": {
  "appSettings": [
    {
      "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "value": "<connection string>"
    },
    {
      "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
      "value": "~3"
    }
  ]
}
```

</details>

To generate a baseline template, create a web app with Application Insights enabled in the Azure portal and download the automation template from **Review + create**.

#### [Python](#tab/python)

##### Support and requirements

Python autoinstrumentation is supported for Python 3.9 through 3.13 on Linux App Service apps that use **Deploy as Code**. Custom containers aren't supported. Live Metrics isn't available for App Service Python autoinstrumentation. Snapshot Debugger isn't available for Python applications.

##### Telemetry collected

App Service gathers and correlates dependencies, logs, and metrics from supported libraries. It collects logs from the root logger and autoinstruments `Django`, `FastAPI`, `Flask`, `psycopg2`, `requests`, `urllib`, and `urllib3`. For supported version ranges, see [OpenTelemetry community instrumentations](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation).

##### Configure monitoring

For Django apps, set `DJANGO_SETTINGS_MODULE` in App Service app settings.

To collect telemetry from other libraries, add supported OpenTelemetry community instrumentation packages to your app's `requirements.txt` file. App Service detects installed instrumentations automatically.

You can configure Python autoinstrumentation with OpenTelemetry environment variables such as:

| App setting | Use |
|---|---|
| `OTEL_SERVICE_NAME` or `OTEL_RESOURCE_ATTRIBUTES` | Sets the service name or other resource attributes. |
| `OTEL_TRACES_SAMPLER_ARG` | Sets the trace sampling ratio from `0` to `1`. |
| `OTEL_LOGS_EXPORTER` | Turns off log export when you set the value to `None`. |
| `OTEL_METRICS_EXPORTER` | Turns off metric export when you set the value to `None`. |
| `OTEL_TRACES_EXPORTER` | Turns off trace export when you set the value to `None`. |
| `OTEL_BLRP_SCHEDULE_DELAY` | Sets the log export interval in milliseconds. |
| `OTEL_BSP_SCHEDULE_DELAY` | Sets the distributed tracing export interval in milliseconds. |
| `OTEL_PYTHON_DISABLED_INSTRUMENTATIONS` | Disables specific instrumentations with a comma-separated list of lowercase library names. |

For the full list, see [OpenTelemetry environment variables](https://opentelemetry.io/docs/reference/specification/sdk-environment-variables/).

##### Client-side monitoring

To enable client-side monitoring, [add the JavaScript SDK to your application](/azure/azure-monitor/app/javascript-sdk?tabs=javascriptwebsdkloaderscript#add-the-javascript-code).

##### Deploy at scale

For automated deployments, add these app settings. `ApplicationInsightsAgent_EXTENSION_VERSION` selects the App Service-managed Python agent line. Use `~3` on Linux. App Service updates the agent automatically and applies updates after restart. The example shows only the app settings section. Keep any other app settings that your app already uses.

| App setting | Value | Required | Use |
|---|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | `<connection string>` | Yes | Connects the app to Application Insights. |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~3` | Yes | Turns on the App Service-managed Python agent. |
| `OTEL_*` app settings | See **Configure monitoring** | No | Adds optional OpenTelemetry configuration. |

<details>
<summary>Example template snippet</summary>

```json
"siteConfig": {
  "appSettings": [
    {
      "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "value": "<connection string>"
    },
    {
      "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
      "value": "~3"
    }
  ]
}
```

</details>

To generate a baseline template, create a web app with Application Insights enabled in the Azure portal and download the automation template from **Review + create**.

---

For troubleshooting assistance, see our [dedicated troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/telemetry/troubleshoot-app-service-issues).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<a name="platform-metrics"></a>
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#metrics).

For help understanding metrics in App Service, see [Metrics](web-sites-monitor.md#understand-metrics). View metrics by aggregate (such as average, max, or min), instance, time range, and other filters. Metrics can monitor performance, memory, CPU, and other attributes.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the schemas for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#resource-logs).

[!INCLUDE [audit log categories tip](./includes/azure-monitor-log-category-groups-tip.md)]

<a name="activity-log"></a>
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

### Azure activity logs for App Service

Azure activity logs for App Service include details such as:

- What operations were taken on the resources (for example, App Service plans)
- Who started the operation
- When the operation occurred
- Status of the operation
- Property values to help you research the operation

Azure activity logs can be queried using the Azure portal, PowerShell, REST API, or CLI.

### Ship activity logs to Event Grid

While activity logs are user-based, there's a new [Azure Event Grid](../event-grid/index.yml) integration with App Service (preview) that logs both user actions and automated events. With Event Grid, you can configure a handler to react to the said events. For example, use Event Grid to instantly trigger a serverless function to run image analysis each time a new photo is added to a blob storage container.

Alternatively, you can use Event Grid with Logic Apps to process data anywhere, without writing code. Event Grid connects data sources and event handlers.

To view the properties and schema for App Service events, see [Azure App Service as an Event Grid source](../event-grid/event-schema-app-service.md).

## Log stream (via App Service Logs)

Azure provides built-in diagnostics to assist during testing and development to debug an App Service app. [Log stream](troubleshoot-diagnostic-logs.md#stream-logs) can be used to get quick access to output and errors written by your application, and logs from the web server. This data contains standard output/error logs in addition to web server logs.

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

The following sample query can help you monitor app logs using `AppServiceAppLogs`:

```Kusto
AppServiceAppLogs 
| project CustomLevel, _ResourceId
| summarize count() by CustomLevel, _ResourceId
```

The following sample query can help you monitor HTTP logs using `AppServiceHTTPLogs` where the `HTTP response code` is `500` or higher:

```Kusto
AppServiceHTTPLogs 
//| where ResourceId = "MyResourceId" // Uncomment to get results for a specific resource Id when querying over a group of Apps
| where ScStatus >= 500
| reduce by strcat(CsMethod, ':\\', CsUriStem)
```

The following sample query can help you monitor HTTP 500 errors by joining `AppServiceConsoleLogs` and `AppserviceHTTPLogs`:

```Kusto
let myHttp = AppServiceHTTPLogs | where  ScStatus == 500 | project TimeGen=substring(TimeGenerated, 0, 19), CsUriStem, ScStatus;  

let myConsole = AppServiceConsoleLogs | project TimeGen=substring(TimeGenerated, 0, 19), ResultDescription;

myHttp | join myConsole on TimeGen | project TimeGen, CsUriStem, ScStatus, ResultDescription;   
```

See [Azure Monitor queries for App Service](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/App%20Services/Queries) for more sample queries.

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Quotas and alerts

Apps that are hosted in App Service are subject to certain limits on the resources they can use. The App Service plan associated with the app defines these limits. Metrics for an app or an App Service plan can be hooked up to alerts. To learn more, see [Quotas](web-sites-monitor.md#understand-quotas).

### App Service alert rules

The following table lists common and recommended alert rules for App Service.

| Alert type | Condition | Examples  |
|:---|:---|:---|
| Metric | Average connections| When number of connections exceed a set value|
| Metric | HTTP 404| When HTTP 404 responses exceed a set value|
| Metric | HTTP server errors| When HTTP 5xx errors exceed a set value|
| Activity log | Create or update web app | When app is created or updated|
| Activity log | Delete web app | When app is deleted|
| Activity log | Restart web app| When app is restarted|
| Activity log | Stop web app| When app is stopped|

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- [Azure App Service monitoring data reference](monitor-app-service-reference.md)
- [Troubleshoot Application Insights integration with Azure App Service](/troubleshoot/azure/azure-monitor/app-insights/telemetry/troubleshoot-app-service-issues)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)