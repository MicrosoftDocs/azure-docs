---

title: Use a Windows troubleshooting VM with Azure PowerShell | Microsoft Docs
description: Learn how to troubleshoot Windows VM issues in Azure by connecting the OS disk to a recovery VM using Azure PowerShell
services: virtual-machines-windows
documentationCenter: ''
authors: genlin
manager: jeconnoc
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/09/2018
ms.author: genli

---

# Troubleshoot a Windows VM by attaching the OS disk to a recovery VM using Azure PowerShell
If your Windows virtual machine (VM) in Azure encounters a boot or disk error, you may need to perform troubleshooting steps on the disk itself. A common example would be a failed application update that prevents the VM from being able to boot successfully. This article details how to use Azure PowerShell to connect the disk to another Windows VM to fix any errors, then repair your original VM. 

> [!Important]
> The scripts in this article only apply to the VMs that use [Managed Disk](../windows/managed-disks-overview.md). 


## Recovery process overview
We can now use Azure PowerShell to change the OS disk for a VM. We no longer need to delete and recreate the VM.

The troubleshooting process is as follows:

1. Stop the affected VM.
2. Create a snapshot from the OS Disk of the VM.
3. Create a disk from the OS disk snapshot.
4. Attach the disk as a data disk to a recovery VM.
5. Connect to the recovery VM. Edit files or run any tools to fix issues on the copied OS disk.
6. Unmount and detach disk from recovery VM.
7. Change the OS disk for the affected VM.

You can use the VM recovery scripts to automate steps 1, 2, 3, 4, 6, and 7. For more documentation and instructions, see [VM Recovery Scripts for Resource Manager VM](https://github.com/Azure/azure-support-scripts/tree/master/VMRecovery/ResourceManager).

Make sure that you have [the latest Azure PowerShell](/powershell/azure/overview) installed and logged in to your subscription:

```powershell
Connect-AzureRmAccount
```

In the following examples, replace the parameter names with your own values. 

## Determine boot issues
You can view a screenshot of your VM in Azure to help troubleshoot boot issues. This screenshot can help identify why a VM fails to boot. The following example gets the screenshot from the Windows VM named `myVM` in the resource group named `myResourceGroup`:

```powershell
Get-AzureRmVMBootDiagnosticsData -ResourceGroupName myResourceGroup `
    -Name myVM -Windows -LocalPath C:\Users\ops\
```

Review the screenshot to determine why the VM is failing to boot. Note any specific error messages or error codes provided.

## Stop the VM

The following example stops the VM named `myVM` from the resource group named `myResourceGroup`:

```powershell
Stop-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myVM"
```

Wait until the VM has finished deleting before you process to the next step.


## Create a snapshot from the OS Disk of the VM

The following example creates a snapshot with name `mySnapshot` from the OS disk of the VM named `myVM'. 

```powershell
$resourceGroupName = 'myResourceGroup' 
$location = 'eastus' 
$vmName = 'myVM'
$snapshotName = 'mySnapshot'  

#Get the VM
$vm = get-azurermvm `
-ResourceGroupName $resourceGroupName `
-Name $vmName

#Create the snapshot configuration for the OS disk
$snapshot =  New-AzureRmSnapshotConfig `
-SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id `
-Location $location `
-CreateOption copy

#Take the snapshot
New-AzureRmSnapshot `
   -Snapshot $snapshot `
   -SnapshotName $snapshotName `
   -ResourceGroupName $resourceGroupName 
```

A snapshot is a full, read-only copy of a VHD. It cannot be attached to a VM. In the next step, we will create a disk from this snapshot.

## Create a disk from the snapshot

This script creates a managed disk with name `newOSDisk` from the snapshot named `mysnapshot`.  

```powershell
#Set the context to the subscription Id where Managed Disk will be created
#You can skip this step if the subscription is already selected

$subscriptionId = 'yourSubscriptionId'

Select-AzureRmSubscription -SubscriptionId $SubscriptionId

#Provide the name of your resource group
$resourceGroupName ='myResourceGroup'

#Provide the name of the snapshot that will be used to create Managed Disks
$snapshotName = 'mySnapshot' 

#Provide the name of the Managed Disk
$diskName = 'newOSDisk'

#Provide the size of the disks in GB. It should be greater than the VHD file size.
$diskSize = '128'

#Provide the storage type for Managed Disk. PremiumLRS or StandardLRS.
$storageType = 'StandardLRS'

#Provide the Azure region (e.g. westus) where Managed Disks will be located.
#This location should be same as the snapshot location
#Get all the Azure location using command below:
#Get-AzureRmLocation
$location = 'eastus'

$snapshot = Get-AzureRmSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName 
 
$diskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location $location -CreateOption Copy -SourceResourceId $snapshot.Id
 
New-AzureRmDisk -Disk $diskConfig -ResourceGroupName $resourceGroupName -DiskName $diskName
```
Now you have a copy of the original OS disk. You can mount this disk to another Windows VM for troubleshooting purposes.

## Attach the disk to another Windows VM for troubleshooting

Now we attach the copy of the original OS disk to a VM as a data disk. This process allows you to correct configuration errors or review additional application or system log files in the disk. The following example attaches the disk named `newOSDisk` to the VM named `RecoveryVM`.

> [!NOTE]
> To attach the disk, the copy of the original OS disk and the recovery VM must be in the same location.

```powershell
$rgName = "myResourceGroup"
$vmName = "RecoveryVM"
$location = "eastus" 
$dataDiskName = "newOSDisk"
$disk = Get-AzureRmDisk -ResourceGroupName $rgName -DiskName $dataDiskName 

$vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $rgName 

$vm = Add-AzureRmVMDataDisk -CreateOption Attach -Lun 0 -VM $vm -ManagedDiskId $disk.Id

Update-AzureRmVM -VM $vm -ResourceGroupName $rgName
```

## Connect to the recovery VM and fix issues on the attached disk

1. RDP to your recovery VM using the appropriate credentials. The following example downloads the RDP connection file for the VM named `RecoveryVM` in the resource group named `myResourceGroup`, and downloads it to `C:\Users\ops\Documents`"

    ```powershell
    Get-AzureRMRemoteDesktopFile -ResourceGroupName "myResourceGroup" -Name "RecoveryVM" `
        -LocalPath "C:\Users\ops\Documents\myVMRecovery.rdp"
    ```

2. The data disk should be automatically detected and attached. View the list of attached volumes to determine the drive letter as follows:

    ```powershell
    Get-Disk
    ```

    The following example output shows the disk connected a disk **2**. (You can also use `Get-Volume` to view the drive letter):

    ```powershell
    Number   Friendly Name   Serial Number   HealthStatus   OperationalStatus   Total Size   Partition
                                                                                             Style
    ------   -------------   -------------   ------------   -----------------   ----------   ----------
    0        Virtual HD                                     Healthy             Online       127 GB MBR
    1        Virtual HD                                     Healthy             Online       50 GB MBR
    2        newOSDisk                                  Healthy             Online       127 GB MBR
    ```

After the copy of the original OS disk is mounted, you can perform any maintenance and troubleshooting steps as needed. Once you have addressed the issues, continue with the following steps.

## Unmount and detach original OS disk
Once your errors are resolved, you unmount and detach the existing disk from your recovery VM. You cannot use your disk with any other VM until the lease attaching the disk to the recovery VM is released.

1. From within your RDP session, unmount the data disk on your recovery VM. You need the disk number from the previous `Get-Disk` cmdlet. Then, use `Set-Disk` to set the disk as offline:

    ```powershell
    Set-Disk -Number 2 -IsOffline $True
    ```

    Confirm the disk is now set as offline using `Get-Disk` again. The following example output shows the disk is now set as offline:

    ```powershell
    Number   Friendly Name   Serial Number   HealthStatus   OperationalStatus   Total Size   Partition
                                                                                             Style
    ------   -------------   -------------   ------------   -----------------   ----------   ----------
    0        Virtual HD                                     Healthy             Online       127 GB MBR
    1        Virtual HD                                     Healthy             Online       50 GB MBR
    2        Msft Virtu...                                  Healthy             Offline      127 GB MBR
    ```

2. Exit your RDP session. From your Azure PowerShell session, remove the disk named `newOSDisk` from the VM named 'RecoveryVM'.

    ```powershell
    $myVM = Get-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "RecoveryVM"
    Remove-AzureRmVMDataDisk -VM $myVM -Name "newOSDisk"
    Update-AzureRmVM -ResourceGroup "myResourceGroup" -VM $myVM
    ```

## Change the OS disk for the affected VM

You can use Azure PowerShell to swap the OS disks. You don't have to delete and recreate the VM.

This example stops the VM named `myVM` and assigns the disk named `newOSDisk` as the new OS disk. 

```powershell
# Get the VM 
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM 

# Make sure the VM is stopped\deallocated
Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name $vm.Name -Force

# Get the new disk that you want to swap in
$disk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name newDisk

# Set the VM configuration to point to the new disk  
Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $disk.Id -Name $disk.Name 

# Update the VM with the new OS disk
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm 

# Start the VM
Start-AzureRmVM -Name $vm.Name -ResourceGroupName myResourceGroup
```

## Verify and enable boot diagnostics

The following example enables the diagnostic extension on the VM named `myVMDeployed` in the resource group named `myResourceGroup`:

```powershell
$myVM = Get-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myVMDeployed"
Set-AzureRmVMBootDiagnostics -ResourceGroupName myResourceGroup -VM $myVM -enable
Update-AzureRmVM -ResourceGroup "myResourceGroup" -VM $myVM
```

## Next steps
If you are having issues connecting to your VM, see [Troubleshoot RDP connections to an Azure VM](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Windows VM](troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For more information about using Resource Manager, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).
