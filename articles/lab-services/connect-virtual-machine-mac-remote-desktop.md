---
title: Connect to Azure Lab Services VMs from Mac
titleSuffix: Azure Lab Services
description: Learn how to connect using remote desktop (RDP) from a Mac to a virtual machine in Azure Lab Services.
services: lab-services
ms.service: azure-lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 07/08/2025
ms.custom: sfi-image-nochange
#customer intent: As a student or trainee, I want to connect to an Azure Lab Services VM from my Mac over RDP in order to use the lab resources.
---

# Connect to a VM using Remote Desktop Protocol on a Mac

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

In this article, you learn how to connect to a lab virtual machine (VM) in Azure Lab Services from a Mac by using Remote Desktop Protocol (RDP).

## Install Windows App on a Mac

To connect to the lab VM by using RDP, use the Windows App app.

To install the Windows App app:

1. Open the App Store on your Mac, and search for **Windows App**.

1. Select **Install** to install the latest version of Windows App.

## Access the VM from your Mac using RDP

Connect to the lab VM by using the remote desktop application. You can retrieve the connection information for the lab VM from the Azure Lab Services website.

1. Navigate to the [Azure Lab Services website](https://labs.azure.com), and sign in with your credentials.

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services with the connect icon button on the VM tile highlighted." lightbox="./media/connect-virtual-machine-mac-remote-desktop/connect-vm.png":::

1. When you connect to a Linux VM, you see two options to connect to the VM: SSH and RDP. Select the **Connect via RDP** option. If you're connecting to a Windows VM, you don't need to choose a connection option. The RDP file downloads.

    :::image type="content" source="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png" alt-text="Screenshot that shows VM tile for student with the RDP and SSH connection options highlighted." lightbox="./media/connect-virtual-machine-mac-remote-desktop/student-vm-connect-options.png":::

1. Open the *RDP* file on your computer with **Windows App** installed. Your computer should start to connect to the VM.

1. When prompted, log in.

1. After the connection is established, you see the desktop of your lab VM.

For more information about using Windows App, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps?tabs=macos-avd%2Cwindows-w365%2Cwindows-devbox%2Cmacos-rds%2Cmacos-pc&pivots=azure-virtual-desktop).

## Related content

- As a student, learn to [connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm).
