---
title: Connect to a lab VM from Chromebook
titleSuffix: Azure Lab Services
description: Learn how to connect from a Chromebook to a virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 01/18/2023
---

# Connect to a VM using Remote Desktop Protocol on a Chromebook

In this article, you learn how to connect to a lab VM in Azure Lab Services from a Chromebook by using Remote Desktop Protocol (RDP).

## Install Microsoft Remote Desktop on a Chromebook

To connect to the lab VM via RDP, you use the Microsoft Remote Desktop app.

To install the Microsoft Remote Desktop app:

1. Open the app store on your Chromebook, and search for **Microsoft Remote Desktop**.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/install-remote-desktop-chromebook.png" alt-text="Screenshot of the Microsoft Remote Desktop app in the app store.":::

1. Select **Install** to install the latest version of the Remote Desktop application by Microsoft Corporation.

## Access the VM from your Chromebook using RDP

Next, you connect to the lab VM by using the remote desktop application. You can retrieve the connection information for the lab VM from the Azure Lab Services website.

1. Navigate to the Azure Lab Services website (https://labs.azure.com), and sign in with your credentials.

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.  The connect icon button on the VM tile is highlighted.":::

1. If you’re connecting to a Linux VM, you'll see two options to connect to the VM: SSH and RDP.  Select the **Connect via RDP** option. If you're connecting to a Windows VM, you don't need to choose a connection option.  The RDP file will automatically start downloading.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/student-vm-connect-options.png" alt-text="Screenshot that shows V M tile for student.  The R D P and S S H connection options are highlighted.":::

1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** installed. It should start connecting to the VM.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/connect-vm-chromebook.png" alt-text="Screenshot of the Microsoft Remote Desktop app connecting to V M.":::

1. When prompted, enter your username and password.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/password-chromebook.png" alt-text="Screenshot that shows the Logon screen where you enter your username and password.":::

1. If you receive a certificate warning, you can select **Continue**.

    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/certificate-error-chromebook.png" alt-text="Screenshot that shows certificate warning when connecting to lab V M.":::

1. After the connection is established, you see the desktop of your lab VM.

## Next steps

- As an educator, [configure RDP for Linux VMs](how-to-enable-remote-desktop-linux.md#rdp-setup)
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
