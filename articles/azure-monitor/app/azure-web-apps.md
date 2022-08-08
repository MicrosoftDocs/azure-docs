---
title: Monitor Azure app services performance | Microsoft Docs
description: Application performance monitoring for Azure app services. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/05/2021
ms.custom: "devx-track-js, devx-track-dotnet"
---

# Application Monitoring for Azure App Service Overview

Enabling monitoring on your ASP.NET, ASP.NET Core, Java, and Node.js based web applications running on [Azure App Services](../../app-service/index.yml) is now easier than ever. Whereas previously you needed to manually instrument your app, the latest extension/agent is now built into the App Service image by default. 

## Enable Application Insights

There are two ways to enable application monitoring for Azure App Services hosted applications:

- **Auto-instrumentation application monitoring** (ApplicationInsightsAgent). 
 
    - This method is the easiest to enable, and no code change or advanced configurations are required. It is often referred to as "runtime" monitoring. For Azure App Services we recommend at a minimum enabling this level of monitoring, and then based on your specific scenario you can evaluate whether more advanced monitoring through manual instrumentation is needed.

    - The following are supported for auto-instrumentation monitoring:
        - [.NET Core](./azure-web-apps-net-core.md)
        - [.NET](./azure-web-apps-net.md)
        - [Java](./azure-web-apps-java.md)
        - [Nodejs](./azure-web-apps-nodejs.md)
    
* **Manually instrumenting the application through code** by installing the Application Insights SDK.

    * This approach is much more customizable, but it requires the following approaches: SDK for [.NET Core](./asp-net-core.md), [.NET](./asp-net.md), [Node.js](./nodejs.md), [Python](./opencensus-python.md), and a standalone agent for [Java](./java-in-process-agent.md). This method, also means you have to manage the updates to the latest version of the packages yourself.

    * If you need to make custom API calls to track events/dependencies not captured by default with auto-instrumentation monitoring, you would need to use this method. Check out the [API for custom events and metrics article](./api-custom-events-metrics.md) to learn more. 

> [!NOTE]
> If both auto-instrumentation monitoring and manual SDK-based instrumentation are detected, in .NET only the manual instrumentation settings will be honored, while in Java only the auto-instrumentation will be emitting the telemetry. This is to prevent duplicate data from being sent.

> [!NOTE]
> Snapshot debugger and profiler are only available in .NET and .NET Core

## Next Steps
- Learn how to enable auto-instrumentation application monitoring for your [.NET Core](./azure-web-apps-net-core.md), [.NET](./azure-web-apps-net.md), [Java](./azure-web-apps-java.md) or [Nodejs](./azure-web-apps-nodejs.md) application running on App Service. 
