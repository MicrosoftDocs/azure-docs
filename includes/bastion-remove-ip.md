---
author: cherylmc
ms.author: cherylmc
ms.date: 06/29/2021
ms.service: bastion
ms.topic: include

---

When you connect to a VM using Azure Bastion, you do not need a public IP address for your VM. If you aren't using the public IP address for anything else, you can disassociate it from your VM. To disassociate a public IP address from your VM, use the following steps:

1. Navigate to your virtual machine and select **Networking**. Select the **NIC Public IP** to open the public IP address page.

   :::image type="content" source="./media/bastion-remove-ip/networking.png" alt-text="Screenshot of networking page.":::

1. On the **Public IP address** page for the VM, select **Disassociate**.

   :::image type="content" source="./media/bastion-remove-ip/disassociate.png" alt-text="Screenshot of public IP address for the VM.":::

1. Select **Yes** to disassociated the IP address from the network interface.

   :::image type="content" source="./media/bastion-remove-ip/disassociate-yes.png" alt-text="Screenshot of Disassociate public IP address.":::

1. After you disassociate the IP address, you can delete the public IP address resource. To delete the public IP address resource, navigate to the resource group and locate the IP address resource you want to delete. Then, select **Delete** to delete the resource.

   :::image type="content" source="./media/bastion-remove-ip/delete-resource.png" alt-text="Screenshot of delete the public IP address resource.":::