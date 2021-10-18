---
title: Enable graphical remote desktop for Linux in Azure Lab Services | Microsoft Docs
description: Learn how to enable remote desktop for Linux virtual machines in a lab in Azure Lab Services.  
ms.topic: how-to
ms.date: 06/26/2020
---

# Enable graphical remote desktop for Linux virtual machines in Azure Lab Services
This article shows you how to do the following tasks:

- Enable graphical remote desktop sessions for a Linux VM
- How to connect to a Linux VM using RDP (Remote Desktop Protocol) or X2Go remote desktop clients

## Set up graphical remote desktop solution
When a lab is created from a **Linux** image, **SSH** (Secure Shell) access is automatically configured so that the instructor can connect to the template VM from the command line using SSH.  Likewise, when the template VM is published, students can also connect to their VMs using SSH.

To connect to a Linux VM using a **GUI** (graphical user interface), we recommend using either **RDP** or **X2Go**.  The rest of this article shows the steps to set up RDP or X2Go on a lab's template VM.

> [!NOTE]
> Linux uses an open-source version of RDP called, [Xrdp](https://en.wikipedia.org/wiki/Xrdp).  For simplicity, we use the term RDP throughout this article.

### RDP Setup
To use RDP, the instructor must:
  - Enable remote desktop connection; this is specifically needed to open the VM's port for RDP.
  - Install the RDP remote desktop server.
  - Install a Linux graphical desktop environment.

### X2Go Setup
To use X2Go, the instructor must:
- Install the X2Go remote desktop server.
- Install a Linux graphical desktop environment.

X2Go uses the same port that is already enabled for SSH.  As a result, no extra configuration required to open a port on the VM for X2Go.

> [!NOTE]
> In some cases, such as with Ubuntu LTS 18.04, X2Go provides better performance.  If you use RDP and notice latency when interacting with the graphical desktop environment, consider trying X2Go since it may improve performance.

> [!IMPORTANT]
>  Some marketplace images already have a graphical desktop environment and remote desktop server installed.  For example, the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) already has [XFCE and X2Go Server installed and configured to accept client connections](../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md#x2go).

## Enable remote desktop connection for RDP

This step is only needed to connect using RDP.  If instead you plan to use X2Go, you can skip to the next section since X2Go uses the SSH port.

1.  During lab creation, the instructor has the option to **Enable Remote Desktop Connection**.  The instructor must **enable** this option to open the port on the Linux VM that is needed for an RDP remote desktop session.  Otherwise, if this option is left **disabled**, only the port for SSH is opened.
  
    ![Screenshot that shows the "New lab" window with the "Enable Remote Desktop Connection" option.](./media/how-to-enable-remote-desktop-linux/enable-rdp-option.png)

2. On the **Enabling Remote Desktop Connection** message box, select **Continue with Remote Desktop**. 

    ![Enable remote desktop connection for a Linux image](./media/how-to-enable-remote-desktop-linux/enabling-remote-desktop-connection-dialog.png)

## Install RDP or X2Go

After the lab is created, the instructor needs to ensure that a graphical desktop environment and remote desktop server are installed on the template VM.  The instructor must first connect to the template VM using SSH to install the packages for:
- Either the RDP or X2Go remote desktop server.
- A graphical desktop environment, such as [GNOME](https://www.gnome.org/), [MATE](https://mate-desktop.org/), [XFCE](https://www.xfce.org/), [Xubuntu](https://xubuntu.org/), etc.

After this is set up, the instructor can connect to the template VM using either the **Microsoft Remote Desktop (RDP)** client or **X2Go** client.

Follow the below steps to set up the template VM:

1. If you see **Customize template** on the toolbar, select it. Then, select **Continue** on the **Customize template** dialog box. This action starts the template VM.  

    ![Customize template](./media/how-to-enable-remote-desktop-linux/customize-template.png)
1. After the template VM is started, you can select **Connect template** and then **Connect via SSH** on the toolbar. 

    ![Connect to template via RDP after the lab is created](./media/how-to-enable-remote-desktop-linux/rdp-after-lab-creation.png) 
1. You see the following **Connect to your virtual machine** dialog box. Select the **Copy** button next to the text box to copy it to the clipboard. Save the SSH connection information. Use this connection information from an SSH terminal (like [Putty](https://www.putty.org/)) to connect to the virtual machine.
 
    ![SSH connection string](./media/how-to-enable-remote-desktop-linux/ssh-connection-string.png)

4. Finally, install either RDP or X2Go along with the graphical desktop environment of your choice.

For optimal performance, we typically recommend using the XFCE graphical desktop and for users to connect to the desktop using X2Go.  To set up XFCE with X2Go on Ubuntu, use the following instructions:
  - [Install and configure X2Go](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Scripts/LinuxGraphicalDesktopSetup/XFCE_Xubuntu/ReadMe.md)

In cases where you instead need to have users connect to the graphical desktop with RDP, use the following instructions for Ubuntu:
  - [Install and configure RDP](../virtual-machines/linux/use-remote-desktop.md)

For the GNOME or MATE graphical desktop environments, you may encounter a networking conflict with the Azure Linux Agent which is needed for the VMs to work properly in Azure Lab Services.  For example, by default if you create a lab from an Ubuntu 18.04 LTS image that has GNOME or MATE installed, lab creation will fail with the following error message: **Communication could not be established with the VM agent.  Please verify that the VM agent is enabled and functioning.**  Likewise, this networking conflict will cause publish to hang when attempting to provision the student VMs.

We recommend using the following instructions to set up the GNOME or MATE graphical desktops on Ubuntu.  These instructions include a fix for the networking conflict that exists with Ubuntu 18.04 LTS.  They also support Ubuntu 20.04 LTS and 21.04 LTS:
 - [Install and configure GNOME/RDP and MATE/X2go](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Scripts/LinuxGraphicalDesktopSetup/GNOME_MATE/ReadMe.md)

## Connect to the template VM via the GUI

After the template VM is set up, the instructor can connect via the GUI using either the **Microsoft Remote Desktop (RDP)** client or **X2Go** client.  The client that you use depends on if RDP or X2Go is configured as the remote desktop server on the template VM.  

### Microsoft Remote Desktop (RDP) client

The Microsoft Remote Desktop (RDP) client is used to connect to a template VM that has RDP configured.  The Remote Desktop client can be used on Windows, Chromebooks, Macs and more.  Refer to the article on [Remote Desktop clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients) for further details.

Follow the below steps based on the type of computer used to connect to the template VM:

- Windows
  1. Click **Connect to template** on your lab's toolbar and select **Connect via RDP** to connect to the template VM. 
  1. Save the RDP file and use it to connect to the template VM using the Remote Desktop client. 
  1. Typically, the Remote Desktop client is already installed and configured on Windows.  As a result, all you need to do is click on the RDP file to open it and start the remote session.

- Mac
  1. Click **Connect to template** on your lab's toolbar and then select **Connect via RDP** to save the RDP file.  
  1. Then, refer to the how-to article [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-remote-desktop.md).

- Chromebook
  1. Click **Connect to template** on your lab's toolbar and then select **Connect via RDP** to save the RDP file.  
  1. Then, refer to the how-to article [Connect to a VM using RDP on a Chromebook](connect-virtual-machine-chromebook-remote-desktop.md).

### X2Go client

The X2Go client is used to connect to a template VM that has X2Go configured.  Using the template VM's SSH connection information, follow the steps in the how-to article [Connect to a VM using X2Go](how-to-use-remote-desktop-linux-student.md#connect-to-the-student-vm-using-x2go).

## Next steps
After an instructor sets up either RDP or X2Go on their template VM and publishes, students can connect to their VMs via the GUI remote desktop or SSH.

For more information, see:
 - [Connect to a Linux VM](how-to-use-remote-desktop-linux-student.md)