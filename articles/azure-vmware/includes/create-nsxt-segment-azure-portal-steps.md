---
title: Add an NSX-T network segment using Azure VMware Solution
description: Steps to add an NSX-T network segment for Azure VMware Solution in the Azure portal.
ms.topic: include
ms.date: 07/16/2021
---

<!-- Used in configure-dhcp-azure-vmware-solution.md and tutorial-nsx-t-network-segment.md -->


>[!NOTE]
>If you plan to use DHCP, you'll need to [configure a DHCP server or DHCP relay](../configure-dhcp-azure-vmware-solution.md) before you can configure an NSX-T network segment. 

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Segments** > **Add**. 

2. Provide the details for the new logical segment and select **OK**.

   :::image type="content" source="../media/networking/add-new-nsxt-segment.png" alt-text="Screenshot showing how to add a new NSX-T segment in the Azure portal.":::

   - **Segment name** - Name of the segment that is visible in vCenter.

   - **Subnet gateway** - Gateway IP address for the segment's subnet with a subnet mask. VMs are attached to a logical segment, and all VMs connecting to this segment belong to the same subnet.  Also, all VMs attached to this logical segment must carry an IP address from the same segment.

   - **DHCP** (optional) - DHCP ranges for a logical segment. A [DHCP server or DHCP relay](../configure-dhcp-azure-vmware-solution.md) must be configured to consume DHCP on Segments.  

   >[!NOTE]
   >The **Connected gateway** is selected by default and is read-only.  It shows Tier-1 gateway and type of segment information. 
   >
   >- **T1** - Name of the Tier-1 gateway in NSX-T Manager. A private cloud comes with an NSX-T Tier-0 gateway in Active/Active mode and a default NSX-T Tier-1 gateway in Active/Standby mode.  Segments created through the Azure VMware Solution console only connect to the default Tier-1 gateway, and the workloads of these segments get East-West and North-South connectivity. You can only create more Tier-1 gateways through NSX-T Manager. Tier-1 gateways created from the NSX-T Manager console are not visible in the Azure VMware Solution console. 
   >
   >- **Type** - Overlay segment supported by Azure VMware Solution.

The segment is now visible in Azure VMware Solution, NSX-T Manger, and vCenter.