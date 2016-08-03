<properties
	pageTitle="Capture a Windows VM in Resource Manager | Microsoft Azure"
	description="Learn how to capture an image of a Windows-based Azure virtual machine (VM) created with the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/02/2016"
	ms.author="cynthn"/>

# How to capture a Windows virtual machine in the Resource Manager deployment model


This article shows you how to use Azure PowerShell to capture an Azure virtual machine (VM) that is running Windows so you can use it to create other virtual machines. This image includes the OS disk and the data disks that are attached to the virtual machine. It doesn't include the virtual network resources that you'll need to create a Windows VM, so you'll need to set those up before you create another virtual machine that uses the image. This image will also be prepared to be a [generalized Windows image](https://technet.microsoft.com/library/hh824938.aspx).


## Prerequisites

- These steps assume that you've already created an Azure virtual machine in the Resource Manager deployment model and configured the operating system, including attaching any data disks and making other customizations like installing applications. 

- You need to have Azure PowerShell version 1.0.x installed. If you haven't already installed PowerShell, read [How to install and configure Azure PowerShell](../powershell-install-configure.md) for installation steps.

## Prepare the source VM 

This section shows you how to generalize your Windows virtual machine. This removes all your personal account information, among other things. You will typically want to do this when you want to use this VM image to quickly deploy similar virtual machines.

> [AZURE.WARNING] Please note that the source virtual machine cannot be logged in via RDP once it is generalized, because the process removes all user accounts. This is an irreversible change. 

1. Sign in to your Windows virtual machine. In the [Azure portal](https://portal.azure.com), navigate through **Browse** > **Virtual machines** > Your Windows virtual machine > **Connect**.

2. Open a Command Prompt window as an administrator.

3. Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.

4. In the **System Preparation Tool** dialog box, do the following:

	- In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

	- In **Shutdown Options**, select **Shutdown**.

	- Click **OK**.

	![Run Sysprep](./media/virtual-machines-windows-capture-image/SysprepGeneral.png)

   Sysprep shuts down the virtual machine. Its status changes to **Stopped** in the Azure portal.


## Capture the VM

1. Open Azure PowerShell and sign in to your Azure account.

		Login-AzureRmAccount

	A pop-up window opens for you to enter your Azure account credentials.

2. Get the subscription IDs for your available subscriptions.

		Get-AzureRmSubscription

3. Set the correct subscription using the subscription ID.		

		Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"

4. Deallocate the resources that are used by this virtual machine by using this commmand.

		Stop-AzureRmVM -ResourceGroupName YourResourceGroup -Name YourWindowsVM

	You will see that the *Status* for the VM on the Azure portal has changed from **Stopped** to **Stopped (deallocated)**.

	>[AZURE.TIP] You can also find out the status of your virtual machine in PowerShell by using:</br>
	`$vm = Get-AzureRmVM -ResourceGroupName YourResourceGroup -Name YourWindowsVM -status`</br>
	`$vm.Statuses`</br> The **DisplayStatus** field corresponds to the **Status** shown in the Azure portal.

5. Next, you need to set the status of the virtual machine to **Generalized**. 

		Set-AzureRmVm -ResourceGroupName YourResourceGroup -Name YourWindowsVM -Generalized

	>[AZURE.NOTE] The generalized state as set above will not be shown on the portal. However, you can verify it by using the Get-AzureRmVM command as shown in the tip above.

6. Copy the virtual machine image to the destination storage container using this command.

		Save-AzureRmVMImage -ResourceGroupName YourResourceGroup -VMName YourWindowsVM -DestinationContainerName YourImagesContainer -VHDNamePrefix YourTemplatePrefix -Path Yourlocalfilepath\Filename.json

	The `-Path` variable is optional. You can use it to save the JSON template locally. The `-DestinationContainerName` variable is the name of the container that you want to hold your images. The URL of the image that is stored will be similar to `https://<storageAccountName>.blob.core.windows.net/system/Microsoft.Compute/Images/<imagesContainer>/<templatePrefix-osDisk>.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd`. It will be created in the same storage account as that of the original virtual machine.

	>[AZURE.NOTE] To find the location of your image, open the local JSON file template. Go to the **resources** > **storageProfile** > **osDisk** > **image** > **uri** section for the complete path of your image. You can also verify the URI in the portal; it will be copied to a blob named **system** in your storage account. 


## Create a virtual network

Create the vNet and subNet of the [virtual network](../virtual-network/virtual-networks-overview.md).
		

1. Replace the value of variables with your own information. Provide the address prefix for the subnet in CIDR format. Create the variables and the subnet.

    	$rgName = "<resourceGroup>"
		$location = "<location>"
        $subnetName = "<subNetName>"
        $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix <0.0.0.0/0>
        
2. Replace the value of **$vnetName** with a name for the virtual network. Provide the address prefix for the virtual network in CIDR format. Create the variable and the virtual network with the subnet.

        $vnetName = "<vnetName>"
        $vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $locName -AddressPrefix <0.0.0.0/0> -Subnet $singleSubnet
        
            
## Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Replace the value of **$ipName** with a name for the public IP address. Create the variable and the public IP address.

        $ipName = "<ipName>"
        $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
        
2. Replace the value of **$nicName** with a name for the network interface. Create the variable and the network interface.

        $nicName = "<nicName>"
        $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id


## Create the VM

The following PowerShell script shows how to set up the virtual machine configurations and use the uploaded VM image as the source for the new installation.

>[AZURE.NOTE] The VM needs to be in the same storage account as the uploaded VHD file.

</br>

	
	
	#Create variables
	# Enter a new user name and password to use as the local administrator account for the remotely accessing the VM
	$cred = Get-Credential
	
	# Name of the storage account where the VHD file is and where the OS disk will be created
	$storageAccName = "<storageAccountName>"
	
	# Name of the virtual machine
	$vmName = "<vmName>"
	
	# Size of the virtual machine. See the VM sizes documentation for more information: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-sizes/
	$vmSize = "<vmSize>"
	
	# Computer name for the VM
	$computerName = "<computerName>"
	
	# Name of the disk that holds the OS
	$osDiskName = "<osDiskName>"

	#Get the storage account where the uploaded image is stored
	$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName $storageAccName

	#Set the VM name and size
	#Use "Get-Help New-AzureRmVMConfig" to know the available options for -VMsize
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize

	#Set the Windows operating system configuration and add the NIC
	$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate

	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id

	#Create the OS disk URI
	$osDiskUri = '{0}vhds/{1}-{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName

	#Configure the OS disk to be created from the image (-CreateOption fromImage), and give the URL of the uploaded image VHD for the -SourceImageUri parameter
	#You set this variable when you uploaded the VHD
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $urlOfUploadedImageVhd -Windows

	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm



When complete, you should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name


## Next steps

To manage your new virtual machine with Azure PowerShell, see [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
