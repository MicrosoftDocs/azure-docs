---
title: 'Tutorial: Configure peering for Expressroute circuit - Azure CLI'
description: This tutorial shows you how to create and provision the private, public, and Microsoft peering of an ExpressRoute circuit. This article also shows you how to check the status, update, or delete peerings for your circuit.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: tutorial
ms.date: 09/15/2023
ms.author: duau
ms.custom: seodec18, devx-track-azurecli
---

# Tutorial: Create and modify peering for an ExpressRoute circuit using CLI

This tutorial shows you how to create and manage routing configuration/peering for an ExpressRoute circuit in the Resource Manager deployment model using CLI. You can also check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. If you want to use a different method to work with your circuit, select an article from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-routing-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-routing-arm.md)
> * [Azure CLI](howto-routing-cli.md)
> * [Public peering](about-public-peering.md)
> * [Video - Private peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-private-peering-for-your-expressroute-circuit)
> * [Video - Microsoft peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-microsoft-peering-for-your-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-routing-classic.md)
> 

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/expressroute-network.png" alt-text="Diagram showing an on-premises network connected to the Microsoft cloud through an ExpressRoute circuit.":::

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure, update, and delete Microsoft peering for a circuit
> - Configure, update, and delete Azure private peering for a circuit

## Prerequisites

* Before beginning, install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* Make sure that you've reviewed the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflow](expressroute-workflows.md) pages before you begin configuration.
* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](howto-circuit-cli.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state for you to run the commands in this article.

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you're using a service provider that offers managed Layer 3 services (typically an IPVPN, like MPLS), your connectivity provider will configure and manage routing for you.

You can configure private peering and Microsoft peering for an ExpressRoute circuit. Peerings can be configured in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. For more information about routing domains and peerings, see [ExpressRoute routing domains](expressroute-circuit-peerings.md).

## <a name="msft"></a>Microsoft peering

This section helps you create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through the Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. For more information, see [Configure a route filter for Microsoft peering](how-to-routefilter-powershell.md).

### To create Microsoft peering

1. Install and use the latest version of the Azure CLI.

   ```azurecli
   az login
   ```

   Select the subscription for which you want to create ExpressRoute circuit.

   ```azurecli
   az account set --subscription "<subscription ID>"
   ```

1. Create an ExpressRoute circuit. Follow the instructions to create an [ExpressRoute circuit](howto-circuit-cli.md) and have it provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Microsoft peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue your configuration using the next steps. 

1. Check the ExpressRoute circuit to make sure it's provisioned and also enabled. Use the following example:

   ```azurecli
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

4. Configure Microsoft peering for the circuit. Make sure that you have the following information before you continue.

   * A /30 subnet for the primary link. The address block must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
   * A /30 subnet for the secondary link. The address block must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * Advertised prefixes: Provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR.
   * **Optional -** Customer ASN: If you're advertising prefixes that are not registered to the peering AS number, you can specify the AS number to which they're registered with.
   * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
   * **Optional -** An MD5 hash if you choose to use one.

   Run the following example to configure Microsoft peering for your circuit:

   ```azurecli
   az network express-route peering create --circuit-name MyCircuit --peer-asn 100 --primary-peer-subnet 123.0.0.0/30 -g ExpressRouteResourceGroup --secondary-peer-subnet 123.0.0.4/30 --vlan-id 300 --peering-type MicrosoftPeering --advertised-public-prefixes 123.1.0.0/24
   ```

### <a name="getmsft"></a>To view Microsoft peering details

You can get configuration details by using the following example:

```azurecli
az network express-route peering show -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzureMicrosoftPeering
```
> [!IMPORTANT]
> Microsoft verifies if the specified 'Advertised public prefixes' and 'Peer ASN' (or 'Customer ASN') are assigned to you in the Internet Routing Registry. If you are getting the public prefixes from another entity and if the assignment is not recorded with the routing registry, the automatic validation will not complete and will require manual validation. If the automatic validation fails, you will see 'AdvertisedPublicPrefixesState' as 'Validation needed' on the output of the above command. 
> 
> If you see the message 'Validation needed', collect the document(s) that show the public prefixes are assigned to your organization by the entity that is listed as the owner of the prefixes in the routing registry and submit these documents for manual validation by opening a support ticket. 
> 
>

The output is similar to the following example:

```output
{
  "azureAsn": 12076,
  "etag": "W/\"2e97be83-a684-4f29-bf3c-96191e270666\"",
  "gatewayManagerEtag": "18",
  "id": "/subscriptions/9a0c2943-e0c2-4608-876c-e0ddffd1211b/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit/peerings/AzureMicrosoftPeering",
  "lastModifiedBy": "Customer",
  "microsoftPeeringConfig": {
    "advertisedPublicPrefixes": [
        ""
      ],
     "advertisedPublicPrefixesState": "",
     "customerASN": ,
     "routingRegistryName": ""
  }
  "name": "AzureMicrosoftPeering",
  "peerAsn": ,
  "peeringType": "AzureMicrosoftPeering",
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

### <a name="updatemsft"></a>To update Microsoft peering configuration

You can update any part of the configuration. The advertised prefixes of the circuit are being updated from 123.1.0.0/24 to 124.1.0.0/24 in the following example:

```azurecli
az network express-route peering update --circuit-name MyCircuit -g ExpressRouteResourceGroup --peering-type MicrosoftPeering --advertised-public-prefixes 124.1.0.0/24
```

### <a name="addIPv6msft"></a>To add IPv6 Microsoft peering settings to an existing IPv4 configuration

```azurecli
az network express-route peering update -g ExpressRouteResourceGroup --circuit-name MyCircuit --peering-type MicrosoftPeering --ip-version ipv6 --primary-peer-subnet 2002:db00::/126 --secondary-peer-subnet 2003:db00::/126 --advertised-public-prefixes 2002:db00::/126
```

## <a name="private"></a>Azure private peering

This section helps you create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit.

### To create Azure private peering

1. Install the latest version of Azure CLI.
1. 
   ```azurecli
   az login
   ```

   Select the subscription you want to create ExpressRoute circuit

   ```azurecli
   az account set --subscription "<subscription ID>"
   ```
1. Create an ExpressRoute circuit. Follow the instructions to create an [ExpressRoute circuit](howto-circuit-cli.md) and have it provisioned by the connectivity provider. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue your configuration using the next steps.

1. Check the ExpressRoute circuit to make sure it's provisioned and also enabled. Use the following example:

   ```azurecli
   az network express-route show --resource-group ExpressRouteResourceGroup --name MyCircuit
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

1. Configure Azure private peering for the circuit. Make sure that you have the following items before you continue with the next steps:

   * A pair of subnets that are not part of any address space reserved for virtual networks. One subnet will be used for the primary link, while the other will be used for the secondary link. From each of these subnets, you will assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. You have three options for this pair of subnets:
       * IPv4: Two /30 subnets.
       * IPv6: Two /126 subnets.
       * Both: Two /30 subnets and two /126 subnets.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Ensure that you aren't using 65515.
   * **Optional -** An MD5 hash if you choose to use one.

   Use the following example to configure Azure private peering for your circuit:

   ```azurecli
   az network express-route peering create --circuit-name MyCircuit --peer-asn 100 --primary-peer-subnet 10.0.0.0/30 -g ExpressRouteResourceGroup --secondary-peer-subnet 10.0.0.4/30 --vlan-id 200 --peering-type AzurePrivatePeering
   ```

   If you choose to use an MD5 hash, use the following example:

   ```azurecli
   az network express-route peering create --circuit-name MyCircuit --peer-asn 100 --primary-peer-subnet 10.0.0.0/30 -g ExpressRouteResourceGroup --secondary-peer-subnet 10.0.0.4/30 --vlan-id 200 --peering-type AzurePrivatePeering --SharedKey "A1B2C3D4"
   ```

   > [!IMPORTANT]
   > Ensure that you specify your AS number as peering ASN, not customer ASN.
   > 
   > 

### <a name="getprivate"></a>To view Azure private peering details

You can get configuration details by using the following example:

```azurecli
az network express-route peering show -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePrivatePeering
```

The output is similar to the following example:

```output
{
  "azureASN": 12076,
  "connections": [],
  "etag": "W/\"abcdef12-3456-7890-abcd-ef1234567890\"",
  "gatewayManagerEtag": "",
  "id": "/subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit/peerings/AzurePrivatePeering",
  "lastModifiedBy": "Customer",
  "microsoftPeeringConfig": {
    "advertisedCommunities": [],
    "advertisedPublicPrefixes": [],
    "advertisedPublicPrefixesState": "NotConfigured",
    "customerASN": 0,
    "legacyMode": 0,
    "routingRegistryName": "NONE"
  },
  "name": "AzurePrivatePeering",
  "peerASN": 65020,
  "peeredConnections": [],
  "peeringType": "AzurePrivatePeering",
  "primaryAzurePort": "",
  "primaryPeerAddressPrefix": "192.168.17.16/30",
  "provisioningState": "Succeeded",
  "resourceGroup": "ExpressRouteResourceGroup",
  "secondaryAzurePort": "",
  "secondaryPeerAddressPrefix": "192.168.17.20/30",
  "state": "Enabled",
  "type": "Microsoft.Network/expressRouteCircuits/peerings",
  "vlanId": 100
}
```

### <a name="updateprivate"></a>To update Azure private peering configuration

You can update any part of the configuration using the following example. In this example, the VLAN ID of the circuit is being updated from 100 to 500.

```azurecli
az network express-route peering update --vlan-id 500 -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePrivatePeering
```

## Clean up resources

### <a name="deletemsft"></a>To delete Microsoft peering

You can remove your peering configuration by running the following example:

```azurecli
az network express-route peering delete -g ExpressRouteResourceGroup --circuit-name MyCircuit --name MicrosoftPeering
```

### <a name="deleteprivate"></a>To delete Azure private peering

You can remove your peering configuration by running the following example:

> [!WARNING]
> You must ensure that all virtual networks and ExpressRoute Global Reach connections are removed before running this example. 
> 
> 

```azurecli
az network express-route peering delete -g ExpressRouteResourceGroup --circuit-name MyCircuit --name AzurePrivatePeering
```

## Next steps

After you've configured Azure private peering, you can link virtual networks to the circuit, see: 

> [!div class="nextstepaction"]
> [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-cli.md)
