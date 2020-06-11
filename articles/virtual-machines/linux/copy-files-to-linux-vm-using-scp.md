---
title: Move files to and from Azure Linux VMs with SCP 
description: Securely move files to and from a Linux VM in Azure using SCP and an SSH key pair.
author: cynthn
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.topic: how-to
ms.date: 07/12/2017
ms.author: cynthn
ms.subservice: disks
---

# Move files to and from a Linux VM using SCP

This article shows how to move files from your workstation up to an Azure Linux VM, or from an Azure Linux VM down to your workstation, using Secure Copy (SCP). Moving files between your workstation and a Linux VM, quickly and securely, is critical for managing your Azure infrastructure. 

For this article, you need a Linux VM deployed in Azure using [SSH public and private key files](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). You also need an SCP client for your local computer. It is built on top of SSH and included in the default Bash shell of most Linux and Mac computers and some Windows shells.

## Quick commands

Copy a file up to the Linux VM

```bash
scp file azureuser@azurehost:directory/targetfile
```

Copy a file down from the Linux VM

```bash
scp azureuser@azurehost:directory/file targetfile
```

## Detailed walkthrough

As examples, we move an Azure configuration file up to a Linux VM and pull down a log file directory, both using SCP and SSH keys.   

## SSH key pair authentication

SCP uses SSH for the transport layer. SSH handles the authentication on the destination host, and it moves the file in an encrypted tunnel provided by default with SSH. For SSH authentication, usernames and passwords can be used. However, SSH public and private key authentication are recommended as a security best practice. Once SSH has authenticated the connection, SCP then begins copying the file. Using a properly configured `~/.ssh/config` and SSH public and private keys, the SCP connection can be established by just using a server name (or IP address). If you only have one SSH key, SCP looks for it in the `~/.ssh/` directory, and uses it by default to log in to the VM.

For more information on configuring your `~/.ssh/config` and SSH public and private keys, see [Create SSH keys](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## SCP a file to a Linux VM

For the first example, we copy an Azure configuration file up to a Linux VM that is used to deploy automation. Because this file contains Azure API credentials, which include secrets, security is important. The encrypted tunnel provided by SSH protects the contents of the file.

The following command copies the local *.azure/config* file to an Azure VM with FQDN *myserver.eastus.cloudapp.azure.com*. The admin user name on the Azure VM is *azureuser*. The file is targeted to the */home/azureuser/* directory. Substitute your own values in this command.

```bash
scp ~/.azure/config azureuser@myserver.eastus.cloudapp.com:/home/azureuser/config
```

## SCP a directory from a Linux VM

For this example, we copy a directory of log files from the Linux VM down to your workstation. A log file may or may not contain sensitive or secret data. However, using SCP ensures the contents of the log files are encrypted. Using SCP to transfer the files is the easiest way to get the log directory and files down to your workstation while also being secure.

The following command copies files in the */home/azureuser/logs/* directory on the Azure VM to the local /tmp directory:

```bash
scp -r azureuser@myserver.eastus.cloudapp.com:/home/azureuser/logs/. /tmp/
```

The `-r` flag instructs SCP to recursively copy the files and directories from the point of the directory listed in the command.  Also notice that the command-line syntax is similar to a `cp` copy command.

## Next steps

* [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
