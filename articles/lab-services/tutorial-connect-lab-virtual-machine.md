---
title: 'Tutorial: Register & access a lab'
titleSuffix: Azure Lab Services
description: In this tutorial, learn how to register for a lab in Azure Lab Services and connect to the lab virtual machine from the Azure Lab Services website.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: tutorial
ms.date: 06/29/2023
---

# Tutorial: Register and access a lab in the Azure Lab Services website

Azure Lab Services supports inviting lab users based on their email address, by syncing with an Azure Active Directory group, or by integrating with Teams or Canvas. In this tutorial, you learn how to register for a lab with your email address, view the lab in the Azure Lab Services website, and connect to the lab virtual machine with a remote desktop client or SSH.

:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/lab-services-process-register-access-lab.png" alt-text="Diagram that shows the steps involved in registering and accessing a lab from the Azure Lab Services website.":::

If you're using Microsoft Teams or Canvas with Azure Lab Services, learn more in our [Tutorial: access your lab from Microsoft Teams or Canvas](./how-to-access-vm-for-students-within-teams.md).

> [!div class="checklist"]
> * Register for the lab by using an email address
> * Access the lab in the Azure Lab Services website
> * Start the lab VM
> * Connect to the lab VM

## Prerequisites

- A lab that was created in the Azure Lab Services website. Follow the steps to create a lab and invite users in [Tutorial: Create a lab for classroom training](./tutorial-setup-lab.md).

- You've received a lab registration link.

## Register for the lab

[!INCLUDE [Register for a lab](./includes/lab-services-register-for-lab.md)]

## Access the lab in the Azure Lab Services website

After the registration process finishes, you can now view the labs you have access to. Once you've registered for the lab, you can directly access your labs from the Azure Lab Services website (https://labs.azure.com).

1. Select **My virtual machines** and confirm that you can see your lab virtual machine.

    The page has a tile for each of your lab virtual machines and shows the lab name, operating system, and the VM status.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/accessible-vms.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services portal.":::

1. Confirm that the lab VM is in the **Stopped** state.

    The VM tile enables you to perform specific actions on the lab VM, such starting and stopping it.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-in-stopped-state.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services website, highlighting the stopped state.":::

## Start the lab VM

Before you can connect to a lab VM, the lab VM must be running.

To start the lab VM from the Azure Lab Services website:

1. Start the VM by selecting the status toggle control. Starting the lab VM might take some time.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page in the Azure Lab Services website, highlighting the VM state toggle.":::

1. Confirm that the status of the VM is now **Running**.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page in the Azure Lab Services website, highlighting the VM is running.":::

## Connect to the lab VM

Now that the lab VM is running, you can connect to it with a remote desktop client or SSH, depending on the operating system. 

To retrieve the connection information from the Azure Lab Services website:

1. Select the connect button in the lower right of the lab VM tile to retrieve the connection information.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/connect-vm.png" alt-text="Screenshot of My virtual machines page in Azure Lab Services website, highlighting the Connect button.":::

1. Connect to the lab VM in either of two ways:

    - For Windows virtual machines, open the RDP connection file once it has finished downloading. Use the credentials that the lab creator provided to sign in to the virtual machine. For more information, see [Connect to a Windows lab VM](connect-virtual-machine.md#connect-to-a-windows-lab-vm).

    - For Linux virtual machines, you can use either SSH or RDP (if RDP is enabled for the lab) to connect to the VM. For more information, see [Connect to a Linux lab VM](connect-virtual-machine.md#connect-to-a-linux-lab-vm).

## Next steps

In this tutorial, you registered for a lab using the registration link you got from the lab creator. You then accessed the lab in the Azure Lab Services website and connected to the lab VM with a remote desktop client or SSH.

- Learn about the different ways to [access a lab](./how-to-use-lab.md)
- Learn how to [connect to a lab VM with SSH or RDP](./connect-virtual-machine.md)
- Learn how to [stop a lab VM](how-to-use-lab.md#start-or-stop-the-vm)
