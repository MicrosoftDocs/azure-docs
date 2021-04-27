---
title: Connect Azure VMware Solution to your on-premises environment
description: Learn how to connect Azure VMware Solution to your on-premises environment.
ms.topic: tutorial
ms.date: 04/19/2021
---

# Connect Azure VMware Solution to your on-premises environment

In this article, you'll continue using the [information gathered during planning](production-ready-deployment-steps.md) to connect Azure VMware Solution to your on-premises environment.

Before you begin, you must have an ExpressRoute circuit from your on-premises environment to Azure.


>[!NOTE]
> You can connect through VPN, but that's out of scope for this quick start document.

## Establish an ExpressRoute Global Reach connection

To establish on-premises connectivity to your Azure VMware Solution private cloud using ExpressRoute Global Reach, follow the [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md) tutorial.

This tutorial results in a connection as shown in the diagram.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" alt-text="ExpressRoute Global Reach on-premises network connectivity diagram." lightbox="media/pre-deployment/azure-vmware-solution-on-premises-diagram.png" border="false":::

## Verify on-premises network connectivity

You should now see in your **on-premises edge router** where the ExpressRoute connects the NSX-T network segments and the Azure VMware Solution management segments.

>[!IMPORTANT]
>Everyone has a different environment, and some will need to allow these routes to propagate back into the on-premises network.  

Some environments have firewalls protecting the ExpressRoute circuit.  If no firewalls and no route pruning occur, ping your Azure VMware Solution vCenter server or a [VM on the NSX-T segment](deploy-azure-vmware-solution.md#add-a-vm-on-the-nsx-t-network-segment) from your on-premises environment. Additionally, from the VM on the NSX-T segment, you can reach resources in your on-premises environment.

## Next steps

Continue to the next section to deploy and configure VMware HCX

> [!div class="nextstepaction"]
> [Deploy and configure VMware HCX](tutorial-deploy-vmware-hcx.md)