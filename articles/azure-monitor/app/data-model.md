---
title: Application Insights telemetry data model | Microsoft Docs
description: This article presents an overview of the Application Insights telemetry data model.
services: application-insights
documentationcenter: .net
manager: carmonm
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/14/2019
ms.reviewer: mmcc
---
# Application Insights telemetry data model

[Application Insights](./app-insights-overview.md) sends telemetry from your web application to the Azure portal so that you can analyze the performance and usage of your application. The telemetry model is standardized, so it's possible to create platform and language-independent monitoring.

Data collected by Application Insights models this typical application execution pattern.

![Diagram that shows an Application Insights telemetry data model.](./media/data-model/application-insights-data-model.png)

The following types of telemetry are used to monitor the execution of your app. Three types are automatically collected by the Application Insights SDK from the web application framework:

* [Request](data-model-request-telemetry.md): Generated to log a request received by your app. For example, the Application Insights web SDK automatically generates a Request telemetry item for each HTTP request that your web app receives.

    An *operation* is made up of the threads of execution that process a request. You can also [write code](./api-custom-events-metrics.md#trackrequest) to monitor other types of operation, such as a "wake up" in a web job or function that periodically processes data. Each operation has an ID. The ID can be used to [group](./correlation.md) all telemetry generated while your app is processing the request. Each operation either succeeds or fails and has a duration of time.
* [Exception](data-model-exception-telemetry.md): Typically represents an exception that causes an operation to fail.
* [Dependency](data-model-dependency-telemetry.md): Represents a call from your app to an external service or storage, such as a REST API or SQL. In ASP.NET, dependency calls to SQL are defined by `System.Data`. Calls to HTTP endpoints are defined by `System.Net`.

Application Insights provides three data types for custom telemetry:

* [Trace](data-model-trace-telemetry.md): Used either directly or through an adapter to implement diagnostics logging by using an instrumentation framework that's familiar to you, such as `Log4Net` or `System.Diagnostics`.
* [Event](data-model-event-telemetry.md): Typically used to capture user interaction with your service to analyze usage patterns.
* [Metric](data-model-metric-telemetry.md): Used to report periodic scalar measurements.

Every telemetry item can define the [context information](data-model-context.md) like application version or user session ID. Context is a set of strongly typed fields that unblocks certain scenarios. When application version is properly initialized, Application Insights can detect new patterns in application behavior correlated with redeployment.

You can use session ID to calculate an outage or an issue impact on users. Calculating the distinct count of session ID values for a specific failed dependency, error trace, or critical exception gives you a good understanding of an impact.

The Application Insights telemetry model defines a way to [correlate](./correlation.md) telemetry to the operation of which it's a part. For example, a request can make a SQL Database call and record diagnostics information. You can set the correlation context for those telemetry items that tie it back to the request telemetry.

## Schema improvements

The Application Insights data model is a basic yet powerful way to model your application telemetry. We strive to keep the model simple and slim to support essential scenarios and allow the schema to be extended for advanced use.

To report data model or schema problems and suggestions, use our [GitHub repository](https://github.com/microsoft/ApplicationInsights-dotnet/issues/new/choose).

## Next steps

- [Write custom telemetry](./api-custom-events-metrics.md).
- Learn how to [extend and filter telemetry](./api-filtering-sampling.md).
- Use [sampling](./sampling.md) to minimize the amount of telemetry based on data model.
- Check out [platforms](./platforms.md) supported by Application Insights.
