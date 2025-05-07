---
title: Add an NSX network segment
description: Steps to add an NSX network segment for Azure VMware Solution in NSX Manager.
ms.topic: include
ms.service: azure-vmware
ms.date: 6/12/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in configure-dhcp-azure-vmware-solution.md and tutorial-nsx-t-network-segment.md -->

1. In NSX Manager, select **Networking** > **Segments**, and then select **Add Segment**. 

   :::image type="content" source="../media/nsxt/nsxt-segments-overview.png" alt-text="Screenshot showing how to add a new segment in NSX Manager.":::

1. Enter a name for the segment.

1. Select the Tier-1 Gateway (TNTxx-T1) as the **Connected Gateway** and leave the **Type** as Flexible.

1. Select the preconfigured overlay **Transport Zone** (TNTxx-OVERLAY-TZ) and then select **Set Subnets**. 

   :::image type="content" source="../media/nsxt/nsxt-create-segment-specs.png" alt-text="Screenshot showing the Segments details for adding a new NSX network segment.":::

1. Enter the gateway IP address and then select **Add**. 

   >[!IMPORTANT]
   >The IP address needs to be on a non-overlapping RFC1918 address block, which ensures connection to the VMs on the new segment.

   :::image type="content" source="../media/nsxt/nsxt-create-segment-gateway.png" alt-text="Screenshot showing the IP address of the gateway for the new segment.":::

1. Select **Apply** and then **Save**.

1. Select **No** to decline the option to continue configuring the segment. 
