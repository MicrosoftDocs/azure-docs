---
title: Azure Application Insights Agent overview | Microsoft Docs
description: An overview of Application Insights Agent. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
ms.date: 09/16/2019
ms.reviewer: abinetabate
---

# Deploy Azure Monitor Application Insights Agent for on-premises servers

> [!IMPORTANT]
> This guidance is recommended for On-Premises and non-Azure cloud deployments of Application Insights Agent. Here's the recommended approach for [Azure virtual machine and virtual machine scale set deployments](./azure-vm-vmss-apps.md).

Application Insights Agent (formerly named Status Monitor V2) is a PowerShell module published to the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor).
It replaces Status Monitor.
Telemetry is sent to the Azure portal, where you can [monitor](./app-insights-overview.md) your app.

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> The module currently supports codeless instrumentation of ASP.NET and ASP.NET Core web apps hosted with IIS. Use an SDK to instrument Java and Node.js applications.

## PowerShell Gallery

Application Insights Agent is located here: https://www.powershellgallery.com/packages/Az.ApplicationMonitor.

![PowerShell Gallery](https://img.shields.io/powershellgallery/v/Az.ApplicationMonitor.svg?color=Blue&label=Current%20Version&logo=PowerShell&style=for-the-badge)


## Instructions
- See the [getting started instructions](status-monitor-v2-get-started.md) to get a start with concise code samples.
- See the [detailed instructions](status-monitor-v2-detailed-instructions.md) for a deep dive on how to get started.

## PowerShell API reference
- [Disable-ApplicationInsightsMonitoring](./status-monitor-v2-api-reference.md#disable-applicationinsightsmonitoring)
- [Disable-InstrumentationEngine](./status-monitor-v2-api-reference.md#disable-instrumentationengine)
- [Enable-ApplicationInsightsMonitoring](./status-monitor-v2-api-reference.md#enable-applicationinsightsmonitoring)
- [Enable-InstrumentationEngine](./status-monitor-v2-api-reference.md#enable-instrumentationengine)
- [Get-ApplicationInsightsMonitoringConfig](./status-monitor-v2-api-reference.md#get-applicationinsightsmonitoringconfig)
- [Get-ApplicationInsightsMonitoringStatus](./status-monitor-v2-api-reference.md#get-applicationinsightsmonitoringstatus)
- [Set-ApplicationInsightsMonitoringConfig](./status-monitor-v2-api-reference.md#set-applicationinsightsmonitoringconfig)
- [Start-ApplicationInsightsMonitoringTrace](./status-monitor-v2-api-reference.md#start-applicationinsightsmonitoringtrace)

## FAQ

- Does Application Insights Agent support proxy installations?

  *Yes*. There are multiple ways to download Application Insights Agent. 
If your computer has internet access, you can onboard to the PowerShell Gallery by using `-Proxy` parameters.
You can also manually download the module and either install it on your computer or use it directly.
Each of these options is described in the [detailed instructions](status-monitor-v2-detailed-instructions.md).

- Does Status Monitor v2 support ASP.NET Core applications?

  *Yes*. Starting from [Application Insights Agent 2.0.0-beta1](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/2.0.0-beta1), ASP.NET Core applications hosted in IIS are supported.

- How do I verify that the enablement succeeded?

  - The [Get-ApplicationInsightsMonitoringStatus](./status-monitor-v2-api-reference.md#get-applicationinsightsmonitoringstatus) cmdlet can be used to verify that enablement succeeded.
  - We recommend you use [Live Metrics](./live-stream.md) to quickly determine if your app is sending telemetry.

  - You can also use [Log Analytics](../logs/log-analytics-tutorial.md) to list all the cloud roles currently sending telemetry:
      ```Kusto
      union * | summarize count() by cloud_RoleName, cloud_RoleInstance
      ```

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/status-monitor-v2-troubleshoot).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

### 2.0.0-beta3

- Update ApplicationInsights .NET/.NET Core SDK to 2.20.1-redfield.
- Enable SQL query collection.

### 2.0.0-beta2

- Updated ApplicationInsights .NET/.NET Core SDK to 2.18.1-redfield.

### 2.0.0-beta1

- Added ASP.NET Core Auto-Instrumentation feature.


## Next steps

View your telemetry:

* [Explore metrics](../essentials/metrics-charts.md) to monitor performance and usage.
* [Search events and logs](./diagnostic-search.md) to diagnose problems.
* [Use Analytics](../logs/log-query-overview.md) for more advanced queries.
* [Create dashboards](./overview-dashboard.md).

Add more telemetry:

* [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
* [Add web client telemetry](./javascript.md) to see exceptions from web page code and to enable trace calls.
* [Add the Application Insights SDK to your code](./asp-net.md) so you can insert trace and log calls.