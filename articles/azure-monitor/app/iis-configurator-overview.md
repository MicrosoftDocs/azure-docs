---
title: Azure Monitor Application Insights IIS Configurator | Microsoft Docs
description: Monitor a website's performance without redeploying it. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
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

IISConfigurator is a PowerShell Module published to the [PowerShellGallery](https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator.POC) 
and is the replacement for [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now). 
This module provides code-less instrumentation of .NET web applications hosted on-prem. 
Telemetry will be sent to the Azure portal where you can [monitor](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) your application.

> [!CAUTION] 
> This module is a prototype application, and isn't recommended for your production environments.

## PowerShell Gallery

https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator.POC


## Instructions
- Review our [getting started instructions](iis-configurator-getting-started.md) to get started now with concise code samples.
- Review our [detailed instructions](iis-configurator-detailed-instructions.md) for a deep dive on how to get started.

## PowerShell API reference
- [Disable-ApplicationInsightsMonitoring](iis-configurator-api-disablemonitoring.md)
- [Disable-InstrumentationEngine](iis-configurator-api-disableinstrumentationengine.md)
- [Enable-ApplicationInsightsMonitoring](iis-configurator-api-enablemonitoring.md)
- [Enable-InstrumentationEngine](iis-configurator-api-enableinstrumentationengine.md)
- [Get-ApplicationInsightsMonitoringConfig](iis-configurator-api-getconfig.md)
- [Get-ApplicationInsightsMonitoringStatus](iis-configurator-api-getstatus.md)
- [Set-ApplicationInsightsMonitoringConfig](iis-configurator-api-setconfig.md)

## Troubleshooting
- [Troubleshooting](iis-configurator-troubleshoot.md)
- [Known Issues](iis-configurator-troubleshoot.md#known-issues)


## FAQ

- Does IISConfigurator support proxy installations?

  **Yes**. You have multiple options to download the IISConfigurator. 
If your computer has internet access, you can onboard to the PowerShell Gallery using `-Proxy` parameters. 
You can also manually download this module and either install it on your machine or use the module directly. 
Each of these options is described in our [Detailed Instructions](iis-configurator-detailed-instructions.md).
  
- How to verify the enablement was successful?

   We don't have a cmdlet to verify that enablement was successful. 
We recommend using [Live Metrics](https://docs.microsoft.com/azure/azure-monitor/app/live-stream) to quickly observe if your application is sending us telemetry.
