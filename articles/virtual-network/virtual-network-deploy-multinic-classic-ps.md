<properties 
   pageTitle="Deploy multi NIC VMs using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to deploy multi NIC VMs using PowerShell in the classic deployment model"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="11/03/2015"
   ms.author="telmos" />

#Deploy multi NIC VMs (classic) using PowerShell

[AZURE.INCLUDE [virtual-network-deploy-multinic-classic-selectors-include.md](../../includes/virtual-network-deploy-multinic-classic-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-deploy-multinic-intro-include.md](../../includes/virtual-network-deploy-multinic-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](virtual-network-deploy-multinic-arm-ps.md).

[AZURE.INCLUDE [virtual-network-deploy-multinic-scenario-include.md](../../includes/virtual-network-deploy-multinic-scenario-include.md)]

The sample Azure PowerShell commands below can be used to create the backend subnet and multi NIC VMs used as database servers.

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Deploy the back end VMs

Since VMs with single NICs and multiple NICs cannot coexist in the same cloud service deployment, you need to create a different cloud service for the backend VMs. You also need the following resources in place to create the multiNIC VMs:

- **Backend subnet**. The database servers will be part of a separate subnet, to segregate traffic. The script below expects this subnet to exist in a vnet named *WTestVnet*.
- **Storage account for data disks**. For better performance, the data disks on the database servers will use SSD, which requires a premium storage account. Make sure the Azure location you deploy to support premium storage.
- **Availability set**. All database servers will be added to a single availability set, to ensure at least one of the VMs is up and running during maintenance. 

### Step 1 - Start you script

You can download the full PowerShell script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/documentation-samples/multinic/classic/multinic.ps1). Follow the steps below to change the script to work in your environment.

1. Change the values of the variables below based on your existing resource group deployed above in [Prerequisites](#Prerequisites).

		$location              = "West US"
		$vnetName              = "WTestVNet"
		$backendSubnetName     = "BackEnd"

2. Change the values of the variables below based on the values you want to use for your backend deployment.

		$backendCSName         = "IaaSStory-Backend"
		$prmStorageAccountName = "iaasstoryprmstorage"
		$avSetName             = "ASDB"
		$vmSize                = "Standard_DS3"
		$diskSize              = 127
		$vmNamePrefix          = "DB"
		$dataDiskSuffix        = "datadisk"
		$ipAddressPrefix       = "192.168.2."
		$numberOfVMs           = 2

### Step 2 - Create necessary resources for your VMs

You need to create a new cloud service, and a storage account for the data disks for all VMs. You also need to specify an image, and a local admin account for the VMs. To create these resources, execute the following steps.

1. Create a new cloud service.

		New-AzureService -ServiceName $backendCSName -Location $location

2. Create a new premium storage account.

		New-AzureStorageAccount -StorageAccountName $prmStorageAccountName `
		    -Location $location `
		    -Type Premium_LRS

3. Set the storage account created above as the current storage account for your subscription.

		$subscription = Get-AzureSubscription `
		    | where {$_.IsCurrent -eq $true}  
		Set-AzureSubscription -SubscriptionName $subscription.SubscriptionName `
		    -CurrentStorageAccountName $prmStorageAccountName

4. Select an image for the VM.

		$image = Get-AzureVMImage `
		    | where{$_.ImageFamily -eq "SQL Server 2014 RTM Web on Windows Server 2012 R2"} `
		    | sort PublishedDate -Descending `
		    | select -ExpandProperty ImageName -First 1

5. Set the local administrator account credentials.

		$cred = Get-Credential -Message "Enter username and password for local admin account"

### Step 3 - Create VMs

You need to use a loop to create as many VMs as you want, and create the necessary NICs and VMs within the loop. To create the NICs and VMs, execute the following steps.

1. Start a `for` loop to repeat the commands to create a VM and two NICs as many times as necessary, based on the value of the `$numberOfVMs` variable.

		for ($suffixNumber = 1; $suffixNumber -le $numberOfVMs; $suffixNumber++){

2. Create a `VMConfig` object specifying the image, size, and availability set for the VM.

		    $vmName = $vmNamePrefix + $suffixNumber
		    $vmConfig = New-AzureVMConfig -Name $vmName `
		                    -ImageName $image `
		                    -InstanceSize $vmSize `
		                    -AvailabilitySetName $avSetName  

3. Provision the VM as a Windows VM.

		    Add-AzureProvisioningConfig -VM $vmConfig -Windows `
		        -AdminUsername $cred.UserName `
		        -Password $cred.Password

4. Set the default NIC and assign it a static IP address.

		    Set-AzureSubnet -SubnetNames $backendSubnetName -VM $vmConfig
		    Set-AzureStaticVNetIP -IPAddress ($ipAddressPrefix+$suffixNumber+3) -VM $vmConfig

5. Add a second NIC for each VM.

		    Add-AzureNetworkInterfaceConfig -Name ("RemoteAccessNIC"+$suffixNumber) `
		        -SubnetName $backendSubnetName `
		        -StaticVNetIPAddress ($ipAddressPrefix+(53+$suffixNumber)) `
		        -VM $vmConfig 

6. Create to data disks for each VM.

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

7. Create each VM, and end the loop.

		    New-AzureVM -VM $vmConfig `
		        -ServiceName $backendCSName `
		        -Location $location `
		        -VNetName $vnetName
		}

### Step 4 - Run the script

Now that you downloaded and changed the script based on your needs, runt he script to create the back end database VMs with multiple NICs.

1. Save your script and run it from the **PowerShell** command prompt, or **PowerShell ISE**. You will see the initial output, as shown below.

		OperationDescription    OperationId                          OperationStatus
		--------------------    -----------                          ---------------
		New-AzureService        xxxxxxxx-xxxx-xxxx-bf4e-xxxxxxxxxxxx Succeeded      
		New-AzureStorageAccount xxxxxxxx-xxxx-xxxx-bf4e-xxxxxxxxxxxx Succeeded      
		                                                                            
		WARNING: No deployment found in service: 'IaaSStory-Backend'.

2. Fill out the information needed in the credentials prompt and click **OK**. The output below will be displayed.

		New-AzureVM             xxxxxxxx-xxxx-xxxx-bf4e-xxxxxxxxxxxx Succeeded
		New-AzureVM             xxxxxxxx-xxxx-xxxx-bf4e-xxxxxxxxxxxx Succeeded 
