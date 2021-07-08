---
title: Add an NSX-T network segment using Azure VMware Solution
description: Steps to add an NSX-T network segment for Azure VMware Solution in the Azure portal.
ms.topic: include
ms.date: 07/16/2021
---

<!-- Used in configure-dhcp-azure-vmware-solution.md and tutorial-nsx-t-network-segment.md -->

You can create and configure an NSX-T segment from the Azure VMware Solution console in the Azure portal.  Once created and configured, it's visible in Azure VMware Solution, NSX-T Manger, and vCenter. These segments are connected to the default Tier-1 gateway, and the workloads on these segments get East-West and North-South connectivity. Once you create the segment, it displays in NSX-T Manager and vCenter.

>[!NOTE]
>If you plan to use DHCP, you'll need to [configure a DHCP server or DHCP relay](../configure-nsx-network-components-azure-portal.md) before you can create and configure an NSX-T segment.  

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Segments** > **Add**. 

2. Provide the details for the new logical segment and select **OK**.

   :::image type="content" source="../media/configure-nsx-network-components-azure-portal/add-new-nsxt-segment.png" alt-text="Screenshot showing how to add a new NSX-T segment in the Azure portal.":::

   - **Segment name** - Name of the logical switch that is visible in vCenter.

   - **Subnet gateway** - Gateway IP address for the logical switch's subnet with a subnet mask. VMs are attached to a logical switch, and all VMs connecting to this switch belong to the same subnet.  Also, all VMs attached to this logical segment must carry an IP address from the same segment.

   - **DHCP** (optional) - DHCP ranges for a logical segment. A [DHCP server or DHCP relay](../networking/configure-nsx-network-components-azure-portal.md) must be configured to consume DHCP on Segments.  

   - **Connected gateway** - *Selected by default and is read-only.*  Tier-1 gateway and type of segment information. 

      - **T1** - Name of the Tier-1 gateway in NSX-T Manager. A private cloud comes with an NSX-T Tier-0 gateway in Active/Active mode and a default NSX-T Tier-1 gateway in Active/Standby mode.  Segments created through the Azure VMware Solution console only connect to the default Tier-1 gateway, and the workloads of these segments get East-West and North-South connectivity. You can only create more Tier-1 gateways through NSX-T Manager. Tier-1 gateways created from the NSX-T Manager console are not visible in the Azure VMware Solution console. 

      - **Type** - Overlay segment supported by Azure VMware Solution.

The segment is now visible in Azure VMware Solution, NSX-T Manger, and vCenter.