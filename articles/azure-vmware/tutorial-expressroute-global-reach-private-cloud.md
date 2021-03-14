---
title: Tutorial - Peer on-premises environments to a private cloud
description: Learn how to create ExpressRoute Global Reach peering to a private cloud in an Azure VMware Solution.
ms.topic: tutorial
ms.date: 03/15/2021
---

# Tutorial: Peer on-premises environments to a private cloud

ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud. The ExpressRoute Global Reach connection is established between the private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments. 

The ExpressRoute circuit you use when you [configure networking for your VMware private cloud in Azure](tutorial-configure-networking.md) requires you to create and use authorization keys.  You'll have already used one authorization key from the ExpressRoute circuit, and in this tutorial, you'll create a second authorization key to peer with your on-premises ExpressRoute circuit.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a second authorization key for _circuit 2_, the private cloud ExpressRoute circuit.
> * Use the Azure portal to enable on-premises-to-private cloud ExpressRoute Global Reach peering.


## Before you begin

Before you enable connectivity between two ExpressRoute circuits using ExpressRoute Global Reach, review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  


## Prerequisites

- Established connectivity to and from an Azure VMware Solution private cloud with its ExpressRoute circuit peered with an ExpressRoute gateway in an Azure virtual network (VNet) – which is circuit 2 from peering procedures.
- A separate, functioning ExpressRoute circuit used to connect on-premises environments to Azure – which is circuit 1 from the peering procedures' perspective.
- A /29 non-overlapping [network address block](../expressroute/expressroute-routing.md#ip-addresses-used-for-peerings) for the ExpressRoute Global Reach peering.
- Ensure that all gateways, including the ExpressRoute provider's service, support 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

>[!IMPORTANT]
>In the context of these prerequisites, your on-premises ExpressRoute circuit is _circuit 1_, and your private cloud ExpressRoute circuit is in a different subscription and labeled _circuit 2_.


## Create an ExpressRoute authorization key in the on-premises ExpressRoute circuit

1. From the **ExpressRoute circuits** blade, under Settings, select **Authorizations**.

2. Enter the name for the authorization key and select **Save**.

    :::image type="content" source="media/expressroute-global-reach/start-request-auth-key-on-premises-expressroute.png" alt-text="Select Authorizations and enter the name for the authorization key.":::
  
     Once created, the new key appears in the list of authorization keys for the circuit.
 
 4. Make a note of the authorization key and the ExpressRoute ID. You'll use them in the next step to complete the peering.
 
 
 ## Peer private cloud to on-premises

1. From the private cloud **Overview**, under Manage, select **Connectivity > ExpressRoute Global Reach > Add**.

    :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="From the menu, select Connectivity, the ExpressRoute Global Reach tab, and then Add.":::

2. Enter the ExpressRoute ID and the authorization key created in the previous section.

    :::image type="content" source="./media/expressroute-global-reach/on-premises-cloud-connections.png" alt-text="Enter the ExpressRoute ID and the authorization key, and then select Create.":::

3. Select **Create**. The new connection shows in the On-premises cloud connections list.  

>[!TIP]
>You can delete or disconnect a connection from the list by selecting **More**.  
>
> :::image type="content" source="./media/expressroute-global-reach/on-premises-connection-disconnect.png" alt-text="Disconnect or deleted an on-premises connection":::


## Next steps

In this tutorial, you learned how to enable the on-premises-to-private cloud ExpressRoute Global Reach peering. 

Continue to the next tutorial to learn how to deploy and configure VMware HCX solution for your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy and configure VMware HCX](tutorial-deploy-vmware-hcx.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->
