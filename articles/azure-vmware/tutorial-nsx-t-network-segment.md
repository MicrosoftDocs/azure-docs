---
title: Tutorial - Create an NSX-T network segment in Azure VMware Solution
description: Learn how to create the NSX-T network segments that are used for VMs in vCenter
ms.topic: tutorial
ms.date: 09/21/2020
---

# Tutorial: Create an NSX-T network segment in Azure VMware Solution

The virtual machines (VMs) created in vCenter are placed onto the network segments created in NSX-T and are visible in vCenter.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Navigate in NSX-T Manager to add network segments
> * Add a new network segment
> * Observe the new network segment in vCenter

## Prerequisites

You must have an Azure VMware Solution private cloud with access to the vCenter and NSX-T Manager management interfaces. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial.

## Provision a network segment in NSX-T

1. In vCenter for your private cloud, select **SDDC-Datacenter > Networks** and note that there are no networks yet.

   :::image type="content" source="media/nsxt/vcenter-without-ls01.png" alt-text="In vCenter for your private cloud, select SDDC-Datacenter > Networks and note that there are no networks yet.":::

1. In NSX-T Manager for your private cloud, select **Networking**.

   :::image type="content" source="media/nsxt/nsxt-network-overview.png" alt-text="In NSX-T Manager for your private cloud, select Networking.":::

1. Select **Segments**.

   :::image type="content" source="media/nsxt/nsxt-select-segments.png" alt-text="Select Segments in the Network Overview page.":::

1. In the NSX-T Segments overview page, select **ADD SEGMENT**. Three segments get created as part of the private cloud provisioning and can't be used for VMs.  You'll need to add a new network segment for this purpose.

   :::image type="content" source="media/nsxt/nsxt-segments-overview.png" alt-text="In the NSX-T Segments overview page, select ADD SEGMENT.":::

1. Name the segment, choose the pre-configured Tier1 Gateway (TNTxx-T1) as the **Connected Gateway**, leave the **Type** as Flexible, choose the pre-configured overlay **Transport Zone** (TNTxx-OVERLAY-TZ), and then select Set Subnets. All other settings in this section and the **PORTS** and **SEGMENT PROFILES** can remain in the default, as is configuration.

   :::image type="content" source="media/nsxt/nsxt-create-segment-specs.png" alt-text="Set the Segment Name, Connected Gateway and Type, and Transport Zone, then select Set Subnet.":::

1. Set the IP address of the gateway for the new segment and then select **ADD**. The IP address that you use needs to be on a non-overlapping RFC1918 address block, which ensures that you can connect to the VMs on the new segment.

   :::image type="content" source="media/nsxt/nsxt-create-segment-gateway.png" alt-text="Set the IP address of the gateway for the new segment and then select ADD.":::

1. Apply the new network segment by selecting **APPLY** and then save the configuration with **SAVE**.

   :::image type="content" source="media/nsxt/nsxt-create-segment-apply.png" alt-text="Apply the new network segment to the NSX-T configuration with APPLY.":::

   :::image type="content" source="media/nsxt/nsxt-create-segment-save.png" alt-text="Save the new network segment to the NSX-T configuration with SAVE.":::

1. The new network segment has now been created and you'll decline the option to continue configuring the segment by selecting **NO**.

   :::image type="content" source="media/nsxt/nsxt-create-segment-continue-no.png" alt-text="Decline to further configure the newly created network segment by selecting NO.":::

1. Confirm the new network segment is present in NSX-T by selecting **Networking > Segments** and seeing the new segment is in the list (in this case, "ls01").

   :::image type="content" source="media/nsxt/nsxt-new-segment-overview-2.png" alt-text="Confirm that the new network segment is present in NSX-T.":::

1. Confirm the new network segment is present in vCenter by selecting **Networking > SDDC-Datacenter** and observing the new segment is in the list (in this case, "ls01").

   :::image type="content" source="media/nsxt/vcenter-with-ls01-2.png" alt-text="Confirm that the new network segment is present in vCenter.":::

## Next steps

In this tutorial, you created the NSX-T network segments that are used for VMs in vCenter. You can now [create a content Library to deploy VMs in Azure VMware Solution](deploy-vm-content-library.md). You can also provision a VM on the network you created in this tutorial.

If not, then continue to the next tutorial to learn how to create ExpressRoute Global Reach peering to a private cloud in an Azure VMware Solution.

> [!div class="nextstepaction"]
> [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md)

<!-- LINKS - external-->

<!-- LINKS - internal -->
