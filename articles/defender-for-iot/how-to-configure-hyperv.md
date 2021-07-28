---
title: Configure SPAN for Hyper-V
description: This article explains how to configure SPAN for Hyper-V.
ms.date: 07/28/2021
ms.topic: how-to
---

# Configure Span for Hyper-V

The default behavior of Hyper-V Manager allows port mirroring between VA instances on the same Hyper-V server. It does not allow users to configure promiscuous mode for a virtual interface on a specific VA instance in order to receive external traffic.

## Process Overview for Enabling and Configuring SPAN

Before starting, ensure that no ClearPass VA instance is running.

**To enable and configure SPAN**:

1.	Create a virtual switch.

1.	Attach a ClearPass SPAN virtual interface to the virtual switch.

1.	Enable Microsoft NDIS capture extensions for the virtual switch.

1.	Set the mirroring mode on the external port.

1.	Set the local SPAN in a Cisco switch.

Make sure SPAN is enabled only on the data port and not the management port. Also, before you begin the SPAN configuration on the data port, make sure the data port is not configured with an IP address.

## Create a Virtual Switch 

1.	Open the Virtual Switch Manager.

1.	In the Virtual Switches list, select **New virtual network switch**, and then select **External** as the dedicated spanned network adapter type. 

    :::image type="content" source="organizations/media/how-to-configure-hyperv/new-virtual-network.png" alt-text="Select, new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Select **External Network** as the Connection type.

1. Select **Allow management operating system to share this network adapter**.

   :::image type="content" source="organizations/media/how-to-configure-hyperv/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter."::: 