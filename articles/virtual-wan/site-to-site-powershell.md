---
title: 'Create a Site-to-Site connection to Azure Virtual WAN using PowerShell'
description: Learn how to create a Site-to-Site connection from your branch site to Azure Virtual WAN using PowerShell.
titleSuffix: Azure Virtual WAN
services: virtual-wan
author: reasuquo

ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/13/2022
ms.author: reasuquo
ms.custom: devx-track-azurepowershell

---
# Create a Site-to-Site connection to Azure Virtual WAN using PowerShell

This article shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv1 and IKEv2) VPN connection via PowerShell. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).

:::image type="content" source="./media/virtual-wan-about/virtualwan.png" alt-text="Screenshot shows a networking diagram for Virtual WAN.":::

## Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* Decide the IP address range that you want to use for your virtual hub private address space. This information is used when configuring your virtual hub. A virtual hub is a virtual network that is created and used by Virtual WAN. It's the core of your Virtual WAN network in a region. The address space range must conform the certain rules:

  * The address range that you specify for the hub can't overlap with any of the existing virtual networks that you connect to. 
  * The address range can't overlap with the on-premises address ranges that you connect to.
  * If you are unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="openvwan"></a>Create a virtual WAN

Before you can create a virtual wan, you have to create a resource group to host the virtual wan or use an existing resource group. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a new resource group named **testRG** in the **West US** location: 

Create a resource group:

```azurepowershell-interactive 
New-AzResourceGroup -Location "West US" -Name "testRG" 
``` 

Create the virtual wan:

```azurepowershell-interactive
$virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
```

### To create the virtual wan in an already existing resource group

Use the steps in this section if you need to create the virtual wan in an already existing resource group.

1. Set the variables for the existing resource group

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
   ```

2. Create the virtual wan.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```


## <a name="hub"></a>Create the hub and configure hub settings

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Create a virtual hub with [New-AzVirtualHub](/powershell/module/az.Network/New-AzVirtualHub). This example creates a default virtual hub named **westushub** with the specified address prefix and a location for the hub: 

```azurepowershell-interactive 
$virtualHub = New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.11.0.0/24" -Location "westus"
``` 

## <a name="gateway"></a>Create a site-to-site VPN gateway

In this section, you create a site-to-site VPN gateway that will be in the same location as the referenced VirtualHub. The site-to-site VPN gateway scales based on the scale unit specified and can take about 30 minutes to create.
```azurepowershell-interactive 
New-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw" -VirtualHubId $virtualHub.Id -VpnGatewayScaleUnit 2
``` 

Once your VPNgateway is created, you can view it using the following example. 

```azurepowershell-interactive
Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
```

## <a name="site"></a>Create a site and the connections

In this section, you create sites that correspond to your physical locations and the connections. These sites contain your on-premises VPN device endpoints, you can create up to 1000 sites per virtual hub in a virtual WAN. If you have multiple hubs, you can create 1000 per each of those hubs.

Set the variable for the vpnGateway and for the IP address space that is located on your on-premises site, traffic destined for this address space is routed to your local site. This is required when BGP is not enabled for the site:

```azurepowershell-interactive 
$vpnGateway = Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
$vpnSiteAddressSpaces = New-Object string[] 2
$vpnSiteAddressSpaces[0] = "192.168.2.0/24"
$vpnSiteAddressSpaces[1] = "192.168.3.0/24"
``` 

Create Links to add information about the physical links at the branch including metadata about the link speed, link provider name and add the public IP address of the on-premise device.

```azurepowershell-interactive
$vpnSiteLink1 = New-AzVpnSiteLink -Name "testVpnSiteLink1" -IpAddress "15.25.35.45" -LinkProviderName "SomeTelecomProvider" -LinkSpeedInMbps "10"
$vpnSiteLink2 = New-AzVpnSiteLink -Name "testVpnSiteLink2" -IpAddress "15.25.35.55" -LinkProviderName "SomeTelecomProvider2" -LinkSpeedInMbps "100"
```

Create the vpnSite and reference the variables of the vpnSiteLinks just created:

```azurepowershell-interactive

$vpnSite = New-AzVpnSite -ResourceGroupName "testRG" -Name "testVpnSite" -Location "West US" -VirtualWan $virtualWan -AddressSpace $vpnSiteAddressSpaces -DeviceModel "SomeDevice" -DeviceVendor "SomeDeviceVendor" -VpnSiteLink @($vpnSiteLink1, $vpnSiteLink2)
```

Next is the Vpn Site Link connection which is composed of 2 Active-Active tunnels from a branch/Site known as VPNSite to the scalable gateway:

```azurepowershell-interactive
$vpnSiteLinkConnection1 = New-AzVpnSiteLinkConnection -Name "testLinkConnection1" -VpnSiteLink $vpnSite.VpnSiteLinks[0] -ConnectionBandwidth 100
$vpnSiteLinkConnection2 = New-AzVpnSiteLinkConnection -Name "testLinkConnection2" -VpnSiteLink $vpnSite.VpnSiteLinks[1] -ConnectionBandwidth 10
```

## <a name="connectsites"></a>Connect the VPN site to a hub

Finally, you connect your VPN site to the hub Site-to-Site VPN gateway:

```azurepowershell-interactive
New-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection" -VpnSite $vpnSite -VpnSiteLinkConnection @($vpnSiteLinkConnection1, $vpnSiteLinkConnection2)
```

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

1. Declare the variables 

    ```azurepowershell-interactive
    $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
    $virtualWan = Get-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN"
    $virtualHub = Get-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
    $vpnGateway = Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
    ```

1. Delete all gateway entities following the below order for the VPN gateway. This can take 30 minutes to complete.

    Delete the VPN Gateway connection to the VPN Sites.
    
     ```azurepowershell-interactive
        Remove-AzVpnConnection -ResourceGroupName $vpnGateway.ResourceGroupName -ParentResourceName $vpnGateway.Name -Name "testConnection"
     ```

    Delete the VPN Gateway. 
    Note that deleting a VPN Gateway will also remove all VPN Express Route Connections associated with it.
    
     ```azurepowershell-interactive
        Remove-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
     ```

1. You can delete the Resource Group to delete all the other resources in the resource group, including the hubs, sites and the virtual WAN.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name "testRG"
    ```

1. Or you can choose to delete each of the resources in the Resource Group

    Delete the VPN site
    
    ```azurepowershell-interactive
    Remove-AzVpnSite -ResourceGroupName "testRG" -Name "testVpnSite"
    ```
    
    Delete the Virtual Hub
    
    ```azurepowershell-interactive
    Remove-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
    ```
    
    Delete the Virtual WAN
    
    ```azurepowershell-interactive
    Remove-AzVirtualWan -Name "MyVirtualWan" -ResourceGroupName "testRG"
    ```



## Next steps

Next, to learn more about Virtual WAN, see:

> [!div class="nextstepaction"]
> * [Virtual WAN FAQ](virtual-wan-faq.md)
