<properties
	pageTitle="Upload a Windows VHD for Resource Manager | Microsoft Azure"
	description="Learn to upload a Windows virtual machine image to use with the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/29/2016"
	ms.author="cynthn"/>

# Upload a Windows VM image to Azure for Resource Manager deployments


This article shows you how to upload a virtual hard disk (VHD) with a Windows operating system so that you can use it to create new Windows virtual machines (VMs) using the Azure Resource Manager deployment model. For more details about disks and VHDs in Azure, see [About disks and VHDs for virtual machines](virtual-machines-linux-about-disks-vhds.md).



## Prerequisites

This article assumes that you have:

- **An Azure subscription** - If you don't already have one, [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F) and [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

- **Azure PowerShell version 1.4 or above** - If you don't already have it installed, read [How to install and configure Azure PowerShell](../powershell-install-configure.md).

- **A virtual machine running Windows** - There are many tools for creating virtual machines on-premises. For example, see [Install the Hyper-V Role and configure a virtual machine](http://technet.microsoft.com/library/hh846766.aspx). To know which Windows operating systems are supported by Azure, see [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/kb/2721672).


## Make sure that the VM has the right file format

Azure can accept images only for [generation 1 virtual machines](http://blogs.technet.com/b/ausoemteam/archive/2015/04/21/deciding-when-to-use-generation-1-or-generation-2-virtual-machines-with-hyper-v.aspx) that are saved in the VHD file format. The VHD size must be fixed and a whole number of megabytes, i.e. a number divisible by 8. The maximum size allowed for the VHD is 1,023 GB.

- If you have a Windows VM image in VHDX format, convert it to a VHD using either of the following:

	- Hyper-V: Open Hyper-V and select your local computer on the left. Then in the menu above it, click **Action** > **Edit Disk...**. Navigate through the screens by clicking **Next** and entering these options: *Path for your VHDX file* > **Convert** > **VHD** > **Fixed size** > *Path for the new VHD file*. Click **Finish** to close.

	- [Convert-VHD PowerShell cmdlet](http://technet.microsoft.com/library/hh848454.aspx): Read the blog post [Converting Hyper-V .vhdx to .vhd file formats](https://blogs.technet.microsoft.com/cbernier/2013/08/29/converting-hyper-v-vhdx-to-vhd-file-formats-for-use-in-windows-azure/) for more information.

- If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). Read the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx) for more information.


## Prepare the VHD for upload

This section shows you how to generalize your Windows virtual machine. This removes all your personal account information, among other things. You will typically want to do this when you want to use this VM image to quickly deploy similar virtual machines. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

1. Sign in to the Windows virtual machine.

2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

3. In the **System Preparation Tool** dialog box, do the following:

	1. In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.

	2. In **Shutdown Options**, select **Shutdown**.

	3. Click **OK**.

	![Start Sysprep](./media/virtual-machines-windows-upload-image/sysprepgeneral.png)

</br>


## Login to Azure

1. Open Azure PowerShell and sign in to your Azure account.

		Login-AzureRmAccount

	This command will open a pop-up window for you to enter your Azure credentials.

2. Get the subscription IDs for all of the available subscriptions.

		Get-AzureRmSubscription

3. Set the correct subscription using the subscription ID.		

		Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"

	
## Get the storage account

You will need a storage account in Azure to upload the VM image. You can either use an existing storage account or create a new one. 

Find all of the storage accounts that are available.

		Get-AzureRmStorageAccount

If you want to use an existing storage account, proceed to the [Upload the VM image](#upload_the_vm_image_to_your_storage_account) section.


If you want to create a new storage account, follow these steps:

1. Make sure that you have a resource group for this storage account. Find out all the resource groups that are in your subscription by using:

		Get-AzureRmResourceGroup

2. If you want to create a new resource group, use this command:

		New-AzureRmResourceGroup -Name <resourceGroupName> -Location "West US"

3. Create a new storage account in this resource group by using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet:

		New-AzureRmStorageAccount -ResourceGroupName <resourceGroupName> -Name <storageAccountName> -Location "<location>" -SkuName "<skuName>" -Kind "Storage"
			
Valid values for -SkuName are:

- **Standard_LRS** - Locally-redundant storage. 
- **Standard_ZRS** - Zone-redundant storage.
- **Standard_GRS** - Geo-redundant storage. 
- **Standard_RAGRS** - Read access geo-redundant storage. 
- **Premium_LRS** - Premium locally-redundant storage. 



## Upload the VM image to your storage account

Your image will be uploaded to a blob storage container in this account. You can either use an existing container or create a new one.

Add the generalized Azure VHD to the storage account by using the [Add-AzureRmVhd](https://msdn.microsoft.com/library/mt603554.aspx) cmdlet:

		$rgName = "<resourceGroupName>"
		$urlOfUploadedImageVhd = "<storageAccount>/<blobContainer>/<targetVHDName>.vhd"
		Add-AzureRmVhd -ResourceGroupName $rgName -Destination $urlOfUploadedImageVhd -LocalFilePath <localPathOfVHDFile>

	Where:
	- **storageAccount** the name of the storage account where you want the image to be placed. 
	- **blobContainer** is the blob container where you want to store your image. If the cmdlet does not find an existing blob container with this name, it will create a new one for you.
	- **targetVHDName** is the name that you want to use for the uploaded VHD file.
	- **localPathOfVHDFile** is the full path and name of the .vhd file on your local machine.

	A successful `Add-AzureRmVhd` execution will look similar to the following:

		C:\> Add-AzureRmVhd -ResourceGroupName testUpldRG -Destination https://testupldstore2.blob.core.windows.net/testblobs/WinServer12.vhd -LocalFilePath "C:\temp\WinServer12.vhd"
		MD5 hash is being calculated for the file C:\temp\WinServer12.vhd.
		MD5 hash calculation is completed.
		Elapsed time for the operation: 00:03:35
		Creating new page blob of size 53687091712...
		Elapsed time for upload: 01:12:49

		LocalFilePath           DestinationUri
		-------------           --------------
		C:\temp\WinServer12.vhd https://testupldstore2.blob.core.windows.net/testblobs/WinServer12.vhd

	This command will take some time to complete, depending on your network connection and the size of your VHD file.

</br>


## Create a virtual network

Create the vNet and subNet of the [virtual network](../virtual-network/virtual-networks-overview.md).

1. Replace the value of **$subnetName** with a name for the subnet. Create the variable and the subnet.
    	
        $subnetName = "<subnetName>"
        $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
        
2. Replace the value of **$vnetName** with a name for the virtual network. Create the variable and the virtual network with the subnet.

        $vnetName = "<vnetName>"
		$location = "<location>"
		$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix <0.0.0.0/0> -Subnet $singleSubnet
        
    You should use values that make sense for your application and environment.
        
## Create a public IP address and NIC

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a NIC.

1. Replace the value of **$ipName** with a name for the public IP address. Create the variable and the public IP address.

        $ipName = "<ipAddressName>"
        $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic
        
2. Replace the value of **$nicName** with a name for the network interface. Create the variable and the network interface.

        $nicName = "<nicName>"
        $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id

		

### Create a new VM

The following PowerShell script shows how to set up the virtual machine configurations and use the uploaded VM image as the source for the new installation.

>[AZURE.NOTE] You need to create the VM in the same storage account as the uploaded VHD file.

</br>

	#Enter a new user name and password in the pop-up window for the following
	$cred = Get-Credential
	
	#Create variables
	
	$storageAccName = "<storageAccountName>"
	$vmName = "<vmName>"
	$vmSize = "<vmSize>"
	$computerName = "<computerName>"

	#Get the storage account where the uploaded image is stored
	$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName $storageAccName

	#Set the VM name and size
	#Use "Get-Help New-AzureRmVMConfig" to know the available options for -VMsize
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize

	#Set the Windows operating system configuration and add the NIC
	$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate

	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id

	#Create the OS disk URI
	$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName

	#Configure the OS disk to be created from the image (-CreateOption fromImage), and give the URL of the uploaded image VHD for the -SourceImageUri parameter
	#You set this variable when you uploaded the VHD
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $urlOfUploadedImageVhd -Windows

	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm



When complete, you should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name


## Next steps

To manage your new virtual machine by using Azure PowerShell, read [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
