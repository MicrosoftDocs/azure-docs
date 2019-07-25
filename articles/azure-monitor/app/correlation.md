---
title: Azure Application Insights telemetry correlation | Microsoft Docs
description: Application Insights telemetry correlation
services: application-insights
documentationcenter: .net
author: lgayhardt
manager: carmonm
ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/07/2019
ms.reviewer: sergkanz
ms.author: lagayhar
---
# Telemetry correlation in Application Insights

In the world of microservices, every logical operation requires work to be done in various components of the service. Each of these components can be monitored separately by [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md). The web-app component communicates with the authentication provider component to validate user credentials, and with the API component to get data for visualization. The API component can query data from other services and use cache-provider components to notify the billing component about this call. Application Insights supports distributed telemetry correlation, which you use to detect which component is responsible for failures or performance degradation.

This article explains the data model used by Application Insights to correlate telemetry sent by multiple components. It covers context-propagation techniques and protocols. It also covers the implementation of correlation concepts on different languages and platforms.

## Data model for telemetry correlation

Application Insights defines a [data model](../../azure-monitor/app/data-model.md) for distributed telemetry correlation. To associate telemetry with the logical operation, every telemetry item has a context field called `operation_Id`. This identifier is shared by every telemetry item in the distributed trace. So, even with loss of telemetry from a single layer, you can still associate telemetry reported by other components.

A distributed logical operation typically consists of a set of smaller operations, which are requests processed by one of the components. These operations are defined by [request telemetry](../../azure-monitor/app/data-model-request-telemetry.md). Every request telemetry has its own `id` that identifies it uniquely and globally. And all telemetry items (such as traces and exceptions) that are associated with this request should set the `operation_parentId` to the value of the request `id`.

Every outgoing operation, such as an HTTP call to another component, is represented by [dependency telemetry](../../azure-monitor/app/data-model-dependency-telemetry.md). Dependency telemetry also defines its own `id` that is globally unique. Request telemetry, initiated by this dependency call, uses this `id` as its `operation_parentId`.

You can build a view of the distributed logical operation by using `operation_Id`, `operation_parentId`, and `request.id` with `dependency.id`. These fields also define the causality order of telemetry calls.

In a microservices environment, traces from components can go to different storage items. Every component can have its own instrumentation key in Application Insights. To get telemetry for the logical operation, the Application Insights UX queries data from every storage item. When the number of storage items is huge, you'll need a hint about where to look next. The Application Insights data model defines two fields to solve this problem: `request.source` and `dependency.target`. The first field identifies the component that initiated the dependency request, and the second identifies which component returned the response of the dependency call.

## Example

Let's take an example of an application called Stock Prices, which shows the current market price of a stock by using an external API called `Stock`. The Stock Prices application has a page called `Stock page` that the client web browser opens by using `GET /Home/Stock`. The application queries the `Stock` API by using an HTTP call `GET /api/stock/value`.

You can analyze the resulting telemetry by running a query:

```kusto
(requests | union dependencies | union pageViews)
| where operation_Id == "STYz"
| project timestamp, itemType, name, id, operation_ParentId, operation_Id
```

In the results, note that all telemetry items share the root `operation_Id`. When an Ajax call is made from the page, a new unique ID (`qJSXU`) is assigned to the dependency telemetry and the ID of the pageView is used as `operation_ParentId`. The server request then uses the Ajax ID as `operation_ParentId`.

| itemType   | name                      | ID           | operation_ParentId | operation_Id |
|------------|---------------------------|--------------|--------------------|--------------|
| pageView   | Stock page                |              | STYz               | STYz         |
| dependency | GET /Home/Stock           | qJSXU        | STYz               | STYz         |
| request    | GET Home/Stock            | KqKwlrSt9PA= | qJSXU              | STYz         |
| dependency | GET /api/stock/value      | bBrf2L7mm2g= | KqKwlrSt9PA=       | STYz         |

When the call `GET /api/stock/value` is made to an external service, you want to know the identity of that server so you can set the `dependency.target` field appropriately. When the external service doesn't support monitoring, `target` is set to the host name of the service (for example, `stock-prices-api.com`). However, if the service identifies itself by returning a predefined HTTP header, `target` contains the service identity that allows Application Insights to build a distributed trace by querying telemetry from that service.

## Correlation headers

We're working on an RFC proposal for the [correlation HTTP protocol](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md). This proposal defines two headers:

- `Request-Id`: Carries the globally unique ID of the call.
- `Correlation-Context`: Carries the name-value pairs collection of the distributed trace properties.

The standard also defines two schemas for `Request-Id` generation: flat and hierarchical. With the flat schema, a well-known `Id` key is defined for the `Correlation-Context` collection.

Application Insights defines the [extension](https://github.com/lmolkova/correlation/blob/master/http_protocol_proposal_v2.md) for the correlation HTTP protocol. It uses `Request-Context` name-value pairs to propagate the collection of properties used by the immediate caller or callee. The Application Insights SDK uses this header to set `dependency.target` and `request.source` fields.

### W3C distributed tracing

We're transitioning to [W3C distributed tracing format](https://w3c.github.io/trace-context/). It defines:

- `traceparent`: Carries the globally unique operation ID and unique identifier of the call.
- `tracestate`: Carries tracing system-specific context.

#### Enable W3C distributed tracing support for classic ASP.NET apps

This feature is available in `Microsoft.ApplicationInsights.Web` and `Microsoft.ApplicationInsights.DependencyCollector` packages starting with version 2.8.0-beta1.
It's disabled by default. To enable it, change `ApplicationInsights.config`:

- Under `RequestTrackingTelemetryModule`, add the `EnableW3CHeadersExtraction` element with value set to `true`.
- Under `DependencyTrackingTelemetryModule`, add the `EnableW3CHeadersInjection` element with value set to `true`.

#### Enable W3C distributed tracing support for ASP.NET Core apps

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

#### Enable W3C distributed tracing support for Java apps

- **Incoming configuration**

  - For Java EE apps, add the following to the `<TelemetryModules>` tag inside ApplicationInsights.xml:

    ```xml
    <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebRequestTrackingTelemetryModule>
       <Param name = "W3CEnabled" value ="true"/>
       <Param name ="enableW3CBackCompat" value = "true" />
    </Add>
    ```
  - For Spring Boot apps, add the following properties:

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
> Make sure that both incoming and outgoing configurations are exactly the same.

## OpenTracing and Application Insights

The [OpenTracing data model specification](https://opentracing.io/) and Application Insights data models map in the following way:

| Application Insights               	| OpenTracing                                    	|
|------------------------------------	|-------------------------------------------------	|
| `Request`, `PageView`              	| `Span` with `span.kind = server`                	|
| `Dependency`                       	| `Span` with `span.kind = client`                	|
| `Id` of `Request` and `Dependency` 	| `SpanId`                                        	|
| `Operation_Id`                     	| `TraceId`                                       	|
| `Operation_ParentId`               	| `Reference` of type `ChildOf` (the parent span) 	|

For more information, see the [Application Insights telemetry data model](../../azure-monitor/app/data-model.md). 

For definitions of OpenTracing concepts, see the OpenTracing [specification](https://github.com/opentracing/specification/blob/master/specification.md) and [semantic_conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md).

## Telemetry correlation in .NET

Over time, .NET defined several ways to correlate telemetry and diagnostics logs:

- `System.Diagnostics.CorrelationManager` allows tracking of [LogicalOperationStack and ActivityId](https://msdn.microsoft.com/library/system.diagnostics.correlationmanager.aspx). 
- `System.Diagnostics.Tracing.EventSource` and Event Tracing for Windows (ETW) define the [SetCurrentThreadActivityId](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource.setcurrentthreadactivityid.aspx) method.
- `ILogger` uses [Log Scopes](https://docs.microsoft.com/aspnet/core/fundamentals/logging#log-scopes). 
- Windows Communication Foundation (WCF) and HTTP wire up "current" context propagation.

However, those methods didn't enable automatic distributed tracing support. `DiagnosticSource` is a way to support automatic cross-machine correlation. .NET libraries support 'DiagnosticSource' and allow automatic cross-machine propagation of the correlation context via the transport, such as HTTP.

The [guide to Activities](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) in `DiagnosticSource` explains the basics of tracking activities.

ASP.NET Core 2.0 supports extraction of HTTP headers and starting a new activity.

`System.Net.HttpClient`, starting with version 4.1.0, supports automatic injection of the correlation HTTP headers and tracking the HTTP call as an activity.

There is a new HTTP module, [Microsoft.AspNet.TelemetryCorrelation](https://www.nuget.org/packages/Microsoft.AspNet.TelemetryCorrelation/), for classic ASP.NET. This module implements telemetry correlation by using `DiagnosticSource`. It starts an activity based on incoming request headers. It also correlates telemetry from the different stages of request processing, even for cases when every stage of Internet Information Services (IIS) processing runs on a different managed thread.

The Application Insights SDK, starting with version 2.4.0-beta1, uses `DiagnosticSource` and `Activity` to collect telemetry and associate it with the current activity.

<a name="java-correlation"></a>
## Telemetry correlation in the Java SDK

The [Application Insights SDK for Java](../../azure-monitor/app/java-get-started.md) supports automatic correlation of telemetry beginning with version 2.0.0. It automatically populates `operation_id` for all telemetry (such as traces, exceptions, and custom events) issued within the scope of a request. It also takes care of propagating the correlation headers (described earlier) for service-to-service calls via HTTP, if the [Java SDK agent](../../azure-monitor/app/java-agent.md) is configured.

> [!NOTE]
> Only calls made via Apache HTTPClient are supported for the correlation feature. If you're using Spring RestTemplate or Feign, both can be used with Apache HTTPClient under the hood.

Currently, automatic context propagation across messaging technologies (such Kafka, RabbitMQ, or Azure Service Bus) isn't supported. However, it's possible to code such scenarios manually by using the `trackDependency` and `trackRequest` APIs. In these APIs, a dependency telemetry represents a message being enqueued by a producer, and the request represents a message being processed by a consumer. In this case, both `operation_id` and `operation_parentId` should be propagated in the message's properties.

### Telemetry correlation in Asynchronous Java Application

In order to correlate telemetry in Asynchronous Spring Boot application, please follow [this](https://github.com/Microsoft/ApplicationInsights-Java/wiki/Distributed-Tracing-in-Asynchronous-Java-Applications) in-depth article. It provides guidance for instrumenting Spring's [ThreadPoolTaskExecutor](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html) as well as [ThreadPoolTaskScheduler](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskScheduler.html). 


<a name="java-role-name"></a>
## Role name

At times, you might want to customize the way component names are displayed in the [Application Map](../../azure-monitor/app/app-map.md). To do so, you can manually set the `cloud_RoleName` by doing one of the following:

- If you use Spring Boot with the Application Insights Spring Boot starter, the only required change is to set your custom name for the application in the application.properties file.

  `spring.application.name=<name-of-app>`

  The Spring Boot starter automatically assigns `cloudRoleName` to the value you enter for the `spring.application.name` property.

- If you're using the `WebRequestTrackingFilter`, the `WebAppNameContextInitializer` sets the application name automatically. Add the following to your configuration file (ApplicationInsights.xml):

  ```XML
  <ContextInitializers>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebAppNameContextInitializer" />
  </ContextInitializers>
  ```

- If you use the cloud context class:

  ```Java
  telemetryClient.getContext().getCloud().setRole("My Component Name");
  ```

## Next steps

- Write [custom telemetry](../../azure-monitor/app/api-custom-events-metrics.md).
- Learn more about [setting cloud_RoleName](../../azure-monitor/app/app-map.md#set-cloud-role-name) for other SDKs.
- Onboard all components of your microservice on Application Insights. Check out the [supported platforms](../../azure-monitor/app/platforms.md).
- See the [data model](../../azure-monitor/app/data-model.md) for Application Insights types.
- Learn how to [extend and filter telemetry](../../azure-monitor/app/api-filtering-sampling.md).
- Review the [Application Insights config reference](configuration-with-applicationinsights-config.md).
