---
title: Create and use an SSH key pair for Linux VMs in Azure | Microsoft Docs
description: How to create and use an SSH public-private key pair for Linux VMs in Azure to improve the security of the authentication process.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 34ae9482-da3e-4b2d-9d0d-9d672aa42498
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: iainfou

---

# Quick steps: Create and use an SSH public-private key pair for Linux VMs in Azure
With a secure shell (SSH) key pair, you can create virtual machines (VMs) in Azure that use SSH keys for authentication, eliminating the need for passwords to log in. This article shows you how to quickly generate and use an SSH public-private key file pair for Linux VMs. You can complete these steps with the Azure Cloud Shell, a macOS or Linux host, the Windows Subsystem for Linux, and other tools that support OpenSSH. 

For more background and examples, see [detailed steps to create SSH key pairs](create-ssh-keys-detailed.md).

For additional ways to generate and use SSH keys on a Windows computer, see [How to use SSH keys with Windows on Azure](ssh-from-windows.md).

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## Create an SSH key pair
Use the `ssh-keygen` command to generate SSH public and private key files that are by default created in the `~/.ssh` directory. You can specify a different location and an additional passphrase (a password to access the private key file) when prompted. If an SSH key pair exists in the current location, those files are overwritten.

```bash
ssh-keygen -t rsa -b 2048
```

If you use the [Azure CLI 2.0](/cli/azure) to create your VM, you can optionally generate SSH public and private key files by running the [az vm create](/cli/azure/vm#az_vm_create) command with the `--generate-ssh-keys` option. The keys are stored in the ~/.ssh directory. Note that this command option does not overwrite keys if they already exist in that location.

## Provide SSH public key when deploying a VM
To create a Linux VM that uses SSH keys for authentication, specify your SSH public key when creating the VM using the Azure portal, CLI, Resource Manager templates, or other methods:

* [Create a Linux virtual machine with the Azure portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a Linux virtual machine with the Azure CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a Linux VM using an Azure template](create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

If you're not familiar with the format of an SSH public key, you can see your public key by running `cat` as follows, replacing `~/.ssh/id_rsa.pub` with your own public key file location:

```bash
cat ~/.ssh/id_rsa.pub
```

If you copy and paste the contents of the public key file to use in the Azure portal or a Resource Manager template, make sure you don't copy any additional whitespace. For example, if you use macOS, you can pipe the public key file (by default, `~/.ssh/id_rsa.pub`) to **pbcopy** to copy the contents (there are other Linux programs that do the same thing, such as **xclip**).

The public key that you place on your Linux VM in Azure is by default stored in `~/.ssh/id_rsa.pub`, unless you changed the location when you created the keys. If you use the [Azure CLI 2.0](/cli/azure) to create your VM with an existing public key, specify the value or location of this public key by running the [az vm create](/cli/azure/vm#az_vm_create) command with the `--ssh-key-value` option. 

## SSH to your VM
With the public key deployed on your Azure VM, and the private key on your local system, SSH to your VM using the IP address or DNS name of your VM. Replace *azureuser* and *myvm.westus.cloudapp.azure.com* in the following command with the administrator user name and the fully qualified domain name (or IP address):

```bash
ssh azureuser@myvm.westus.cloudapp.azure.com
```

If you provided a passphrase when you created your key pair, enter the passphrase when prompted during the login process. (The server is added to your `~/.ssh/known_hosts` folder, and you won't be asked to connect again until the public key on your Azure VM changes or the server name is removed from `~/.ssh/known_hosts`.)

VMs created using SSH keys are by default configured with passwords disabled, to make brute-forced guessing attempts vastly more expensive and therefore difficult. 

## Next steps

This article described creating a simple SSH key pair for quick usage. 

* If you need more assistance to work with your SSH key pair, see [Detailed steps to create and manage SSH key pairs](create-ssh-keys-detailed.md).

* If you have problems with SSH connections to an Azure VM, see [Troubleshoot SSH connections to an Azure Linux VM](troubleshoot-ssh-connection.md).


