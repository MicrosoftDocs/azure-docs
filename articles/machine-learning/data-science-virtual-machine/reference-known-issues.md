---
title: 'Reference: Known issues & troubleshooting'
titleSuffix: Azure Data Science Virtual  Machine
description: Get a list of the known issues, workarounds, and troubleshooting for Azure Data Science Virtual Machine
services: machine-learning
ms.service: data-science-vm

author: timoklimmer
ms.author: tklimmer
ms.topic: reference
ms.date: 05/27/2021


---

# Known issues and troubleshooting the Azure Data Science Virtual Machine

This article helps you find and correct errors or failures you might come across when using the Azure Data Science Virtual Machine.

## Prompted for password when running sudo command (Ubuntu)

When running a `sudo` command on an Ubuntu machine, you might be asked to enter your password again to confirm that you
are really the user who is logged in. This is expected behavior and the default in Linux systems such as Ubuntu.
However, in some scenarios, a repeated authentication is not necessary and rather annoying.

To disable re-authentication for most cases, you can run the following command in a terminal.

`echo -e "\n$USER ALL=(ALL) NOPASSWD: ALL\n" | sudo tee -a /etc/sudoers`

After restarting the terminal, sudo will not ask for another login and will consider the authentication from your
session login as sufficient.

## Accessing SQL Server (Windows)

When you try to connect to the pre-installed SQL Server instance, you might encounter a "login failed" error. To
successfully connect to the SQL Server instance, you need to run the program you are connecting with, eg. SQL Server
Management Studio (SSMS), in administrator mode. The administrator mode is required because by DSVM's default, only
administrators are allowed to connect.

## Python package installation issues

### Installing packages with pip breaks dependencies on Linux

Use `sudo pip install` instead of `pip install` when installing packages.

## Disk encryption issues

### Disk encryption fails on the Ubuntu DSVM

Azure Disk Encryption (ADE) isn't currently supported on the Ubuntu DSVM. As a workaround, consider configuring [Server Side Encryption of Azure managed disks](../../virtual-machines/disk-encryption.md).

## Tool appears disabled

### Hyper-V does not work on the Windows DSVM

That Hyper-V initially doesn't work on Windows is expected behavior. For boot performance, we've disabled some services. To enable Hyper-V:

1. Open the search bar on your Windows DSVM
1. Type in "Services,"
1. Set all Hyper-V services to "Manual"
1. Set "Hyper-V Virtual Machine Management" to "Automatic"

Your final screen should look like this:

   ![Enable Hyper-V](./media/workaround/hyperv-enable-dsvm.png)