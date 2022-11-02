---
title: Connect to Azure Lab Services VMs from Mac
description: Learn how to connect from a Mac to a virtual machine in Azure Lab Services.
ms.topic: how-to
ms.date: 02/04/2022
---

# Connect to a VM using Remote Desktop Protocol on a Mac

This section shows how a student can connect to a lab VM from a Mac by using RDP.

## Install Microsoft Remote Desktop on a Mac

1. Open the App Store on your Mac, and search for **Microsoft Remote Desktop**.
    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop\install-remote-desktop.png" alt-text="Screenshot of Microsoft Remote Desktop app in the App Store.":::
1. Install the latest version of Microsoft Remote Desktop.

## Access the VM from your Mac using RDP

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.  The connect icon button on the VM tile is highlighted.":::
1. If you’re connecting *to a Linux VM*, you'll see two options to connect to the VM: SSH and RDP.  Select the **Connect via RDP** option.  If you're connecting *to a Windows VM*, you don't need to choose an connection option.  The RDP file will automatically start downloading.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png" alt-text="Screenshot that shows V M tile for student.  The R D P and S S H connection options are highlighted.":::
1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** app previously installed. It should start connecting to the VM.

    :::image type="content" source="./media/how-to-use-classroom-lab/connect-linux-vm.png" alt-text="Screenshot of Microsoft Remote Desktop app connecting to a remote VM.":::
1. Select **Continue** if you receive the following warning.

    :::image type="content" source="./media/how-to-use-classroom-lab/certificate-error.png" alt-text="Screenshot of certificate error for Microsoft Remote Desktop app.":::
1. You should see the VM desktop.  The following example is for a CentOS Linux VM.

    :::image type="content" source="./media/how-to-use-classroom-lab/vm-ui.png" alt-text="Screenshot of desktop for CentOs Linux VM.":::

## Next steps

- As a student, learn to [connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm).
