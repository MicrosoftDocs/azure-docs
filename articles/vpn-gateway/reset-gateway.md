---
title: 'Reset a VPN gateway or connection to reestablish IPsec tunnels'
titleSuffix: Azure VPN Gateway
description: Learn how to reset a gateway or a gateway connection to reestablish IPsec tunnels.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc 
---
# Reset a VPN gateway or a connection

Resetting an Azure VPN gateway or gateway connection is helpful if you lose cross-premises VPN connectivity on one or more site-to-site VPN tunnels. In this situation, your on-premises VPN devices are all working correctly, but aren't able to establish IPsec tunnels with the Azure VPN gateways. This article helps you reset a VPN gateway or gateway connection.

## What happens during a reset

### Gateway reset

A VPN gateway is composed of two VM instances running in an active-standby configuration. When you reset the gateway, it reboots the gateway, and then reapplies the cross-premises configurations to it. The gateway keeps the public IP address it already has. This means you won’t need to update the VPN router configuration with a new public IP address for Azure VPN gateway.

When you issue the command to reset the gateway, the current active instance of the Azure VPN gateway is rebooted immediately. There will be a brief gap during the failover from the active instance (being rebooted), to the standby instance. The gap should be less than one minute.

If the connection isn't restored after the first reboot, issue the same command again to reboot the second VM instance (the new active gateway). If the two reboots are requested back to back, there will be a slightly longer period where both VM instances (active and standby) are being rebooted. This will cause a longer gap on the VPN connectivity, up to 30 to 45 minutes for VMs to complete the reboots.

After two reboots, if you're still experiencing cross-premises connectivity problems, please open a support request from the Azure portal.

### Connection reset

When you select to reset a connection, the gateway doesn't reboot. Only the selected connection is reset and restored.

## Reset a connection

You can reset a connection easily using the Azure portal.

1. Go to the **Connection** that you want to reset. You can find the connection resource either by locating it in **All resources**, or by going to the **'Gateway Name' -> Connections -> 'Connection Name'**
1. On the **Connection** page, in the left pane, scroll down to the **Support + Troubleshooting** section and select **Reset**.
1. On the **Reset** page, click **Reset** to reset the connection.

   :::image type="content" source="./media/reset-gateway/reset-connection.png" alt-text="Screenshot showing the Reset button selected." lightbox="./media/reset-gateway/reset-connection.png":::

## Reset a gateway

Before you reset your gateway, verify the key items listed below for each IPsec site-to-site (S2S) VPN tunnel. Any mismatch in the items will result in the disconnect of S2S VPN tunnels. Verifying and correcting the configurations for your on-premises and Azure VPN gateways saves you from unnecessary reboots and disruptions for the other working connections on the gateways.

Verify the following items before resetting your gateway:

* The Internet IP addresses (VIPs) for both the Azure VPN gateway and the on-premises VPN gateway are configured correctly in both the Azure and the on-premises VPN policies.
* The preshared key must be the same on both Azure and on-premises VPN gateways.
* If you apply specific IPsec/IKE configuration, such as encryption, hashing algorithms, and PFS (Perfect Forward Secrecy), ensure both the Azure and on-premises VPN gateways have the same configurations.

### <a name="portal"></a>Azure portal

You can reset a Resource Manager VPN gateway using the Azure portal.

[!INCLUDE [portal steps](../../includes/vpn-gateway-reset-gw-portal-include.md)]

### <a name="ps"></a>PowerShell

The cmdlet for resetting a gateway is **Reset-AzVirtualNetworkGateway**. Before performing a reset, make sure you have the latest version of the [PowerShell Az cmdlets](/powershell/module/az.network). The following example resets a virtual network gateway named VNet1GW in the TestRG1 resource group:

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1
Reset-AzVirtualNetworkGateway -VirtualNetworkGateway $gw
```

When you receive a return result, you can assume the gateway reset was successful. However, there's nothing in the return result that indicates explicitly that the reset was successful. If you want to look closely at the history to see exactly when the gateway reset occurred, you can view that information in the [Azure portal](https://portal.azure.com). In the portal, navigate to **'GatewayName' -> Resource Health**.

### <a name="cli"></a>Azure CLI

To reset the gateway, use the [az network vnet-gateway reset](/cli/azure/network/vnet-gateway) command. The following example resets a virtual network gateway named VNet5GW in the TestRG5 resource group:

```azurecli-interactive
az network vnet-gateway reset -n VNet5GW -g TestRG5
```

When you receive a return result, you can assume the gateway reset was successful. However, there's nothing in the return result that indicates explicitly that the reset was successful. If you want to look closely at the history to see exactly when the gateway reset occurred, you can view that information in the [Azure portal](https://portal.azure.com). In the portal, navigate to **'GatewayName' -> Resource Health**.

### <a name="resetclassic"></a>Reset a classic gateway

The cmdlet for resetting a classic gateway is **Reset-AzureVNetGateway**. The Azure PowerShell cmdlets for Service Management must be installed locally on your desktop. You can't use Azure Cloud Shell. Before performing a reset, make sure you have the latest version of the [Service Management (SM) PowerShell cmdlets](/powershell/azure/servicemanagement/install-azure-ps#azure-service-management-cmdlets).

When using this command, make sure you're using the full name of the virtual network. Classic VNets that were created using the portal have a long name that is required for PowerShell. You can view the long name by using 'Get-AzureVNetConfig -ExportToFile C:\Myfoldername\NetworkConfig.xml'.

The following example resets the gateway for a virtual network named "Group TestRG1 TestVNet1" (which shows as simply "TestVNet1" in the portal):

```powershell
Reset-AzureVNetGateway –VnetName 'Group TestRG1 TestVNet1'
```

Result:

```powershell
Error          :
HttpStatusCode : OK
Id             : f1600632-c819-4b2f-ac0e-f4126bec1ff8
Status         : Successful
RequestId      : 9ca273de2c4d01e986480ce1ffa4d6d9
StatusCode     : OK
```

## Next steps

For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).