---
title: Traffic analytics supported regions
titleSuffix: Azure Network Watcher
description: This article provides the list of Azure Network Watcher traffic analytics supported regions.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/15/2022
ms.author: halkazwini
ms.custom: references_regions, engagement-fy23
---

# Azure Network Watcher traffic analytics supported regions

This article provides the list of regions supported by Traffic Analytics. You can view the list of supported regions of both NSG and Log Analytics Workspaces below.

## Supported regions: NSG 

You can use traffic analytics for NSGs in any of the following supported regions:
:::row:::
   :::column span="":::
      Australia Central  
      Australia East  
      Australia Southeast  
      Brazil South  
      Brazil Southeast  
      Canada Central  
      Canada East  
      Central India  
      Central US  
      China East 2  
      China North   
      China North 2 	  
   :::column-end:::
   :::column span="":::
      East Asia  
      East US  
      East US 2  
      East US 2 EUAP  
      France Central  
      Germany West Central  
      Japan East  
      Japan West  
      Korea Central  
      Korea South  
      North Central US  
      North Europe   
   :::column-end:::
   :::column span="":::
      Norway East  
      South Africa North  
      South Central US  
      South India  
      Southeast Asia  
      Switzerland North  
      Switzerland West  
      UAE Central  
      UAE North  
      UK South  
      UK West  
      USGov Arizona  
   :::column-end:::
   :::column span="":::
      USGov Texas  
      USGov Virginia  
      USNat East  
      USNat West  
      USSec East  
      USSec West  
      West Central US  
      West Europe  
      West US  
      West US 2  
      West US 3  
   :::column-end:::
:::row-end:::

## Supported regions: Log Analytics Workspaces

The Log Analytics workspace must exist in the following regions:
:::row:::
   :::column span="":::
      Australia Central  
      Australia East  
      Australia Southeast  
      Brazil South  
      Brazil Southeast  
      Canada East  
      Canada Central  
      Central India  
      Central US  
      China East 2  
      China North  
      China North 2  
   :::column-end:::
   :::column span="":::
      East Asia  
      East US  
      East US 2  
      East US 2 EUAP  
      France Central  
      Germany West Central  
      Japan East  
      Japan West  
      Korea Central   
      Korea South  
      North Central US  
      North Europe  
   :::column-end:::
   :::column span="":::
      Norway East  
      South Africa North  
      South Central US  
      South India  
      Southeast Asia  
      Switzerland North  
      Switzerland West  
      UAE Central  
      UAE North  
      UK South  
      UK West  
      USGov Arizona  
   :::column-end:::
   :::column span="":::
      USGov Texas  
      USGov Virginia  
      USNat East  
      USNat West   
      USSec East  
      USSec West  
      West Central US  
      West Europe  
      West US  
      West US 2  
      West US 3  
   :::column-end:::
:::row-end:::

> [!NOTE]
> If NSGs support a region, but the log analytics workspace does not support that region for traffic analytics as per above lists, then you can use log analytics workspace of any other supported region as a workaround.

## Next steps

- Learn how to [enable flow log settings](enable-network-watcher-flow-log-settings.md).
- Learn the ways to [use traffic analytics](usage-scenarios-traffic-analytics.md).
