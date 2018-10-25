---
title: Azure Application Insights Telemetry Correlation | Microsoft Docs
description: Application Insights telemetry correlation
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/09/2018
ms.reviewer: sergkanz
ms.author: mbullwin

---
# Telemetry correlation in Application Insights

In the world of micro services, every logical operation requires work done in various components of the service. Each of these components can be separately monitored by [Application Insights](app-insights-overview.md). The web app component communicates with authentication provider component to validate user credentials, and with the API component to get data for visualization. The API component in its turn can query data from other services and use cache-provider components and notify the billing component about this call. Application Insights supports distributed telemetry correlation. It allows you to detect which component is responsible for failures or performance degradation.

This article explains the data model used by Application Insights to correlate telemetry sent by multiple components. It covers the context propagation techniques and protocols. It also covers the implementation of the correlation concepts on different languages and platforms.

## Telemetry correlation data model

Application Insights defines a [data model](application-insights-data-model.md) for distributed telemetry correlation. To associate telemetry with the logical operation, every telemetry item has a context field called `operation_Id`. This identifier is shared by every telemetry item in the distributed trace. So even with loss of telemetry from a single layer you still can associate telemetry reported by other components.

Distributed logical operation typically consists of a set of smaller operations - requests processed by one of the components. Those operations are defined by [request telemetry](application-insights-data-model-request-telemetry.md). Every request telemetry has its own `id` that uniquely globally identifies it. And all telemetry - traces, exceptions, etc. associated with this request should set the `operation_parentId` to the value of the request `id`.

Every outgoing operation like http call to another component represented by [dependency telemetry](application-insights-data-model-dependency-telemetry.md). Dependency telemetry also defines its own `id` that is globally unique. Request telemetry, initiated by this dependency call, uses it as `operation_parentId`.

You can build the view of distributed logical operation using `operation_Id`, `operation_parentId`, and `request.id` with `dependency.id`. Those fields also define the causality order of telemetry calls.

In micro services environment, traces from components may go to the different storages. Every component may have its own instrumentation key in Application Insights. To get telemetry for the logical operation, you need to query data from every storage. When number of storages is huge, you need to have a hint on where to look next.

Application Insights data model defines two fields to solve this problem: `request.source` and `dependency.target`. The first field identifies the component that initiated the dependency request, and the second identifies which component returned the response of the dependency call.


## Example

Let's take an example of an application STOCK PRICES showing the current market price of a stock using the external API called STOCKS API. The STOCK PRICES application has a page `Stock page` opened by the client web browser using `GET /Home/Stock`. The application queries the STOCK API by using an HTTP call `GET /api/stock/value`.

You can analyze resulting telemetry running a query:

```
(requests | union dependencies | union pageViews) 
| where operation_Id == "STYz"
| project timestamp, itemType, name, id, operation_ParentId, operation_Id
```

In the result view note that all telemetry items share the root `operation_Id`. When ajax call made from the page - new unique id `qJSXU` is assigned to the dependency telemetry and pageView's id is used as `operation_ParentId`. In turn server request uses ajax's id as `operation_ParentId`, etc.

| itemType   | name                      | id           | operation_ParentId | operation_Id |
|------------|---------------------------|--------------|--------------------|--------------|
| pageView   | Stock page                |              | STYz               | STYz         |
| dependency | GET /Home/Stock           | qJSXU        | STYz               | STYz         |
| request    | GET Home/Stock            | KqKwlrSt9PA= | qJSXU              | STYz         |
| dependency | GET /api/stock/value      | bBrf2L7mm2g= | KqKwlrSt9PA=       | STYz         |

Now when the call `GET /api/stock/value` made to an external service you want to know the identity of that server. So you can set `dependency.target` field appropriately. When the external service does not support monitoring - `target` is set to the host name of the service like `stock-prices-api.com`. However if that service identifies itself by returning a predefined HTTP header - `target` contains the service identity that allows Application Insights to build distributed trace by querying telemetry from that service. 

## Correlation headers

We are working on RFC proposal for the [correlation HTTP protocol](https://github.com/lmolkova/correlation/blob/master/http_protocol_proposal_v1.md). This proposal defines two headers:

- `Request-Id` carry the globally unique id of the call
- `Correlation-Context` - carry the name value pairs collection of the distributed trace properties

The standard also defines two schemas of `Request-Id` generation - flat and hierarchical. With the flat schema, there is a well-known `Id` key defined for the `Correlation-Context` collection.

Application Insights defines the [extension](https://github.com/lmolkova/correlation/blob/master/http_protocol_proposal_v2.md) for the correlation HTTP protocol. It uses `Request-Context` name value pairs to propagate the collection of properties used by the immediate caller or callee. Application Insights SDK uses this header to set `dependency.target` and `request.source` fields.

### W3C Distributed Tracing

We are transitioning to (W3C Distributed tracing format)[https://w3c.github.io/distributed-tracing/report-trace-context.html]. It defines:
- `traceparent` - carries globally unique operation id and unique identifier of the call
- `tracestate` - carries tracing system specific context.

#### Enable W3C distributed tracing support for ASP.NET Classic apps

This feature is available in Microsoft.ApplicationInsights.Web and Microsoft.ApplicationInsights.DependencyCollector packages starting with version 2.8.0-beta1.
It is **off** by default, to enable it, change `ApplicationInsights.config`:

* under `RequestTrackingTelemetryModule` add `EnableW3CHeadersExtraction` element with value set to `true`
* under `DependencyTrackingTelemetryModule` add `EnableW3CHeadersInjection` element with value set to `true`

#### Enable W3C distributed tracing support for ASP.NET Core apps

This feature is in Microsoft.ApplicationInsights.AspNetCore with version 2.5.0-beta1 and Microsoft.ApplicationInsights.DependencyCollector version 2.8.0-beta1.
It is **off** by default, to enable it set `ApplicationInsightsServiceOptions.RequestCollectionOptions.EnableW3CDistributedTracing` to `true`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry(o => 
        o.RequestCollectionOptions.EnableW3CDistributedTracing = true );
    // ....
}
```

## Open tracing and Application Insights

The [Open Tracing data model specification](http://opentracing.io/) and Application Insights data models map in the following way:

| Application Insights               	| Open Tracing                                    	|
|------------------------------------	|-------------------------------------------------	|
| `Request`, `PageView`              	| `Span` with `span.kind = server`                	|
| `Dependency`                       	| `Span` with `span.kind = client`                	|
| `Id` of `Request` and `Dependency` 	| `SpanId`                                        	|
| `Operation_Id`                     	| `TraceId`                                       	|
| `Operation_ParentId`               	| `Reference` of type `ChildOf` (the parent span) 	|

For more information on the Application Insights data model, see [data model](application-insights-data-model.md). 

See the Open Tracing [specification](https://github.com/opentracing/specification/blob/master/specification.md) and [semantic_conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md) for definitions of Open Tracing concepts.


## Telemetry correlation in .NET

Over time .NET defined number of ways to correlate telemetry and diagnostics logs. There is `System.Diagnostics.CorrelationManager` allowing to track [LogicalOperationStack and ActivityId](https://msdn.microsoft.com/library/system.diagnostics.correlationmanager.aspx). `System.Diagnostics.Tracing.EventSource` and Windows ETW define the method [SetCurrentThreadActivityId](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource.setcurrentthreadactivityid.aspx). `ILogger` uses [Log Scopes](https://docs.microsoft.com/aspnet/core/fundamentals/logging#log-scopes). WCF and Http wire up "current" context propagation.

However those methods didn't enable automatic distributed tracing support. `DiagnosticsSource` is a way to support automatic cross machine correlation. .NET libraries support Diagnostics Source and allow automatic cross machine propagation of the correlation context via the transport like http.

The [guide to Activities](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) in Diagnostics Source explains the basics of tracking Activities. 

ASP.NET Core 2.0 supports extraction of Http Headers and starting the new Activity. 

`System.Net.HttpClient` starting version `4.1.0` supports automatic injection of the correlation Http Headers and tracking the http call as an Activity.

There is a new Http Module [Microsoft.AspNet.TelemetryCorrelation](https://www.nuget.org/packages/Microsoft.AspNet.TelemetryCorrelation/) for the ASP.NET Classic. This module implements telemetry correlation using DiagnosticsSource. It starts activity based on incoming request headers. It also correlates telemetry from the different stages of request processing. Even for the cases when every stage of IIS processing runs on a different manage threads.

Application Insights SDK starting version `2.4.0-beta1` uses DiagnosticsSource and Activity to collect telemetry and associate it with the current activity. 

<a name="java-correlation"></a>
## Telemetry correlation in the Java SDK
The [Application Insights Java SDK](app-insights-java-get-started.md) supports automatic correlation of telemetry beginning with version `2.0.0`. It automatically populates `operation_id` for all telemetry (traces, exceptions, custom events, etc) issued within the scope of a request. It also takes care of propagating the correlation headers (described above) for service to service calls via HTTP if the [Java SDK agent](app-insights-java-agent.md) is configured. Note: only calls made via Apache HTTP Client are supported for the correlation feature. If you're using Spring Rest Template or Feign, both can be used with Apache HTTP Client under the hood.

Currently, automatic context propagation across messaging technologies (e.g. Kafka, RabbitMQ, Azure Service Bus) is not supported. It is possible, however to manually code such scenarios by using the `trackDependency` and `trackRequest` API's, whereby a dependency telemetry represents a message being enqueued by a producer and the request represents a message being processed by a consumer. In this case, both `operation_id` and `operation_parentId` should be propagated in the message's properties.

<a name="java-role-name"></a>
### Role Name
At times, you might want to customize the way component names are displayed in the [Application Map](app-insights-app-map.md). To do so, you can manually set the `cloud_roleName` by doing one of the following:

Via a telemetry initializer (all telemetry items are tagged)
```Java
public class CloudRoleNameInitializer extends WebTelemetryInitializerBase {

    @Override
    protected void onInitializeTelemetry(Telemetry telemetry) {
        telemetry.getContext().getTags().put(ContextTagKeys.getKeys().getDeviceRoleName(), "My Component Name");
    }
  }
```
Via the [device context class](https://docs.microsoft.com/et-ee/java/api/com.microsoft.applicationinsights.extensibility.context._device_context) (only this telemetry item is tagged)
```Java
telemetry.getContext().getDevice().setRoleName("My Component Name");
```

## Next steps

- [Write custom telemetry](app-insights-api-custom-events-metrics.md)
- Onboard all components of your micro service on Application Insights. Check out [supported platforms](app-insights-platforms.md).
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Learn how to [extend and filter telemetry](app-insights-api-filtering-sampling.md).
- [Application Insights config reference](app-insights-configuration-with-applicationinsights-config.md)

