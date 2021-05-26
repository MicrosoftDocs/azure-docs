---
title: Configure and manage DHCP in Azure VMware Solution
description: Learn how to create and manage DHCP for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.custom: contperf-fy21q2
ms.date: 05/17/2021
---

# Configure and manage DHCP in Azure VMware Solution

Applications and workloads running in a private cloud environment require DHCP services for IP address assignments.  This article shows you how to create and manage DHCP in Azure VMware Solution in two ways:

- If you're using NSX-T to host your DHCP server, you'll need to [create a DHCP server](#create-a-dhcp-server) and [relay to that server](#create-dhcp-relay-service). When you create the DHCP server, you'll also add a network segment and specify the DHCP IP address range.   

- If you're using a third-party external DHCP server in your network, you'll need to [create DHCP relay service](#create-dhcp-relay-service). When you create a relay to a DHCP server, whether using NSX-T or a third-party to host your DHCP server, you'll need to specify the DHCP IP address range.

>[!IMPORTANT]
>DHCP does not work for virtual machines (VMs) on the VMware HCX L2 stretch network when the DHCP server is in the on-premises datacenter.  NSX, by default, blocks all DHCP requests from traversing the L2 stretch. For the solution, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.


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



## Next steps

If you want to send DHCP requests from your Azure VMware Solution VMs to a non-NSX-T DHCP server, you'll create a new security segment profile. For the solution, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.

