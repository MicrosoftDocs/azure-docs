---
title: Application Insights Telemetry Data Model | Microsoft Docs
description: Application Insights data model overview
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

Application Insights defines the telemetry data model for Application Performance Management (APM) that standardize the data collection.  and enables to define platform and language independent monitoring scenarios. Data collected by Application Insights models the typical application execution pattern:

![Application Insights Application Model](./media/application-insights-data-model/application-insights-data-model.png)

There are two types of applications — applications with an endpoint that receive external ***requests*** - Web Applications, and applications that periodically "wake up" to process data stored somewhere - WebJobs or Functions. In both cases, we'll call unique execution an ***operation***. Operation succeeds or fails through ***exception*** or it might depend on other services/storage to carry its business logic. To reflect these concepts, Application Insights data model defines three telemetry types: [request](./data-model-request-telemetry), [exception](/data-model-exception-telemetry) and [dependency](/data-model-dependency-telemetry).

Typically, these types are defined by the application framework and are automatically collected by the SDK. For example, `ASP.NET MVC` defines the notion of a request execution in its model-view-controller plumbing – it defines when request starts and stops, dependency calls to SQL are defined by `System.Data`, and calls to HTTP endpoints are defined by `System.Net`. You can extend telemetry types collected by specific platform and framework using custom properties and measurements. However there are cases when you want to report custom telemetry. For example, you might want to implement diagnostics logging using a familiar-to-you instrumentation framework, such as `Log4Net` or `System.Diagnostics`, or you might want to capture user interaction with your service to analyze usage patterns. Application Insights recognizes three additional data types [Trace](/data-model-trace-telemetry), [Event](/data-model-event-telemetry) and [Metric](/data-model-metric-telemetry)

Application Insights telemetry model allows to correlate telemetry to the operation of which it’s a part. For example, if while processing a request you make some SQL Database calls and recorded diagnostics info, you can correlate those telemetry items by setting correlation context property. 

# Availability monitoring

This section is work in progress...

# Client-side and usage telemetry

This section is work in progress...

# Schema usage example

This section is work in progress...

# Schema improvements

Application Insights data model is a simple and basic yet powerful way to model your application telemetry. We strive to keep the model simple and slim to support essential scenarios and allow to extend the schema for advanced use.

To report data model or schema problems and suggestions use GitHub [ApplicationInsights-Home](https://github.com/Microsoft/ApplicationInsights-Home/labels/schema) repository.