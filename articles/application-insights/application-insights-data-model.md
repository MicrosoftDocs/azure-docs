---
title: Azure Application Insights Telemetry Data Model | Microsoft Docs
description: Application Insights data model overview
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov-ms

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Application Insights telemetry data model

Application Insights defines the telemetry data model for Application Performance Management (APM). This model standardizes the data collection and enables creating platform and language-independent monitoring scenarios. Data collected by Application Insights models the typical application execution pattern:

![Application Insights Application Model](./media/application-insights-data-model/application-insights-data-model.png)

There are two types of applications — applications with an endpoint that receive external ***requests*** - Web Applications, and applications that periodically "wake up" to process data stored somewhere - WebJobs or Functions. In both cases, we call unique execution an ***operation***. Operation succeeds or fails through ***exception*** or it might depend on other services/storage to carry its business logic. To reflect these concepts, Application Insights data model defines three telemetry types: [request](./application-insights-data-model-request-telemetry.md), [exception](/application-insights-data-model-exception-telemetry.md), and [dependency](/application-insights-data-model-dependency-telemetry.md).

Typically, these types are defined by the application framework and are automatically collected by the SDK. `ASP.NET MVC` defines the notion of a request execution in its model-view-controller plumbing - marks the start and stop of a request. Dependency calls to SQL are defined by `System.Data`. Calls to HTTP endpoints are defined by `System.Net`. You can extend telemetry types collected by specific platform and framework using custom properties and measurements. However, there are cases when you want to report custom telemetry. You might want to implement diagnostics logging using a familiar-to-you instrumentation framework, such as `Log4Net` or `System.Diagnostics`. Or you might need to capture user interaction with your service to analyze usage patterns. Application Insights recognizes three additional data types: [trace](/application-insights-data-model-trace-telemetry.md), [event](/application-insights-data-model-event-telemetry.md), and [metric](/application-insights-data-model-metric-telemetry.md) to model these scenarios.

Application Insights telemetry model defines the way to [correlate](/correlation.md) telemetry to the operation of which it’s a part. For example, a request can make a SQL Database calls and recorded diagnostics info. You can set the correlation context for those telemetry items that will tight it back to the request telemetry.

## Schema improvements

Application Insights data model is a simple and basic yet powerful way to model your application telemetry. We strive to keep the model simple and slim to support essential scenarios and allow to extend the schema for advanced use.

To report data model or schema problems and suggestions use GitHub [ApplicationInsights-Home](https://github.com/Microsoft/ApplicationInsights-Home/labels/schema) repository.

## Next steps

- Check out [platforms](/app-insights-platforms.md) supported by Application Insights.
- Learn how to [extend and filter telemetry](/app-insights-api-filtering-sampling.md).
- Use [sampling](/app-insights-sampling.md) to minimize amount of telemetry based on data model.
