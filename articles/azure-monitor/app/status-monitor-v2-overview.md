---
title: Azure Application Insights Agent overview | Microsoft Docs
description: An overview of Application Insights Agent. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 09/16/2019

---

# Deploy Azure Monitor Application Insights Agent for on-premises servers

> [!IMPORTANT]
> This guidance is recommended for On-Premises and non-Azure cloud deployments of Application Insights Agent. Here's the recommended approach for [Azure virtual machine and virtual machine scale set deployments](https://docs.microsoft.com/azure/azure-monitor/app/azure-vm-vmss-apps).

Application Insights Agent (formerly named Status Monitor V2) is a PowerShell module published to the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor).
It replaces [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now).
Telemetry is sent to the Azure portal, where you can [monitor](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) your app.

> [!NOTE]
> The module only currently supports codeless instrumentation of .NET web apps hosted with IIS. Use an SDK to instrument ASP.NET Core, Java, and Node.js applications.

## PowerShell Gallery

Application Insights Agent is located here: https://www.powershellgallery.com/packages/Az.ApplicationMonitor.

![PowerShell Gallery](https://img.shields.io/powershellgallery/v/Az.ApplicationMonitor.svg?color=Blue&label=Current%20Version&logo=PowerShell&style=for-the-badge)


## Instructions
- See the [getting started instructions](status-monitor-v2-get-started.md) to get a start with concise code samples.
- See the [detailed instructions](status-monitor-v2-detailed-instructions.md) for a deep dive on how to get started.

## PowerShell API reference
- [Disable-ApplicationInsightsMonitoring](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#disable-applicationinsightsmonitoring)
- [Disable-InstrumentationEngine](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#disable-instrumentationengine)
- [Enable-ApplicationInsightsMonitoring](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#enable-applicationinsightsmonitoring)
- [Enable-InstrumentationEngine](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#enable-instrumentationengine)
- [Get-ApplicationInsightsMonitoringConfig](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#get-applicationinsightsmonitoringconfig)
- [Get-ApplicationInsightsMonitoringStatus](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#get-applicationinsightsmonitoringstatus)
- [Set-ApplicationInsightsMonitoringConfig](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#set-applicationinsightsmonitoringconfig)
- [Start-ApplicationInsightsMonitoringTrace](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#start-applicationinsightsmonitoringtrace)

## Troubleshooting
- [Troubleshooting](status-monitor-v2-troubleshoot.md)
- [Known issues](status-monitor-v2-troubleshoot.md#known-issues)


## FAQ

- Does Application Insights Agent support proxy installations?

  *Yes*. There are multiple ways to download Application Insights Agent. 
If your computer has internet access, you can onboard to the PowerShell Gallery by using `-Proxy` parameters.
You can also manually download the module and either install it on your computer or use it directly.
Each of these options is described in the [detailed instructions](status-monitor-v2-detailed-instructions.md).

- Does Status Monitor v2 support ASP.NET Core applications?

  *No*. For instructions to enable monitoring of ASP.NET Core applications, see [Application Insights for ASP.NET Core applications](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core). There's no need to install StatusMonitor for an ASP.NET Core application. This is true even if ASP.NET Core application is hosted in IIS.

- How do I verify that the enablement succeeded?

  - The [Get-ApplicationInsightsMonitoringStatus](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#get-applicationinsightsmonitoringstatus) cmdlet can be used to verify that enablement succeeded.
  - We recommend you use [Live Metrics](https://docs.microsoft.com/azure/azure-monitor/app/live-stream) to quickly determine if your app is sending telemetry.

  - You can also use [Log Analytics](../log-query/get-started-portal.md) to list all the cloud roles currently sending telemetry:
      ```Kusto
      union * | summarize count() by cloud_RoleName, cloud_RoleInstance
      ```

## Next steps

View your telemetry:

* [Explore metrics](../../azure-monitor/platform/metrics-charts.md) to monitor performance and usage.
* [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems.
* [Use Analytics](../../azure-monitor/app/analytics.md) for more advanced queries.
* [Create dashboards](../../azure-monitor/app/overview-dashboard.md).

Add more telemetry:

* [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
* [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to enable trace calls.
* [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls.

