---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 04/11/2021
---

To finish building your virtual machine, you need to start the virtual machine and walk through the operating system installation.

1. In **Hyper-V Manager**, in the scope pane, right-click the VM to open the context menu, and then select **Start**. 

    ![Select VM and start it](./media/azure-stack-edge-connect-to-hyperv-vm/connect-virtual-machine-01.png)

2. The VM state is **Running**. Select the VM, and then right-click and select **Connect**.

    ![Connect to VM](./media/azure-stack-edge-connect-to-hyperv-vm/connect-virtual-machine-02.png)

3. The virtual machine boots into setup, and you can walk through the installation like you would on a physical computer.
 
   ![Configure the operating system of the VM](./media/azure-stack-edge-connect-to-hyperv-vm/connect-virtual-machine-03.png)<!--To verify or reshoot, create a real VM using the ISO from 03/31 sync.-->

<!--Compare with the Hyper-V VM steps in https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/create-virtual-machine#complete-the-operating-system-deployment. Should licensing be raised as an issue in the Azure Stack Edge version?-->
