---
title: Specify DHCP IP address range
description: Steps for specifying the DHCP IP address range in NSX-T Manager.
ms.topic: include
ms.date: 07/16/2021
---

<!-- Used twice in configure-dhcp-azure-vmware-solution.md (DHCP server and DHCP relay steps) -->

>[!NOTE]
>The IP address range shouldn't overlap with the IP range used in other virtual networks in your subscription and on-premises networks.

1. In NSX-T Manager, select **Networking** > **Segments**. 
   
1. Select the vertical ellipsis on the segment name and select **Edit**.
   
1. Select **Set Subnets** to specify the DHCP IP address for the subnet. 
   
   :::image type="content" source="media/manage-dhcp/network-segments.png" alt-text="Screenshot showing how to set the subnets to specify the DHCP IP address." border="true":::
      
1. Modify the gateway IP address if needed, and enter the DHCP range IP. 
      
   :::image type="content" source="media/manage-dhcp/edit-subnet.png" alt-text="Screenshot showing the gateway IP address and DHCP ranges." border="true":::
      
1. Select **Apply**, and then **Save**. The segment is assigned a DHCP server pool.
      
   :::image type="content" source="media/manage-dhcp/assigned-to-segment.png" alt-text="Screenshot showing that the DHCP server pool assigned to segment." border="true":::