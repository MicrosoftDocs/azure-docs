---
title: Peer on-premises environments to Azure VMware Solution
description: Learn how to create ExpressRoute Global Reach peering to a private cloud in Azure VMware Solution.
ms.topic: tutorial
ms.custom: contperf-fy21q4
ms.date: 04/23/2021
---

# Peer on-premises environments to Azure VMware Solution

In this step of the quick start, you'll use the [information gathered during the planning phase](production-ready-deployment-steps.md) to connect Azure VMware Solution to your on-premises environment.

ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud. The ExpressRoute Global Reach connection is established between the private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments. 

The ExpressRoute circuit you use when you [configure networking for your VMware private cloud in Azure](tutorial-configure-networking.md) requires you to create and use authorization keys.  You'll have already used one authorization key from the ExpressRoute circuit, and in this tutorial, you'll create a second authorization key to peer with your on-premises ExpressRoute circuit.

>[!NOTE]
> You can connect through VPN, but that's out of scope for this quick start document.

This tutorial results in a connection as shown in the diagram.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" alt-text="Diagram showing ExpressRoute Global Reach on-premises network connectivity." lightbox="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" border="false":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a second authorization key for _circuit 2_, the private cloud ExpressRoute circuit.
> * Use either the Azure portal or the Azure CLI in a Cloud Shell method in the subscription of _circuit 1_ to enable  on-premises-to-private cloud ExpressRoute Global Reach peering.


## Before you begin

Before you enable connectivity between two ExpressRoute circuits using ExpressRoute Global Reach, review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  

## Prerequisites

- Established connectivity to and from an Azure VMware Solution private cloud with its ExpressRoute circuit peered with an ExpressRoute gateway in an Azure virtual network (VNet) – which is circuit 2 from peering procedures.
- A separate, functioning ExpressRoute circuit used to connect on-premises environments to Azure – which is circuit 1 from the peering procedures' perspective.
- A /29 non-overlapping [network address block](../expressroute/expressroute-routing.md#ip-addresses-used-for-peerings) for the ExpressRoute Global Reach peering.
- Ensure that all gateways, including the ExpressRoute provider's service, supports 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

>[!IMPORTANT]
>In the context of these prerequisites, your on-premises ExpressRoute circuit is _circuit 1_, and your private cloud ExpressRoute circuit is in a different subscription and labeled _circuit 2_.

## Step 1. Create an authorization key in the private cloud ExpressRoute circuit

[!INCLUDE [request-authorization-key](includes/request-authorization-key.md)]
 
## Step 2. Peer private cloud to on-premises with authorization key
Now that you've created an authorization key for the private cloud ExpressRoute circuit, you can peer it with your on-premises ExpressRoute circuit. The peering is done from the perspective of the on-premises ExpressRoute circuit in either the **Azure portal** or using the **Azure CLI**. With both methods, you use the resource ID and authorization key of your private cloud ExpressRoute circuit to finish the peering.

### [Portal](#tab/azure-portal)
 
1. Sign in to the [Azure portal](https://portal.azure.com) using the same subscription as the on-premises ExpressRoute circuit.

1. From the private cloud, under Manage, select **Connectivity** > **ExpressRoute Global Reach** > **Add**.

    :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="Screenshot showing the ExpressRoute Global Reach tab in the Azure VMware Solution private cloud.":::

1. Create an on-premises cloud connection. Do one of the following and then select **Create**:

   - Select the **ExpressRoute circuit** from the list, or
   - Paste the circuit ID and authorization key you created.

   :::image type="content" source="./media/expressroute-global-reach/on-premises-cloud-connections.png" alt-text="Screenshot that shows the dialog for entering the connection information.":::   
   
   The new connection shows in the on-premises cloud connections list.

>[!TIP]
>You can delete or disconnect a connection from the list by selecting **More**.  
>
> :::image type="content" source="./media/expressroute-global-reach/on-premises-connection-disconnect.png" alt-text="Disconnect or deleted an on-premises connection":::

### [Azure CLI](#tab/azure-cli)

We've augmented the [CLI commands](../expressroute/expressroute-howto-set-global-reach-cli.md) with specific details and examples to help you configure the ExpressRoute Global Reach peering between on-premises environments to an Azure VMware Solution private cloud.

>[!TIP]
>For brevity in the Azure CLI command output, these instructions may use a [`–query` argument](/cli/azure/query-azure-cli) to execute a JMESPath query to only show the required results.

1. Sign in to the [Azure portal](https://portal.azure.com) using the same subscription as the on-premises ExpressRoute circuit. 

1. Open a Cloud Shell and leave the shell as bash.

   :::image type="content" source="media/expressroute-global-reach/azure-portal-cloud-shell.png" alt-text="Screenshot showing the Azure portal Cloud Shell.":::

1. Create the peering against circuit 1, passing in circuit 2's resource ID and authorization key. 

   ```azurecli-interactive
   az network express-route peering connection create -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName> --peer-circuit <Circuit2ResourceID> --address-prefix <__.__.__.__/29> --authorization-key <authorizationKey>
   ```

   :::image type="content" source="media/expressroute-global-reach/azure-command-with-results.png" alt-text="Screenshot showing the command and the results of a successful peering between circuit 1 and circuit 2.":::

You can connect from on-premises environments to your private cloud over the ExpressRoute Global Reach peering.

>[!TIP]
>You can delete the peering by following the [Disable connectivity between your on-premises networks](../expressroute/expressroute-howto-set-global-reach-cli.md#disable-connectivity-between-your-on-premises-networks) instructions.


---



## Step 3. Verify on-premises network connectivity

You should now see in your **on-premises edge router** where the ExpressRoute connects the NSX-T network segments and the Azure VMware Solution management segments.

>[!IMPORTANT]
>Everyone has a different environment, and some will need to allow these routes to propagate back into the on-premises network.  

## Next steps

In this tutorial, you learned how to enable the on-premises-to-private cloud ExpressRoute Global Reach peering. 

Continue to the next tutorial to learn how to deploy and configure VMware HCX solution for your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy and configure VMware HCX](tutorial-deploy-vmware-hcx.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->
