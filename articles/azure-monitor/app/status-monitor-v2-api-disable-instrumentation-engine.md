---
title: Azure Application Insights Agent API reference
description: Application Insights Agent API reference. Disable-InstrumentationEngine. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 04/23/2019

---

# Application Insights Agent API: Disable-InstrumentationEngine

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

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

 Do more with Application Insights Agent:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Application Insights Agent.
