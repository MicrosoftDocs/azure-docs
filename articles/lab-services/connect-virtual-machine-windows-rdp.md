---
title: Connect to Azure Lab Services VMs from Windows
titleSuffix: Azure Lab Services
description: Learn how to connect using remote desktop (RDP) from Windows to a virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 03/06/2024
#customer intent: As a student, I want to connect to virtual machines in a lab by using RDP in order to use the lab resources. 
---

# Connect to a VM using Remote Desktop Protocol on Windows

In this article, you learn how to connect to a lab VM in Azure Lab Services from Windows by using Remote Desktop Protocol (RDP).

## Connect to VM from Windows using RDP

You can use RDP to connect to your lab VMs in Azure Lab Services. If the lab VM is a Linux VM, the lab creator must [enable RDP for the lab](how-to-enable-remote-desktop-linux.md) and install GUI packages for a Linux graphical desktop. For Windows-based lab VMs, no extra configuration is needed.

Typically, the [Remote Desktop client software](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients) is already present on Windows. To connect to the lab VM, you open the RDP connection file to start the remote session.

To connect to a lab VM in Azure Lab Services:

1. Navigate to the Azure Lab Services website (https://labs.azure.com), and sign in with your credentials.

1. On the tile for your VM, select the **Connect** icon.

    To connect to a lab VM, the virtual machine must be running. Learn how you can [start a VM](how-to-use-lab.md#start-or-stop-the-vm).

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/connect-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the connect button on the VM tile." lightbox="./media/connect-virtual-machine-windows-rdp/connect-vm.png":::

1. To connect to a Linux VM, select the **Connect via RDP** option.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/student-vm-connect-options.png" alt-text="Screenshot that shows VM tile for student, highlighting the connect button and showing the SSH and RDP connection options." lightbox="./media/connect-virtual-machine-windows-rdp/student-vm-connect-options.png":::

1. After the RDP connection file download finishes, open the RDP file to launch the RDP client.

1. Optionally, adjust the RDP connection settings, and then select **Connect** to start the remote session.

## Optimize RDP client settings

The RDP client software has various settings for optimizing your connection experience. The default settings optimize your experience based on your network connection. Typically, you don't need to change the default settings.

Learn more about the [RDP client's Experience settings](/windows-server/administration/performance-tuning/role/remote-desktop/session-hosts#client-experience-settings).

If you're using a Linux lab VM with a graphical desktop and the RDP client, the following settings might help to optimize performance:

- On the **Display** tab, set the color depth to **High Color (15 bit)**.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/rdp-display-settings.png" alt-text="Screenshot of display tab of the Windows R D P client, highlighting the color depth setting." lightbox="./media/connect-virtual-machine-windows-rdp/rdp-display-settings.png":::

- On the **Experience** tab, set the connection speed to **Modem (56 kbps)**.

    :::image type="content" source="./media/connect-virtual-machine-windows-rdp/rdp-experience-settings.png" alt-text="Screenshot of experience tab of the Windows RDP client, highlighting the connection speed setting." lightbox="./media/connect-virtual-machine-windows-rdp/rdp-experience-settings.png":::

## Related content

- [As an educator, enabled RDP on Linux](how-to-enable-remote-desktop-linux.md)
- [As a student, stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
