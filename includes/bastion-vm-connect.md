---
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 05/05/2022
 ms.author: cherylmc
---

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine to which you want to connect. 
1. At the top of the page, select  **Connect->Bastion** to go to the **Bastion** page. You can also go to the Bastion page using the left menu.
1. The options available on the **Bastion** page are dependant on the Bastion SKU tier.

   When the Bastion **Basic SKU**  is configured, you connect to a Windows computer using RDP and port 3389, and to a Linux computer using SSH and port 22. You don't have options to change the port number or the protocol.

   :::image type="content" source="./media/bastion-connect-vm/basic-sku.png" alt-text="Screenshot of Bastion page." lightbox="./media/bastion-connect-vm/windows-rdp.png":::

   When the **Standard SKU** is configured, you have more connection options available. Expand **Connection Settings** to see the options. The following example shows a Windows computer with SSH selected.

    :::image type="content" source="./media/bastion-connect-vm/connection-settings.png" alt-text="Screenshot connection settings expanded." lightbox="./media/bastion-connect-vm/connection-settings.png":::
1. Complete the values. Typically, unless you have configured different settings, you connect to a Windows computer using RDP and port 3389, and to a Linux computer using SSH and port 22.
1. Select **Connect** to connect to the VM.
1. The connection to this virtual machine, via Bastion, will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

   * When you connect, the desktop of the VM will look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/bastion-vm-rdp/connection.png" alt-text="Screenshot of Connect using port 443.":::
