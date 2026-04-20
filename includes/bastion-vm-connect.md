---
 author: abell
 ms.service: azure-bastion
 ms.topic: include
 ms.date: 01/22/2026
 ms.author: abell
 ms.custom: sfi-image-nochange
---

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. 
1. At the top of the pane, select **Connect** > **Bastion** to go to the **Bastion** pane. You can also go to the **Bastion** pane by using the left menu.
1. The options available on the **Bastion** pane depend on the Bastion SKU.

   If you're using the **Standard or higher SKU**, you have more connection protocol and port options available. Expand **Connection Settings** to see the options. Typically, unless you configure different settings for your VM, you connect to a Windows computer by using RDP and port 3389. You connect to a Linux computer by using SSH and port 22.

   If you're using the **Basic SKU**, you connect to a Windows computer by using RDP and port 3389. Also for the Basic SKU, you connect to a Linux computer by using SSH and port 22. You don't have options to change the port number or the protocol. However, you can change the keyboard language for RDP by expanding **Connection Settings** on this pane.

   If you're using the **Developer SKU**, Bastion deploys automatically when you connect for the first time. You connect to a Windows computer by using RDP and port 3389, or to a Linux computer by using SSH and port 22. The Developer SKU uses a shared pool architecture and is available at no extra cost in [select regions](../articles/bastion/quickstart-host-portal.md?tabs=developer).

1. For **Authentication Type**, select the authentication type from the dropdown list. The protocol determines the available authentication types. Complete the required authentication values.

1. To open the VM session in a new browser tab, leave **Open in new browser tab** selected.
1. Select **Connect** to connect to the VM.
1. Confirm that the connection to the virtual machine opens directly in the Azure portal (over HTML5) by using port 443 and the Bastion service.

Using keyboard shortcut keys while you're connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when you're connected to a Windows VM from a Windows client, Ctrl+Alt+End is the keyboard shortcut for Ctrl+Alt+Delete on a local computer. To do this from a Mac while you're connected to a Windows VM, the keyboard shortcut is fn+control+option+delete.