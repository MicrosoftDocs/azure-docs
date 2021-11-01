---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 08/04/2020
ms.author: alkohli
---

Connect to your Windows VM by using the Remote Desktop Protocol (RDP) via the IP that you passed during the VM creation.

1. On your client, open RDP. 
1. Go to **Start**, and then enter **mstsc**.
1. On the **Remote Desktop Connection** pane, enter the IP address of the VM and the access credentials you used in the VM template parameters file. Then select **Connect**.

   ![Screenshot of the Remote Desktop Connection pane for connecting via RDP to your Windows VM.](media/azure-stack-edge-gateway-connect-vm-windows/connect-vm-rdp-1.png)

   > [!NOTE]
   > You might need to approve connecting to an untrusted machine. 

You're now signed in to your VM that runs on the appliance. 
