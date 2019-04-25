---
title: Azure Monitor Applicaton Insights IIS Configurator | Microsoft Docs
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
# IISConfigurator Quickstart Instructions

This document contains the quickstart commands expected to work for most environments. 
These instructions depend on the PowerShell Gallery to distribute updates. 
These commands support the PowerShell `-Proxy` parameter.

Review our [Detailed instructions](iis-configurator-detailed-instructions.md) page for an explanation of these commands, 
instructions on how to customize, and how to troubleshoot.


> [!CAUTION] 
> This module is a prototype application, and isn't recommended for your production environments.


### Install prerequisites
Run PowerShell as Administrator
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
Install-Module -Name PowerShellGet -Force
```	
Exit PowerShell

### Install IISConfigurator
Run PowerShell as Administrator
```powershell	
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-Module -Name Microsoft.ApplicationInsights.IISConfigurator -AllowPrerelease -AcceptLicense
```	

### Enable monitoring
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
	
		
##  Quickstart (offline install)
### Manual download
Manually download the latest version of the Module from: https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator.POC 

### Unzip and install IISConfigurator
```powershell
$pathToNupkg = "C:\Users\t\Desktop\Microsoft.ApplicationInsights.IISConfigurator.0.2.0-alpha.nupkg"
$pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
$pathToNupkg | rename-item -newname $pathToZip
$pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator"
Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
```
### Enable monitoring
```powershell
Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
