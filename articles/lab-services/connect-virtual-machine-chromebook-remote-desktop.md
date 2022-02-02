---
title: How to connect to an Azure Lab Services VM from Chromebook | Microsoft Docs
description: Learn how to connect from a Chromebook to a virtual machine in Azure Lab Services.
services: lab-services
author: nicolela
ms.topic: how-to
ms.date: 01/27/2022
ms.author: nicolela
---

# Connect to a VM using Remote Desktop Protocol on a Chromebook

This section shows how a student can connect to a lab VM from a Chromebook by using Remote Desktop Protocol (RDP).

## Install Microsoft Remote Desktop on a Chromebook

1. Open the App Store on your Chromebook, and search for **Microsoft Remote Desktop**.

    ![Microsoft Remote Desktop](./media/how-to-use-classroom-lab/install-ms-remote-desktop-chromebook.png)

1. Install the latest version of **Remote Desktop** by Microsoft Corporation.

## Access the VM from your Chromebook using RDP

1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** installed. It should start connecting to the VM.
    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/connect-vm-chromebook.png" alt-text="Screenshot of the Microsoft Remote Desktop app.":::
1. When prompted, enter your password.
    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/password-chromebook.png" alt-text="Screenshot that shows the Logon screen where you enter your username and password.":::
1. Select **Continue** if you receive a warning about the certificate not being verified.
    :::image type="content" source="./media/connect-virtual-machine-chromebook-remote-desktop/certificate-error-chromebook.png" alt-text="Screenshot that shows certificate warning when connecting to lab V M.":::

1. Once the connection is complete you'll see the desktop of your lab VM.

## Next steps

- As an educator, [configure RDP for Linux VMs](how-to-enable-remote-desktop-linux.md#rdp-setup)
- As a student, [stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
