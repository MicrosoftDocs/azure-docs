---
title: 'Azure ExpressRoute: Configure peering: classic'
description: This article walks you through the steps for creating and provisioning the private, public and Microsoft peering of an ExpressRoute circuit. This article also shows you how to check the status, update, or delete peerings for your circuit.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 04/22/2024
ms.author: duau

---
# Create and modify peering for an ExpressRoute circuit (classic)
> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-routing-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-routing-arm.md)
> * [Azure CLI](howto-routing-cli.md)
> * [Video - Private peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-private-peering-for-your-expressroute-circuit)
> * [Video - Microsoft peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-microsoft-peering-for-your-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-routing-classic.md)
> 

This article walks you through the steps to create and manage peering/routing configuration for an ExpressRoute circuit using PowerShell and the classic deployment model. The following steps show you how to check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. You can configure one, two, or all three peerings (Azure private, Azure public, and Microsoft) for an ExpressRoute circuit. You can configure peerings in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. 

These instructions only apply to circuits created with service providers that offer Layer 2 connectivity services. If you're using a service provider that offers managed Layer 3 services, your connectivity provider configures and manage routing for you.

[!INCLUDE [expressroute-classic-end-include](../../includes/expressroute-classic-end-include.md)]

**About Azure deployment models**

[!INCLUDE [vpn-gateway-classic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

## Configuration prerequisites

* Make sure that you review the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
* You must have an active ExpressRoute circuit. Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state for you to be able to run the following cmdlets.

### Download the latest PowerShell cmdlets

[!INCLUDE [classic powershell install instructions](../../includes/expressroute-poweshell-classic-install-include.md)]

## Azure private peering

This section provides instructions on how to create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit. 

### To create Azure private peering

1. **Create an ExpressRoute circuit.**

   Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-classic.md) and provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue with the following steps.
1. **Check the ExpressRoute circuit to make sure it is provisioned.**
   
   Check to see if the ExpressRoute circuit is Provisioned and also Enabled.

   ```powershell
   Get-AzureDedicatedCircuit -ServiceKey "*********************************"
   ```

   Return:

   ```powershell
   Bandwidth                        : 200
   CircuitName                      : MyTestCircuit
   Location                         : Silicon Valley
   ServiceKey                       : *********************************
   ServiceProviderName              : equinix
   ServiceProviderProvisioningState : Provisioned
   Sku                              : Standard
   Status                           : Enabled
   ```
   
   Make sure that the circuit shows as Provisioned and Enabled. If it isn't, work with your connectivity provider to get your circuit to the required state and status.

   ```powershell
   ServiceProviderProvisioningState : Provisioned
   Status                           : Enabled
   ```
1. **Configure Azure private peering for the circuit.**

   Make sure that you have the following items before you proceed with the next steps:
   
   * A /30 subnet for the primary link. The subnet must not be part of any address space reserved for virtual networks.
   * A /30 subnet for the secondary link. The subnet must not be part of any address space reserved for virtual networks.
   * A valid VLAN ID to establish this peering on. Verify that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Verify that you aren't using 65515.
   * An MD5 hash if you choose to use one. **Optional**.
     
   You can use the following example to configure Azure private peering for your circuit:

   ```powershell
   New-AzureBGPPeering -AccessType Private -ServiceKey "*********************************" -PrimaryPeerSubnet "10.0.0.0/30" -SecondaryPeerSubnet "10.0.0.4/30" -PeerAsn 1234 -VlanId 100
   ```    

   If you want to use an MD5 hash, use the following example to configure private peering for your circuit:

   ```powershell
   New-AzureBGPPeering -AccessType Private -ServiceKey "*********************************" -PrimaryPeerSubnet "10.0.0.0/30" -SecondaryPeerSubnet "10.0.0.4/30" -PeerAsn 1234 -VlanId 100 -SharedKey "A1B2C3D4"
   ```
     
   > [!IMPORTANT]
   > Verify that you specify your AS number as peering ASN, not customer ASN.
   > 

### To view Azure private peering details

You can view configuration details using the following cmdlet:

```powershell
Get-AzureBGPPeering -AccessType Private -ServiceKey "*********************************"
```

Return:

```
AdvertisedPublicPrefixes       : 
AdvertisedPublicPrefixesState  : Configured
AzureAsn                       : 12076
CustomerAutonomousSystemNumber : 
PeerAsn                        : 1234
PrimaryAzurePort               : 
PrimaryPeerSubnet              : 10.0.0.0/30
RoutingRegistryName            : 
SecondaryAzurePort             : 
SecondaryPeerSubnet            : 10.0.0.4/30
State                          : Enabled
VlanId                         : 100
```

### To update Azure private peering configuration

You can update any part of the configuration using the following cmdlet. In the following example, the VLAN ID of the circuit is being updated from 100 to 500.

```powershell
Set-AzureBGPPeering -AccessType Private -ServiceKey "*********************************" -PrimaryPeerSubnet "10.0.0.0/30" -SecondaryPeerSubnet "10.0.0.4/30" -PeerAsn 1234 -VlanId 500 -SharedKey "A1B2C3D4"
```

### To delete Azure private peering

You can remove your peering configuration by running the following cmdlet. You must make sure that all virtual networks are unlinked from the ExpressRoute circuit before running this cmdlet.

```powershell
Remove-AzureBGPPeering -AccessType Private -ServiceKey "*********************************"
```

## Microsoft peering

This section provides instructions on how to create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit. 

### To create Microsoft peering

1. **Create an ExpressRoute circuit**
  
   Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-classic.md) and provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue with the following steps.
1. **Check ExpressRoute circuit to verify that it is provisioned**

   Verify that the circuit shows as Provisioned and Enabled. 
   
   ```powershell
   Get-AzureDedicatedCircuit -ServiceKey "*********************************"
   ```

   Return:
   
   ```powershell
   Bandwidth                        : 200
   CircuitName                      : MyTestCircuit
   Location                         : Silicon Valley
   ServiceKey                       : *********************************
   ServiceProviderName              : equinix
   ServiceProviderProvisioningState : Provisioned
   Sku                              : Standard
   Status                           : Enabled
   ```
   
   Verify that the circuit shows as Provisioned and Enabled. If it isn't, work with your connectivity provider to get your circuit to the required state and status.

   ```powershell
   ServiceProviderProvisioningState : Provisioned
   Status                           : Enabled
   ```
1. **Configure Microsoft peering for the circuit**

    Configure Microsoft peering for the circuit. Make sure that you have the following information before you continue.
   
      * A pair of subnets owned by you and registered in an RIR/IRR. One subnet is used for the primary link, while the other will be used for the secondary link. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. You have three options for this pair of subnets:
       * IPv4: Two /30 subnets. These must be valid public IPv4 prefixes.
       * IPv6: Two /126 subnets. These must be valid public IPv6 prefixes.
       * Both: Two /30 subnets and two /126 subnets.
   * Microsoft peering enables you to communicate with the public IP addresses on Microsoft network. So, your traffic endpoints on your on-premises network should be public too. This is often done using SNAT. 
   > [!NOTE]
   > When using SNAT, we advise against a public IP address from the range assigned to primary or secondary link. Instead, you should use a different range of public IP addresses that has been assigned to you and registered in a Regional Internet Registry (RIR) or Internet Routing Registry (IRR). Depending on your call volume, this range can be as small as a single IP address (represented as '/32' for IPv4 or '/128' for IPv6).
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * Advertised prefixes: You provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR.
   * **Optional -** Customer ASN: If you're advertising prefixes not registered to the peering AS number, you can specify the AS number to which they're registered with.
   * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
   * **Optional -** An MD5 hash if you choose to use one.
     
   Run the following cmdlet to configure Microsoft peering for your circuit:
 
   ```powershell
   New-AzureBGPPeering -AccessType Microsoft -ServiceKey "*********************************" -PrimaryPeerSubnet "131.107.0.0/30" -SecondaryPeerSubnet "131.107.0.4/30" -VlanId 300 -PeerAsn 1234 -CustomerAsn 2245 -AdvertisedPublicPrefixes "123.0.0.0/30" -RoutingRegistryName "ARIN" -SharedKey "A1B2C3D4"
   ```

### To view Microsoft peering details

You can view configuration details using the following cmdlet:

```powershell
Get-AzureBGPPeering -AccessType Microsoft -ServiceKey "*********************************"
```
Return:

```powershell
AdvertisedPublicPrefixes       : 123.0.0.0/30
AdvertisedPublicPrefixesState  : Configured
AzureAsn                       : 12076
CustomerAutonomousSystemNumber : 2245
PeerAsn                        : 1234
PrimaryAzurePort               : 
PrimaryPeerSubnet              : 10.0.0.0/30
RoutingRegistryName            : ARIN
SecondaryAzurePort             : 
SecondaryPeerSubnet            : 10.0.0.4/30
State                          : Enabled
VlanId                         : 300
```

### To update Microsoft peering configuration

You can update any part of the configuration using the following cmdlet:

```powershell
Set-AzureBGPPeering -AccessType Microsoft -ServiceKey "*********************************" -PrimaryPeerSubnet "131.107.0.0/30" -SecondaryPeerSubnet "131.107.0.4/30" -VlanId 300 -PeerAsn 1234 -CustomerAsn 2245 -AdvertisedPublicPrefixes "123.0.0.0/30" -RoutingRegistryName "ARIN" -SharedKey "A1B2C3D4"
```

### To delete Microsoft peering

You can remove your peering configuration by running the following cmdlet:

```powershell
Remove-AzureBGPPeering -AccessType Microsoft -ServiceKey "*********************************"
```

## Next steps

Next, [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md).

* For more information about workflows, see [ExpressRoute workflows](expressroute-workflows.md).
* For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
