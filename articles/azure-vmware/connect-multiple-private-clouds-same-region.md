---
title: Create a network connection between multiple Azure VMware Solution private clouds
description: Learn how to create a network connection between two or more Azure VMware Solution private clouds located in the same region.
ms.topic: how-to 
ms.date: 

#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---


# Create a network connection between multiple Azure VMware Solution private clouds

The **AVS Interconnect** feature lets you create a network connection between two or more Azure VMware Solution private clouds located in the same region. It enables a routing link between the management and workload networks of the two private clouds.  

You can connect a private cloud to multiple private clouds, and the connections are non-transitive. For example, if _private cloud 1_ is connected to _private cloud 2_, and _private cloud 2_ is connected to _private cloud 3_, private clouds 1 and 3 would not communicate until they were directly connected.


## Prerequisites

- Ensure that you have write access to each private cloud you're connecting
- Ensure that the routed IP address space in each cloud is unique and doesn't overlap


## Add connection between two private clouds


1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

   :::image type="content" source="media/public-ip-usage/avs-private-cloud-manage-menu.png" alt-text="Screenshot of the Connectivity section." border="true" lightbox="media/public-ip-usage/avs-private-cloud-manage-menu.png":::

2. Select the **AVS Interconnect** tab and then **Add**.

   :::image type="content" source="media/networking/private-cloud-to-private-cloud-no-connections.png" alt-text="Screenshot showing the AVS Interconnect tab under Connectivity." border="true" lightbox="media/networking/private-cloud-to-private-cloud-no-connections.png":::

3. Select the information and Azure VMware Solution private cloud for the new connection.

   >[!NOTE]
   >You can only connect to other private clouds in the same region.

   :::image type="content" source="media/networking/add-connection-to-other-private-cloud.png" alt-text="Screenshot showing the required information to add a connection to other private cloud." border="true":::


4. Select the **I confirm** checkbox acknowledging that there are no overlapping routed IP spaces in the two private clouds. 

5. Select **Create**.  You can check the status of the connection creation.

   :::image type="content" source="media/networking/add-connection-to-other-private-cloud-notification.png" alt-text="Screenshot showing the Notification information for connection in progress and an existing connection." border="true":::

   You can see all the connections you've established under **AVS Private Cloud**.
   
   :::image type="content" source="media/networking/private-cloud-to-private-cloud-two-connections.png" alt-text="Screenshot showing the AVS Interconnect tab under Connectivity and two established private cloud connections." border="true" lightbox="media/networking/private-cloud-to-private-cloud-two-connections.png":::


## Remove connection between private clouds

1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

2. For the connection you want to remove, on the right, select **Delete** (trash can) and then **Yes**.




