---
title: Create and manage Azure ExpressRoute public peering
description: Learn about and manage Azure public peering
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: duau 
---
# Create and manage ExpressRoute public peering

> [!div class="op_single_selector"]
> * [Article - Public peering](about-public-peering.md)
> * [Video - Public peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-public-peering-for-your-expressroute-circuit)
> * [Article - Microsoft peering](expressroute-circuit-peerings.md#microsoftpeering)
>

This article helps you create and manage public peering routing configuration for an ExpressRoute circuit. You can also check the status, update, or delete and deprovision peerings. This article applies to Resource Manager circuits that were created before public peering was deprecated. If you have a previously existing circuit (created prior to public peering being deprecated), you can manage/configure public peering using [Azure PowerShell](#powershell), [Azure CLI](#cli), and the [Azure portal](#portal).

>[!NOTE]
>Public peering is deprecated. You cannot create public peering on new ExpressRoute circuits. If you have a new ExpressRoute circuit, instead, use [Microsoft peering](expressroute-circuit-peerings.md#microsoftpeering) for your Azure services.
>

## Connectivity

Connectivity is always initiated from your WAN to Microsoft Azure services. Microsoft Azure services can't initiate connections into your network through this routing domain. If your ExpressRoute circuit is enabled for Azure public peering, you can access the [public IP ranges used in Azure](../virtual-network/ip-services/public-ip-addresses.md#public-ip-addresses) over the circuit.

Once public peering is enabled, you can connect to most Azure services. We don't allow you to selectively pick services for which we advertise routes to.

* Services such as Azure Storage, SQL Databases, and Websites are offered on public IP addresses.
* Through the public peering routing domain, you can privately connect to services hosted on public IP addresses, including VIPs of your cloud services.
* You can connect the public peering domain to your DMZ and connect to all Azure services on their public IP addresses from your WAN without having to connect through the internet.

## <a name="services"></a>Services

This section shows the services available over public peering. Because public peering is deprecated, there's no plan to add new or more services to public peering. If you use public peering and the service you want to use is support only over Microsoft peering, you must switch to Microsoft peering. See [Microsoft peering](expressroute-faqs.md#microsoft-peering) for a list of supported services.

**Supported:**

* Power BI
* Most of the Azure services are supported. Check directly with the service that you want to use to verify support.

**Not supported:**
  * CDN
  * Azure Front Door
  * Multi-factor Authentication Server (legacy)
  * Traffic Manager

To validate availability for a specific service, you can check the documentation for that service to see if there's a reserved range published for that service. Then you may look up the IP ranges of the target service and compare with the ranges listed in the [Azure IP Ranges and Service Tags – Public Cloud XML file](https://www.microsoft.com/download/details.aspx?id=56519). Alternatively, you can open a support ticket for the service in question for clarification.

## <a name="compare"></a>Peering comparison

[!INCLUDE [peering comparison](../../includes/expressroute-peering-comparison.md)]

> [!NOTE]
> Azure public peering has 1 NAT IP address associated to each BGP session. For greater than 2 NAT IP addresses, move to Microsoft peering. Microsoft peering allows you to configure your own NAT allocations, as well as use route filters for selective prefix advertisements. For more information, see [Move to Microsoft peering](./how-to-move-peering.md).
>

## Custom route filters

You can define custom route filters within your network to consume only the routes you need. Refer to the [Routing](expressroute-routing.md) page for detailed information on routing configuration.

## <a name="powershell"></a>Azure PowerShell steps


[!INCLUDE [CloudShell](../../includes/expressroute-cloudshell-powershell-about.md)]

Because public peering is deprecated, you can't configure public peering on a new ExpressRoute circuit.

1. Verify that you have an ExpressRoute circuit that is provisioned and also enabled. Use the following example:

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
2. Configure Azure public peering for the circuit. Make sure that you have the following information before you proceed further.

   * A /30 subnet for the primary link. This IP must be a valid public IPv4 prefix.
   * A /30 subnet for the secondary link. This IP must be a valid public IPv4 prefix.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * Optional:
   * An MD5 hash if you choose to use one.

   Run the following example to configure Azure public peering for your circuit

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100

   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```

   If you choose to use an MD5 hash, use the following example:

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100  -SharedKey "A1B2C3D4"

   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```

   > [!IMPORTANT]
   > Ensure that you specify your AS number as peering ASN, not customer ASN.
   > 
   >

### <a name="getpublic"></a>To get Azure public peering details

You can get configuration details using the following cmdlet:

```azurepowershell-interactive
  $ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

  Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt
  ```

### <a name="updatepublic"></a>To update Azure public peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 200 to 600.

```azurepowershell-interactive
Set-AzExpressRouteCircuitPeeringConfig  -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 600

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### <a name="deletepublic"></a>To delete Azure public peering

You can remove your peering configuration by running the following example:

```azurepowershell-interactive
Remove-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## <a name="cli"></a>Azure CLI steps


[!INCLUDE [CloudShell](../../includes/expressroute-cloudshell-powershell-about.md)]

1. Check the ExpressRoute circuit to ensure it's provisioned and also enabled. Use the following example:

   ```azurecli-interactive
   az network express-route list
   ```

   The response is similar to the following example:

   ```output
   "allowClassicOperations": false,
   "authorizations": [],
   "circuitProvisioningState": "Enabled",
   "etag": "W/\"1262c492-ffef-4a63-95a8-a6002736b8c4\"",
   "gatewayManagerEtag": null,
   "id": "/subscriptions/81ab786c-56eb-4a4d-bb5f-f60329772466/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit",
   "location": "westus",
   "name": "MyCircuit",
   "peerings": [],
   "provisioningState": "Succeeded",
   "resourceGroup": "ExpressRouteResourceGroup",
   "serviceKey": "1d05cf70-1db5-419f-ad86-1ca62c3c125b",
   "serviceProviderNotes": null,
   "serviceProviderProperties": {
    "bandwidthInMbps": 200,
    "peeringLocation": "Silicon Valley",
    "serviceProviderName": "Equinix"
   },
   "serviceProviderProvisioningState": "Provisioned",
   "sku": {
    "family": "UnlimitedData",
    "name": "Standard_MeteredData",
    "tier": "Standard"
   },
   "tags": null,
   "type": "Microsoft.Network/expressRouteCircuits]
   ```

2. Configure Azure public peering for the circuit. Make sure that you have the following information before you proceed further.

   * A /30 subnet for the primary link. This IP must be a valid public IPv4 prefix.
   * A /30 subnet for the secondary link. This IP must be a valid public IPv4 prefix.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * **Optional -** An MD5 hash if you choose to use one.

   Run the following example to configure Azure public peering for your circuit:

   ```azurecli-interactive
   az network express-route peering create --circuit-name MyCircuit --peer-asn 100 --primary-peer-subnet 12.0.0.0/30 -g ExpressRouteResourceGroup --secondary-peer-subnet 12.0.0.4/30 --vlan-id 200 --peering-type AzurePublicPeering
   ```

   If you choose to use an MD5 hash, use the following example:

   ```azurecli-interactive
   az network express-route peering create --circuit-name MyCircuit --peer-asn 100 --primary-peer-subnet 12.0.0.0/30 -g ExpressRouteResourceGroup --secondary-peer-subnet 12.0.0.4/30 --vlan-id 200 --peering-type AzurePublicPeering --SharedKey "A1B2C3D4"
   ```

   > [!IMPORTANT]
   > Ensure that you specify your AS number as peering ASN, not customer ASN.

### <a name="getpublic"></a>To view Azure public peering details

You can get configuration details using the following example:

```azurecli
az network express-route peering show -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePublicPeering
```

The output is similar to the following example:

```output
{
  "azureAsn": 12076,
  "etag": "W/\"2e97be83-a684-4f29-bf3c-96191e270666\"",
  "gatewayManagerEtag": "18",
  "id": "/subscriptions/9a0c2943-e0c2-4608-876c-e0ddffd1211b/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit/peerings/AzurePublicPeering",
  "lastModifiedBy": "Customer",
  "microsoftPeeringConfig": null,
  "name": "AzurePublicPeering",
  "peerAsn": 7671,
  "peeringType": "AzurePublicPeering",
  "primaryAzurePort": "",
  "primaryPeerAddressPrefix": "",
  "provisioningState": "Succeeded",
  "resourceGroup": "ExpressRouteResourceGroup",
  "routeFilter": null,
  "secondaryAzurePort": "",
  "secondaryPeerAddressPrefix": "",
  "sharedKey": null,
  "state": "Enabled",
  "stats": null,
  "vlanId": 100
}
```

### <a name="updatepublic"></a>To update Azure public peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 200 to 600.

```azurecli-interactive
az network express-route peering update --vlan-id 600 -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePublicPeering
```

### <a name="deletepublic"></a>To delete Azure public peering

You can remove your peering configuration by running the following example:

```azurecli-interactive
az network express-route peering delete -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePublicPeering
```

## <a name="portal"></a>Azure portal steps

To configure peering, use the PowerShell or CLI steps contained in this article. To manage a peering, you can use the following sections. For reference, these steps look similar to managing a [Microsoft peering in the portal](expressroute-howto-routing-portal-resource-manager.md#msft).

### <a name="get"></a>To view Azure public peering details

View the properties of Azure public peering by selecting the peering in the portal.

### <a name="update"></a>To update Azure public peering configuration

Select the row for peering, then modify the peering properties.

### <a name="delete"></a>To delete Azure public peering

Remove your peering configuration by selecting the delete icon.

## Next steps

Next step, [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

* For more information about ExpressRoute workflows, see [ExpressRoute workflows](expressroute-workflows.md).
* For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* For more information about working with virtual networks, see [Virtual network overview](../virtual-network/virtual-networks-overview.md).
