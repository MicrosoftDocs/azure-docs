<properties
	pageTitle="Create a virtual machine running Linux in Azure"
	description="Learn to create Azure virtual machine (VM) running Linux by using an image from Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="05/22/2015"
	ms.author="kathydav,rasquill"/>

# Create a Virtual Machine Running Linux

> [AZURE.SELECTOR]
- [Azure Portal](virtual-machines-linux-tutorial.md)
- [PowerShell](virtual-machines-ps-create-preconfigure-linux-vms.md)

Creating an Azure virtual machine (VM) that runs Linux is easy to do from the command line or from the portal. This tutorial shows you how to use the Azure Command-Line Interface for Mac, Linux, and Windows (the Azure CLI) to create quickly an Ubuntu Server VM running in Azure. You can also create Linux VMs using [your own images as templates](virtual-machines-linux-create-upload-vhd.md).

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## Install the Azure CLI

The first step [install the Azure CLI](xplat-cli-install.md). 

Good. Now make sure you're in the resource management mode by typing `azure config mode arm`. 

Even better. Now log in with your work or school id by typing `azure login` and following the prompts. 

> [AZURE.NOTE] If you receive an error logging in, you may need to [create a work or school id from your personal Microsoft account](resource-group-create-work-id-from-personal.md). 

## Create your Azure VM

Type `azure group create <my-group-name> westus` replacing _&lt;my-group-name&gt;_ with a group name that's unique to you (you can use a different region if you want). You should see something like the following:

	azure group create myuniquegroupname westus
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

Now create your VM by typing `azure vm quick-create`, and you'll receive prompts to input the remaining parameters. Use the name of the resource group that you just created, above, and for the **ImageURN** value, use `canonical:ubuntuserver:14.04.2-LTS:latest`, so that your experience looks something like:

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
	data:        Name                        :cli3c0464f24f1bf4f0-os-1432328438224
	data:        Caching                     :ReadWrite
	data:        CreateOption                :FromImage
	data:        Vhd:
	data:          Uri                       :https://cli3c0464f24f1bf4f014323.blob.core.windows.net/vhds/cli3c0464f24f1bf4f0-os-1432328438224.vhd
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

Your VM is up and running and waiting for you to connect.

## Connecting to your VM

This command uses usernames and passwords; to use public and private key pairs to communication with your VM, see 

	ssh ops@myuni-westu-1432328437727-pip.westus.cloudapp.azure.com -p 22
	The authenticity of host 'myuni-westu-1432328437727-pip.westus.cloudapp.azure.com (191.239.51.1)' can't be established.
	ECDSA key fingerprint is b4:22:9a:45:5e:55:59:bb:90:1e:45:55:41:8c:87:4c.
	Are you sure you want to continue connecting (yes/no)? yes
	Warning: Permanently added 'myuni-westu-1432328437727-pip.westus.cloudapp.azure.com,191.239.51.1' (ECDSA) to the list of known hosts.
	ops@myuni-westu-1432328437727-pip.westus.cloudapp.azure.com's password: 
	Welcome to Ubuntu 14.04.2 LTS (GNU/Linux 3.16.0-37-generic x86_64)
	
	 * Documentation:  https://help.ubuntu.com/
	
	  System information as of Fri May 22 21:02:32 UTC 2015
	
	  System load: 0.37              Memory usage: 2%   Processes:       207
	  Usage of /:  41.4% of 1.94GB   Swap usage:   0%   Users logged in: 0
	
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
	
	ops@myuniquevmname:~$ 

Now you're ready to attach a disk.

## Attach a disk



[AZURE.INCLUDE [virtual-machines-Linux-tutorial-log-on-attach-disk](../includes/virtual-machines-Linux-tutorial-log-on-attach-disk.md)]

> [AZURE.NOTE] You can also connect to your Linux virtual machine using an SSH key for identification. For details, see [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).

## Next Steps

To learn more about Linux on Azure, see:

- [Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)

- [How to use the Azure Command-Line Tools for Mac and Linux](virtual-machines-command-line-tools.md)

- [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-script-lamp.md)

- [About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

- [The Docker Virtual Machine Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
