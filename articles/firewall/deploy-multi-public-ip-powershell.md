---
title: Deploy Azure Firewall with multiple public IP addresses using Azure PowerShell
description: In this article, you learn how to deploy an Azure Firewall with multiple public IP addresses using the Azure PowerShell. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 7/10/2019
ms.author: victorh
---

# Deploy an Azure Firewall with multiple public IP addresses using Azure PowerShell

> [!IMPORTANT]
> Azure Firewall with multiple public IP addresses is available via Azure PowerShell, Azure CLI, REST, and templates. The portal user interface is being added to regions incrementally, and will be available in all regions when the rollout completes.

You can deploy an Azure Firewall with up to 100 public IP addresses.

This feature enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - Additional ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. At this time, Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall.

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

* [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
