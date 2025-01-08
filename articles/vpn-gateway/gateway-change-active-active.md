---
title: 'Change a gateway to active-active mode'
titleSuffix: Azure VPN Gateway
description: Learn how to change a VPN gateway from active-standby to active-active.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 12/05/2024
ms.author: cherylmc

---

# Change a VPN gateway mode: active-active

The steps in this article help you change active-standby VPN gateways to active-active. You can also change an active-active gateway to active-standby. For more information about active-active gateways, see [About active-active gateways](about-active-active-gateways.md) and [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md).

BGP considerations:

* **Active-standby mode to active-active mode**: When you change an active-standby mode gateway to active-active mode, if you have BGP sessions running, the Azure VPN Gateway BGP configuration changes and two newly assigned BGP IPs are provisioned within the Gateway Subnet address range. The old Azure VPN Gateway BGP IP address will no longer exist. This incurs downtime. Updating the BGP peers on the on-premises devices is required. Once the gateway is finished provisioning, the new BGP IPs can be obtained and the on-premises device configuration needs to be updated accordingly. This applies to non APIPA BGP IPs. To understand how to configure BGP in Azure, see [How to configure BGP on Azure VPN gateways](bgp-howto.md).

* **Active-active mode to active-standby mode**: When you change an active-active mode gateway to active-standby, if you have BGP sessions running, the Azure VPN Gateway BGP configuration changes from two BGP IP addresses to a single BGP address. The platform generally assigns the last usable IP of the Gateway Subnet. This incurs downtime. Updating the BGP peers on the on-premises devices is required. This applies to non APIPA BGP IPs. To understand how to configure BGP in Azure, see [How to configure BGP on Azure VPN gateways](bgp-howto.md).

## Azure portal

Open the Azure portal and navigate to the page for your virtual network gateway. You can change the gateway mode on the **Configuration** page.

### Change a gateway mode to active-active

Use the following steps to convert active-standby mode gateway to active-active mode.

1. Navigate to the page for your virtual network gateway.

1. On the left menu, select **Configuration**.

1. On the **Configuration** page, configure the following settings:

   * Change the Active-active mode to **Enabled**.
   * For Second public IP address, if you already have an IP address that you previously created that's available to dedicate to this resource, you can select it from the **SECOND PUBLIC IP ADDRESS** dropdown. Otherwise, select **Add new** to open the **Add a public IP** settings. **Name** the new IP address, and then click **OK**.

1. At the top of the **Configuration** page, click **Save**. This update can take approximately 45 minutes, depending on your gateway SKU.

### Change a gateway mode to active-standby

Use the following steps to convert active-active mode gateway to active-standby mode.

1. Navigate to the page for your virtual network gateway.

1. On the left menu, select **Configuration**.

1. On the **Configuration** page, change the Active-active mode to **Disabled**.

1. At the top of the **Configuration** page, click **Save**. This update can take approximately 45 minutes, depending on your gateway SKU.

## PowerShell

When you change an active-standby gateway to active-active mode, you create another public IP address, then add a second Gateway IP configuration.

### Change a gateway to active-active

The following example converts an active-standby gateway into an active-active gateway.

1. Declare your variables. Replace the following parameters used for the examples with the settings that you require for your own configuration, then declare these variables.

   ```azurepowershell-interactive
   $GWName = "VNet1GW"
   $VNetName = "VNet1"
   $RG = "TestRG1"
   $GWIPName2 = "VNet1GWpip2"
   $GWIPconf2 = "gw1ipconf2"
   ```

   After declaring the variables, you can copy and paste this example to your PowerShell console.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   $gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
   $location = $gw.Location
   ```

1. Create the public IP address, then add the second gateway IP configuration.

   ```azurepowershell-interactive
   $gw1pip2 = New-AzPublicIpAddress -Name $GWIPName2 -ResourceGroupName $RG -Location $location -AllocationMethod Static -SKU Standard -Zone 1,2,3
   Add-AzVirtualNetworkGatewayIpConfig -VirtualNetworkGateway $gw -Name $GWIPconf2 -Subnet $subnet -PublicIpAddress $gw1pip2
   ```

1. Enable active-active mode and update the gateway. In this step, you enable active-active mode and update the gateway. Notice that in this step, you must set the gateway object in PowerShell to trigger the actual update. This update can take approximately 45 minutes, depending on your gateway SKU.

   ```azurepowershell-interactive
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -EnableActiveActiveFeature
   ```

### Change a gateway to active-standby

1. Declare your variables. Replace the following parameters used for the examples with the settings that you require for your own configuration, then declare these variables.

   ```azurepowershell-interactive
   $GWName = "VNet1GW"
   $RG = "TestRG1"
   ```

   After declaring the variables, get the name of the IP configuration you want to remove.

   ```azurepowershell-interactive
   $gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
   $ipconfname = $gw.IpConfigurations[1].Name
   ```

1. Remove the gateway IP configuration and disable the active-active mode. Use this example to remove the gateway IP configuration and disable active-active mode. Notice that you must set the gateway object in PowerShell to trigger the actual update. This update can take approximately 45 minutes, depending on your gateway SKU.

   ```azurepowershell-interactive
   Remove-AzVirtualNetworkGatewayIpConfig -Name $ipconfname -VirtualNetworkGateway $gw
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -DisableActiveActiveFeature
   ```

## Next steps

For more information about active-active gateways, see [About active-active gateways](vpn-gateway-about-vpn-gateway-settings.md#active).
