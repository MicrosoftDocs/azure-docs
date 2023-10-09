---
title: Detach a data disk from a Windows VM - Azure
description: Detach a data disk from a virtual machine in Azure using the Resource Manager deployment model.
author: roygara
ms.service: azure-disk-storage
ms.collection: windows
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/09/2023
ms.author: rogarana 
---
# How to detach a data disk from a Windows virtual machine

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

When you no longer need a data disk that's attached to a virtual machine, you can easily detach it. This removes the disk from the virtual machine, but doesn't remove it from storage.

> [!WARNING]
> If you detach a disk it is not automatically deleted. If you have subscribed to Premium storage, you will continue to incur storage charges for the disk. For more information, see [Pricing and Billing when using Premium Storage](../disks-types.md#billing).

If you want to use the existing data on the disk again, you can reattach it to the same virtual machine, or another one.

## Detach a data disk using PowerShell

You can *hot* remove a data disk using PowerShell, but make sure nothing is actively using the disk before detaching it from the VM.

In this example, we remove the disk named **myDisk** from the VM **myVM** in the **myResourceGroup** resource group. First you remove the disk using the [Remove-AzVMDataDisk](/powershell/module/az.compute/remove-azvmdatadisk) cmdlet. Then, you update the state of the virtual machine, using the [Update-AzVM](/powershell/module/az.compute/update-azvm) cmdlet, to complete the process of removing the data disk.

```azurepowershell-interactive
$VirtualMachine = Get-AzVM `
   -ResourceGroupName "myResourceGroup" `
   -Name "myVM"
Remove-AzVMDataDisk `
   -VM $VirtualMachine `
   -Name "myDisk"
Update-AzVM `
   -ResourceGroupName "myResourceGroup" `
   -VM $VirtualMachine
```

The disk stays in storage but is no longer attached to a virtual machine.

### Lower latency

In select regions, the disk detach latency has been reduced, so you'll see an improvement of up to 15%. This is useful if you have planned/unplanned failovers between VMs, you're scaling your workload, or are running a high scale stateful workload such as Azure Kubernetes Service. However, this improvement is limited to the explicit disk detach command, `Remove-AzVMDataDisk`. You won't see the performance improvement if you call a command that may implicitly perform a detach, like `Update-AzVM`. You don't need to take any action other than calling the explicit detach command to see this improvement.

[!INCLUDE [virtual-machines-disks-fast-attach-detach-regions](../../../includes/virtual-machines-disks-fast-attach-detach-regions.md)]

## Detach a data disk using the portal

You can *hot* remove a data disk, but make sure nothing is actively using the disk before detaching it from the VM.

1. In the left menu, select **Virtual Machines**.
1. Select the virtual machine that has the data disk you want to detach.
1. Under **Settings**, select **Disks**.
1. In the **Disks** pane, to the far right of the data disk that you would like to detach, select the detach button to detach.
1. Select **Save** on the top of the page to save your changes.

The disk stays in storage but is no longer attached to a virtual machine. The disk isn't deleted. Kindly note, you would continue to pay for these unattached disks, whether you need them or not.

Find and delete unattached Azure managed and unmanaged disks - Azure portal https://learn.microsoft.com/en-us/azure/virtual-machines/disks-find-unattached-portal

Find and delete unattached Azure managed and unmanaged disks https://learn.microsoft.com/en-us/azure/virtual-machines/windows/find-unattached-disks

You can review the managed disk and snapshot pricing at this page.
Managed Disks pricing https://azure.microsoft.com/en-us/pricing/details/managed-disks/

## Next steps

If you want to reuse the data disk, you can just [attach it to another VM](attach-managed-disk-portal.md).

If you want to delete the disk, so that you no longer incur storage costs, see [Find and delete unattached Azure managed and unmanaged disks - Azure portal](../disks-find-unattached-portal.md).
