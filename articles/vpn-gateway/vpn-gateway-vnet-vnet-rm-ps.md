---
title: 'Connect a VNet to another VNet using a VPN Gateway VNet-to-VNet connection: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to connect virtual networks together using a VNet-to-VNet connection and PowerShell.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/22/2023
ms.author: cherylmc
---
# Configure a VNet-to-VNet VPN gateway connection using PowerShell

This article helps you connect virtual networks by using the VNet-to-VNet connection type. The virtual networks can be in the same or different regions, and from the same or different subscriptions. When you connect virtual networks from different subscriptions, the subscriptions don't need to be associated with the same Active Directory tenant.

The steps in this article apply to the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) and use PowerShell. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md)
> * [Azure CLI](vpn-gateway-howto-vnet-vnet-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-vnet-vnet-portal-classic.md)
> * [Connect different deployment models - Azure portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [Connect different deployment models - PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png" alt-text="VNet to VNet diagram.":::

## <a name="about"></a>About connecting VNets

There are multiple ways to connect VNets. The following sections describe different ways to connect virtual networks.

### VNet-to-VNet

Configuring a VNet-to-VNet connection is a good way to easily connect VNets. Connecting a virtual network to another virtual network using the VNet-to-VNet connection type (VNet2VNet) is similar to creating a Site-to-Site IPsec connection to an on-premises location.  Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE, and both function the same way when communicating. The difference between the connection types is the way the local network gateway is configured. When you create a VNet-to-VNet connection, you don't see the local network gateway address space. It's automatically created and populated. If you update the address space for one VNet, the other VNet automatically knows to route to the updated address space. Creating a VNet-to-VNet connection is typically faster and easier than creating a Site-to-Site connection between VNets.

### Site-to-Site (IPsec)

If you're working with a complicated network configuration, you may prefer to connect your VNets using the [Site-to-Site](vpn-gateway-create-site-to-site-rm-powershell.md) steps, instead the VNet-to-VNet steps. When you use the Site-to-Site steps, you create and configure the local network gateways manually. The local network gateway for each VNet treats the other VNet as a local site. This lets you specify additional address space for the local network gateway in order to route traffic. If the address space for a VNet changes, you need to update the corresponding local network gateway to reflect the change. It doesn't automatically update.

### VNet peering

You may want to consider connecting your VNets using VNet Peering. VNet peering doesn't use a VPN gateway and has different constraints. Additionally, [VNet peering pricing](https://azure.microsoft.com/pricing/details/virtual-network) is calculated differently than [VNet-to-VNet VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway). For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

## <a name="why"></a>Why create a VNet-to-VNet connection?

You may want to connect virtual networks using a VNet-to-VNet connection for the following reasons:

* **Cross region geo-redundancy and geo-presence**

  * You can set up your own geo-replication or synchronization with secure connectivity without going over Internet-facing endpoints.
  * With Azure Traffic Manager and Load Balancer, you can set up highly available workload with geo-redundancy across multiple Azure regions. One important example is to set up SQL Always On with Availability Groups spreading across multiple Azure regions.
* **Regional multi-tier applications with isolation or administrative boundary**

  * Within the same region, you can set up multi-tier applications with multiple virtual networks connected together due to isolation or administrative requirements.

VNet-to-VNet communication can be combined with multi-site configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity.

## <a name="steps"></a>Which VNet-to-VNet steps should I use?

In this article, you see two different sets of steps. One set of steps for [VNets that reside in the same subscription](#samesub) and one for [VNets that reside in different subscriptions](#difsub).
The key difference between the sets is that you must use separate PowerShell sessions when configuring the connections for VNets that reside in different subscriptions.

For this exercise, you can combine configurations, or just choose the one that you want to work with. All of the configurations use the VNet-to-VNet connection type. Network traffic flows between the VNets that are directly connected to each other. In this exercise, traffic from TestVNet4 doesn't route to TestVNet5.

* [VNets that reside in the same subscription](#samesub): The steps for this configuration use TestVNet1 and TestVNet4.

* [VNets that reside in different subscriptions](#difsub): The steps for this configuration use TestVNet1 and TestVNet5.

## <a name="samesub"></a>How to connect VNets that are in the same subscription

You can complete the following steps using Azure Cloud Shell. If you would rather install latest version of the Azure PowerShell module locally, see [How to install and configure Azure PowerShell](/powershell/azure/).

Because it takes 45 minutes or more to create a gateway, Azure Cloud Shell times out periodically during this exercise. You can restart Cloud Shell by clicking in the upper left of the terminal. Be sure to redeclare any variables when you restart the terminal.

### <a name="Step1"></a>Step 1 - Plan your IP address ranges

In the following steps, you create two virtual networks along with their respective gateway subnets and configurations. You then create a VPN connection between the two VNets. It’s important to plan the IP address ranges for your network configuration. Keep in mind that you must make sure that none of your VNet ranges or local network ranges overlap in any way. In these examples, we don't include a DNS server. If you want name resolution for your virtual networks, see [Name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

We use the following values in the examples:

**Values for TestVNet1:**

* VNet Name: TestVNet1
* Resource Group: TestRG1
* Location: East US
* TestVNet1: 10.1.0.0/16
* FrontEnd: 10.1.0.0/24
* GatewaySubnet: 10.1.255.0/27
* GatewayName: VNet1GW
* Public IP: VNet1GWIP
* VPNType: RouteBased
* Connection(1to4): VNet1toVNet4
* Connection(1to5): VNet1toVNet5 (For VNets in different subscriptions)
* ConnectionType: VNet2VNet

**Values for TestVNet4:**

* VNet Name: TestVNet4
* TestVNet2: 10.41.0.0/16
* FrontEnd: 10.41.0.0/24
* GatewaySubnet: 10.41.255.0/27
* Resource Group: TestRG4
* Location: West US
* GatewayName: VNet4GW
* Public IP: VNet4GWIP
* VPNType: RouteBased
* Connection: VNet4toVNet1
* ConnectionType: VNet2VNet

### <a name="Step2"></a>Step 2 - Create and configure TestVNet1

For the following steps, you can either use Azure Cloud Shell, or you can run PowerShell locally. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).

> [!NOTE]
> You may see warnings saying "The output object type of this cmdlet will be modified in a future release". This is expected behavior and you can safely ignore these warnings.

1. Declare your variables. This example declares the variables using the values for this exercise. In most cases, you should replace the values with your own. However, you can use these variables if you're running through the steps to become familiar with this type of configuration. Modify the variables if needed, then copy and paste them into your PowerShell console.

   ```azurepowershell-interactive
   $RG1 = "TestRG1"
   $Location1 = "East US"
   $VNetName1 = "TestVNet1"
   $FESubName1 = "FrontEnd"
   $VNetPrefix1 = "10.1.0.0/16"
   $FESubPrefix1 = "10.1.0.0/24"
   $GWSubPrefix1 = "10.1.255.0/27"
   $GWName1 = "VNet1GW"
   $GWIPName1 = "VNet1GWIP"
   $GWIPconfName1 = "gwipconf1"
   $Connection14 = "VNet1toVNet4"
   $Connection15 = "VNet1toVNet5"
   ```

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name $RG1 -Location $Location1
   ```

1. Create the subnet configurations for TestVNet1. This example creates a virtual network named TestVNet1 and two subnets, one called GatewaySubnet, and one called FrontEnd. When substituting values, it's important that you always name your gateway subnet specifically GatewaySubnet. If you name it something else, your gateway creation fails. For this reason, it isn't assigned via variable in the example.

   The following example uses the variables that you set earlier. In this example, the gateway subnet is using a /27. While it's possible to create a gateway subnet using /28 for this configuration, we recommend that you create a larger subnet that includes more addresses by selecting at least /27. This will allow for enough addresses to accommodate possible additional configurations that you may want in the future.

   ```azurepowershell-interactive
   $fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1
   $gwsub1 = New-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix $GWSubPrefix1
   ```

1. Create TestVNet1.

   ```azurepowershell-interactive
   New-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 `
   -Location $Location1 -AddressPrefix $VNetPrefix1 -Subnet $fesub1,$gwsub1
   ```

1. A VPN gateway must have an allocated public IP address. When you create a connection to a VPN gateway, this is the IP address that you specify. Use the following example to request a public IP address.

   ```azurepowershell-interactive
   $gwpip1 = New-AzPublicIpAddress -Name $GWIPName1 -ResourceGroupName $RG1 `
   -Location $Location1 -AllocationMethod Static -Sku Standard
   ```

1. Create the gateway configuration. The gateway configuration defines the subnet and the public IP address to use. Use the example to create your gateway configuration.

   ```azurepowershell-interactive
   $vnet1 = Get-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
   $subnet1 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
   $gwipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName1 `
   -Subnet $subnet1 -PublicIpAddress $gwpip1
   ```

1. Create the gateway for TestVNet1. In this step, you create the virtual network gateway for your TestVNet1. VNet-to-VNet configurations require a RouteBased VpnType. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 `
   -Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn `
   -VpnType RouteBased -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
   ```

After you finish the commands, it will take 45 minutes or more to create this gateway. If you're using Azure Cloud Shell, you can restart your Cloud Shell session by clicking in the upper left of the Cloud Shell terminal, then configure TestVNet4. You don't need to wait until the TestVNet1 gateway completes.

### Step 3: Create and configure TestVNet4

Create TestVNet4. Use the following steps, replacing the values with your own when needed.

1. Connect and declare your variables. Be sure to replace the values with the ones that you want to use for your configuration.

   ```azurepowershell-interactive
   $RG4 = "TestRG4"
   $Location4 = "West US"
   $VnetName4 = "TestVNet4"
   $FESubName4 = "FrontEnd"
   $VnetPrefix4 = "10.41.0.0/16"
   $FESubPrefix4 = "10.41.0.0/24"
   $GWSubPrefix4 = "10.41.255.0/27"
   $GWName4 = "VNet4GW"
   $GWIPName4 = "VNet4GWIP"
   $GWIPconfName4 = "gwipconf4"
   $Connection41 = "VNet4toVNet1"
   ```

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name $RG4 -Location $Location4
   ```

1. Create the subnet configurations for TestVNet4.

   ```azurepowershell-interactive
   $fesub4 = New-AzVirtualNetworkSubnetConfig -Name $FESubName4 -AddressPrefix $FESubPrefix4
   $gwsub4 = New-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix $GWSubPrefix4
   ```

1. Create TestVNet4.

   ```azurepowershell-interactive
   New-AzVirtualNetwork -Name $VnetName4 -ResourceGroupName $RG4 `
   -Location $Location4 -AddressPrefix $VnetPrefix4 -Subnet $fesub4,$gwsub4
   ```

1. Request a public IP address.

   ```azurepowershell-interactive
   $gwpip4 = New-AzPublicIpAddress -Name $GWIPName4 -ResourceGroupName $RG4 `
   -Location $Location4 -AllocationMethod Static -Sku Standard 
   ```

1. Create the gateway configuration.

   ```azurepowershell-interactive
   $vnet4 = Get-AzVirtualNetwork -Name $VnetName4 -ResourceGroupName $RG4
   $subnet4 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet4
   $gwipconf4 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName4 -Subnet $subnet4 -PublicIpAddress $gwpip4
   ```

1. Create the TestVNet4 gateway. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName4 -ResourceGroupName $RG4 `
   -Location $Location4 -IpConfigurations $gwipconf4 -GatewayType Vpn `
   -VpnType RouteBased -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
   ```

### Step 4: Create the connections

Wait until both gateways are completed. Restart your Azure Cloud Shell session and copy and paste the variables from the beginning of Step 2 and Step 3 into the console to redeclare values.

1. Get both virtual network gateways.

   ```azurepowershell-interactive
   $vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
   $vnet4gw = Get-AzVirtualNetworkGateway -Name $GWName4 -ResourceGroupName $RG4
   ```

1. Create the TestVNet1 to TestVNet4 connection. In this step, you create the connection from TestVNet1 to TestVNet4. You'll see a shared key referenced in the examples. You can use your own values for the shared key. The important thing is that the shared key must match for both connections. Creating a connection can take a short while to complete.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name $Connection14 -ResourceGroupName $RG1 `
   -VirtualNetworkGateway1 $vnet1gw -VirtualNetworkGateway2 $vnet4gw -Location $Location1 `
   -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
   ```

1. Create the TestVNet4 to TestVNet1 connection. This step is similar to previous step, except you're creating the connection from TestVNet4 to TestVNet1. Make sure the shared keys match. The connection will be established after a few minutes.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name $Connection41 -ResourceGroupName $RG4 `
   -VirtualNetworkGateway1 $vnet4gw -VirtualNetworkGateway2 $vnet1gw -Location $Location4 `
   -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
   ```

1. Verify your connection. See the section [How to verify your connection](#verify).

## <a name="difsub"></a>How to connect VNets that are in different subscriptions

In this scenario, you connect TestVNet1 and TestVNet5. TestVNet1 and TestVNet5 reside in different subscriptions. The subscriptions don't need to be associated with the same Active Directory tenant.

The difference between these steps and the previous set is that some of the configuration steps need to be performed in a separate PowerShell session in the context of the second subscription. Especially when the two subscriptions belong to different organizations.

Due to changing subscription context in this exercise, you may find it easier to use PowerShell locally on your computer, rather than using the Azure Cloud Shell, when you get to Step 8.

### Step 5: Create and configure TestVNet1

You must complete [Step 1](#Step1) and [Step 2](#Step2) from the previous section to create and configure TestVNet1 and the VPN Gateway for TestVNet1. For this configuration, you aren't required to create TestVNet4 from the previous section, although if you do create it, it won't conflict with these steps. Once you complete Step 1 and Step 2, continue with Step 6 to create TestVNet5.

### Step 6: Verify the IP address ranges

It's important to make sure that the IP address space of the new virtual network, TestVNet5, doesn't overlap with any of your VNet ranges or local network gateway ranges. In this example, the virtual networks may belong to different organizations. For this exercise, you can use the following values for the TestVNet5:

**Values for TestVNet5:**

* VNet Name: TestVNet5
* Resource Group: TestRG5
* Location: Japan East
* TestVNet5: 10.51.0.0/16
* FrontEnd: 10.51.0.0/24
* GatewaySubnet: 10.51.255.0.0/27
* GatewayName: VNet5GW
* Public IP: VNet5GWIP
* VPNType: RouteBased
* Connection: VNet5toVNet1
* ConnectionType: VNet2VNet

### Step 7: Create and configure TestVNet5

This step must be done in the context of the new subscription. This part may be performed by the administrator in a different organization that owns the subscription.

1. Declare your variables. Be sure to replace the values with the ones that you want to use for your configuration.

   ```azurepowershell-interactive
   $Sub5 = "Replace_With_the_New_Subscription_Name"
   $RG5 = "TestRG5"
   $Location5 = "Japan East"
   $VnetName5 = "TestVNet5"
   $FESubName5 = "FrontEnd"
   $GWSubName5 = "GatewaySubnet"
   $VnetPrefix5 = "10.51.0.0/16"
   $FESubPrefix5 = "10.51.0.0/24"
   $GWSubPrefix5 = "10.51.255.0/27"
   $GWName5 = "VNet5GW"
   $GWIPName5 = "VNet5GWIP"
   $GWIPconfName5 = "gwipconf5"
   $Connection51 = "VNet5toVNet1"
   ```

1. Connect to subscription 5. Open your PowerShell console and connect to your account. Use the following sample to help you connect:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

   Check the subscriptions for the account.

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

   Specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName $Sub5
   ```

1. Create a new resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name $RG5 -Location $Location5
   ```

1. Create the subnet configurations for TestVNet5.

   ```azurepowershell-interactive
   $fesub5 = New-AzVirtualNetworkSubnetConfig -Name $FESubName5 -AddressPrefix $FESubPrefix5
   $gwsub5 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName5 -AddressPrefix $GWSubPrefix5
   ```

1. Create TestVNet5.

   ```azurepowershell-interactive
   New-AzVirtualNetwork -Name $VnetName5 -ResourceGroupName $RG5 -Location $Location5 `
   -AddressPrefix $VnetPrefix5 -Subnet $fesub5,$gwsub5
   ```

1. Request a public IP address.

   ```azurepowershell-interactive
   $gwpip5 = New-AzPublicIpAddress -Name $GWIPName5 -ResourceGroupName $RG5 `
   -Location $Location5 -AllocationMethod Static -Sku Standard
   ```

1. Create the gateway configuration.

   ```azurepowershell-interactive
   $vnet5 = Get-AzVirtualNetwork -Name $VnetName5 -ResourceGroupName $RG5
   $subnet5  = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet5
   $gwipconf5 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName5 -Subnet $subnet5 -PublicIpAddress $gwpip5
   ```

1. Create the TestVNet5 gateway.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName5 -ResourceGroupName $RG5 -Location $Location5 `
   -IpConfigurations $gwipconf5 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
   ```

### Step 8: Create the connections

In this example, because the gateways are in the different subscriptions, we've split this step into two PowerShell sessions marked as [Subscription 1] and [Subscription 5].

1. **[Subscription 1]** Get the virtual network gateway for Subscription 1. Sign in and connect to Subscription 1 before running the following example:

   ```azurepowershell-interactive
   $vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
   ```

   Copy the output of the following elements and send these to the administrator of Subscription 5 via email or another method.

   ```azurepowershell-interactive
   $vnet1gw.Name
   $vnet1gw.Id
   ```

   These two elements will have values similar to the following example output:

   ```azurepowershell-interactive
   PS D:\> $vnet1gw.Name
   VNet1GW
   PS D:\> $vnet1gw.Id
   /subscriptions/b636ca99-6f88-4df4-a7c3-2f8dc4545509/resourceGroupsTestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW
   ```

1. **[Subscription 5]** Get the virtual network gateway for Subscription 5. Sign in and connect to Subscription 5 before running the following example:

   ```azurepowershell-interactive
   $vnet5gw = Get-AzVirtualNetworkGateway -Name $GWName5 -ResourceGroupName $RG5
   ```

   Copy the output of the following elements and send these to the administrator of Subscription 1 via email or another method.

   ```azurepowershell-interactive
   $vnet5gw.Name
   $vnet5gw.Id
   ```

   These two elements will have values similar to the following example output:

   ```azurepowershell-interactive
   PS C:\> $vnet5gw.Name
   VNet5GW
   PS C:\> $vnet5gw.Id
   /subscriptions/66c8e4f1-ecd6-47ed-9de7-7e530de23994/resourceGroups/TestRG5/providers/Microsoft.Network/virtualNetworkGateways/VNet5GW
   ```

1. **[Subscription 1]** Create the TestVNet1 to TestVNet5 connection. In this step, you create the connection from TestVNet1 to TestVNet5. The difference here is that $vnet5gw can't be obtained directly because it is in a different subscription. You'll need to create a new PowerShell object with the values communicated from Subscription 1 in the previous steps. Use the following example. Replace the Name, ID, and shared key with your own values. The important thing is that the shared key must match for both connections. Creating a connection can take a short while to complete.

   Connect to Subscription 1 before running the following example:

   ```azurepowershell-interactive
   $vnet5gw = New-Object -TypeName Microsoft.Azure.Commands.Network.Models.PSVirtualNetworkGateway
   $vnet5gw.Name = "VNet5GW"
   $vnet5gw.Id   = "/subscriptions/66c8e4f1-ecd6-47ed-9de7-7e530de23994/resourceGroups/TestRG5/providers/Microsoft.Network/virtualNetworkGateways/VNet5GW"
   $Connection15 = "VNet1toVNet5"
   New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -VirtualNetworkGateway2 $vnet5gw -Location $Location1 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
   ```

1. **[Subscription 5]** Create the TestVNet5 to TestVNet1 connection. This step is similar previous step, except you're creating the connection from TestVNet5 to TestVNet1. The same process of creating a PowerShell object based on the values obtained from Subscription 1 applies here as well. In this step, be sure that the shared keys match.

   Connect to Subscription 5 before running the following example:

   ```azurepowershell-interactive
   $vnet1gw = New-Object -TypeName Microsoft.Azure.Commands.Network.Models.PSVirtualNetworkGateway
   $vnet1gw.Name = "VNet1GW"
   $vnet1gw.Id = "/subscriptions/b636ca99-6f88-4df4-a7c3-2f8dc4545509/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW "
   $Connection51 = "VNet5toVNet1"
   New-AzVirtualNetworkGatewayConnection -Name $Connection51 -ResourceGroupName $RG5 -VirtualNetworkGateway1 $vnet5gw -VirtualNetworkGateway2 $vnet1gw -Location $Location5 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
   ```

## <a name="verify"></a>How to verify a connection

[!INCLUDE [vpn-gateway-no-nsg-include](../../includes/vpn-gateway-no-nsg-include.md)]

[!INCLUDE [verify connections PowerShell](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## <a name="faq"></a>VNet-to-VNet FAQ

For more information about VNet-to-VNet connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#V2VMulti).

## Next steps

* Once your connection is complete, you can add virtual machines to your virtual networks. See the [Virtual Machines documentation](../index.yml) for more information.
* For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
