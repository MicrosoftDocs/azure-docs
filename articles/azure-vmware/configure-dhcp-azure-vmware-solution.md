---
title: Configure DHCP for Azure VMware Solution
description: Learn how to configure DHCP by using either NSX Manager to host a DHCP server or use a third-party external DHCP server.
ms.topic: how-to
ms.custom: engagement-fy23
ms.service: azure-vmware
ms.date: 1/22/2025
# Customer intent: As an Azure service administrator, I want to configure DHCP by using either NSX Manager to host a DHCP server or use a third-party external DHCP server.
---

# Configure DHCP for Azure VMware Solution

[!INCLUDE [dhcp-dns-in-azure-vmware-solution-description](includes/dhcp-dns-in-azure-vmware-solution-description.md)]

In this article, learn how to use NSX Manager to configure DHCP for Azure VMware Solution in one of the following ways: 


- [Use the Azure portal to create a DHCP server or relay](#use-the-azure-portal-to-create-a-dhcp-server-or-relay)

- [Use NSX to host your DHCP server](#use-nsx-to-host-your-dhcp-server)

- [Use a third-party external DHCP server](#use-a-third-party-external-dhcp-server)

>[!TIP]
>If you want to configure DHCP using a simplified view of NSX operations, see [Configure DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md).


>[!IMPORTANT]
>For clouds created on or after July 1, 2021, the simplified view of NSX operations must be used to configure DHCP on the default Tier-1 Gateway in your environment.
>
>DHCP does not work for virtual machines (VMs) on the VMware HCX L2 stretch network when the DHCP server is in the on-premises datacenter.  NSX, by default, blocks all DHCP requests from traversing the L2 stretch. For the solution, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.

## Use the Azure portal to create a DHCP server or relay

You can create a DHCP server or relay directly from Azure VMware Solution in the Azure portal. The DHCP server or relay connects to the Tier-1 gateway created when you deployed Azure VMware Solution. All the segments where you gave DHCP ranges are part of this DHCP. After you create a DHCP server or DHCP relay, you must define a subnet or range on segment level to consume it.

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DHCP** > **Add**.

2. Select either **DHCP Server** or **DHCP Relay** and then provide a name for the server or relay and three IP addresses. 

   >[!NOTE]
   >For DHCP relay, you only require one IP address for a successful configuration.

   :::image type="content" source="media/networking/add-dhcp-server-relay.png" alt-text="Screenshot showing how to add a DHCP server or DHCP relay in Azure VMware Solutions." border="true" lightbox="media/networking/add-dhcp-server-relay.png":::

4. Complete the DHCP configuration by [providing DHCP ranges on the logical segments](tutorial-nsx-t-network-segment.md#use-azure-portal-to-add-an-nsx-network-segment) and then select **OK**.

## Use NSX to host your DHCP server

If you want to use NSX to host your DHCP server, create a DHCP server and a relay service. Next add a network segment and specify the DHCP IP address range.

### Create a DHCP server

1. In NSX Manager, select **Networking** > **Networking Profiles** > **DHCP**, then select **Add DHCP Profile**.

1. Select **Add DHCP Profile**, enter a name, and select **Save**.

   > [!NOTE]
   > An IP address isn't required so if none is entered, NSX Manager sets one.

   :::image type="content" source="./media/manage-dhcp/dhcp-server-settings.png" alt-text="Screenshot showing how to add a DHCP Profile in NSX Manager." border="true" lightbox="./media/manage-dhcp/dhcp-server-settings.png":::

1. Under **Networking** > **Tier-1 Gateways**, select the gateway where the segments are connected that DHCP is required. Edit the Tier-1 Gateway by clicking on the three ellipses and choose **Edit**.

1. Select **Set DHCP Configuration**, select **DHCP Server** and then select the DHCP Server Profile created earlier. Select **Save**, then **Close Editing**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="Screenshot showing how to edit the NSX Tier-1 Gateway for using a DHCP server." border="true" lightbox="./media/manage-dhcp/edit-tier-1-gateway.png":::

1. Navigate to **Networking** > **Segments** and find the segment where DHCP is required. Select on **Edit** then **Set DHCP Config**. 
   
1. Select **Gateway DHCP Server** for DHCP Type, add a DHCP range, and select **Apply**.

   :::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="Screenshot showing how to add a subnet to the NSX Tier-1 Gateway for using a DHCP server." border="true" lightbox="./media/manage-dhcp/add-subnet.png":::

   > [!NOTE]
   > The DHCP Server's IP address and DHCP Ranges it manages needs to be different when using the Gateway DHCP Server option. 

### Add a network segment

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]

### Specify the DHCP IP address range
 
When you create a relay to a DHCP server, you need to specify the DHCP IP address range.

>[!NOTE]
>The IP address range shouldn't overlap with the IP range used in other virtual networks in your subscription and on-premises networks.

1. In NSX Manager, select **Networking** > **Segments**. 
   
1. Select the vertical ellipsis on the segment name and select **Edit**.
   
1. Select **Set Subnets** to specify the DHCP IP address for the subnet. 
   
   :::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="Screenshot showing how to set the subnets to specify the DHCP IP address  for using a DHCP server." border="true" lightbox="./media/manage-dhcp/network-segments.png":::
      
1. Modify the gateway IP address if needed, and enter the DHCP range IP. 
      
   :::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="Screenshot showing the gateway IP address and DHCP ranges for using a DHCP server." border="true" lightbox="./media/manage-dhcp/edit-subnet.png":::
      
1. Select **Apply**, and then **Save**. The segment is assigned a DHCP server pool.
      
   :::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="Screenshot showing that the DHCP server pool assigned to segment for using a DHCP server." border="true" lightbox="./media/manage-dhcp/assigned-to-segment.png":::

## Use a third-party external DHCP server

If you want to use a third-party external DHCP server, create a DHCP relay service in NSX Manager. You need to specify the DHCP IP address range.

>[!IMPORTANT]
>For clouds created on or after July 1, 2021, the simplified view of NSX operations must be used to configure DHCP on the default Tier-1 Gateway in your environment.

### Create a DHCP relay service

Use a DHCP relay for any non-NSX-based DHCP service. For example, a VM running DHCP in Azure VMware Solution, Azure IaaS, or on-premises.

1. In NSX Manager, select **Networking** > **DHCP**, and then select **Add Server**.

1. Select **DHCP Relay** for the **Server Type**, provide the server name and IP address, and select **Save**.

   :::image type="content" source="./media/manage-dhcp/create-dhcp-relay.png" alt-text="Screenshot showing how to create a DHCP relay service in NSX Manager." border="true" lightbox="./media/manage-dhcp/create-dhcp-relay.png":::

1. Select **Tier 1 Gateways**, select the vertical ellipsis on the Tier-1 gateway, and then select **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="Screenshot showing how to edit the NSX Tier-1 Gateway." border="true" lightbox="./media/manage-dhcp/edit-tier-1-gateway.png":::

1. Select **No IP Allocation Set** to define the IP address allocation.

   :::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="Screenshot showing how to add a subnet to the NSX Tier-1 Gateway." border="true" lightbox="./media/manage-dhcp/add-subnet.png":::

1. For **Type**, select **DHCP Server**. 
   
1. For the **DHCP Server**, select **DHCP Relay**, and then select **Save**.

1. Select **Save** again and then select **Close Editing**.

### Specify the DHCP IP address range

When you create a relay to a DHCP server, you need to specify the DHCP IP address range.

>[!NOTE]
>The IP address range shouldn't overlap with the IP range used in other virtual networks in your subscription and on-premises networks.

1. In NSX Manager, select **Networking** > **Segments**. 
   
1. Select the vertical ellipsis on the segment name and select **Edit**.
   
1. Select **Set Subnets** to specify the DHCP IP address for the subnet. 
   
   :::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="Screenshot showing how to set the subnets to specify the DHCP IP address." border="true" lightbox="./media/manage-dhcp/network-segments.png":::
      
1. Modify the gateway IP address if needed, and enter the DHCP range IP. 
      
   :::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="Screenshot showing the gateway IP address and DHCP ranges." border="true" lightbox="./media/manage-dhcp/edit-subnet.png":::
      
1. Select **Apply**, and then **Save**. The segment is assigned a DHCP server pool.
      
   :::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="Screenshot showing that the DHCP server pool assigned to segment." border="true" lightbox="./media/manage-dhcp/assigned-to-segment.png":::

## Next steps

If you want to send DHCP requests from your Azure VMware Solution VMs to a non-NSX DHCP server, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.
