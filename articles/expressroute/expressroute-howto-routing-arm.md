---
title: 'How to configure routing (peering) for an ExpressRoute circuit: Resource Manager: PowerShell: Azure | Microsoft Docs'
description: This article walks you through the steps for creating and provisioning the private, public and Microsoft peering of an ExpressRoute circuit. This article also shows you how to check the status, update, or delete peerings for your circuit.
documentationcenter: na
services: expressroute
author: ganesr
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 0a036d51-77ae-4fee-9ddb-35f040fbdcdf
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/31/2017
ms.author: ganesr;cherylmc

---
# Create and modify peering for an ExpressRoute circuit using PowerShell

This article helps you create and manage routing configuration for an ExpressRoute circuit in the Resource Manager deployment model using PowerShell. You can also check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. If you want to use a different method to work with your circuit, select an article from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-routing-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-routing-arm.md)
> * [Azure CLI](howto-routing-cli.md)
> * [Video - Private peering](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-private-peering-for-your-expressroute-circuit)
> * [Video - Public peering](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-public-peering-for-your-expressroute-circuit)
> * [Video - Microsoft peering](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-microsoft-peering-for-your-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-routing-classic.md)
> 

## Configuration prerequisites

* You will need the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview). 
* Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state for you to be able to run the cmdlets in this article.

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you are using a service provider that offers managed Layer 3 services (typically an IPVPN, like MPLS), your connectivity provider will configure and manage routing for you.

> [!IMPORTANT]
> We currently do not advertise peerings configured by service providers through the service management portal. We are working on enabling this capability soon. Check with your service provider before configuring BGP peerings.
> 
> 

You can configure one, two, or all three peerings (Azure private, Azure public and Microsoft) for an ExpressRoute circuit. You can configure peerings in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. 

## Azure private peering

This section helps you create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit.

### To create Azure private peering

1. Import the PowerShell module for ExpressRoute.

  You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

  ```powershell
  Install-Module AzureRM
  Install-AzureRM
  ```

  Import all of the AzureRM.* modules within the known semantic version range.

  ```powershell
  Import-AzureRM
  ```

  You can also just import a select module within the known semantic version range.

  ```powershell
  Import-Module AzureRM.Network 
  ```

  Sign in to your account.

  ```powershell
  Login-AzureRmAccount
  ```

  Select the subscription you want to create ExpressRoute circuit.

  ```powershell
  Select-AzureRmSubscription -SubscriptionId "<subscription ID>"
  ```
2. Create an ExpressRoute circuit.

  Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider.

  If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.
3. Check the ExpressRoute circuit to make sure it is provisioned and also enabled. Use the following example:

  ```powershell
  Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
  ```

  The response is similar to the following example:

  ```
  Name                             : ExpressRouteARMCircuit
  ResourceGroupName                : ExpressRouteResourceGroup
  Location                         : westus
  Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
  Etag                             : W/"################################"
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
                                       "ServiceProviderName": "Equinix",
                                       "PeeringLocation": "Silicon Valley",
                                       "BandwidthInMbps": 200
                                     }
  ServiceKey                       : **************************************
  Peerings                         : []
  ```
4. Configure Azure private peering for the circuit. Make sure that you have the following items before you proceed with the next steps:

  * A /30 subnet for the primary link. The subnet must not be part of any address space reserved for virtual networks.
  * A /30 subnet for the secondary link. The subnet must not be part of any address space reserved for virtual networks.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Ensure that you are not using 65515.
  * **Optional -** An MD5 hash if you choose to use one.

  Use the following example to configure Azure private peering for your circuit:

  ```powershell
  Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200

  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```

  If you choose to use an MD5 hash, use the following example:

  ```powershell
  Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200  -SharedKey "A1B2C3D4"
  ```

  > [!IMPORTANT]
  > Ensure that you specify your AS number as peering ASN, not customer ASN.
  > 
  >

### To view Azure private peering details

You can get configuration details by using the following example:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

Get-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt
```

### To update Azure private peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 100 to 500.

```powershell
Set-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To delete Azure private peering

You can remove your peering configuration by running the following example:

> [!WARNING]
> You must ensure that all virtual networks are unlinked from the ExpressRoute circuit before running this example. 
> 
> 

```powershell
Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Azure public peering

This section helps you create, get, update, and delete the Azure public peering configuration for an ExpressRoute circuit.

### To create Azure public peering

1. Import the PowerShell module for ExpressRoute.

  You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

  ```powershell
  Install-Module AzureRM

  Install-AzureRM
```

  Import all of the AzureRM.* modules within the known semantic version range.

  ```powershell
  Import-AzureRM
  ```

  You can also just import a select module within the known semantic version range.

  ```powershell
  Import-Module AzureRM.Network
```

  Sign in to your account.

  ```powershell
  Login-AzureRmAccount
  ```

  Select the subscription you want to create ExpressRoute circuit.

  ```powershell
  Select-AzureRmSubscription -SubscriptionId "<subscription ID>"
  ```
2. Create an ExpressRoute circuit.

  Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider.

  If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.
3. Check the ExpressRoute circuit to ensure it is provisioned and also enabled. Use the following example:

  ```powershell
  Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
  ```

  The response is similar to the following example:

  ```
  Name                             : ExpressRouteARMCircuit
  ResourceGroupName                : ExpressRouteResourceGroup
  Location                         : westus
  Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
  Etag                             : W/"################################"
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
                                       "ServiceProviderName": "Equinix",
                                       "PeeringLocation": "Silicon Valley",
                                       "BandwidthInMbps": 200
                                     }
  ServiceKey                       : **************************************
  Peerings                         : []
  ```
4. Configure Azure public peering for the circuit. Make sure that you have the following information before you proceed further.

  * A /30 subnet for the primary link. This must be a valid public IPv4 prefix.
  * A /30 subnet for the secondary link. This must be a valid public IPv4 prefix.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
  * **Optional -** An MD5 hash if you choose to use one.

  Run the following example to configure Azure public peering for your circuit

  ```powershell
  Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100

  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```

  If you choose to use an MD5 hash, use the following example:

  ```powershell
  Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100  -SharedKey "A1B2C3D4"

  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```

  > [!IMPORTANT]
  > Ensure that you specify your AS number as peering ASN, not customer ASN.
  > 
  >

### To view Azure public peering details

You can get configuration details using the following cmdlet:

```powershell
  $ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

  Get-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt
  ```

### To update Azure public peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 200 to 600.

```powershell
Set-AzureRmExpressRouteCircuitPeeringConfig  -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 600

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To delete Azure public peering

You can remove your peering configuration by running the following example:

```powershell
Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt
Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Microsoft peering

This section helps you create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through the Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. For more information, see [Configure a route filter for Microsoft peering](how-to-routefilter-powershell.md).
> 
> 

### To create Microsoft peering

1. Import the PowerShell module for ExpressRoute.

  You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

  ```powershell
  Install-Module AzureRM

  Install-AzureRM
  ```

  Import all of the AzureRM.* modules within the known semantic version range.

  ```powershell
  Import-AzureRM
  ```

  You can also just import a select module within the known semantic version range.

  ```powershell
  Import-Module AzureRM.Network
  ```

  Sign in to your account.

  ```powershell
  Login-AzureRmAccount
  ```

  Select the subscription you want to create ExpressRoute circuit.

  ```powershell
Select-AzureRmSubscription -SubscriptionId "<subscription ID>"
  ```
2. Create an ExpressRoute circuit.

  Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider.

  If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.
3. Check the ExpressRoute circuit to make sure it is provisioned and also enabled. Use the following example:

  ```powershell
  Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
  ```

  The response is similar to the following example:

  ```
  Name                             : ExpressRouteARMCircuit
  ResourceGroupName                : ExpressRouteResourceGroup
  Location                         : westus
  Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
  Etag                             : W/"################################"
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
                                       "ServiceProviderName": "Equinix",
                                       "PeeringLocation": "Silicon Valley",
                                       "BandwidthInMbps": 200
                                     }
  ServiceKey                       : **************************************
  Peerings                         : []
  ```
4. Configure Microsoft peering for the circuit. Make sure that you have the following information before you proceed.

  * A /30 subnet for the primary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
  * A /30 subnet for the secondary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
  * Advertised prefixes: You must provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR.
  * **Optional -** Customer ASN: If you are advertising prefixes that are not registered to the peering AS number, you can specify the AS number to which they are registered.
  * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
  * **Optional -** An MD5 hash if you choose to use one.

   Use the following example to configure Microsoft peering for your circuit:

  ```powershell
  Add-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "123.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```

### To get Microsoft peering details

You can get configuration details using the following example:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

Get-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt
```

### To update Microsoft peering configuration

You can update any part of the configuration using the following example:

```powershell
Set-AzureRmExpressRouteCircuitPeeringConfig  -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "124.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To delete Microsoft peering

You can remove your peering configuration by running the following cmdlet:

```powershell
Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Next steps

Next step, [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

* For more information about ExpressRoute workflows, see [ExpressRoute workflows](expressroute-workflows.md).
* For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* For more information about working with virtual networks, see [Virtual network overview](../virtual-network/virtual-networks-overview.md).
