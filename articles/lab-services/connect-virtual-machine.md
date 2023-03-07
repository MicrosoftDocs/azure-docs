---
title: How to connect to a lab VM
titleSuffix: Azure Lab Services
description: Learn how to connect to a lab VM in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 02/17/2023
---

# Connect to a lab VM

In this article, you learn how to connect to a lab virtual machine (VM) in Azure Lab Services. Depending on the operating system (OS) and your local machine, you can use different mechanisms, such as secure shell (SSH) or remote desktop (RDP), to connect to your VM.

To connect to a lab VM, the VM must be running. Learn more about [how to start and stop a lab VM](how-to-use-lab.md#start-or-stop-the-vm).

## Connect to a Windows lab VM

Follow these instructions to connect to a Windows-based lab VM. Choose the instructions that match your local machine's operating system.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | [Connect to a VM using RDP on Windows](connect-virtual-machine-windows-rdp.md). |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md). |
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

## Connect to a Linux lab VM

To connect to a Linux-based lab VM, you can use the secure shell protocol (SSH), remote desktop protocol (RDP), or X2Go.

Azure Lab Services automatically configures SSH for Linux VMs. Both lab users and lab creators can SSH into Linux VMs without additional setup. If you want to connect to a VM with a Linux GUI, the lab creator might need to do extra setup on the template VM.

> [!WARNING]
> If you need to use [GNOME](https://www.gnome.org/) or [MATE](https://mate-desktop.org/) you should coordinate with the lab creator to ensure that your lab VM has the correct configuration. For details, see [Using GNOME or MATE graphical desktops](how-to-enable-remote-desktop-linux.md#using-gnome-or-mate-graphical-desktops).

### Connect to a Linux lab VM using RDP

Before you can connect to a Linux VM using RDP, the lab creator first needs to [enable remote desktop connection for Linux VMs](how-to-enable-remote-desktop-linux.md#rdp-setup).

To connect to a Linux VM using RDP, follow the instructions based on the type of OS you're using.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | [Connect to a VM using RDP on Windows](connect-virtual-machine-windows-rdp.md). |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md).|
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

### Connect to a Linux lab VM Using X2Go

Linux VMs can have X2Go enabled and a graphical desktop installed.  For more information, see [X2Go Setup](how-to-enable-remote-desktop-linux.md#setting-up-x2go) and [Using GNOME or MATE graphical desktops](how-to-enable-remote-desktop-linux.md#using-gnome-or-mate-graphical-desktops).  

For instructions to connect to a Linux VM using X2Go, see [Connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).

### Connect to a Linux lab VM using SSH

By default Linux VMs have SSH installed. To connect to a Linux VM using SSH:

1. If you're using a Windows machine to connect to the lab VM, ensure you have SSH client software on your machine.

    The latest version of Windows 10 and Windows 11 include a built-in SSH client. Learn how you can use the [access the built-in SSH client](/windows/terminal/tutorials/ssh).

    Alternately, you can download an SSH client, such as [PuTTY](https://www.putty.org/) or enable [OpenSSH in Windows](/windows-server/administration/openssh/openssh_install_firstuse).

1. If the lab VM is not running, go to the [Azure Lab Services website](https://labs.azure.com), and then [start the lab VM](how-to-use-lab.md#start-or-stop-the-vm).

1. Once the VM is running, select the **Connect** icon > **Connect via SSH**, to get the SSH command string

    The connection command looks like the following sample:

    ```bash
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

1. Copy the command.

1. Go to your command prompt or terminal, paste in the command, and then press **ENTER**.

1. Enter the password to sign in to the lab VM.

## Next steps

- [As a student, stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
