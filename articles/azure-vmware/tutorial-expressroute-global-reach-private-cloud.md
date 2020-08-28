---
title: Peer on-premises environments to a private cloud
description: In this Azure VMware Solution tutorial, you create ExpressRoute Global Reach peering to a private cloud in an Azure VMware Solution.
ms.topic: tutorial
ms.date: 07/16/2020
---

# Tutorial: Peer on-premises environments to a private cloud

ExpressRoute Global Reach connects your on-premises environment to your private clouds. The ExpressRoute Global Reach connection is established between a private cloud ExpressRoute circuit and an existing ExpressRoute connection to your on-premises environments.  There are instructions for configuring ExpressRoute Global Reach with Azure CLI and PowerShell, and we’ve augmented the [CLI commands](../expressroute/expressroute-howto-set-global-reach-cli.md) with specific details and examples to help you configure the ExpressRoute Global Reach peering between on-premises environments to an Azure VMware Solution private cloud.   

Before you enable connectivity between two ExpressRoute circuits using ExpressRoute Global Reach, review the documentation on how to [enable connectivity in different Azure subscriptions](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).  The ExpressRoute circuit that you use when you [configure Azure-to-private cloud networking](tutorial-configure-networking.md) requires that you create and use authorization keys when you peer to ExpressRoute gateways or with other ExpressRoute circuits using Global Reach. You'll have already used one authorization key from the ExpressRoute circuit, and you'll create a second one to peer with your on-premises ExpressRoute circuit.

> [!TIP]
> In the context of these instructions, your on-premises ExpressRoute circuit is _circuit 1_, and your private cloud ExpressRoute circuit is in a different subscription and labeled _circuit 2_. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Leverage the existing instructions for managing ExpressRoute circuits and ExpressRoute Global Reach peerings
> * Create an authorization key for _circuit 2_, the private cloud ExpressRoute circuit
> * Use the Azure CLI in a Cloud Shell in the subscription of _circuit 1_ to enable on-premises-to-private cloud ExpressRoute Global Reach peering

## Prerequisites

The prerequisites for this tutorial are:
- A private cloud with its ExpressRoute circuit peered with an ExpressRoute gateway in an Azure virtual network (VNet) – this is _circuit 2_ from the perspective of peering procedures.
- A separate, functioning ExpressRoute circuit used to connect on-premise environments to Azure – this is _circuit 1_ from the perspective of the peering procedures.
- A /29 non-overlapping [network address block](../expressroute/expressroute-routing.md#ip-addresses-used-for-peerings) for the ExpressRoute Global Reach peering.

## Create an ExpressRoute authorization key in the Azure VMware Solution private cloud

1. From the private cloud **Overview**, under Manage, select **Connectivity > ExpressRoute > Request an authorization key**.

   :::image type="content" source="media/expressroute-global-reach/start-request-auth-key.png" alt-text="Select Connectivity > ExpressRoute > Request an authorization key to start a new request.":::

2. Enter the name for the authorization key and select **Create**. 

   :::image type="content" source="media/expressroute-global-reach/create-global-reach-auth-key.png" alt-text="Click Create to create a new authorization key. ":::

   Once created, the new key appears in the list of authorization keys for the private cloud. 

   :::image type="content" source="media/expressroute-global-reach/show-global-reach-auth-key.png" alt-text="Confirm that the new authorization key appears in the list of keys for the private cloud. ":::

3. Make a note of the authorization key and the ExpressRoute ID, along with the /29 address block. You'll use them in the next step to complete the peering. 

## Peer private cloud to on-premises using authorization key

Now that you’ve created an authorization key for the private cloud ExpressRoute circuit, you can peer it with your on-premises ExpressRoute circuit.  The peering is done from the perspective of the on-premises ExpressRoute circuit using the Azure CLI in a Cloud Shell and resource ID and authorization key of your private cloud ExpressRoute circuit, which got created in the previous steps.

> [!TIP]  
> For brevity in the Azure CLI command output, these instructions may use a [`–query` argument to execute a JMESPath query to only show the required results](https://docs.microsoft.com/cli/azure/query-azure-cli?view=azure-cli-latest).


1. Sign in to the Azure portal using the same subscription as the on-premises ExpressRoute circuit and open a Cloud Shell. Leave the shell as Bash.
 
   :::image type="content" source="media/expressroute-global-reach/open-cloud-shell.png" alt-text="Sign in to the Azure portal and open a Cloud Shell.":::
 
2. On the command line, enter the Azure CLI command to create the peering, using your specific information and resource ID, authorization key, and /29 CIDR network block. 

   The following is an example of the command that you'll use and the output indicating a successful peering. The example command is based on the command used in [step 3 of “Enable connectivity between ExpressRoute circuits in different Azure subscriptions"](../expressroute/expressroute-howto-set-global-reach-cli.md#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions).

   :::image type="content" source="media/expressroute-global-reach/azure-command-with-results.png" alt-text="Create ExpressRoute Global Reach peering with the Azure CLI command in a Cloud Shell.":::
 
   You should now be able to connect from on-premises environments to your private cloud over the ExpressRoute Global Reach peering.

> [!TIP]
> You can delete the peering you just created by following the [Disable connectivity between your on-premises networks](../expressroute/expressroute-howto-set-global-reach-cli.md#disable-connectivity-between-your-on-premises-networks) instructions.


## Next steps

If you plan to use Hybrid Cloud Extension (HCX) to migrate VM workloads to your private cloud, use the [Install HCX for Azure VMware Solution](hybrid-cloud-extension-installation.md) procedure.


<!-- LINKS - external-->

<!-- LINKS - internal -->
