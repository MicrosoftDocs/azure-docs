---
title: Application Insights overview
description: Learn how Application Insights in Azure Monitor provides performance management and usage tracking of your live web application.
ms.topic: overview
ms.date: 10/09/2023
---

# Application Insights overview :::image type="content" source="media/app-insights-overview/app-insights-icon.svg" alt-text="The official logo of Azure Monitor Application Insights":::

Azure Monitor Application Insights, a feature of [Azure Monitor](..\overview.md), excels in Application Performance Management (APM) for live web applications. It enhances the performance, reliability, and quality of your applications.

:::image type="content" source="media/overview-dashboard/0001-dashboard-small.png" alt-text="A screenshot of the Application Insights dashboard" lightbox="media/overview-dashboard/0001-dashboard.png":::

## Experiences:

### Investigate
- [Application dashboard](overview-dashboard.md): An at-a-glance assessment of your application's health and performance.
- [Application map](app-map.md): A visual overview of application architecture and components' interactions.
- [Live metrics](live-stream.md): A real-time analytics dashboard for insight into application activity and performance.
- [Transaction search](diagnostic-search.md): Trace and diagnose transactions to identify issues and optimize performance.
- [Availability view](availability-overview.md): Proactively monitor and test the availability and responsiveness of application endpoints.
- Performance view: Review application performance metrics and potential bottlenecks.
- Failures view: Identify and analyze failures in your application to minimize downtime.

### Monitoring
- [Alerts](../alerts/alerts-overview.md): Monitor a wide range of aspects of your application and trigger various actions.
- [Metrics](../essentials/metrics-getting-started.md): Dive deep into metrics data to understand usage patterns and trends.
- [Diagnostic settings](../essentials/diagnostic-settings.md): Configure streaming export of platform logs and metrics to the destination of your choice. 
- [Logs](../logs/log-analytics-overview.md): Retrieve, consolidate, and analyze all data collected into Azure Monitoring Logs.
- [Workbooks](../visualize/workbooks-overview.md): Create interactive reports and dashboards that visualize application monitoring data.

### Usage
- [Users, sessions, and events](usage-segmentation.md): Determine when, where, and how users interact with your web app.
- [Funnels](usage-funnels.md): Analyze conversion rates to identify where users progress or drop off in the funnel.
- [Flows](usage-flows.md): Visualize user paths on your site to identify high engagement areas and exit points.
- [Cohorts](usage-cohorts.md): Group users by shared characteristics to simplify trend identification, segmentation, and performance troubleshooting.

### Code analysis
- [Profiler](../profiler/profiler-overview.md): Capture, identify, and view performance traces for your application.
- [Code optimizations](../insights/code-optimizations.md): Harness AI to create better and more efficient applications.
- [Snapshot debugger](../snapshot-debugger/snapshot-debugger.md): Automatically collect debug snapshots when exceptions occur in .NET application

## Logic map

:::image type="content" source="media/app-insights-overview/app-insights-overview-blowout.svg" alt-text="Diagram that shows the path of data as it flows through the layers of the Application Insights service." border="false" lightbox="media/app-insights-overview/app-insights-overview-blowout.svg":::

> [!Note]
> Firewall settings must be adjusted for data to reach ingestion endpoints. For more information, see [IP addresses used by Azure Monitor](./ip-addresses.md).

---------------------------
## Supported languages

This section outlines supported scenarios.

For detailed information about enabling Application Insights, see [Data collection basics](opentelemetry-overview.md).

### Automatic instrumentation (enable without code changes)
* [Autoinstrumentation supported environments and languages](codeless-overview.md#supported-environments-languages-and-resource-providers)

### Manual instrumentation

#### OpenTelemetry Distro

* [ASP.NET](opentelemetry-enable.md?tabs=net)
* [Java](opentelemetry-enable.md?tabs=java)
* [Node.js](opentelemetry-enable.md?tabs=nodejs)
* [Python](opentelemetry-enable.md?tabs=python)
* [ASP.NET Core](opentelemetry-enable.md?tabs=aspnetcore) (preview)

#### Application Insights SDK (Classic API)

* [ASP.NET](./asp-net.md)
* [Java](./opentelemetry-enable.md?tabs=java)
* [Node.js](./nodejs.md)
* [Python](/previous-versions/azure/azure-monitor/app/opencensus-python)
* [ASP.NET Core](./asp-net-core.md)

#### Client-side JavaScript SDK

* [JavaScript](./javascript.md)
  * [React](./javascript-framework-extensions.md)
  * [React Native](./javascript-framework-extensions.md)
  * [Angular](./javascript-framework-extensions.md)

### Supported platforms and frameworks

This section lists all supported platforms and frameworks.

#### Azure service integration (portal enablement, Azure Resource Manager deployments)
* [Azure Virtual Machines and Azure Virtual Machine Scale Sets](./azure-vm-vmss-apps.md)
* [Azure App Service](./azure-web-apps.md)
* [Azure Functions](../../azure-functions/functions-monitoring.md)
* [Azure Spring Apps](../../spring-apps/how-to-application-insights.md)
* [Azure Cloud Services](./azure-web-apps-net-core.md), including both web and worker roles

#### Logging frameworks
* [`ILogger`](./ilogger.md)
* [Log4Net, NLog, or System.Diagnostics.Trace](./asp-net-trace-logs.md)
* [`Log4J`, Logback, or java.util.logging](./opentelemetry-add-modify.md?tabs=java#logs)
* [LogStash plug-in](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-output-applicationinsights)
* [Azure Monitor](/archive/blogs/msoms/application-insights-connector-in-oms)

#### Export and data analysis
* [Power BI](https://powerbi.microsoft.com/blog/explore-your-application-insights-data-with-power-bi/)
* [Power BI for workspace-based resources](../logs/log-powerbi.md)

### Unsupported SDKs
Many community-supported Application Insights SDKs exist. Azure Monitor only provides support when you use the supported instrumentation options listed in this article.

We're constantly assessing opportunities to expand our support for other languages. For the latest news, see [Azure updates for Application Insights](https://azure.microsoft.com/updates/?query=application%20insights).

---------------------------

## Frequently asked questions

This section provides answers to common questions.

### What telemetry does Application Insights collect?

From server web apps:

* HTTP requests.
* [Dependencies](./asp-net-dependencies.md). Calls to SQL databases, HTTP calls to external services, Azure Cosmos DB, Azure Table Storage, Azure Blob Storage, and Azure Queue Storage.
* [Exceptions](./asp-net-exceptions.md) and stack traces.
* [Performance counters](./performance-counters.md): Performance counters are available when using:
- [Azure Monitor Application Insights agent](application-insights-asp-net-agent.md)
- [Azure monitoring for VMs or virtual machine scale sets](./azure-vm-vmss-apps.md)
- [Application Insights `collectd` writer](/previous-versions/azure/azure-monitor/app/deprecated-java-2x#collectd-linux-performance-metrics-in-application-insights-deprecated).
* [Custom events and metrics](./api-custom-events-metrics.md) that you code.
* [Trace logs](./asp-net-trace-logs.md) if you configure the appropriate collector.
          
From [client webpages](./javascript-sdk.md):
          
* Uncaught exceptions in your app, including information on
  * Stack trace
  * Exception details and message accompanying the error
  * Line & column number of error
  * URL where error was raised
* Network Dependency Requests made by your app XHR and Fetch (fetch collection is disabled by default) requests, include information on:
  * Url of dependency source
  * Command & Method used to request the dependency
  * Duration of the request
  * Result code and success status of the request
  * ID (if any) of user making the request
  * Correlation context (if any) where request is made
* User information (for example, Location, network, IP)
* Device information (for example, Browser, OS, version, language, model)
* Session information

  > [!Note]
  > For some applications, such as single-page applications (SPAs), the duration may not be recorded and will default to 0.

    For more information, see [Data collection, retention, and storage in Application Insights](./data-retention-privacy.md).
          
From other sources, if you configure them:
          
* [Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md)
* [Import to Log Analytics](../logs/data-collector-api.md)
* [Log Analytics](../logs/data-collector-api.md)
* [Logstash](../logs/data-collector-api.md)


### How many Application Insights resources should I deploy?
To understand the number of Application Insights resources required to cover your application or components across environments, see the [Application Insights deployment planning guide](separate-resources.md).

### How can I manage Application Insights resources with PowerShell?
          
You can [write PowerShell scripts](./powershell.md) by using Azure Resource Monitor to:
          
* Create and update Application Insights resources.
* Set the pricing plan.
* Get the instrumentation key.
* Add a metric alert.
* Add an availability test.
          
You can't set up a metrics explorer report or set up continuous export.

### How can I query Application Insights telemetry? 
          
Use the [REST API](/rest/api/application-insights/) to run [Log Analytics](../logs/log-query-overview.md) queries.

### Can I send telemetry to the Application Insights portal?

We recommend that you use our SDKs and use the [SDK API](./api-custom-events-metrics.md). There are variants of the SDK for various [platforms](./app-insights-overview.md#supported-languages). These SDKs handle processes like buffering, compression, throttling, and retries. However, the [ingestion schema](https://github.com/microsoft/ApplicationInsights-dotnet/tree/master/BASE/Schema/PublicSchema) and [endpoint protocol](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/EndpointSpecs/ENDPOINT-PROTOCOL.md) are public.   

### How long does it take for telemetry to be collected?

Most Application Insights data has a latency of under 5 minutes. Some data can take longer, which is typical for larger log files. See the [Application Insights service-level agreement](https://azure.microsoft.com/support/legal/sla/application-insights/v1_2/).    
          
## Help and support

### Azure technical support

For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).

### Microsoft Q&A questions forum

Post general questions to the Microsoft Q&A [answers forum](/answers/topics/24223/azure-monitor.html).

### Stack Overflow

Post coding questions to [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-application-insights) by using an `azure-application-insights` tag.

### Feedback Community

Leave product feedback for the engineering team in the [Feedback Community](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).

### Troubleshooting

Review dedicated [troubleshooting articles](/troubleshoot/azure/azure-monitor/welcome-azure-monitor) for Application Insights.

## Next steps

- [Data collection basics](opentelemetry-overview.md)
- [Create a resource](create-workspace-resource.md)
- [Automatic instrumentation overview](codeless-overview.md)
- [Application dashboard](overview-dashboard.md)
- [Application Map](app-map.md)
- [Live metrics](live-stream.md)
- [Transaction search](diagnostic-search.md)
- [Availability overview](availability-overview.md)
- [Users, sessions, and events](usage-segmentation.md)