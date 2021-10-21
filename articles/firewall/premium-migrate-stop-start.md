---
title: Migrate to Azure Firewall Premium using Stop/Start
description: Learn how to migrate from Azure Firewall Standard to Azure Firewall Premium using the Stop/Start method.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 10/21/2021
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Migrate to Azure Firewall Premium using Stop/Start

If you use Azure Firewall Standard SKU with Firewall Policy, you can use the Allocate/Deallocate method to migrate your Firewall SKU to Premium. This migration approach is supported on both VNet Hub and Secure Hub Firewalls. When you migrate a Secure Hub deployment, it will preserve the firewall public IP address.
 
## Migrate a VNET Hub Firewall

- Deallocate the Standard Firewall 

   ```azurepowershell
   $azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
   $azfw.Deallocate()
   Set-AzFirewall -AzureFirewall $azfw
   ```


- Allocate Firewall Premium

   ```azurepowershell
   $azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
   $azfw.Sku.Tier="Premium"
   $azfw.Allocate($vnet,$pip, $mgmtpip)
   Set-AzFirewall -AzureFirewall $azfw
   ```

## Migrate a Secure Hub Firewall

The minimum Azure PowerShell version requirement is 6.5.0. For more information, see [Az 6.5.0](https://www.powershellgallery.com/packages/Az/6.5.0).

- Deallocate the Standard Firewall

   ```azurepowershell
   $azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
   $azfw.Deallocate()
   Set-AzFirewall -AzureFirewall $azfw
   ```

- Allocate Firewall Premium

   ```azurepowershell
   $azfw = Get-AzFirewall -Name -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
   $azfw.Sku.Tier="Premium"
   $azfw.Allocate($hub.id)
   Set-AzFirewall -AzureFirewall $azfw
   ```

## Next steps

- [Learn more about Azure Firewall Premium features](premium-features.md)
