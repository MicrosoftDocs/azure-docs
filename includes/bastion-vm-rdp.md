---
 title: include file
 description: include file
 services: bastion
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 10/12/2020
 ms.author: cherylmc
 ms.custom: include file
---

1. Open the [Azure portal](https://portal.azure.com). Navigate to the virtual machine that you want to connect to, then select **Connect**. Select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-vm-rdp/connect-vm.png" alt-text="Select Bastion" border="false":::

1. After you select Bastion from the dropdown, a side bar appears that has three tabs: RDP, SSH, and Bastion. Because Bastion was provisioned for the virtual network, the Bastion tab is active by default. Select **Use Bastion**.

   :::image type="content" source="./media/bastion-vm-rdp/use-bastion.png" alt-text="Select Use Bastion" border="false":::

1. On the **Connect using Azure Bastion** page, enter the username and password for your virtual machine, then select **Connect**.

   :::image type="content" source="./media/bastion-vm-rdp/host.png" alt-text="Connect" border="false":::

1. The RDP connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

   :::image type="content" source="./media/bastion-vm-rdp/connection.png" alt-text="Connect using port 443" border="false":::
