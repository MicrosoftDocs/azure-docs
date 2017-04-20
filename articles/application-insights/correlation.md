---
title: Application Insights Telemetry Correlation | Microsoft Docs
description: Application Insights telemetry correlation
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Overview

In the world of micro services every logical operation may require work done in various component of the service. UI component will communicate with authentication provider component to validate user credentials and API component to get data for visualization. API component in its turn can query data from other services and use cache-provider components and notify the billing component about this call. Application Insights supports distributed telemetry correlation. It allows to detect which component is responsible for UI failure or performance degradation.

This article explains the data model Application Insights uses, context propagation techniques via transport layers and implementation of the correlation concepts on different languages and platforms.

## Telemetry Correlation Data Model

Application Insights defines the [data model](/data-model) for distributes telemetry correlation. In order to associate telemetry with the logical operation - every telemetry item have the context field called `operation_Id`. This identifier will be shared by every telemetry item in the distributed trace. So even with the loss of telemetry from a single layer you still can associate telemetry reported by other components.

Distributed logical operation typically consists of a smaller operations - requests processed by one of the components. Those operations defined by [request telemetry](/data-model-request-telemetry). Every request telemetry has it's own `id` which uniquely globally identifies it. And all telemetry - traces, exceptions, etc. associated with this request should set the `operation_parentId` to the value of the request `id`.

Every outgoing operation like http call to another component represented by [dependency telemetry](/data-model-dependency-telemetry). Dependency telemetry also defines it's own `id` that is globally unique. This id will be used as an `operation_parentId` of the request telemetry initiated by this dependency call in the target component.

`operation_Id`, `operation_parentId` and `request.id` with `dependency.id` allows to build a view of a distributed logical operation and set the causality order of telemetry calls.

In micro services environment traces from components may go to the different storages. In case of Application Insights - every component may have it's own instrumentation key. In order to get telemetry for the logical operation you need to query data from every storage. When number of storages is huge you need to have a hint on where to look next.

Application Insights data model defines two fields - `request.source` and `dependency.target` to solve this problem. First field defines the component that initiated the request and second - which component returned the response of the dependency call.


## Example

Let's take an example of an application STOCK PRICES showing the current market price of a stock using the external API called STOCKS API. STOCK PRICES application have a page `Stock page` making an AJAX call `GET /Home/Stock` to the server that processes this AJAX call. In order to return result application queries STOCK API using http call `GET /api/stock/value`.

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

Now when the call `GET /api/stock/value` made to an external service you want to know the identity of that server. So application will expect that server to return an extra http header containing the service identity alongside the 

# Correlation headers


[Correlation HTTP protocol](https://github.com/lmolkova/correlation/blob/master/http_protocol_proposal_v1.md)

`Request-Context:` header


# Open tracing and Application Insights

[Open Tracing](http://opentracing.io/) and Application Insights data models looks 

`request`, `pageView` maps to **Span** with `span.kind = server`
`dependency` maps to **Span** with `span.kind = client`
`id` of a `request` and `dependency` maps to **Span.Id**
`operation_Id` maps to **TraceId**
`operation_ParentId` maps to **Reference** of type `ChileOf`

See [data model](/data-model) for Application Insights types and data model.

See [specification](https://github.com/opentracing/specification/blob/master/specification.md) and [semantic_conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md) for definitions of Open Tracing concepts.


# Telemetry correlation in .NET

Over time .NET defined number of ways to correlate telemetry and diagnostics logs. There are `System.Diagnostics.CorrelationManager` allowing to track [LogicalOperationStack and ActivityId](https://msdn.microsoft.com/en-us/library/system.diagnostics.correlationmanager.aspx), `System.Diagnostics.Tracing.EventSource` and Windows ETW with the method [SetCurrentThreadActivityId](https://msdn.microsoft.com/en-us/library/system.diagnostics.tracing.eventsource.setcurrentthreadactivityid.aspx), `ILogger` with the [Log Scopes](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging#log-scopes), WCF and Http "current" context propagation.

However those methods didn't enable automatic distributed tracing support. `DiagnosticsSource` is a way to support automatic cross machine correlation. .NET libraries supports Diagnostics Source and allow automatic cross machine propagation of the correlation context via the transport like http.

The [guide to Activities](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) in Diagnostics Source explains the basics of tracking Activities. 

ASP.NET Core 2.0 supports extraction of Http Headers and starting the new Activity. 

`System.Net.HttpClient` starting version `<fill in>` supports automatic injection of the correlation Http Headers and tracking the http call as an Activity.

ASP.NET Classic applications provides the Http Module [Microsoft.AspNet.TelemetryCorrelation](https://www.nuget.org/packages/Microsoft.AspNet.TelemetryCorrelation/) that implements telemetry correlation using DiagnosticsSource. It will start activity based on incoming request headers, allow to correlate telemetry even for the cases when processing of a different http events happened on the different manage threads and will stop activity when request ends.

Application Insights SDK starting version `2.4.0-beta1` uses DiagnosticsSource and Activity to collect telemetry and associate it with the current activity. 