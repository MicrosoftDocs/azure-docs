---
title: Deploy Azure Firewall with multiple public IP addresses using Azure PowerShell
description: In this article, you learn how to deploy an Azure Firewall with multiple public IP addresses using the Azure PowerShell. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 7/2/2019
ms.author: victorh
---

# Deploy an Azure Firewall with multiple public IP addresses using Azure PowerShell

> [!IMPORTANT]
> Azure Firewall with multiple public IP addresses is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can deploy an Azure Firewall with up to 100 public IP addresses.

This feature enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - Additional ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. At this time, Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall.

The following Azure PowerShell examples show how you can add, remove, and configure public IP addresses for Azure Firewall.

> [!NOTE]
> During the public preview, if you add or remove a public IP address to a running firewall, existing inbound connectivity using DNAT rules may not function for 40 - 120 seconds. You can't remove the first public IP address assigned to the firewall unless the firewall is deallocated or deleted.

## Add a public IP address to an existing firewall

In this example, the public IP address *azFwPublicIp1* as attached to the firewall.

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

In this example, the public IP address *azFwPublicIp1* as detached from the firewall.

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

## Next steps

* [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
