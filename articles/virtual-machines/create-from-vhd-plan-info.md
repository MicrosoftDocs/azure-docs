---
title: Deploy a new VM from existing VHD using Plan Information.
description: Learn how to Deploy a new VM from existing VHD using Plan Information using Powershell or Azure Cloudshell
author: saggupta
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/07/2020
ms.author: saggupta
ms.reviewer: akjosh

---

# Create a new VM from an existing OS disk with plan information using Powershell or Azure Cloudshell
This article walks you through the steps to create a new VM from an existing VHD provided you have the plan information that was initially used to create a new VM. This article will use PowerShell or Azure Cloudshell to deploy/create a new VM from an exiting VHD. 

## Before you begin

- Before you create a new VM using the VHD, ensure you have the plan information with which the VM was initially deployed.
- You can also use the plan information of any other VM provided it was made using the same image. (The steps below will talk about gathering plan information for a VM)

# Get the VM plan information

Follow the steps below to gather the plan information for an exitsing VM.

1. Navigate to the Virtual Machine on the Azure Portal.
2. Next, go to to the Export Template blade for the VM.
3. Search for plan in the template that appears on the screen.
4. Below is the structure of plan information for a VM.

```
   "plan": {
                   "name": "Plan_Name",
                   "product": "Product_Name",
                   "publisher": "Product_Publisher"
               },
```
5. Copy the plan information for use in the script later.

### Note: The images and the plan information for third party images are managed, updated and changed by the respective vendors.

# Create a Windows VM with an existing VHD using plan information

```
$ResourceGroupName = "myResourceGroup"
$Location = "WestEurope"
$vmSize = "Standard_B2s"
$vmName = "myVM"
$vm = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize
$netRGName="networkResourceGroup" (Stores the resource group name of the network resources stores in another group, if all VM resources are in the same RG, then $netRGName=$ResourceGroupName)
$nicName="myNIC"
$vnetName="myVNET"
$vnet=Get-AzureRmVirtualNetwork -ResourceGroupName $netRGName -Name $vnetName
$nic = Get-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $ResourceGroupName
$nicId = $nic.Id
$pip=New-AzureRMPublicIpAddress -Name $nicName -ResourceGroupName $netRGName -Location $Location -AllocationMethod Static

$nic=New-AzureRMNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $Location -SubnetId "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/subnetName" -PublicIpAddressId $pip.Id

$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Compute/disks/OsDisk" -CreateOption attach -Windows
$vm = Set-AzureRmVMBootDiagnostics -VM $vm -Enable -ResourceGroupName $ResourceGroupName -StorageAccountName "storageAccountName" (In case if the VM had boot diagnostics enabled)

$vm = Add-AzVMNetworkInterface -VM $vm -Id $nic.Id

$vm.Plan = New-Object -TypeName 'Microsoft.Azure.Management.Compute.Models.Plan'
$vm.Plan.Name = 'Plan_Name'
$vm.Plan.Product = 'Product_Name'
$vm.Plan.Publisher = 'Publisher'

New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $vm
```

# Create a Linux VM with an existing VHD using plan information
```
$ResourceGroupName = "myResourceGroup"
$Location = "WestEurope"
$vmSize = "Standard_B2s"
$vmName = "myVM"
$vm = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize
$netRGName="networkResourceGroup" (Stores the resource group name of the network resources stores in another group, if all VM resources are in the same RG, then $netRGName=$ResourceGroupName)
$nicName="myNIC"
$vnetName="myVNET"
$vnet=Get-AzureRmVirtualNetwork -ResourceGroupName $netRGName -Name $vnetName
$nic = Get-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $ResourceGroupName
$nicId = $nic.Id
$pip=New-AzureRMPublicIpAddress -Name $nicName -ResourceGroupName $netRGName -Location $Location -AllocationMethod Static

$nic=New-AzureRMNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $Location -SubnetId "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/subnetName" -PublicIpAddressId $pip.Id

$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Compute/disks/OsDisk" -CreateOption attach -Linux
$vm = Set-AzureRmVMBootDiagnostics -VM $vm -Enable -ResourceGroupName $ResourceGroupName -StorageAccountName "storageAccountName" (In case if the VM had boot diagnostics enabled)

$vm = Add-AzVMNetworkInterface -VM $vm -Id $nic.Id

$vm.Plan = New-Object -TypeName 'Microsoft.Azure.Management.Compute.Models.Plan'
$vm.Plan.Name = 'Plan_Name'
$vm.Plan.Product = 'Product_Name'
$vm.Plan.Publisher = 'Publisher'

New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $vm
```

# Create a VM with plan info in an availability set

The VM can be deployed in an availability set using the same script above with some modifications. The only changes you need to do is to add --availabilitysetid "ResourceURI", to the $vm argument above.

For example inorder to create a VM in an availability set, the only changes that are to be made in the script above, is shown below:

```
$vm = New-AzureRmVMConfig -VMName $vmname -VMSize $vmsize -availabilitysetid "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Compute/availabilitySets/avsetName"
```

# Create a Windows VM with using plan info of another VM which was created using the same image as our deleted VM

The below script uses the plan information of another VM that was originally deployed using the same image. In this PowerShell we donot enter the plan information exclusively but the plan information is collected from another VM in the same subscription.

```
$resourceGroupName ='myResourceGroup'
$osDiskName = 'OS_Disk'
$nicName1 = "nic"
$virtualMachineName = 'myVM'
$virtualMachineSize = 'Standard_DS1_v2'
$origRG = "Origin_VM_rgName"
$origVMname = "Original_Name"
$VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize
$disk = Get-AzureRmDisk -ResourceGroupName $resourceGroupName -DiskName $osDiskName
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -ManagedDiskId $disk.Id -CreateOption Attach -Windows
$nic1 = Get-AzureRmNetworkInterface -ResourceGroupName $resourceGroupName -Name $nicName1
$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nic1.Id -Primary
$origVM = Get-AzureRmVM -ResourceGroupName $origRG -Name $origVMname
$VirtualMachine.Plan = $origVM.Plan
New-AzureRmVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $disk.Location
```

## Next steps

For more information about finding and using Marketplace images, see [Find and use Azure Marketplace images](./windows/cli-ps-findimage.md).
