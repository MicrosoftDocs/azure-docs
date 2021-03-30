---
title: Add an NSX-T network segment
description: Steps to add an NSX-T network segment for Azure VMware Solution.
ms.topic: include
ms.date: 03/13/2021
---

<!-- Used in manage-dhcp.md and tutorial-nsx-t-network-segment.md -->

1. In NSX-T Manager, select **Networking** > **Segments**, and then select **Add Segment**. 

   :::image type="content" source="../media/nsxt/nsxt-segments-overview.png" alt-text="Screenshot showing how to add a new segment":::

1. Enter a name for the segment.

1. Select the Tier-1 Gateway (TNTxx-T1) as the **Connected Gateway** and leave the **Type** as Flexible.

1. Select the pre-configured overlay **Transport Zone** (TNTxx-OVERLAY-TZ) and then select **Set Subnets**. 

   :::image type="content" source="../media/nsxt/nsxt-create-segment-specs.png" alt-text="Set the Segment Name, Connected Gateway and Type, and Transport Zone, then select Set Subnet.":::

1. Enter the IP address of the gateway and then select **Add**. 

   >[!IMPORTANT]
   >The IP address needs to be on a non-overlapping RFC1918 address block, which ensures connection to the VMs on the new segment.

   :::image type="content" source="../media/nsxt/nsxt-create-segment-gateway.png" alt-text="Set the IP address of the gateway for the new segment and then select ADD.":::

1. Select **Apply** and then **Save**.

1. Select **No** to decline the option to continue configuring the segment. 

   :::image type="content" source="../media/nsxt/nsxt-create-segment-continue-no.png" alt-text="Decline to further configure the newly created network segment by selecting NO.":::

1. Confirm the presence of the new network segment. In this example, **ls01** is the new network segment.

   1. In NSX-T Manager, select **Networking** > **Segments**. 

      :::image type="content" source="../media/nsxt/nsxt-new-segment-overview-2.png" alt-text="Confirm that the new network segment is present in NSX-T.":::

   1. In vCenter, select **Networking > SDDC-Datacenter**.

      :::image type="content" source="../media/nsxt/vcenter-with-ls01-2.png" alt-text="Confirm that the new network segment is present in vCenter.":::