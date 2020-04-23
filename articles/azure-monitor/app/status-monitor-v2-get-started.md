---
title: Azure Application Insights Agent - getting started | Microsoft Docs
description: A quickstart guide for Application Insights Agent. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 04/23/2019

---

# Get started with Azure Monitor Application Insights Agent for on-premises servers

This article contains the quickstart commands expected to work for most environments.
The instructions depend on the PowerShell Gallery to distribute updates.
These commands support the PowerShell `-Proxy` parameter.

For an explanation of these commands, customization instructions, and information about troubleshooting, see the [detailed instructions](status-monitor-v2-detailed-instructions.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Download and install via PowerShell Gallery

### Install prerequisites
Run PowerShell as Admin.
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
Install-Module -Name PowerShellGet -Force
```	
Close PowerShell.

### Install Application Insights Agent
Run PowerShell as Admin.
```powershell	
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-Module -Name Az.ApplicationMonitor -AllowPrerelease -AcceptLicense
```	

### Enable monitoring
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
	
		
## Download and install manually (offline option)
### Download the module
Manually download the latest version of the module from [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor).

### Unzip and install Application Insights Agent
```powershell
$pathToNupkg = "C:\Users\t\Desktop\Az.ApplicationMonitor.0.3.0-alpha.nupkg"
$pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
$pathToNupkg | rename-item -newname $pathToZip
$pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\Az.ApplicationMonitor"
Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
```
### Enable monitoring
```powershell
Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```



## Next steps

 View your telemetry:

- [Explore metrics](../../azure-monitor/platform/metrics-charts.md) to monitor performance and usage.
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems.
- [Use Analytics](../../azure-monitor/app/analytics.md) for more advanced queries.
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md).

 Add more telemetry:

- [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to enable trace calls.
- [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls.

Do more with Application Insights Agent:

- Review the [detailed instructions](status-monitor-v2-detailed-instructions.md) for an explanation of the commands found here.
- Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Application Insights Agent.
