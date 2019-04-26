---
title: Azure Monitor Application Insights Application Monitor | Microsoft Docs
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
# Application Monitor API reference

This document describes a cmdlet that is shipped as member of the [ApplicationMonitor PowerShell Module.](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/)

> [!CAUTION] 
> This module is a prototype application, and isn't recommended for your production environments.

## Enable-InstrumentationEngine (v0.2.0-alpha)

> [!IMPORTANT] 
> This cmdlet requires a PowerShell Session with Administrator permissions.

> [!NOTE] 
> This cmdlet will require you to review and accept our license and privacy statement.

## Description

This cmdlet will enable the Instrumentation Engine by setting some registry keys.
Restart IIS for these changes to take effect.

The Instrumentation Engine can supplement data collected by the .NET SDKs.
Events and messages will be collected that describe the execution of a managed process. 
Including but not limited to Dependency Result Codes, HTTP Verbs, and SQL Command Text. 

Enable the Instrumentation Engine if:
- You've already enabled monitoring using Enable cmdlet but didn't enable the InstrumentationEngine.
- You've manually instrumented your application with the .NET SDKs and want to collect additional telemetry.

> [!NOTE] 
> The Instrumentation Engine adds additional overhead and is off by default.

## Examples

```powershell
PS C:\> Enable-InstrumentationEngine
```

## Parameters 

### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

### -Verbose
**Common Parameter.** Use this switch to output detailed logs.

## Output


#### Example output from successfully enabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
```
