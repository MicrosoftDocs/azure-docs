---
title: 'Azure ExpressRoute: Configure Global Reach using the Azure portal'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 03/05/2021
ms.author: duau
---

# Configure ExpressRoute Global Reach using the Azure portal

This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).

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

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/expressroute-circuit-global-reach-list.png" alt-text="Screenshot of ExpressRoute circuits list.":::

## Enable connectivity

Enable connectivity between your on-premises networks. There are separate sets of instructions for circuits that are in the same Azure subscription, and circuits that are different subscriptions.

### ExpressRoute circuits in the same Azure subscription

1. Select the **Azure private** peering configuration. 

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/expressroute-circuit-private-peering.png" alt-text="Screenshot of ExpressRoute overview page.":::

1. Select **Add Global Reach** to open the *Add Global Reach* configuration page.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/private-peering-enable-global-reach.png" alt-text="Enable global reach from private peering":::

1. On the *Add Global Reach* configuration page, give a name to this configuration. Select the *ExpressRoute circuit* you want to connect this circuit to and enter in a **/29 IPv4** for the *Global Reach subnet*. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. Don’t use the addresses in this subnet in your Azure virtual networks, or in your on-premises network. Select **Add** to add the circuit to the private peering configuration.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/add-global-reach-configuration.png" alt-text="Screenshot of adding Global Reach in private peering.":::

1. Select **Save** to complete the Global Reach configuration. When the operation completes, you'll have connectivity between your two on-premises networks through both ExpressRoute circuits.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/save-private-peering-configuration.png" alt-text="Screenshot of saving private peering configurations.":::

### ExpressRoute circuits in different Azure subscriptions

If the two circuits aren't in the same Azure subscription, you'll need authorization. In the following configuration, authorization is generated from circuit 2's subscription. The authorization key is then passed to circuit 1.

1. Generate an authorization key.

   :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/create-authorization-expressroute-circuit.png" alt-text="Screenshot of generating authorization key."::: 

   Make a note of the circuit resource ID of circuit 2 and the authorization key.

1. Select the **Azure private** peering configuration. 

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/expressroute-circuit-private-peering.png" alt-text="Screenshot of private peering on overview page.":::

1. Select **Add Global Reach** to open the *Add Global Reach* configuration page.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/private-peering-enable-global-reach.png" alt-text="Screenshot of add Global Reach in private peering.":::

1. On the *Add Global Reach* configuration page, give a name to this configuration. Check the **Redeem authorization** box. Enter the **Authorization Key** and the **ExpressRoute circuit ID** generated and obtained in Step 1. Then provide a **/29 IPv4** for the *Global Reach subnet*. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. Don’t use the addresses in this subnet in your Azure virtual networks, or in your on-premises network. Select **Add** to add the circuit to the private peering configuration.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/add-global-reach-configuration-with-authorization.png" alt-text="Screenshot of Add Global Reach with authorization key.":::

1. Select **Save** to complete the Global Reach configuration. When the operation completes, you'll have connectivity between your two on-premises networks through both ExpressRoute circuits.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/save-private-peering-configuration.png" alt-text="Screenshot of saving private peering configuration with Global Reach.":::

## Verify the configuration

Verify the Global Reach configuration by selecting *Private peering* under the ExpressRoute circuit configuration. When configured correctly your configuration should look as followed:

:::image type="content" source="./media/expressroute-howto-set-global-reach-portal/verify-global-reach-configuration.png" alt-text="Screenshot of Global Reach configured.":::

## Disable connectivity

To disable connectivity between an individual circuit, select the delete button next to the *Global Reach name* to remove connectivity between them. Then select **Save** to complete the operation.

:::image type="content" source="./media/expressroute-howto-set-global-reach-portal/disable-global-reach-configuration.png" alt-text="Screenshot showing how to disable Global Reach.":::

After the operation is complete, you no longer have connectivity between your on-premises network through your ExpressRoute circuits.

## Next steps
- [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
- [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
