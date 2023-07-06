---
title: 'Azure ExpressRoute: Reset circuit peering using Azure PowerShell'
description: Learn how to enable and disable peerings for an Azure ExpressRoute circuit using Azure PowerShell.
services: expressroute
author:  charwen

ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 12/15/2020
ms.author: duau
---

# Reset ExpressRoute circuit peerings using Azure PowerShell

This article describes how to enable and disable peerings of an ExpressRoute circuit using PowerShell. Peerings are enabled by default when you create them. When you disable a peering, the BGP session on both the primary and the secondary connection of your ExpressRoute circuit will be shut down. You'll lose connectivity for this peering to Microsoft. When you enable a peering, the BGP session on both the primary and the secondary connection of your ExpressRoute circuit will be established. The connectivity to Microsoft will be restored for this peering. You can enable and disable peering for Microsoft Peering and Azure Private Peering independently on the ExpressRoute circuit.

There are a two scenarios where you may find it helpful to reset your ExpressRoute peerings.
* If you want to test your disaster recovery design and implementation. For example, you have two ExpressRoute circuits. You can disable the peerings on one circuit and force your network traffic to fail over to the other circuit.
* Enable Bidirectional Forwarding Detection (BFD) on either Azure Private Peering or Microsoft Peering of your ExpressRoute circuit. BFD gets enabled by default on Azure Private Peering if you created your ExpressRoute circuit after August 1, 2018 and for Microsoft Peering after January 10, 2020. If your circuit was created before the date listed, you'll need reset the peering to enable BFD. 

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Reset a peering

1. If you're running PowerShell locally, open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

   ```azurepowershell
   Connect-AzAccount
   ```
2. If you have multiple Azure subscriptions, check the subscriptions for the account.

   ```azurepowershell-interactive
   Get-AzSubscription
   ```
3. Specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Replace_with_your_subscription_name"
   ```
4. Run the following commands to retrieve your ExpressRoute circuit.

   ```azurepowershell-interactive
   $ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
   ```
5. Identify the peering you want to disable or enable. *Peerings* is an array. In the following example, Peerings[0] is Azure Private Peering and Peerings[1] Microsoft Peering.

   ```azurepowershell-interactive
   Name                             : ExpressRouteARMCircuit
   ResourceGroupName                : ExpressRouteResourceGroup
   Location                         : westus
   Id                               : /subscriptions/########-####-####-####-############/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
   Etag                             : W/"cd011bef-dc79-49eb-b4c6-81fb6ea5d178"
   ProvisioningState                : Succeeded
   Sku                              : {
                                     "Name": "Standard_MeteredData",
                                     "Tier": "Standard",
                                     "Family": "MeteredData"
                                   }
   CircuitProvisioningState         : Enabled
   ServiceProviderProvisioningState : Provisioned
   ServiceProviderNotes             :
   ServiceProviderProperties        : {
                                     "ServiceProviderName": "Coresite",
                                     "PeeringLocation": "Los Angeles",
                                     "BandwidthInMbps": 50
                                   }
   ServiceKey                       : ########-####-####-####-############
   Peerings                         : [
                                     {
                                       "Name": "AzurePrivatePeering",
                                       "Etag": "W/\"cd011bef-dc79-49eb-b4c6-81fb6ea5d178\"",
                                       "Id": "/subscriptions/########-####-####-####-############/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit/peerings/AzurePrivatePeering",
                                       "PeeringType": "AzurePrivatePeering",
                                       "State": "Enabled",
                                       "AzureASN": 12076,
                                       "PeerASN": 123,
                                       "PrimaryPeerAddressPrefix": "10.0.0.0/30",
                                       "SecondaryPeerAddressPrefix": "10.0.0.4/30",
                                       "PrimaryAzurePort": "",
                                       "SecondaryAzurePort": "",
                                       "VlanId": 789,
                                       "MicrosoftPeeringConfig": {
                                         "AdvertisedPublicPrefixes": [],
                                         "AdvertisedCommunities": [],
                                         "AdvertisedPublicPrefixesState": "NotConfigured",
                                         "CustomerASN": 0,
                                         "LegacyMode": 0,
                                         "RoutingRegistryName": "NONE"
                                       },
                                       "ProvisioningState": "Succeeded",
                                       "GatewayManagerEtag": "",
                                       "LastModifiedBy": "Customer",
                                       "Connections": []
                                     },
                                     {
                                       "Name": "MicrosoftPeering",
                                       "Etag": "W/\"cd011bef-dc79-49eb-b4c6-81fb6ea5d178\"",
                                       "Id": "/subscriptions/########-####-####-####-############/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit/peerings/MicrosoftPeering",
                                       "PeeringType": "MicrosoftPeering",
                                       "State": "Enabled",
                                       "AzureASN": 12076,
                                       "PeerASN": 123,
                                       "PrimaryPeerAddressPrefix": "3.0.0.0/30",
                                       "SecondaryPeerAddressPrefix": "3.0.0.4/30",
                                       "PrimaryAzurePort": "",
                                       "SecondaryAzurePort": "",
                                       "VlanId": 345,
                                       "MicrosoftPeeringConfig": {
                                         "AdvertisedPublicPrefixes": [
                                           "3.0.0.3/32"
                                         ],
                                         "AdvertisedCommunities": [],
                                         "AdvertisedPublicPrefixesState": "ValidationNeeded",
                                         "CustomerASN": 0,
                                         "LegacyMode": 0,
                                         "RoutingRegistryName": "NONE"
                                       },
                                       "ProvisioningState": "Succeeded",
                                       "GatewayManagerEtag": "",
                                       "LastModifiedBy": "Customer",
                                       "Connections": []
                                     }
                                   ]
   Authorizations                   : []
   AllowClassicOperations           : False
   GatewayManagerEtag               :
   ```
6. Run the following commands to change the peering state to disabled.

   ```azurepowershell-interactive
   $ckt.Peerings[0].State = "Disabled"
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```
   The peering should be in a disabled state you set. 

7. Run the following commands to change the peering state back to enabled.

   ```azurepowershell-interactive
   $ckt.Peerings[0].State = "Enabled"
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```
   The peering should be in a enabled state you set.
   
## Next steps
If you need help with troubleshooting an ExpressRoute problem, see the following articles:
* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
