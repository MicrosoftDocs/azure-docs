---
title: Monitor Azure App Service performance | Microsoft Docs
description: Application performance monitoring for Azure App Service. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/05/2021
ms.custom: "devx-track-js, devx-track-dotnet"
---

# Application monitoring for Azure App Service overview

It's now easier than ever to enable monitoring on your web applications based on ASP.NET, ASP.NET Core, Java, and Node.js running on [Azure App Service](../../app-service/index.yml). Previously, you needed to manually instrument your app, but the latest extension/agent is now built into the App Service image by default.

## Enable Application Insights

There are two ways to enable monitoring for applications hosted on App Service:

- **Auto-instrumentation application monitoring** (ApplicationInsightsAgent).

  This method is the easiest to enable, and no code change or advanced configurations are required. It's often referred to as "runtime" monitoring. For App Service, we recommend that at a minimum you enable this level of monitoring. Based on your specific scenario, you can evaluate whether more advanced monitoring through manual instrumentation is needed.

  The following platforms are supported for auto-instrumentation monitoring:

  - [.NET Core](./azure-web-apps-net-core.md)
  - [.NET](./azure-web-apps-net.md)
  - [Java](./azure-web-apps-java.md)
  - [Node.js](./azure-web-apps-nodejs.md)

* **Manually instrumenting the application through code** by installing the Application Insights SDK.

  This approach is much more customizable, but it requires the following approaches: SDK for [.NET Core](./asp-net-core.md), [.NET](./asp-net.md), [Node.js](./nodejs.md), [Python](./opencensus-python.md), and a standalone agent for [Java](./java-in-process-agent.md). This method also means you must manage the updates to the latest version of the packages yourself.
  
  If you need to make custom API calls to track events/dependencies not captured by default with auto-instrumentation monitoring, you'll need to use this method. To learn more, see [Application Insights API for custom events and metrics](./api-custom-events-metrics.md).

If both auto-instrumentation monitoring and manual SDK-based instrumentation are detected, in .NET only the manual instrumentation settings will be honored, while in Java only the auto-instrumentation will be emitting the telemetry. This practice is to prevent duplicate data from being sent.

> [!NOTE]
> Snapshot Debugger and Profiler are only available in .NET and .NET Core.

## Next steps

Learn how to enable auto-instrumentation application monitoring for your [.NET Core](./azure-web-apps-net-core.md), [.NET](./azure-web-apps-net.md), [Java](./azure-web-apps-java.md), or [Nodejs](./azure-web-apps-nodejs.md) application running on App Service.
