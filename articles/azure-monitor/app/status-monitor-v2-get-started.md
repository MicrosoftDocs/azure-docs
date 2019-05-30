---
title: Azure Status Monitor v2 getting started | Microsoft Docs
description: A quickstart guide for Status Monitor v2. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
services: application-insights
documentationcenter: .net
author: MS-TimothyMothra
manager: alexklim
ms.assetid: 769a5ea4-a8c6-4c18-b46c-657e864e24de
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: tilee
---
# Getting started with Status Monitor v2

This document contains the quickstart commands expected to work for most environments. 
These instructions depend on the PowerShell Gallery to distribute updates. 
These commands support the PowerShell `-Proxy` parameter.

Review our [Detailed instructions](status-monitor-v2-detailed-instructions.md) page for an explanation of these commands, 
instructions on how to customize, and how to troubleshoot.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Download & install via PowerShell Gallery

### Install prerequisites
Run PowerShell as Administrator
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
Install-Module -Name PowerShellGet -Force
```	
Exit PowerShell

### Install Status Monitor v2
Run PowerShell as Administrator
```powershell	
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-Module -Name Az.ApplicationMonitor -AllowPrerelease -AcceptLicense
```	

### Enable monitoring
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
	
		
## Download & install manually (offline option)
### Manual download
Manually download the latest version of the Module from: https://www.powershellgallery.com/packages/Az.ApplicationMonitor

### Unzip and install Status Monitor v2
```powershell
$pathToNupkg = "C:\Users\t\Desktop\Az.ApplicationMonitor.0.2.1-alpha.nupkg"
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

- [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems
- [Analytics](../../azure-monitor/app/analytics.md) for more advanced queries
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md)

 Add more telemetry:

- [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to let you insert trace calls.
- [Add Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so that you can insert trace and log calls

Do more with Status Monitor v2:

- Review the [Detailed instructions](status-monitor-v2-detailed-instructions.md) for an explanation of the commands found in this guide.
- Use our guide to [Troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
