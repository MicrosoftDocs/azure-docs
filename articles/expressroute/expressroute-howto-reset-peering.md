---
title: 'Reset Azure ExpressRoute peerings | Microsoft Docs'
description: How to disable and enable peeerings of an ExpressRoute circuit.
services: expressroute
author:  charwen

ms.service: expressroute
ms.topic: conceptual
ms.date: 08/15/2018
ms.author: charwen

---


# Reset ExpressRoute peerings

This article describes how to disable and enable peerings of an ExpressRoute circuit using PowerShell. When you disable a peering, the BGP session on both the primary connection and the secondary connection of your ExpressRoute circuit will be shut down. You will lose connectivity through this peering to Microsoft. When you enable a peering, the BGP session on both the primary connection and the secondary connection of your ExpressRoute circuit will be brought up. You will regain connectivity through this peering to Microsoft. You can enable and disable Microsoft Peering and Azure Private Peering on an ExpressRoute circuit independently. When you first configure the peerings on your ExpressRoute circuit, the peerings are enabled by default. 

There are a couple scenarios where you may find it helpful resetting your ExpressRoute peerings.
* Test your disaster recovery design and implementation. For example, you have two ExpressRoute circuits. You can disable the peerings of one circuit and force your network traffic to fail over to the other circuit.
* Enable Bidirectional Forwarding Detection (BFD) on Azure Private Peering of your ExpressRoute circuit. BFD is enabled by default if your ExpressRoute circuit is created after August 1, 2018. If your circuit was created before that, BFD wasn't enabled. You can enable BFD by disabling the peering and reenabling it. It should be noted that BFD is supported on Azure Private Peering only.


## Reset a peering

1. Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

2. Open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

  ```powershell
  Connect-AzureRmAccount
  ```
3. If you have multiple Azure subscriptions, check the subscriptions for the account.

  ```powershell
  Get-AzureRmSubscription
  ```
4. Specify the subscription that you want to use.

  ```powershell
  Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
  ```
5. Run the following commands to retrieve your ExpressRoute circuit.

  ```powershell
  $ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
  ```
6. Identify the peering you want to disable or enable. *Peerings* is an array. In the following example, Peerings[0] is Azure Private Peering and Peerings[1] Microsoft Peering.

  ```powershell
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
7. Run the following commands to change the state of the peering.

  ```powershell
  $ckt.Peerings[0].State = "Disabled"
  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```
The peering should be in a state you set. 

## Next steps
If you need help to troubleshoot an ExpressRoute problem, check out the following articles:
* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
