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

# Tutorial: Manage Azure disks with Azure PowerShell

Azure virtual machines (VMs) use disks to store their operating systems (OS), applications, and data. When you create a VM, it's important to choose an appropriate disk size and configuration for the expected workload. This tutorial covers deployment and management of VM disks.

In this tutorial, you learn about:

> [!div class="checklist"]

> * Create and attach disks
> * Initialize data disks
> * Verify disk status
> * Detach and delete disks

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create and attach disks

When a VM is created, two disks are automatically attached:

- An **Operating system disk** hosts the VM's operating system.
- A **Temporary disk** is primarily used for operations such as temporary data processing.

The OS disk **should not** host applications or data. Instead, create and attach managed data disks anytime durable and responsive data storage is needed.

Azure provides two types of disks: 

- **Standard disks** are backed by hard disk drives (HDDs) and deliver cost-effective storage while still remaining performant. Standard disks are ideal for development and test workloads.
- **Premium disks** are backed by high-performance, low-latency, solid-state disks (SSDs). Premium disks are ideal for VMs running production workloads.

Learn more about [Azure disk roles](../managed-disks-overview#disk-roles), [types](../disks-types), and [performance](../disks-scalability-targets).

To complete this tutorial, you must have an existing virtual machine. If needed, use the use the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet example to create disposable resources. You'll be prompted to enter username and password values for the VM's local administrator account.

```azurepowershell-interactive
New-AzVm `
    -Name "myTestVM" `
    -ResourceGroupName "myTestResourceGroup" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -Location "East US"
```

1. First, create a disk object with the [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) cmdlet.

    ```azurepowershell-interactive
    $diskConfig = New-AzDiskConfig `
        -Location "EastUS" `
        -CreateOption Empty `
        -DiskSizeGB 128
    ```

    The provided example configures a disk that is 128 gigabytes in size in the same region as the VM. Since no value for the `-SkuName` parameter is specified, a disk object with the default Sku name **Standard_LRS** is created.
1. Next, create a managed data disk with the [New-AzDisk](/powershell/module/az.compute/new-azdisk) cmdlet.

    ```azurepowershell-interactive
    $dataDisk = New-AzDisk `
        -ResourceGroupName "myTestResourceGroup" `
        -DiskName "myTestDataDisk" `
        -Disk $diskConfig
    ```

1. After the disk is created, get the VM to which you'll add the data disk with the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet.

    ```azurepowershell-interactive
    $vm = Get-AzVM -ResourceGroupName "myTestResourceGroup" -Name "myTestVM"
    ```

1. Now attach the data disk to the virtual machine configuration with the [Add-AzVMDataDisk](/powershell/module/az.compute/add-azvmdatadisk) cmdlet.

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
    Update-AzVM -ResourceGroupName "myTestResourceGroup" -VM $vm
    ```

    The response confirms a successful attachment.

    ```
        RequestId IsSuccessStatusCode StatusCode ReasonPhrase
        --------- ------------------- ---------- ------------
                                 True         OK OK
    ```  

## Initialize a data disk

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. <!--This process can also be automated using the [custom script extension](./tutorial-automate-vm-deployment.md).-->

1. Log into the [Azure portal](https://portal.azure.com).
1. Locate the VM to which you have attached the newly-created data disk and connect to it using a remote desktop protocol (RDP) connection. If you no longer have access to an administrative account, create a credential object for a specified user name and password with the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet.
1. On the remote VM, select the Windows **Start** menu and enter **diskmgmt.msc** in the search box. The **Disk Management** console opens.

    [![Image alt text.](media\tutorial-manage-data-disk\initialize-disk-sml.png)](media\tutorial-manage-data-disk\initialize-disk-lrg.png#lightbox)

1. Disk Management recognizes that you have a new, uninitialized disk and the **Initialize Disk** window appears.
1. Verify the new disk is selected and then select **OK** to initialize it.
1. The new disk appears as **unallocated**. Right-click anywhere on the disk and select **New simple volume**. The **New Simple Volume Wizard** window opens.
1. Proceed through the wizard, keeping all of the defaults, and when you're done select **Finish**.
1. Close **Disk Management**.
1. A pop-up window appears notifying you that you need to format the new disk before you can use it. Select **Format disk**.
1. In the **Format new disk** window, check the settings, and then select **Start**.
1. A warning appears notifying you that formatting the disks erases all of the data. Select **OK**.
1. When the formatting is complete, select **OK**.

## Verify the data disk

To verify that the data disk is attached, view the `StorageProfile` for the attached `DataDisks`.

```azurepowershell-interactive
$vm.StorageProfile.DataDisks
```

The output should look something like this example:

```
Name            : myDataDisk
DiskSizeGB      : 128
Lun             : 1
Caching         : None
CreateOption    : Attach
SourceImage     :
VirtualHardDisk :
```

## Detach and delete the data disk

## Clean up resources

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the VM and select **Delete**. You may also use the sample code provided.

> [!CAUTION]
> Use caution when deleting a resource group. To avoid the loss of important data, always confirm that there are no important resources or data contained within the resource group before it is deleted.

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
