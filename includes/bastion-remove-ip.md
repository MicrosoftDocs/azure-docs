---
author: cherylmc
ms.author: cherylmc
ms.date: 08/15/2022
ms.service: bastion
ms.topic: include

---

When you connect to a VM by using Azure Bastion, you don't need a public IP address for your VM. If you aren't using the public IP address for anything else, you can dissociate it from your VM:

1. Go to your virtual machine and select **Networking**. Click **NIC Public IP**.

   :::image type="content" source="./media/bastion-remove-ip/networking.png" alt-text="Screenshot of the Networking pane for a virtual network." lightbox="./media/bastion-remove-ip/networking.png" :::

1. On the **Public IP address** pane, the VM network interface is listed under **Associated to**. Select **Dissociate** at the top of the pane.

   :::image type="content" source="./media/bastion-remove-ip/dissociate.png" alt-text="Screenshot of details for a virtual machine's public IP address." lightbox="./media/bastion-remove-ip/dissociate.png":::

1. Select **Yes** to dissociate the IP address from the VM network interface. After you dissociate the public IP address from the network interface, verify that it's no longer listed under **Associated to**.

1. After you dissociate the IP address, you can delete the public IP address resource. On the **Public IP address** pane for the VM, select **Delete**.

   :::image type="content" source="./media/bastion-remove-ip/delete-resource.png" alt-text="Screenshot of the button for deleting a public IP address resource." lightbox="./media/bastion-remove-ip/delete-resource.png":::

1. Select **Yes** to delete the public IP address.
