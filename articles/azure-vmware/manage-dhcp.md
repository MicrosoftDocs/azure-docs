---
title: Manage DHCP for Azure VMware Solution
description: Learn how to create and manage DHCP for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.custom: contperf-fy21q2
ms.date: 11/09/2020
---
# Manage DHCP for Azure VMware Solution

Applications and workloads running in a private cloud environment require DHCP services for IP address assignments.  This article shows you how to create and manage DHCP in Azure VMware Solution in two ways:

- If you're using NSX-T to host your DHCP server, you'll need to [create a DHCP server](#create-a-dhcp-server) and [relay to that server](#create-dhcp-relay-service). When you create the DHCP server, you'll also add a network segment and specify the DHCP IP address range.   

- If you're using a third-party external DHCP server in your network, you'll need to [create DHCP relay service](#create-dhcp-relay-service). When you create a relay to a DHCP server, whether using NSX-T or a third-party to host your DHCP server, you'll need to specify the DHCP IP address range.

>[!IMPORTANT]
>DHCP does not work for virtual machines (VMs) on the VMware HCX L2 stretch network when the DHCP server is in the on-premises datacenter.  NSX, by default, blocks all DHCP requests from traversing the L2 stretch. For the solution, see the [Send DHCP requests to the on-premises DHCP server](#send-dhcp-requests-to-the-on-premises-dhcp-server) procedure.


## Create a DHCP server

If you want to use NSX-T to host your DHCP server, you'll create a DHCP server. Then you'll add a network segment and specify the DHCP IP address range.

1. In NSX-T Manager, select **Networking** > **DHCP**, and then select **Add Server**.

1. Select **DHCP** for the **Server Type**, provide the server name and IP address, and then select **Save**.

   :::image type="content" source="./media/manage-dhcp/dhcp-server-settings.png" alt-text="add DHCP server" border="true":::

1. Select **Tier 1 Gateways**, select the vertical ellipsis on the Tier-1 gateway, and then select **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="select the gateway to use" border="true":::

1. Select **No IP Allocation Set** to add a subnet.

   :::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="add a subnet" border="true":::

1. For **Type**, select **DHCP Local Server**. 
   
1. For the **DHCP Server**, select **Default DHCP**, and then select **Save**.

1. Select **Save** again and then select **Close Editing**.

### Add a network segment

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]


## Create DHCP relay service

If you want to use a third-party external DHCP server, you'll need to create a DHCP relay service. You'll also specify the DHCP IP address range in NSX-T Manager. 

1. In NSX-T Manager, select **Networking** > **DHCP**, and then select **Add Server**.

1. Select **DHCP Relay** for the **Server Type**, provide the server name and IP address, and then select **Save**.

   :::image type="content" source="./media/manage-dhcp/create-dhcp-relay.png" alt-text="create dhcp relay service" border="true":::

1. Select **Tier 1 Gateways**, select the vertical ellipsis on the Tier-1 gateway, and then select **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway-relay.png" alt-text="edit tier 1 gateway" border="true":::

1. Select **No IP Allocation Set** to define the IP address allocation.

   :::image type="content" source="./media/manage-dhcp/edit-ip-address-allocation.png" alt-text="edit ip address allocation" border="true":::

1. For **Type**, select **DHCP Server**. 
   
1. For the **DHCP Server**, select **DHCP Relay**, and then select **Save**.

1. Select **Save** again and then select **Close Editing**.


## Specify the DHCP IP address range

1. In NSX-T Manager, select **Networking** > **Segments**. 
   
1. Select the vertical ellipsis on the segment name and select **Edit**.
   
1. Select **Set Subnets** to specify the DHCP IP address for the subnet. 
   
   :::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="network segments" border="true":::
      
1. Modify the gateway IP address if needed, and enter the DHCP range IP. 
      
   :::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="edit subnets" border="true":::
      
1. Select **Apply**, and then **Save**. The segment is assigned a DHCP server pool.
      
   :::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="DHCP server pool assigned to segment" border="true":::


## Send DHCP requests to the on-premises DHCP server

If you want to send DHCP requests from your Azure VMware Solution VMs on the L2 extended segment to the on-premises DHCP server, you'll create a security segment profile. 

1. Sign in to your on-premises vCenter, and under **Home**, select **HCX**.

1. Select **Network Extension** under **Services**.

1. Select the network extension you want to support DHCP requests from Azure VMware Solution to on-premises. 

1. Take note of the destination network name.  

   :::image type="content" source="media/manage-dhcp/hcx-find-destination-network.png" alt-text="Screenshot of a network extension in VMware vSphere Client" lightbox="media/manage-dhcp/hcx-find-destination-network.png":::

1. In the Azure VMware Solution NSX-T Manager, select **Networking** > **Segments** > **Segment Profiles**. 

1. Select **Add Segment Profile** and then **Segment Security**.

   :::image type="content" source="media/manage-dhcp/add-segment-profile.png" alt-text="Screenshot of how to add a segment profile in NSX-T" lightbox="media/manage-dhcp/add-segment-profile.png":::

1. Provide a name and a tag, and then set the **BPDU Filter** toggle to ON and all the DHCP toggles to OFF.

   :::image type="content" source="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png" alt-text="Screenshot showing the BPDU Filter toggled on and the DHCP toggles off" lightbox="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png":::

1. Remove all the MAC addresses, if any, under the **BPDU Filter Allow List**.  Then select **Save**.

   :::image type="content" source="media/manage-dhcp/add-segment-profile-bpdu-filter-allow-list.png" alt-text="Screenshot showing MAC addresses in the BPDU Filter Allow List":::

1. Under **Networking** > **Segments** > **Segments**, in the search area, enter the definition network name.

   :::image type="content" source="media/manage-dhcp/networking-segments-search.png" alt-text="Screenshot of the Networking > Segments filter field":::

1. Select the vertical ellipsis on the segment name and select **Edit**.

   :::image type="content" source="media/manage-dhcp/edit-network-segment.png" alt-text="Screenshot of the edit button for the segment" lightbox="media/manage-dhcp/edit-network-segment.png":::

1. Change the **Segment Security** to the segment profile you created earlier.

   :::image type="content" source="media/manage-dhcp/edit-segment-security.png" alt-text="Screenshot of the Segment Security field" lightbox="media/manage-dhcp/edit-segment-security.png":::

## Next steps

Learn more about [Host maintenance and lifecycle management](concepts-private-clouds-clusters.md#host-maintenance-and-lifecycle-management).