---
title: Deploy Azure Firewall with multiple public IP addresses using PowerShell
description: Deploy an Azure Firewall with multiple public IP addresses using Azure PowerShell.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: devx-track-azurepowershell
# Customer intent: "As a network administrator, I want to deploy Azure Firewall with multiple public IP addresses using PowerShell, so that I can efficiently manage incoming and outgoing network traffic while ensuring high availability and reducing port exhaustion."
---

# Deploy an Azure Firewall with multiple public IP addresses by using Azure PowerShell

This feature enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - Additional ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. Azure Firewall randomly selects the first source public IP address to use for a connection and selects another public IP after ports from the first IP are exhausted. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall. Consider using a [public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md) to simplify this configuration.

You can access Azure Firewall with multiple public IP addresses through the Azure portal, Azure PowerShell, Azure CLI, REST, and templates.
You can deploy an Azure Firewall in a hub virtual network with up to 250 public IP addresses. However, DNAT destination rules also count toward the 250 maximum.
The limit for an Azure Firewall in a VHUB deployment with Bring your own Public IP is 250 addresses, and for classic VHUB deployment, it's 80 public IP addresses.

> [!NOTE]
> In scenarios with high traffic volume and throughput, use a [NAT Gateway](/azure/nat-gateway/nat-overview) to provide outbound connectivity. NAT Gateway dynamically allocates SNAT ports across all public IPs associated with it. For more information, see [integrate NAT Gateway with Azure Firewall](/azure/firewall/integrate-with-nat-gateway).

The following Azure PowerShell examples show how you can configure, add, and remove public IP addresses for Azure Firewall.

> [!IMPORTANT]
> You can't remove the first IP configuration from the Azure Firewall public IP address configuration page. If you want to modify the IP address, use Azure PowerShell.


## Create a firewall with two or more public IP addresses

This example creates a firewall attached to virtual network *myVirtualNetwork* with two public IP addresses. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve the existing virtual network, [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create each public IP address, and [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to deploy the firewall with both IPs.

```azurepowershell
$rgName = "resourceGroupName"

$vnet = Get-AzVirtualNetwork `
  -Name "myVirtualNetwork" `
  -ResourceGroupName $rgName

$pip1 = New-AzPublicIpAddress `
  -Name "AzFwPublicIp1" `
  -ResourceGroupName $rgName `
  -Sku "Standard" `
  -Location "centralus" `
  -AllocationMethod Static

$pip2 = New-AzPublicIpAddress `
  -Name "AzFwPublicIp2" `
  -ResourceGroupName $rgName `
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

In this example, the public IP address *azFwPublicIp1* is attached to the firewall. Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the new IP, [Get-AzFirewall](/powershell/module/az.network/get-azfirewall) to retrieve the existing firewall object, and [Set-AzFirewall](/powershell/module/az.network/set-azfirewall) to save the updated configuration.

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

In this example, the public IP address *azFwPublicIp1* is detached from the firewall. Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to retrieve the existing IP, [Get-AzFirewall](/powershell/module/az.network/get-azfirewall) to retrieve the firewall object, and [Set-AzFirewall](/powershell/module/az.network/set-azfirewall) to save the updated configuration.

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

- [Quickstart: Create an Azure Firewall with multiple public IP addresses - Resource Manager template](quick-create-multiple-ip-template.md)
