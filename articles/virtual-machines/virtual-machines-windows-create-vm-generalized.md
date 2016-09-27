<properties
	pageTitle="Create VM from a generalized VHD | Microsoft Azure"
	description="Learn how to create a Windows virtual machine from a generalized VHD image using Azure PowerShell, in the Resource Manager deployment model."
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
	ms.date="09/19/2016"
	ms.author="cynthn"/>

# Create a VM from a generalized VHD image

A generalized VHD image has had all of your personal account information removed using Sysprep. If you intend to use the VHD as an image to create new VMs from, you should generalize the VHD by following the instructions in [Prepare a Windows VHD to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md) and then [Generalize a Windows virtual machine using Sysprep](virtual-machines-windows-generalize-vhd.md). 

Once the VHD has been generalized, you can use that VHD image to create a new VM using Azure PowerShell.



## Set the VHD to generalized and create an image

1. Set the VHD to generalized using [Set-AzureRmVM](https://msdn.microsoft.com/en-us/library/mt603688.aspx).

```powershell
	Set-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName> -Generalized
```

2. Create an image from the VHD file using [Save-AzureRMVMImage](https://msdn.microsoft.com/en-us/library/mt619423.aspx).

```powershell
	Save-AzureRmVMImage -ResourceGroupName <resourceGroup> -VMName <vmName> -DestinationContainerName <containerName> -VHDNamePrefix <vhdNamePrefix>
```



## Create a virtual network

Create the vNet and subNet of the [virtual network](../virtual-network/virtual-networks-overview.md).


1. Replace the value of variables with your own information. Provide the address prefix for the subnet in CIDR format. Create the variables and the subnet.

```powershell
	$rgName = "<resourceGroup>"
	$location = "<location>"
	$subnetName = "<subNetName>"
	$singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix <0.0.0.0/0>
```
      
2. Replace the value of **$vnetName** with a name for the virtual network. Provide the address prefix for the virtual network in CIDR format. Create the variable and the virtual network with the subnet.

```powershell
	$vnetName = "<vnetName>"
	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName 
	$rgName -Location $location -AddressPrefix <0.0.0.0/0> -Subnet $singleSubnet
```    
            
## Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Replace the value of **$ipName** with a name for the public IP address. Create the variable and the public IP address.

```powershell
	$ipName = "<ipName>"
	$pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
```       

2. Replace the value of **$nicName** with a name for the network interface. Create the variable and the network interface.

```powershell
$nicName = "<nicName>"
$nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
```

## Create the VM

The following PowerShell script shows how to set up the virtual machine configurations and use the uploaded VM image as the source for the new installation.

>[AZURE.NOTE] The VM needs to be in the same storage account as the original VHD.

</br>


```powershell
	#Create variables
	# Enter a new user name and password to use as the local administrator account for the remotely accessing the VM
	$cred = Get-Credential
	
	# Name of the storage account 
	$storageAccName = "<storageAccountName>"
	
	# Name of the virtual machine
	$vmName = "<vmName>"
	
	# Size of the virtual machine. See the VM sizes documentation for more information: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-sizes/
	$vmSize = "<vmSize>"
	
	# Computer name for the VM
	$computerName = "<computerName>"
	
	# Name of the disk that holds the OS
	$osDiskName = "<osDiskName>"
	
	# Assign a SKU name
	# Valid values for -SkuName are: **Standard_LRS** - locally redundant storage, **Standard_ZRS** - zone redundant storage, **Standard_GRS** - geo redundant storage, **Standard_RAGRS** - read access geo redundant storage, **Premium_LRS** - premium locally redundant storage. 
	$skuName = "<skuName>"
	
	# Create a new storage account for the VM
	New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $storageAccName -Location $location -SkuName $skuName -Kind "Storage"

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
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $imageURI -Windows

	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
```


When complete, you should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name
```

## Next steps

To manage your new virtual machine with Azure PowerShell, see [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).


