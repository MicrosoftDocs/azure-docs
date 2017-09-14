---
title: Disable the Azure DDoS Protection service | Microsoft Docs
description: Learn how to disable the Azure DDoS Protection service.
services: virtual-network
documentationcenter: na
author: kumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: kumud

---
# Disable the Azure DDoS Protection service

This section details steps to disable DDoS Protection on supported protected resource types. 

## Disable DDoS protection on a virtual network via the Azure portal

To disable DDoS Protection, navigate to **Virtual Network -> DDoS Protection**. The option to **Disable DDoS Protection** is presented.

![Disable DDoS protection](./media/ddos-disable-protection/ddosdisableprotection-fig1.png) 

Select **Disabled** and then click **Save**.

## Disable DDoS protection on a virtual network via Azure PowerShell

To disable DDoS protection on a virtual network, run the following example:

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps.enableDdosProtection = $false
Set-AzureRmResource -PropertyObject $vnetProps -ResourceGroupName <RessourceGroupName> -ResourceName <ResourceName> -ResourceType "Microsoft.Network/virtualNetworks"
```

## Review the DDoS protection status of virtual networks 

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps
```

## Next steps

- Read more about DDoS capabilities in [Azure CLI](https://docs.microsoft.com/cli/azure/network), [Powershell](https://docs.microsoft.com/powershell/module/azurerm.network/), or [REST APIs](https://docs.microsoft.com/rest/api/virtual-network/)
- Learn more about [DDoS Protection](ddos-protection-overview.md).
- Learn more about [DDoS Protection telemetry](ddos-protection-telemetry.md).
- Review [Frequently Asked Questions](ddos-protection-faq.md) about DDoS Protection.