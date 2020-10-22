---
title: How to create and manage DHCP
description: This article explains how to manage DHCP in Azure VMware Solution.
ms.topic: conceptual
ms.date: 10/22/2020
---
# How to create and manage DHCP in Azure VMware Solution

NSX-T provides the ability to configure DHCP for your private cloud. If you use NSX-T to host your DHCP server, see [Create DHCP server](#create-dhcp-server). Otherwise, if you have a third-party external DHCP server in your network, see [Create DHCP relay service](#create-dhcp-relay-service).

## Create DHCP server

Use the following steps to configure a DHCP server on NSX-T.

1. From NSX manager, navigate to the **Networking** tab and select **DHCP** under **IP Management**. 
1. Select the **ADD SERVER** button. 
1. Then provide the server name and server IP address. 
1. Select **Save**.

:::image type="content" source="./media/manage-dhcp/dhcp-server-settings.png" alt-text="add DHCP server" border="true":::

### Connect DHCP server to the Tier-1 gateway.

1. Select **Tier 1 Gateways**, the gateway, and then select **Edit**

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="select the gateway to use" border="true":::

1. Add a subnet by selecting **No IP Allocation Set**

   :::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="add a subnet" border="true":::

1. On the next screen, select **DHCP Local Server** from the **Type** dropdown. For **DHCP Server**, select **Default DHCP** and select **Save**.

   :::image type="content" source="./media/manage-dhcp/set-ip-address-management.png" alt-text="select options for dhcp server" border="true":::

1. On the **Tier -1 Gateway** window, select **Save**. On the next screen you'll see **Changes Saved**, select **Close Editing** to finish.

### Add a network segment

Once you've created your DHCP Server, you'll need to add network segments to it.

1. In NSX-T, select the **Networking** tab and select **Segments** under **Connectivity**. Select **ADD SEGMENT**. Name the segment and connection to the Tier-1 Gateway. Next, select **Set Subnets** to configure a new subnet. 

   :::image type="content" source="./media/manage-dhcp/add-segment.png" alt-text="add a new network segment" border="true":::

1. On the **Set Subnets** window, select **ADD SUBNET**. Enter the Gateway IP address and the DHCP range and select **Add** and then **APPLY**

   :::image type="content" source="./media/manage-dhcp/add-subnet-segment.png" alt-text="add network segment" border="true":::

1. When complete, select **Save** to complete adding a network segment.

   :::image type="content" source="./media/manage-dhcp/segments-complete.png" alt-text="segments complete" border="true":::

## Create DHCP relay service

1. In the NXT-T window, select the **Networking** tab, and under **IP Management**, select **DHCP**. 
1. Select **ADD SERVER**. 
1. Select DHCP Relay for the **Server Type** and enter the server name and IP address for the relay server. 
1. Select **Save**.

   :::image type="content" source="./media/manage-dhcp/create-dhcp-relay.png" alt-text="create dhcp relay server" border="true":::

1. Select **Tier-1 Gateways** under **Connectivity**. Select the vertical ellipsis on the Tier-1 gateway and choose **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway-relay.png" alt-text="edit tier 1 gateway" border="true":::

1. Select **No IP Allocation Set** to define the IP address allocation.

   :::image type="content" source="./media/manage-dhcp/edit-ip-address-allocation.png" alt-text="edit ip address allocation" border="true":::

1. For **Type**, select **DHCP Relay Server**. 
1. In the **DHCP Relay** dropdown, select your DHCP relay server. 
1. Select **Save**

   :::image type="content" source="./media/manage-dhcp/set-ip-address-management-relay.png" alt-text="set ip address management" border="true":::

## Specify a DHCP Range IP on Segment

> [!NOTE]
> This configuration is required to realize DHCP relay functionality on the DHCP Client Segment. 

1. Under **Connectivity**, select **Segments**. 
1. Select the vertical ellipses and select **Edit**. If you wanted to add a new segment, you can select **Add Segment** to create a new segment.

   :::image type="content" source="./media/manage-dhcp/edit-segments.png" alt-text="edit a network subnet" border="true":::

1. Add details about the segment. 
1. Select the value under **Subnets** or **Set Subnets** to add or modify the subnet.

   :::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="network segments" border="true":::

1. Select the vertical ellipses and choose **Edit**. If you need to create a new subnet, select **Add Subnet** to create a Gateway and configure a DHCP range. 
1. Provide the Range of the IP pool and select **Apply**, and then select **Save**

   :::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="edit subnets" border="true":::

   A DHCP server pool is assigned to the segment.

   :::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="DHCP server pool assigned to segment" border="true":::
