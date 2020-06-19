---
title: Deploy Azure Firewall with Availability Zones using PowerShell
description: In this article, you learn how to deploy an Azure Firewall with Availability Zones using the Azure PowerShell. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 11/19/2019
ms.author: victorh
---

# Deploy an Azure Firewall with Availability Zones using Azure PowerShell

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability.

This feature enables the following scenarios:

- You can increase availability to 99.99% uptime. For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/). The 99.99% uptime SLA is offered when two or more Availability Zones are selected.
- You can also associate Azure Firewall to a specific zone just for proximity reasons, using the service standard 99.95% SLA.

For more information about Azure Firewall Availability Zones, see [What is Azure Firewall?](overview.md)

The following Azure PowerShell example shows how you can deploy an Azure Firewall with Availability Zones.

## Create a firewall with Availability Zones

This example creates a firewall in zones 1, 2, and 3.

When the standard public IP address is created, no specific zone is specified. This creates a zone-redundant IP address by default. Standard public IP addresses can be configured either in all zones, or a single zone.

It's important to know, because you can't have a firewall in zone 1 and an IP address in zone 2. But you can have a firewall in zone 1 and IP address in all zones, or a firewall and an IP address in the same single zone for proximity purposes.

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

New-AzFirewall `
  -Name "azFw" `
  -ResourceGroupName $rgName `
  -Location centralus `
  -VirtualNetwork $vnet `
  -PublicIpAddress @($pip1) `
  -Zone 1,2,3
```

## Next steps

- [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
