---
title: Azure Service Fabric Application Level Monitoring | Microsoft Docs
description: Learn about application and service level events and logs used to monitor and diagnose Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/21/2018
ms.author: srrengar

---

# Application logging

Instrumenting your code is not only a way to gain insights about your users, but also the only way you can know whether something is wrong in your application, and to diagnose what needs to be fixed. Although technically it's possible to connect a debugger to a production service, it's not a common practice. So, having detailed instrumentation data is important.

Some products automatically instrument your code. Although these solutions can work well, manual instrumentation is almost always required to be specific to your business logic. In the end, you must have enough information to forensically debug the application. Service Fabric applications can be instrumented with any logging framework. This document describes a few different approaches to instrumenting your code, and when to choose one approach over another. 

For examples on how to use these suggestions, see [Add logging to your Service Fabric application](service-fabric-how-to-diagnostics-log.md).

## Application Insights SDK

Application Insights has a rich integration with Service Fabric out of the box. Users can add the AI Service Fabric nuget packages and receive data and logs created and collected viewable in the Azure portal. Additionally, users are encouraged to add their own telemetry in order to diagnose and debug their applications and track which services and parts of their application are used the most. The [TelemetryClient](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.telemetryclient?view=azure-dotnet) class in the SDK provides many ways to track telemetry in your applications. Check out an example of how to instrument and add application insights to your application in our tutorial for [monitoring and diagnosing a .NET application](service-fabric-tutorial-monitoring-aspnet.md)

## EventSource

When you create a Service Fabric solution from a template in Visual Studio, an **EventSource**-derived class (**ServiceEventSource** or **ActorEventSource**) is generated. A template is created, in which you can add events for your application or service. The **EventSource** name **must** be unique, and should be renamed from the default template string MyCompany-&lt;solution&gt;-&lt;project&gt;. Having multiple **EventSource** definitions that use the same name causes an issue at run time. Each defined event must have a unique identifier. If an identifier is not unique, a runtime failure occurs. Some organizations preassign ranges of values for identifiers to avoid conflicts between separate development teams. For more information, see [Vance's blog](https://blogs.msdn.microsoft.com/vancem/2012/07/09/introduction-tutorial-logging-etw-events-in-c-system-diagnostics-tracing-eventsource/) or the [MSDN documentation](https://msdn.microsoft.com/library/dn774985(v=pandp.20).aspx).

## ASP.NET Core logging

It's important to carefully plan how you will instrument your code. The right instrumentation plan can help you avoid potentially destabilizing your code base, and then needing to reinstrument the code. To reduce risk, you can choose an instrumentation library like [Microsoft.Extensions.Logging](https://www.nuget.org/packages/Microsoft.Extensions.Logging/), which is part of Microsoft ASP.NET Core. ASP.NET Core has an [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger) interface that you can use with the provider of your choice, while minimizing the effect on existing code. You can use the code in ASP.NET Core on Windows and Linux, and in the full .NET Framework, so your instrumentation code is standardized.

## Next steps

Once you have chosen your logging provider to instrument your applications and services, your logs and events need to be aggregated before they can be sent to any analysis platform. Read about [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) and [EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md) to better understand some of the Azure Monitor recommended options.
