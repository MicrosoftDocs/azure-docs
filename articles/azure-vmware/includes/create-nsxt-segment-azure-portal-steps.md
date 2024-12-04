---
title: Add an NSX network segment using Azure VMware Solution
description: Steps to add an NSX network segment for Azure VMware Solution in the Azure portal.
ms.topic: include
ms.service: azure-vmware
ms.date: 6/12/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in configure-dhcp-azure-vmware-solution.md and tutorial-nsx-t-network-segment.md -->


>[!NOTE]
>If you plan to use DHCP, you'll need to [configure a DHCP server or DHCP relay](../configure-dhcp-azure-vmware-solution.md) before you can configure an NSX network segment. 

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Segments** > **Add**. 

2. Provide the details for the new logical segment and select **OK**.

   :::image type="content" source="../media/networking/add-new-nsxt-segment.png" alt-text="Screenshot showing how to add a new NSX segment in the Azure portal.":::

   - **Segment name** - Name of the segment that is visible in vCenter Server.

   - **Subnet gateway** - Gateway IP address for the segment's subnet with a subnet mask. VMs are attached to a logical segment, and all VMs connecting to this segment belong to the same subnet.  Also, all VMs attached to this logical segment must carry an IP address from the same segment.

   - **DHCP** (optional) - DHCP ranges for a logical segment. You must configure a [DHCP server or DHCP relay](../configure-dhcp-azure-vmware-solution.md) to consume DHCP on Segments.    

   >[!NOTE]
   >The **Connected gateway** is selected by default and is read-only.  It shows Tier-1 Gateway and type of segment information. 
   >
   >- **T1** - Name of the Tier-1 Gateway in NSX Manager. A private cloud comes with an NSX Tier-0 Gateway in Active/Active mode and a default NSX Tier-1 Gateway in Active/Standby mode.  Segments created through the Azure VMware Solution console only connect to the default Tier-1 Gateway, and the workloads of these segments get East-West and North-South connectivity. You can only create more Tier-1 Gateways through NSX Manager. Tier-1 Gateways created from the NSX Manager console are not visible in the Azure VMware Solution console. 
   >
   >- **Type** - Overlay segment supported by Azure VMware Solution.

The segment is now visible in Azure VMware Solution, NSX Manager, and vCenter Server.
