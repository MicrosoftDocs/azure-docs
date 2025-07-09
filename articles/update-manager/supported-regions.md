---
title: Azure Update Manager supported regions.
description: Discover the regions where Azure Update Manager is supported for both Azure VMs and Azure Arc-enabled servers. This article provides a comprehensive list of supported regions across Azure Public Cloud, Azure for US Government, and Azure operated by 21Vianet
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 05/13/2025
ms.topic: overview
ms.custom:
  - references_regions
  - build-2025
# Customer intent: As an IT administrator managing virtual machines and servers, I want to know the supported regions for Azure Update Manager, so that I can ensure compliance and optimize updates for our infrastructure.
---

# Supported regions for Azure Update Manager

Update Manager scales to all regions for both Azure VMs and Azure Arc-enabled servers. The following table lists the Azure public cloud where you can use Update Manager.

## Azure public cloud

#### [Azure VMs](#tab/public-vm)

Azure Update Manager is available in the regions specified in [Product Availability by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

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
Germany | Germany West Centrals
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

- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).
