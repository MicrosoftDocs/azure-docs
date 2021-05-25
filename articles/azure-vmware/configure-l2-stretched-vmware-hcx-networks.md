---
title: Configure DHCP on L2 stretched VMware HCX networks
description: Learn how to send DHCP requests from your Azure VMware Solution VMs to a non-NSX-T DHCP server.
ms.topic: how-to
ms.date: 05/17/2021
---

# Configure DHCP on L2 stretched VMware HCX networks
If you want to send DHCP requests from your Azure VMware Solution VMs to a non-NSX-T DHCP server, you'll create a new security segment profile.

>[!IMPORTANT]
>VMs on the same L2 segment that runs as DHCP servers are blocked from serving client requests.  Because of this, it's important to follow the steps in this section.

1. (Optional) If you need to locate the segment name of the L2 extension:

   1. Sign in to your on-premises vCenter, and under **Home**, select **HCX**.

   1. Select **Network Extension** under **Services**.

   1. Select the network extension you want to support DHCP requests from Azure VMware Solution to on-premises.

   1. Take note of the destination network name.

      :::image type="content" source="media/manage-dhcp/hcx-find-destination-network.png" alt-text="Screenshot of a network extension in VMware vSphere Client" lightbox="media/manage-dhcp/hcx-find-destination-network.png":::

1. In the Azure VMware Solution NSX-T Manager, select **Networking** > **Segments** > **Segment Profiles**.

1. Select **Add Segment Profile** and then **Segment Security**.

   :::image type="content" source="media/manage-dhcp/add-segment-profile.png" alt-text="Screenshot of how to add a segment profile in NSX-T" lightbox="media/manage-dhcp/add-segment-profile.png":::
1. Provide a name and a tag, and then set the **BPDU Filter** toggle to ON and all the DHCP toggles to OFF.

   :::image type="content" source="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png" alt-text="Screenshot showing the BPDU Filter toggled on and the DHCP toggles off" lightbox="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png":::
	
   :::image type="content" source="media/manage-dhcp/edit-segment-security.png" alt-text="Screenshot of the Segment Security field" lightbox="media/manage-dhcp/edit-segment-security.png":::