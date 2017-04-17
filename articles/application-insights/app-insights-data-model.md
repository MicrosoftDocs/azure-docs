---
title: Application Insights Telemetry Data Model | Microsoft Docs
description: Application Insights data model overview
services: application-insights
documentationcenter: ''
author: SergeyKanzhelev
manager: azakonov

ms.assetid: 47dc28a7-c172-44e6-9db3-5869ef81d2be
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Overview

Application Insights defines the telemetry data model for Application Performance Management (APM) that standardize data collection and enables to define platform and languange independant monitoring scenarios. Data that is collected by Application Insights models the typical application pattern.

    ![Application Insights Application Model](./media/app-insights-data-model/application-insights-data-model.png)

 There are two application models — applications with an endpoint that receive external ***requests***, typical for Web Applications, and applications that periodically "wake up" to process data stored somewhere, typical for WebJobs or Functions. In both cases, we’ll call unique execution an ***operation***. Operation succeeds or fails through ***exception*** or it might depend on other services/storage to carry its business logic. To reflect these concepts, Application Insights data model defines three telemetry types: [Request](#request-telemetry), [exception](#exception-telemetry) and [dependency](](#dependency-telemetry)).
 
 
 ***Refactor this:***

 For every one of these types, Telemetry Data Model defines fields used to construct common KPIs–name, duration, status code and correlation. It also lets you extend every type with the custom properties. Here are some typical fields for each of the event types: •  Request (operation id, name, URL, duration, status code, […]) •  Dependencies (parent operation id, name, duration, […]) •  Exception (parent operation id, exception class, call stack, […]) Typically, these types are defined by the application framework and are automatically collected by the SDK. For example, ASP.NET  MVC defines the notion of a request execution in its model- viewcontroller plumbing–it defines when request starts and stops,  dependency calls to SQL are defined by System.Data, and calls to HTTP endpoints are defined by System.Net. However, there are cases where you might need to expose telemetry unique to your application. For example, you might want to implement diagnostics logging using a familiar-to-you instrumentation framework, such as Log4Net or System.Diagnostics, or you might want to capture user interaction with your service to analyze usage patterns. Application Insights recognizes three additional data types to assist with such a need—Trace, Event and Metric: •  Trace (operation id, message, severity, […]) •  Metrics (operation id, name, value, […]) •  Event (operation id, name, user id, […]) In addition to data collection, Application Insights will automatically correlate all telemetry to the operation of which it’s a part. For example, if while processing a request application you make some SQL Database calls, Web Services calls and recorded diagnostics info, it all will be automatically correlated with request by placing a unique auto-generated operation id into the respective telemetry payload. The Application Insights SDK has a layered model where the previously stated telemetry types, extensibility points and data reduction algorithms are defined in the Application Insights API NuGet package (bit.ly/2n48klm). To focus discussion on core 
 principles, we’ll use this SDK to reduce the number of technology-specific data collection concepts as much as possible. 


# Request Telemetry

Request telemetry represents the code execution triggered externally and incapsulating the logical code execution. Every request execution is identified by unique `ID` and `url` containing all the execution parameters. You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or fail and has a certain `duration`. Both - success and failure executions may be grouped further by `resultCode`. Start time for the request telemetry defined on the envelope level.

Request telemetry supports the standard extensibility model using custom `properties` and `measurements`.

## Identity

### Name

[!INCLUDE [application-insights-data-model-request-name](../includes/application-insights-data-model-request-name.md)]

### ID

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-request-id.md)]

### Url

[!INCLUDE [application-insights-data-model-request-url](../includes/application-insights-data-model-request-url.md)]

### Source

[!INCLUDE [application-insights-data-model-request-source](../includes/application-insights-data-model-request-source.md)]

## Result

### Duration

[!INCLUDE [application-insights-data-model-request-duration](../includes/application-insights-data-model-request-duration.md)]

### Response code

[!INCLUDE [application-insights-data-model-request-responseCode](../includes/application-insights-data-model-request-responseCode.md)]

### Success

[!INCLUDE [application-insights-data-model-request-success](../includes/application-insights-data-model-request-success.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Dependency Telemetry

TBD

# Exception Telemetry

TBD