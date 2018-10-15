---
title: 'How to configure routing (peering) for an ExpressRoute circuit: Resource Manager: Azure | Microsoft Docs'
description: This article walks you through the steps for creating and provisioning the private, public and Microsoft peering of an ExpressRoute circuit. This article also shows you how to check the status, update, or delete peerings for your circuit.
documentationcenter: na
services: expressroute
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 8c2a7ed2-ae5c-4e49-81f6-77cf9f2b2ac9
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/12/2018
ms.author: cherylmc

---
# Create and modify peering for an ExpressRoute circuit

This article helps you create and manage routing configuration for an ExpressRoute circuit in the Resource Manager deployment model using the Azure portal. You can also check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. If you want to use a different method to work with your circuit, select an article from the following list:

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

* Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state for you to be able to run the cmdlets in the next sections.
* If you plan to use a shared key/MD5 hash, be sure to use this on both sides of the tunnel and limit the number of characters to a maximum of 25.

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you are using a service provider that offers managed Layer 3 services (typically an IPVPN, like MPLS), your connectivity provider configures and manages routing for you. 

> [!IMPORTANT]
> We currently do not advertise peerings configured by service providers through the service management portal. We are working on enabling this capability soon. Check with your service provider before configuring BGP peerings.
> 
> 

You can configure one, two, or all three peerings (Azure private, Azure public and Microsoft) for an ExpressRoute circuit. You can configure peerings in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. For more information about routing domains and peerings, see [ExpressRoute routing domains](expressroute-circuit-peerings.md).

## <a name="msft"></a>Microsoft peering

This section helps you create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through the Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. For more information, see [Configure a route filter for Microsoft peering](how-to-routefilter-powershell.md).
> 
> 

### To create Microsoft peering

1. Configure ExpressRoute circuit. Ensure that the circuit is fully provisioned by the connectivity provider before continuing further. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Microsoft peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.

  ![list Microsoft peering](./media/expressroute-howto-routing-portal-resource-manager/listprovisioned.png)
2. Configure Microsoft peering for the circuit. Make sure that you have the following information before you proceed.

  * A /30 subnet for the primary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router.
  * A /30 subnet for the secondary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
  * Advertised prefixes: You must provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR.
  * **Optional -** Customer ASN: If you are advertising prefixes that are not registered to the peering AS number, you can specify the AS number to which they are registered.
  * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
  * **Optional -** An MD5 hash if you choose to use one.
3. You can select the peering you wish to configure, as shown in the following example. Select the Microsoft peering row.

  ![select Microsoft peering row](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft1.png)
4. Configure Microsoft peering. The following image shows a configuration example:

  ![configure Microsoft peering](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft2.png)
5. Save the configuration once you have specified all parameters.

  If your circuit gets to a 'Validation needed' state (as shown in the image), you must open a support ticket to show proof of ownership of the prefixes to our support team.

  ![Save Microsoft peering configuration](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft5.png)

  You can open a support ticket directly from the portal, as shown in the following example:

  ![](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft6.png)


1. After the configuration has been accepted successfully, you see something similar to the following image:

  ![](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft7.png)

### <a name="getmsft"></a>To view Microsoft peering details

You can view the properties of Azure public peering by selecting the peering.

![](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft3.png)

### <a name="updatemsft"></a>To update Microsoft peering configuration

You can select the row for peering and modify the peering properties.

![](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft7.png)

### <a name="deletemsft"></a>To delete Microsoft peering

You can remove your peering configuration by selecting the delete icon, as shown in the following image:

![](./media/expressroute-howto-routing-portal-resource-manager/rmicrosoft4.png)

## <a name="private"></a>Azure private peering

This section helps you create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit.

### To create Azure private peering

1. Configure the ExpressRoute circuit. Ensure that the circuit is fully provisioned by the connectivity provider before continuing. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.

  ![list](./media/expressroute-howto-routing-portal-resource-manager/listprovisioned.png)
2. Configure Azure private peering for the circuit. Make sure that you have the following items before you proceed with the next steps:

  * A /30 subnet for the primary link. The subnet must not be part of any address space reserved for virtual networks. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router.
  * A /30 subnet for the secondary link. The subnet must not be part of any address space reserved for virtual networks. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Ensure that you are not using 65515.
  * **Optional -** An MD5 hash if you choose to use one.
3. Select the Azure Private peering row, as shown in the following example:

  ![private](./media/expressroute-howto-routing-portal-resource-manager/rprivate1.png)
4. Configure private peering. The following image shows a configuration example:

  ![configure private peering](./media/expressroute-howto-routing-portal-resource-manager/rprivate2.png)
5. Save the configuration once you have specified all parameters. After the configuration has been accepted successfully, you see something similar to the following example:

  ![save private peering](./media/expressroute-howto-routing-portal-resource-manager/rprivate3.png)

### <a name="getprivate"></a>To view Azure private peering details

You can view the properties of Azure private peering by selecting the peering.

![view private peering](./media/expressroute-howto-routing-portal-resource-manager/rprivate3.png)

### <a name="updateprivate"></a>To update Azure private peering configuration

You can select the row for peering and modify the peering properties.

![update private peering](./media/expressroute-howto-routing-portal-resource-manager/rprivate2.png)

### <a name="deleteprivate"></a>To delete Azure private peering

You can remove your peering configuration by selecting the delete icon, as shown in the following image:

![delete private peering](./media/expressroute-howto-routing-portal-resource-manager/rprivate4.png)

## <a name="public"></a>Azure public peering

This section helps you create, get, update, and delete the Azure public peering configuration for an ExpressRoute circuit.

### To create Azure public peering

1. Configure ExpressRoute circuit. Ensure that the circuit is fully provisioned by the connectivity provider before continuing further. If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Azure public peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, continue your configuration using the next steps.

  ![list public peering](./media/expressroute-howto-routing-portal-resource-manager/listprovisioned.png)
2. Configure Azure public peering for the circuit. Make sure that you have the following items before you proceed with the next steps:

  * A /30 subnet for the primary link. This must be a valid public IPv4 prefix. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router. 
  * A /30 subnet for the secondary link. This must be a valid public IPv4 prefix. From this subnet you will assign the first useable IP address to your router as Microsoft uses the second useable IP for its router.
  * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
  * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
  * **Optional -** An MD5 hash if you choose to use one.
3. Select the Azure public peering row, as shown in the following image:

  ![select public peering row](./media/expressroute-howto-routing-portal-resource-manager/rpublic1.png)
4. Configure public peering. The following image shows a configuration example:

  ![Configure public peering](./media/expressroute-howto-routing-portal-resource-manager/rpublic2.png)
5. Save the configuration once you have specified all parameters. After the configuration has been accepted successfully, you see something similar to the following example:

  ![Save public peering configuration](./media/expressroute-howto-routing-portal-resource-manager/rpublic3.png)

### <a name="getpublic"></a>To view Azure public peering details

You can view the properties of Azure public peering by selecting the peering.

![view public peering properties](./media/expressroute-howto-routing-portal-resource-manager/rpublic3.png)

### <a name="updatepublic"></a>To update Azure public peering configuration

You can select the row for peering and modify the peering properties.

![select public peering row](./media/expressroute-howto-routing-portal-resource-manager/rpublic2.png)

### <a name="deletepublic"></a>To delete Azure public peering

You can remove your peering configuration by selecting the delete icon, as shown in the following example:

![delete public peering](./media/expressroute-howto-routing-portal-resource-manager/rpublic4.png)

## Next steps

Next step, [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
* For more information about ExpressRoute workflows, see [ExpressRoute workflows](expressroute-workflows.md).
* For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* For more information about working with virtual networks, see [Virtual network overview](../virtual-network/virtual-networks-overview.md).
