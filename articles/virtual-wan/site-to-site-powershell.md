---
title: 'Create site-to-site connections using Virtual WAN - PowerShell'
description: Learn how to create a site-to-site connection from your branch site to Azure Virtual WAN using PowerShell.
titleSuffix: Azure Virtual WAN
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/15/2023
ms.author: cherylmc
---
# Create a site-to-site connection to Azure Virtual WAN using PowerShell

This article shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv1 and IKEv2) VPN connection via PowerShell. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about Virtual WAN, see the [Virtual WAN overview](virtual-wan-about.md). You can also create this configuration using the [Azure portal](virtual-wan-site-to-site-portal.md) instructions.

:::image type="content" source="./media/site-to-site/site-to-site-diagram.png" alt-text="Screenshot shows a networking diagram for Virtual WAN." lightbox="./media/site-to-site/site-to-site-diagram.png" :::

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

This example creates a new resource group named **TestRG** in the **East US** location. If you want to use an existing resource group instead, you can modify the `$resourceGroup = Get-AzResourceGroup -ResourceGroupName "NameofResourceGroup"` command, and then complete the steps in this exercise using your own values.

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Location "East US" -Name "TestRG" 
   ```

1. Create the virtual wan using the [New-AzVirtualWan](/powershell/module/az.network/new-azvirtualwan) cmdlet.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName TestRG -Name TestVWAN1 -Location "East US"
   ```

## <a name="hub"></a>Create the hub and configure hub settings

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Create a virtual hub with [New-AzVirtualHub](/powershell/module/az.Network/New-AzVirtualHub). This example creates a default virtual hub named **Hub1** with the specified address prefix and a location for the hub.

```azurepowershell-interactive
$virtualHub = New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "TestRG" -Name "Hub1" -AddressPrefix "10.1.0.0/16" -Location "westus"
```

## <a name="gateway"></a>Create a site-to-site VPN gateway

In this section, you create a site-to-site VPN gateway in the same location as the referenced virtual hub. When you create the VPN gateway, you specify the scale units that you want. It takes about 30 minutes for the gateway to create.

1. If you closed Azure Cloud Shell or your connection timed out, you may need to declare the variable again for $virtualHub.

   ```azurepowershell-interactive
   $virtualHub = Get-AzVirtualHub -ResourceGroupName "TestRG" -Name "Hub1"
   ```

1. Create a VPN gateway using the [New-AzVpnGateway](/powershell/module/az.network/new-azvpngateway) cmdlet.

   ```azurepowershell-interactive
   New-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1" -VirtualHubId $virtualHub.Id -VpnGatewayScaleUnit 2
   ```

1. Once your VPN gateway is created, you can view it using the following example.

   ```azurepowershell-interactive
   Get-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1"
   ```

## <a name="site"></a>Create a site and connections

In this section, you create sites that correspond to your physical locations and the connections. These sites contain your on-premises VPN device endpoints, you can create up to 1000 sites per virtual hub in a virtual WAN. If you have multiple hubs, you can create 1000 per each of those hubs.

1. Set the variable for the VPN gateway and for the IP address space that is located on your on-premises site. Traffic destined for this address space is routed to your local site. This is required when BGP isn't enabled for the site.

   ```azurepowershell-interactive
   $vpnGateway = Get-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1"
   $vpnSiteAddressSpaces = New-Object string[] 2
   $vpnSiteAddressSpaces[0] = "192.168.2.0/24"
   $vpnSiteAddressSpaces[1] = "192.168.3.0/24"
   ```

1. Create links to add information about the physical links at the branch including metadata about the link speed, link provider name, and the public IP address of the on-premises device.

   ```azurepowershell-interactive
   $vpnSiteLink1 = New-AzVpnSiteLink -Name "TestSite1Link1" -IpAddress "15.25.35.45" -LinkProviderName "SomeTelecomProvider" -LinkSpeedInMbps "10"
   $vpnSiteLink2 = New-AzVpnSiteLink -Name "TestSite1Link2" -IpAddress "15.25.35.55" -LinkProviderName "SomeTelecomProvider2" -LinkSpeedInMbps "100"
   ```

1. Create the VPN site, referencing the variables of the VPN site links you just created.

   If you closed Azure Cloud Shell or your connection timed out, redeclare the virtual WAN variable:

   ```azurepowershell-interactive
   $virtualWan = Get-AzVirtualWAN -ResourceGroupName "TestRG" -Name "TestVWAN1"
   ```
  
   Create the VPN site using the [New-AzVpnSite](/powershell/module/az.network/new-azvpnsite) cmdlet.

   ```azurepowershell-interactive
   $vpnSite = New-AzVpnSite -ResourceGroupName "TestRG" -Name "TestSite1" -Location "westus" -VirtualWan $virtualWan -AddressSpace $vpnSiteAddressSpaces -DeviceModel "SomeDevice" -DeviceVendor "SomeDeviceVendor" -VpnSiteLink @($vpnSiteLink1, $vpnSiteLink2)
   ```

1. Create the site link connection. The connection is composed of two active-active tunnels from a branch/site to the scalable gateway.

   ```azurepowershell-interactive
   $vpnSiteLinkConnection1 = New-AzVpnSiteLinkConnection -Name "TestLinkConnection1" -VpnSiteLink $vpnSite.VpnSiteLinks[0] -ConnectionBandwidth 100
   $vpnSiteLinkConnection2 = New-AzVpnSiteLinkConnection -Name "testLinkConnection2" -VpnSiteLink $vpnSite.VpnSiteLinks[1] -ConnectionBandwidth 10
   ```

## <a name="connectsites"></a>Connect the VPN site to a hub

Connect your VPN site to the hub site-to-site VPN gateway using the [New-AzVpnConnection](/powershell/module/az.network/new-azvpnconnection) cmdlet.

1. Before running the command, you may need to redeclare the following variables:

   ```azurepowershell-interactive
   $virtualWan = Get-AzVirtualWAN -ResourceGroupName "TestRG" -Name "TestVWAN1"
   $vpnGateway = Get-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1"
   $vpnSite = Get-AzVpnSite -ResourceGroupName "TestRG" -Name "TestSite1"
   ```

1. Connect the VPN site to the hub.

   ```azurepowershell-interactive
   New-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection" -VpnSite $vpnSite -VpnSiteLinkConnection @($vpnSiteLinkConnection1, $vpnSiteLinkConnection2)
   ```

## Connect a VNet to your hub

The next step is to connect the hub to the VNet. If you created a new resource group for this exercise, you typically won't already have a virtual network (VNet) in your resource group. The steps below help you create a VNet if you don't already have one. You can then create a connection between the hub and your VNet.

### Create a virtual network

You can use the following example values to create a VNet. Make sure to substitute the values in the examples for the values you used for your environment. For more information, see [Quickstart: Use Azure PowerShell to create a virtual network](../virtual-network/quick-create-powershell.md).

1. Create a VNet.

   ```azurepowershell-interactive
   $vnet = @{
      Name = 'VNet1'
      ResourceGroupName = 'TestRG'
      Location = 'eastus'
      AddressPrefix = '10.21.0.0/16'
   }
   $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Specify subnet settings.

   ```azurepowershell-interactive
   $subnet = @{
      Name = 'Subnet-1'
      VirtualNetwork = $virtualNetwork
      AddressPrefix = '10.21.0.0/24'
   }
   $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
   ```

1. Set the VNet.

   ```azurepowershell-interactive
   $virtualNetwork | Set-AzVirtualNetwork
   ```

### Connect a VNet to a hub

Once you have a VNet, follow the steps in this article to connect your VNet to the VWAN hub: [Connect a VNet to a Virtual WAN hub](howto-connect-vnet-hub-powershell.md).

## Configure VPN device

To configure your on-premises VPN device, follow the steps in the [Site-to-site: Azure portal](virtual-wan-site-to-site-portal.md#device) article.

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

Delete all gateway entities in the following order:

1. Declare the variables.

    ```azurepowershell-interactive
    $resourceGroup = Get-AzResourceGroup -ResourceGroupName "TestRG" 
    $virtualWan = Get-AzVirtualWan -ResourceGroupName "TestRG" -Name "TestVWAN1"
    $virtualHub = Get-AzVirtualHub -ResourceGroupName "TestRG" -Name "Hub1"
    $vpnGateway = Get-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1"
    ```

1. Delete the VPN gateway connection to the VPN sites.

   ```azurepowershell-interactive
   Remove-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection"
   ```

1. Delete the VPN gateway. Deleting a VPN gateway will also remove all VPN ExpressRoute connections associated with it.

   ```azurepowershell-interactive
   Remove-AzVpnGateway -ResourceGroupName "TestRG" -Name "vpngw1"
   ```

1. At this point, you can do one of two things:

   * You can delete the entire resource group in order to delete all the remaining resources it contains, including the hubs, sites, and the virtual WAN.
   * You can choose to delete each of the resources in the resource group.

   **To delete the entire resource group:**

   ```azurepowershell-interactive
   Remove-AzResourceGroup -Name "TestRG"
   ```

   **To delete each resource in the resource group:**

   * Delete the VPN site.

      ```azurepowershell-interactive
      Remove-AzVpnSite -ResourceGroupName "TestRG" -Name "TestSite1"
      ```

   * Delete the virtual hub.

      ```azurepowershell-interactive
      Remove-AzVirtualHub -ResourceGroupName "TestRG" -Name "Hub1"
      ```

   * Delete the virtual WAN.

      ```azurepowershell-interactive
      Remove-AzVirtualWan -Name "TestVWAN1" -ResourceGroupName "TestRG"
      ```

## Next steps

Next, to learn more about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
