---
title: Enable DDoS Protection | Microsoft Docs
description: Learn how to enable the Azure DDoS Protection service.
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
# Enable the Azure DDoS Protection service

This section details steps to enable DDoS Protection on supported protected resource types. Before following the steps below, make sure you have completed the steps in the [FAQ](ddos-protection-faq.md). 

## Create a new virtual network and enable DDoS Protection via the Azure portal

Navigate to **New -> Networking -> Virtual Network**

During virtual network creation, the option exists to enable DDoS Protection. A warning will state that enabling DDoS Protection incurs charges. No charges for DDoS Protection are incurred during preview. Charges are incurred at General Availability (GA) and customers will receive 30 days notice prior to the start of charges and GA.

![Create virtual network](./media/ddos-enable-protection/ddosenableprotection-fig1.png) 

Select **Enabled** and then click **Save**.

## Create a new virtual network and enable DDoS Protection via Azure PowerShell

To create a virtual network with DDoS Protection enabled, run the following example:

```powershell
New-AzureRmResourceGroup -Name <ResourceGroupName> -Location westcentralus 
$frontendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name <frontendSubnet> -AddressPrefix "10.0.1.0/24" 
$backendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name <backendSubnet> -AddressPrefix "10.0.2.0/24" 
New-AzureRmVirtualNetwork -Name <MyVirtualNetwork> -ResourceGroupName <ResourceGroupName>  -Location westcentralus  -AddressPrefix "10.0.0.0/16" -Subnet $frontendSubnet,$backendSubnet -DnsServer 10.0.1.5,10.0.1.6 -EnableDDoSProtection
```

This example creates a virtual network with two subnets and two DNS servers. The effect of specifying the DNS servers on the virtual network is that the NICs/VMs that are deployed into this virtual network inherit these DNS servers as defaults. DDoS protection is enabled for all the protected resources in the virtual network. 

## Enable DDoS Protection on an existing virtual network via the Azure portal 

To enable DDoS Protection on an existing virtual network, navigate to **Virtual Network -> DDoS Protection**. When this page is opened, the option to Enable or Disable DDoS Protection is presented.

![Enable DDoS Protection](./media/ddos-enable-protection/ddosenableprotection-fig2.png)

Select **Enabled** and then **Save**. A warning states that enabling DDoS Protection incurs charges. No charges for DDoS Protection are incurred during preview. Charges are incurred at General Availability (GA) and customers will receive 30 days notice prior to the start of charges and GA.

## Enable DDoS Protection on an existing virtual network via Azure PowerShell

To enable DDoS Protection on an existing virtual network, run the following example:

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps.enableDdosProtection = $true
Set-AzureRmResource -PropertyObject $vnetProps -ResourceGroupName "ResourceGroupName" -ResourceName "ResourceName" -ResourceType Microsoft.Network/virtualNetworks
```

## Review DDoS Protection status of virtual networks

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps  
```

## Next steps

- Read more about DDoS capabilities in [Azure CLI](https://docs.microsoft.com/cli/azure/network), [Powershell](https://docs.microsoft.com/powershell/module/azurerm.network/), or [REST APIs](https://docs.microsoft.com/rest/api/virtual-network/)
- Learn more about [DDoS Protection](ddos-protection-overview.md).
- Learn more about [DDoS Protection telemetry](ddos-protection-telemetry.md).
- Review [Frequently Asked Questions](ddos-protection-faq.md) about DDoS Protection.