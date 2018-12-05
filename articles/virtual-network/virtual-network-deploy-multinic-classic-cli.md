---
title: Create a VM (Classic) with multiple NICs - Azure classic CLI | Microsoft Docs
description: Learn how to create a VM (Classic) with multiple NICs using the Azure classic command-line interface (CLI).
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: b436e41e-866c-439f-a7c7-7b4b041725ef
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/02/2016
ms.author: genli
ms.custom: H1Hack27Feb2017

---
# Create a VM (Classic) with multiple NICs using the Azure classic CLI

[!INCLUDE [virtual-network-deploy-multinic-classic-selectors-include.md](../../includes/virtual-network-deploy-multinic-classic-selectors-include.md)]

You can create virtual machines (VMs) in Azure and attach multiple network interfaces (NICs) to each of your VMs. Multiple NICs enable separation of traffic types across NICs. For example, one NIC might communicate with the Internet, while another communicates only with internal resources not connected to the Internet. The ability to separate network traffic across multiple NICs is required for many network virtual appliances, such as application delivery and WAN optimization solutions.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to perform these steps using the [Resource Manager deployment model](../virtual-machines/linux/multiple-nics.md).

[!INCLUDE [virtual-network-deploy-multinic-scenario-include.md](../../includes/virtual-network-deploy-multinic-scenario-include.md)]

The following steps use a resource group named *IaaSStory* for the WEB servers and a resource group named *IaaSStory-BackEnd* for the DB servers.

## Prerequisites
Before you can create the DB servers, you need to create the *IaaSStory* resource group with all the necessary resources for this scenario. To create these resources, complete the steps that follow. Create a virtual network by following the steps in the [Create a virtual network](virtual-networks-create-vnet-classic-cli.md) article.

[!INCLUDE [azure-cli-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]

## Deploy the back-end VMs
The back-end VMs depend on the creation of the following resources:

* **Storage account for data disks**. For better performance, the data disks on the database servers will use solid state drive (SSD) technology, which requires a premium storage account. Make sure the Azure location you deploy to support premium storage.
* **NICs**. Each VM will have two NICs, one for database access, and one for management.
* **Availability set**. All database servers will be added to a single availability set, to ensure at least one of the VMs is up and running during maintenance.

### Step 1 - Start your script
You can download the full bash script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/11-MultiNIC/classic/virtual-network-deploy-multinic-classic-cli.sh). Complete the following steps to change the script to work in your environment:

1. Change the values of the variables below based on your existing resource group deployed above in [Prerequisites](#Prerequisites).

	```azurecli
	location="useast2"
	vnetName="WTestVNet"
	backendSubnetName="BackEnd"
	```
2. Change the values of the variables below based on the values you want to use for your backend deployment.

	```azurecli
	backendCSName="IaaSStory-Backend"
	prmStorageAccountName="iaasstoryprmstorage"
	image="0b11de9248dd4d87b18621318e037d37__RightImage-Ubuntu-14.04-x64-v14.2.1"
	avSetName="ASDB"
	vmSize="Standard_DS3"
	diskSize=127
	vmNamePrefix="DB"
	osDiskName="osdiskdb"
	dataDiskPrefix="db"
	dataDiskName="datadisk"
	ipAddressPrefix="192.168.2."
	username='adminuser'
	password='adminP@ssw0rd'
	numberOfVMs=2
	```

### Step 2 - Create necessary resources for your VMs
1. Create a new cloud service for all backend VMs. Notice the use of the `$backendCSName` variable for the resource group name, and `$location` for the Azure region.

	```azurecli
	azure service create --serviceName $backendCSName \
		--location $location
	```

2. Create a premium storage account for the OS and data disks to be used by yours VMs.

	```azurecli
	azure storage account create $prmStorageAccountName \
		--location $location \
		--type PLRS
	```

### Step 3 - Create VMs with multiple NICs
1. Start a loop to create multiple VMs, based on the `numberOfVMs` variables.

	```azurecli
	for ((suffixNumber=1;suffixNumber<=numberOfVMs;suffixNumber++));
	do
	```

2. For each VM, specify the name and IP address of each of the two NICs.

	```azurecli
	nic1Name=$vmNamePrefix$suffixNumber-DA
	x=$((suffixNumber+3))
	ipAddress1=$ipAddressPrefix$x

	nic2Name=$vmNamePrefix$suffixNumber-RA
	x=$((suffixNumber+53))
	ipAddress2=$ipAddressPrefix$x
	```

3. Create the VM. Notice the usage of the `--nic-config` parameter, containing a list of all NICs with name, subnet, and IP address.

	```azurecli
	azure vm create $backendCSName $image $username $password \
		--connect $backendCSName \
		--vm-name $vmNamePrefix$suffixNumber \
		--vm-size $vmSize \
		--availability-set $avSetName \
		--blob-url $prmStorageAccountName.blob.core.windows.net/vhds/$osDiskName$suffixNumber.vhd \
		--virtual-network-name $vnetName \
		--subnet-names $backendSubnetName \
		--nic-config $nic1Name:$backendSubnetName:$ipAddress1::,$nic2Name:$backendSubnetName:$ipAddress2::
	```

4. For each VM, create two data disks.

	```azurecli
	azure vm disk attach-new $vmNamePrefix$suffixNumber \
		$diskSize \
		vhds/$dataDiskPrefix$suffixNumber$dataDiskName-1.vhd

	azure vm disk attach-new $vmNamePrefix$suffixNumber \
		$diskSize \
		vhds/$dataDiskPrefix$suffixNumber$dataDiskName-2.vhd
	done
	```

### Step 4 - Run the script
Now that you downloaded and changed the script based on your needs, run the script to create the back end database VMs with multiple NICs.

1. Save your script and run it from your **Bash** terminal. You will see the initial output, as shown below.

        info:    Executing command service create
        info:    Creating cloud service
        data:    Cloud service name IaaSStory-Backend
        info:    service create command OK
        info:    Executing command storage account create
        info:    Creating storage account
        info:    storage account create command OK
        info:    Executing command vm create
        info:    Looking up image 0b11de9248dd4d87b18621318e037d37__RightImage-Ubuntu-14.04-x64-v14.2.1
        info:    Looking up virtual network
        info:    Looking up cloud service
        info:    Getting cloud service properties
        info:    Looking up deployment
        info:    Creating VM

2. After a few minutes, the execution will end and you will see the rest of the output as shown below.

        info:    OK
        info:    vm create command OK
        info:    Executing command vm disk attach-new
        info:    Getting virtual machines
        info:    Adding Data-Disk
        info:    vm disk attach-new command OK
        info:    Executing command vm disk attach-new
        info:    Getting virtual machines
        info:    Adding Data-Disk
        info:    vm disk attach-new command OK
        info:    Executing command vm create
        info:    Looking up image 0b11de9248dd4d87b18621318e037d37__RightImage-Ubuntu-14.04-x64-v14.2.1
        info:    Looking up virtual network
        info:    Looking up cloud service
        info:    Getting cloud service properties
        info:    Looking up deployment
        info:    Creating VM
        info:    OK
        info:    vm create command OK
        info:    Executing command vm disk attach-new
        info:    Getting virtual machines
        info:    Adding Data-Disk
        info:    vm disk attach-new command OK
        info:    Executing command vm disk attach-new
        info:    Getting virtual machines
        info:    Adding Data-Disk
        info:    vm disk attach-new command OK

### Step 5 - Configure routing within the VM's operating system

Azure DHCP assigns a default gateway to the first (primary) network interface attached to the virtual machine. Azure does not assign a default gateway to additional (secondary) network interfaces attached to a virtual machine. Therefore, you are unable to communicate with resources outside the subnet that a secondary network interface is in, by default. Secondary network interfaces can, however, communicate with resources outside their subnet. To configure routing for secondary network interfaces, see [Routing within a virtual machine operating system with multiple network interfaces](virtual-network-network-interface-vm.md).
