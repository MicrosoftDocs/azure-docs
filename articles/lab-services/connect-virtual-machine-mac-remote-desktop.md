---
title: Connect to Azure Lab Services VMs from Mac
titleSuffix: Azure Lab Services
description: Learn how to connect using remote desktop (RDP) from a Mac to a virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 03/04/2024
#customer intent: As a student or trainee, I want to connect to an Azure Lab Services VM from my Mac over RDP in order to use the lab resources.
---

# Connect to a VM using Remote Desktop Protocol on a Mac

In this article, you learn how to connect to a lab virtual machine (VM) in Azure Lab Services from a Mac by using Remote Desktop Protocol (RDP).

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

## Install Microsoft Remote Desktop on a Mac

To connect to the lab VM by using RDP, use the Microsoft Remote Desktop app.

To install the Microsoft Remote Desktop app:

1. Open the App Store on your Mac, and search for **Microsoft Remote Desktop**.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop\install-remote-desktop.png" alt-text="Screenshot of Microsoft Remote Desktop app in the App Store." lightbox="./media/connect-virtual-machine-mac-remote-desktop\install-remote-desktop.png" :::

1. Select **Install** to install the latest version of Microsoft Remote Desktop.

## Access the VM from your Mac using RDP

Connect to the lab VM by using the remote desktop application. You can retrieve the connection information for the lab VM from the Azure Lab Services website.

1. Navigate to the [Azure Lab Services website](https://labs.azure.com), and sign in with your credentials.

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services with the connect icon button on the VM tile highlighted." lightbox="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png":::

1. When you connect to a Linux VM, you see two options to connect to the VM: SSH and RDP. Select the **Connect via RDP** option. If you're connecting to a Windows VM, you don't need to choose a connection option. The RDP file downloads.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png" alt-text="Screenshot that shows VM tile for student with the RDP and SSH connection options highlighted." lightbox="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png":::

1. Open the *RDP* file on your computer with **Microsoft Remote Desktop** installed. Your computer should start to connect to the VM.

    :::image type="content" source="./media/how-to-use-classroom-lab/connect-linux-vm.png" alt-text="Screenshot of Microsoft Remote Desktop app connecting to a remote VM." lightbox="./media/how-to-use-classroom-lab/connect-linux-vm.png":::

1. When prompted, enter your user name and password.

1. If you receive a certificate warning, you can select **Continue**.

    :::image type="content" source="./media/how-to-use-classroom-lab/certificate-error.png" alt-text="Screenshot of certificate error for Microsoft Remote Desktop app." lightbox="./media/how-to-use-classroom-lab/certificate-error.png":::

1. After the connection is established, you see the desktop of your lab VM.

    The following example is for a CentOS Linux VM:

    :::image type="content" source="./media/how-to-use-classroom-lab/vm-ui.png" alt-text="Screenshot of the desktop for a CentOS Linux VM." lightbox="./media/how-to-use-classroom-lab/vm-ui.png":::

## Related content

- As a student, learn to [connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm).
