---
title: Release Notes for Azure web app extension - Application Insights
description: Releases notes for Azure Web Apps Extension for runtime instrumentation with Application Insights.
ms.topic: conceptual
ms.date: 06/26/2020
ms.reviewer: rajrang
---

# Release notes for Azure Web App extension for Application Insights

This article contains the releases notes for Azure Web Apps Extension for runtime instrumentation with Application Insights. This is applicable only for pre-installed extensions.

Learn more about [Azure Web App Extension for Application Insights](azure-web-apps.md)).

## Frequently asked questions

- How to find which version of the extension I am currently on?
    - Go to `https://<yoursitename>.scm.azurewebsites.net/ApplicationInsights`. Visit the step by step troubleshooting guide for extension/agent based monitoring for [ASP.NET Core](./azure-web-apps-net-core.md#troubleshooting), [ASP.NET](./azure-web-apps-net.md#troubleshooting), [Java](./azure-web-apps-java.md#troubleshooting), or [Node.js](./azure-web-apps-nodejs.md#troubleshooting) ) for more information.

- What if I'm using private extensions?
    - Uninstall private site extensions since it's no longer supported.

## Release notes

### 2.8.44

- .NET/.NET Core: Upgraded to [ApplicationInsights .NET SDK to 2.20.1-redfield](https://github.com/microsoft/ApplicationInsights-dotnet/tree/autoinstrumentation/2.20.1).

### 2.8.43

- Separate .NET/.NET Core, Java and Node.js package into different App Service Windows Site Extension. 

### 2.8.42

- JAVA extension: Upgraded to [Java Agent 3.2.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.2.0) from 2.5.1.
- Node.js extension: Updated AI SDK to [2.1.8](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.8) from 2.1.7. Added support for User and System assigned AAD Managed Identities.
- .NET Core: Added self-contained deployments and .NET 6.0 support using [.NET Startup Hook](https://github.com/dotnet/runtime/blob/main/docs/design/features/host-startup-hook.md).

### 2.8.41

- Node.js extension: Updated AI SDK to [2.1.7](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.7) from 2.1.3.
- .NET Core: Removed out-of-support version (2.1). Supported versions are 3.1 and 5.0.

### 2.8.40

- JAVA extension: Upgraded to [Java Agent 3.1.1 (GA)](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.1.1) from 3.0.2.
- Node.js extension: Updated AI SDK to [2.1.3](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/2.1.3) from 1.8.8.

### 2.8.39

- .NET Core: Added .NET Core 5.0 support.

### 2.8.38

- JAVA extension: upgraded to [Java Agent 3.0.2 (GA)](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.0.2) from 2.5.1.
- Node.js extension: Updated AI SDK to [1.8.8](https://github.com/microsoft/ApplicationInsights-node.js/releases/tag/1.8.8) from 1.8.7.
- .NET Core: Removed out-of-support versions (2.0, 2.2, 3.0). Supported versions are 2.1 and 3.1.

### 2.8.37

- AppSvc Windows extension: Made .NET Core work with any version of System.Diagnostics.DiagnosticSource.dll.

### 2.8.36

- AppSvc Windows extension: Enabled Inter-op with AI SDK in .NET Core.

### 2.8.35

- AppSvc Windows extension: Added .NET Core 3.1 support.

### 2.8.33

- .NET, .NET core, Java, and Node.js agents and the Windows Extension: Support for sovereign clouds. Connections strings can be used to send data to sovereign clouds.

### 2.8.31

- ASP.NET Core agent: Fixed issue related to one of the updated Application Insights SDK's references (see known issues for 2.8.26). If the incorrect version of `System.Diagnostics.DiagnosticSource.dll` is already loaded by runtime, the codeless extension now won't crash the application and backs off. For customers affected by that issue, it's advised to remove the `System.Diagnostics.DiagnosticSource.dll` from the bin folder or use the older version of the extension by setting "ApplicationInsightsAgent_EXTENSIONVERSION=2.8.24"; otherwise, application monitoring isn't enabled.

### 2.8.26

- ASP.NET Core agent: Fixed issue related to updated Application Insights SDK. The agent won't try to load `AiHostingStartup` if the ApplicationInsights.dll is already present in the bin folder. This resolves issues related to reflection via Assembly\<AiHostingStartup\>.GetTypes().
- Known issues: Exception `System.IO.FileLoadException: Could not load file or assembly 'System.Diagnostics.DiagnosticSource, Version=4.0.4.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51'` could be thrown if another version of `DiagnosticSource` dll is loaded. This could happen, for example, if `System.Diagnostics.DiagnosticSource.dll` is present in the publish folder. As mitigation, use the previous version of extension by setting app settings in app services: ApplicationInsightsAgent_EXTENSIONVERSION=2.8.24.

### 2.8.24

- Repackaged version of 2.8.21.

### 2.8.23

- Added ASP.NET Core 3.0 codeless monitoring support.
- Updated ASP.NET Core SDK to [2.8.0](https://github.com/microsoft/ApplicationInsights-aspnetcore/releases/tag/2.8.0) for runtime versions 2.1, 2.2 and 3.0. Apps targeting .NET Core 2.0 continue to use 2.1.1 of the SDK.

### 2.8.14

- Updated ASP.NET Core SDK version from 2.3.0 to the latest (2.6.1) for apps targeting .NET Core 2.1, 2.2. Apps targeting .NET Core 2.0 continue to use 2.1.1 of the SDK.

### 2.8.12

- Support for ASP.NET Core 2.2 apps.
- Fixed a bug in ASP.NET Core extension causing injection of SDK even when the application is already instrumented with the SDK. For 2.1 and 2.2 apps, the presence of ApplicationInsights.dll in the application folder now causes the extension to back off. For 2.0 apps, the extension backs off only if ApplicationInsights is enabled with a `UseApplicationInsights()` call.

- Permanent fix for incomplete HTML response for ASP.NET Core apps. This fix is now extended to work for .NET Core 2.2 apps.

- Added support to turn off JavaScript injection for ASP.NET Core apps (`APPINSIGHTS_JAVASCRIPT_ENABLED=false appsetting`). For ASP.NET core, the JavaScript injection is in "Opt-Out" mode by default, unless explicitly turned off. (The default setting is done to retain current behavior.)

- Fixed ASP.NET Core extension bug that caused injection even if ikey was not present.
- Fixed a bug in the SDK version prefix logic that caused an incorrect SDK version in telemetry.

- Added SDK version prefix for ASP.NET Core apps to identify how telemetry was collected.
- Fixed SCM- ApplicationInsights page to correctly show the version of the pre-installed extension.

### 2.8.10

- Fix for incomplete HTML response for ASP.NET Core apps.

## Next steps

- Visit the [Application Monitoring for Azure App Service documentation](azure-web-apps.md) for more information on how to configuring monitoring for Azure App Services. 
