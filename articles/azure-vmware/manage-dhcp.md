---
title: How to manage DHCP in Azure VMWare Solution (AVS)
description: This article explains how to manage DHCP in Azure VMWare Solution (AVS)
author: dikamath
ms.author: dikamath
ms.service: azure-vmware
ms.topic: conceptual
ms.date: 04/07/2020
---
# How to manage DHCP in AVS

NXS-T provides the ability to configure DHCP for your private cloud. If you plan to use NXS-T to host your DHCP server, see [Create DHCP server](#create-dhcp-server). If you want to If you have a 3rd party external DHCP server in your network and you want to relay requests to that DHCP server, see [Configure DHCP relay service](#configure-dhcp-relay).

## Create DHCP server

Use the following steps to configure a DHCP server on NSX-T.

1. From NSX manager navigate to the **Networking** tab and select **DHCP** under **IP Management**.

   ![select DHCP under Networking](./media/manage-dhcp/select-dhcp.jpg)

1. Click on the **ADD SERVER** button. Then provide the server name and server IP address. Once done, click **Save**.

   ![](./media/manage-dhcp/dhcp-server-settings.jpg)

1. Connect DHCP server to the tier1 gateway.

1. Click on **Tier 1 Gateways**, select the gateway and click **Edit**

   ![](./media/manage-dhcp/edit-tier-1-gateway.jpg)

1. Add a subnet by clicking on **No IP Allocation Set**

   ![](./media/manage-dhcp/add-subnet.jpg)

1. On the next screen, select **DHCP Local Server** from the **Type** dropdown. For **DHCP Server**, select **Default DHCP** and click **Save**.

    ![](./media/manage-dhcp/set-ip-address-management.jpg)

1. Then click save on the Tier-1 Gateway

    ![](./media/manage-dhcp/image49.jpg)

1. You should see "Changes Saved" then close editing.

    ![](./media/manage-dhcp/image50.jpg)

## Configure DHCP relay service

## Create Network Segments

Once you have created your DHCP In this exercise will add network segments to our DHCP server.

Steps

1. Click on the Segments tab.

   ![](./media/manage-dhcp/image51.jpg)

2. Click on ADD Segment

   ![](./media/manage-dhcp/image52.jpg)

3. Name the Segment and connection to the Tier-1 Gateway

   ![](./media/manage-dhcp/image53.jpg)

4. Then click Set Subnets

   ![](./media/manage-dhcp/image54.jpg)

5. Click on ADD SUBNET

   ![](./media/manage-dhcp/image55.jpg)

6. Enter the Gateway IP address and the DHCP range

   ![](./media/manage-dhcp/image56.jpg)

7. Then click APPLY

   ![](./media/manage-dhcp/image57.jpg)

8. Then click SAVE

   ![](./media/manage-dhcp/image58.jpg)