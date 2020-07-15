---
title: Release Notes for Azure web app extension - Application Insights
description: Releases notes for Azure Web Apps Extension for runtime instrumentation with Application Insights.
ms.topic: conceptual
author: MS-jgol
ms.author: jgol
ms.date: 06/26/2020

---

# Release notes for Azure Web App extension for Application Insights

This article contains the releases notes for Azure Web Apps Extension for runtime instrumentation with Application Insights. This is applicable only for pre-installed extensions.

[Learn](azure-web-apps.md) more about Azure Web App Extension for Application Insights.

## Frequently asked questions

- How to find which version of the extension I am currently on?
    - Go to `https://<yoursitename>.scm.azurewebsites.net/ApplicationInsights`. Visit [the step by step troubleshooting guide for extension/agent based monitoring](./azure-web-apps.md?tabs=net#troubleshooting) for more information.

- What if I'm using private extensions?
    - Uninstall private site extensions since it's no longer supported.

## Release notes

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

- Visit the [Azure App Service documentation](azure-web-apps.md) for more information on how to configuring monitoring for Azure App Services. 
