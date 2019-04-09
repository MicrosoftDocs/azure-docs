---
title: Differences and considerations for managed disks and managed images in Azure Stack | Microsoft Docs
description: Learn about differences and considerations when working with managed disks and managed images in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2019
ms.author: sethm
ms.reviewer: jiahan
ms.lastreviewed: 03/23/2019

---

# Azure Stack managed disks: differences and considerations

This article summarizes the known differences between [Azure Stack managed disks](azure-stack-manage-vm-disks.md) and [managed disks for Azure](../../virtual-machines/windows/managed-disks-overview.md). To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) article.

Managed disks simplifies disk management for IaaS VMs by managing the [storage accounts](../azure-stack-manage-storage-accounts.md) associated with the VM disks.

> [!Note]  
> Managed disks on Azure Stack is available from the 1808 update. It is enabled by default when creating virtual machines using the Azure Stack portal, starting with the 1811 update.
  
## Cheat sheet: managed disk differences

| Feature | Azure (global) | Azure Stack |
| --- | --- | --- |
|Encryption for Data at Rest |Azure Storage Service Encryption (SSE), Azure Disk Encryption (ADE)     |BitLocker 128-bit AES encryption      |
|Image          | Support managed custom image |Supported|
|Backup options |Support Azure Backup Service |Not yet supported |
|Disaster recovery options |Support Azure Site Recovery |Not yet supported|
|Disk types     |Premium SSD, Standard SSD (Preview), and Standard HDD |Premium SSD, Standard HDD |
|Premium disks  |Fully supported |Can be provisioned, but no performance limit or guarantee  |
|Premium disks IOPs  |Depends on disk size  |2300 IOPs per disk |
|Premium disks throughput |Depends on disk size |145 MB/second per disk |
|Disk size  |Azure Premium Disk: P4 (32 GiB) to P80 (32 TiB)<br>Azure Standard SSD Disk: E10 (128 GiB) to E80 (32 TiB)<br>Azure Standard HDD Disk: S4 (32 GiB) to S80 (32 TiB) |M4: 32 GiB<br>M6: 64 GiB<br>M10: 128 GiB<br>M15: 256 GiB<br>M20: 512 GiB<br>M30: 1024 GiB |
|Disks snapshot copy|Snapshot Azure managed disks attached to a running VM supported|Not yet supported |
|Disks performance analytic |Aggregate metrics and per disk metrics supported |Not yet supported |
|Migration      |Provide tool to migrate from existing un-managed Azure Resource Manager VMs without the need to recreate the VM  |Not yet supported |

> [!NOTE]  
> Managed disks IOPs and throughput in Azure Stack is a cap number instead of a provisioned number, which may be impacted by hardware and workloads running in Azure Stack.

## Metrics

There are also differences with storage metrics:

- With Azure Stack, the transaction data in storage metrics does not differentiate internal or external network bandwidth.
- Azure Stack transaction data in storage metrics does not include virtual machine access to the mounted disks.

## API versions

Azure Stack managed disks supports the following API versions:

- 2017-03-30
- 2017-12-01

## Convert to managed disks

You can use the following script to convert a currently provisioned VM from unmanaged to managed disks. Replace the placeholders with your own values:

```powershell
$subscriptionId = 'subid'

# The name of your resource group where your VM to be converted exists
$resourceGroupName ='rgmgd'

# The name of the managed disk
$diskName = 'unmgdvm'

# The size of the disks in GB. It should be greater than the VHD file size.
$diskSize = '50'

# The URI of the VHD file that will be used to create the managed disk.
# The VHD file can be deleted as soon as the managed disk is created.
$vhdUri = 'https://rgmgddisks347.blob.local.azurestack.external/vhds/unmgdvm20181109013817.vhd' 

# The storage type for the managed disk; PremiumLRS or StandardLRS.
$accountType = 'StandardLRS'

# The Azure Stack location where the managed disk will be located.
# The location should be the same as the location of the storage account in which VHD file is stored.
# Configure the new managed VM point to the old unmanaged VM's configuration (network config, vm name, location).
$location = 'local'
$virtualMachineName = 'mgdvm'
$virtualMachineSize = 'Standard_D1'
$pipname = 'unmgdvm-ip'
$virtualNetworkName = 'rgmgd-vnet'
$nicname = 'unmgdvm295'

# Set the context to the subscription ID in which the managed disk will be created
Select-AzureRmSubscription -SubscriptionId $SubscriptionId

#Delete old VM, but keep the OS disk
Remove-AzureRmVm -Name $virtualMachineName -ResourceGroupName $resourceGroupName

$diskConfig = New-AzureRmDiskConfig -AccountType $accountType  -Location $location -DiskSizeGB $diskSize -SourceUri $vhdUri -CreateOption Import

# Create managed disk
New-AzureRmDisk -DiskName $diskName -Disk $diskConfig -ResourceGroupName $resourceGroupName
$disk = get-azurermdisk -DiskName $diskName -ResourceGroupName $resourceGroupName
$VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize

# Use the managed disk resource ID to attach it to the virtual machine.
# Change the OS type to Linux if the OS disk has Linux OS.
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -ManagedDiskId $disk.Id -CreateOption Attach -Linux

# Create a public IP for the VM
$publicIp = Get-AzureRmPublicIpAddress -Name $pipname -ResourceGroupName $resourceGroupName 

# Get the virtual network where the virtual machine will be hosted
$vnet = Get-AzureRmVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $resourceGroupName

# Create NIC in the first subnet of the virtual network
$nic = Get-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $resourceGroupName

$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nic.Id

# Create the virtual machine with managed disk
New-AzureRmVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $location
```

## Managed images

Azure Stack supports *managed images*, which enable you to create a managed image object on a generalized VM (both unmanaged and managed) that can only create managed disk VMs going forward. Managed images enable the following two scenarios:

- You have generalized unmanaged VMs and want to use managed disks going forward.
- You have a generalized managed VM and would like to create multiple, similar managed VMs.

### Step 1: Generalize the VM

For Windows, follow the [Generalize the Windows VM using Sysprep](/azure/virtual-machines/windows/capture-image-resource#generalize-the-windows-vm-using-sysprep) section. For Linux, follow Step 1 [here](/azure/virtual-machines/linux/capture-image#step-1-deprovision-the-vm).

> [!NOTE]
> Make sure to generalize your VM. Creating a VM from an image that has not been properly generalized will lead to a **VMProvisioningTimeout** error.

### Step 2: Create the managed image

You can use the portal, PowerShell or CLI to create the managed image. Follow the steps in the Azure article [here](/azure/virtual-machines/windows/capture-image-resource).

### Step 3: Choose the use case

#### Case 1: Migrate unmanaged VMs to managed disks

Make sure to generalize your VM correctly before performing this step. After generalization, you can no longer use this VM. Creating a VM from an image that has not been properly generalized will lead to a **VMProvisioningTimeout** error.

Follow the instructions [here](../../virtual-machines/windows/capture-image-resource.md#create-an-image-from-a-vhd-in-a-storage-account) to create a managed image from a generalized VHD in a storage account. You can use this image going forward to create managed VMs.

#### Case 2: Create managed VM from managed image using Powershell

After creating an image from an existing managed disk VM using the script [here](../../virtual-machines/windows/capture-image-resource.md#create-an-image-from-a-managed-disk-using-powershell), the following example script creates a similar Linux VM from an existing image object:

Azure Stack PowerShell module 1.7.0 or later: follow the instructions [here](../../virtual-machines/windows/create-vm-generalized-managed.md).

Azure Stack PowerShell module 1.6.0 or earlier:

```powershell
# Variables for common values
$resourceGroup = "myResourceGroup"
$location = "redmond"
$vmName = "myVM"
$imagerg = "managedlinuxrg"
$imagename = "simplelinuxvmm-image-2019122"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzureRmResourceGroup -Name $resourceGroup -Location $location

# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

$image = get-azurermimage -ResourceGroupName $imagerg -ImageName $imagename

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize Standard_D1 | `
Set-AzureRmVMOperatingSystem -Linux -ComputerName $vmName -Credential $cred | `
Set-AzureRmVMSourceImage -Id $image.Id | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

You can also use the portal to create a VM from a managed image. For more information, see the Azure managed image articles [Create a managed image of a generalized VM in Azure](../../virtual-machines/windows/capture-image-resource.md) and [Create a VM from a managed image](../../virtual-machines/windows/create-vm-generalized-managed.md).

## Configuration

After applying the 1808 update or later, you must perform the following configuration before using managed disks:

- If a subscription was created before the 1808 update, follow below steps to update the subscription. Otherwise, deploying VMs in this subscription might fail with an error message “Internal error in disk manager.”
   1. In the Tenant portal, go to **Subscriptions** and find the subscription. Click **Resource Providers**, then click **Microsoft.Compute**, and then click **Re-register**.
   2. Under the same subscription, go to **Access Control (IAM)**, and verify that **Azure Stack – Managed Disk** is listed.
- If you use a multi-tenant environment, ask your cloud operator (who may be in your own organization, or from the service provider) to reconfigure each of your guest directories following the steps in [this article](../azure-stack-enable-multitenancy.md#registering-azure-stack-with-the-guest-directory). Otherwise, deploying VMs in a subscription associated with that guest directory might fail with an error message "Internal error in disk manager."

## Next steps

- [Learn about Azure Stack virtual machines](azure-stack-compute-overview.md)
