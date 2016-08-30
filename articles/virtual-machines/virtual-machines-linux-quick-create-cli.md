<properties
   pageTitle="Create a Linux VM on Azure by using the CLI | Microsoft Azure"
   description="Create a Linux VM on Azure by using the CLI."
   services="virtual-machines-linux"
   documentationCenter=""
   authors="vlivech"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="08/18/2016"
   ms.author="v-livech"/>


# Create a Linux VM on Azure by using the CLI

> [AZURE.NOTE] If you have a few moments, help us to improve the Azure Linux virtual machine (VM) documentation by taking a [quick survey](https://aka.ms/linuxdocsurvey) of your experiences. Every answer helps us help you get your work done.

This article shows how to quickly deploy a Linux virtual machine on Azure by using the `azure vm quick-create` command in the Azure command-line interface (CLI). The `quick-create` command deploys a VM, with a basic infrastructure surrounding it, that you can use to prototype or test a concept rapidly.  The article requires an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)), and [the Azure CLI](../xplat-cli-install.md) logged in (`azure login`) and in Azure Resource Manager mode (`azure config mode arm`).  You can also quickly deploy a Linux VM by using the [Azure portal](virtual-machines-linux-quick-create-portal.md).

## Command summary

You can use one command to deploy a CoreOS VM and attach your Secure Shell (SSH) key:

```bash
azure vm quick-create -M ~/.ssh/azure_id_rsa.pub -Q CoreOS
```

We are now going to walk through the command and explain each step by using Red Hat Enterprise Linux 7.2.  

## ImageURN alias

The Azure CLI `quick-create` command has aliases mapped to the most common OS distributions. The following table lists the distribution aliases (as of Azure CLI version 0.10).  All deployments that use `quick-create` default to VMs that are backed by solid-state drive (SSD) storage. SSD-backed VMs offer a high-performance experience.

| Alias     | Publisher | Offer        | SKU         | Version |
|:----------|:----------|:-------------|:------------|:--------|
| CentOS    | OpenLogic | CentOS       | 7.2         | latest  |
| CoreOS    | CoreOS    | CoreOS       | Stable      | latest  |
| Debian    | credativ  | Debian       | 8           | latest  |
| openSUSE  | SUSE      | openSUSE     | 13.2        | latest  |
| RHEL      | Red Hat    | RHEL         | 7.2         | latest  |
| UbuntuLTS | Canonical | Ubuntu Server | 14.04.4-LTS | latest  |



For the **ImageURN** option (`-Q`), we are using `RHEL` to deploy a Red Hat Enterprise Linux 7.2 VM. These `quick-create` aliases represent a tiny portion of the available OS on Azure.  Find more images in the Azure Marketplace by [searching for an image](virtual-machines-linux-cli-ps-findimage.md), or [upload your own custom image](virtual-machines-linux-create-upload-generic.md).

In the following commands, replace the prompts with values from your own environment.

```bash
azure vm quick-create -M ~/.ssh/id_rsa.pub -Q RHEL
```

The output should look like the following output block.

```bash
info:    Executing command vm quick-create
Resource group name: rhel-quick
Virtual machine name: rhel
Location name: westus
Operating system Type [Windows, Linux]: linux
User name: ops
+ Listing virtual machine sizes available in the location "westus"
+ Looking up the VM "rhel"
info:    Verifying the public key SSH file: /Users/ops/.ssh/id_rsa.pub
info:    Using the VM Size "Standard_DS1"
info:    The [OS, Data] Disk or image configuration requires storage account
+ Looking up the storage account cli1630678171193501687
info:    Could not find the storage account "cli1630678171193501687", trying to create new one
+ Creating storage account "cli1630678171193501687" in "westus"
+ Looking up the storage account cli1630678171193501687
+ Looking up the NIC "rhel-westu-1630678171-nic"
info:    An nic with given name "rhel-westu-1630678171-nic" not found, creating a new one
+ Looking up the virtual network "rhel-westu-1630678171-vnet"
info:    Preparing to create new virtual network and subnet
+ Creating a new virtual network "rhel-westu-1630678171-vnet" [address prefix: "10.0.0.0/16"] with subnet "rhel-westu-1630678171-snet" [address prefix: "10.0.1.0/24"]
+ Looking up the virtual network "rhel-westu-1630678171-vnet"
+ Looking up the subnet "rhel-westu-1630678171-snet" under the virtual network "rhel-westu-1630678171-vnet"
info:    Found public ip parameters, trying to setup PublicIP profile
+ Looking up the public ip "rhel-westu-1630678171-pip"
info:    PublicIP with given name "rhel-westu-1630678171-pip" not found, creating a new one
+ Creating public ip "rhel-westu-1630678171-pip"
+ Looking up the public ip "rhel-westu-1630678171-pip"
+ Creating NIC "rhel-westu-1630678171-nic"
+ Looking up the NIC "rhel-westu-1630678171-nic"
+ Looking up the storage account clisto909893658rhel
+ Creating VM "rhel"
+ Looking up the VM "rhel"
+ Looking up the NIC "rhel-westu-1630678171-nic"
+ Looking up the public ip "rhel-westu-1630678171-pip"
data:    Id                              :/subscriptions/<guid>/resourceGroups/rhel-quick/providers/Microsoft.Compute/virtualMachines/rhel
data:    ProvisioningState               :Succeeded
data:    Name                            :rhel
data:    Location                        :westus
data:    Type                            :Microsoft.Compute/virtualMachines
data:
data:    Hardware Profile:
data:      Size                          :Standard_DS1
data:
data:    Storage Profile:
data:      Image reference:
data:        Publisher                   :RedHat
data:        Offer                       :RHEL
data:        Sku                         :7.2
data:        Version                     :latest
data:
data:      OS Disk:
data:        OSType                      :Linux
data:        Name                        :clic5abbc145c0242c1-os-1462425492101
data:        Caching                     :ReadWrite
data:        CreateOption                :FromImage
data:        Vhd:
data:          Uri                       :https://cli1630678171193501687.blob.core.windows.net/vhds/clic5abbc145c0242c1-os-1462425492101.vhd
data:
data:    OS Profile:
data:      Computer Name                 :rhel
data:      User Name                     :ops
data:      Linux Configuration:
data:        Disable Password Auth       :true
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-32-0F-DD
data:          Provisioning State        :Succeeded
data:          Name                      :rhel-westu-1630678171-nic
data:          Location                  :westus
data:            Public IP address       :104.42.236.196
data:            FQDN                    :rhel-westu-1630678171-pip.westus.cloudapp.azure.com
data:
data:    Diagnostics Profile:
data:      BootDiagnostics Enabled       :true
data:      BootDiagnostics StorageUri    :https://clisto909893658rhel.blob.core.windows.net/
data:
data:      Diagnostics Instance View:
info:    vm quick-create command OK
```

Log in to your VM by using SSH on port 22 and the public IP address listed in the output. You can also use the fully qualified domain name (FQDN) that's listed.

```bash
ssh ops@rhel-westu-1630678171-pip.westus.cloudapp.azure.com
```
The login process should look something like the following:

```bash
The authenticity of host 'rhel-westu-1630678171-pip.westus.cloudapp.azure.com (104.42.236.196)' can't be established.
RSA key fingerprint is 0e:81:c4:36:2d:eb:3c:5a:dc:7e:65:8a:3f:3e:b0:cb.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'rhel-westu-1630678171-pip.westus.cloudapp.azure.com,104.42.236.196' (RSA) to the list of known hosts.
[ops@rhel ~]$ ls -a
.  ..  .bash_logout  .bash_profile  .bashrc  .cache  .config  .ssh
```

## Next steps

The `azure vm quick-create` command is the way to quickly deploy a VM so you can log in to a bash shell and get working. Using `vm quick-create` does not give you the additional benefits of a complex environment.  To deploy a Linux VM that's customized for your infrastructure, you can follow any of these articles:

- [Use an Azure Resource Manager template to create a specific deployment](virtual-machines-linux-cli-deploy-templates.md)
- [Create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-create-cli-complete.md)
- [Create an SSH Secured Linux VM on Azure using templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
