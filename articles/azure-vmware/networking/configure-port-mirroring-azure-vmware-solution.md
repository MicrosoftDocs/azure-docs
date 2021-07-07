---
title: Configure port mirroring for Azure VMware Solution
description: Learn how to configure port mirroring in either NSX-T Manager or the Azure portal. 
ms.topic: how-to
ms.date: 07/16/2021

# Customer intent: As an Azure service administrator, I want to configure 

---

# Configure port mirroring in the Azure portal

In this step, you'll configure port mirroring to monitor network traffic that involves forwarding a copy of each packet from one network switch port to another. This option places a protocol analyzer on the port that receives the mirrored data. It analyzes traffic from a source, a VM, or a group of VMs, and then sent to a defined destination. 

To set up port mirroring in the Azure VMware Solution console, you'll:

* Create the source and destination VMs or VM groups – The source group has a single VM or multiple VMs where the traffic is mirrored.

* Create a port mirroring profile – You'll define the traffic direction for the source and destination VM groups.


1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Port mirroring** > **VM groups** > **Add**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-port-mirroring-vm-groups.png" alt-text="Screenshot showing how to create a VM group for port mirroring.":::

1. Provide a name for the new VM group, select VMs from the list, and then **OK**.

1. Repeat these steps to create the destination VM group.

   >[!NOTE]
   >Before creating a port mirroring profile, make sure that you've created both the source and destination VM groups.

1. Select **Port mirroring** > **Port mirroring** > **Add** and then provide:

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-port-mirroring-profile.png" alt-text="Screenshot showing the information required for the port mirroring profile.":::

   - **Port mirroring name** - Descriptive name for the profile.

   - **Direction** - Select from Ingress, Egress, or Bi-directional.

   - **Source** - Select the source VM group.

   - **Destination** - Select the destination VM group.

   - **Description** - Enter a description for the port mirroring.

1. Select **OK** to complete the profile. 

   The profile and VM groups are visible in the Azure VMware Solution console.