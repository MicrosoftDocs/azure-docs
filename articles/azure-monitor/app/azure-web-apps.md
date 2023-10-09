---
title: Monitor Azure App Service performance | Microsoft Docs
description: Application performance monitoring for Azure App Service. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/11/2023
ms.custom:
---

# Application monitoring for Azure App Service overview

It's now easier than ever to enable monitoring on your web applications based on ASP.NET, ASP.NET Core, Java, and Node.js running on [Azure App Service](../../app-service/index.yml). Previously, you needed to manually instrument your app, but the latest extension/agent is now built into the App Service image by default.

## Enable Application Insights

There are two ways to enable monitoring for applications hosted on App Service:

- **Autoinstrumentation application monitoring** (ApplicationInsightsAgent).

  This method is the easiest to enable, and no code change or advanced configurations are required. It's often referred to as "runtime" monitoring. For App Service, we recommend that at a minimum you enable this level of monitoring. Based on your specific scenario, you can evaluate whether more advanced monitoring through manual instrumentation is needed.

  When you enable auto-instrumentation it enables Application Insights with a default setting (it includes sampling as well). Even if you set in Azure AppInsights: Sampling: **All Data 100%** this setting will be ignored.

  For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

  The following platforms are supported for autoinstrumentation monitoring:

  - [.NET Core](./azure-web-apps-net-core.md)
  - [.NET](./azure-web-apps-net.md)
  - [Java](./azure-web-apps-java.md)
  - [Node.js](./azure-web-apps-nodejs.md)

* **Manually instrumenting the application through code** by installing the Application Insights SDK.

  This approach is much more customizable, but it requires the following approaches: SDK for [.NET Core](./asp-net-core.md), [.NET](./asp-net.md), [Node.js](./nodejs.md), [Python](/previous-versions/azure/azure-monitor/app/opencensus-python), and a standalone agent for [Java](./opentelemetry-enable.md?tabs=java). This method also means you must manage the updates to the latest version of the packages yourself.
  
  If you need to make custom API calls to track events/dependencies not captured by default with autoinstrumentation monitoring, you need to use this method. To learn more, see [Application Insights API for custom events and metrics](./api-custom-events-metrics.md).

If both autoinstrumentation monitoring and manual SDK-based instrumentation are detected, in .NET only the manual instrumentation settings are honored, while in Java only the autoinstrumentation are emitting the telemetry. This practice is to prevent duplicate data from being sent.

> [!NOTE]
> Snapshot Debugger and Profiler are only available in .NET and .NET Core.

## Release notes

This section contains the release notes for Azure Web Apps Extension for runtime instrumentation with Application Insights.

To find which version of the extension you're currently using, go to `https://<yoursitename>.scm.azurewebsites.net/ApplicationInsights`.

### Release notes

#### 2.8.44

- .NET/.NET Core: Upgraded to [ApplicationInsights .NET SDK to 2.20.1](https://github.com/microsoft/ApplicationInsights-dotnet/tree/autoinstrumentation/2.20.1).

#### 2.8.43

- Separate .NET/.NET Core, Java and Node.js package into different App Service Windows Site Extension. 

#### 2.8.42

- JAVA extension: Upgraded to [Java Agent 3.2.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.2.0) from 2.5.1.
- Node.js extension: Updated AI SDK to [2.1.8](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.8) from 2.1.7. Added support for User and System assigned Azure AD Managed Identities.
- .NET Core: Added self-contained deployments and .NET 6.0 support using [.NET Startup Hook](https://github.com/dotnet/runtime/blob/main/docs/design/features/host-startup-hook.md).

#### 2.8.41

- Node.js extension: Updated AI SDK to [2.1.7](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.7) from 2.1.3.
- .NET Core: Removed out-of-support version (2.1). Supported versions are 3.1 and 5.0.

#### 2.8.40

- JAVA extension: Upgraded to [Java Agent 3.1.1 (GA)](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.1.1) from 3.0.2.
- Node.js extension: Updated AI SDK to [2.1.3](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.3) from 1.8.8.

#### 2.8.39

- .NET Core: Added .NET Core 5.0 support.

#### 2.8.38

- JAVA extension: upgraded to [Java Agent 3.0.2 (GA)](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.0.2) from 2.5.1.
- Node.js extension: Updated AI SDK to [1.8.8](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/1.8.8) from 1.8.7.
- .NET Core: Removed out-of-support versions (2.0, 2.2, 3.0). Supported versions are 2.1 and 3.1.

#### 2.8.37

- AppSvc Windows extension: Made .NET Core work with any version of System.Diagnostics.DiagnosticSource.dll.

#### 2.8.36

- AppSvc Windows extension: Enabled Inter-op with AI SDK in .NET Core.

#### 2.8.35

- AppSvc Windows extension: Added .NET Core 3.1 support.

#### 2.8.33

- .NET, .NET core, Java, and Node.js agents and the Windows Extension: Support for sovereign clouds. Connections strings can be used to send data to sovereign clouds.

#### 2.8.31

- The ASP.NET Core agent fixed an issue with the Application Insights SDK. If the runtime loaded the incorrect version of `System.Diagnostics.DiagnosticSource.dll`, the codeless extension doesn't crash the application and backs off. To fix the issue, customers should remove `System.Diagnostics.DiagnosticSource.dll` from the bin folder or use the older version of the extension by setting `ApplicationInsightsAgent_EXTENSIONVERSION=2.8.24`. If they don't, application monitoring isn't enabled.

#### 2.8.26

- ASP.NET Core agent: Fixed issue related to updated Application Insights SDK. The agent doesn't try to load `AiHostingStartup` if the ApplicationInsights.dll is already present in the bin folder. It resolves issues related to reflection via Assembly\<AiHostingStartup\>.GetTypes().
- Known issues: Exception `System.IO.FileLoadException: Could not load file or assembly 'System.Diagnostics.DiagnosticSource, Version=4.0.4.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51'` could be thrown if another version of `DiagnosticSource` dll is loaded. It could happen, for example, if `System.Diagnostics.DiagnosticSource.dll` is present in the publish folder. As mitigation, use the previous version of extension by setting app settings in app services: ApplicationInsightsAgent_EXTENSIONVERSION=2.8.24.

#### 2.8.24

- Repackaged version of 2.8.21.

#### 2.8.23

- Added ASP.NET Core 3.0 codeless monitoring support.
- Updated ASP.NET Core SDK to [2.8.0](https://github.com/microsoft/ApplicationInsights-aspnetcore/releases/tag/2.8.0) for runtime versions 2.1, 2.2 and 3.0. Apps targeting .NET Core 2.0 continue to use 2.1.1 of the SDK.

#### 2.8.14

- Updated ASP.NET Core SDK version from 2.3.0 to the latest (2.6.1) for apps targeting .NET Core 2.1, 2.2. Apps targeting .NET Core 2.0 continue to use 2.1.1 of the SDK.

#### 2.8.12

- Support for ASP.NET Core 2.2 apps.
- Fixed a bug in ASP.NET Core extension causing injection of SDK even when the application is already instrumented with the SDK. For 2.1 and 2.2 apps, the presence of ApplicationInsights.dll in the application folder now causes the extension to back off. For 2.0 apps, the extension backs off only if ApplicationInsights is enabled with a `UseApplicationInsights()` call.

- Permanent fix for incomplete HTML response for ASP.NET Core apps. This fix is now extended to work for .NET Core 2.2 apps.

- Added support to turn off JavaScript injection for ASP.NET Core apps (`APPINSIGHTS_JAVASCRIPT_ENABLED=false appsetting`). For ASP.NET core, the JavaScript injection is in "Opt-Out" mode by default, unless explicitly turned off. (The default setting is done to retain current behavior.)

- Fixed ASP.NET Core extension bug that caused injection even if ikey wasn't present.
- Fixed a bug in the SDK version prefix logic that caused an incorrect SDK version in telemetry.

- Added SDK version prefix for ASP.NET Core apps to identify how telemetry was collected.
- Fixed SCM- ApplicationInsights page to correctly show the version of the pre-installed extension.

#### 2.8.10

- Fix for incomplete HTML response for ASP.NET Core apps.

## Frequently asked questions

This section provides answers to common questions.

### What does Application Insights modify in my project?

The details depend on the type of project. For a web application:
          
* Adds these files to your project:
  * ApplicationInsights.config
  * ai.js
* Installs these NuGet packages:
  * Application Insights API: The core API
  * Application Insights API for Web Applications: Used to send telemetry from the server
  * Application Insights API for JavaScript Applications: Used to send telemetry from the client
* The packages include these assemblies:
  * Microsoft.ApplicationInsights
  * Microsoft.ApplicationInsights.Platform
* Inserts items into:
  * Web.config
  * packages.config
* (For new projects only, you [add Application Insights to an existing project manually](./app-insights-overview.md).) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the main page *Views/Shared/\_Layout.cshtml*.
          

## Next steps

Learn how to enable autoinstrumentation application monitoring for your [.NET Core](./azure-web-apps-net-core.md), [.NET](./azure-web-apps-net.md), [Java](./azure-web-apps-java.md), or [Nodejs](./azure-web-apps-nodejs.md) application running on App Service.
