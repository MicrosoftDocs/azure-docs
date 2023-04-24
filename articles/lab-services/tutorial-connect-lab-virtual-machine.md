---
title: 'Tutorial: Access a lab in Azure Lab Services'
titleSuffix: Azure Lab Services
description: In this tutorial, learn how you can register for a lab in Azure Lab Services and connect to the lab virtual machine.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: tutorial
ms.date: 02/17/2023
---

# Tutorial: Access a lab in Azure Lab Services from the Lab Services website

In this tutorial, learn how you can register for a lab as a lab user, and then start and connect to lab virtual machine (VM) by using the Azure Lab Services website.

If you're using Microsoft Teams or Canvas with Azure Lab Services, learn how you can [access your lab from Microsoft Teams](./how-to-access-vm-for-students-within-teams.md) or how you can [access your lab from Canvas](./how-to-access-vm-for-students-within-canvas.md).

> [!div class="checklist"]
> * Register to the lab
> * Start the VM
> * Connect to the VM

## Register to the lab

Before you can use the lab from the Azure Lab Services website, you need to first register for the lab by using a registration link.

To register for a lab by using the registration link:

1. Navigate to the registration URL that you received from the lab creator.

    You have to register for each lab that you want to access. After you complete registration for a lab, you no longer need the registration link for that lab.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/register-lab.png" alt-text="Screenshot of browser with example registration link for Azure Lab Services, highlighting the registration link.":::

1. Sign in to the service using your organizational or school account to complete the registration.

    > [!NOTE]
    > You need a Microsoft account to use Azure Lab Services, unless you're using Canvas. If you try to use your non-Microsoft account, such as Yahoo or Google accounts, to sign in to the portal, follow the instructions to create a Microsoft account that's linked to your non-Microsoft account. Then, follow the steps to complete the lab registration process.

1. After the registration finishes, confirm that you see the lab virtual machine in **My virtual machines**.

    After you complete the registration, you can directly access your lab VMs by using the Azure Lab Services website (https://labs.azure.com).

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/accessible-vms.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services portal.":::

1. On the **My virtual machines** page, you can see a tile for your lab VM. Confirm that the VM is in the **Stopped** state.

    The VM tile shows the lab VM details, such as the lab name, operating system, and status. The VM tile also enables you to perform specific actions on the lab VM, such starting and stopping it.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-in-stopped-state.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services website, highlighting the stopped state.":::

## Start the VM

Before you can connect to a lab VM, the VM must be running.

To start the lab VM from the Azure Lab Services website:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Start the VM by selecting the status toggle control.

    Starting the lab VM might take some time.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page in the Azure Lab Services website, highlighting the VM state toggle.":::

1. Confirm that the status of the VM is now **Running**.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page in the Azure Lab Services website, highlighting the VM is running.":::

## Connect to the VM

You can now connect to the lab VM. You can retrieve the connection information from the Azure Lab Services website.

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Select the connect button in the lower right of the VM tile to retrieve the connection information.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/connect-vm.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services website, highlighting the Connect button.":::

1. Connect to the lab VM in either of two ways:

    - For Windows virtual machines, open the RDP connection file once it has finished downloading. Use the credentials that the lab creator provided to sign in to the virtual machine. For more information, see [Connect to a Windows lab VM](connect-virtual-machine.md#connect-to-a-windows-lab-vm).

    - For Linux virtual machines, you can use either SSH or RDP (if RDP is enabled for the lab) to connect to the VM. For more information, see [Connect to a Linux lab VM](connect-virtual-machine.md#connect-to-a-linux-lab-vm).

## Next steps

In this tutorial, you accessed a lab using the registration link you got from the lab creator. When done with the VM, you stop the lab VM from the Azure Lab Services website.

>[!div class="nextstepaction"]
>[Stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
