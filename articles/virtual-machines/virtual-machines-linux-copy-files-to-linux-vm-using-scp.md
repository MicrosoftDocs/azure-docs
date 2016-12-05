---
title: Copy files to a Linux VM using SCP | Microsoft Docs
description: Copy files to a Azure Linux VM using SCP.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 12/05/2016
ms.author: v-livech

---

# Copy files to a Linux VM using SCP

This article shows how to copy files from your workstation up to an Azure Linux VM, or from the Azure Linux VM down to your workstation, using SCP.  SCP is based on the BSD RCP protocol.  SCP uses SSH for the transport layer.  By using SSH for the transport, SCP uses SSH for authentication on the destination host while also moving the file in an encrypted tunnel provided by default by SSH.  SCP is a secure and easy way to move files to and from Azure Linux VMs as it  uses the existing SSH authentication that is already configured on the Linux VM.  For SSH authentication, usernames and passwords can be used but SSH public and private key authentication are strongly suggested as a security best practice.  

For this article, the requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quick commands

Copy file up to the Linux VM

```bash
scp file user@host:directory/targetfile
```

Copy file down from the Linux VM

```bash
scp user@host:directory/file targetfile
```

## Detailed walkthrough

Moving files up and down from your Azure Linux VMs to your local workstation is a common task that requires security best practices along with making it convenient.  For the best security and convenience, SSH public and private keys are the best way to authenticate the SCP connection.  Once SSH has authenticated the connection, SCP then begins the process of copying the file.  Using a properly configured `~/.ssh/config` and SSH public and private keys, the SCP connection can be established without using a username and just a server name.  For more information on configuring your `~/.ssh/config` and SSH public and private keys, follow this article, [Create SSH keys on Linux and Mac for Linux VMs in Azure](virtual-machines-linux-mac-create-ssh-keys?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## SCP a file to a Linux VM

For the first example, we are copying an Azure credential file up to a Linux VM that is used to deploy automation.  Because this file contains Azure API credentials, which include secrets, security is important and the encrypted tunnel of SSH protects the contents of the file.

```bash
scp ~/.azure/credentials myserver:/home/ahmet/.azure/credentials
```

## SCP a directory from a Linux VM

For this example, we are copying a directory full of log files from the Linux VM down to your workstation.  A log file may or may not contain sensitive or secret data and using SCP ensures the contents of the log files is encrypted.  Using SCP to securely transfer the files is the easiest way to get the log directory and files down to your workstation while also being secure.

```bash
scp -r myserver:/home/ahmet/logs/ /tmp/.
```

The `-r` cli flag instructs SCP to recursively copy the files and directories from the point of the directory listed in the command.  Also notice that the command-line syntax is similar to a `cp` copy command.

Next steps:

* [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](virtual-machines-linux-using-vmaccess-extension?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Disable SSH passwords on your Linux VM by configuring SSHD](virtual-machines-linux-mac-disable-ssh-password-usage?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)















x
