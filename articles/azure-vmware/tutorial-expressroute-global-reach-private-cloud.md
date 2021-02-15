---
title: Tutorial - Peer on-premises environments to a private cloud
description: Learn how to create ExpressRoute Global Reach peering to a private cloud in an Azure VMware Solution.
ms.topic: tutorial
ms.date: 01/27/2021
---

# Tutorial: Peer on-premises environments to a private cloud

ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud. The ExpressRoute Global Reach connection is established between the private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use the Azure portal to enable on-premises-to-private cloud ExpressRoute Global Reach peering.


## Before you begin

Before you enable connectivity between two ExpressRoute circuits using ExpressRoute Global Reach, review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  


## Prerequisites

- A separate, functioning ExpressRoute circuit used to connect on-premises environments to Azure.
- Ensure that all gateways, including the ExpressRoute provider's service, support 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.


## Create an ExpressRoute authorization key in the on-premises ExpressRoute circuit.

1. From the **ExpressRoute circuits** blade, under Settings, select **Authorizations**.

2. Enter the name for the authorization key and select **Save**.

   :::image type="content" source="media/expressroute-global-reach/start-request-auth-key-onprem-er.png" alt-text="Select Authorizations and  enter the name for the authorization key ":::
  
 3. Once created, the new key appears in the list of authorization keys for the circuit.
 
 4. Make a note of the authorization key and the ExpressRoute ID. You'll use them in the next step to complete the peering.
 
 
 ## Peer private cloud to on-premises

1. From the private cloud **Overview**, under Manage, select **Connectivity > ExpressRoute Global Reach > Add**.

   :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="From the menu, select Connectivity, the ExpressRoute Global Reach tab, and then Add.":::

2. Enter the ExpressRoute ID and the authorization key created in the previous section.

:::image type="content" source="./media/expressroute-global-reach/on-prem-cloud-connections.png" alt-text="Enter the ExpressRoute ID and the authorization key, and then select Create.":::

3. Select **create**. The new connection shows in the On-premises cloud connections list.  

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
