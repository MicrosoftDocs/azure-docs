---
title: 'Configure Azure ExpressRoute Global Reach | Microsoft Docs'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach.
documentationcenter: na
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: cherylmc

---

# Configure ExpressRoute Global Reach (Preview)
This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).
 
## Before you begin
> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
> 


Before you start configuration, you need to check the following requirements.

* Install the latest version of Azure PowerShell. See [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).
* Understand the ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Make sure your ExpressRoute circuits are in Provisioned state.
* Make sure Azure private peering is configured on your ExpressRoute circuits.  

### Log into your Azure account
To start the configuration, you must log into your Azure account. 

Open your PowerShell console with elevated privileges, and connect to your account. The command will prompt you for the login credential for your Azure account.  

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
You can enable ExpressRoute Global Reach between any two ExpressRoute circuits as long as they're located in the supported countries and they're created at different peering locations. If your subscription owns both circuits you can choose either circuit to run the configuration in the sections below. If the two circuits are in different Azure subscriptions, you will need authorization from one Azure subscription and pass in the authorization key when you run the configuration command in the other Azure subscription.

## Enable connectivity between your on-premises networks

Use the following commands to get circuit 1 and circuit 2. The two circuits are in the same subscription.

```powershell
$ckt_1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
$ckt_2 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
```

Run the following command against circuit 1 and pass in circuit 2's private peering's Id.

> [!NOTE]
> The private peering's Id looks like */subscriptions/{your_subscription_id}/resourceGroups/{your_resource_group}/providers/Microsoft.Network/expressRouteCircuits/{your_circuit_name}/peerings/AzurePrivatePeering*
> 
>

```powershell
Add-AzureRmExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/29'
```

> [!IMPORTANT]
> *-AddressPrefix* must be a /29 IPv4 subnet, e.g. "10.0.0.0/29". We will use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You must not use addresses in this subnet in your Azure VNets or in your on-premises networks.
> 



Save the configuration on circuit 1
```powershell
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

When the above operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

### ExpressRoute circuits in different Azure subscriptions

If the two circuits are not in the same Azure subscription, you will need authorization. In the following configuration, authorization is generated in circuit 2's subscription and the authorization key is passed to circuit 1.

Generate an authorization key. 
```powershell
$ckt_2 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
Add-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_2
```
Make a note of circuit 2's private peering's Id as well as the authorization key.

Run the following command against circuit 1. Pass in circuit 2's private peering's Id and the authorization key 
```powershell
Add-AzureRmExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix '__.__.__.__/29' -AuthorizationKey '########-####-####-####-############'
```

Save the configuration on circuit 1
```powershell
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

When the above operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Get and verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made, i.e. circuit 1 in the above example.

```powershell
$ckt1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
```

If you simply run *$ckt1* in PowerShell you'll see *CircuitConnectionStatus* in the output. It will tell you whether the connectivity is established, "Connected", or not, "Disconnected". 

## Disable connectivity between your on-premises networks

To disable it, run the commands against the circuit where the configuration was made, i.e. circuit 1 in the above example.

```powershell
$ckt1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzureRmExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

You can run the Get operation to verify the status. 

After the above operation is complete, you will no longer have connectivity between your on-premises network through your ExpressRoute circuits. 


## Next Steps
1. [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
2. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
3. [Link ExpressRoute circuit to Azure virtual network](expressroute-howto-linkvnet-arm.md)


