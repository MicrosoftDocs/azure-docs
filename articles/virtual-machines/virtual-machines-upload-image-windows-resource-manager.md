<properties
	pageTitle="Upload a custom Windows VM image | Microsoft Azure"
	description="Learn to upload a Windows based virtual machine image to use with the Resource Manager deployment model."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/04/2016"
	ms.author="dkshir"/>

# Upload a Windows image (VHD) to Microsoft Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-machines-create-upload-vhd-windows-server.md).


This article shows you how to upload a virtual hard disk (VHD) with a Windows based operating system, so you can use it to create new Windows virtual machines using the Resource Manager deployment model. For more details about disks and VHDs in Microsoft Azure, see [About Disks and VHDs for Virtual Machines](virtual-machines-disks-vhds.md).



## Prerequisites

This article assumes you have:

1. **An Azure subscription** - If you don't have one, [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F). You get credits to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card won't be charged, unless you explicitly change your settings. You also can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). The MSDN subscription gives credits every month that you can use for paid Azure services.

2. **Microsoft Azure PowerShell 1.0.x** - Make sure you have the Microsoft Azure PowerShell version 1.0.x installed. We recommend using this version since new Resource Manager features will not be added to older PowerShell versions. Read [Azure PowerShell 1.0](https://azure.microsoft.com/blog/azps-1-0/) to know more about the version differences.

3. **Windows operating system stored in a .vhd file and attached to a virtual machine** - Multiple tools exist to create .vhd files. For example, you can use Hyper-V Manager to create a virtual machine and install the operating system. For instructions, see [Install the Hyper-V Role and configure a virtual machine](http://technet.microsoft.com/library/hh846766.aspx). For details about which Windows operating systems are supported, see [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/kb/2721672).

> [AZURE.IMPORTANT] The Hyper-V Manager will typically save your VM image in a VHDX format, which is not supported in Microsoft Azure. You can convert the disk to VHD format using Hyper-V Manager or the straightforward [Convert-VHD cmdlet](http://technet.microsoft.com/library/hh848454.aspx). To see how to use the PowerShell cmdlet, read [Converting Hyper-V .vhdx to .vhd file formats](https://blogs.technet.microsoft.com/cbernier/2013/08/29/converting-hyper-v-vhdx-to-vhd-file-formats-for-use-in-windows-azure/). To do this in Hyper-V, select your machine name on the left hand side, and then in the menu in the upper left corner, click **Action** > **Edit Disk...** > **Next** > locate your VHDX path > **Next** > **Convert** > **Next** > **VHD** > **Next** > choose either of the VHD types > **Next** > locate the path for your new VHD file > **Next** > **Finish**.


## Prepare the VHD for upload

This section shows you how to generalize your Windows virtual machine. This removes all your personal account information among other things. You will typically want to do this when you want to use this VM image to quickly deploy similar virtual machines. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

1. Log in to the Windows based virtual machine.

2. Open a command prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

3. In the **System Preparation Tool** dialog box, do the following:

	- In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked.

	- In **Shutdown Options**, select **Shutdown**.

	- Click **OK**.

	![Start Sysprep](./media/virtual-machines-upload-image-windows-resource-manager/sysprepgeneral.png)

</br>
## Create or find an Azure storage account

You will need a storage account in Azure to upload the VM image. You can either use an existing storage account or create new. You can use either the portal or the PowerShell to do this.

### Using the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Click **Browse** > **Storage accounts**.

3. Check if a storage account exists that you want to use for uploading this image. Note the name of this storage account. You can skip the next steps in this section if you are using an existing storage account.

4. If you want to create a new storage account, click **Add** and enter the following information:

 - Enter the **Name** for the storage account. It should contain between 3 to 24 lowercase letters and numbers only. This name becomes part of the URL you will use to access blob, files, and other resources from the storage account.

 - Select the **Type** of the storage account that you want to create. For more information, read [About Azure storage accounts](../storage/storage-create-storage-account.md).

 - Enter the name of the **Resource Group**. The portal will create a new resource group if it cannot find an existing one with that name.

 - Choose the **Location** for the storage account.

 - Click **Create**. The account now appears under the **Storage accounts** panel.

  ![Enter storage account details](./media/virtual-machines-upload-image-windows-resource-manager/portal_create_storage_account.png)

 - You can create a new blob container in this storage account by clicking **Blobs** in the **Services** tile. This is an optional step, as the PowerShell command to upload the image can also create a new blob container for your image.

	![Blob service](./media/virtual-machines-upload-image-windows-resource-manager/portal_create_blob.png)

 - Once the blob panel shows up, click **+ Container** to create a new blob storage container. Enter the name of the container and the access type.

	![Create new blob](./media/virtual-machines-upload-image-windows-resource-manager/portal_create_container.png)

> [AZURE.NOTE] By default, the container is private and can be accessed only by the account owner. To allow public read access to the blobs in the container, but not the container properties and metadata, use the **Blob** option. To allow full public read access for the container and blobs, use the **Container** option.

 - The **Blob service** panel will list the new blob container. Note down the URL of this container; you will need this for the PowerShell command to upload the image. Depending on the length of the URL and your screen resolution, the URL may get partly hidden; if that happens, maximize the panel by clicking the *Maximize* icon on the upper right corner.


### Using PowerShell

1. Open the Azure PowerShell 1.0.x and login to your Azure account.

		Login-AzureRmAccount

	This command will open a pop-up window to enter your Azure credentials.

2. If the subscription id selected by default is different from the one you want to work in, use either of the following to set the right subscription.

		Set-AzureRmContext -SubscriptionId "xxxx-xxxx-xxxx-xxxx"

	or

		Select-AzureRmSubscription -SubscriptionId "xxxx-xxxx-xxxx-xxxx"

	You can find the subscriptions your Azure account has by using the command `Get-AzureRmSubscription`.

3. Find the storage accounts available under this subscription.

		Get-AzureRmStorageAccount

4. If you wish to create a new storage account to hold this image, follow these steps:

 - Make sure you have a resource group for this storage account. Find out all resource groups in your subscription by using:

			Get-AzureRmResourceGroup

	 You can create a resource group by using:

 			New-AzureRmResourceGroup -Name YourResourceGroup -Location "West US"

 - Create a new storage account in this resource group by using:

			New-AzureRmStorageAccount -ResourceGroupName YourResourceGroup -Name YourStorageAccountName -Location "West US" -Type "Standard_GRS"


</br>
## Upload VM image

Use these steps in Azure PowerShell, to upload the VM image to the storage account you created in the above section.

1. Login to Azure PowerShell 1.0.x using `Login-AzureRmAccount` and make sure you are using the right subscription using `Set-AzureRmContext`, as mentioned in the section above.

2. Add the generalized Azure VHD to the storage account using the [Add-AzureRmVhd](https://msdn.microsoft.com/library/mt603554.aspx):

		Add-AzureRmVhd -ResourceGroupName YourResourceGroup -Destination "<StorageAccountURL>/<BlobContainer>/<TargetVHDName>.vhd" -LocalFilePath <LocalPathOfVHDFile>

	Where:
	- **StorageAccountURL** is the URL for the storage account. It will typically be of this format: `https://YourStorageAccountName.blob.core.windows.net`. Note that you will need to use the name of the existing or new storage account in place of **YourStorageAccountName**.
	- **BlobContainer** is the blob container where you want to store your images. If the cmdlet does not find an existing blob container with this name, it will create a new one for you.
	- **TargetVHDName** is the name you want to save the image in the portal as.
	- **LocalPathOfVHDFile** is the full path and name of the .vhd file on your local machine.

	A successful `Add-AzureRmVhd` execution will look like this:

	![PowerShell Add-AzureRmVhd](./media/virtual-machines-upload-image-windows-resource-manager/powershell_upload_vhd.png)

	This command will take some time to complete, depending on your network connection and the size of your VHD file.

</br>
## Deploy a new VM from the uploaded image

Now you can use the uploaded image to create a new Windows VM. These steps show you how to use the Azure PowerShell and the VM image uploaded in the above steps, to create the VM in a new virtual network.

>[AZURE.NOTE] The VM image should be present in the same storage account as the actual virtual machine that will be created.

### Create network resources

Use the following sample PowerShell script to set up a virtual network and NIC for your new VM. Use values for the variables represented by the **$** sign as appropriate to your application.

	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix $vnetSubnetAddressPrefix

	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix $vnetAddressPrefix -Subnet $subnetconfig

	$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id

### Create a new VM

The following PowerShell script shows how to set up the virtual machine configurations and use the uploaded VM image as the source for the new installation.
</br>

	#Enter a new username and password in the pop-up for the following
	$cred = Get-Credential

	#Get the storage account where the uploaded image is stored
	$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName $storageAccName

	#Set the VM name and size
	#Use "Get-Help New-AzureRmVMConfig" to know the available options for -VMsize
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A4"

	#Set the Windows operating system configuration and add the NIC
	$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate

	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id

	#Create the OS disk URI
	$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName

	#Configure the OS disk to be created from image (-CreateOption fromImage) and give the URL of the uploaded image VHD for the -SourceImageUri parameter
	#You can find this URL in the result of the Add-AzureRmVhd cmdlet above
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $urlOfUploadedImageVhd -Windows

	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm

Your workflow could look something like this:

![PowerShell Create VM](./media/virtual-machines-upload-image-windows-resource-manager/powershell_create_vm.png)


You should see the newly created VM in either the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, OR by using the following PowerShell commands:

	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name


## Next steps

To manage your new virtual machine with the Azure PowerShell, read [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-deploy-rmtemplates-powershell.md).
