<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of your specialized Azure VM running Windows, in the Resource Manager deployment model."
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
	ms.date="09/21/2016"
	ms.author="cynthn"/>

# Create a VM from a specialized VHD

Create a new VM from a specialized VHD.



## Create a VM from a specialized VHD 

The quickest way to create a VM from a specialized VHD is to use a [quick start template](https://azure.microsoft.com/documentation/templates/201-vm-from-specialized-vhd/). 

To use this quick start template, you need to provice the following information:
- osDiskVhdUriUri - Uri of the VHD. This is in the format: `https://<storageAccountName>.blob.core.windows.net/<containerName>/<vhdName>.vhd`.
- osType - the operating system type, either Windows or Linux 
- vmSize - [Size of the VM](virtual-machines-windows-sizes.md) 
- vmName - the name you want to use for the new VM 


## Create variables

```powershell
$sourceRG = "<sourceResourceGroupName>"
$destinationRG = "<destinationResourceGroupName>"

$vm = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Compute/virtualMachines" -ResourceName "<vmName>"
$storageAccount = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Storage/storageAccounts" -ResourceName "<storageAccountName>"

$diagStorageAccount = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Storage/storageAccounts" -ResourceName "<diagnosticStorageAccountName>"


$vNet = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/virtualNetworks" -ResourceName "<vNetName>"
$nic = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/networkInterfaces" -ResourceName "<nicName>"
$ip = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/publicIPAddresses" -ResourceName "<ipName>"
$nsg = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/networkSecurityGroups" -ResourceName "<nsgName>"
```



## Create a VM by using the copied VHD

By using the VHD copied in the preceding steps, you can now use Azure PowerShell to create a Resource Manager-based Windows VM in a new virtual network. The VHD should be present in the same storage account as the new virtual machine that will be created.


Set up a virtual network and NIC for your new VM, similar to following script. Use values for the variables (represented by the **$** sign) as appropriate to your application.

```powershell
	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix $vnetSubnetAddressPrefix

	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix $vnetAddressPrefix -Subnet $subnetconfig

	$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
```

Now set up the VM configurations, create a new VM and attach the copied VHD as the OS VHD.


```powershell
	#Set the VM name and size
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"

	#Add the NIC
	$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id

	#Add the OS disk by using the URL of the copied OS VHD
	$osDiskName = $vmName + "osDisk"
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption attach -Windows

	#Add data disks by using the URLs of the copied data VHDs at the appropriate Logical Unit Number (Lun)
	$dataDiskName = $vmName + "dataDisk"
	$vm = Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -VhdUri $dataDiskUri -Lun 0 -CreateOption attach
```

The data and operating system disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this on the portal by browsing to the target storage container, clicking the operating system or data VHD that was copied, and then copying the contents of the URL.

```powershell
	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
```

If this command was successful, you'll see output like this:

	RequestId IsSuccessStatusCode StatusCode ReasonPhrase
	--------- ------------------- ---------- ------------
	                         True         OK OK


You should see the newly created VM either in the [Azure portal](https://portal.azure.com), under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name
```

## Next steps
To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine.







