---
title: Detach a data disk from a Windows VM - Azure
description: Detach a data disk from a virtual machine in Azure using the Resource Manager deployment model.
author: cynthn
ms.service: virtual-machines-windows
ms.subservice: disks
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 01/08/2020
ms.author: cynthn

---
# How to detach a data disk from a Windows virtual machine

When you no longer need a data disk that's attached to a virtual machine, you can easily detach it. This removes the disk from the virtual machine, but doesn't remove it from storage.

> [!WARNING]
> If you detach a disk it is not automatically deleted. If you have subscribed to Premium storage, you will continue to incur storage charges for the disk. For more information, see [Pricing and Billing when using Premium Storage](disks-types.md#billing).

If you want to use the existing data on the disk again, you can reattach it to the same virtual machine, or another one.

 

## Detach a data disk using PowerShell

You can *hot* remove a data disk using PowerShell, but make sure nothing is actively using the disk before detaching it from the VM.

In this example, we remove the disk named **myDisk** from the VM **myVM** in the **myResourceGroup** resource group. First you remove the disk using the [Remove-AzVMDataDisk](https://docs.microsoft.com/powershell/module/az.compute/remove-azvmdatadisk) cmdlet. Then, you update the state of the virtual machine, using the [Update-AzVM](https://docs.microsoft.com/powershell/module/az.compute/update-azvm) cmdlet, to complete the process of removing the data disk.

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

## Detach a data disk using the portal

You can *hot* remove a data disk, but make sure nothing is actively using the disk before detaching it from the VM.

1. In the left menu, select **Virtual Machines**.
1. Select the virtual machine that has the data disk you want to detach.
1. Under **Settings**, select **Disks**.
1. At the top of the **Disks** pane, select **Edit**.
1. In the **Disks** pane, to the far right of the data disk that you would like to detach, select **Detach**.
1. Select **Save** on the top of the page to save your changes.

The disk stays in storage but is no longer attached to a virtual machine.

## Next steps

If you want to reuse the data disk, you can just [attach it to another VM](attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
