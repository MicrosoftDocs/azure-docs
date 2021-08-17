---
title: Connect multiple Azure VMware Solution private clouds in the same region (Preview)
description: Learn how to create a network connection between two or more Azure VMware Solution private clouds located in the same region.
ms.topic: how-to 
ms.date: 07/02/2021

#Customer intent: As an Azure service administrator, I want create a network connection between two or more Azure VMware Solution private clouds located in the same region.  

---

# Connect multiple Azure VMware Solution private clouds in the same region (Preview)

The **AVS Interconnect** feature lets you create a network connection between two or more Azure VMware Solution private clouds located in the same region. It creates a routing link between the management and workload networks of the private clouds to enable network communication between the clouds.

You can connect a private cloud to multiple private clouds, and the connections are non-transitive. For example, if _private cloud 1_ is connected to _private cloud 2_, and _private cloud 2_ is connected to _private cloud 3_, private clouds 1 and 3 would not communicate until they were directly connected.

You can only connect private clouds in the same region. To connect private clouds that are in different regions, [use ExpressRoute Global Reach](tutorial-expressroute-global-reach-private-cloud.md) to connect your private clouds in the same way you connect your private cloud to your on-premises circuit. 

>[!IMPORTANT]
>The AVS Interconnect (Preview) feature is currently in public preview.  
>This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
>For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported regions

The AVS Interconnect (Preview) feature is available in all regions except for South Central US (SAT20), North Europe (DUB21), Southeast Asia (SG2), and UK West (CWL20). 

## Prerequisites

- Write access to each private cloud you're connecting
- Routed IP address space in each cloud is unique and doesn't overlap

>[!NOTE]
>The **AVS interconnect** feature doesn't check for overlapping IP space the way native Azure vNet peering does before creating the peering. Therefore, it's your responsibility to ensure that there isn't overlap between the private clouds.
>
>In Azure VMware Solution environments, it's possible to configure non-routed, overlapping IP deployments on NSX segments that aren't routed to Azure.  These don't cause issues with the AVS Interconnect feature, as it only routes between the NSX T0 on each private cloud.


## Add connection between private clouds

1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

2. Select the **AVS Interconnect** tab and then **Add**.

   :::image type="content" source="media/networking/private-cloud-to-private-cloud-no-connections.png" alt-text="Screenshot showing the AVS Interconnect tab under Connectivity." border="true" lightbox="media/networking/private-cloud-to-private-cloud-no-connections.png":::

3. Select the information and Azure VMware Solution private cloud for the new connection.

   >[!NOTE]
   >You can only connect to private clouds in the same region. To connect to private clouds that are in different regions, [use ExpressRoute Global Reach](tutorial-expressroute-global-reach-private-cloud.md) to connect your private clouds in the same way you connect your private cloud to your on-premises circuit. 

   :::image type="content" source="media/networking/add-connection-to-other-private-cloud.png" alt-text="Screenshot showing the required information to add a connection to other private cloud." border="true":::


4. Select the **I confirm** checkbox acknowledging that there are no overlapping routed IP spaces in the two private clouds. 

5. Select **Create**.  You can check the status of the connection creation.

   :::image type="content" source="media/networking/add-connection-to-other-private-cloud-notification.png" alt-text="Screenshot showing the Notification information for connection in progress and an existing connection." border="true":::

   You'll see all of your connections under **AVS Private Cloud**.
   
   :::image type="content" source="media/networking/private-cloud-to-private-cloud-two-connections.png" alt-text="Screenshot showing the AVS Interconnect tab under Connectivity and two established private cloud connections." border="true" lightbox="media/networking/private-cloud-to-private-cloud-two-connections.png":::


## Remove connection between private clouds

1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

2. For the connection you want to remove, on the right, select **Delete** (trash can) and then **Yes**.


## Next steps

Now that you've connected multiple private clouds in the same region, you may want to learn about:

- [Move Azure VMware Solution resources to another region](move-azure-vmware-solution-across-regions.md)
- [Move Azure VMware Solution subscription to another subscription](move-ea-csp-subscriptions.md)
