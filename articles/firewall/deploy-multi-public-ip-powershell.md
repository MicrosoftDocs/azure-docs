---
title: Deploy Azure Firewall with multiple public IP addresses using PowerShell
description: In this article, you learn how to deploy an Azure Firewall with multiple public IP addresses using the Azure PowerShell. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 10/24/2022
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Deploy an Azure Firewall with multiple public IP addresses using Azure PowerShell

This feature enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - Additional ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall. Consider using a [public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md) to simplify this configuration.
 
Azure Firewall with multiple public IP addresses is available via the Azure portal, Azure PowerShell, Azure CLI, REST, and templates.\
You can deploy an Azure Firewall with up to 250 public IP addresses, however DNAT destination rules will also count toward the 250 maximum.
Public IPs + DNAT destination rule = 250 max.

The following Azure PowerShell examples show how you can configure, add, and remove public IP addresses for Azure Firewall.

> [!NOTE]
> You can't remove the first ipConfiguration from the Azure Firewall public IP address configuration page. If you want to modify the IP address, you can use Azure PowerShell.

## Create a firewall with two or more public IP addresses

This example creates a firewall attached to virtual network *vnet* with two public IP addresses.

```azurepowershell
$rgName = "resourceGroupName"

$vnet = Get-AzVirtualNetwork `
  -Name "vnet" `
  -ResourceGroupName $rgName

$pip1 = New-AzPublicIpAddress `
  -Name "AzFwPublicIp1" `
  -ResourceGroupName "rg" `
  -Sku "Standard" `
  -Location "centralus" `
  -AllocationMethod Static

$pip2 = New-AzPublicIpAddress `
  -Name "AzFwPublicIp2" `
  -ResourceGroupName "rg" `
  -Sku "Standard" `
  -Location "centralus" `
  -AllocationMethod Static

New-AzFirewall `
  -Name "azFw" `
  -ResourceGroupName $rgName `
  -Location centralus `
  -VirtualNetwork $vnet `
  -PublicIpAddress @($pip1, $pip2)
```

## Add a public IP address to an existing firewall

In this example, the public IP address *azFwPublicIp1* is attached to the firewall.

```azurepowershell
$pip = New-AzPublicIpAddress `
  -Name "azFwPublicIp1" `
  -ResourceGroupName "rg" `
  -Sku "Standard" `
  -Location "centralus" `
  -AllocationMethod Static

$azFw = Get-AzFirewall `
  -Name "AzureFirewall" `
  -ResourceGroupName "rg"

$azFw.AddPublicIpAddress($pip)

$azFw | Set-AzFirewall
```

## Remove a public IP address from an existing firewall

In this example, the public IP address *azFwPublicIp1* is detached from the firewall.

```azurepowershell
$pip = Get-AzPublicIpAddress `
  -Name "azFwPublicIp1" `
  -ResourceGroupName "rg"

$azFw = Get-AzFirewall `
  -Name "AzureFirewall" `
  -ResourceGroupName "rg"

$azFw.RemovePublicIpAddress($pip)

$azFw | Set-AzFirewall
```

## Next steps

* [Quickstart: Create an Azure Firewall with multiple public IP addresses - Resource Manager template](quick-create-multiple-ip-template.md)
