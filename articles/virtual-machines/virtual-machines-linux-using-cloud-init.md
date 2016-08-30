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
    ms.date="08/30/2016"
    ms.author="v-livech"
/>

# Using cloud-init to customize a Linux VM during creation

This article shows how to make a cloud-init script to set the hostname, update installed packages, and manage user accounts.  The cloud-init scripts are called during the VM creation from Azure CLI.

## Prerequisites

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH public and private keys](virtual-machines-linux-mac-create-ssh-keys.md), and [the Azure CLI](../xplat-cli-install.md) switched to Azure Resource Manager mode using `azure config mode arm`.

## Quick Commands

Create a cloud-init.txt script that sets the hostname, updates all packages, and adds a sudo user to Linux.

```bash
#cloud-config
hostname: exampleServerName
apt_upgrade: true
users:
  - name: exampleUser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>==exampleuser@slackwarelaptop
```

Create a Linux VM using cloud-init to configure it during boot.

```bash
azure group create cloudinitexample westus
```

```bash
azure vm create \
--resource-group cloudinitexample \
--name cloudinitexample \
--location westus \
--os-type Linux \
--nic-name cloudinitnicexample \
--vnet-name cloudinitvnetexample \
--vnet-address-prefix 10.0.0.0/22 \
--vnet-subnet-name cloudinitvsubnet \
--vnet-subnet-address-prefix 10.0.0.0/24 \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--ssh-publickey-file ~/.ssh/azure_id_rsa.pub \
--admin-username ahmet \
--custom-data cloud-init.txt

```

## Introduction

When you launch a new Linux VM, you are getting a standard Linux VM with nothing customized or ready for your needs. [Cloud-init](https://cloudinit.readthedocs.org) is a standard way to inject a script or configuration settings into that Linux VM as it is booting up for the first time.

On Azure, there are a three different ways to make changes onto a Linux VM as it is being deployed or booted.

- Inject scripts using cloud-init.
- Inject scripts using the Azure [VMAccess Extension](virtual-machines-linux-using-vmaccess-extension.md).
- An Azure template using cloud-init.
- An Azure template using [CustomScriptExtention](virtual-machines-linux-extensions-customscript.md).

To inject scripts at any time after boot:

- SSH to run commands directly
- Inject scripts using the Azure [VMAccess Extension](virtual-machines-linux-using-vmaccess-extension.md), either imperatively or in an Azure template
- Configuration management tools like Ansible, Salt, Chef, and Puppet.

>[AZURE.NOTE]: VMAccess Extension executes a script as root in the same way using SSH can.  However, using the VM extension enables several features that Azure offers that can be useful depending upon your scenario.

### Cloud-init availability on Azure VM quick-create image aliases:

| Alias     | Publisher | Offer        | SKU         | Version | cloud-init |
|:----------|:----------|:-------------|:------------|:--------|:-----------|
| CentOS    | OpenLogic | Centos       | 7.2         | latest  | no         |
| CoreOS    | CoreOS    | CoreOS       | Stable      | latest  | yes        |
| Debian    | credativ  | Debian       | 8           | latest  | no         |
| openSUSE  | SUSE      | openSUSE     | 13.2        | latest  | no         |
| RHEL      | Redhat    | RHEL         | 7.2         | latest  | no         |
| UbuntuLTS | Canonical | UbuntuServer | 14.04.4-LTS | latest  | yes        |

Microsoft is working with our partners to get cloud-init included and working in the images that they provide to Azure.


## Detailed walkthrough

### Adding a cloud-init script to the VM creation with the Azure CLI

To launch a cloud-init script when creating a VM in Azure, specify the cloud-init file using the Azure CLI `--custom-data` switch.

```bash
azure group create cloudinitexample westus
```

```bash
azure vm create \
--resource-group cloudinitexample \
--name cloudinitexample \
--location westus \
--os-type Linux \
--nic-name cloudinitnicexample \
--vnet-name cloudinitvnetexample \
--vnet-address-prefix 10.0.0.0/22 \
--vnet-subnet-name cloudinitvsubnet \
--vnet-subnet-address-prefix 10.0.0.0/24 \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--ssh-publickey-file ~/.ssh/azure_id_rsa.pub \
--admin-username ahmet \
--custom-data cloud-init.txt

```

### Creating a cloud-init script to set the hostname of a Linux VM

One of the simplest and most important settings for any Linux VM would be the hostname. We can easily set this using cloud-init with this script.  

#### Example cloud-init script named `cloud_config_hostname.txt`.

``` bash
#cloud-config
hostname: exampleServerName
```

During the initial startup of the VM, this cloud-init script sets the hostname to `exampleServerName`.

```bash
azure vm create \
--resource-group cloudinitexample \
--name cloudinitexample \
--location westus \
--os-type Linux \
--nic-name cloudinitnicexample \
--vnet-name cloudinitvnetexample \
--vnet-address-prefix 10.0.0.0/22 \
--vnet-subnet-name cloudinitvsubnet \
--vnet-subnet-address-prefix 10.0.0.0/24 \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--ssh-publickey-file ~/.ssh/azure_id_rsa.pub \
--admin-username ahmet \
--custom-data cloud_config_hostname.txt

```

Login and verify the hostname of the new VM.

```bash
ssh exampleVM
hostname
exampleServerName
```

### Creating a cloud-init script to update Linux

For security, you want your Ubuntu VM to update on the first boot.  Using cloud-init we can do that with the follow script, depending on the Linux distribution you are using.

#### Example cloud-init script `cloud_config_apt_upgrade.txt` for the Debian Family

```bash
#cloud-config
apt_upgrade: true
```

After Linux has booted, all the installed packages are updated via `apt-get`.

```bash
azure vm create \
--resource-group cloudinitexample \
--name cloudinitexample \
--location westus \
--os-type Linux \
--nic-name cloudinitnicexample \
--vnet-name cloudinitvnetexample \
--vnet-address-prefix 10.0.0.0/22 \
--vnet-subnet-name cloudinitvsubnet \
--vnet-subnet-address-prefix 10.0.0.0/24 \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--ssh-publickey-file ~/.ssh/azure_id_rsa.pub \
--admin-username ahmet \
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

One of the first tasks on any new Linux VM is to add a user for yourself or to avoid using `root`. SSH keys are best practice for security and for usability and they are added to the `~/.ssh/authorized_keys` file with this cloud-init script.

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

After Linux has booted, all the listed users are created and added to the sudo group.

```bash
azure vm create \
--resource-group cloudinitexample \
--name cloudinitexample \
--location westus \
--os-type Linux \
--nic-name cloudinitnicexample \
--vnet-name cloudinitvnetexample \
--vnet-address-prefix 10.0.0.0/22 \
--vnet-subnet-name cloudinitvsubnet \
--vnet-subnet-address-prefix 10.0.0.0/24 \
--image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
--ssh-publickey-file ~/.ssh/azure_id_rsa.pub \
--admin-username ahmet \
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

## Next Steps

Cloud-init is becoming one standard way to modify your Linux VM on boot. Azure also has VM extensions, which allow you to modify your LinuxVM on boot or while it is running. For example, you can use the Azure VMAccessExtension to reset SSH or user information while the VM is running. With cloud-init, you would need a reboot to reset the password.

[About virtual machine extensions and features](virtual-machines-linux-extensions-features.md)

[Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](virtual-machines-linux-using-vmaccess-extension.md)
