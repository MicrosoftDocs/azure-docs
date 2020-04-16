---
title: How to manage DHCP in AVS
description: This artical defines how to manage DHCP in AVS
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

   ![](./media/manage-dhcp/image40.png)

2. Under IP Management click on the DHCP button

   ![](./media/manage-dhcp/image41.png)

3. Click on the ADD SERVER button.

   ![](./media/manage-dhcp/image42.png)

4. Provide the server name.

5. Provide the server IP address and click save

   ![](./media/manage-dhcp/image43.png)

6. Connect DHCP ser to the tier1 gateway.

7. Click on Tier 1 Gateways and select the gateway.

   ![](./media/manage-dhcp/image44.png)

8. Click on edit

   ![](./media/manage-dhcp/image45.png)

9. Add a subnet by clicking on No IP Allocation Set

   ![](./media/manage-dhcp/image46.png)

10. Set IP management to DHCP Local Server

    ![](./media/manage-dhcp/image47.png)

11. Select Default Server and click save.

    ![](./media/manage-dhcp/image48.png)

12. Then click save on the Tier-1 Gateway

    ![](./media/manage-dhcp/image49.png)

13. You should see "Changes Saved" then close editing.

    ![](./media/manage-dhcp/image50.png)

# Create Network Segments

In this exercise will add network segments to our DHCP server.

Steps

1. Click on the Segments tab.

   ![](./media/manage-dhcp/image51.png)

2. Click on ADD Segment

   ![](./media/manage-dhcp/image52.png)

3. Name the Segment and connection to the Tier-1 Gateway

   ![](./media/manage-dhcp/image53.png)

4. Then click Set Subnets

   ![](./media/manage-dhcp/image54.png)

5. Click on ADD SUBNET

   ![](./media/manage-dhcp/image55.png)

6. Enter the Gateway IP address and the DHCP range

   ![](./media/manage-dhcp/image56.png)

7. Then click APPLY

   ![](./media/manage-dhcp/image57.png)

8. Then click SAVE

   ![](./media/manage-dhcp/image58.png)