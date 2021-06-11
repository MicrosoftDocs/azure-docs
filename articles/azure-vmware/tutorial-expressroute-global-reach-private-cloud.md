---
title: Peer on-premises environments to Azure VMware Solution
description: Learn how to create ExpressRoute Global Reach peering to a private cloud in Azure VMware Solution.
ms.topic: tutorial
ms.custom: contperf-fy21q4
ms.date: 05/14/2021
---

# Peer on-premises environments to Azure VMware Solution

In this step of the quick start, you'll connect Azure VMware Solution to your on-premises environment. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud. The ExpressRoute Global Reach connection is established between the private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments. 


>[!NOTE]
>You can connect through VPN, but that's out of scope for this quick start document.

This tutorial results in a connection as shown in the diagram.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" alt-text="Diagram showing ExpressRoute Global Reach on-premises network connectivity." lightbox="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" border="false":::


## Before you begin

Before you enable connectivity between two ExpressRoute circuits using ExpressRoute Global Reach, review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  

## Prerequisites
- A separate, functioning ExpressRoute circuit used to connect on-premises environments to Azure, which is _circuit 1_ for peering.
- Ensure that all gateways, including the ExpressRoute provider's service, supports 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.


## Create an ExpressRoute auth key in the on-premises ExpressRoute circuit

1. From the **ExpressRoute circuits** blade, under Settings, select **Authorizations**.

1. Enter the name for the authorization key and select **Save**.

   :::image type="content" source="media/expressroute-global-reach/start-request-auth-key-on-premises-expressroute.png" alt-text="Select Authorizations and enter the name for the authorization key.":::

   Once created, the new key appears in the list of authorization keys for the circuit.

1. Make a note of the authorization key and the ExpressRoute ID. You'll use them in the next step to complete the peering.

## Peer private cloud to on-premises 
Now that you've created an authorization key for the private cloud ExpressRoute circuit, you can peer it with your on-premises ExpressRoute circuit. The peering is done from the on-premises ExpressRoute circuit in the **Azure portal**. You'll use the resource ID (ExpressRoute circuit ID) and authorization key of your private cloud ExpressRoute circuit to finish the peering.

1. From the private cloud, under Manage, select **Connectivity** > **ExpressRoute Global Reach** > **Add**.

    :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="Screenshot showing the ExpressRoute Global Reach tab in the Azure VMware Solution private cloud.":::

1. Enter the ExpressRoute ID and the authorization key created in the previous section.

   :::image type="content" source="./media/expressroute-global-reach/on-premises-cloud-connections.png" alt-text="Screenshot that shows the dialog for entering the connection information.":::   

1. Select **Create**. The new connection shows in the on-premises cloud connections list.

>[!TIP]
>You can delete or disconnect a connection from the list by selecting **More**.  
>
>:::image type="content" source="./media/expressroute-global-reach/on-premises-connection-disconnect.png" alt-text="Disconnect or deleted an on-premises connection":::


## Verify on-premises network connectivity

You should now see in your **on-premises edge router** where the ExpressRoute connects the NSX-T network segments and the Azure VMware Solution management segments.

>[!IMPORTANT]
>Everyone has a different environment, and some will need to allow these routes to propagate back into the on-premises network.  

## Next steps
Continue to the next tutorial to learn how to deploy and configure VMware HCX solution for your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy and configure VMware HCX](tutorial-deploy-vmware-hcx.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->
