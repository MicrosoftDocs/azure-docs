---
author: cherylmc
ms.author: cherylmc
ms.date: 08/30/2021
ms.service: virtual-wan
ms.topic: include
---

1. In the [Azure portal](https://portal.azure.com), navigate to the virtual machine that you want to connect to. On the **Overview** page, select **Connect**, then select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-vm-rdp/connect.png" alt-text="Screenshot of Connect." lightbox="./media/bastion-vm-rdp/connect.png":::

1. After you select Bastion, select **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](../articles/bastion/quickstart-host-portal.md).

   :::image type="content" source="./media/bastion-vm-rdp/select-use-bastion.png" alt-text="Screenshot showing Use Bastion.":::

1. On the **Connect using Azure Bastion** page, expand the **Connection Settings** section and select **RDP**. If you plan to use an inbound port different from the standard RDP port (3389), enter the **Port**.

   :::image type="content" source="./media/bastion-connect-vm-rdp-linux/connection-settings.png" alt-text="Screenshot showing port." lightbox="./media/bastion-connect-vm-rdp-linux/connection-settings.png":::

1. Enter the **Username** and **Password**, and then select **Connect** to connect to the VM.

   :::image type="content" source="./media/bastion-connect-vm-rdp-linux/username-password.png" alt-text="Screenshot showing to click Connect." lightbox="./media/bastion-connect-vm-rdp-linux/username-password.png":::

1. The RDP connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. 

   Note that using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, from a Windows client computer connected to a Windows VM, "CTRL+ALT+END" is the keyboard shortcut for "CTRL+ALT+Delete". From a Mac client computer connected to a Windows VM, the keyboard shortcut is "Fn+CTRL+ALT+Backspace".
