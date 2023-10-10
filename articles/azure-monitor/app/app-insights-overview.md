---
title: Application Insights overview
description: Learn how Application Insights in Azure Monitor provides performance management and usage tracking of your live web application.
ms.topic: overview
ms.date: 05/12/2023
---
 
# Application Insights overview

Application Insights is an extension of [Azure Monitor](../overview.md) and provides application performance monitoring (APM) features. APM tools are useful to monitor applications from development, through test, and into production in the following ways:

- *Proactively* understand how an application is performing.
- *Reactively* review application execution data to determine the cause of an incident.

:::image type="content" source="media/overview-dashboard/0001-dashboard.png" alt-text="Screenshot that shows Application Insights in the Azure portal." lightbox="media/overview-dashboard/0001-dashboard.png":::

Along with collecting [metrics](standard-metrics.md) and application [telemetry](data-model-complete.md) data, which describe application activities and health, you can use Application Insights to collect and store application [trace logging data](asp-net-trace-logs.md).

The [log trace](asp-net-trace-logs.md) is associated with other telemetry to give a detailed view of the activity. Adding trace logging to existing apps only requires providing a destination for the logs. You rarely need to change the logging framework.

Application Insights provides other features including, but not limited to:

- [Live Metrics](live-stream.md): Observe activity from your deployed application in real time with no effect on the host environment.
- [Availability](availability-overview.md): Also known as synthetic transaction monitoring. Probe the external endpoints of your applications to test the overall availability and responsiveness over time.
- [GitHub or Azure DevOps integration](work-item-integration.md): Create [GitHub](/training/paths/github-administration-products/) or [Azure DevOps](/azure/devops/) work items in the context of Application Insights data.
- [Usage](usage-overview.md): Understand which features are popular with users and how users interact and use your application.
- [Smart detection](proactive-diagnostics.md): Detect failures and anomalies automatically through proactive telemetry analysis.

Application Insights supports [distributed tracing](distributed-tracing-telemetry-correlation.md), which is also known as distributed component correlation. This feature allows [searching for](diagnostic-search.md) and [visualizing](transaction-diagnostics.md) an end-to-end flow of a specific execution or transaction. The ability to trace activity from end to end is important for applications that were built as distributed components or [microservices](/azure/architecture/guide/architecture-styles/microservices).

The [Application Map](app-map.md) allows a high-level, top-down view of the application architecture and at-a-glance visual references to component health and responsiveness.

To understand the number of Application Insights resources required to cover your application or components across environments, see the [Application Insights deployment planning guide](separate-resources.md).

:::image type="content" source="media/app-insights-overview/app-insights-overview-blowout.svg" alt-text="Diagram that shows the path of data as it flows through the layers of the Application Insights service." border="false" lightbox="media/app-insights-overview/app-insights-overview-blowout.svg":::

Firewall settings must be adjusted for data to reach ingestion endpoints. For more information, see [IP addresses used by Azure Monitor](./ip-addresses.md).

## How do I use Application Insights?

Application Insights is enabled through either [autoinstrumentation](codeless-overview.md) (agent) or by adding the [Application Insights SDK](sdk-support-guidance.md) or [Azure Monitor OpenTelemetry Distro](opentelemetry-enable.md) to your application code. [Many languages](#supported-languages) are supported. The applications could be on Azure, on-premises, or hosted by another cloud. To figure out which type of instrumentation is best for you, see [How do I instrument an application?](#how-do-i-instrument-an-application).

The Application Insights agent or SDK preprocesses telemetry and metrics before sending the data to Azure. Then it's ingested and processed further before it's stored in Azure Monitor Logs (Log Analytics). For this reason, an Azure account is required to use Application Insights.

The easiest way to get started consuming Application insights is through the Azure portal and the built-in visual experiences. Advanced users can [query the underlying data](../logs/log-query-overview.md) directly to [build custom visualizations](tutorial-app-dashboards.md) through Azure Monitor [dashboards](overview-dashboard.md) and [workbooks](../visualize/workbooks-overview.md).

Consider starting with the [Application Map](app-map.md) for a high-level view. Use the [Search](diagnostic-search.md) experience to quickly narrow down telemetry and data by type and date-time. Or you can search within data (for example, with Log Traces) and filter to a given correlated operation of interest.

Two views are especially useful:

- [Performance view](tutorial-performance.md): Get deep insights into how your application or API and downstream dependencies are performing. You can also find a representative sample to [explore end to end](transaction-diagnostics.md).
- [Failures view](tutorial-runtime-exceptions.md): Understand which components or actions are generating failures and triage errors and exceptions. The built-in views are helpful to track application health proactively and for reactive root-cause analysis.

[Create Azure Monitor alerts](tutorial-alert.md) to signal potential issues in case your application or components parts deviate from the established baseline.

Application Insights pricing is based on consumption. You only pay for what you use. For more information on pricing, see:

- [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/)
- [Optimize costs in Azure Monitor](../best-practices-cost.md)

## How do I instrument an application?

[Autoinstrumentation](codeless-overview.md) is the preferred instrumentation method. It requires no developer investment and eliminates future overhead related to [updating the SDK](sdk-support-guidance.md). It's also the only way to instrument an application in which you don't have access to the source code.

You only need to install the Application Insights SDK if:

- You require [custom events and metrics](api-custom-events-metrics.md).
- You require control over the flow of telemetry.
- [Autoinstrumentation](codeless-overview.md) isn't available, typically because of language or platform limitations.

To use the SDK, you install a small instrumentation package in your app and then instrument the web app, any background components, and JavaScript within the webpages. The app and its components don't have to be hosted in Azure.

The instrumentation monitors your app and directs the telemetry data to an Application Insights resource by using a unique token. The effect on your app's performance is small. Tracking calls are nonblocking and batched to be sent in a separate thread.

### [.NET](#tab/net)

Integrated autoinstrumentation is available for [Azure App Service .NET](azure-web-apps-net.md), [Azure App Service .NET Core](azure-web-apps-net-core.md), [Azure Functions](../../azure-functions/functions-monitoring.md), and [Azure Virtual Machines](azure-vm-vmss-apps.md).

The [Azure Monitor Application Insights agent](application-insights-asp-net-agent.md) is available for workloads running in on-premises virtual machines.

For a detailed view of all autoinstrumentation supported environments, languages, and resource providers, see [What is autoinstrumentation for Azure Monitor Application Insights?](codeless-overview.md#supported-environments-languages-and-resource-providers).

For other scenarios, the [Application Insights SDK](/dotnet/api/overview/azure/insights) is required.

An [OpenTelemetry](opentelemetry-enable.md?tabs=net) offering is also available.

### [Java](#tab/java)

Integrated autoinstrumentation is available for Java Apps hosted on [Azure App Service](azure-web-apps-java.md) and [Azure Functions](monitor-functions.md).

Autoinstrumentation is available for any environment by using [Azure Monitor OpenTelemetry-based autoinstrumentation for Java applications](opentelemetry-enable.md?tabs=java).

### [Node.js](#tab/nodejs)

Autoinstrumentation is available for [Azure App Service](azure-web-apps-nodejs.md).

The [Application Insights SDK](nodejs.md) is an alternative. We also have an [OpenTelemetry](opentelemetry-enable.md?tabs=nodejs) offering available.

### [Python](#tab/python)

Python applications can be monitored by using the [Azure Monitor OpenTelemetry Distro](opentelemetry-enable.md?tabs=python).

### [JavaScript](#tab/javascript)

JavaScript requires the [Application Insights SDK](javascript.md).

---

---------------------------
## Supported languages

This section outlines supported scenarios.

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
          
## Troubleshooting

Review dedicated [troubleshooting articles](/troubleshoot/azure/azure-monitor/welcome-azure-monitor) for Application Insights.

## Help and support

### Azure technical support

For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).

### Microsoft Q&A questions forum

Post general questions to the Microsoft Q&A [answers forum](/answers/topics/24223/azure-monitor.html).

### Stack Overflow

Post coding questions to [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-application-insights) by using an `azure-application-insights` tag.

### Feedback Community

Leave product feedback for the engineering team in the [Feedback Community](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).

## Next steps

- [Create a resource](create-workspace-resource.md)
- [Autoinstrumentation overview](codeless-overview.md)
- [Overview dashboard](overview-dashboard.md)
- [Availability overview](availability-overview.md)
- [Application Map](app-map.md)
