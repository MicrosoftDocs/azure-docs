---
title: How to manage DHCP in Azure VMWare Solution (AVS)
description: This article defines how to manage DHCP in Azure VMWare Solution (AVS)
author: dikamath
ms.author: dikamath
ms.service: azure-vmware
ms.topic: conceptual
ms.date: 04/07/2020
---
# How to manage DHCP in AVS
## Create DHCP server

**Steps**

1. From NSX manager navigate to the Networking tab.

   ![](./media/manage-dhcp/image40.jpg)

2. Under IP Management click on the DHCP button

   ![](./media/manage-dhcp/image41.jpg)

3. Click on the ADD SERVER button.H

   ![](./media/manage-dhcp/image42.jpg)

4. Provide the server name.

5. Provide the server IP address and click save

   ![](./media/manage-dhcp/image43.jpg)

6. Connect DHCP ser to the tier1 gateway.

7. Click on Tier 1 Gateways and select the gateway.

   ![](./media/manage-dhcp/image44.jpg)

8. Click on edit

   ![](./media/manage-dhcp/image45.jpg)

9. Add a subnet by clicking on No IP Allocation Set

   ![](./media/manage-dhcp/image46.jpg)

10. Set IP management to DHCP Local Server

    ![](./media/manage-dhcp/image47.jpg)

11. Select Default Server and click save.

    ![](./media/manage-dhcp/image48.jpg)

12. Then click save on the Tier-1 Gateway

    ![](./media/manage-dhcp/image49.jpg)

13. You should see "Changes Saved" then close editing.

    ![](./media/manage-dhcp/image50.jpg)

## Create Network Segments

In this exercise will add network segments to our DHCP server.

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