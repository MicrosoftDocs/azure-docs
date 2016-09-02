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
FreeBSD for Microsoft Azure is provided by Microsoft Corporation. FreeBSD is an advanced computer operating system used to power modern servers, desktops, and embedded platforms.
The FreeBSD 10.3 image is available in Azure. It is based on the FreeBSD 10.3 release, and Azure VM Guest Agent [2.1.4](https://github.com/Azure/WALinuxAgent/releases/tag/v2.1.4) is installed. The Agent is responsible for communication between the FreeBSD VM and the Azure fabric for operations, such as provisioning the VM on first use (user name, password, host name, etc.) and enabling functionality for selective VM extensions.
As for future versions of FreeBSD, the strategy is to stay current and make the latest releases available shortly after they are released by the FreeBSD release engineering team. The upcoming release is [FreeBSD 11](https://www.freebsd.org/releases/11.0R/schedule.html).

## Deploy a FreeBSD virtual machine
Deploying a FreeBSD virtual machine is a straightforward process using an image from the [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/).

## VM extension for FreeBSD
Following are supported VM extensions in FreeBSD VM.

• [VMAccess](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess)

The VMAccess extension can:

- Reset the password of the original sudo user.
- Create a new sudo user with the password specified.
- Set the public host key with the key given.
- Reset the public host key provided during VM provisioning if the host key is not provided.
- Open the SSH port (22) and restore the sshd_config if reset_ssh is set to true.
- Remove the existing user.
- Check drives.
- Repair an added drive.

• [CustomSript](https://github.com/Azure/azure-linux-extensions/tree/master/CustomScript)

The CustomScript Extension can:

- If provided, download the customized scripts from Azure Storage or external public storage such as Github.
- Run the entry point script.
- Support inline commands.
- Convert Windows style newline in shell and Python scripts automatically.
- Remove BOM in shell and Python scripts automatically.
- Protect sensitive data in CommandToExecute.

## Authentication: user names, passwords, and SSH keys
When creating a FreeBSD virtual machine using the Azure classic portal, you are asked to provide a user name, password, or an SSH public key.
User names for deploying a FreeBSD virtual machine on Azure are subject to the following constraint: names of system accounts (UID <100) already present in the virtual machine are not allowed ('root' for example).
Currently, only RSA SSH key is supported. Multiline SSH key must begin with ---- BEGIN SSH2 PUBLIC KEY
---- and end with ---- END SSH2 PUBLIC KEY ----.

## Obtain superuser privileges
The user account that is specified during virtual machine instance deployment on Azure is a privileged account. The package of sudo was installed in the published FreeBSD image.
Once logged in using this user account, you can to run commands as root using the command syntax.

    # sudo <COMMAND>

You can optionally obtain a root shell using sudo -s.

## Next steps
- Go to [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/) to create a FreeBSD VM.
- If you want to bring your own FreeBSD to Azure, refer to [Create and upload a FreeBSD VHD to Azure](../virtual-machines-linux-classic-freebsd-create-upload-vhd.md).
