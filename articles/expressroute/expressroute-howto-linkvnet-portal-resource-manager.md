---
title: 'Link a virtual network to ExpressRoute circuits - Azure portal'
description: This article shows you how to create a connection to link a virtual network to Azure ExpressRoute circuits using the Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 09/30/2024
ms.author: duau
ms.custom: template-tutorial
---

# Connect a virtual network to ExpressRoute circuits using the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-linkvnet-arm.md)
> * [Azure CLI](expressroute-howto-linkvnet-cli.md)
> * [PowerShell (classic)](expressroute-howto-linkvnet-classic.md)
> 

This article helps you create a connection to link a virtual network (virtual network) to Azure ExpressRoute circuits using the Azure portal. The virtual networks that you connect to your Azure ExpressRoute circuit can either be in the same subscription or part of another subscription.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing a virtual network linked to an ExpressRoute circuit." lightbox="./media/expressroute-howto-linkvnet-portal-resource-manager/gateway-circuit.png":::

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

* Review guidance for [connectivity between virtual networks over ExpressRoute](virtual-network-connectivity-guidance.md).

## Connect a virtual network to a circuit - same subscription

> [!NOTE]
> BGP configuration information will not appear if the layer 3 provider configured your peerings. If your circuit is in a provisioned state, you should be able to create connections.
>

### To create a connection

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Ensure that your ExpressRoute circuit and Azure private peering have been configured successfully. Follow the instructions in [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and [Create and modify peering for an ExpressRoute circuit](expressroute-howto-routing-arm.md). Your ExpressRoute circuit should look like the following image:

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/express-route-circuit.png" alt-text="ExpressRoute circuit screenshot":::

3. You can now start provisioning a connection to link your virtual network gateway to your ExpressRoute circuit. Select **Connection** > **Add** to open the **Create connection** page.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/add-connection.png" alt-text="Add connection screenshot":::

4. Select the **Connection type** as **ExpressRoute** and then select **Next: Settings >**.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/create-connection-basic-new.png" alt-text="Screenshot of create a connection basic page.":::

5. Select the resiliency type for your connection. You can choose **Maximum resiliency** or **Standard resiliency**.

    **Maximum resiliency (Recommended)** - This option provides the highest level of resiliency to your virtual network. It provides two redundant connections from the virtual network gateway to two different ExpressRoute circuits in different ExpressRoute locations.
    
    > [!NOTE]
    > Maximum Resiliency provides maximum protection against location wide outages and connectivity failures in an ExpressRoute location. This option is strongly recommended for all critical and production workloads.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/maximum-resiliency.png" alt-text="Diagram of a virtual network gateway connected to two different ExpressRoute circuits.":::

    **Standard resiliency** - This option provides a single redundant connection from the virtual network gateway to a single ExpressRoute circuit. 

    > [!NOTE]
    > Standard Resiliency does not provide protection against location wide outages. This option is suitable for non-critical and non-production workloads.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/standard-resiliency.png" alt-text="Diagram of a virtual network gateway connected to a single ExpressRoute circuit.":::
    
6. Enter the following information for the respective resiliency type and then select **Review + create**. Then select **Create** after validation completes.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/create-connection-configuration.png" alt-text="Screenshot of the settings page for maximum resiliency ExpressRoute connections to a virtual network gateway.":::

    **Maximum resiliency**

    | Setting | Value |
    | ---     | ---   |
    | Virtual network gateway | Select the virtual network gateway that you want to connect to the ExpressRoute circuit. |
    | Use existing connection or create new | You can augment resiliency for an ExpressRoute connection you already created by selecting **Use existing**. Then select an existing ExpressRoute connection for the first connection. If you select **Use existing**, you only need to configure the second connection. If you select **Create new**, enter following information for both connections. |
    | Name | Enter a name for the connection. |
    | ExpressRoute circuit | Select the ExpressRoute circuit that you want to connect to. |
    | Routing weight | Enter a routing weight for the connection. The routing weight is used to determine the primary and secondary connections. The connection with the higher routing weight is the preferred circuit. |
    | FastPath | Select the checkbox to enable FastPath. For more information, see [About ExpressRoute FastPath](about-fastpath.md). |

    Complete the same information for the second ExpressRoute connection. When selecting an ExpressRoute circuit for the second connection, you are provided with the distance from the first ExpressRoute circuit. This information appears in the diagram and can help you select the second ExpressRoute location.

    > [!NOTE]
    > To have maximum resiliency, you should select two circuits in different peering location. You'll be given the following warning if you select two circuits in the same peering location.
    >
    > :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/same-location-warning.png" alt-text="Screenshot of warning in the Azure portal when selecting two ExpressRoute circuits in the same peering location.":::

    **Standard resiliency**

    For standard resiliency, you only need to enter information for one connection.

7. After your connection has been successfully configured, your connection object will show the information for the connection.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/connection-object.png" alt-text="Screenshot of a created connection resource.":::

## Configure ExpressRoute FastPath

[FastPath](expressroute-about-virtual-network-gateways.md) improves data path performance such as packets per second and connections per second between your on-premises network and your virtual network.

### Configure FastPath on a new connection

When adding a new connection for your ExpressRoute gateway, select the checkbox for **FastPath**.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/enable-fastpath-portal.png" alt-text="Screenshot of FastPath checkbox in add a connection page.":::

> [!NOTE]
> Enabling FastPath for a new connection is only available through creating a connection from the gateway resource. New connections created from the ExpressRoute circuit or from the Connection resource page is not supported.

### Configure FastPath on an existing connection

1. Go to the existing connection resource either from the ExpressRoute gateway, the ExpressRoute circuit, or the Connection resource page.

1.  Select **Configuration** under *Settings* and then select the **FastPath** checkbox. Select **Save** to enable the feature.

    :::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/enable-fastpath-connection.png" alt-text="Screenshot of FastPath checkbox on connection configuration page.":::

> [!NOTE]
> You can use [Connection Monitor](how-to-configure-connection-monitor.md) to verify that your traffic is reaching the destination using FastPath.

## Enroll in ExpressRoute FastPath features (preview)

FastPath support for virtual network peering is now in Public preview. Enrollment is only available through Azure PowerShell. For instructions on how to enroll, see [FastPath preview features](expressroute-howto-linkvnet-arm.md#fastpath-virtual-network-peering-user-defined-routes-udrs-and-private-link-support-for-expressroute-direct-connections). 

> [!NOTE] 
> Any connections configured for FastPath in the target subscription will be enrolled in this preview. We do not advise enabling this preview in production subscriptions.
> If you already have FastPath configured and want to enroll in the preview feature, you need to do the following:
> 1. Enroll in the FastPath preview feature with the Azure PowerShell command.
> 1. Disable and then re-enable FastPath on the target connection.

## Clean up resources

You can delete a connection and unlink your virtual network to an ExpressRoute circuit by selecting the **Delete** icon on the page for your connection.

:::image type="content" source="./media/expressroute-howto-linkvnet-portal-resource-manager/delete-connection.png" alt-text="Delete connection":::

## Next step

In this tutorial, you learned how to connect a virtual network to a circuit in the same subscription and in a different subscription. For more information about ExpressRoute gateways, see: [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To learn how to configure, route filters for Microsoft peering using the Azure portal, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Configure route filters for Microsoft peering](how-to-routefilter-portal.md)
