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
# IISConfigurator API reference

This document describes a cmdlet that is shipped as member of the [IISConfigurator PowerShell Module](https://www.powershellgallery.com/packages/Microsoft.ApplicationInsights.IISConfigurator.POC).

> [!CAUTION] 
> This module is a prototype application, and isn't recommended for your production environments.

## Get-ApplicationInsightsMonitoringConfig (v0.2.0-alpha)

> [!IMPORTANT] 
> This cmdlet requires a PowerShell Session with Administrator permissions.

## Description

Get the config file for IISConfigurator and print the values to the console.

## Examples

```powershell
PS C:\> Get-ApplicationInsightsMonitoringConfig
```

## Parameters 

(No Parameters Required)

## Output


#### Example output from reading the config file

```
RedfieldConfiguration:
Filters:
0)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx AppFilter: .* MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx AppFilter: two MachineFilter: two
2)InstrumentationKey:  AppFilter: two MachineFilter: two
```
