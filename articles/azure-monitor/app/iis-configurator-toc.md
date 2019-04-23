---
title: IIS Configurator | Microsoft Docs
description: Monitor a website's performance without re-deploying it. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
services: application-insights
documentationcenter: .net
author: tilee
manager: alexklim
ms.assetid: 769a5ea4-a8c6-4c18-b46c-657e864e24de
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: tilee
---
# Application Insights IISConfigurator

IISConfigurator is a PowerShell Module published to the [PowerShellGallery](https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator) 
and is the replacement for [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now). 
This provides code-less instrumentation of .NET web applications hosted on-prem. 
Once your application is instrumented, your telemetry will be sent to the Azure Portal where you can [monitor](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) your application.

## Disclaimer
This is a prototype application. 
We do not recommend using this on your production environments.

## PowerShell Gallery

https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator


## Table of Contents

### Instructions
- Review our [Quick Start Instructions](iis-configurator-quick-start.md) to get started now with concise code samples.
- Review our [Detailed Instructions](iis-configurator-detailed-instructions.md) for a deep dive on how to get started.

### PowerShell API Reference
- [Disable-ApplicationInsightsMonitoring](api_DisableMonitoring.md)
- [Disable-InstrumentationEngine](api_DisableInstrumentationEngine.md)
- [Enable-ApplicationInsightsMonitoring](api_EnableMonitoring.md)
- [Enable-InstrumentationEngine](api_EnableInstrumentationEngine.md)
- [Get-ApplicationInsightsMonitoringConfig](api_GetConfig.md)
- [Get-ApplicationInsightsMonitoringStatus](api_GetStatus.md)
- [Set-ApplicationInsightsMonitoringConfig](api_SetConfig.md)

### Troubleshooting
- [Troubleshooting](iis-configurator-troubleshoot.md)
- [Known Issues](iis-configurator-troubleshoot.md#known-issues)


## FAQ

- Does IISConfigurator support proxy installations?

  **Yes**. You have multiple options to download the IISConfigurator. If your computer has internet access, you can onboard to the PowerShell Gallery using `-Proxy` parameters. Alternatively, you can manually download this module and either install it on your machine or use the module directly. Each of these options are described in our [Detailed Instructions](DetailedInstructions.md).
  
- How to verify the enablement was successful?

   As of v0.2.0-alpha, we don't have a cmdlet to verify that enablement was successful. 
We recommend using [Live Metrics](https://docs.microsoft.com/azure/azure-monitor/app/live-stream) to quickly observe if your application is sending us telemetry.
