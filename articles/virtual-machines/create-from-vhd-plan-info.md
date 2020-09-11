---
title: Deploy a new VM from existing VHD using Plan Information.
description: Learn how to Deploy a new VM from existing VHD using Plan Information using Powershell or Azure Cloudshell
author: saggupta
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 09/11/2020
ms.author: saggupta
ms.reviewer: akjosh

---

# Create a new VM from an existing OS disk with plan information using Powershell or Azure Cloudshell
This article walks you through the steps to create a new VM from an existing VHD provided you have the plan information that was initially used to create a new VM. This article will use PowerShell or Azure Cloudshell to deploy/create a new VM from an exiting VHD. 

## Before you begin

- Before you create a new VM using the VHD, ensure you have the plan information with which the VM was initially deployed.
- You can also use the plan information of any other VM provided it was made using the same image. (The steps below will talk about gathering plan information for a VM)
- In case the plan information was not captured before the VM was deleted, please raise a case with Microsoft Support sharing the VM name, subscription Id and the time stamp of the delete operation.

## Get the VM plan information

Follow the steps below to gather the plan information for an exitsing VM.

1. Navigate to the VM in the [Azure portal](https://portal.azure.com).
2. In the left menu, select **Export template**.
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

> [NOTE]
> The VHDs and plan information for third party images are managed, updated and changed by the respective vendors.


## Create a VM with an existing VHD using plan information


```
#Get Existing variables
$ResourceGroupName = "myResourceGroup"
$Location = "WestEurope"
$vmSize = "Standard_B2s"
$vmName = "myVM"
$netRGName="networkResourceGroup" (Stores the resource group name of the network resources stores in another group, if all VM resources are in the same RG, then $netRGName=$ResourceGroupName)
$nicName="myNIC"
$vnetName="myVNET"
$subnetid="/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/subnetName"
$manageddiskid= "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Compute/disks/OsDisk"


#Incase you want to create the VM in an availability set, follow the commands below, else you may skip to the next command.
$vm = New-AzVMConfig -VMName $vmname -VMSize $vmsize -availabilitysetid "/subscriptions/858ede8a-f6bb-44cc-9f2e-7cc2a364d556/resourceGroups/ESET/providers/Microsoft.Compute/availabilitySets/avset"

# Create VM Configuration Details, donot run this again if you have already run the above command
$vm = New-AzVMConfig -VMName $vmName -VMSize $vmSize

#Use below commands to use existing - unattached NIC for VM creation. If need new NIC, please skip to New NIC section
$vnet=Get-AzVirtualNetwork -ResourceGroupName $netRGName -Name $vnetName
$nic = Get-AzNetworkInterface -Name $nicName -ResourceGroupName $ResourceGroupName
$nicId = $nic.Id
```

## Create a Linux VM with an existing VHD using plan information

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

#If you want to you Public IP, please use this command, else skip to "without PIP" section:
$vnet=Get-AzVirtualNetwork -ResourceGroupName $netRGName -Name $vnetName
$pip=New-AzPublicIpAddress -Name $nicName -ResourceGroupName $netRGName -Location $Location -AllocationMethod Static
$nic=New-AzNetworkInterface -Name $nicName -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $subnetid -PublicIpAddressId $pip.Id
>>>>>>> d1faed295aad4c88592bb656526ae097888d1874
$nicId = $nic.Id

#Without PIP
$vnet=Get-AzVirtualNetwork -ResourceGroupName $netRGName -Name $vnetName
$pip=New-AzPublicIpAddress -Name $nicName -ResourceGroupName $netRGName -Location $Location -AllocationMethod Static
$nic=New-AzNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $Location -SubnetId $subnetid
$nicId = $nic.Id

#Set OS Disk configuration, use -linux for Linux VM, else use -windows for Windows VM
$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId $manageddiskid -CreateOption attach -Windows
$vm = Set-AzVMBootDiagnostics -VM $vm -Enable -ResourceGroupName $ResourceGroupName -StorageAccountName "storageAccountName" (In case if the VM had boot diagnostics enabled)

#Add Nic created/used above to the VM
$vm = Add-AzVMNetworkInterface -VM $vm -Id $nic.Id

#Update the VM with the plan information
$vm.Plan = New-Object -TypeName 'Microsoft.Azure.Management.Compute.Models.Plan'
$vm.Plan.Name = 'Plan_Name'
$vm.Plan.Product = 'Product_Name'
$vm.Plan.Publisher = 'Publisher'

#Deploy/Create a VM
New-AzVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $vm 

```

## Create a VM with plan info in an availability set

The VM can be deployed in an availability set using the same script above with some modifications. The only changes you need to do is to add --availabilitysetid "ResourceURI", to the $vm argument above.

For example inorder to create a VM in an availability set, the only changes that are to be made in the script above, is shown below:

```
$vm = New-AzureRmVMConfig -VMName $vmname -VMSize $vmsize -availabilitysetid "/subscriptions/858xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/rgName/providers/Microsoft.Compute/availabilitySets/avsetName"
```

## Create a Windows VM using plan info of another VM 

The below script uses the plan information of another VM that was originally deployed using the same image. In this PowerShell we donot enter the plan information exclusively but the plan information is collected from another VM in the same subscription.

```
#Get Existing variables
$resourceGroupName ='ESET2'
$osDiskName = 'vmname01_OsDisk_1_45bcab26959f4e96a1ea032d1836b4d6'
$nicName1 = "vmnic01"
$virtualMachineName = 'sbc01'
$virtualMachineSize = 'Standard_DS1_v2'
$origRG = "ESET"
$origVMname = "VMfromVHD"

# Create VM Configuration Details:
$VirtualMachine = New-AzVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize

#Gets the properties of a Managed disk
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $osDiskName

#Set OS Disk configuration, use -linux for Linux VM, else use -windows for Windows VM
$VirtualMachine = Set-AzVMOSDisk -VM $VirtualMachine -ManagedDiskId $disk.Id -CreateOption Attach -Windows

#Use below commands to use existing - unattached NIC for VM creation and add it to the VM config
$nic1 = Get-AzNetworkInterface -ResourceGroupName $resourceGroupName -Name $nicName1
$VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $nic1.Id -Primary

#Get Original VM details
$origVM = Get-AzVM -ResourceGroupName $origRG -Name $origVMname

#Capture plan info of the original(existing VM)
$VirtualMachine.Plan = $origVM.Plan

#Create a new VM
New-AzVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $disk.Location 

```

## Next steps

For more information about finding and using Marketplace images, see [Find and use Azure Marketplace images](./windows/cli-ps-findimage.md).
