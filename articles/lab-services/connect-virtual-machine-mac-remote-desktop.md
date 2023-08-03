---
title: Connect to Azure Lab Services VMs from Mac
titleSuffix: Azure Lab Services
description: Learn how to connect using remote desktop (RDP) from a Mac to a virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 02/16/2023
---

# Connect to a VM using Remote Desktop Protocol on a Mac

In this article, you learn how to connect to a lab VM in Azure Lab Services from a Mac by using Remote Desktop Protocol (RDP).

## Install Microsoft Remote Desktop on a Mac

To connect to the lab VM via RDP, you can use the Microsoft Remote Desktop app.

To install the Microsoft Remote Desktop app:

1. Open the App Store on your Mac, and search for **Microsoft Remote Desktop**.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop\install-remote-desktop.png" alt-text="Screenshot of Microsoft Remote Desktop app in the App Store.":::

1. Select **Install** to install the latest version of Microsoft Remote Desktop.

## Access the VM from your Mac using RDP

Next, you connect to the lab VM by using the remote desktop application. You can retrieve the connection information for the lab VM from the Azure Lab Services website.

1. Navigate to the Azure Lab Services website (https://labs.azure.com), and sign in with your credentials.

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.  The connect icon button on the VM tile is highlighted.":::

1. If you’re connecting to a Linux VM, you'll see two options to connect to the VM: SSH and RDP.  Select the **Connect via RDP** option. If you're connecting to a Windows VM, you don't need to choose a connection option.  The RDP file will automatically start downloading.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png" alt-text="Screenshot that shows V M tile for student.  The R D P and S S H connection options are highlighted.":::

1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** installed. It should start connecting to the VM.

    :::image type="content" source="./media/how-to-use-classroom-lab/connect-linux-vm.png" alt-text="Screenshot of Microsoft Remote Desktop app connecting to a remote VM.":::

1. When prompted, enter your username and password.

1. If you receive a certificate warning, you can select **Continue**.

    :::image type="content" source="./media/how-to-use-classroom-lab/certificate-error.png" alt-text="Screenshot of certificate error for Microsoft Remote Desktop app.":::

1. After the connection is established, you see the desktop of your lab VM.

    The following example is for a CentOS Linux VM:

    :::image type="content" source="./media/how-to-use-classroom-lab/vm-ui.png" alt-text="Screenshot of the desktop for a CentOS Linux VM.":::

## Next steps

- As a student, learn to [connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm).
