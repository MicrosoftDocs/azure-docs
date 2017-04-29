---
title: Create a VM with multiple NICs - Azure PowerShell | Microsoft Docs
description: Learn how to create a VM with multiple NICs using PowerShell.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 88880483-8f9e-4eeb-b783-64b8613407d9
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/02/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a VM with multiple NICs using PowerShell

> [!div class="op_single_selector"]
> * [PowerShell](virtual-network-deploy-multinic-arm-ps.md)
> * [Azure CLI](virtual-network-deploy-multinic-arm-cli.md)
> * [Template](virtual-network-deploy-multinic-arm-template.md)
> * [PowerShell (Classic)](virtual-network-deploy-multinic-classic-ps.md)
> * [Azure CLI (Classic)](virtual-network-deploy-multinic-classic-cli.md)

[!INCLUDE [virtual-network-deploy-multinic-intro-include.md](../../includes/virtual-network-deploy-multinic-intro-include.md)]

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md).  This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the [classic deployment model](virtual-network-deploy-multinic-classic-ps.md).
>

[!INCLUDE [virtual-network-deploy-multinic-scenario-include.md](../../includes/virtual-network-deploy-multinic-scenario-include.md)]

The following steps use a resource group named *IaaSStory* for the WEB servers and a resource group named *IaaSStory-BackEnd* for the DB servers.

## Prerequisites
Before you can create the DB servers, you need to create the *IaaSStory* resource group with all the necessary resources for this scenario. To create these resources, complete the following steps:

1. Navigate to [the template page](https://github.com/Azure/azure-quickstart-templates/tree/master/IaaS-Story/11-MultiNIC).
2. In the template page, to the right of **Parent resource group**, click **Deploy to Azure**.
3. If needed, change the parameter values, then follow the steps in the Azure preview portal to deploy the resource group.

> [!IMPORTANT]
> Make sure your storage account names are unique. You cannot have duplicate storage account names in Azure.
> 

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Create the back-end VMs
The back-end VMs depend on the creation of the following resources:

* **Storage account for data disks**. For better performance, the data disks on the database servers will use solid state drive (SSD) technology, which requires a premium storage account. Make sure the Azure location you deploy to support premium storage.
* **NICs**. Each VM will have two NICs, one for database access, and one for management.
* **Availability set**. All database servers will be added to a single availability set, to ensure at least one of the VMs is up and running during maintenance.  

### Step 1 - Start your script
You can download the full PowerShell script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/11-MultiNIC/arm/virtual-network-deploy-multinic-arm-ps.ps1). Follow the steps below to change the script to work in your environment.

1. Change the values of the variables below based on your existing resource group deployed above in [Prerequisites](#Prerequisites).

	```powershell
	$existingRGName        = "IaaSStory"
	$location              = "West US"
	$vnetName              = "WTestVNet"
	$backendSubnetName     = "BackEnd"
	$remoteAccessNSGName   = "NSG-RemoteAccess"
	$stdStorageAccountName = "wtestvnetstoragestd"
	```

2. Change the values of the variables below based on the values you want to use for your backend deployment.

	```powershell
	$backendRGName         = "IaaSStory-Backend"
	$prmStorageAccountName = "wtestvnetstorageprm"
	$avSetName             = "ASDB"
	$vmSize                = "Standard_DS3"
	$publisher             = "MicrosoftSQLServer"
	$offer                 = "SQL2014SP1-WS2012R2"
	$sku                   = "Standard"
	$version               = "latest"
	$vmNamePrefix          = "DB"
	$osDiskPrefix          = "osdiskdb"
	$dataDiskPrefix        = "datadisk"
	$diskSize               = "120"    
	$nicNamePrefix         = "NICDB"
	$ipAddressPrefix       = "192.168.2."
	$numberOfVMs           = 2
	```
3. Retrieve the existing resources needed for your deployment.

	```powershell
	$vnet                  = Get-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $existingRGName
	$backendSubnet         = $vnet.Subnets|?{$_.Name -eq $backendSubnetName}
	$remoteAccessNSG       = Get-AzureRmNetworkSecurityGroup -Name $remoteAccessNSGName -ResourceGroupName $existingRGName
	$stdStorageAccount     = Get-AzureRmStorageAccount -Name $stdStorageAccountName -ResourceGroupName $existingRGName
	```

### Step 2 - Create necessary resources for your VMs
You need to create a new resource group, a storage account for the data disks, and an availability set for all VMs. You alos need the local administrator account credentials for each VM. To create these resources, execute the following steps.

1. Create a new resource group.

	```powershell
	New-AzureRmResourceGroup -Name $backendRGName -Location $location
	```
2. Create a new premium storage account in the resource group created above.

	```powershell
	$prmStorageAccount = New-AzureRmStorageAccount -Name $prmStorageAccountName `
	-ResourceGroupName $backendRGName -Type Premium_LRS -Location $location
	```
3. Create a new availability set.

	```powershell
	$avSet = New-AzureRmAvailabilitySet -Name $avSetName -ResourceGroupName $backendRGName -Location $location
	```
4. Get the local administrator account credentials to be used for each VM.

	```powershell
	$cred = Get-Credential -Message "Type the name and password for the local administrator account."
	```

### Step 3 - Create the NICs and back-end VMs
You need to use a loop to create as many VMs as you want, and create the necessary NICs and VMs within the loop. To create the NICs and VMs, execute the following steps.

1. Start a `for` loop to repeat the commands to create a VM and two NICs as many times as necessary, based on the value of the `$numberOfVMs` variable.
   
	```powershell
	for ($suffixNumber = 1; $suffixNumber -le $numberOfVMs; $suffixNumber++){
	```

2. Create the NIC used for database access.

	```powershell
	$nic1Name = $nicNamePrefix + $suffixNumber + "-DA"
	$ipAddress1 = $ipAddressPrefix + ($suffixNumber + 3)
	$nic1 = New-AzureRmNetworkInterface -Name $nic1Name -ResourceGroupName $backendRGName `
	-Location $location -SubnetId $backendSubnet.Id -PrivateIpAddress $ipAddress1
	```

3. Create the NIC used for remote access. Notice how this NIC has an NSG associated to it.

	```powershell
	$nic2Name = $nicNamePrefix + $suffixNumber + "-RA"
	$ipAddress2 = $ipAddressPrefix + (53 + $suffixNumber)
	$nic2 = New-AzureRmNetworkInterface -Name $nic2Name -ResourceGroupName $backendRGName `
	-Location $location -SubnetId $backendSubnet.Id -PrivateIpAddress $ipAddress2 `
	-NetworkSecurityGroupId $remoteAccessNSG.Id
	```

4. Create `vmConfig` object.

	```powershell
	$vmName = $vmNamePrefix + $suffixNumber
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avSet.Id
	```

5. Create two data disks per VM. Notice that the data disks are in the premium storage account created earlier.

	```powershell
	$dataDisk1Name = $vmName + "-" + $osDiskPrefix + "-1"
	$data1VhdUri = $prmStorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $dataDisk1Name + ".vhd"
	Add-AzureRmVMDataDisk -VM $vmConfig -Name $dataDisk1Name -DiskSizeInGB $diskSize `
	-VhdUri $data1VhdUri -CreateOption empty -Lun 0

	$dataDisk2Name = $vmName + "-" + $dataDiskPrefix + "-2"
	$data2VhdUri = $prmStorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $dataDisk2Name + ".vhd"
	Add-AzureRmVMDataDisk -VM $vmConfig -Name $dataDisk2Name -DiskSizeInGB $diskSize `
	-VhdUri $data2VhdUri -CreateOption empty -Lun 1
	```

6. Configure the operating system, and image to be used for the VM.

	```powershell
	$vmConfig = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -PublisherName $publisher -Offer $offer -Skus $sku -Version $version
	```

7. Add the two NICs created above to the `vmConfig` object.

	```powershell
	$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic1.Id -Primary
	$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic2.Id
	```

8. Create the OS disk and create the VM. Notice the `}` ending the `for` loop.

	```powershell
	$osDiskName = $vmName + "-" + $osDiskSuffix
	$osVhdUri = $stdStorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $osDiskName + ".vhd"
	$vmConfig = Set-AzureRmVMOSDisk -VM $vmConfig -Name $osDiskName -VhdUri $osVhdUri -CreateOption fromImage
	New-AzureRmVM -VM $vmConfig -ResourceGroupName $backendRGName -Location $location
	}
	```

### Step 4 - Run the script
Now that you downloaded and changed the script based on your needs, runt he script to create the back end database VMs with multiple NICs.

1. Save your script and run it from the **PowerShell** command prompt, or **PowerShell ISE**. You will see the initial output, as follows:

		ResourceGroupName : IaaSStory-Backend
		Location          : westus
		ProvisioningState : Succeeded
		Tags              :
		Permissions       :
			Actions  NotActions
			=======  ==========
				*                  

		ResourceId        : /subscriptions/[Subscription ID]/resourceGroups/IaaSStory-Backend

2. After a few minutes, fill out the credentials prompt and click **OK**. The output below represents a single VM. Notice the entire process took 8 minutes to complete.

		ResourceGroupName            :
		Id                           :
		Name                         : DB2
		Type                         :
		Location                     :
		Tags                         :
		TagsText                     : null
		AvailabilitySetReference     : Microsoft.Azure.Management.Compute.Models.AvailabilitySetReference
		AvailabilitySetReferenceText : 	{
 									"ReferenceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/IaaSStory-Backend/providers/Microsoft.Compute/availabilitySets/ASDB"
									}
		Extensions                   :
		ExtensionsText               : null
		HardwareProfile              : Microsoft.Azure.Management.Compute.Models.HardwareProfile
		HardwareProfileText          : {
										"VirtualMachineSize": "Standard_DS3"
									   }
        InstanceView                 :
        InstanceViewText             : null
        NetworkProfile               :
        NetworkProfileText           : null
        OSProfile                    :
        OSProfileText                : null
        Plan                         :
        PlanText                     : null
        ProvisioningState            :
        StorageProfile               : Microsoft.Azure.Management.Compute.Models.StorageProfile
        StorageProfileText           : {
                                         "DataDisks": [
                                           {
                                             "Lun": 0,
                                             "Caching": null,
                                             "CreateOption": "empty",
                                             "DiskSizeGB": 127,
                                             "Name": "DB2-datadisk-1",
                                             "SourceImage": null,
                                             "VirtualHardDisk": {
                                               "Uri": "https://wtestvnetstorageprm.blob.core.windows.net/vhds/DB2-datadisk-1.vhd"
                                             }
                                           }
                                         ],
                                         "ImageReference": null,
                                         "OSDisk": null
                                       }
        DataDiskNames                : {DB2-datadisk-1}
        NetworkInterfaceIDs          :
        RequestId                    :
        StatusCode                   : 0

        ResourceGroupName            :
        Id                           :
        Name                         : DB2
        Type                         :
        Location                     :
        Tags                         :
        TagsText                     : null
        AvailabilitySetReference     : Microsoft.Azure.Management.Compute.Models.AvailabilitySetReference
        AvailabilitySetReferenceText : {
                                         "ReferenceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/IaaSStory-Backend/providers/
                                       Microsoft.Compute/availabilitySets/ASDB"
                                       }
        Extensions                   :
        ExtensionsText               : null
        HardwareProfile              : Microsoft.Azure.Management.Compute.Models.HardwareProfile
        HardwareProfileText          : {
                                         "VirtualMachineSize": "Standard_DS3"
                                       }
        InstanceView                 :
        InstanceViewText             : null
        NetworkProfile               :
        NetworkProfileText           : null
        OSProfile                    :
        OSProfileText                : null
        Plan                         :
        PlanText                     : null
        ProvisioningState            :
        StorageProfile               : Microsoft.Azure.Management.Compute.Models.StorageProfile
        StorageProfileText           : {
                                         "DataDisks": [
                                           {
                                             "Lun": 0,
                                             "Caching": null,
                                             "CreateOption": "empty",
                                             "DiskSizeGB": 127,
                                             "Name": "DB2-datadisk-1",
                                             "SourceImage": null,
                                             "VirtualHardDisk": {
                                               "Uri": "https://wtestvnetstorageprm.blob.core.windows.net/vhds/DB2-datadisk-1.vhd"
                                             }
                                           },
                                           {
                                             "Lun": 1,
                                             "Caching": null,
                                             "CreateOption": "empty",
                                             "DiskSizeGB": 127,
                                             "Name": "DB2-datadisk-2",
                                             "SourceImage": null,
                                             "VirtualHardDisk": {
                                               "Uri": "https://wtestvnetstorageprm.blob.core.windows.net/vhds/DB2-datadisk-2.vhd"
                                             }
                                           }
                                         ],
                                         "ImageReference": null,
                                         "OSDisk": null
                                       }
        DataDiskNames                : {DB2-datadisk-1, DB2-datadisk-2}
        NetworkInterfaceIDs          :
        RequestId                    :
        StatusCode                   : 0
        EndTime             : [Date] [Time]
        Error               :
        Output              :
        StartTime           : [Date] [Time]
        Status              : Succeeded
        TrackingOperationId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        RequestId           : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        StatusCode          : OK
