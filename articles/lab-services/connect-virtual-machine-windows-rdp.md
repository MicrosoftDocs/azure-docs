---
title: Connect to a VM using Remote Desktop Protocol on Windows in Azure Lab Services | Microsoft Docs
description: Learn how to connect from Windows to a Linux VM using Remote Desktop Protocol
ms.topic: how-to
ms.date: 02/01/2022
---

# Connect to a VM using Remote Desktop Protocol on Windows

This article shows how a student can connect from Windows to a lab VM using Remote Desktop Protocol (RDP).

## Connect to VM from Windows using RDP

Students can use RDP to connect to their lab VMs.  If the lab VM is a Windows VM, no extra configuration is required by the educator.  If the lab VM is a Linux VM, the educator must [enable RDP](how-to-enable-remote-desktop-linux.md) and install GUI packages for a Linux graphical desktop.

Typically, the [Remote Desktop client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients) is already installed and configured on Windows.  As a result, all you need to do is select on the RDP file to open it and start the remote session.

1. On the tile for your VM, ensure the [VM is running](how-to-use-lab.md#start-or-stop-the-vm) and select the **Connect** icon.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.  The connect icon button on the VM tile is highlighted.":::
1. If you’re connecting *to a Linux VM*, you'll see two options to connect to the VM: SSH and RDP.  Select the **Connect via RDP** option.  If you're connecting *to a Windows VM*, you don't need to choose a connection option.  The RDP file will automatically start downloading.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/student-vm-connect-options.png" alt-text="Screenshot that shows V M tile for student.  The R D P and S S H connection options are highlighted.":::
1. When the RDP file is downloaded onto your machine, open it to launch the RDP client.
1. After adjusting RDP connection settings as needed, select **Connect** to start the remote session.

## Optimize RDP client settings

The RDP client includes various settings that can be adjusted to optimize the user's connection experience.  Typically, these settings don't need to be changed.  By default, the settings are already configured to choose the right experience based on your network connection.  For more information on these settings, see [RDP client's **Experience** settings](/windows-server/administration/performance-tuning/role/remote-desktop/session-hosts#client-experience-settings).

If your educator has configured the GNOME graphical desktop on a Linux VM with the RDP client, we recommend the following settings to optimize performance:

- Under the **Display** tab, set the color depth to **High Color (15 bit)**.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/rdp-display-settings.png" alt-text="Screenshot of display tab of the Windows R D P client.  The color depth setting is highlighted.":::
- Under the **Experience** tab, set the connection speed to **Modem (56 kbps)**.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/rdp-experience-settings.png" alt-text="Screenshot of experience tab of the Windows R D P client.  The connection speed setting is highlighted.":::

## Next steps

- [As an educator, enabled RDP on Linux](how-to-enable-remote-desktop-linux.md#rdp-setup)
- [As a student, stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
