<properties
   pageTitle="Create a Linux VM from the CLI | Microsoft Azure"
   description="Create a new Linux VM on Microsoft Azure using the Azure CLI from Mac, Linux, or Windows."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="vlivech"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="02/02/2016"
   ms.author="v-livech"/>


# Create a Linux VM from the Azure CLI

This topic shows how to quickly create a new Linux-based Azure Virtual Machine using the `azure vm quick-create` command in Azure Command-line Interface for Mac, Linux, and Windows [the Azure CLI](../../xplat-cli-install.md). It assumes you are using either Mac OS X or a Linux distribution as your client operating system, but the same commands work on a Windows computer as well. 

> [AZURE.NOTE] This topic shows how to quickly create a Linux VM in a basic Azure environment for trial, testing, and other short-lived scenarios. You should create more secure Azure environments for your Linux VMs to use them for production or other longer-running scenarios. 

Quick links for other ways to create Linux VMs in Azure:

- [Create a Linux VM in Azure using the Azure Portal]()
- [Create a Linux VM in Azure using Azure Templates]()
- [Create a Linux VM in Azure using the Azure CLI and customizing the infrastructure]()

## Prerequisites

You'll need the following:

  - An Azure account. [Get a free trial.](https://azure.microsoft.com/pricing/free-trial/)
  - The Azure CLI. 
    - [Mac OSX installer](http://go.microsoft.com/fwlink/?linkid=252249&clcid=0x409), [Linux installer](http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409), [Windows installer](http://go.microsoft.com/?linkid=9828653&clcid=0x409)
    
You can also install the Azure CLI using popular package managers and as a Linux container:

    - Mac via **Homebrew** `brew install azure-cli`
    - Mac & Linux via **npm** `npm install -g azure-cli`
    - Mac & Linux via **Docker** `docker run -it microsoft/azure-cli`

## Quick Command Summary

There are only two commands to issue:

1. Create a resource group to deploy into.
2. Create your Linux VM.

In the following command examples, please replace values between &lt; and &gt; with values from your own environment. 


## Create the resource group

```
# Create a resource group to deploy the VM into
woz@macbook$ azure group create <my-group-name> westus
info:    Executing command group create
+ Getting resource group myuniquegroupname
+ Creating resource group myuniquegroupname
info:    Created resource group myuniquegroupname
data:    Id:                  /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myuniquegroupname
data:    Name:                myuniquegroupname
data:    Location:            westus
data:    Provisioning State:  Succeeded
data:    Tags:
data:
info:    group create command OK

```

## Create the Linux VM

In the following command, you can use any image you want, but this example uses `canonical:ubuntuserver:14.04.2-LTS:latest` to create a VM quickly. (To locate an image in the marketplace, [search for an image](../resource-groups-vm-searching.md) or you can [upload your own custom image](../virtual-machines-linux-create-upload-vhd.md).)

```
# Create the Linux VM using prompts
woz@macbook$ azure vm quick-create
azure vm quick-create
info:    Executing command vm quick-create
Resource group name: myuniquegroupname
Virtual machine name: myuniquevmname
Location name: westus
Operating system Type [Windows, Linux]: Linux
ImageURN (format: "publisherName:offer:skus:version"): canonical:ubuntuserver:14.04.2-LTS:latest
User name: ops
Password: *********
Confirm password: *********
+ Looking up the VM "myuniquevmname"
info:    Using the VM Size "Standard_D1"
info:    The [OS, Data] Disk or image configuration requires storage account
+ Retrieving storage accounts
info:    Could not find any storage accounts in the region "westus", trying to create new one
+ Creating storage account "cli3c0464f24f1bf4f014323" in "westus"
+ Looking up the storage account cli3c0464f24f1bf4f014323
+ Looking up the NIC "myuni-westu-1432328437727-nic"
info:    An nic with given name "myuni-westu-1432328437727-nic" not found, creating a new one
+ Looking up the virtual network "myuni-westu-1432328437727-vnet"
info:    Preparing to create new virtual network and subnet
/ Creating a new virtual network "myuni-westu-1432328437727-vnet" [address prefix: "10.0.0.0/16"] with subnet "myuni-westu-1432328437727-snet"+[address prefix: "10.0.1.0/24"]
+ Looking up the virtual network "myuni-westu-1432328437727-vnet"
+ Looking up the subnet "myuni-westu-1432328437727-snet" under the virtual network "myuni-westu-1432328437727-vnet"
info:    Found public ip parameters, trying to setup PublicIP profile
+ Looking up the public ip "myuni-westu-1432328437727-pip"
info:    PublicIP with given name "myuni-westu-1432328437727-pip" not found, creating a new one
+ Creating public ip "myuni-westu-1432328437727-pip"
+ Looking up the public ip "myuni-westu-1432328437727-pip"
+ Creating NIC "myuni-westu-1432328437727-nic"
+ Looking up the NIC "myuni-westu-1432328437727-nic"
+ Creating VM "myuniquevmname"
+ Looking up the VM "myuniquevmname"
+ Looking up the NIC "myuni-westu-1432328437727-nic"
+ Looking up the public ip "myuni-westu-1432328437727-pip"
data:    Id                              :/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myuniquegroupname/providers/Microsoft.Compute/virtualMachines/myuniquevmname
data:    ProvisioningState               :Succeeded
data:    Name                            :myuniquevmname
data:    Location                        :westus
data:    FQDN                            :myuni-westu-1432328437727-pip.westus.cloudapp.azure.com
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
data:        Name                        :cli3c04390845730984-os-982734982739487
data:        Caching                     :ReadWrite
data:        CreateOption                :FromImage
data:        Vhd:
data:          Uri                       :https://cli3c0464f20983745039845.blob.core.windows.net/vhds/cli3c04390845730984-os-982734982739487.vhd
data:
data:    OS Profile:
data:      Computer Name                 :myuniquevmname
data:      User Name                     :ops
data:      Linux Configuration:
data:        Disable Password Auth       :false
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Id                        :/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myuniquegroupname/providers/Microsoft.Network/networkInterfaces/myuni-westu-1432328437727-nic
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-31-55-31
data:          Provisioning State        :Succeeded
data:          Name                      :myuni-westu-1432328437727-nic
data:          Location                  :westus
data:            Private IP alloc-method :Dynamic
data:            Private IP address      :10.0.1.4
data:            Public IP address       :191.239.51.1
data:            FQDN                    :myuni-westu-1432328437727-pip.westus.cloudapp.azure.com
info:    vm quick-create command OK

```

You can now SSH into your VM on the default SSH port 22.

## Detailed Walkthrough

The `azure vm quick-create` quickly creates a VM so you can log in and get working. It does not have a complex environment, however, so if you want to customize your environment you can [use an Azure resource manager template to create a specific deployment quickly](TODO), or you can [create your own custom environment for a Linux VM using Azure CLI commands directly](). 

The example above creates:

- an Azure Storage account to hold the .vhd file that is the VM image
- an Azure Virtual Network and subnet to provide connectivity to the VM
- a virtual Network Interface Card (NIC) to associate the VM with the network
- a public IP address and subdomain prefix to provide an internet address for external use

and then creates the Linux VM inside that environment. This VM is exposed directly to the Internet, and is only secured by a username and password. 



## Next Steps

Now you've created a Linux VM quickly to use for testing or demonstration purposes. You can create a more secure execution environment with a Linux VM in Azure by:

- Creating your Linux VM and its environment using a more secure Azure resource manager template
- Creating your Linux VM and its environment using the Azure Portal
- Creating your Linux VM and its environment using direct Azure CLI commands

as well as any number of proprietary and open-source infrastructure deployment, configuration, and orchestration tools.
