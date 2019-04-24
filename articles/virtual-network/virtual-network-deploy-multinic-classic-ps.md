---
title: Create a VM (Classic) with multiple NICs - Azure PowerShell | Microsoft Docs
description: Learn how to create a VM (Classic) with multiple NICs using PowerShell.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: 6e50f39a-2497-4845-a5d4-7332dbc203c5
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/31/2018
ms.author: genli
ms.custom: H1Hack27Feb2017

---
# Create a VM (Classic) with multiple NICs using PowerShell

[!INCLUDE [virtual-network-deploy-multinic-classic-selectors-include.md](../../includes/virtual-network-deploy-multinic-classic-selectors-include.md)]

You can create virtual machines (VMs) in Azure and attach multiple network interfaces (NICs) to each of your VMs. Multiple NICs enable separation of traffic types across NICs. For example, one NIC might communicate with the Internet, while another communicates only with internal resources not connected to the Internet. The ability to separate network traffic across multiple NICs is required for many network virtual appliances, such as application delivery and WAN optimization solutions.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to perform these steps using the [Resource Manager deployment model](../virtual-machines/windows/multiple-nics.md).

[!INCLUDE [virtual-network-deploy-multinic-scenario-include.md](../../includes/virtual-network-deploy-multinic-scenario-include.md)]

The following steps use a resource group named *IaaSStory* for the WEB servers and a resource group named *IaaSStory-BackEnd* for the DB servers.

## Prerequisites

Before you can create the DB servers, you need to create the *IaaSStory* resource group with all the necessary resources for this scenario. To create these resources, complete the steps that follow. Create a virtual network by following the steps in the [Create a virtual network](virtual-networks-create-vnet-classic-netcfg-ps.md) article.

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Create the back-end VMs
The back-end VMs depend on the creation of the following resources:

* **Backend subnet**. The database servers will be part of a separate subnet, to segregate traffic. The script below expects this subnet to exist in a vnet named *WTestVnet*.
* **Storage account for data disks**. For better performance, the data disks on the database servers will use solid state drive (SSD) technology, which requires a premium storage account. Make sure the Azure location you deploy to support premium storage.
* **Availability set**. All database servers will be added to a single availability set, to ensure at least one of the VMs is up and running during maintenance.

### Step 1 - Start your script
You can download the full PowerShell script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/11-MultiNIC/classic/virtual-network-deploy-multinic-classic-ps.ps1). Follow the steps below to change the script to work in your environment.

1. Change the values of the variables below based on your existing resource group deployed above in [Prerequisites](#prerequisites).

	```powershell
	$location              = "West US"
	$vnetName              = "WTestVNet"
	$backendSubnetName     = "BackEnd"
	```

2. Change the values of the variables below based on the values you want to use for your backend deployment.

	```powershell
	$backendCSName         = "IaaSStory-Backend"
	$prmStorageAccountName = "iaasstoryprmstorage"
	$avSetName             = "ASDB"
	$vmSize                = "Standard_DS3"
	$diskSize              = 127
	$vmNamePrefix          = "DB"
	$dataDiskSuffix        = "datadisk"
	$ipAddressPrefix       = "192.168.2."
	$numberOfVMs           = 2
	```

### Step 2 - Create necessary resources for your VMs
You need to create a new cloud service and a storage account for the data disks for all VMs. You also need to specify an image, and a local administrator account for the VMs. To create these resources, complete the following steps:

1. Create a new cloud service.

	```powershell
	New-AzureService -ServiceName $backendCSName -Location $location
	```

2. Create a new premium storage account.

	```powershell
	New-AzureStorageAccount -StorageAccountName $prmStorageAccountName `
	-Location $location -Type Premium_LRS
	```
3. Set the storage account created above as the current storage account for your subscription.

	```powershell
	$subscription = Get-AzureSubscription | where {$_.IsCurrent -eq $true}  
	Set-AzureSubscription -SubscriptionName $subscription.SubscriptionName `
	-CurrentStorageAccountName $prmStorageAccountName
	```

4. Select an image for the VM.

	```powershell
	$image = Get-AzureVMImage `
	| where{$_.ImageFamily -eq "SQL Server 2014 RTM Web on Windows Server 2012 R2"} `
	| sort PublishedDate -Descending `
	| select -ExpandProperty ImageName -First 1
	```

5. Set the local administrator account credentials.

	```powershell
	$cred = Get-Credential -Message "Enter username and password for local admin account"
	```

### Step 3 - Create VMs
You need to use a loop to create as many VMs as you want, and create the necessary NICs and VMs within the loop. To create the NICs and VMs, execute the following steps.

1. Start a `for` loop to repeat the commands to create a VM and two NICs as many times as necessary, based on the value of the `$numberOfVMs` variable.

	```powershell
	for ($suffixNumber = 1; $suffixNumber -le $numberOfVMs; $suffixNumber++){
	```

2. Create a `VMConfig` object specifying the image, size, and availability set for the VM.

	```powershell
	$vmName = $vmNamePrefix + $suffixNumber
	$vmConfig = New-AzureVMConfig -Name $vmName `
		-ImageName $image `
		-InstanceSize $vmSize `
		-AvailabilitySetName $avSetName
	```

3. Provision the VM as a Windows VM.

	```powershell
	Add-AzureProvisioningConfig -VM $vmConfig -Windows `
		-AdminUsername $cred.UserName `
		-Password $cred.GetNetworkCredential().Password
	```

4. Set the default NIC and assign it a static IP address.

	```powershell
	Set-AzureSubnet			-SubnetNames $backendSubnetName -VM $vmConfig
	Set-AzureStaticVNetIP 	-IPAddress ($ipAddressPrefix+$suffixNumber+3) -VM $vmConfig
	```

5. Add a second NIC for each VM.

	```powershell
	Add-AzureNetworkInterfaceConfig -Name ("RemoteAccessNIC"+$suffixNumber) `
	-SubnetName $backendSubnetName `
	-StaticVNetIPAddress ($ipAddressPrefix+(53+$suffixNumber)) `
	-VM $vmConfig
	```
	
6. Create to data disks for each VM.

	```powershell
	$dataDisk1Name = $vmName + "-" + $dataDiskSuffix + "-1"    
	Add-AzureDataDisk -CreateNew -VM $vmConfig `
	-DiskSizeInGB $diskSize `
	-DiskLabel $dataDisk1Name `
	-LUN 0

	$dataDisk2Name = $vmName + "-" + $dataDiskSuffix + "-2"   
	Add-AzureDataDisk -CreateNew -VM $vmConfig `
	-DiskSizeInGB $diskSize `
	-DiskLabel $dataDisk2Name `
	-LUN 1
	```

7. Create each VM, and end the loop.

	```powershell
	New-AzureVM -VM $vmConfig `
	-ServiceName $backendCSName `
	-Location $location `
	-VNetName $vnetName
	}
	```

### Step 4 - Run the script
Now that you downloaded and changed the script based on your needs, runt the script to create the back-end database VMs with multiple NICs.

1. Save your script and run it from the **PowerShell** command prompt, or **PowerShell ISE**. You will see the initial output, as shown below.

		OperationDescription    OperationId                          OperationStatus

		New-AzureService        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Succeeded
		New-AzureStorageAccount xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Succeeded
		
		WARNING: No deployment found in service: 'IaaSStory-Backend'.
2. Fill out the information needed in the credentials prompt and click **OK**. The following output is returned.

		New-AzureVM             xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Succeeded
		New-AzureVM             xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Succeeded

### Step 5 - Configure routing within the VM's operating system

Azure DHCP assigns a default gateway to the first (primary) network interface attached to the virtual machine. Azure does not assign a default gateway to additional (secondary) network interfaces attached to a virtual machine. Therefore, you are unable to communicate with resources outside the subnet that a secondary network interface is in, by default. Secondary network interfaces can, however, communicate with resources outside their subnet. To configure routing for secondary network interfaces, see the following articles:

- [Configure a Windows VM for multiple NICs](../virtual-machines/windows/multiple-nics.md#configure-guest-os-for-multiple-nics
)

- [Configure a Linux VM for multiple NICs](../virtual-machines/linux/multiple-nics.md#configure-guest-os-for-multiple-nics
)
