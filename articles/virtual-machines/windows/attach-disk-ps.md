---
title: Attach a data disk to a Windows VM in Azure by using PowerShell
description: How to attach a new or existing data disk to a Windows VM using PowerShell with the Resource Manager deployment model.
author: roygara
ms.service: azure-disk-storage
ms.collection: windows
ms.topic: how-to
ms.date: 06/08/2022
ms.author: rogarana
ms.custom: devx-track-azurepowershell

---
# Attach a data disk to a Windows VM with PowerShell

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to attach both new and existing disks to a Windows virtual machine by using PowerShell. 

First, review these tips:

* The size of the virtual machine controls how many data disks you can attach. For more information, see [Sizes for virtual machines](../sizes.md).
* To use premium SSDs, you'll need a [premium storage-enabled VM type](../sizes-memory.md), like the DS-series or GS-series virtual machine.

This article uses PowerShell within the [Azure Cloud Shell](../../cloud-shell/overview.md), which is constantly updated to the latest version. To open the Cloud Shell, select **Try it** from the top of any code block.

## Lower latency

In select regions, the disk attach latency has been reduced, so you'll see an improvement of up to 15%. This is useful if you have planned/unplanned failovers between VMs, you're scaling your workload, or are running a high scale stateful workload such as Azure Kubernetes Service. However, this improvement is limited to the explicit disk attach command, `Add-AzVMDataDisk`. You won't see the performance improvement if you call a command that may implicitly perform an attach, like `Update-AzVM`. You don't need to take any action other than calling the explicit attach command to see this improvement.

[!INCLUDE [virtual-machines-disks-fast-attach-detach-regions](../../../includes/virtual-machines-disks-fast-attach-detach-regions.md)]

## Add an empty data disk to a virtual machine

This example shows how to add an empty data disk to an existing virtual machine.

### Using managed disks

```azurepowershell-interactive
$rgName = 'myResourceGroup'
$vmName = 'myVM'
$location = 'East US'
$storageType = 'Premium_LRS'
$dataDiskName = $vmName + '_datadisk1'

$diskConfig = New-AzDiskConfig -SkuName $storageType -Location $location -CreateOption Empty -DiskSizeGB 128
$dataDisk1 = New-AzDisk -DiskName $dataDiskName -Disk $diskConfig -ResourceGroupName $rgName

$vm = Get-AzVM -Name $vmName -ResourceGroupName $rgName
$vm = Add-AzVMDataDisk -VM $vm -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1

Update-AzVM -VM $vm -ResourceGroupName $rgName
```

### Using managed disks in an Availability Zone

To create a disk in an Availability Zone, use [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) with the `-Zone` parameter. The following example creates a disk in zone *1*.

```powershell
$rgName = 'myResourceGroup'
$vmName = 'myVM'
$location = 'East US 2'
$storageType = 'Premium_LRS'
$dataDiskName = $vmName + '_datadisk1'

$diskConfig = New-AzDiskConfig -SkuName $storageType -Location $location -CreateOption Empty -DiskSizeGB 128 -Zone 1
$dataDisk1 = New-AzDisk -DiskName $dataDiskName -Disk $diskConfig -ResourceGroupName $rgName

$vm = Get-AzVM -Name $vmName -ResourceGroupName $rgName
$vm = Add-AzVMDataDisk -VM $vm -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1

Update-AzVM -VM $vm -ResourceGroupName $rgName
```

### Initialize the disk

After you add an empty disk, you'll need to initialize it. To initialize the disk, you can sign in to a VM and use disk management. If you enabled [WinRM](/windows/desktop/winrm/portal) and a certificate on the VM when you created it, you can use remote PowerShell to initialize the disk. You can also use a custom script extension:

```azurepowershell-interactive
    $location = "location-name"
    $scriptName = "script-name"
    $fileName = "script-file-name"
    Set-AzVMCustomScriptExtension -ResourceGroupName $rgName -Location $locName -VMName $vmName -Name $scriptName -TypeHandlerVersion "1.4" -StorageAccountName "mystore1" -StorageAccountKey "primary-key" -FileName $fileName -ContainerName "scripts"
```

The script file can contain code to initialize the disks, for example:

```azurepowershell-interactive
    $disks = Get-Disk | Where partitionstyle -eq 'raw' | sort number

    $letters = 70..89 | ForEach-Object { [char]$_ }
    $count = 0
    $labels = "data1","data2"

    foreach ($disk in $disks) {
        $driveLetter = $letters[$count].ToString()
        $disk |
        Initialize-Disk -PartitionStyle MBR -PassThru |
        New-Partition -UseMaximumSize -DriveLetter $driveLetter |
        Format-Volume -FileSystem NTFS -NewFileSystemLabel $labels[$count] -Confirm:$false -Force
	$count++
    }
```

## Attach an existing data disk to a VM

You can attach an existing managed disk to a VM as a data disk.

```azurepowershell-interactive
$rgName = "myResourceGroup"
$vmName = "myVM"
$dataDiskName = "myDisk"
$disk = Get-AzDisk -ResourceGroupName $rgName -DiskName $dataDiskName

$vm = Get-AzVM -Name $vmName -ResourceGroupName $rgName

$vm = Add-AzVMDataDisk -CreateOption Attach -Lun 0 -VM $vm -ManagedDiskId $disk.Id

Update-AzVM -VM $vm -ResourceGroupName $rgName
```

## Next steps

You can also deploy managed disks using templates. For more information, see [Using Managed Disks in Azure Resource Manager Templates](../using-managed-disks-template-deployments.md) or the [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-multiple-data-disk) for deploying multiple data disks.
