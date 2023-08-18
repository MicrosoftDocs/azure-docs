---
title: Traffic analytics supported regions
titleSuffix: Azure Network Watcher
description: Learn about the regions that support enabling traffic analytics on NSG flow logs and the Log Analytics workspaces that you can use.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.date: 06/15/2023
ms.author: halkazwini
ms.custom: references_regions, engagement-fy23
---

# Traffic analytics supported regions

In this article, you learn about Azure regions that support enabling [traffic analytics](traffic-analytics.md) for NSG flow logs.

## Supported regions: network security groups 

You can enable traffic analytics for NSG flow logs for network security groups that exist in any of the following Azure regions:

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

## Supported regions: Log Analytics workspaces

The Log Analytics workspace that you use for traffic analytics must exist in one of the following Azure regions:

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
> If a network security group is supported for flow logging in a region, but Log Analytics workspace isn't supported in that region for traffic analytics, you can use a Log Analytics workspace from any other supported region as a workaround.

## Next steps

- Learn more about [Traffic analytics](traffic-analytics.md).
- Learn about [Usage scenarios of traffic analytics](usage-scenarios-traffic-analytics.md).
