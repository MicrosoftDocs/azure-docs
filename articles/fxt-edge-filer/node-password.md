---
title: 'Tutorial: Initialize hardware - Azure FXT Edge Filer'
description: Learn how to connect to the hardware node and set an initial password on Azure FXT Edge Filer nodes. 
author: femila
ms.author: femila
ms.service: fxt-edge-filer
ms.topic: tutorial
ms.date: 06/20/2019
---

# Tutorial: Set hardware passwords

The first time you power up an Azure FXT Edge Filer node, you must set a root password. The hardware nodes are not shipped with a default password.

Network ports are disabled until after the password is set and the root user signs in.

Do this step after installing and cabling the node, but before attempting to create the cluster.

This tutorial explains how to connect to the hardware node and set the password. It also describes how to add a BIOS setup password to help secure the node.

In this tutorial, you will learn how to:

> [!div class="checklist"]
>
> * Connect a keyboard and monitor to the node and power it on
> * Set a BIOS setup password
> * Set passwords for the iDRAC port and root user on this node
> * Sign in as root

Repeat these steps for each node that you will use in your cluster.

This tutorial takes approximately 15 minutes to complete.

## Prerequisites

Before starting this tutorial, complete these steps:

* [Install](install.md) each Azure FXT Edge Filer node in an equipment rack, and attach power cables and network access as described in the [earlier tutorial](network-power.md).
* Find a USB-connected keyboard and a VGA-connected monitor that you can attach to the hardware nodes. (The node's serial port is inactive before you set the password.)

## Connect a keyboard and monitor to the node

Physically connect a monitor and keyboard to the Azure FXT Edge Filer node.

* Connect the monitor to the VGA port.
* Connect the keyboard to one of the USB ports.

Use this reference diagram to locate the ports on the back of the chassis.

> [!NOTE]
> The serial port is inactive until after the password is set.

![diagram of back of Azure FXT Edge Filer with serial, VGA, and USB ports labeled](media/fxt-back-serial-vga-usb.png)

You can use a KVM switch if you want to connect more than one node to the same peripherals.

Power on the node by pressing the power button on the front.

![diagram of front of Azure FXT Edge Filer - round power button is labeled near the top right](media/fxt-front-annotated.png)

## Create a BIOS setup password

A BIOS setup password protects the node's BIOS settings from accidental or unauthorized changes. This password is not needed to create a cluster, but it is strongly recommended as part of your cluster security strategy.

To create a BIOS setup password:

1. Turn on or restart the node, and immediately press F2 to open the system setup utility.

1. On the **System Setup Main Menu** screen, choose **System BIOS** > **System Security**.

1. Make sure that the **Password Status** setting is **Unlocked**.

1. Use the **Setup Password** field to set the password. (You can also set a system BIOS password from this screen if you want to use one.)

1. Press Esc to return to the **System BIOS** screen, then press Esc again. A message prompts you to save the changes. If the system does not restart automatically, restart it to get to the regular startup screen.<!-- how to exit this mode/do you need to reboot to get to the initial setup screen? -->

## Set initial passwords

The Azure FXT Edge Filer node will print various messages to the monitor while booting. After a few moments, it shows an initial setup screen like this:

```
------------------------------------------------------
        Microsoft FXT node initial setup
------------------------------------------------------
Password Setup
---------------
Enter a password to set the iDRAC and temporary root password.
Minimum password length is 8.

NOTE: This does not set a BIOS setup password. For security,
Microsoft recommends using a BIOS setup password, restricting
physical access to the node, and other measures. Learn more at
https://aka.ms/fxt-security.

Enter new password:

```

The password you enter is used for two things:

* It is the temporary root password for this Azure FXT Edge Filer node.

  This password will change when you create a cluster using this node, or when you add this node to the cluster. The cluster management password (associated with the user ``admin``) is also the root password for all nodes in a cluster.

* It is the long-term password for the iDRAC/IPMI hardware management port.

  Make sure you remember the password in case you need to sign in with IPMI later to troubleshoot a hardware problem.

Enter and confirm the password:

```
Enter new password:**********
Re-enter password:**********
Loading AvereOS......
```

After you enter the password, the system continues booting. When it finishes, it gives a ``login:`` prompt.

## Sign in as root

Sign in as ``root`` with the password that you just set.

```
login: root
Password:**********
```

After you sign in as root, the network ports are active and will contact the DHCP server for IP addresses.

## Next steps

The node is ready to be part of a cluster. You can use it to create the Azure FXT Edge Filer cluster, or you can [add it to an existing cluster](add-nodes.md).

> [!div class="nextstepaction"]
> [Create a cluster](cluster-create.md)
