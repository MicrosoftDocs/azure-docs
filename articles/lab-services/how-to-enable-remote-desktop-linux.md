---
title: Enable graphical remote desktop for Linux in Azure Lab Services | Microsoft Docs
description: Learn how to enable remote desktop for Linux virtual machines in a lab in Azure Lab Services.  
ms.topic: how-to
ms.date: 01/04/2022
---

# Enable graphical remote desktop for Linux virtual machines in Azure Lab Services

When a lab is created from a **Linux** image, **SSH** (Secure Shell) access is automatically configured so that the educator can connect to the template VM from the command line.  When the template VM is published, students can also connect to their VMs using SSH.

You can also connect to a Linux VM using a **GUI** (graphical user interface). This article shows the steps to set up GUI connections using **Remote Desktop Protocol (RDP)** and **X2Go** .  

> [!NOTE]
> Linux uses an open-source version of RDP called, [Xrdp](https://en.wikipedia.org/wiki/Xrdp).  For simplicity, we use the term RDP throughout this article.

In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance.  If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying X2Go since it may improve performance.

> [!IMPORTANT]
> Some marketplace images already have a graphical desktop environment and remote desktop server installed.  For example, the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) already has [XFCE and X2Go Server installed and configured to accept client connections](../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md#x2go).

> [!WARNING]
> If you need to use [GNOME](https://www.gnome.org/) or [MATE](https://mate-desktop.org/), ensure your lab VM is properly configured.  There is a known networking conflict that can occur with the Azure Linux Agent which is needed for the VMs to work properly in Azure Lab Services.  Instead, we recommend using a different graphical desktop environment, such as [XFCE](https://www.xfce.org/).

## X2Go Setup

To use X2Go, the educator must:

- Install the X2Go remote desktop server.
- Install a Linux graphical desktop environment.

X2Go uses the same port that is already enabled for SSH.  As a result, no extra configuration is required during lab creation.

> [!NOTE]
> In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance.  If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying X2Go since it may improve performance.

### Install X2Go Server on the template VM

To set up X2Go on a template VM, first  follow instructions to [update the template VM](how-to-create-manage-template.md#update-a-template-vm).

For optimal performance, we typically recommend using the XFCE graphical desktop and for users to connect to the desktop using X2Go.  To set up XFCE with X2Go on Ubuntu, see [Install and configure X2Go](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce).  

To manually install X2Go Server, see [X2Go Server Installation](https://wiki.x2go.org/doku.php/doc:installation:x2goserver).  There are many graphical desktop environments available for Linux.  Some options include  [GNOME](https://www.gnome.org/), [MATE](https://mate-desktop.org/), [XFCE](https://www.xfce.org/), and [Xubuntu](https://xubuntu.org/).

## Connect using X2Go client

Educators and students use X2Go client is used to connect to a VM that has X2Go configured.  Using the VM's SSH connection information, follow the steps in the how-to article [Connect to a VM using X2Go](connect-virtual-machine-linux-x2go.md).

## RDP Setup

To use RDP, the educator must:

- Enable remote desktop connection in Azure Lab Services
- Install the RDP remote desktop server.
- Install a Linux graphical desktop environment.

### Enable RDP connection in a lab

This step is needed so Azure Lab Services opens port 3389 for RDP to the Linux VMs.  By default, Linux VMs only have the SSH port opened.

1. During lab creation, the educator can **Enable Remote Desktop Connection**.  The educator must **enable** this option to open the port on the Linux VM that is needed for an RDP remote desktop session.  Otherwise, if this option is left **disabled**, only the port for SSH is opened.
  
    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enable-rdp-option.png" alt-text="Screenshot that shows the New lab window with the Enable Remote Desktop Connection option.":::
1. On the **Enabling Remote Desktop Connection** message box, select **Continue with Remote Desktop**.
  
    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enabling-remote-desktop-connection-dialog.png" alt-text="Screenshot that shows the Enable Remote Desktop Connection confirmation window.":::

### Install RDP on the template VM

If you want to set up the GNOME with RDP on Ubuntu, see [Install and configure GNOME/RDP](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate). These instructions handle known issues with that configuration.  

To install the RDP package on the template VM, see [Install and configure RDP](../virtual-machines/linux/use-remote-desktop.md).  There are many graphical desktop environments available for Linux.  Some options include  [GNOME](https://www.gnome.org/), [MATE](https://mate-desktop.org/), [XFCE](https://www.xfce.org/), and [Xubuntu](https://xubuntu.org/).

## Connect using RDP client

The Microsoft RDP client is used to connect to a template VM that has RDP configured.  The Remote Desktop client can be used on Windows, Chromebooks, Macs and more.  For more information, see [Remote Desktop clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).

For OS-specific instructions for connecting to a lab VM using RDP, see [Connect to a Linux lab VM using RDP](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-rdp).

## Troubleshooting

### Using GNOME or MATE graphical desktops

For the GNOME or MATE graphical desktop environments, you may come across a networking conflict with the Azure Linux Agent.  The Azure Linux Agent is needed for the VMs to work properly in Azure Lab Services.  This networking conflict causes the following side effects when Ubuntu 18.04 LTS is used with either GNOME or MATE installed:

- Lab creation using the image will fail with the error message, **Communication could not be established with the VM agent.  Please verify that the VM agent is enabled and functioning.**  
- Publishing student VMs will stop responding if the auto-shutdown settings are enabled.
- Resetting the student VM password will stop responding.

To set up the GNOME or MATE graphical desktops on Ubuntu, see [Install and configure GNOME/RDP and MATE/X2go](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate).  These instructions include a fix for the networking conflict that exists with Ubuntu 18.04 LTS.  The scripts also support installing GNOME and MATE on Ubuntu 20.04 LTS and 21.04 LTS:

### Using RDP with Ubuntu

In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance.  If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying [X2Go](#x2go-setup) since it may improve performance.

## Next steps

After an educator configures either RDP or X2Go on their template VM, they can [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm).
