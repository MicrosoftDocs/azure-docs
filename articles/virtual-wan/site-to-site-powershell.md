---
title: 'Create site-to-site connections using Virtual WAN - PowerShell'
description: Learn how to create a site-to-site connection from your branch site to Azure Virtual WAN using PowerShell.
titleSuffix: Azure Virtual WAN
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/04/2022
ms.author: cherylmc

---
# Create a site-to-site connection to Azure Virtual WAN using PowerShell

This article shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv1 and IKEv2) VPN connection via PowerShell. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about Virtual WAN, see the [Virtual WAN overview](virtual-wan-about.md).

:::image type="content" source="./media/virtual-wan-about/virtualwan.png" alt-text="Screenshot shows a networking diagram for Virtual WAN.":::

## Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* Decide the IP address range that you want to use for your virtual hub private address space. This information is used when configuring your virtual hub. A virtual hub is a virtual network that is created and used by Virtual WAN. It's the core of your Virtual WAN network in a region. The address space range must conform to certain rules.

  * The address range that you specify for the hub can't overlap with any of the existing virtual networks that you connect to.
  * The address range can't overlap with the on-premises address ranges that you connect to.
  * If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="openvwan"></a>Create a virtual WAN

Before you can create a virtual wan, you have to create a resource group to host the virtual wan or use an existing resource group. Use one of the following examples.

**New resource group** - This example creates a new resource group named **testRG** in the **West US** location.

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Location "West US" -Name "testRG" 
   ```

1. Create the virtual wan.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```

**Existing resource group** - Use the following steps if you want to create the virtual wan in an already existing resource group.

1. Set the variables for the existing resource group.

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
   ```

2. Create the virtual wan.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```

## <a name="hub"></a>Create the hub and configure hub settings

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Create a virtual hub with [New-AzVirtualHub](/powershell/module/az.Network/New-AzVirtualHub). This example creates a default virtual hub named **westushub** with the specified address prefix and a location for the hub.

```azurepowershell-interactive
$virtualHub = New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.11.0.0/24" -Location "westus"
```

## <a name="gateway"></a>Create a site-to-site VPN gateway

In this section, you create a site-to-site VPN gateway that will be in the same location as the referenced virtual hub. When you create the VPN gateway, you specify the scale units that you want. It takes about 30 minutes for the gateway to create.

1. Create a VPN gateway.

   ```azurepowershell-interactive
   New-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw" -VirtualHubId $virtualHub.Id -VpnGatewayScaleUnit 2
   ```

1. Once your VPN gateway is created, you can view it using the following example.

   ```azurepowershell-interactive
   Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
   ```

## <a name="site"></a>Create a site and connections

In this section, you create sites that correspond to your physical locations and the connections. These sites contain your on-premises VPN device endpoints, you can create up to 1000 sites per virtual hub in a virtual WAN. If you have multiple hubs, you can create 1000 per each of those hubs.

1. Set the variable for the VPN gateway and for the IP address space that is located on your on-premises site. Traffic destined for this address space is routed to your local site. This is required when BGP isn't enabled for the site.

   ```azurepowershell-interactive
   $vpnGateway = Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
   $vpnSiteAddressSpaces = New-Object string[] 2
   $vpnSiteAddressSpaces[0] = "192.168.2.0/24"
   $vpnSiteAddressSpaces[1] = "192.168.3.0/24"
   ```

1. Create links to add information about the physical links at the branch including metadata about the link speed, link provider name, and the public IP address of the on-premises device.

   ```azurepowershell-interactive
   $vpnSiteLink1 = New-AzVpnSiteLink -Name "testVpnSiteLink1" -IpAddress "15.25.35.45" -LinkProviderName "SomeTelecomProvider" -LinkSpeedInMbps "10"
   $vpnSiteLink2 = New-AzVpnSiteLink -Name "testVpnSiteLink2" -IpAddress "15.25.35.55" -LinkProviderName "SomeTelecomProvider2" -LinkSpeedInMbps "100"
   ```

1. Create the VPN site, referencing the variables of the VPN site links you just created.

   ```azurepowershell-interactive
   $vpnSite = New-AzVpnSite -ResourceGroupName "testRG" -Name "testVpnSite" -Location "West US" -VirtualWan $virtualWan -AddressSpace $vpnSiteAddressSpaces -DeviceModel "SomeDevice" -DeviceVendor "SomeDeviceVendor" -VpnSiteLink @($vpnSiteLink1, $vpnSiteLink2)
   ```

1. Create the site link connection. The connection is composed of 2 active-active tunnels from a branch/site to the scalable gateway.

   ```azurepowershell-interactive
   $vpnSiteLinkConnection1 = New-AzVpnSiteLinkConnection -Name "testLinkConnection1" -VpnSiteLink $vpnSite.VpnSiteLinks[0] -ConnectionBandwidth 100
   $vpnSiteLinkConnection2 = New-AzVpnSiteLinkConnection -Name "testLinkConnection2" -VpnSiteLink $vpnSite.VpnSiteLinks[1] -ConnectionBandwidth 10
   ```

## <a name="connectsites"></a>Connect the VPN site to a hub

Connect your VPN site to the hub site-to-site VPN gateway.

```azurepowershell-interactive
New-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection" -VpnSite $vpnSite -VpnSiteLinkConnection @($vpnSiteLinkConnection1, $vpnSiteLinkConnection2)
```

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

1. Delete all gateway entities following the below order for the VPN gateway.

1. Declare the variables.

    ```azurepowershell-interactive
    $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
    $virtualWan = Get-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN"
    $virtualHub = Get-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
    $vpnGateway = Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
    ```

1. Delete the VPN gateway connection to the VPN sites.

   ```azurepowershell-interactive
   Remove-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection"
   ```

1. Delete the VPN gateway. Deleting a VPN gateway will also remove all VPN ExpressRoute connections associated with it.

   ```azurepowershell-interactive
   Remove-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
   ```

1. You can delete the entire resource group in order to delete all the remaining resources it contains, including the hubs, sites, and the virtual WAN.

   ```azurepowershell-interactive
   Remove-AzResourceGroup -Name "testRG"
   ```

1. Or, you can choose to delete each of the resources in the Resource Group.

   Delete the VPN site.

   ```azurepowershell-interactive
   Remove-AzVpnSite -ResourceGroupName "testRG" -Name "testVpnSite"
   ```

   Delete the virtual hub.

   ```azurepowershell-interactive
   Remove-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
   ```

   Delete the virtual WAN.

   ```azurepowershell-interactive
   Remove-AzVirtualWan -Name "MyVirtualWan" -ResourceGroupName "testRG"
   ```

## Next steps

Next, to learn more about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
