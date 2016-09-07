<properties
   pageTitle="Introduction to FreeBSD on Azure | Microsoft Azure"
   description="Learn about using FreeBSD virtual machines on Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="KylieLiang"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="08/27/2016"
   ms.author="kyliel"/>

# Introduction to FreeBSD on Azure
This topic provides an overview of running a FreeBSD virtual machine in Azure.

## Overview
FreeBSD for Microsoft Azure is an advanced computer operating system used to power modern servers, desktops, and embedded platforms. The FreeBSD 10.3 image is provided by Microsoft Corporation and is available in Azure. It is based on the FreeBSD 10.3 release, and Azure VM Guest Agent [2.1.4](https://github.com/Azure/WALinuxAgent/releases/tag/v2.1.4) is installed. The agent is responsible for communication between the FreeBSD VM and the Azure fabric for operations, such as provisioning the VM on first use (user name, password, host name, etc.) and enabling functionality for selective VM extensions.
As for future versions of FreeBSD, the strategy is to stay current and make the latest releases available shortly after they are released by the FreeBSD release engineering team. The upcoming release is [FreeBSD 11](https://www.freebsd.org/releases/11.0R/schedule.html).

## Deploying a FreeBSD virtual machine
Deploying a FreeBSD virtual machine is a straightforward process using an image from the [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/).

## VM extensions for FreeBSD
Following are supported VM extensions in FreeBSD.

### VMAccess

The [VMAccess](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) extension can:

- Reset the password of the original sudo user.
- Create a new sudo user with the password specified.
- Set the public host key with the key given.
- Reset the public host key provided during VM provisioning if the host key is not provided.
- Open the SSH port (22) and restore the sshd_config if reset_ssh is set to true.
- Remove the existing user.
- Check disks.
- Repair an added disk.

### CustomScript

The [CustomScript](https://github.com/Azure/azure-linux-extensions/tree/master/CustomScript) extension can:

- If provided, download the customized scripts from Azure Storage or external public storage (for example, GitHub).
- Run the entry point script.
- Support inline commands.
- Convert Windows-style newline in shell and Python scripts automatically.
- Remove BOM in shell and Python scripts automatically.
- Protect sensitive data in CommandToExecute.

## Authentication: user names, passwords, and SSH keys
When you're creating a FreeBSD virtual machine by using the Azure portal, you must provide a user name, password, or SSH public key.
User names for deploying a FreeBSD virtual machine on Azure must not match names of system accounts (UID <100) already present in the virtual machine ("root," for example).
Currently, only the RSA SSH key is supported. A multiline SSH key must begin with "---- BEGIN SSH2 PUBLIC KEY
----" and end with "---- END SSH2 PUBLIC KEY ----".

## Obtaining superuser privileges
The user account that is specified during virtual machine instance deployment on Azure is a privileged account. The package of sudo was installed in the published FreeBSD image.
After you're logged in through this user account, you can run commands as root by using the command syntax.

    # sudo <COMMAND>

You can optionally obtain a root shell by using sudo -s.

## Next steps
- Go to [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/) to create a FreeBSD VM.
- If you want to bring your own FreeBSD to Azure, refer to [Create and upload a FreeBSD VHD to Azure](../virtual-machines-linux-classic-freebsd-create-upload-vhd.md).
