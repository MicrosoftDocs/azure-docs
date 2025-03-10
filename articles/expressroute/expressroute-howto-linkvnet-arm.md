---
title: 'Link a virtual network to an ExpressRoute circuit - Azure PowerShell'
description: This article provides an overview of how to link virtual networks (VNets) to ExpressRoute circuits by using the Resource Manager deployment model and Azure PowerShell.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 09/30/2024
ms.author: duau
ms.custom: devx-track-azurepowershell
---
# Connect a virtual network to an ExpressRoute circuit using Azure PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-linkvnet-arm.md)
> * [Azure CLI](expressroute-howto-linkvnet-cli.md)
> * [PowerShell (classic)](expressroute-howto-linkvnet-classic.md)
>

This article helps you link virtual networks (VNets) to Azure ExpressRoute circuits by using the Resource Manager deployment model and PowerShell. Virtual networks can either be in the same subscription or part of another subscription. This tutorial also shows you how to update a virtual network link.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing a virtual network linked to an ExpressRoute circuit." lightbox="./media/expressroute-howto-linkvnet-portal-resource-manager/gateway-circuit.png":::

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.

* You must have an active ExpressRoute circuit. 
  * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider. 
  * Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
  * Ensure that Azure private peering gets configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.
  * Ensure that you have a virtual network and a virtual network gateway created and fully provisioned. Follow the instructions to [create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md). A virtual network gateway for ExpressRoute uses the GatewayType `ExpressRoute`, not VPN.

* You can link up to 10 virtual networks to a standard ExpressRoute circuit. All virtual networks must be in the same geopolitical region when using a standard ExpressRoute circuit. 

* A single virtual network can be linked to up to 16 ExpressRoute circuits. Use the steps in this article to create a new connection object for each ExpressRoute circuit you're connecting to. The ExpressRoute circuits can be in the same subscription, different subscriptions, or a mix of both.

* If you enable the ExpressRoute premium add-on, you can link virtual networks outside of the geopolitical region of the ExpressRoute circuit. The premium add-on allows you to connect more than 10 virtual networks to your ExpressRoute circuit depending on the bandwidth chosen. Check the [FAQ](expressroute-faqs.md) for more details on the premium add-on.

* In order to create the connection from the ExpressRoute circuit to the target ExpressRoute virtual network gateway, the number of address spaces advertised from the local or peered virtual networks needs to be equal to or less than **200**. Once the connection has been successfully created, you can add more address spaces, up to 1,000, to the local or peered virtual networks.

* Review guidance for [connectivity between virtual networks over ExpressRoute](virtual-network-connectivity-guidance.md).

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Connect a virtual network

# [**Maximum Resiliency**](#tab/maximum)

**Maximum resiliency** (Recommended): provides the highest level of resiliency to your virtual network. It provides two redundant connections from the virtual network gateway to two different ExpressRoute circuits in different ExpressRoute locations.

### Clone the script

To create maximum resiliency connections, clone the setup script from GitHub.

```azurepowershell-interactive
# Clone the setup script from GitHub.
git clone https://github.com/Azure-Samples/azure-docs-powershell-samples/ 
# Change to the directory where the script is located.
CD azure-docs-powershell-samples/expressroute/
```

Run the **New-AzHighAvailabilityVirtualNetworkGatewayConnections.ps1** script to create high availability connections. The following example shows how to create two new connections to two ExpressRoute circuits.

```azurepowershell-interactive
$SubscriptionId = Get-AzureSubscription -SubscriptionName "<SubscriptionName>"
$circuit1 = Get-AzExpressRouteCircuit -Name "MyCircuit1" -ResourceGroupName "MyRG"
$circuit2 = Get-AzExpressRouteCircuit -Name "MyCircuit2" -ResourceGroupName "MyRG"
$gw = Get-AzVirtualNetworkGateway -Name "ExpressRouteGw" -ResourceGroupName "MyRG"

highAvailabilitySetup/New-AzHighAvailabilityVirtualNetworkGatewayConnections.ps1 -SubscriptionId $SubscriptionId -ResourceGroupName "MyRG" -Location "West EU" -Name1 "ERConnection1" -Name2 "ERConnection2" -Peer1 $circuit1.Peerings[0] -Peer2 $circuit2.Peerings[0] -RoutingWeight1 10 -RoutingWeight2 10 -VirtualNetworkGateway1 $gw
```

If you want to create a new connection and use an existing one, you can use the following example. This example creates a new connection to a second ExpressRoute circuit and uses an existing connection to the first ExpressRoute circuit.

```azurepowershell-interactive
$SubscriptionId = Get-AzureSubscription -SubscriptionName "<SubscriptionName>"
$circuit1 = Get-AzExpressRouteCircuit -Name "MyCircuit1" -ResourceGroupName "MyRG"
$gw = Get-AzVirtualNetworkGateway -Name "ExpressRouteGw" -ResourceGroupName "MyRG"
$connection = Get-AzVirtualNetworkGatewayConnection -Name "ERConnection1" -ResourceGroupName "MyRG"

highAvailabilitySetup/New-AzHighAvailabilityVirtualNetworkGatewayConnections.ps1 -SubscriptionId $SubscriptionId -ResourceGroupName "MyRG" -Location "West EU" -Name2 "ERConnection2" -Peer2 $circuit1.Peerings[0] -RoutingWeight2 10 -VirtualNetworkGateway1 $gw -ExistingVirtualNetworkGatewayConnection $connection
```

# [**Standard/High Resiliency**](#tab/standard)

**Standard resiliency**: provides a single redundant connection from the virtual network gateway to a single ExpressRoute circuit.
You can connect a virtual network gateway to an ExpressRoute circuit using the **New-AzVirtualNetworkGatewayConnection** cmdlet. Make sure that the virtual network gateway is created and is ready for linking before you run the cmdlet.

```azurepowershell-interactive
$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
$gw = Get-AzVirtualNetworkGateway -Name "ExpressRouteGw" -ResourceGroupName "MyRG"
$connection = New-AzVirtualNetworkGatewayConnection -Name "ERConnection" -ResourceGroupName "MyRG" -Location "East US" -VirtualNetworkGateway1 $gw -PeerId $circuit.Id -ConnectionType ExpressRoute
```

> [!NOTE]
> For **High Resiliency**, you must connect to a Metro circuit instead of a Standard circuit.

---

## Connect a virtual network in a different subscription to a circuit
You can share an ExpressRoute circuit across multiple subscriptions. The following figure shows a simple schematic of how sharing works for ExpressRoute circuits across multiple subscriptions.

> [!NOTE]
> Connecting virtual networks between Azure sovereign clouds and Public Azure cloud is not supported. You can only link virtual networks from different subscriptions in the same cloud.

Each of the smaller clouds within the large cloud is used to represent subscriptions that belong to different departments within an organization. Each of the departments within the organization uses their own subscription for deploying their services--but they can share a single ExpressRoute circuit to connect back to your on-premises network. A single department (in this example: IT) can own the ExpressRoute circuit. Other subscriptions within the organization may use the ExpressRoute circuit.

> [!NOTE]
> Connectivity and bandwidth charges for the ExpressRoute circuit will be applied to the subscription owner. All virtual networks share the same bandwidth.
> 

:::image type="content" source="./media/expressroute-howto-linkvnet-classic/cross-subscription.png" alt-text="Cross-subscription connectivity":::

### Administration - circuit owners and circuit users

The 'circuit owner' is an authorized Power User of the ExpressRoute circuit resource. The circuit owner can create authorizations that can be redeemed by 'circuit users'. Circuit users are owners of virtual network gateways that aren't within the same subscription as the ExpressRoute circuit. Circuit users can redeem authorizations (one authorization per virtual network).

The circuit owner has the power to modify and revoke authorizations at any time. Revoking an authorization results in all link connections being deleted from the subscription whose access was revoked.

  > [!NOTE]
  > Circuit owner is not an built-in RBAC role or defined on the ExpressRoute resource.
  > The definition of the circuit owner is any role with the following access:
  > - Microsoft.Network/expressRouteCircuits/authorizations/write
  > - Microsoft.Network/expressRouteCircuits/authorizations/read
  > - Microsoft.Network/expressRouteCircuits/authorizations/delete
  > 
  > This includes the built-in roles such as Contributor, Owner and Network Contributor. Detailed description for the different [built-in roles](../role-based-access-control/built-in-roles.md).

### Circuit owner operations

**To create an authorization**

The circuit owner creates an authorization, which creates an authorization key to be used by a circuit user to connect their virtual network gateways to the ExpressRoute circuit. An authorization is valid for only one connection.

The following cmdlet snippet shows how to create an authorization:

```azurepowershell-interactive
$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
Add-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "MyAuthorization1"
Set-AzExpressRouteCircuit -ExpressRouteCircuit $circuit

$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
$auth1 = Get-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "MyAuthorization1"
```

The response to the previous commands contains the authorization key and status:

```azurepowershell
Name                   : MyAuthorization1
Id                     : /subscriptions/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/resourceGroups/ERCrossSubTestRG/providers/Microsoft.Network/expressRouteCircuits/CrossSubTest/authorizations/MyAuthorization1
Etag                   : &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 
AuthorizationKey       : ####################################
AuthorizationUseStatus : Available
ProvisioningState      : Succeeded
```

**To review authorizations**

The circuit owner can review all authorizations that are issued on a particular circuit by running the following cmdlet:

```azurepowershell-interactive
$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
$authorizations = Get-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit
```

**To add authorizations**

The circuit owner can add authorizations by using the following cmdlet:

```azurepowershell-interactive
$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
Add-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "MyAuthorization2"
Set-AzExpressRouteCircuit -ExpressRouteCircuit $circuit

$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
$authorizations = Get-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit
```

**To delete authorizations**

The circuit owner can revoke/delete authorizations to the user by running the following cmdlet:

```azurepowershell-interactive
Remove-AzExpressRouteCircuitAuthorization -Name "MyAuthorization2" -ExpressRouteCircuit $circuit
Set-AzExpressRouteCircuit -ExpressRouteCircuit $circuit
```    

### Circuit user operations

The circuit user needs the peer ID and an authorization key from the circuit owner. The authorization key is a GUID.

Peer ID can be checked from the following command:

```azurepowershell-interactive
Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG"
```

**To redeem a connection authorization**

The circuit user can run the following cmdlet to redeem a link authorization:

```azurepowershell-interactive
$id = "/subscriptions/********************************/resourceGroups/ERCrossSubTestRG/providers/Microsoft.Network/expressRouteCircuits/MyCircuit"    
$gw = Get-AzVirtualNetworkGateway -Name "ExpressRouteGw" -ResourceGroupName "MyRG"
$connection = New-AzVirtualNetworkGatewayConnection -Name "ERConnection" -ResourceGroupName "RemoteResourceGroup" -Location "East US" -VirtualNetworkGateway1 $gw -PeerId $id -ConnectionType ExpressRoute -AuthorizationKey "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
```

**To release a connection authorization**

You can release an authorization by deleting the connection that links the ExpressRoute circuit to the virtual network.

## Modify a virtual network connection
You can update certain properties of a virtual network connection. 

**To update the connection weight**

Your virtual network can be connected to multiple ExpressRoute circuits. You may receive the same prefix from more than one ExpressRoute circuit. To choose which connection to send traffic destined for this prefix, you can change *RoutingWeight* of a connection. Traffic is sent on the connection with the highest *RoutingWeight*.

```azurepowershell-interactive
$connection = Get-AzVirtualNetworkGatewayConnection -Name "MyVirtualNetworkConnection" -ResourceGroupName "MyRG"
$connection.RoutingWeight = 100
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection
```

The range of *RoutingWeight* is 0 to 32000. The default value is 0.

## Configure ExpressRoute FastPath 
You can enable [ExpressRoute FastPath](expressroute-about-virtual-network-gateways.md) if your virtual network gateway is Ultra Performance or ErGw3AZ. FastPath improves data path performance such as packets per second and connections per second between your on-premises network and your virtual network. 

**Configure FastPath on a new connection**

```azurepowershell-interactive 
$circuit = Get-AzExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "MyRG" 
$gw = Get-AzVirtualNetworkGateway -Name "MyGateway" -ResourceGroupName "MyRG" 
$connection = New-AzVirtualNetworkGatewayConnection -Name "MyConnection" -ResourceGroupName "MyRG" -ExpressRouteGatewayBypass -VirtualNetworkGateway1 $gw -PeerId $circuit.Id -ConnectionType ExpressRoute -Location "MyLocation" 
``` 

**Updating an existing connection to enable FastPath**

```azurepowershell-interactive 
$connection = Get-AzVirtualNetworkGatewayConnection -Name "MyConnection" -ResourceGroupName "MyRG" 
$connection.ExpressRouteGatewayBypass = $True
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection
``` 
### FastPath Virtual Network Peering, User-Defined-Routes (UDRs) and Private Link support for ExpressRoute Direct Connections

With Virtual Network Peering and UDR support, FastPath will send traffic directly to VMs deployed in "spoke" Virtual Networks (connected via Virtual Network Peering) and honor any UDRs configured on the GatewaySubnet. This capability is now generally available (GA).

With FastPath and Private Link, Private Link traffic sent over ExpressRoute bypasses the ExpressRoute virtual network gateway in the data path. With both of these features enabled, FastPath will directly send traffic to a Private Endpoint deployed in a "spoke" Virtual Network.

These scenarios are Generally Available for limited scenarios with connections associated to 10 Gbps and 100 Gbps ExpressRoute Direct circuits. To enable, follow the below guidance:
1. Complete this [Microsoft Form](https://aka.ms/fplimitedga) to request to enroll your subscription. Requests may take up to 4 weeks to complete, so plan deployments accordingly.
2. Once you receive a confirmation from Step 1, run the following Azure PowerShell command in the target Azure subscription.
 ```azurepowershell-interactive
$connection = Get-AzVirtualNetworkGatewayConnection -ResourceGroupName <resource-group> -ResourceName <connection-name>
$connection.ExpressRouteGatewayBypass = $true
$connection.EnablePrivateLinkFastPath = $true
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection
```

> [!NOTE]
> You can use [Connection Monitor](how-to-configure-connection-monitor.md) to verify that your traffic is reaching the destination using FastPath.

> [!NOTE]
> Enabling FastPath Private Link support for limited GA scenarios may take upwards of 4 weeks to complete. Please plan your deployment(s) in advance.
> 

**FastPath support for virtual network peering and UDRs is only available for ExpressRoute Direct connections**.

> [!NOTE]
> If you already have FastPath configured and want to enroll in the limited GA features, you need to do the following:
>   1. Enroll in one of the FastPath features with the Azure PowerShell commands.
>   1. Disable and then re-enable FastPath on the target connection.
>   1. To switch between limited GA feature, register the subscription with the target preview PowerShell command, and then disable and re-enable FastPath on the connection.
>

## Clean up resources

If you no longer need the ExpressRoute connection, from the subscription where the gateway is located use the `Remove-AzVirtualNetworkGatewayConnection` command to remove the link between the gateway and the circuit.

```azurepowershell-interactive
Remove-AzVirtualNetworkGatewayConnection "MyConnection" -ResourceGroupName "MyRG"
```

## Next steps

In this tutorial, you learned how to connect a virtual network to a circuit in the same subscription and in a different subscription. For more information about ExpressRoute gateways, see: [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To learn how to configure, route filters for Microsoft peering using PowerShell, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Configure route filters for Microsoft peering](how-to-routefilter-powershell.md)
