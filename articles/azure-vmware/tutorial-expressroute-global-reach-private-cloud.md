---
title: Peer on-premises environments to Azure VMware Solution
description: Learn how to create ExpressRoute Global Reach peering to a private cloud in Azure VMware Solution.
ms.topic: tutorial
ms.custom: contperf-fy21q4, contperf-fy22q1
ms.date: 07/28/2021
---

# Peer on-premises environments to Azure VMware Solution

After you deploy your Azure VMware Solution private cloud, you'll connect it to your on-premises environment. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud. The ExpressRoute Global Reach connection is established between the private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments. 

:::image type="content" source="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" alt-text="Diagram showing ExpressRoute Global Reach on-premises network connectivity." lightbox="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" border="false":::

>[!NOTE]
>You can connect through VPN, but that's out of scope for this quick start guide.

In this article, you'll:

> [!div class="checklist"]
> * Create an ExpressRoute auth key in the on-premises ExpressRoute circuit
> * Peer the private cloud with your on-premises ExpressRoute circuit
> * Verify on-premises network connectivity

After you're finished, follow the recommended next steps at the end to continue with the steps of this getting started guide.

## Prerequisites

- Review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  

- A separate, functioning ExpressRoute circuit for connecting on-premises environments to Azure, which is _circuit 1_ for peering.

- Ensure that all gateways, including the ExpressRoute provider's service, supports 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

>[!NOTE]
>If advertising a default route to Azure (0.0.0.0/0), ensure a more specific route containing your on-premises networks is advertised in addition to the default route to enable management access to Azure VMware Solution. A single 0.0.0.0/0 route will be discarded by Azure VMware Solution's management network to ensure successful operation of the service.

## Create an ExpressRoute auth key in the on-premises ExpressRoute circuit

The circuit owner creates an authorization, which creates an authorization key to be used by a circuit user to connect their virtual network gateways to the ExpressRoute circuit. An authorization is valid for only one connection.

> [!NOTE]
> Each connection requires a separate authorization.

1. From the **ExpressRoute circuits** blade, under Settings, select **Authorizations**.

1. Enter the name for the authorization key and select **Save**.

   :::image type="content" source="media/expressroute-global-reach/start-request-auth-key-on-premises-expressroute.png" alt-text="Select Authorizations and enter the name for the authorization key.":::

   Once created, the new key appears in the list of authorization keys for the circuit.

1. Copy the authorization key and the ExpressRoute ID. You'll use them in the next step to complete the peering.

## Peer private cloud to on-premises 
Now that you've created an authorization key for the private cloud ExpressRoute circuit, you can peer it with your on-premises ExpressRoute circuit. The peering is done from the on-premises ExpressRoute circuit in the **Azure portal**. You'll use the resource ID (ExpressRoute circuit ID) and authorization key of your private cloud ExpressRoute circuit to finish the peering.

1. From the private cloud, under Manage, select **Connectivity** > **ExpressRoute Global Reach** > **Add**.

    :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="Screenshot showing the ExpressRoute Global Reach tab in the Azure VMware Solution private cloud.":::

1. Enter the ExpressRoute ID and the authorization key created in the previous section.

   :::image type="content" source="./media/expressroute-global-reach/on-premises-cloud-connections.png" alt-text="Screenshot showing the dialog for entering the connection information.":::   

1. Select **Create**. The new connection shows in the on-premises cloud connections list.

>[!TIP]
>You can delete or disconnect a connection from the list by selecting **More**.  
>
>:::image type="content" source="./media/expressroute-global-reach/on-premises-connection-disconnect.png" alt-text="Screenshot showing how to disconnect or delete an on-premises connection in Azure VMware Solution.":::


## Verify on-premises network connectivity

In your **on-premises edge router**, you should now see where the ExpressRoute connects the NSX-T network segments and the Azure VMware Solution management segments.

>[!IMPORTANT]
>Everyone has a different environment, and some will need to allow these routes to propagate back into the on-premises network.  

## Next steps
Continue to the next tutorial to install VMware HCX add-on in your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Install VMware HCX](install-vmware-hcx.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->
