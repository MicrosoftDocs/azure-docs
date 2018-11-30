---
title: 'Configure Azure ExpressRoute Global Reach | Microsoft Docs'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach.
documentationcenter: na
services: expressroute
author: mialdrid

ms.service: expressroute
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: mialdrid

---

# Configure ExpressRoute Global Reach (preview)
This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).
 
## Before you begin
> [!IMPORTANT]
> This public preview is provided without a service-level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
> 


Before you start configuration, confirm the following.

* That you've installed the latest version of Azure PowerShell. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).
* That you understand ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* That your ExpressRoute circuits are in a provisioned state.
* That Azure private peering is configured on your ExpressRoute circuits.  

### Sign in to your Azure account
To start the configuration, sign in to your Azure account. 

Open your PowerShell console with elevated privileges, and then connect to your account. The command prompts you for the sign-in credential for your Azure account.  

```powershell
Connect-AzureRmAccount
```

If you have multiple Azure subscriptions, check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

Specify the subscription that you want to use.

```powershell
Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
```

### Identify your ExpressRoute circuits for configuration
You can enable ExpressRoute Global Reach between any two ExpressRoute circuits as long as they're located in the supported countries and were created at different peering locations. If your subscription owns both circuits, you can choose either circuit to run the configuration in the following sections. If the two circuits are in different Azure subscriptions, you need authorization from one Azure subscription. Then you pass in the authorization key when you run the configuration command in the other Azure subscription.

## Enable connectivity between your on-premises networks

Use the following commands to get circuit 1 and circuit 2. The two circuits are in the same subscription.

```powershell
$ckt_1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
$ckt_2 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
```

Run the following command against circuit 1, and then pass in the private peering ID of circuit 2.

> [!NOTE]
> The private peering ID looks like the following: */subscriptions/{your_subscription_id}/resourceGroups/{your_resource_group}/providers/Microsoft.Network/expressRouteCircuits/{your_circuit_name}/peerings/AzurePrivatePeering*
> 
>

```powershell
Add-AzureRmExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/29'
```

> [!IMPORTANT]
> *-AddressPrefix* must be a /29 IPv4 subnet, for example, "10.0.0.0/29". We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You shouldn't use addresses in this subnet, in your Azure virtual networks, or in your on-premises networks.
> 



Save the configuration on circuit 1
```powershell
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

When the previous operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

### ExpressRoute circuits in different Azure subscriptions

If the two circuits are not in the same Azure subscription, you need authorization. In the following configuration, authorization is generated in the circuit 2 subscription, and the authorization key is passed to circuit 1.

Generate an authorization key. 
```powershell
$ckt_2 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
Add-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_2
```
Make a note of the private peering ID of circuit 2,  as well as the authorization key.

Run the following command against circuit 1. Pass in the private peering ID of circuit 2 and the authorization key.
```powershell
Add-AzureRmExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix '__.__.__.__/29' -AuthorizationKey '########-####-####-####-############'
```

Save the configuration on circuit 1.
```powershell
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

When the previous operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Get and verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made, for example, circuit 1 in the previous example.

```powershell
$ckt1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
```

If you simply run *$ckt1* in PowerShell, you see *CircuitConnectionStatus* in the output. It tells you whether the connectivity is established, "Connected", or "Disconnected". 

## Disable connectivity between your on-premises networks

To disable connectivity, run the commands against the circuit where the configuration was made, for example, circuit 1 in the previous example.

```powershell
$ckt1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzureRmExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

You can run the Get operation to verify the status. 

After the previous operation is complete, you no longer have connectivity between your on-premises network through your ExpressRoute circuits. 


## Next steps
1. [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
2. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
3. [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)


