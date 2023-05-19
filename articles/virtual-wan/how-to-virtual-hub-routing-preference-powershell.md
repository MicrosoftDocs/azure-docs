---
title: 'Configure virtual hub routing preference: Azure PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN virtual hub routing preference using Azure PowerShell.
author: cherylmc
ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: cherylmc
---
# Configure virtual hub routing preference - Azure PowerShell

The following steps help you configure virtual hub routing preference settings using Azure PowerShell. You can also configure these settings using the [Azure portal](howto-virtual-hub-routing-preference.md). For information about this feature, see [Virtual hub routing preference](about-virtual-hub-routing-preference.md).

## Prerequisite

If you're using Azure PowerShell locally from your computer, verify that your az.network module version is 4.19.0 or above.

## Configure

To configure virtual hub routing preference for an existing virtual hub, use the following steps.

1. (Optional) Check the current HubRoutingPreference for an existing virtual hub.

   ```azurepowershell-interactive
   Get-AzVirtualHub -ResourceGroupName "[resource group name]" -Name "[virtual hub name]" | select-object HubRoutingPreference
   ```

1. Update the current HubRoutingPreference for an existing virtual hub. The preference can be either VpnGateway, or ExpressRoute. The following example sets the hub routing preference to VpnGateway. 

   ```azurepowershell-interactive
    Update-AzVirtualHub -ResourceGroupName "[resource group name]" -Name "[virtual hub name]" -HubRoutingPreference "VpnGateway"
   ```

1. After the settings have saved, you can verify the configuration by running the following PowerShell command for virtual hub.

   ```azurepowershell-interactive
   Get-AzVirtualHub -ResourceGroupName "[resource group name]" -Name "[virtual hub name]" |  select-object HubRoutingPreference
   ```

## Next steps

To learn more about virtual hub routing preference, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).
