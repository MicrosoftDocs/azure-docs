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
# IISConfigurator API Reference

## Disclaimer
This module is a prototype application, and is not recommended for your production environments.

# Disable-InstrumentationEngine (v0.2.0-alpha)

**IMPORTANT**: This cmdlet must be run in a PowerShell Session with Administrator permissions.

## Description

Disable the Instrumentation Engine.
This will remove registry keys.
You will need to restart IIS for your changes to take effect.

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
