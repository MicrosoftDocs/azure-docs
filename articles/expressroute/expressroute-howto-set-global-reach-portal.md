---
title: 'Azure ExpressRoute: Configure Global Reach using the Azure portal'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Configure ExpressRoute Global Reach using the Azure portal

This article helps you configure ExpressRoute Global Reach using the Azure portal. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).

 ## Before you begin

Before you start configuration, confirm the following criteria:

* You understand ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Your ExpressRoute circuits are in a provisioned state.
* Azure private peering is configured on your ExpressRoute circuits.
* If you want to run PowerShell locally, verify that the latest version of Azure PowerShell is installed on your computer.

## Identify circuits

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

2. Identify the ExpressRoute circuits that you want use. You can enable ExpressRoute Global Reach between the private peering of any two ExpressRoute circuits, as long as they're located in the supported countries/regions. The circuits are required to be created at different peering locations. 

   * If your subscription owns both circuits, you can choose either circuit to run the configuration in the following sections.
   * If the two circuits are in different Azure subscriptions, you need authorization from one Azure subscription. Then you pass in the authorization key when you run the configuration command in the other Azure subscription.

> [!NOTE]
> ExpressRoute Global Reach configurations can only be seen from the configured circuit.

## Enable connectivity

Enable connectivity between your on-premises networks. There are separate sets of instructions for circuits that are in the same Azure subscription, and circuits that are different subscriptions.

### ExpressRoute circuits in the same Azure subscription

1. Select the **Overview** tab of your ExpressRoute circuit and then select **Add Global Reach** to open the *Add Global Reach* configuration page.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/overview.png" alt-text="Screenshot of ExpressRoute overview page.":::

1. On the *Add Global Reach* configuration page, give a name to this configuration. Select the *ExpressRoute circuit* you want to connect this circuit to and enter in a **/29 IPv4** for the *Global Reach IPv4 subnet*. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. Don’t use the addresses in this subnet in your Azure virtual networks, private peering subnet, or on-premises network. Select **Add** to add the circuit to the private peering configuration.

    > [!NOTE]
    > If you wish to enable IPv6 support for ExpressRoute Global Reach, select "Both" for the *Subnets* field and include a **/125 IPv6** subnet for the *Global Reach IPv6 subnet*.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/add-global-reach-configuration.png" alt-text="Screenshot of adding Global Reach in Overview tab.":::

1. Select **Save** to complete the Global Reach configuration. When the operation completes, you have connectivity between your two on-premises networks through both ExpressRoute circuits.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/save-configuration.png" alt-text="Screenshot of the save button for Global Reach configuration.":::

    > [!NOTE]
    > The Global Reach configuration is bidirectional. Once you create the connection from one circuit the other circuit will also have the configuration.
    > 

### ExpressRoute circuits in different Azure subscriptions

If the two circuits aren't in the same Azure subscription, you need authorization. In the following configuration, authorization is generated from circuit 2's subscription. The authorization key is then passed to circuit 1.

1. Generate an authorization key.

   :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/create-authorization-expressroute-circuit.png" alt-text="Screenshot of generating authorization key."::: 

   Make a note of the circuit resource ID of circuit 2 and the authorization key.

1. Select the **Overview** tab of ExpressRoute circuit 1. Select **Add Global Reach** to open the *Add Global Reach* configuration page.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/overview.png" alt-text="Screenshot of Global Reach button on the overview page.":::

1. On the *Add Global Reach* configuration page, give a name to this configuration. Check the **Redeem authorization** box. Enter the **Authorization Key** and the **ExpressRoute circuit ID** generated and obtained in Step 1. Then provide a **/29 IPv4** for the *Global Reach IPv4 subnet*. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. Don’t use the addresses in this subnet in your Azure virtual networks, or in your on-premises network. Select **Add** to add the circuit to the private peering configuration.

    > [!NOTE]
    > If you wish to enable IPv6 support for ExpressRoute Global Reach, select "Both" for the *Subnets* field and include a **/125 IPv6** subnet for the *Global Reach IPv6 subnet*.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/add-global-reach-configuration-with-authorization.png" alt-text="Screenshot of Add Global Reach with authorization key.":::

1. Select **Save** to complete the Global Reach configuration. When the operation completes, you have connectivity between your two on-premises networks through both ExpressRoute circuits.

## Verify the configuration

Verify the Global Reach configuration by reviewing the list of Global Reach connections in the **Overview** tab of your ExpressRoute circuit. When configured correctly your configuration should look as follows:

:::image type="content" source="./media/expressroute-howto-set-global-reach-portal/verify-global-reach-configuration.png" alt-text="Screenshot of Global Reach configured.":::

## Disable connectivity

To disable connectivity between an individual circuit, select the delete button to the right of the Global Reach connection to remove connectivity between them. Then select **Save** to complete the operation.

After the operation is complete, you no longer have connectivity between your on-premises network through your ExpressRoute circuits.

## Update configuration

1. To update the configuration for a Global Reach connection, select the connection name.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/select-configuration.png" alt-text="Screenshot of Global Reach connection name.":::

1. Update the configuration on the *Edit Global Reach** page and the select **Save**.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/edit-configuration.png" alt-text="Screenshot of the edit Global Reach configuration page.":::

1. Select **Save** on the main overview page to apply the configuration to the circuit.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/save-edit-configuration.png" alt-text="Screenshot of the save button after editing Global Reach configuration.":::

## Next steps
- [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
- [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
