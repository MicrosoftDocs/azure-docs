---
title: 'Tutorial: Configure peering for ExpressRoute circuit - Azure PowerShell'
description: This tutorial shows you how to create and manage routing configuration for an ExpressRoute circuit in the Resource Manager deployment model using PowerShell.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 06/30/2023
ms.author: duau 
ms.custom: devx-track-azurepowershell

---
# Tutorial: Create and modify peering for an ExpressRoute circuit using PowerShell

This tutorial helps you create and manage routing configuration for an ExpressRoute circuit in the Resource Manager deployment model using PowerShell. You can also check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. If you want to use a different method to work with your circuit, select an article from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-routing-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-routing-arm.md)
> * [Azure CLI](howto-routing-cli.md)
> * [Public peering](about-public-peering.md)
> * [Video - Private peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-private-peering-for-your-expressroute-circuit)
> * [Video - Microsoft peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-microsoft-peering-for-your-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-routing-classic.md)
> 

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you're using a service provider that offers managed Layer 3 services, typically an IPVPN, like MPLS, your connectivity provider configures and manages network routing for you.

> [!IMPORTANT]
> We currently do not advertise peerings configured by service providers through the service management portal. We are working on enabling this capability soon. Check with your service provider before configuring BGP peerings.
> 

You can configure private peering and Microsoft peering for an ExpressRoute circuit (Azure public peering is deprecated for new circuits). Peerings can be configured in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. For more information about routing domains and peerings, see [ExpressRoute routing domains](expressroute-circuit-peerings.md). For information about public peering, see [ExpressRoute public peering](about-public-peering.md).

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/expressroute-network.png" alt-text="Diagram showing an on-premises network connected to the Microsoft cloud through an ExpressRoute circuit.":::

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure, update, and delete Microsoft peering for a circuit
> - Configure, update, and delete Azure private peering for a circuit

## Prerequisites

* Make sure that you've reviewed the following pages before you begin configuration:
    * [Prerequisites](expressroute-prerequisites.md) 
    * [Routing requirements](expressroute-routing.md)
    * [Workflows](expressroute-workflows.md)
* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state for you to run the cmdlets in this article.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## <a name="msft"></a>Microsoft peering

This section helps you create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through the Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. For more information, see [Configure a route filter for Microsoft peering](how-to-routefilter-powershell.md).
> 

### To create Microsoft peering

1. Sign in and select your subscription.

   If you installed PowerShell locally, sign in. If you're using Azure Cloud Shell, you can skip this step.

   ```azurepowershell
   Connect-AzAccount
   ```

   Select the subscription you want to create ExpressRoute circuit.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "<subscription ID>"
   ```
2. Create an ExpressRoute circuit.

   Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Microsoft peering for you. You won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue your configuration using the next steps. 

3. Check the ExpressRoute circuit to make sure it's provisioned and also enabled. Use the following example:

   ```azurepowershell-interactive
   Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
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
4. Configure Microsoft peering for the circuit. Make sure that you have the following information before you continue.

   * A /30 or /126 subnet for the primary link. The address block must be a valid public IPv4 or IPv6 prefix owned by you and registered in an RIR / IRR.
   * A /30 or /126 subnet for the secondary link. The address block must be a valid public IPv4 or IPv6 prefix owned by you and registered in an RIR / IRR.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * Advertised prefixes: You provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR. IPv4 BGP sessions require IPv4 advertised prefixes and IPv6 BGP sessions require IPv6 advertised prefixes. 
   * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
   * Optional:
     * Customer ASN: If you're advertising prefixes not registered to the peering AS number, you can specify the AS number to which they're registered with.
     * An MD5 hash if you choose to use one.

> [!IMPORTANT]
> Microsoft verifies if the specified 'Advertised public prefixes' and 'Peer ASN' (or 'Customer ASN') are assigned to you in the Internet Routing Registry. If you are getting the public prefixes from another entity and if the assignment is not recorded with the routing registry, the automatic validation will not complete and will require manual validation. If the automatic validation fails, you will see 'AdvertisedPublicPrefixesState' as 'Validation needed' on the output of "Get-AzExpressRouteCircuitPeeringConfig" (see "To get Microsoft peering details" in the following section). 
> 
> If you see the message 'Validation needed', collect the document(s) that show the public prefixes are assigned to your organization by the entity that is listed as the owner of the prefixes in the routing registry and submit these documents for manual validation by opening a support ticket. 
> 

   Use the following example to configure Microsoft peering for your circuit:

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PeerAddressType IPv4 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "123.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

   Add-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PeerAddressType IPv6 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "3FFE:FFFF:0:CD31::/120" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```

### <a name="getmsft"></a>To get Microsoft peering details

You can get configuration details using the following example:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

Get-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt
```

### <a name="updatemsft"></a>To update Microsoft peering configuration

You can update any part of the configuration using the following example:

```azurepowershell-interactive
Set-AzExpressRouteCircuitPeeringConfig  -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PeerAddressType IPv4 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "124.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

Set-AzExpressRouteCircuitPeeringConfig  -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PeerAddressType IPv6 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "3FFE:FFFF:0:CD31::/120" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## <a name="private"></a>Azure private peering

This section helps you create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit.

### To create Azure private peering

1. Import the PowerShell module for ExpressRoute.

   Install the latest PowerShell installer from [PowerShell Gallery](https://www.powershellgallery.com/). Then import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You need to run PowerShell as an Administrator.

   ```azurepowershell-interactive
   Install-Module Az
   ```

   Import all of the Az.\* modules within the known semantic version range.

   ```azurepowershell-interactive
   Import-Module Az
   ```

   You can also just import a select module within the known semantic version range.

   ```azurepowershell-interactive
   Import-Module Az.Network 
   ```

   Sign in to your account.

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

   Select the subscription you want to create ExpressRoute circuit.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "<subscription ID>"
   ```
2. Create an ExpressRoute circuit.

   Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Azure private peering for you. You won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue your configuration using the next steps.

3. Check the ExpressRoute circuit to make sure it's provisioned and also enabled. Use the following example:

   ```azurepowershell-interactive
   Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
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
4. Configure Azure private peering for the circuit. Make sure that you have the following items before you continue with the next steps:

   * A pair of subnets that aren't part of any address space reserved for virtual networks. One subnet is used for the primary link, while the other is used for the secondary link. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. You have three options for this pair of subnets:
       * IPv4: Two /30 subnets.
       * IPv6: Two /126 subnets.
       * Both: Two /30 subnets and two /126 subnets.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Ensure that you aren't using 65515.
   * Optional:
     * An MD5 hash if you choose to use one.

   Use the following example to configure Azure private peering for your circuit:

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200

   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 200 -PeerAddressType IPv6

   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```

   If you choose to use an MD5 hash, use the following example:

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200  -SharedKey "A1B2C3D4"

   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 200 -PeerAddressType IPv6 -SharedKey "A1B2C3D4"
   ```

   > [!IMPORTANT]
   > Ensure that you specify your AS number as peering ASN, not customer ASN.
   > 
   >

### <a name="getprivate"></a>To get Azure private peering details

You can get configuration details by using the following example:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt
```

### <a name="updateprivate"></a>To update Azure private peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 200 to 500.

```azurepowershell-interactive
Set-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 500

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Clean up resources

### <a name="deletemsft"></a>To delete Microsoft peering

You can remove your peering configuration by running the following cmdlet:

```azurepowershell-interactive
Remove-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### <a name="deleteprivate"></a>To delete Azure private peering

You can remove your peering configuration by running the following example:

> [!WARNING]
> You must ensure that all virtual networks and ExpressRoute Global Reach connections are removed before running this example. 
> 

```azurepowershell-interactive
Remove-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Next steps

After you've configured Azure private peering, you can create an ExpressRoute gateway to link a virtual network to the circuit. 

> [!div class="nextstepaction"]
> [Configure a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md)
