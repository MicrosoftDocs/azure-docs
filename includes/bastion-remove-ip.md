---
author: cherylmc
ms.author: cherylmc
ms.date: 08/15/2022
ms.service: bastion
ms.topic: include

---

When you connect to a VM using Azure Bastion, you don't need a public IP address for your VM. If you aren't using the public IP address for anything else, you can dissociate it from your VM. To dissociate a public IP address from your VM, use the following steps:

1. Go to your virtual machine and select **Networking**. Click the **NIC Public IP** to open the Public IP address page.

   :::image type="content" source="./media/bastion-remove-ip/networking.png" alt-text="Screenshot of networking page." lightbox="./media/bastion-remove-ip/networking.png" :::

1. On the **Public IP address** page, you can see the VM network interface listed under **Associated to** on the lower right of the page.  Click **Dissociate** at the top of the page.

   :::image type="content" source="./media/bastion-remove-ip/dissociate.png" alt-text="Screenshot of public IP address for the VM." lightbox="./media/bastion-remove-ip/dissociate.png":::

1. Click **Yes** to dissociate the IP address from the network interface. Once the public IP address is dissociated from the VM network interface, you can see that it's no longer listed under **Associated to**.

1. After you dissociate the IP address, you can delete the public IP address resource. On the **Public IP address** page for the VM, select **Delete**.

   :::image type="content" source="./media/bastion-remove-ip/delete-resource.png" alt-text="Screenshot of delete the public IP address resource." lightbox="./media/bastion-remove-ip/delete-resource.png":::

1. Click **Yes** to delete the public IP address.