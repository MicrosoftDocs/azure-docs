---
title: How to connect to an Azure Lab Services VM | Microsoft Docs
description: Learn how to connect to a VM in Azure Lab Services
services: lab-services
ms.topic: how-to
ms.date: 02/1/2022
---

# Connect to a lab VM

As a student, you'll need to [start](how-to-use-lab.md#start-or-stop-the-vm) and then connect to your lab VM to complete your lab work.  How you connect to your VM will depend on the operating system (OS) of the machine your using and the OS of the VM your connecting to.  

## Connect to a Windows lab VM

If connecting *to a Windows VM*, follow the instructions based on the type of OS you're using.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | [Connect to a VM using RDP on Windows](connect-virtual-machine-windows-rdp.md). |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md). |
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

## Connect to a Linux lab VM

This section shows students how to connect to a Linux VM in a lab using secure shell protocol (SSH), remote desktop protocol (RDP), or X2Go.  

SSH is configured automatically for Linux VMs.  Both students and educators can SSH into Linux VMs without any extra setup.  However, if students need to connect to using a GUI, the educators may need to do extra setup on the template VM.

> [!WARNING]
> If you need to use [GNOME](https://www.gnome.org/) or [MATE](https://mate-desktop.org/) you should coordinate with your educator to ensure your lab VM is properly configured. For details, see [Using GNOME or MATE graphical desktops](how-to-enable-remote-desktop-linux.md#using-gnome-or-mate-graphical-desktops).

### Connect to a Linux lab VM Using RDP

An educator must first [enable remote desktop connection for Linux VMs](how-to-enable-remote-desktop-linux.md#rdp-setup).

To connect *to a Linux VM using RDP*, follow the instructions based on the type of OS you're using.

| Client OS | Instructions |
| --------- | ------------ |
| Windows | [Connect to a VM using RDP on Windows](connect-virtual-machine-windows-rdp.md). |
| Mac | [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md).|
| Chromebook | [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md). |

### Connect to a Linux lab VM Using X2Go

Linux VMs can have X2Go enabled and a graphical desktop installed.  For more information, see [X2Go Setup](how-to-enable-remote-desktop-linux.md#x2go-setup) and [Using GNOME or MATE graphical desktops](how-to-enable-remote-desktop-linux.md#using-gnome-or-mate-graphical-desktops).  

For instructions to connect *to a Linux VM using X2Go*, see [Connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).

### Connect to a Linux lab VM using SSH

By default Linux VMs have SSH installed. To connect *to a Linux VM using SSH*, do the following actions:

1. If using a Windows machine to connect to a Linux VM, first install an ssh client like [PuTTY](https://www.putty.org/) or enable [OpenSSH in Windows](/windows-server/administration/openssh/openssh_install_firstuse).
1. [Start the VM](how-to-use-lab.md#start-or-stop-the-vm), if not done already.
1. Once the VM is running, select **Connect**, which will show a dialog box that provides the SSH command string.  The connection command will look like the following sample:

    ```bash
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

1. Copy the command.
1. Go to your command prompt or terminal, paste in the command, and then press **ENTER**.
1. Enter the password to sign in to the lab VM.

## Next steps

- [As a student, stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
