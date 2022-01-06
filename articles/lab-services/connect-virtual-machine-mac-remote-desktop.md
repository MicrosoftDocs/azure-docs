---
title: How to connect to an Azure Lab Services VM from Mac | Microsoft Docs
description: Learn how to connect from a Mac to a virtual machine in Azure Lab Services.
ms.topic: how-to
ms.date: 01/04/2020
---

# Connect to a VM using Remote Desktop Protocol on a Mac

This section shows how a student can connect to a lab VM from a Mac by using RDP.

## Install Microsoft Remote Desktop on a Mac

1. Open the App Store on your Mac, and search for **Microsoft Remote Desktop**.
    :::image type="content" source="./media/how-to-use-classroom-lab/install-ms-remote-desktop.png" alt-text="Screenshot of Microsoft Remote Desktop app in the App Store.":::
1. Install the latest version of Microsoft Remote Desktop.

## Access the VM from your Mac using RDP

1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** app previously installed. It should start connecting to the VM.
    :::image type="content" source="./media/how-to-use-classroom-lab/connect-linux-vm.png" alt-text="Screenshot of Microsoft Remote Desktop app connecting to a remote VM.":::
1. Select **Continue** if you receive the following warning.
    :::image type="content" source="./media/how-to-use-classroom-lab/certificate-error.png" alt-text="Screenshot of certificate error for Microsoft Remote Desktop app.":::
1. You should see the VM desktop.  The following example is for a CentOS Linux VM.
    :::image type="content" source="./media/how-to-use-classroom-lab/vm-ui.png" alt-text="Screenshot of desktop for CentOs Linux VM.":::

## Next steps

To learn how to connect to Linux VMs using RDP or X2Go, see [Use remote desktop for Linux virtual machines](how-to-use-remote-desktop-linux-student.md)
