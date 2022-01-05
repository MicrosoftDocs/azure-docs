---
title: How to access a lab in Azure Lab Services | Microsoft Docs
description: Learn how to register to a lab.  Also learn how to view, start, stop, and connect to all the lab VMs assigned to you. 
ms.topic: how-to
ms.date: 01/04/2022
---

# How to access a lab in Azure Lab Services

Learn how to register to a lab.  Also learn how to view, start, stop, and connect to all the lab VMs assigned to you.

## Register to the lab

1. Navigate to the **registration URL** that you received from the educator. You don't need to use the registration URL after you complete the registration. Instead, use the URL: [https://labs.azure.com](https://labs.azure.com).

    ![Register to the lab](./media/tutorial-connect-vm-in-classroom-lab/register-lab.png)
1. Sign in to the service using your school account to complete the registration.

    > [!NOTE]
    > A Microsoft account is required for using Azure Lab Services unless using Canvas. If you are trying to use your non-Microsoft account such as Yahoo or Google accounts to sign in to the portal, follow instructions to create a Microsoft account that will be linked to your non-Microsoft account. Then, follow the steps to complete the registration process.
1. Once registered, confirm that you see the virtual machine for the lab you have access to.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/accessible-vms.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.":::
1. Wait until the virtual machine is ready. On the VM tile, notice the following fields:
    1. At the top of the tile, you see the **name of the lab**.
    1. To its right, you see the icon representing the **operating system (OS)** of the VM. In this example, it's Windows OS.
    1. You see icons/buttons at the bottom of the tile to start/stop the VM, and connect to the VM.
    1. To the right of the buttons, you see the status of the VM. Confirm that you see the status of the VM is **Stopped**.
        :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-in-stopped-state.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The status toggle and Stopped label are highlighted.":::

## Start or stop the VM

1. **Start** the VM by selecting the first button as shown in the following image. This process takes some time.  
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The status toggle and Starting label on the VM tile are highlighted.":::
1. Confirm that the status of the VM is set to **Running**.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The Running label on the VM tile is highlighted.":::

    Notice that the status toggle is in the on position.  Select the status toggle again to **stop** the VM.

## Connect to the VM

Select the second button as shown in the following image to **connect** to the lab's VM.

:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.  The connect icon button on the VM tile is highlighted.":::

### Connect to a Windows lab VM

If connecting *to a Windows VM*, follow the instructions below based on the type of OS you're using.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | Save the **RDP** file. Then open the RDP file to connect to the virtual machine. Use the **user name** and **password** you get from your educator to sign in to the machine. |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md). |
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

### Connect to a Linux lab VM Using RDP

Linux VMs can have RDP enabled and a graphical desktop installed.  For more information, see [Enable remote desktop connection for Linux VMs](how-to-enable-remote-desktop-linux.md#enable-remote-desktop-connection-for-rdp).

To connect *to a Linux VM using RDP*, follow the instructions below based on the type of OS you're using.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | Save the **RDP** file. Then open the RDP file to connect to the virtual machine. Use the **user name** and **password** you get from your educator to sign in to the machine. |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md). |
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

### Connect to a Linux lab VM Using X2Go

Linux VMs can have X2Go enabled and a graphical desktop installed.  For more information, see [X2Go Setup](how-to-enable-remote-desktop-linux.md#x2go-setup) and [Using GNOME or MATE graphical desktops](how-to-enable-remote-desktop-linux.md#using-gnome-or-mate-graphical-desktops).  

For more information about connecting *to a Linux VM using X2Go*, see [Connect to a VM using X2Go](how-to-use-remote-desktop-linux-student.md#connect-to-the-student-vm-using-x2go).

### Connect to a Linux lab VM Using SSH

By default Linux VMs have SSH installed. If connecting *to a Linux VM using SSH*, do the following actions:

1. If using Windows client to connect to a Linux VM, first install an ssh client like [PuTTY](https://www.putty.org/) or enable [OpenSSH in Windows](/windows-server/administration/openssh/openssh_install_firstuse).
1. [Start the VM](how-to-use-classroom-lab.md#start-or-stop-the-vm).
1. Once the VM is running, select **Connect**, which will pop up a dialog box that provides the SSH command string, which will look like the following sample:

    ```bash
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

1. Go to your command prompt or terminal, and paste in this command, and then press **ENTER**.
1. Enter the password to sign in to the lab VM.

## Progress bar

The progress bar on the tile shows the number of hours used against the number of [quota hours](how-to-configure-student-usage.md#set-quotas-for-users) assigned to you. This time is the extra time allotted to you in outside of the scheduled time for the lab. The color of the progress bar and the text under the progress bar varies.  Let's cover the scenarios you might see.

- If a class is in progress (within the schedule of the class), progress bar is grayed out to represent quota hours aren't being used.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-class-in-progress.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when VM has been started by a schedule.":::
- If a quota isn't assigned (zero hours), the text **Available during classes only** is shown in place of the progress bar.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/available-during-class.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when no quota has been assigned.":::
- If you ran **out of quota**, the color of the progress bar is **red**.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-red-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been used.":::
- The color of the progress bar is **blue** when it's outside the scheduled time for the lab and some of the quota time has been used.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-blue-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been partially used.":::

## Next steps

See the following articles:

- [As an admin, create and manage lab plans](how-to-manage-lab-plans.md)
- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
