<properties
    pageTitle="Using cloud-init to customize a Linux VM during creation | Microsoft Azure"
    description="Using cloud-init to customize a Linux VM during creation."
    services="virtual-machines-linux"
    documentationCenter=""
    authors="vlivech"
    manager="timlt"
    editor=""
    tags="azure-resource-manager"
/>

<tags
    ms.service="virtual-machines-linux"
    ms.workload="infrastructure-services"
    ms.tgt_pltfrm="vm-linux"
    ms.devlang="na"
    ms.topic="article"
    ms.date="04/29/2016"
    ms.author="v-livech"
/>

# Using cloud-init to customize a Linux VM during creation

This article shows how to make a cloud-init script to set the hostname, update installed packages and manage user accounts.  Those cloud-init scripts will then be used during the VM creation from [the Azure CLI](../xplat-cli-install.md).

## Prerequisites

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH public and private keys](virtual-machines-linux-mac-create-ssh-keys.md), an Azure resource group to launch the Linux VMs into, and the Azure CLI installed and switched to ARM mode using `azure config mode arm`.

## Introduction

When you launch a new Linux VM you are getting a standard Linux VM with nothing customized or ready for your needs. [Cloud-init](https://cloudinit.readthedocs.org) is a standard way to inject a script or configuration settings into that Linux VM as it is booting up for the first time.

On Azure there are a three different ways to make changes onto a Linux VM as it is starting up.

- You can inject scripts with cloud-init.
- You can inject scripts using the Azure [CustomScriptExtention](virtual-machines-linux-extensions-customscript.md).
- You can specify custom settings in a Azure template and use that to launch and customize your Linux VM, which includes support for cloud-init as well as the CustomScript VM extension and many others.

To inject scripts at any time, you can:

- use SSH to run commands directly, you can use the Azure [CustomScriptExtention](virtual-machines-linux-extensions-customscript.md) either imperatively or in an Azure template, or you can use common configuration management tools like Ansible, Salt, Chef, and Puppet, which themselves work over SSH after the VM has completed booting.

NOTE: Though a [CustomScriptExtention](virtual-machines-linux-extensions-customscript.md) merely executes a script as root in the same way using SSH can, using the VM extension enables several features that Azure offers that can be useful depending upon your scenario.

## Quick Commands

Create a hostname cloud-init script

```bash
#cloud-config
hostname: exampleServerName
```

Create an update Linux on first boot cloud-init script for Debian Family

```bash
#cloud-config
apt_upgrade: true
```

Create an add a user cloud-init script

```bash
#cloud-config
users:
  - name: exampleUser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>==exampleuser@slackwarelaptop
```

## Detailed Walkthrough

### Adding a cloud-init script to the VM creation with the Azure CLI

To launch a cloud-init script when creating a VM in Azure, specify the cloud-init file using the Azure CLI `--custom-data` switch.

NOTE: Although this articles discusses using the `--custom-data` switch for cloud-init files, you can also pass arbitrary code or files using this switch. If the Linux VM already knows what to do with such files, they execute automatically.

```bash
azure vm create \
--resource-group exampleRG \
--name exampleVM \
--location westus \
--admin-username exampleAdminUserName \
--os-type Linux \
--nic-name exampleNIC \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--custom-data cloud_init_script.txt
```

### Creating a cloud-init script to set the hostname of a Linux VM

One of the simplest and most important settings for any Linux VM would be the hostname. We can easily set this using cloud-init with this script.  

#### Example cloud-init script named `cloud_config_hostname.txt`.

``` bash
#cloud-config
hostname: exampleServerName
```

During the initial startup of the VM this cloud-init script sets the hostname to `exampleServerName`.

```bash
azure vm create \
--resource-group exampleRG \
--name exampleVM \
--location westus \
--admin-username exampleAdminUserName \
--os-type Linux \
--nic-name exampleNIC \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--custom-data cloud_config_hostname.txt
```

Login and verify the hostname of the new VM.

```bash
ssh exampleVM
hostname
exampleServerName
```

### Creating a cloud-init script to update Linux

For security you want your Ubuntu VM to update on the first boot.  Using cloud-init we can do that with the follow script, depending on the Linux distribution you are using.

#### Example cloud-init script `cloud_config_apt_upgrade.txt` for the Debian Family

```bash
#cloud-config
apt_upgrade: true
```

After the new Linux VM has booted it will immediately update all the installed packages via `apt-get`.

```bash
azure vm create \
--resource-group exampleRG \
--name exampleVM \
--location westus \
--admin-username exampleAdminUserName \
--os-type Linux \
--nic-name exampleNIC \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--custom-data cloud_config_apt_upgrade.txt
```

Login and verify all packages are updated.

```bash
ssh exampleVM
sudo apt-get upgrade
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
The following packages have been kept back:
  linux-generic linux-headers-generic linux-image-generic
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

### Creating a cloud-init script to add a user to Linux

One of the first tasks on any new Linux VM is to add a user for yourself or to avoid using `root`. This is great for security reasons and for usability once you add in your SSH public key to that user's `~/.ssh/authorized_keys` file for password-less and secure SSH logins.

#### Example cloud-init script `cloud_config_add_users.txt` for Debian Family

```bash
#cloud-config
users:
  - name: exampleUser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>==exampleuser@slackwarelaptop
```

After the new Linux VM has booted it will create the new user and add it to the sudo group.

```bash
azure vm create \
--resource-group exampleRG \
--name exampleVM \
--location westus \
--admin-username exampleAdminUserName \
--os-type Linux \
--nic-name exampleNIC \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--custom-data cloud_config_add_users.txt
```

Login and verify the newly created user.

```bash
cat /etc/group
```

Output

```bash
root:x:0:
<snip />
sudo:x:27:exampleUser
<snip />
exampleUser:x:1000:
```
