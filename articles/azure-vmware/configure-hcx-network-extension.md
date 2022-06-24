---
title: Create an HCX network extension
description: Learn how to extend any networks from your on-premises environment to Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 09/07/2021
---

# Create a HCX network extension

This is an optional step to extend any networks from your on-premises environment to Azure VMware Solution.

1. Under **Services**, select **Network Extension** > **Create a Network Extension**.

   :::image type="content" source="media/tutorial-vmware-hcx/create-network-extension.png" alt-text="Screenshot that shows selections for starting to create a network extension." lightbox="media/tutorial-vmware-hcx/create-network-extension.png":::

1. Select each of the networks you want to extend to Azure VMware Solution, and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-extend-networks.png" alt-text="Screenshot that shows the selection of a network.":::

1. Enter the on-premises gateway IP for each of the networks you're extending, and then select **Submit**.

   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-gateway.png" alt-text="Screenshot that shows the entry of a gateway IP address.":::

   It takes a few minutes for the network extension to finish. When it does, you see the status change to **Extension complete**.

   :::image type="content" source="media/tutorial-vmware-hcx/extension-complete.png" alt-text="Screenshot that shows the status of Extension complete.":::

## Next steps

Now that you've configured the HCX Network Extension, you can also learn about:

- [VMware HCX Mobility Optimized Networking (MON) guidance](vmware-hcx-mon-guidance.md)
