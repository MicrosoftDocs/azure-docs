---
title: Enable graphical remote desktop for Linux labs
titleSuffix: Azure Lab Services
description: Learn how to enable remote desktop for Linux virtual machines in a lab in Azure Lab Services.  
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 01/17/2023
---

# Enable graphical remote desktop for Linux virtual machines in Azure Lab Services

When you create a lab from a Linux image, Azure Lab Services automatically configures SSH (Secure Shell) access to let a lab creator, such as an educator, connect to the template VM from the command line. After you publish the template VM, lab users can then also connect to their VMs using SSH. You can also connect to a Linux VM using a GUI (graphical user interface). This article shows the steps to set up GUI connections using Remote Desktop Protocol (RDP) and X2Go.

> [!NOTE]
> Linux uses an open-source version of RDP called, [Xrdp](https://en.wikipedia.org/wiki/Xrdp). For simplicity, we use the term RDP throughout this article.

In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance. If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying X2Go for improved performance.

> [!IMPORTANT]
> Some marketplace images already have a graphical desktop environment and remote desktop server installed. For example, the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) already has [XFCE and X2Go Server installed and configured to accept client connections](../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md#x2go).

> [!WARNING]
> If you need to use [GNOME](https://www.gnome.org/) or [MATE](https://mate-desktop.org/), ensure you have properly configured your lab VM. There is a known networking conflict that can occur with the Azure Linux Agent, which is needed for the VMs to work properly in Azure Lab Services. Instead, we recommend using a different graphical desktop environment, such as [XFCE](https://www.xfce.org/).

## Setting up X2Go

To use X2Go, the lab creator must perform the following steps on the lab template VM:

- Install the X2Go remote desktop server.
- Install a Linux graphical desktop environment.

X2Go uses the same port that as SSH, which is already enabled by Azure Lab Services.  As a result, no extra configuration is required during lab creation.

> [!NOTE]
> In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance.  If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying X2Go instead.

### Install X2Go Server on the template VM

For optimal performance, we recommend using the XFCE graphical desktop and for users to connect to the desktop using X2Go.

1. Follow these instructions to [prepare for updating the template VM](how-to-create-manage-template.md#update-a-template-vm).

1. Install X2Go Server in either of two ways:

    - Follow these steps to [configure X2Go on Ubuntu by using a script](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce).

    - Alternately, [manually install X2Go Server](https://wiki.x2go.org/doku.php/doc:installation:x2goserver).
    
        There are many graphical desktop environments available for Linux. Some options include  [GNOME](https://www.gnome.org/), [MATE](https://mate-desktop.org/), [XFCE](https://www.xfce.org/), and [Xubuntu](https://xubuntu.org/).

## Connect using X2Go client

To connect to a VM that has X2Go configured, you can use the X2Go client software and the SSH information of the VM. Follow these steps to [connect to a VM by using the X2Go client](connect-virtual-machine-linux-x2go.md).

## RDP Setup

To use RDP to connect to a lab VM, the lab creator must:

- Enable remote desktop connection in Azure Lab Services
- Install the RDP remote desktop server.
- Install a Linux graphical desktop environment.

### Enable RDP connection in a lab

RDP uses network port 3389 for connecting to a VM. By default, Linux VMs only have the SSH port opened.

Follow theses steps to allow port 3389 to be open for connecting to Linux VMs with RDP:

1. During lab creation, enable the **Enable Remote Desktop Connection** setting.

    The educator must enable this option to open the port on the Linux VM that is needed for an RDP remote desktop session. If this option is left disabled, only the port for SSH is opened.
  
    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enable-rdp-option.png" alt-text="Screenshot that shows the New lab window with the Enable Remote Desktop Connection option.":::

1. On the **Enabling Remote Desktop Connection** message box, select **Continue with Remote Desktop**.
  
    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enabling-remote-desktop-connection-dialog.png" alt-text="Screenshot that shows the Enable Remote Desktop Connection confirmation window.":::

### Install RDP on the template VM

If you want to set up the GNOME with RDP on Ubuntu, see [Install and configure GNOME/RDP](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate). These instructions handle known issues with that configuration.  

To install the RDP package on the template VM, see [Install and configure RDP](../virtual-machines/linux/use-remote-desktop.md). There are many graphical desktop environments available for Linux. Some options include [GNOME](https://www.gnome.org/), [MATE](https://mate-desktop.org/), [XFCE](https://www.xfce.org/), and [Xubuntu](https://xubuntu.org/).

## Connect using RDP client

You can use the Microsoft RDP client to connect to a template VM that has RDP configured. The Remote Desktop client can be used on Windows, Chromebooks, Macs and more. For more information, see [Remote Desktop clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).

For OS-specific instructions for connecting to a lab VM using RDP, see [Connect to a Linux lab VM using RDP](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-rdp).

## Troubleshooting

### Using GNOME or MATE graphical desktops

For the GNOME or MATE graphical desktop environments, you may come across a networking conflict with the Azure Linux Agent. The Azure Linux Agent is needed for the VMs to work properly in Azure Lab Services. This networking conflict causes the following side effects when Ubuntu 18.04 LTS is used with either GNOME or MATE installed:

- Lab creation using the image will fail with the error message, **Communication could not be established with the VM agent.  Please verify that the VM agent is enabled and functioning.**  
- Publishing student VMs will stop responding if the auto-shutdown settings are enabled.
- Resetting the student VM password will stop responding.

To set up the GNOME or MATE graphical desktops on Ubuntu, see [Install and configure GNOME/RDP and MATE/X2go](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate). These instructions include a fix for the networking conflict that exists with Ubuntu 18.04 LTS. The scripts also support installing GNOME and MATE on Ubuntu 20.04 LTS and 21.04 LTS.

### Using RDP with Ubuntu

In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance. If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying [X2Go](#setting-up-x2go) for improved performance.

## Next steps

You've now successfully configured RDP or X2Go for a Linux-based template VM.

- Learn how you can [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) to create student lab VMs based on this template.
