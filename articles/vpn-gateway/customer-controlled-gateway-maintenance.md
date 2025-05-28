---
title: 'Configure customer-controlled maintenance for your virtual network gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to configure customer-controlled maintenance for your VPN Gateway virtual network gateways using the Azure portal, or PowerShell.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/16/2025
ms.author: cherylmc
---

# Configure maintenance windows for your virtual network gateways

This article helps you configure maintenance windows for your VPN Gateway virtual network gateways. A customer-controlled maintenance window can be scheduled using the Azure portal or PowerShell.

[!INCLUDE [Overview](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-overview.md)]

For more information on limitations and frequently asked questions related to customer-controlled maintenance, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#customer-controlled).

## Azure portal steps

[!INCLUDE [Portal steps](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-portal.md)]

   Example:

   :::image type="content" source="./media/customer-controlled-gateway-maintenance/select-resources.png" alt-text="Screenshot showing the select resources page." lightbox="./media/customer-controlled-gateway-maintenance/select-resources.png":::

[!INCLUDE [View add remove](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-view-add-remove.md)]

## Azure PowerShell steps

[!INCLUDE [PowerShell steps](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-powershell.md)]
6. Create the maintenance configuration assignment using the [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) cmdlet. The maintenance policy is applied to the resource within 24 hours.

   ```azurepowershell-interactive
   New-AzConfigurationAssignment -ResourceGroupName <rgName> -ProviderName "Microsoft.Network" -ResourceType "<your resource's resource type per ARM. For example, virtualNetworkGateways>" -ResourceName "<your resource's name>" -ConfigurationAssignmentName "<assignment name>" -ResourceId $serviceResource.Id -MaintenanceConfigurationId $config.Id -Location "<arm location of resource>"
   ```

### To remove a configuration assignment

[!INCLUDE [Remove assignment](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-remove-assignment.md)]

## Next steps

For more information, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#customer-controlled).
