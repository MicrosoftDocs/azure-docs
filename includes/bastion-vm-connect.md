---
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 08/16/2022
 ms.author: cherylmc
---

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine to which you want to connect. 
1. At the top of the page, select  **Connect->Bastion** to go to the **Bastion** page. You can also go to the Bastion page using the left menu.
1. The options available on the **Bastion** page are dependant on the Bastion SKU tier. If you're using the **Basic SKU**, you connect to a Windows computer using RDP and port 3389, and to a Linux computer using SSH and port 22. You don't have options to change the port number or the protocol. However, you can change the keyboard language for RDP by expanding **Connection Settings**.

   :::image type="content" source="./media/bastion-connect-vm/basic-sku.png" alt-text="Screenshot of Bastion connection page." lightbox="./media/bastion-connect-vm/windows-rdp.png":::

   If you're using the **Standard SKU**, you have more connection protocol and port options available. Expand **Connection Settings** to see the options. Typically, unless you have configured different settings for your VM, you connect to a Windows computer using RDP and port 3389, and to a Linux computer using SSH and port 22.

   :::image type="content" source="./media/bastion-connect-vm/connection-settings.png" alt-text="Screenshot of connection settings expanded." lightbox="./media/bastion-connect-vm/connection-settings.png":::

1. Select the **Authentication Type** from the dropdown. The protocol determines the available authentication types. Complete the required authentication values.

   :::image type="content" source="./media/bastion-connect-vm/authentication-connect.png" alt-text="Screenshot showing authentication type dropdown." lightbox="./media/bastion-connect-vm/authentication-connect.png":::

1. To open the VM session in a new browser tab, leave **Open in a new browser tab** selected.
1. Click **Connect** to connect to the VM.
1. The connection to this virtual machine, via Bastion, will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

   * When you connect, the desktop of the VM will look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

   :::image type="content" source="./media/bastion-vm-rdp/connection.png" alt-text="Screenshot of Connect using port 443.":::
