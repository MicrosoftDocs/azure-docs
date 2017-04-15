---
title: Moving files to and from a Linux VM using SCP | Microsoft Docs
description: Securely moving files to and from a Linux VM using SCP and an SSH key pair.
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
ms.date: 12/14/2016
ms.author: v-livech

---

# Moving files to and from a Linux VM using SCP

This article shows how to move files from your workstation up to an Azure Linux VM, or from an Azure Linux VM down to your workstation, using Secure Copy (SCP).  For an example, we are moving Azure configuration files up to a Linux VM and pulling down a log file directory, both using SCP and SSH keys.   

For this article, the requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quick commands

Copy a file up to the Linux VM

```bash
scp file user@host:directory/targetfile
```

Copy a file down from the Linux VM

```bash
scp user@host:directory/file targetfile
```

## Detailed walkthrough

Moving files back and forth between your workstation and a Linux VM, quickly and securely, is a critical part of managing your Azure infrastructure.  For this article we walk through using SCP, a tool built on top of SSH, and included in the default Bash shell of Linux, Mac and Windows.

## SSH key pair authentication

SCP uses SSH for the transport layer.  By using SSH for the transport, SSH handles the authentication on the destination host while also moving the file in an encrypted tunnel provided by default with SSH.  For SSH authentication, usernames and passwords can be used but SSH public and private key authentication are strongly recommended as a security best practice. Once SSH has authenticated the connection, SCP then begins the process of copying the file.  Using a properly configured `~/.ssh/config` and SSH public and private keys, the SCP connection can be established without using a username and just using a server name.  If you only have one SSH key, SCP will look for it in the `~/.ssh/` directory, and use it by default to login to the VM.

For more information on configuring your `~/.ssh/config` and SSH public and private keys, follow this article, [Create SSH keys](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## SCP a file to a Linux VM

For the first example, we are copying an Azure credential file up to a Linux VM that is used to deploy automation.  Because this file contains Azure API credentials, which include secrets, security is important and the encrypted tunnel SSH provides, protects the contents of the file.

```bash
scp ~/.azure/credentials myserver:/home/ahmet/.azure/credentials
```

## SCP a directory from a Linux VM

For this example, we are copying a directory full of log files from the Linux VM down to your workstation.  A log file may or may not contain sensitive or secret data and using SCP ensures the contents of the log files is encrypted.  Using SCP to securely transfer the files is the easiest way to get the log directory and files down to your workstation while also being secure.

```bash
scp -r myserver:/home/ahmet/logs/ /tmp/.
```

The `-r` cli flag instructs SCP to recursively copy the files and directories from the point of the directory listed in the command.  Also notice that the command-line syntax is similar to a `cp` copy command.

## Next steps

* [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Disable SSH passwords on your Linux VM by configuring SSHD](mac-disable-ssh-password-usage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
