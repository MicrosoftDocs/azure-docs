---
title: 'Tutorial: Configure peering for ExpressRoute circuit - Azure portal'
description: This tutorial shows you how to create and provision ExpressRoute private and Microsoft peering using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 08/31/2023
ms.author: duau
ms.custom: template-tutorial
---
# Tutorial: Create and modify peering for an ExpressRoute circuit using the Azure portal

This tutorial shows you  how to create and manage routing configuration for an Azure Resource Manager ExpressRoute circuit using the Azure portal. You can also check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. If you want to use a different method to work with your circuit, select an article from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-routing-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-routing-arm.md)
> * [Azure CLI](howto-routing-cli.md)
> * [Public peering](about-public-peering.md)
> * [Video - Private peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-azure-private-peering-for-your-expressroute-circuit)
> * [Video - Microsoft peering](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-set-up-microsoft-peering-for-your-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-routing-classic.md)
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
* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider before you continue. To configure peering(s), the ExpressRoute circuit must be in a provisioned and enabled state. 
* If you plan to use a shared key/MD5 hash, be sure to use the key on both sides of the tunnel. The limit is a maximum of 25 alphanumeric characters. Special characters aren't supported. 

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you're using a service provider that offers managed Layer 3 services (typically an IPVPN, like MPLS), your connectivity provider configures and manages the routing for you. 

> [!IMPORTANT]
> We currently do not advertise peerings configured by service providers through the service management portal. We are working on enabling this capability soon. Check with your service provider before configuring BGP peerings.
> 

## <a name="msft"></a>Microsoft peering

This section helps you create, get, update, and delete the Microsoft peering configuration for an ExpressRoute circuit.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through the Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. For more information, see [Configure a route filter for Microsoft peering](how-to-routefilter-powershell.md).
> 
> 

### To create Microsoft peering

1. Configure the ExpressRoute circuit. Check the **Provider status** to ensure that the circuit is fully provisioned by the connectivity provider before continuing further.

   If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Microsoft peering for you. You won't need to follow the instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue with these steps.

   **Circuit - Provider status: Not provisioned**

    :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/not-provisioned.png" alt-text="Screenshot showing the Overview page for the ExpressRoute Demo Circuit with a red box highlighting the Provider status set to Not provisioned.":::

   **Circuit - Provider status: Provisioned**

    :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/provisioned.png" alt-text="Screenshot that showing the Overview page for the ExpressRoute Demo Circuit with a red box highlighting the Provider status set to Provisioned.":::

2. Configure Microsoft peering for the circuit. Make sure that you have the following information before you continue.

   * A pair of subnets owned by you and registered in an RIR/IRR. One subnet is used for the primary link, while the other will be used for the secondary link. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. You have three options for this pair of subnets:
       * IPv4: Two /30 subnets. These must be valid public IPv4 prefixes.
       * IPv6: Two /126 subnets. These must be valid public IPv6 prefixes.
       * Both: Two /30 subnets and two /126 subnets.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers.
   * Advertised prefixes: You provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. If you plan to send a set of prefixes, you can send a comma-separated list. These prefixes must be registered to you in an RIR / IRR.
   * **Optional -** Customer ASN: If you're advertising prefixes not registered to the peering AS number, you can specify the AS number to which they're registered with.
   * Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
   * **Optional -** An MD5 hash if you choose to use one.
1. You can select the peering you wish to configure, as shown in the following example. Select the Microsoft peering row.

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/select-microsoft-peering.png" alt-text="Screenshot showing how to select the Microsoft peering row.":::

4. Configure Microsoft peering. **Save** the configuration once you've specified all parameters. The following image shows an example configuration:

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/configuration-m-validation-needed.png" alt-text="Screenshot showing Microsoft peering configuration.":::

    > [!IMPORTANT]
    > Microsoft verifies if the specified 'Advertised public prefixes' and 'Peer ASN' (or 'Customer ASN') are assigned to you in the Internet Routing Registry. If you are getting the public prefixes from another entity and if the assignment is not recorded with the routing registry, the automatic validation will not complete and will require manual validation. If the automatic validation fails, you will see the message 'Validation needed'. 
    >
    > If you see the message 'Validation needed', collect the document(s) that show the public prefixes are assigned to your organization by the entity that is listed as the owner of the prefixes in the routing registry and submit these documents for manual validation by opening a support ticket. 
    >

   If your circuit gets to a **Validation needed** state, you must open a support ticket to show proof of ownership of the prefixes to our support team. You can open a support ticket directly from the portal, as shown in the following example:

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/ticket-portal-m.png" alt-text="Screenshot showing new support ticket request to submit proof of ownership for public prefixes.":::

### <a name="getmsft"></a>To view Microsoft peering details

You can view the properties of Microsoft peering by selecting the row for the peering.

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/view-peering-m.png" alt-text="Screenshot showing how to view Microsoft peering properties.":::

### <a name="updatemsft"></a>To update Microsoft peering configuration

You can select the row for the peering that you want to modify, then modify the peering properties and save your modifications.

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/configuration-m.png" alt-text="Screenshot showing how to update Microsoft peering configuration.":::

## <a name="private"></a>Azure private peering

This section helps you create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit.

### To create Azure private peering

1. Configure the ExpressRoute circuit. Ensure that the circuit is fully provisioned by the connectivity provider before continuing. 

   If your connectivity provider offers managed Layer 3 services, you can ask your connectivity provider to enable Azure private peering for you. You won't need to follow the instructions listed in the next sections. However, if your connectivity provider doesn't manage routing for you, after creating your circuit, continue with the next steps.

   **Circuit - Provider status: Not provisioned**

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/not-provisioned.png" alt-text="Screenshot showing the Overview page for the ExpressRoute Demo Circuit with a red box highlighting the Provider status that is set to Not provisioned.":::

   **Circuit - Provider status: Provisioned**

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/provisioned.png" alt-text="Screenshot showing the Overview page for the ExpressRoute Demo Circuit with a red box highlighting the Provider status that is set to Provisioned.":::

2. Configure Azure private peering for the circuit. Make sure that you have the following items before you continue with the next steps:

   * A pair of subnets that aren't part of any address space reserved for virtual networks. One subnet is used for the primary link, while the other will be used for the secondary link. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. You have three options for this pair of subnets:
       * IPv4: Two /30 subnets.
       * IPv6: Two /126 subnets.
       * Both: Two /30 subnets and two /126 subnets.
   * A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both Primary and Secondary links you must use the same VLAN ID.
   * AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering except for the number from 65515 to 65520, inclusively.
   * You must advertise the routes from your on-premises Edge router to Azure via BGP when you configure the private peering.
   * **Optional -** An MD5 hash if you choose to use one.
3. Select the Azure private peering row, as shown in the following example:

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/select-private-peering.png" alt-text="Screenshot showing how to select the private peering row.":::

4. Configure private peering. **Save** the configuration once you've specified all parameters.

   :::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/private-peering-configuration.png" alt-text="Screenshot showing private peering configuration.":::

### <a name="getprivate"></a>To view Azure private peering details

You can view the properties of Azure private peering by selecting the peering.

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/view-private-peering.png" alt-text="Screenshot showing how to view private peering properties.":::

### <a name="updateprivate"></a>To update Azure private peering configuration

You can select the row for peering and modify the peering properties. After updating, save your changes.

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/update-private-peering.png" alt-text="Screenshot showing how to update private peering configuration.":::

## Clean up resources

### <a name="deletemsft"></a>To delete Microsoft peering

You can remove your Microsoft peering configuration by right-clicking the peering and selecting **Delete** as shown in the following image:

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/delete-microsoft-peering.png" alt-text="Screenshot showing how to delete Microsoft peering.":::

### <a name="deleteprivate"></a>To delete Azure private peering

You can remove your private peering configuration by right-clicking the peering and selecting **Delete** as shown in the following image:

> [!WARNING]
> You must ensure that all virtual network connections and ExpressRoute Global Reach connections are removed before running this operation. 
> 

:::image type="content" source="./media/expressroute-howto-routing-portal-resource-manager/delete-private-peering.png" alt-text="Screenshot showing how to delete private peering.":::

## Next steps

After you've configured Azure private peering, you can create an ExpressRoute gateway to link a virtual network to the circuit. 

> [!div class="nextstepaction"]
> [Configure a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md)
