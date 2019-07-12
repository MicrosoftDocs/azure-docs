---
title: "Azure Status Monitor v2 API reference: Disable instrumentation engine | Microsoft Docs"
description: Status Monitor v2 API reference. Disable-InstrumentationEngine. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
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
# Status Monitor v2 API: Disable-InstrumentationEngine (v0.4.0-alpha)

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Description
Disables the instrumentation engine by removing some registry keys.
Restart IIS for the changes to take effect.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions.

## Examples

```powershell
PS C:\> Disable-InstrumentationEngine
```

## Parameters 

### -Verbose
**Common parameter.** Use this switch to output detailed logs.

## Output


#### Example output from successfully disabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]'
Configuring registry for instrumentation engine...
```


## Next steps

 Do more with Status Monitor v2:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
