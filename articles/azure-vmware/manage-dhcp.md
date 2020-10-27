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

1. In NSX manager, navigate to the **Networking** tab and select **DHCP**. 
1. Select **ADD SERVER** and then provide the server name and IP address. 
1. Select **Save**.

:::image type="content" source="./media/manage-dhcp/dhcp-server-settings.png" alt-text="add DHCP server" border="true":::

### Connect DHCP server to the Tier-1 gateway.

1. Select **Tier 1 Gateways**, the gateway from the list, and then select **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway.png" alt-text="select the gateway to use" border="true":::

1. Select **No IP Allocation Set** to add a subnet.

   :::image type="content" source="./media/manage-dhcp/add-subnet.png" alt-text="add a subnet" border="true":::

1. Select **DHCP Local Server** for the **Type**. 
1. Select **Default DHCP** for the **DHCP Server** and then select **Save**.


1. On the **Tier -1 Gateway** window, select **Save**. 
1. Select **Close Editing** to finish.

### Add a network segment

Once you've created your DHCP Server, you'll need to add network segments to it.

1. In NSX-T, select the **Networking** tab and select **Segments** under **Connectivity**. 
1. Select **ADD SEGMENT** and name the segment and connection to the Tier-1 Gateway. 
1. Select **Set Subnets** to configure a new subnet. 

   :::image type="content" source="./media/manage-dhcp/add-segment.png" alt-text="add a new network segment" border="true":::

1. On the **Set Subnets** window, select **ADD SUBNET**. 
1. Enter the Gateway IP address and the DHCP range and select **Add** and then **APPLY**

1. Select **Save** to add the new network segment.

## Create DHCP relay service

1. Select the **Networking** tab, and under **IP Management**, select **DHCP**. 
1. Select **ADD SERVER**. 
1. Select DHCP Relay for the **Server Type** and enter the server name and IP address for the relay server. 
1. Select **Save**.

   :::image type="content" source="./media/manage-dhcp/create-dhcp-relay.png" alt-text="create dhcp relay server" border="true":::

1. Select **Tier-1 Gateways** under **Connectivity**. 
1. Select the vertical ellipsis on the Tier-1 gateway and select **Edit**.

   :::image type="content" source="./media/manage-dhcp/edit-tier-1-gateway-relay.png" alt-text="edit tier 1 gateway" border="true":::

1. Select **No IP Allocation Set** to define the IP address allocation.

   :::image type="content" source="./media/manage-dhcp/edit-ip-address-allocation.png" alt-text="edit ip address allocation" border="true":::

1. Select **DHCP Relay Server** for **Type**.
1. Select your DHCP relay server for **DHCP Relay**. 
1. Select **Save**.


## Specify a DHCP range IP on a segment

> [!NOTE]
> This configuration is required to realize DHCP relay functionality on the DHCP Client Segment. 

1. Under **Connectivity**, select **Segments**. 
1. Select the vertical ellipses and select **Edit**. 

   >[!TIP]
   >If you want to add a new segment, select **Add Segment**.

1. Add details about the segment. 
1. Select the value under **Set Subnets** to add or modify the subnet.

   :::image type="content" source="./media/manage-dhcp/network-segments.png" alt-text="network segments" border="true":::

1. Select the vertical ellipses and choose **Edit**. If you need to create a new subnet, select **Add Subnet** to create a gateway and configure a DHCP range. 
1. Provide the range of the IP pool and select **Apply**, and then select **Save**

   :::image type="content" source="./media/manage-dhcp/edit-subnet.png" alt-text="edit subnets" border="true":::

   A DHCP server pool is assigned to the segment.

   :::image type="content" source="./media/manage-dhcp/assigned-to-segment.png" alt-text="DHCP server pool assigned to segment" border="true":::
