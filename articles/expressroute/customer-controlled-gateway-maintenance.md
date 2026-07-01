---
title: 'Configure customer-controlled maintenance for your virtual network gateway'
titleSuffix: ExpressRoute
description: Learn how to configure customer-controlled maintenance for your gateways using the Azure portal, or PowerShell.
author: cherylmc
ms.service: azure-expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/11/2025
ms.author: cherylmc
# Customer intent: As a network administrator, I want to configure maintenance windows for my ExpressRoute virtual network gateways, so that I can control and schedule maintenance activities according to my organization's operational needs.
---
# Configure customer-controlled gateway maintenance for ExpressRoute

This article helps you configure customer-controlled maintenance windows for your ExpressRoute virtual network gateways. Learn how to schedule customer-controlled maintenance for your gateways using the Azure portal or PowerShell. 

[!INCLUDE [Overview](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-overview.md)]

For more information on limitations and frequently asked questions related to customer-controlled maintenance, see the [ExpressRoute FAQ](expressroute-faqs.md#customer-controlled).
## Maintenance window behavior

Consider the following information about maintenance window behavior:

* **Start date**: The maintenance window takes effect on the configured start date. Before this date, maintenance or upgrades might occur outside the selected window.
* **End date**: If you configure an end (expiration) date, the maintenance window is honored through that date. After the end date, maintenance or upgrades might occur outside the selected window.
* **Daily schedule**: The selected start time and duration apply daily while the window is active.
* **Timing within the window**: If an upgrade is scheduled during the window, it can occur at any time within the configured duration. For example, if the window starts at 8:30 AM and has a 6-hour duration, the upgrade might occur at any point between 8:30 AM and 2:30 PM.
* **Upgrade frequency**: Upgrades don't necessarily occur every day during the maintenance window. An upgrade is only applied during the window when there's an upgrade available for the resource.


## Azure portal steps

[!INCLUDE [Portal steps](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-portal.md)]

   Example:

   :::image type="content" source="./media/customer-controlled-gateway-maintenance/select-resources.png" alt-text="Screenshot showing the select resources page." lightbox="./media/customer-controlled-gateway-maintenance/select-resources.png":::

[!INCLUDE [View add remove](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-view-add-remove.md)]

## Azure PowerShell steps

[!INCLUDE [PowerShell steps](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-powershell.md)]
6. Create the maintenance configuration assignment using the [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) cmdlet. The maintenance policy is applied to the resource within 24 hours.

   ```azurepowershell-interactive
   New-AzConfigurationAssignment -ResourceGroupName <rgName> -ProviderName "Microsoft.Network" -ResourceType "<your resource's resource type per ARM. For example, expressRouteGateways or virtualNetworkGateways>" -ResourceName "<your resource's name>" -ConfigurationAssignmentName "<assignment name>" -ResourceId $serviceResource.Id -MaintenanceConfigurationId $config.Id -Location "<arm location of resource>"
   ```

### To remove a configuration assignment

[!INCLUDE [Remove assignment](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-remove-assignment.md)]

## Next steps

For more information, see the [ExpressRoute FAQ](expressroute-faqs.md#customer-controlled).
