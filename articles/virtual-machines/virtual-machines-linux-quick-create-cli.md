<properties
   pageTitle="Quickly Create a Linux VM on Azure using the CLI | Microsoft Azure"
   description="Quickly Create a Linux VM on Azure using the CLI."
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
   ms.date="03/28/2016"
   ms.author="v-livech"/>


# Quickly Create a Linux VM on Azure using the CLI

This article shows how to quickly create a new Linux VM using the `azure vm quick-create` command from [the Azure CLI](../xplat-cli-install.md).

[AZURE.NOTE] This topic shows how to quickly create a Linux VM in a basic Azure environment for trial, testing, and other short-lived scenarios. You should create more secure Azure environments for your Linux VMs to use them for production or other longer-running scenarios.  

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH public and private keys](virtual-machines-linux-mac-create-ssh-keys.md), an Azure resource group (we will create a RG below), and the Azure CLI installed and switched to ARM mode using `azure config mode arm`.

## Quick Command Summary

There is only one command to issue:

1. `azure vm quick-create`

## Detailed Walk Through

### Create the Linux VM

In the following command, you can use any image you want, but this example uses `canonical:ubuntuserver:14.04.2-LTS:latest` to create a VM quickly. (To locate an image in the marketplace, [search for an image](virtual-machines-linux-cli-ps-findimage.md) or you can [upload your own custom image](virtual-machines-linux-create-upload-generic.md).) It will look something like the following.

In the following command examples, please replace values between &lt; and &gt; with values from your own environment.

```bash
# Create the Linux VM using prompts
username@macbook$ azure vm quick-create
info:    Executing command vm quick-create
Resource group name: exampleResourceGroup
Virtual machine name: exampleVMname
Location name: westus
Operating system Type [Windows, Linux]: linux
ImageURN (in the format of "publisherName:offer:skus:version") or a VHD link to the user image: canonical:ubuntuserver:14.04.2-LTS:latest
User name: ops
Password: *********
Confirm password: *********
+ Looking up the VM "exampleVMname"
info:    Using the VM Size "Standard_D1"
info:    The [OS, Data] Disk or image configuration requires storage account
+ Looking up the storage account cli133501687
info:    Could not find the storage account "cli1301687", trying to create new one
+ Creating storage account "cli133501687" in "westus"
+ Looking up the storage account cli133501687
+ Looking up the NIC "quick-westu-1363648838-nic"
info:    An nic with given name "quick-westu-1363648838-nic" not found, creating a new one
+ Looking up the virtual network "quick-westu-1363648838-vnet"
info:    Preparing to create new virtual network and subnet
\ Creating a new virtual network "quick-westu-1363648838-vnet" [address prefix: "10.0.0.0/16"] with subnet "quick-westu-13636488+8-snet" [address prefix: "10.0.1.0/24"]
+ Looking up the virtual network "quick-westu-1363648838-vnet"
+ Looking up the subnet "quick-westu-1363648838-snet" under the virtual network "quick-westu-1363648838-vnet"
info:    Found public ip parameters, trying to setup PublicIP profile
+ Looking up the public ip "quick-westu-1363648838-pip"
info:    PublicIP with given name "quick-westu-1363648838-pip" not found, creating a new one
+ Creating public ip "quick-westu-1363648838-pip"
+ Looking up the public ip "quick-westu-1363648838-pip"
+ Creating NIC "quick-westu-1363648838-nic"
+ Looking up the NIC "quick-westu-1363648838-nic"
+ Creating VM "quickcreate"
+ Looking up the VM "exampleVMname"
+ Looking up the NIC "quick-westu-1363648838-nic"
+ Looking up the public ip "quick-westu-1363648838-pip"
data:    Id                              :/subscriptions/<guid>/resourceGroups/exampleResourceGroup/providers/Microsoft.Compute/virtualMachines/exampleVMname
data:    ProvisioningState               :Succeeded
data:    Name                            :exampleVMname
data:    Location                        :westus
data:    Type                            :Microsoft.Compute/virtualMachines
data:
data:    Hardware Profile:
data:      Size                          :Standard_D1
data:
data:    Storage Profile:
data:      Image reference:
data:        Publisher                   :canonical
data:        Offer                       :ubuntuserver
data:        Sku                         :14.04.2-LTS
data:        Version                     :latest
data:
data:      OS Disk:
data:        OSType                      :Linux
data:        Name                        :cli350d386daac1f01c-os-1457063387485
data:        Caching                     :ReadWrite
data:        CreateOption                :FromImage
data:        Vhd:
data:          Uri                       :https://cli1361687.blob.core.windows.net/vhds/cli350d386daac1f01c-os-1457063387485.vhd
data:
data:    OS Profile:
data:      Computer Name                 :exampleVMname
data:      User Name                     :ops
data:      Linux Configuration:
data:        Disable Password Auth       :false
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-32-E9-66
data:          Provisioning State        :Succeeded
data:          Name                      :quick-westu-1363648838-nic
data:          Location                  :westus
data:            Public IP address       :137.135.33.58
data:            FQDN                    :quick-westu-1363648838-pip.westus.cloudapp.azure.com
data:
data:    Diagnostics Profile:
data:      BootDiagnostics Enabled       :true
data:      BootDiagnostics StorageUri    :https://cli13601687.blob.core.windows.net/
data:
data:      Diagnostics Instance View:
info:    vm quick-create command OK
```

You can now SSH into your VM on the default SSH port 22.

The `azure vm quick-create` quickly creates a VM so you can log in and get working. It does not have a complex environment, however, so if you want to customize your environment you can [use an Azure resource manager template to create a specific deployment quickly](virtual-machines-linux-cli-deploy-templates.md), or you can [create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-cli-deploy-templates.md).

The example above creates:

- an Azure Resource Group to deploy the VM into
- an Azure Storage account to hold the .vhd file that is the VM image
- an Azure Virtual Network and subnet to provide connectivity to the VM
- a virtual Network Interface Card (NIC) to associate the VM with the network
- a public IP address and subdomain prefix to provide an internet address for external use and then creates the Linux VM inside that environment.

This VM is exposed directly to the Internet, and is only secured by a username and password.

## Next Steps

Now you've created a Linux VM quickly to use for testing or demonstration purposes. You can create a more secure execution environment with a Linux VM in Azure by:

- [Create a Linux VM in Azure using Azure Templates](virtual-machines-linux-cli-deploy-templates.md)
- [Create an SSH-Secured Linux VM in Azure using Azure Templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
- [Create a Linux VM in Azure using the Azure CLI and customizing the infrastructure](virtual-machines-linux-create-cli-complete.md)

as well as any number of proprietary and open-source infrastructure deployment, configuration, and orchestration tools.
