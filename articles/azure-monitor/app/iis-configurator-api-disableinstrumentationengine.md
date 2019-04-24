---
title: IIS Configurator | Microsoft Docs
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
# IISConfigurator API Reference

[!CAUTION]
This module is a prototype application, and isn't recommended for your production environments.

# Disable-InstrumentationEngine (v0.2.0-alpha)

[!IMPORTANT]
This cmdlet requires a PowerShell Session with Administrator permissions.

## Description

This cmdlet will disable the Instrumentation Engine by removing some registry keys.
Restart IIS for these changes to take effect.

## Examples

```powershell
PS C:\> Disable-InstrumentationEngine
```

## Parameters 

### -Verbose
**Common Parameter.** Use this switch to output detailed logs.

## Output


#### Example output from successfully disabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]'
Configuring registry for instrumentation engine...
```
