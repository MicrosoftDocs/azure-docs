---
title: How to manage DHCP
description: This article explains how to manage DHCP in Azure VMware Solution (AVS)
ms.topic: conceptual
ms.date: 05/04/2020
---
# How to manage DHCP in Azure VMWare Solution (AVS) Preview

NSX-T provides the ability to configure DHCP for your private cloud. If you plan to use NSX-T to host your DHCP server, see [Create DHCP server](#create-dhcp-server). Otherwise, if you have a 3rd party external DHCP server in your network and you want to relay requests to that DHCP server, see [Create DHCP relay service](#create-dhcp-relay-service).

## Create DHCP server

Use the following steps to configure a DHCP server on NSX-T.

From NSX manager, navigate to the **Networking** tab and select **DHCP** under **IP Management**. Select the **ADD SERVER** button. Then provide the server name and server IP address. Once done, select **Save**.

:::image type="content" source="./media/manage-dhcp/dhcp-server-settings.png" alt-text="add DHCP server" border="true":::

### Connect DHCP server to the Tier-1 gateway.

Select **Tier 1 Gateways**, select the gateway and select **Edit**

:::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="select the gateway to use" border="true":::

Add a subnet by selecting **No IP Allocation Set**

:::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="add a subnet" border="true":::

On the next screen, select **DHCP Local Server** from the **Type** dropdown. For **DHCP Server**, select **Default DHCP** and select **Save**.

:::image type="content" source="./media/manage-dhcp/set-ip-address-management.png" alt-text="select options for dhcp server" border="true":::

On the **Tier -1 Gateway** window, select **Save**. On the next screen you'll see **Changes Saved**, select **Close Editing** to finish.

### Add a network segment

Once you've created your DHCP Server, you'll need to add network segments to it.

In NSX-T, select the **Networking** tab and select **Segments** under **Connectivity**. Select **ADD SEGMENT**. Name the segment and connection to the Tier-1 Gateway. Next, select **Set Subnets** to configure a new subnet. 

:::image type="content" source="./media/manage-dhcp/add-segment.png" alt-text="add a new network segment" border="true":::

On the **Set Subnets** window, select **ADD SUBNET**. Enter the Gateway IP address and the DHCP range and select **Add** and then **APPLY**

:::image type="content" source="./media/manage-dhcp/add-subnet-segment.png" alt-text="add network segment" border="true":::

When complete, select **Save** to complete adding a network segment.

:::image type="content" source="./media/manage-dhcp/segments-complete.png" alt-text="segments complete" border="true":::

## Create DHCP relay service

In the NXT-T window, select the **Networking** tab, and under **IP Management**, select **DHCP**. Select **ADD SERVER**. Choose DHCP Relay for the **Server Type** and enter the server name and IP address for the relay server. Select **Save** to save your changes.

:::image type="content" source="./media/manage-dhcp/create-dhcp-relay.png" alt-text="create dhcp relay server" border="true":::

Select **Tier-1 Gateways** under **Connectivity**. Select the vertical ellipsis on the Tier-1 gateway and choose **Edit**.

:::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway-relay.png" alt-text="edit tier 1 gateway" border="true":::

Select **No IP Allocation Set** to define the IP address allocation.

:::image type="content" source="./media/manage-dhcp/edit-ip-address-allocation.png" alt-text="edit ip address allocation" border="true":::

Into the dialog box, for **Type**, select **DHCP Relay Server**. In the **DHCP Relay** dropdown, select your DHCP relay server. When finished, select **Save**

:::image type="content" source="./media/manage-dhcp/set-ip-address-management-relay.png" alt-text="set ip address management" border="true":::

Specify a DHCP Range IP on Segment:

> [!NOTE]
> This configuration is required to realize DHCP relay functionality on the DHCP Client Segment. 

Under **Connectivity**, select **Segments**. Select the vertical ellipses and select **Edit**. Instead, if you wanted to add a new segment, you can select **Add Segment** to create a new segment.

:::image type="content" source="./media/manage-dhcp/edit-segments.png" alt-text="edit a network subnet" border="true":::

Add details about the segment. Select the value under **Subnets** or **Set Subnets** to add or modify the subnet.

:::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="network segments" border="true":::

Select the vertical ellipses and choose **Edit**. If you need to create a new subnet, select **Add Subnet** to create a Gateway and configure a DHCP range. Provide the Range of the IP pool and select **Apply**, and then select **Save**

:::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="edit subnets" border="true":::

Now a DHCP server pool is assigned to the segment.

:::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="DHCP server pool assigned to segment" border="true":::
