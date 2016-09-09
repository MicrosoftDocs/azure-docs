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
   ms.date="09/08/2016"
   ms.author="v-livech"/>


# Create a Linux VM on Azure by using the CLI

This article shows how to quickly deploy a Linux virtual machine (VM) on Azure by using the `azure vm quick-create` command in the Azure command-line interface (CLI). The `quick-create` command deploys a VM inside a basic, secure infrastructure that you can use to prototype or test a concept rapidly. The article requires

- an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/))

- the [Azure CLI](../xplat-cli-install.md) logged in with `azure login`.

- The Azure CLI _must be in_ Azure Resource Manager mode `azure config mode arm`.  

You can also quickly deploy a Linux VM by using the [Azure portal](virtual-machines-linux-quick-create-portal.md).

## Quick commands

The following example shows how to deploy a CoreOS VM and attach your Secure Shell (SSH) key (your arguments might be different).

```bash
azure vm quick-create -M ~/.ssh/azure_id_rsa.pub -Q CoreOS
```

The following sections explain the command and its requirements using Ubuntu Server 14.04 LTS as the Linux distribution.  

## VM quick-create aliases

A quick way to choose a distribution is to use the Azure CLI aliases mapped to the most common OS distributions. The following table lists the aliases (as of Azure CLI version 0.10). All deployments that use `quick-create` default to VMs that are backed by solid-state drive (SSD) storage, which offer faster provisioning and high performance disk access. (These aliases represent a tiny portion of the available distributions on Azure. Find more images in the Azure Marketplace by [searching for an image](virtual-machines-linux-cli-ps-findimage.md), or [upload your own custom image](virtual-machines-linux-create-upload-generic.md).)

| Alias     | Publisher | Offer        | SKU         | Version |
|:----------|:----------|:-------------|:------------|:--------|
| CentOS    | OpenLogic | CentOS       | 7.2         | latest  |
| CoreOS    | CoreOS    | CoreOS       | Stable      | latest  |
| Debian    | credativ  | Debian       | 8           | latest  |
| openSUSE  | SUSE      | openSUSE     | 13.2        | latest  |
| RHEL      | Red Hat    | RHEL         | 7.2         | latest  |
| UbuntuLTS | Canonical | Ubuntu Server | 14.04.4-LTS | latest  |

The following sections use the `UbuntuLTS` alias for the **ImageURN** option (`-Q`) to deploy an Ubuntu 14.04.4 LTS Server.

## Detailed walkthrough

The previous `quick-create` example only called out the `-M` flag to identify the SSH public key to upload while disabling SSH passwords, so you are prompted for

- resource group name (any string is typically fine for your first Azure resource group)
- VM name
- location (westus or westeurope are good defaults)
- linux (to let Azure know which OS you want)
- username

The following specifies all the values so that no further prompting is required. So long as you have an `~/.ssh/id_rsa.pub` as a ssh-rsa format public key file, it works as is.

```bash
azure vm quick-create \
-g exampleResourceGroup \
-n exampleVMName \
-l westus \
-y Linux \
-u exampleAdminUser \
-M ~/.ssh/id_rsa.pub \
-Q UbuntuLTS
```

The output should look like the following output block.

```bash
info:    Executing command vm quick-create
+ Listing virtual machine sizes available in the location "westus"
+ Looking up the VM "exampleVMName"
info:    Verifying the public key SSH file: /Users/ahmet/.ssh/id_rsa.pub
info:    Using the VM Size "Standard_DS1"
info:    The [OS, Data] Disk or image configuration requires storage account
+ Looking up the storage account cli16330708391032639673
+ Looking up the NIC "examp-westu-1633070839-nic"
info:    An nic with given name "examp-westu-1633070839-nic" not found, creating a new one
+ Looking up the virtual network "examp-westu-1633070839-vnet"
info:    Preparing to create new virtual network and subnet
/ Creating a new virtual network "examp-westu-1633070839-vnet" [address prefix: "10.0.0.0/16"] with subnet "examp-westu-1633070839-snet" [address prefix: "10.+.1.0/24"]
+ Looking up the virtual network "examp-westu-1633070839-vnet"
+ Looking up the subnet "examp-westu-1633070839-snet" under the virtual network "examp-westu-1633070839-vnet"
info:    Found public ip parameters, trying to setup PublicIP profile
+ Looking up the public ip "examp-westu-1633070839-pip"
info:    PublicIP with given name "examp-westu-1633070839-pip" not found, creating a new one
+ Creating public ip "examp-westu-1633070839-pip"
+ Looking up the public ip "examp-westu-1633070839-pip"
+ Creating NIC "examp-westu-1633070839-nic"
+ Looking up the NIC "examp-westu-1633070839-nic"
+ Looking up the storage account clisto1710997031examplev
+ Creating VM "exampleVMName"
+ Looking up the VM "exampleVMName"
+ Looking up the NIC "examp-westu-1633070839-nic"
+ Looking up the public ip "examp-westu-1633070839-pip"
data:    Id                              :/subscriptions/2<--snip-->d/resourceGroups/exampleResourceGroup/providers/Microsoft.Compute/virtualMachines/exampleVMName
data:    ProvisioningState               :Succeeded
data:    Name                            :exampleVMName
data:    Location                        :westus
data:    Type                            :Microsoft.Compute/virtualMachines
data:
data:    Hardware Profile:
data:      Size                          :Standard_DS1
data:
data:    Storage Profile:
data:      Image reference:
data:        Publisher                   :Canonical
data:        Offer                       :UbuntuServer
data:        Sku                         :14.04.4-LTS
data:        Version                     :latest
data:
data:      OS Disk:
data:        OSType                      :Linux
data:        Name                        :clic7fadb847357e9cf-os-1473374894359
data:        Caching                     :ReadWrite
data:        CreateOption                :FromImage
data:        Vhd:
data:          Uri                       :https://cli16330708391032639673.blob.core.windows.net/vhds/clic7fadb847357e9cf-os-1473374894359.vhd
data:
data:    OS Profile:
data:      Computer Name                 :exampleVMName
data:      User Name                     :exampleAdminUser
data:      Linux Configuration:
data:        Disable Password Auth       :true
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-33-42-FB
data:          Provisioning State        :Succeeded
data:          Name                      :examp-westu-1633070839-nic
data:          Location                  :westus
data:            Public IP address       :138.91.247.29
data:            FQDN                    :examp-westu-1633070839-pip.westus.cloudapp.azure.com
data:
data:    Diagnostics Profile:
data:      BootDiagnostics Enabled       :true
data:      BootDiagnostics StorageUri    :https://clisto1710997031examplev.blob.core.windows.net/
data:
data:      Diagnostics Instance View:
info:    vm quick-create command OK
```

Log in to your VM by using the public IP address listed in the output. You can also use the fully qualified domain name (FQDN) that's listed.

```bash
ssh -i ~/.ssh/id_rsa.pub exampleAdminUser@138.91.247.29
```

The login process should look something like the following:

```bash
Warning: Permanently added '138.91.247.29' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 14.04.4 LTS (GNU/Linux 3.19.0-65-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Thu Sep  8 22:50:57 UTC 2016

  System load: 0.63              Memory usage: 2%   Processes:       81
  Usage of /:  39.6% of 1.94GB   Swap usage:   0%   Users logged in: 0

  Graph this data and manage this system at:
    https://landscape.canonical.com/

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

exampleAdminUser@exampleVMName:~$
```

## Next steps

The `azure vm quick-create` command is the way to quickly deploy a VM so you can log in to a bash shell and get working. However, using `vm quick-create` does not give you extensive control nor does it enable you to create a more complex environment.  To deploy a Linux VM that's customized for your infrastructure, you can follow any of these articles:

- [Use an Azure Resource Manager template to create a specific deployment](virtual-machines-linux-cli-deploy-templates.md)
- [Create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-create-cli-complete.md)
- [Create an SSH Secured Linux VM on Azure using templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)

You can also [use the `docker-machine` Azure driver with various commands to quickly create a Linux VM as a docker host](virtual-machines-linux-docker-machine.md) as well.
