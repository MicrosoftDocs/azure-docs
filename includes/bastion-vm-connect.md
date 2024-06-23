---
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 08/16/2022
 ms.author: cherylmc
---

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. 
1. At the top of the pane, select **Connect** > **Bastion** to go to the **Bastion** pane. You can also go to the **Bastion** pane by using the left menu.
1. The options available on the **Bastion** pane depend on the Bastion SKU. If you're using the Basic SKU, you connect to a Windows computer by using RDP and port 3389. Also for the Basic SKU, you connect to a Linux computer by using SSH and port 22. You don't have options to change the port number or the protocol. However, you can change the keyboard language for RDP by expanding **Connection Settings**.

   :::image type="content" source="./media/bastion-connect-vm/basic-sku.png" alt-text="Screenshot of Azure Bastion connection settings." lightbox="./media/bastion-connect-vm/windows-rdp.png":::

   If you're using the Standard SKU, you have more connection protocol and port options available. Expand **Connection Settings** to see the options. Typically, unless you configure different settings for your VM, you connect to a Windows computer by using RDP and port 3389. You connect to a Linux computer by using SSH and port 22.

   :::image type="content" source="./media/bastion-connect-vm/connection-settings.png" alt-text="Screenshot of expanded connection settings." lightbox="./media/bastion-connect-vm/connection-settings.png":::

1. For **Authentication Type**, select from the dropdown list. The protocol determines the available authentication types. Complete the required authentication values.

   :::image type="content" source="./media/bastion-connect-vm/authentication-connect.png" alt-text="Screenshot that shows the dropdown list box for authentication type." lightbox="./media/bastion-connect-vm/authentication-connect.png":::

1. To open the VM session in a new browser tab, leave **Open in new browser tab** selected.
1. Select **Connect** to connect to the VM.
1. Confirm that the connection to the virtual machine opens directly in the Azure portal (over HTML5) by using port 443 and the Bastion service.

   :::image type="content" source="./media/bastion-vm-rdp/connection.png" alt-text="Screenshot of a computer desktop with an open connection over port 443.":::

   > [!NOTE]
   > When you connect, the desktop of the VM will look different from the example screenshot.

Using keyboard shortcut keys while you're connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when you're connected to a Windows VM from a Windows client, Ctrl+Alt+End is the keyboard shortcut for Ctrl+Alt+Delete on a local computer. To do this from a Mac while you're connected to a Windows VM, the keyboard shortcut is Fn+Ctrl+Alt+Backspace.
