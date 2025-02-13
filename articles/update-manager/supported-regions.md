---
title: Azure Update Manager supported regions
description: Discover the regions where Azure Update Manager is supported for both Azure VMs and Azure Arc-enabled servers. This article provides a comprehensive list of supported regions across Azure Public Cloud, Azure for US Government, and Azure operated by 21Vianet
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/13/2025
ms.topic: overview
ms.custom: references_regions
---

# Supported regions

Update Manager scales to all regions for both Azure VMs and Azure Arc-enabled servers. The following table lists the Azure public cloud where you can use Update Manager.

## Azure public cloud

#### [Azure VMs](#tab/public-vm)

Azure Update Manager is available in all Azure public regions where compute virtual machines are available.

#### [Azure Arc-enabled servers](#tab/public-arc)

Azure Update Manager is currently supported in the following regions. It implies that VMs must be in the following regions.

**Geography** | **Supported regions**
--- | ---
Africa | South Africa North
Asia Pacific | East Asia </br> South East Asia
Australia | Australia East </br> Australia Southeast
Brazil | Brazil South
Canada | Canada Central </br> Canada East
Europe | North Europe </br> West Europe
France | France Central
Germany | Germany West Central
India | Central India
Italy | Italy North
Japan | Japan East
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
UAE | UAE North
United Kingdom | UK South </br> UK West
United States | Central US </br> East US </br> East US 2</br> North Central US </br> South Central US </br> West Central US </br> West US </br> West US 2 </br> West US 3

---

## Azure for US Government

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
United States | USGovVirginia </br>  USGovArizona </br> USGovTexas | For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For Azure VMs only

## Azure operated by 21Vianet

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
China | ChinaEast </br> ChinaEast3 </br>  ChinaNorth </br> ChinaNorth3 </br> ChinaEast2 </br>  ChinaNorth2 | For Azure VMs only </br> For Azure VMs only </br> For Azure VMs only </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers.

## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)