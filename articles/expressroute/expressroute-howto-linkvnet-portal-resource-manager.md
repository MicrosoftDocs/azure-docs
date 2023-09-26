---
title: 'Tutorial: Link a virtual network to an ExpressRoute circuit - Azure portal'
description: This tutorial shows you how to create a connection to link a virtual network to an Azure ExpressRoute circuit using the Azure portal. 
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 08/31/2023
ms.author: duau
ms.custom: seodec18, template-tutorial
---

# Tutorial: Connect a virtual network to an ExpressRoute circuit using the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-linkvnet-arm.md)
> * [Azure CLI](expressroute-howto-linkvnet-cli.md)
> * [PowerShell (classic)](expressroute-howto-linkvnet-classic.md)
> 

This tutorial helps you create a connection to link a virtual network (virtual network) to an Azure ExpressRoute circuit using the Azure portal. The virtual networks that you connect to your Azure ExpressRoute circuit can either be in the same subscription or part of another subscription.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing a virtual network linked to an ExpressRoute circuit.":::

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Connect a virtual network to a circuit in the same subscription.
> - Connect a virtual network to a circuit in a different subscription.
> - Configure ExpressRoute FastPath.
> - Delete the link between the virtual network and ExpressRoute circuit.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.

* You must have an active ExpressRoute circuit.
  * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider.
  * Ensure that you have Azure private peering configured for your circuit. See the [Create and modify peering for an ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md) article for peering and routing instructions.
  * Ensure that Azure private peering gets configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.
  * Ensure that you have a virtual network and a virtual network gateway created and fully provisioned. Follow the instructions to [create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md). A virtual network gateway for ExpressRoute uses the GatewayType `ExpressRoute`, not VPN.

* You can link up to 10 virtual networks to a standard ExpressRoute circuit. All virtual networks must be in the same geopolitical region when using a standard ExpressRoute circuit.

* A single virtual network can be linked to up to 16 ExpressRoute circuits. Use the following process to create a new connection object for each ExpressRoute circuit you're connecting to. The ExpressRoute circuits can be in the same subscription, different subscriptions, or a mix of both.

* If you enable the ExpressRoute premium add-on, you can link virtual networks outside of the geopolitical region of the ExpressRoute circuit. The premium add-on also allows you to connect more than 10 virtual networks to your ExpressRoute circuit depending on the bandwidth chosen. Check the [FAQ](expressroute-faqs.md) for more details on the premium add-on.

* In order to create the connection from the ExpressRoute circuit to the target ExpressRoute virtual network gateway, the number of address spaces advertised from the local or peered virtual networks needs to be equal to or less than **200**. Once the connection has been successfully created, you can add more address spaces, up to 1,000, to the local or peered virtual networks.

* Review guidance for [connectivity between virtual networks over ExpressRoute](virtual-network-connectivity-guidance.md).

## Connect a virtual network to a circuit - same subscription

> [!NOTE]
> BGP configuration information will not appear if the layer 3 provider configured your peerings. If your circuit is in a provisioned state, you should be able to create connections.
>

### To create a connection

1. Ensure that your ExpressRoute circuit and Azure private peering have been configured successfully. Follow the instructions in [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and [Create and modify peering for an ExpressRoute circuit](expressroute-howto-routing-arm.md). Your ExpressRoute circuit should look like the following image:

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/express-route-circuit.png" alt-text="ExpressRoute circuit screenshot":::

1. You can now start provisioning a connection to link your virtual network gateway to your ExpressRoute circuit. Select **Connection** > **Add** to open the **Add connection** page.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/add-connection.png" alt-text="Add connection screenshot":::

1. Enter a name for the connection and then select **Next: Settings >**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/create-connection-basic.png" alt-text="Create connection basic page":::

1. Select the gateway that belongs to the virtual network that you want to link to the circuit and select **Review + create**. Then select **Create** after validation completes.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/create-connection-settings.png" alt-text="Create connection settings page":::

1. After your connection has been successfully configured, your connection object will show the information for the connection.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/connection-object.png" alt-text="Connection object screenshot":::

## Connect a virtual network to a circuit - different subscription

You can share an ExpressRoute circuit across multiple subscriptions. The following figure shows a simple schematic of how sharing works for ExpressRoute circuits across multiple subscriptions.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/cross-subscription.png" alt-text="Cross-subscription connectivity":::

> [!NOTE]
> Connecting virtual networks between Azure sovereign clouds and Public Azure cloud is not supported. You can only link virtual networks from different subscriptions in the same cloud.

Each of the smaller clouds within the large cloud is used to represent subscriptions that belong to different departments within an organization. Each of the departments within the organization uses their own subscription for deploying their services--but they can share a single ExpressRoute circuit to connect back to your on-premises network. A single department (in this example: IT) can own the ExpressRoute circuit. Other subscriptions within the organization may use the ExpressRoute circuit.

  > [!NOTE]
  > Connectivity and bandwidth charges for the dedicated circuit will be applied to the ExpressRoute circuit owner. All virtual networks share the same bandwidth.
  >

### Administration - About circuit owners and circuit users

The 'circuit owner' is an authorized Power User of the ExpressRoute circuit resource. The circuit owner can create authorizations that can be redeemed by 'circuit users'. Circuit users are owners of virtual network gateways that aren't within the same subscription as the ExpressRoute circuit. Circuit users can redeem authorizations (one authorization per virtual network).

The circuit owner has the power to modify and revoke authorizations at any time. Revoking an authorization results in all link connections being deleted from the subscription whose access was revoked.

  > [!NOTE]
  > Circuit owner is not an built-in RBAC role or defined on the ExpressRoute resource.
  > The definition of the circuit owner is any role with the following access:
  > - Microsoft.Network/expressRouteCircuits/authorizations/write
  > - Microsoft.Network/expressRouteCircuits/authorizations/read
  > - Microsoft.Network/expressRouteCircuits/authorizations/delete
  >
  > This includes the built-in roles such as Contributor, Owner and Network Contributor. Detailed description for the different [built-in roles](../role-based-access-control/built-in-roles.md).

### Circuit owner operations

**To create a connection authorization**

The circuit owner creates an authorization, which creates an authorization key to be used by a circuit user to connect their virtual network gateways to the ExpressRoute circuit. An authorization is valid for only one connection.

> [!NOTE]
> Each connection requires a separate authorization.
>

1. In the ExpressRoute page, select **Authorizations** and then type a **name** for the authorization and select **Save**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/authorization.png" alt-text="Authorizations":::

2. Once the configuration is saved, copy the **Resource ID** and the **Authorization Key**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/authorization-key.png" alt-text="Authorization key":::

**To delete a connection authorization**

You can delete a connection by selecting the **Delete** icon for the authorization key for your connection.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/delete-authorization-key.png" alt-text="Delete authorization key":::

If you want to delete the connection but retain the authorization key, you can delete the connection from the connection page of the circuit.
> [!NOTE]
  > Connections redeemed in different subscriptions will not display in the circuit connection page. Navigate to the subscription where the authorization was redeemed and delete the top-level connection resource.
  >

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/delete-connection-owning-circuit.png" alt-text="Delete connection owning circuit":::

### Circuit user operations

The circuit user needs the resource ID and an authorization key from the circuit owner.

**To redeem a connection authorization**

1. Select the **+ Create a resource** button. Search for **Connection** and select **Create**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/create-new-resources.png" alt-text="Create new resources":::

1. Make sure the *Connection type* is set to **ExpressRoute**. Select the *Resource group* and *Location*, then select **OK** in the Basics page.

    > [!NOTE]
    > The location *must* match the virtual network gateway location you're creating the connection for.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/connection-basics.png" alt-text="Basics page":::

1. In the **Settings** page, Select the *Virtual network gateway* and check the **Redeem authorization** check box. Enter the *Authorization key* and the *Peer circuit URI* and give the connection a name. Select **OK**. 
 
    > [!NOTE]
    > The *Peer Circuit URI* is the Resource ID of the ExpressRoute circuit (which you can find under the Properties Setting pane of the ExpressRoute Circuit).

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/connection-settings.png" alt-text="Settings page":::

1. Review the information in the **Summary** page and select **OK**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/connection-summary.png" alt-text="Summary page":::

## Configure ExpressRoute FastPath

You can enable [ExpressRoute FastPath](expressroute-about-virtual-network-gateways.md) if your virtual network gateway is Ultra Performance or ErGw3AZ. FastPath improves data path performance such as packets per second and connections per second between your on-premises network and your virtual network.

**Configure FastPath on a new connection**

When adding a new connection for your ExpressRoute gateway, select the checkbox for **FastPath**.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/enable-fastpath-portal.png" alt-text="Screenshot of FastPath checkbox in add a connection page.":::

> [!NOTE]
> Enabling FastPath for a new connection is only available through creating a connection from the gateway resource. New connections created from the ExpressRoute circuit or from the Connection resource page is not supported.
>
**Configure FastPath on an existing connection**

1. Go to the existing connection resource either from the ExpressRoute gateway, the ExpressRoute circuit, or the Connection resource page.

1.  Select **Configuration** under *Settings* and then select the **FastPath** checkbox. Select **Save** to enable the feature.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/enable-fastpath-connection.png" alt-text="Screenshot of FastPath checkbox on connection configuration page.":::

> [!NOTE]
> You can use [Connection Monitor](how-to-configure-connection-monitor.md) to verify that your traffic is reaching the destination using FastPath.
>

## Enroll in ExpressRoute FastPath features (preview)

FastPath support for virtual network peering is now in Public preview. Enrollment is only available through Azure PowerShell. See [FastPath preview features](expressroute-howto-linkvnet-arm.md#enroll-in-expressroute-fastpath-features-preview), for instructions on how to enroll.

> [!NOTE] 
> Any connections configured for FastPath in the target subscription will be enrolled in this preview. We do not advise enabling this preview in production subscriptions.
> If you already have FastPath configured and want to enroll in the preview feature, you need to do the following:
> 1. Enroll in the FastPath preview feature with the Azure PowerShell command.
> 1. Disable and then re-enable FastPath on the target connection.

## Clean up resources

You can delete a connection and unlink your virtual network to an ExpressRoute circuit by selecting the **Delete** icon on the page for your connection.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/delete-connection.png" alt-text="Delete connection":::

## Next steps

In this tutorial, you learned how to connect a virtual network to a circuit in the same subscription and in a different subscription. For more information about ExpressRoute gateways, see: [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To learn how to configure, route filters for Microsoft peering using the Azure portal, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Configure route filters for Microsoft peering](how-to-routefilter-portal.md)
