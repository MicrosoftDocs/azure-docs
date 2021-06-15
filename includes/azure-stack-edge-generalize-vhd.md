---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 06/14/2021
---

1. If you're generalizing a Windows Server 2019 Standard VM, before you generalize the VHD, make IDE the first BIOS setting for the virtual machine. This change is needed to enable the VM to be booted during the `sysprep` process.

    1. In Hyper-V Manager, select the VM, and then select **Settings**.
 
       ![Screenshot showing how to open Settings for a selected VM in Hyper-V Manager](./media/azure-stack-edge-generalize-vhd/vhd-from-iso-01.png)

     1. Under **BIOS**, ensure that **IDE** is at the top of the **Startup order** list.

        ![Screenshot showing IDE at top of startup order in BIOS settings for a VM in Hyper-V Manager](./media/azure-stack-edge-generalize-vhd/vhd-from-iso-02.png)

1. Inside the VM, open a command prompt.

1. Run the following command to generalize the VHD. 

    ```
    c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm
    ```
    
    For details, see [Sysprep (system preparation) overview](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).

1.  After the command is complete, the VM will shut down. **Do not restart the VM**.
