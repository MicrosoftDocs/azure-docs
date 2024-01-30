---
title: Use SCP to move files to and from a VM
description: Securely move files to and from a Linux VM in Azure using SCP and an SSH key pair.
author: mattmcinnes
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 12/9/2022
ms.author: mattmcinnes
ms.custom: GGAL-freshness822
---

# Use SCP to move files to and from a VM 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This article shows how to move files from your workstation up to an Azure VM, or from an Azure VM down to your workstation, using Secure Copy (SCP). Moving files between your workstation and a VM, quickly and securely, is critical for managing your Azure infrastructure. 

For this article, you need a VM deployed in Azure with SSH enabled. You also need an SCP client for your local computer. It's built on top of SSH and included in the default shell of most Linux and Windows (10 and newer) installations.


## Quick commands

Upload a file to the VM

```bash
scp file azureuser@azurehost:directory/targetfile
```

Download a file from the VM

```bash
scp azureuser@azurehost:directory/file targetfile
```

## Detailed walkthrough

As examples, we move an Azure configuration file up to a VM and pull down a log file directory, both using SCP.

## SSH key pair authentication

SCP uses SSH for the transport layer. SSH handles the authentication on the destination host, and it moves the file in an encrypted tunnel provided by default with SSH. For SSH authentication, usernames and passwords can be used. However, SSH public and private key authentication are recommended as a security best practice. Once SSH has authenticated the connection, SCP then begins copying the file. When you use a properly configured `~/.ssh/config` and SSH public and private keys, the SCP connection can be established by just using a server name (or IP address). If you only have one SSH key, SCP looks for it in the `~/.ssh/` directory, and uses it by default to log in to the VM.

For more information on configuring your `~/.ssh/config` and SSH public and private keys, see [Create SSH keys](./linux/mac-create-ssh-keys.md).

## Upload a file to a VM

For the first example, we copy an Azure configuration file up to a VM that is used to deploy automation. Because this file contains Azure API credentials, which include secrets, security is important. The encrypted tunnel provided by SSH protects the contents of the file.

The following command copies the local *.azure/config* file to an Azure VM with FQDN *myserver.eastus.cloudapp.azure.com*. If you don't have an [FQDN set](./create-fqdn.md), you can also use the IP address of the VM. The admin user name on the Azure VM is *azureuser*. The file is targeted to the */home/azureuser/* directory. Substitute your own values in this command.

```bash
scp ~/.azure/config azureuser@myserver.eastus.cloudapp.com:/home/azureuser/config
```

## Download a directory from a VM

For this example, we copy a directory of log files from the VM down to your workstation. A log file may or may not contain sensitive or secret data. However, using SCP ensures the contents of the log files are encrypted. A log directory may contain too many relevant files to copy one at a time, so downloading the whole directory is preferred in this situation. Using SCP to transfer the files is the easiest way to get the log directory and files down to your workstation while also being secure.

The following command copies files in the */home/azureuser/logs/* directory on the Azure VM to the local /tmp directory:

```bash
scp -r azureuser@myserver.eastus.cloudapp.com:/home/azureuser/logs/. /tmp/
```

The `-r` flag instructs SCP to recursively copy the files and directories from the point of the directory listed in the command.  Also notice that the command-line syntax is similar to a `cp` copy command.

## Next steps

* [Manage users, SSH, and check or repair disks on Azure Linux VMs using the 'VMAccess' Extension](./extensions/vmaccess-linux.md)