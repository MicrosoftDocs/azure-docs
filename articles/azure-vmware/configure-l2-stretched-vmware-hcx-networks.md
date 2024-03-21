---
title: Configure DHCP on L2 stretched VMware HCX networks
description: Learn how to send DHCP requests from your Azure VMware Solution VMs to a non-NSX DHCP server.
ms.topic: how-to
ms.custom: engagement-fy23
ms.service: azure-vmware
ms.date: 3/7/2024
# Customer intent: As an Azure service administrator, I want to configure DHCP on L2 stretched VMware HCX networks to send DHCP requests from my Azure VMware Solution VMs to a non-NSX DHCP server.
---

# Configure DHCP on L2 stretched VMware HCX networks

DHCP doesn't work for virtual machines (VMs) on the VMware HCX L2 stretched network when the DHCP server is in the on-premises data center because NSX, by default, blocks all DHCP requests from traversing the L2 stretch. Therefore, to send DHCP requests from your Azure VMware Solution VMs to a non-NSX DHCP server, you need to configure DHCP on L2 stretched VMware HCX networks.

Configuring DHCP Relay in NSX is unnecessary while the network is stretched. Implementing DHCP relay on an extended network may lead to unintended issues, resulting in clients not receiving the correct responses. Following a failover to Azure VMware Solution, DHCP Relay or NSX DHCP server configuration would be necessary to continue serving clients effectively.

1. (Optional) If you need to locate the segment name of the L2 extension:

   1. Sign in to your on-premises vCenter Server, and under **Home**, select **HCX**.

   1. Select **Network Extension** under **Services**.

   1. Select the network extension you want to support DHCP requests from Azure VMware Solution to on-premises.

   1. Take note of the destination network name.

      :::image type="content" source="media/manage-dhcp/hcx-find-destination-network.png" alt-text="Screenshot of a network extension in VMware vSphere Client." lightbox="media/manage-dhcp/hcx-find-destination-network.png":::

1. In NSX-T Manager, select **Networking** > **Segments** > **Segment Profiles**.

1. Select **Add Segment Profile** and then **Segment Security**.

   :::image type="content" source="media/manage-dhcp/add-segment-profile.png" alt-text="Screenshot of how to add a segment profile in NSX-T Data Center." lightbox="media/manage-dhcp/add-segment-profile.png":::

1. Provide a name and a tag, and then set the **BPDU Filter** toggle to ON and all the DHCP toggles to OFF.

   :::image type="content" source="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png" alt-text="Screenshot showing the BPDU Filter toggled on and the DHCP toggles off." lightbox="media/manage-dhcp/add-segment-profile-bpdu-filter-dhcp-options.png":::
	
   :::image type="content" source="media/manage-dhcp/edit-segment-security.png" alt-text="Screenshot of the Segment Security field." lightbox="media/manage-dhcp/edit-segment-security.png":::
