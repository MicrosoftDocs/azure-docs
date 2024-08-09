---
title: Introduction to FreeBSD on Azure
description: Learn about using FreeBSD virtual machines on Azure.
author: thomas1206
ms.service: azure-virtual-machines
ms.custom: linux-related-content
ms.collection: linux
ms.topic: how-to
ms.date: 09/13/2017
ms.author: mimckitt
---

# Introduction to FreeBSD on Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article provides an overview of running a FreeBSD virtual machine (VM) in Azure.

## Overview

FreeBSD for Azure is an advanced computer operating system used to power modern servers, desktops, and embedded platforms.

Microsoft is making images of FreeBSD available on Azure with the [Azure VM Guest Agent](https://github.com/Azure/WALinuxAgent/) preconfigured. Currently, the following FreeBSD versions are offered as images by Microsoft:

- FreeBSD 10.4 in Azure Marketplace
- FreeBSD 11.2 in Azure Marketplace
- FreeBSD 11.3 in Azure Marketplace
- FreeBSD 12.0 in Azure Marketplace

The following FreeBSD versions also include the [Azure VM Guest Agent](https://github.com/Azure/WALinuxAgent/). They're offered as images by the FreeBSD Foundation:

- FreeBSD 11.4 in Azure Marketplace
- FreeBSD 12.2 in Azure Marketplace
- FreeBSD 13.0 in Azure Marketplace

The agent is responsible for communication between the FreeBSD VM and the Azure fabric for operations such as provisioning the VM on first use (user name, password or SSH key, and host name) and enabling functionality for selective VM extensions.

As for future versions of FreeBSD, the strategy is to stay current and make the latest releases available shortly after they're published by the FreeBSD release engineering team.

### Create a FreeBSD VM through the Azure CLI on FreeBSD

First, you need to install the [Azure CLI](/cli/azure/get-started-with-azure-cli) through the following command on a FreeBSD machine:

```bash 
curl -L https://aka.ms/InstallAzureCli | bash
```

If bash isn't installed on your FreeBSD machine, run the following command before the installation:

```bash
sudo pkg install bash
```

If Python isn't installed on your FreeBSD machine, run the following commands before the installation:

```bash
sudo pkg install python38
cd /usr/local/bin 
sudo rm /usr/local/bin/python 
sudo ln -s /usr/local/bin/python3.8 /usr/local/bin/python
```

During the installation, you're asked to `Modify profile to update your $PATH and enable shell/tab completion now? (Y/n)`. If you answer `y` and enter `/etc/rc.conf` as `a path to an rc file to update`, you might see `ERROR: [Errno 13] Permission denied`. To resolve this problem, you should grant the write permission to the current user against the file `etc/rc.conf`.

Now you can sign in to Azure and create your FreeBSD VM. The following example shows how to create a FreeBSD 11.0 VM. You can also add the parameter `--public-ip-address-dns-name` with a globally unique DNS name for a newly created public IP.

```azurecli
az login 
az group create --name myResourceGroup --location eastus
az vm create --name myFreeBSD11 \
    --resource-group myResourceGroup \
    --image MicrosoftOSTC:FreeBSD:11.0:latest \
    --admin-username azureuser \
    --generate-ssh-keys
```

Then you can sign in to your FreeBSD VM through the IP address that printed in the output of the preceding deployment.

```bash
ssh azureuser@xx.xx.xx.xx -i /etc/ssh/ssh_host_rsa_key
```   

## VM extensions for FreeBSD

The following VM extensions are supported in FreeBSD.

### VMAccess

The [VMAccess](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) extension can:

* Reset the password of the original sudo user.
* Create a new sudo user with the password specified.
* Set the public host key with the key given.
* Reset the public host key provided during VM provisioning if the host key isn't provided.
* Open the SSH port (22) and restore the `sshd_config` if `reset_ssh` is set to `true`.
* Remove the existing user.
* Check disks.
* Repair an added disk.

### CustomScript

The [CustomScript](https://github.com/Azure/azure-linux-extensions/tree/master/CustomScript) extension can:

* If provided, download the customized scripts from Azure Storage or external public storage (for example, GitHub).
* Run the entry point script.
* Support inline commands.
* Convert Windows-style newline in shell and Python scripts automatically.
* Remove BOM in shell and Python scripts automatically.
* Protect sensitive data in `CommandToExecute`.

> [!NOTE]
> FreeBSD VM only supports CustomScript version 1.x by now.

## Authentication: User names, passwords, and SSH keys

When you're creating a FreeBSD VM by using the Azure portal, you must provide a user name, password, or SSH public key.

User names for deploying a FreeBSD VM on Azure must not match the names of system accounts (UID <100) already present in the VM ("root," for example).

Currently, only the RSA SSH key is supported. A multiline SSH key must begin with `---- BEGIN SSH2 PUBLIC KEY ----` and end with `---- END SSH2 PUBLIC KEY ----`.

## Obtain superuser privileges

The user account that's specified during VM instance deployment on Azure is a privileged account. The package of sudo was installed in the published FreeBSD image.

After you're logged in through this user account, you can run commands as root by using the command syntax.

```
$ sudo <COMMAND>
```

You can optionally obtain a root shell by using `sudo -s`.

## Known issues

The [Azure VM Guest Agent](https://github.com/Azure/WALinuxAgent/) version 2.2.2 has a [known issue](https://github.com/Azure/WALinuxAgent/pull/517) that causes the provision failure for FreeBSD VM on Azure. The fix was captured by [Azure VM Guest Agent](https://github.com/Azure/WALinuxAgent/) version 2.2.3 and later releases.

## Related content

* Go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/thefreebsdfoundation.freebsd-12_2?tab=Overview) to create a FreeBSD VM.
