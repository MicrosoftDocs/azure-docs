---
title: Azure Application Insights telemetry correlation | Microsoft Docs
description: Application Insights telemetry correlation
ms.topic: conceptual
author: lgayhardt
ms.author: lagayhar
ms.date: 06/07/2019
ms.reviewer: sergkanz
ms.custom: tracking-python
---

# Telemetry correlation in Application Insights

In the world of microservices, every logical operation requires work to be done in various components of the service. You can monitor each of these components separately by using [Application Insights](../../azure-monitor/app/app-insights-overview.md). Application Insights supports distributed telemetry correlation, which you use to detect which component is responsible for failures or performance degradation.

This article explains the data model used by Application Insights to correlate telemetry sent by multiple components. It covers context-propagation techniques and protocols. It also covers the implementation of correlation tactics on different languages and platforms.

## Data model for telemetry correlation

Application Insights defines a [data model](../../azure-monitor/app/data-model.md) for distributed telemetry correlation. To associate telemetry with a logical operation, every telemetry item has a context field called `operation_Id`. This identifier is shared by every telemetry item in the distributed trace. So even if you lose telemetry from a single layer, you can still associate telemetry reported by other components.

A distributed logical operation typically consists of a set of smaller operations that are requests processed by one of the components. These operations are defined by [request telemetry](../../azure-monitor/app/data-model-request-telemetry.md). Every request telemetry item has its own `id` that identifies it uniquely and globally. And all telemetry items (such as traces and exceptions) that are associated with the request should set the `operation_parentId` to the value of the request `id`.

Every outgoing operation, such as an HTTP call to another component, is represented by [dependency telemetry](../../azure-monitor/app/data-model-dependency-telemetry.md). Dependency telemetry also defines its own `id` that's globally unique. Request telemetry, initiated by this dependency call, uses this `id` as its `operation_parentId`.

You can build a view of the distributed logical operation by using `operation_Id`, `operation_parentId`, and `request.id` with `dependency.id`. These fields also define the causality order of telemetry calls.

In a microservices environment, traces from components can go to different storage items. Every component can have its own instrumentation key in Application Insights. To get telemetry for the logical operation, Application Insights queries data from every storage item. When the number of storage items is large, you'll need a hint about where to look next. The Application Insights data model defines two fields to solve this problem: `request.source` and `dependency.target`. The first field identifies the component that initiated the dependency request. The second field identifies which component returned the response of the dependency call.

## Example

Let's look at an example. An application called Stock Prices shows the current market price of a stock by using an external API called Stock. The Stock Prices application has a page called Stock page that the client web browser opens by using `GET /Home/Stock`. The application queries the Stock API by using the HTTP call `GET /api/stock/value`.

You can analyze the resulting telemetry by running a query:

```kusto
(requests | union dependencies | union pageViews)
| where operation_Id == "STYz"
| project timestamp, itemType, name, id, operation_ParentId, operation_Id
```

In the results, note that all telemetry items share the root `operation_Id`. When an Ajax call is made from the page, a new unique ID (`qJSXU`) is assigned to the dependency telemetry, and the ID of the pageView is used as `operation_ParentId`. The server request then uses the Ajax ID as `operation_ParentId`.

| itemType   | name                      | ID           | operation_ParentId | operation_Id |
|------------|---------------------------|--------------|--------------------|--------------|
| pageView   | Stock page                |              | STYz               | STYz         |
| dependency | GET /Home/Stock           | qJSXU        | STYz               | STYz         |
| request    | GET Home/Stock            | KqKwlrSt9PA= | qJSXU              | STYz         |
| dependency | GET /api/stock/value      | bBrf2L7mm2g= | KqKwlrSt9PA=       | STYz         |

When the call `GET /api/stock/value` is made to an external service, you need to know the identity of that server so you can set the `dependency.target` field appropriately. When the external service doesn't support monitoring, `target` is set to the host name of the service (for example, `stock-prices-api.com`). But if the service identifies itself by returning a predefined HTTP header, `target` contains the service identity that allows Application Insights to build a distributed trace by querying telemetry from that service.

## Correlation headers

Application Insights is transitioning to [W3C Trace-Context](https://w3c.github.io/trace-context/), which defines:

- `traceparent`: Carries the globally unique operation ID and unique identifier of the call.
- `tracestate`: Carries system-specific tracing context.

The latest version of the Application Insights SDK supports the Trace-Context protocol, but you might need to opt in to it. (Backward compatibility with the previous correlation protocol supported by the Application Insights SDK will be maintained.)

The [correlation HTTP protocol, also called Request-Id](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md), is being deprecated. This protocol defines two headers:

- `Request-Id`: Carries the globally unique ID of the call.
- `Correlation-Context`: Carries the name-value pairs collection of the distributed trace properties.

Application Insights also defines the [extension](https://github.com/lmolkova/correlation/blob/master/http_protocol_proposal_v2.md) for the correlation HTTP protocol. It uses `Request-Context` name-value pairs to propagate the collection of properties used by the immediate caller or callee. The Application Insights SDK uses this header to set the `dependency.target` and `request.source` fields.

### Enable W3C distributed tracing support for classic ASP.NET apps
 
  > [!NOTE]
  >  Starting with `Microsoft.ApplicationInsights.Web` and `Microsoft.ApplicationInsights.DependencyCollector`, no configuration is needed.

W3C Trace-Context support is implemented in a backward-compatible way. Correlation is expected to work with applications that are instrumented with previous versions of the SDK (without W3C support).

If you want to keep using the legacy `Request-Id` protocol, you can disable Trace-Context by using this configuration:

```csharp
  Activity.DefaultIdFormat = ActivityIdFormat.Hierarchical;
  Activity.ForceDefaultIdFormat = true;
```

If you run an older version of the SDK, we recommend that you update it or apply the following configuration to enable Trace-Context.
This feature is available in the `Microsoft.ApplicationInsights.Web` and `Microsoft.ApplicationInsights.DependencyCollector` packages, starting with version 2.8.0-beta1.
It's disabled by default. To enable it, make these changes to `ApplicationInsights.config`:

- Under `RequestTrackingTelemetryModule`, add the `EnableW3CHeadersExtraction` element and set its value to `true`.
- Under `DependencyTrackingTelemetryModule`, add the `EnableW3CHeadersInjection` element and set its value to `true`.
- Add `W3COperationCorrelationTelemetryInitializer` under `TelemetryInitializers`. It will look similar to this example:

```xml
<TelemetryInitializers>
  <Add Type="Microsoft.ApplicationInsights.Extensibility.W3C.W3COperationCorrelationTelemetryInitializer, Microsoft.ApplicationInsights"/>
   ...
</TelemetryInitializers>
```

### Enable W3C distributed tracing support for ASP.NET Core apps

 > [!NOTE]
  > Starting with `Microsoft.ApplicationInsights.AspNetCore` version 2.8.0, no configuration is needed.
 
W3C Trace-Context support is implemented in a backward-compatible way. Correlation is expected to work with applications that are instrumented with previous versions of the SDK (without W3C support).

If you want to keep using the legacy `Request-Id` protocol, you can disable Trace-Context by using this configuration:

```csharp
  Activity.DefaultIdFormat = ActivityIdFormat.Hierarchical;
  Activity.ForceDefaultIdFormat = true;
```

If you run an older version of the SDK, we recommend that you update it or apply the following configuration to enable Trace-Context.

This feature is in `Microsoft.ApplicationInsights.AspNetCore` version 2.5.0-beta1 and in `Microsoft.ApplicationInsights.DependencyCollector` version 2.8.0-beta1.
It's disabled by default. To enable it, set `ApplicationInsightsServiceOptions.RequestCollectionOptions.EnableW3CDistributedTracing` to `true`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry(o => 
        o.RequestCollectionOptions.EnableW3CDistributedTracing = true );
    // ....
}
```

### Enable W3C distributed tracing support for Java apps

#### Java 3.0 agent

  Java 3.0 agent supports W3C out of the box and no additional configuration is needed. 

#### Java SDK
- **Incoming configuration**

  - For Java EE apps, add the following to the `<TelemetryModules>` tag in ApplicationInsights.xml:

    ```xml
    <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebRequestTrackingTelemetryModule>
       <Param name = "W3CEnabled" value ="true"/>
       <Param name ="enableW3CBackCompat" value = "true" />
    </Add>
    ```
    
  - For Spring Boot apps, add these properties:

    - `azure.application-insights.web.enable-W3C=true`
    - `azure.application-insights.web.enable-W3C-backcompat-mode=true`

- **Outgoing configuration**

  Add the following to AI-Agent.xml:

  ```xml
  <Instrumentation>
    <BuiltIn enabled="true">
      <HTTP enabled="true" W3C="true" enableW3CBackCompat="true"/>
    </BuiltIn>
  </Instrumentation>
  ```

  > [!NOTE]
  > Backward compatibility mode is enabled by default, and the `enableW3CBackCompat` parameter is optional. Use it only when you want to turn backward compatibility off.
  >
  > Ideally, you would turn this off when all your services have been updated to newer versions of SDKs that support the W3C protocol. We highly recommend that you move to these newer SDKs as soon as possible.

> [!IMPORTANT]
> Make sure the incoming and outgoing configurations are exactly the same.

### Enable W3C distributed tracing support for Web apps

This feature is in `Microsoft.ApplicationInsights.JavaScript`. It's disabled by default. To enable it, use `distributedTracingMode` config. AI_AND_W3C is provided for backward compatibility with any legacy services instrumented by Application Insights.

- **npm setup (ignore if using Snippet setup)**

  ```javascript
  import { ApplicationInsights, DistributedTracingModes } from '@microsoft/applicationinsights-web';

  const appInsights = new ApplicationInsights({ config: {
    instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
    distributedTracingMode: DistributedTracingModes.W3C
    /* ...other configuration options... */
  } });
  appInsights.loadAppInsights();
  ```
  
- **Snippet setup (ignore if using npm setup)**

  ```
  <script type="text/javascript">
  var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){i[e]=function(){var n=arguments;i.queue.push(function(){i[e].apply(i,n)})}}var i={config:e};i.initialize=!0;var a=document,t=window;setTimeout(function(){var n=a.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js",a.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{i.cookie=a.cookie}catch(e){}i.queue=[],i.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var o="Track"+r[0];if(n("start"+o),n("stop"+o),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var s=t[r];t[r]=function(e,n,a,t,o){var c=s&&s(e,n,a,t,o);return!0!==c&&i["_"+r]({message:e,url:n,lineNumber:a,columnNumber:t,error:o}),c},e.autoExceptionInstrumented=!0}return i}
  (
    {
      instrumentationKey:"INSTRUMENTATION_KEY",
      distributedTracingMode: 2 // DistributedTracingModes.W3C
      /* ...other configuration options... */
    }
  );
  window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
  </script>
  ```

## OpenTracing and Application Insights

The [OpenTracing data model specification](https://opentracing.io/) and Application Insights data models map in the following way:

| Application Insights                   | OpenTracing                                        |
|------------------------------------    |-------------------------------------------------    |
| `Request`, `PageView`                  | `Span` with `span.kind = server`                    |
| `Dependency`                           | `Span` with `span.kind = client`                    |
| `Id` of `Request` and `Dependency`     | `SpanId`                                            |
| `Operation_Id`                         | `TraceId`                                           |
| `Operation_ParentId`                   | `Reference` of type `ChildOf` (the parent span)     |

For more information, see [Application Insights telemetry data model](../../azure-monitor/app/data-model.md).

For definitions of OpenTracing concepts, see the OpenTracing [specification](https://github.com/opentracing/specification/blob/master/specification.md) and [semantic conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md).

## Telemetry correlation in OpenCensus Python

OpenCensus Python follows the `OpenTracing` data model specifications outlined earlier. It also supports [W3C Trace-Context](https://w3c.github.io/trace-context/) without requiring any configuration.

### Incoming request correlation

OpenCensus Python correlates W3C Trace-Context headers from incoming requests to the spans that are generated from the requests themselves. OpenCensus will do this automatically with integrations for these popular web application frameworks: Flask, Django, and Pyramid. You just need to populate the W3C Trace-Context headers with the [correct format](https://www.w3.org/TR/trace-context/#trace-context-http-headers-format) and send them with the request. Here's a sample Flask application that demonstrates this:

```python
from flask import Flask
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

app = Flask(__name__)
middleware = FlaskMiddleware(
    app,
    exporter=AzureExporter(),
    sampler=ProbabilitySampler(rate=1.0),
)

@app.route('/')
def hello():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(host='localhost', port=8080, threaded=True)
```

This code runs a sample Flask application on your local machine, listening to port `8080`. To correlate trace context, you send a request to the endpoint. In this example, you can use a `curl` command:
```
curl --header "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" localhost:8080
```
By looking at the [Trace-Context header format](https://www.w3.org/TR/trace-context/#trace-context-http-headers-format), you can derive the following information:

`version`: `00`

`trace-id`: `4bf92f3577b34da6a3ce929d0e0e4736`

`parent-id/span-id`: `00f067aa0ba902b7`

`trace-flags`: `01`

If you look at the request entry that was sent to Azure Monitor, you can see fields populated with the trace header information. You can find this data under Logs (Analytics) in the Azure Monitor Application Insights resource.

![Request telemetry in Logs (Analytics)](./media/opencensus-python/0011-correlation.png)

The `id` field is in the format `<trace-id>.<span-id>`, where the `trace-id` is taken from the trace header that was passed in the request and the `span-id` is a generated 8-byte array for this span.

The `operation_ParentId` field is in the format `<trace-id>.<parent-id>`, where both the `trace-id` and the `parent-id` are taken from the trace header that was passed in the request.

### Log correlation

OpenCensus Python enables you to correlate logs by adding a trace ID, a span ID, and a sampling flag to log records. You add these attributes by installing OpenCensus [logging integration](https://pypi.org/project/opencensus-ext-logging/). The following attributes will be added to Python `LogRecord` objects: `traceId`, `spanId`, and `traceSampled`. Note that this takes effect only for loggers that are created after the integration.

Here's a sample application that demonstrates this:

```python
import logging

from opencensus.trace import config_integration
from opencensus.trace.samplers import AlwaysOnSampler
from opencensus.trace.tracer import Tracer

config_integration.trace_integrations(['logging'])
logging.basicConfig(format='%(asctime)s traceId=%(traceId)s spanId=%(spanId)s %(message)s')
tracer = Tracer(sampler=AlwaysOnSampler())

logger = logging.getLogger(__name__)
logger.warning('Before the span')
with tracer.span(name='hello'):
    logger.warning('In the span')
logger.warning('After the span')
```
When this code runs, the following prints in the console:
```
2019-10-17 11:25:59,382 traceId=c54cb1d4bbbec5864bf0917c64aeacdc spanId=0000000000000000 Before the span
2019-10-17 11:25:59,384 traceId=c54cb1d4bbbec5864bf0917c64aeacdc spanId=70da28f5a4831014 In the span
2019-10-17 11:25:59,385 traceId=c54cb1d4bbbec5864bf0917c64aeacdc spanId=0000000000000000 After the span
```
Notice that there's a `spanId` present for the log message that's within the span. This is the same `spanId` that belongs to the span named `hello`.

You can export the log data by using `AzureLogHandler`. For more information, see [this article](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python#logs).

## Telemetry correlation in .NET

Over time, .NET has defined several ways to correlate telemetry and diagnostics logs:

- `System.Diagnostics.CorrelationManager` allows the tracking of [LogicalOperationStack and ActivityId](https://msdn.microsoft.com/library/system.diagnostics.correlationmanager.aspx).
- `System.Diagnostics.Tracing.EventSource` and Event Tracing for Windows (ETW) define the [SetCurrentThreadActivityId](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource.setcurrentthreadactivityid.aspx) method.
- `ILogger` uses [Log scopes](https://docs.microsoft.com/aspnet/core/fundamentals/logging#log-scopes).
- Windows Communication Foundation (WCF) and HTTP wire up "current" context propagation.

But those methods didn't enable automatic distributed tracing support. `DiagnosticSource` supports automatic cross-machine correlation. .NET libraries support `DiagnosticSource` and allow automatic cross-machine propagation of the correlation context via the transport, such as HTTP.

The [Activity User Guide](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) in `DiagnosticSource` explains the basics of tracking activities.

ASP.NET Core 2.0 supports extraction of HTTP headers and starting new activities.

`System.Net.Http.HttpClient`, starting with version 4.1.0, supports automatic injection of correlation HTTP headers and tracking HTTP calls as activities.

There's a new HTTP module, [Microsoft.AspNet.TelemetryCorrelation](https://www.nuget.org/packages/Microsoft.AspNet.TelemetryCorrelation/), for classic ASP.NET. This module implements telemetry correlation by using `DiagnosticSource`. It starts an activity based on incoming request headers. It also correlates telemetry from the different stages of request processing, even when every stage of Internet Information Services (IIS) processing runs on a different managed thread.

The Application Insights SDK, starting with version 2.4.0-beta1, uses `DiagnosticSource` and `Activity` to collect telemetry and associate it with the current activity.

<a name="java-correlation"></a>
## Telemetry correlation in Java

[Java agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent) as well as [Java SDK](../../azure-monitor/app/java-get-started.md) version 2.0.0 or later supports automatic correlation of telemetry. It automatically populates `operation_id` for all telemetry (like traces, exceptions, and custom events) issued within the scope of a request. It also propagates the correlation headers (described earlier) for service-to-service calls via HTTP, if the [Java SDK agent](../../azure-monitor/app/java-agent.md) is configured.

> [!NOTE]
> Application Insights Java agent auto-collects requests and dependencies for JMS, Kafka, Netty/Webflux, and more. For Java SDK only calls made via Apache HttpClient are supported for the correlation feature. Automatic context propagation across messaging technologies (like Kafka, RabbitMQ, and Azure Service Bus) isn't supported in the SDK. 

> [!NOTE]
> To collect custom telemetry you need to instrument the application with Java 2.6 SDK. 

### Role names

You might want to customize the way component names are displayed in the [Application Map](../../azure-monitor/app/app-map.md). To do so, you can manually set the `cloud_RoleName` by taking one of the following actions:

- For Application Insights Java agent 3.0, set the cloud role name as follows:

    ```json
    {
      "instrumentationSettings": {
        "preview": {
          "roleName": "my cloud role name"
        }
      }
    }
    ```
    You can also set the cloud role name using the environment variable `APPLICATIONINSIGHTS_ROLE_NAME`.

- With Application Insights Java SDK 2.5.0 and later, you can specify the `cloud_RoleName`
  by adding `<RoleName>` to your ApplicationInsights.xml file:

  ```XML
  <?xml version="1.0" encoding="utf-8"?>
  <ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings" schemaVersion="2014-05-30">
     <InstrumentationKey>** Your instrumentation key **</InstrumentationKey>
     <RoleName>** Your role name **</RoleName>
     ...
  </ApplicationInsights>
  ```

- If you use Spring Boot with the Application Insights Spring Boot Starter, you just need to set your custom name for the application in the application.properties file:

  `spring.application.name=<name-of-app>`

  The Spring Boot Starter automatically assigns `cloudRoleName` to the value you enter for the `spring.application.name` property.

## Next steps

- Write [custom telemetry](../../azure-monitor/app/api-custom-events-metrics.md).
- For advanced correlation scenarios in ASP.NET Core and ASP.NET, see [Track custom operations](custom-operations-tracking.md).
- Learn more about [setting cloud_RoleName](../../azure-monitor/app/app-map.md#set-cloud-role-name) for other SDKs.
- Onboard all components of your microservice on Application Insights. Check out the [supported platforms](../../azure-monitor/app/platforms.md).
- See the [data model](../../azure-monitor/app/data-model.md) for Application Insights types.
- Learn how to [extend and filter telemetry](../../azure-monitor/app/api-filtering-sampling.md).
- Review the [Application Insights config reference](configuration-with-applicationinsights-config.md).
