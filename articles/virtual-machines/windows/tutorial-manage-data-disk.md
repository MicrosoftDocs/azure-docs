---
title: Tutorial - Manage Azure disks with Azure PowerShell 
description: In this tutorial, you learn how to use Azure PowerShell to create and manage Azure disks for virtual machines
author: roygara
ms.author: rogarana
ms.service: storage
ms.subservice: disks
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.date: 08/23/2021
ms.custom: template-tutorial, devx-track-azurepowershell
#Customer intent: As an IT administrator, I want to learn about Azure Managed Disks so that I can create and manage storage for Windows VMs in Azure.
---

# Tutorial: Manage disks with Azure PowerShell

Azure virtual machines (VMs) use disks to store their operating systems (OS), applications, and data. When you create a VM, it's important to choose an appropriate disk size and configuration for the expected workload. This tutorial covers deployment and management of VM disks.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and attach a disk
> * Verify a disk's status
> * Initialize a disk
> * Detach and delete a disk

## Prerequisites

An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create and attach a disk

When a VM is provisioned, two disks are automatically created and attached.

- An **operating system disk** hosts the VM's operating system.
- A **temporary disk** is primarily used for operations such as temporary data processing.

If you need to increase disk storage for your VMs, you can expand an existing disk or create and attach additional disks. We recommend the separation of application and user data at OS-related data when possible. In most cases, you should create and attach data disks when durable and responsive data storage is needed.

### Create a VM

First, create a VM for this tutorial. In the following example, the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet creates a VM with the name **myTestVM**. Because the `ResourceGroupName` parameter value is added, a new resource group named **myTestResourceGroup** is created for the VM. The `-Location` parameter value ensures that resources will be created in the **Central US** region. You are prompted for username and password values for the VM's local administrator account.

```azurepowershell-interactive
New-AzVm `
    -Name "myTestVM" `
    -ResourceGroupName "myTestResourceGroup" `
    -Location "Central US"
```

The output confirms the VM's successful creation. Because the `-Size` parameter value was not supplied, the general-purpose `Standard_D2s_v3` size is used by default. Because no specific values are supplied for optional parameters, the following resources leverage the VM's `-Name` parameter value during creation:

- The network interface
- The virtual network
- The network security group
- The public IP address

```Output
ResourceGroupName        : myTestResourceGroup
Id                       : /subscriptions/{GUID}/resourceGroups/myTestResourceGroup/providers/Microsoft.Compute/virtualMachines/myTestVM
VmId                     : [{GUID}]
Name                     : myTestVM
Type                     : Microsoft.Compute/virtualMachines
Location                 : centralus
Tags                     : {}
HardwareProfile          : {VmSize}
NetworkProfile           : {NetworkInterfaces}
OSProfile                : {ComputerName, AdminUsername, WindowsConfiguration, AllowExtensionOperations, RequireGuestProvisionSignal}
ProvisioningState        : Succeeded
StorageProfile           : {ImageReference, OsDisk, DataDisks}
FullyQualifiedDomainName : mytestvm-abc123.Central US.cloudapp.azure.com
```

### Create a data disk

If you need to store user or application data on your VM, you can create and attach additional data disks. Azure provides four types of disks:

- **Standard hard disk drives** - Hard disk drives (HDDs) deliver cost-effective storage while still remaining performant. Standard disks are ideal for development and test workloads.
- **Standard solid-state drives** - Compared to standard HDDs, solid-state drives (SSDs) deliver better availability, consistency, reliability, and latency. Standard SSDs are suitable for web servers, application servers not requiring high input/output operations per second (IOPS), and lightly-used enterprise applications.
- **Premium solid-state drives** - Premium SSDs deliver higher performance and lower latency for VMs with input/output (IO)-intensive workloads. Premium SSDs are suitable for mission-critical production applications, but can only be used with VMs that are premium storage-compatible.
- **Ultra disks** - Ultra disks deliver high throughput, high IOPS, and consistent low-latency disk storage for Azure IaaS VMs. Ultra disks provide the ability to tune disk performance in response to your workloads without requiring a VM restart. Ultra disks are suited for data-intensive workloads, top-tier databases, and transaction-heavy workloads. They are only available in regions that support availability zones.

1. Before creating a data disk, you must first create a disk object with the [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) cmdlet. The following example configures a disk object that is 128 gigabytes in size. Since no value for the `-SkuName` parameter is specified, disks created from this object will have the default **Standard_LRS** SKU name.

    ```azurepowershell-interactive
    $diskConfig = New-AzDiskConfig `
        -Location "CentralUS" `
        -CreateOption Empty `
        -DiskSizeGB 128
    ```

1. After the disk object is created, provision a managed data disk with the [New-AzDisk](/powershell/module/az.compute/new-azdisk) cmdlet. The following example creates a data disk named **myTestDataDisk** in the **myTestResourceGroup** resource group.

    ```azurepowershell-interactive
    $dataDisk = New-AzDisk `
        -ResourceGroupName "myTestResourceGroup" `
        -DiskName "myTestDataDisk" `
        -Disk $diskConfig
    ```

### Attach a data disk



1. After the disk is created, get the VM to which you'll add the data disk with the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet.

    ```azurepowershell-interactive
    $vm = Get-AzVM -ResourceGroupName "myTestResourceGroup" -Name "myTestVM"
    ```

1. Next, attach the data disk to the virtual machine configuration with the [Add-AzVMDataDisk](/powershell/module/az.compute/add-azvmdatadisk) cmdlet.

    ```azurepowershell-interactive
    $vm = Add-AzVMDataDisk `
        -VM $vm `
        -Name "myTestDataDisk" `
        -CreateOption Attach `
        -ManagedDiskId $dataDisk.Id `
        -Lun 1
    ```

1. Finally, update the virtual machine with the [Update-AzVM](/powershell/module/az.compute/add-azvmdatadisk) cmdlet.

    ```azurepowershell-interactive
    Update-AzVM `
        -ResourceGroupName "myTestResourceGroup" `
        -VM $vm
    ```

    The response confirms a successful attachment.

    ```Results
    RequestId IsSuccessStatusCode StatusCode ReasonPhrase
    --------- ------------------- ---------- ------------
                             True         OK OK
    ```  

## Initialize a data disk

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to connect to the remote VM and configure the first disk added.

1. Log into the [Azure portal](https://portal.azure.com).

1. Locate the VM to which you have attached the data disk and connect to it using a remote desktop protocol (RDP) connection. If you no longer have access to an administrative account, create a credential object for a specified user name and password with the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet.
1. After you've established an RDP connection to the remote VM, select the Windows **Start** menu. Enter **PowerShell** in the search box and select **Windows PowerShell** to open a PowerShell window.

    [![Image alt text.](media\tutorial-manage-data-disk\initialize-disk-sml.png)](media\tutorial-manage-data-disk\initialize-disk-lrg.png#lightbox)

1. Open PowerShell and run the following script.

    ```azurepowershell
    Get-Disk | Where PartitionStyle -eq 'raw' |
        Initialize-Disk -PartitionStyle MBR -PassThru |
        New-Partition -AssignDriveLetter -UseMaximumSize |
        Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
    ```

    The response confirms a successful initialization.

    ```Output
    DriveLetter FileSystemLabel FileSystem DriveType HealthStatus OperationalStatus SizeRemaining   Size
    ----------- --------------- ---------- --------- ------------ ----------------- -------------   ----
    F           myTestDataDisk  NTFS       Fixed     Healthy      OK                    127.89 GB 128 GB
    ```

## Verify a data disk's status

To verify that the data disk is attached, run the following command.

```azurepowershell-interactive
$vm.StorageProfile.DataDisks
```

The response confirms the disk's attachment.

```Output
Name            : myTestDataDisk
DiskSizeGB      : 128
Lun             : 1
Caching         : None
CreateOption    : Attach
SourceImage     :
VirtualHardDisk :
```

## Expand a disk

Azure disks can be expanded to provide additional storage capacity if your VM is running low on available disk space.

Because we recommend that applications and data not be hosted on a VM's OS disk, resizing operations are usually performed on a VM's data disk. In some scenarios, however, data is required to be stored on the OS disk. For example, you may be required to support legacy applications that install components on the OS drive. You may also have the need to migrate an on-premises physical PC or VM with a larger OS drive. In such cases, it may become necessary to expand a VM's OS disk.

Shrinking an existing disk isn’t supported, and can potentially result in data loss.

Follow the steps below to resize a disk.

1. Select the VM containing the disk that you will resize with the `Get-AzVM` cmdlet.

    ```azurepowershell-interactive
     $vm = Get-AzVM `
       -ResourceGroupName "myTestResourceGroup" `
       -Name "myTestVM"
    ```

1. Before you can resize a VM's disk, you must stop the VM. Use the `Stop-AzVM` cmdlet to stop the VM. You will be prompted for confirmation.

    > [!IMPORTANT]
    > Before you initiate a VM shutdown, always confirm that there are no important resources or data that could be lost.

    ```azurepowershell-interactive
    Stop-AzVM `
        -ResourceGroupName "myTestResourceGroup" `
        -Name "myTestVM"
    ```

    After a short pause, the output confirms that the machine is successfully stopped.

    ```Output
    OperationId : abcd1234-ab12-cd34-123456abcdef
    Status      : Succeeded
    StartTime   : 9/13/2021 7:10:23 PM
    EndTime     : 9/13/2021 7:11:12 PM
    Error       :
    ```

1. After the VM is stopped, get a reference to either the OS or data disk attached to the VM with the `Get-AzDisk` cmdlet.

    The following example selects the OS disk.

    ```azurepowershell-interactive
    $disk= Get-AzDisk `
        -ResourceGroupName "myTestResourceGroup" ` 
        -DiskName $vm.StorageProfile.OsDisk.Name
    ```

    The following example selects the data disk.

    ```azurepowershell-interactive
        $disk= Get-AzDisk `
            -ResourceGroupName "myTestResourceGroup" `
            -DiskName $vm.StorageProfile.DataDisks[0].Name
    ```

1. Now that you have a reference to the disk, set the size of the disk to your desired value in gigabytes.

    > [!IMPORTANT]
    > The new size should be greater than the existing disk size. The maximum allowed is 4,095 GB for OS disks.

    ```azurepowershell-interactive
    $disk.DiskSizeGB = 250
    ```

1. Next, update the disk image with the `Update-AzDisk` cmdlet.

    ```azurepowershell-interactive
    Update-AzDisk `
        -ResourceGroupName "myTestResourceGroup" `
        -Disk $disk -DiskName $disk.Name
    ```

1. After the disk image has updated, restart the VM using the `Start-AzVM` cmdlet.

    ```azurepowershell-interactive
    Start-AzVM `
        -ResourceGroupName "myTestResourceGroup" `
        -Name "myTestVM"
    ```

    After a short pause, the output confirms that the machine is successfully started.

    ```Output
    OperationId : abcd1234-ab12-cd34-123456abcdef
    Status      : Succeeded
    StartTime   : 9/13/2021 7:44:54 PM
    EndTime     : 9/13/2021 7:45:15 PM
    Error       :
    ```

1. Before you can take advantage of the new disk size, you need to expand the volume within the OS. Log into the [Azure portal](https://portal.azure.com).

1. Locate the VM to which you have attached the newly-created data disk and connect to it using a remote desktop protocol (RDP) connection. If you no longer have access to an administrative account, create a credential object for a specified user name and password with the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet.

1. After you've established an RDP connection to the remote VM, select the Windows **Start** menu. Enter **PowerShell** in the search box and select **Windows PowerShell** to open a PowerShell window.

    [![Image alt text.](media\tutorial-manage-data-disk\initialize-disk-sml.png)](media\tutorial-manage-data-disk\initialize-disk-lrg.png#lightbox)

1. Open PowerShell and run this script.

    ```azurepowershell
    Resize-Partition `
        -DiskNumber 0 `
        -PartitionNumber 2 `
        -Size 123GB
    ```

1. In your local Azure PowerShell window, verify that the resizing operation was successful.

    ```azurepowershell-interactive
    Get-AzDisk `
        -ResourceGroupName "myTestResourceGroup" | Out-Host -Paging
    ```

## Detach a data disk

You can detach a data disk from a VM when it is no longer needed. This removes the disk from the virtual machine, but doesn't delete it. If you want to re-use the existing data on the disk again, you can reattach it to any VM. If you've subscribed to premium storage, you will continue to incur storage charges for the disk until it is deleted.

1. First, select the VM to which the disk is attached using the `Get-AzVM` cmdlet.

    ```azurepowershell-interactive
    $VirtualMachine = Get-AzVM `
       -ResourceGroupName "myTestResourceGroup" `
       -Name "myTestVM"
    ```

1. Next, detach the disk from the VM with the `Remove-AzVMDataDisk` cmdlet.

    ```azurepowershell-interactive
    Remove-AzVMDataDisk `
        -VM $VirtualMachine `
        -Name "myDisk"
    ```

1. To complete the process of removing the data disk, update the state of the virtual machine using the `Update-AzVM` cmdlet.

    ```azurepowershell-interactive
    Update-AzVM `
        -ResourceGroupName "myResourceGroup" `
        -VM $VirtualMachine
    ```

## Delete a data disk

When you delete a VM, any disks that were attached remain inside your storage account. This default behavior helps prevent data loss due to unintentional deletion. After a VM is deleted, unattached disks will continue to incur charges until they are deleted.

You can use the following sample PowerShell script to delete unattached disks. The retrieval of disks is limited to the **myTestResourceGroup** because the  `-ResourceGroupName` switch was used with the `Get-AzDisk` cmdlet.

```azurepowershell
# Get all disks in resource group "myTestResourceGroup"
$allDisks = Get-AzDisk -ResourceGroupName "myTestResourceGroup"

# Determine the number of disks in the collection
if($allDisks.Count -ne 0) {

    Write-Host "Found $($allDisks.Count) disks."

    # Iterate through the collection
    foreach ($disk in $allDisks) {

        # Use the disk's "ManagedBy" property to determine if it is unattached
        if($disk.ManagedBy -eq $null) {

            # Confirm that the disk can be deleted
            Write-Host "Deleting unattached disk $($disk.Name)."
            $confirm = Read-Host "Continue? (Y/N)"
            if ($confirm.ToUpper() -ne 'Y') { break }
            else {

                # Delete the disk
                $disk | Remove-AzDisk -Force 
                Write-Host "Unattached disk $($disk.Name) deleted."
            }
        }
    }
}
```

## Clean up resources

When no longer needed, delete the resource group, virtual machine, and all related resources. You can use the following sample PowerShell script to delete the resource group created earlier in this tutorial.  

> [!CAUTION]
> Use caution when deleting a resource group. To avoid the loss of important data, always confirm that there are no important resources or data contained within the resource group before it is deleted.

```azurepowershell-interactive
    Remove-AzResourceGroup -Name "myTestResourceGroup"
```

You are prompted for confirmation. After a short pause, the `True` response confirms that the **myTestResourceGroup** is successfully deleted.
    
```Output
Confirm
Are you sure you want to remove resource group 'myTestResourceGroup'
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
True
```

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * Create and attach disks
> * Verify disk status
> * Initialize data disks
> * Detach and delete disks

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
