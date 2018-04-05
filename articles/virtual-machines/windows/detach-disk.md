---
title: Detach a data disk from a Windows VM - Azure| Microsoft Docs
description: Learn to detach a data disk from a virtual machine in Azure using the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 13180343-ac49-4a3a-85d8-0ead95e2028c
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 11/17/2017
ms.author: cynthn

---
# How to detach a data disk from a Windows virtual machine
When you no longer need a data disk that's attached to a virtual machine, you can easily detach it. This removes the disk from the virtual machine, but doesn't remove it from storage.

> [!WARNING]
> If you detach a disk it is not automatically deleted. If you have subscribed to Premium storage, you will continue to incur storage charges for the disk. For more information refer to [Pricing and Billing when using Premium Storage](premium-storage.md#pricing-and-billing).
>
>

If you want to use the existing data on the disk again, you can reattach it to the same virtual machine, or another one.

## Detach a data disk using the portal

1. In the left menu, select **Virtual Machines**.
2. Select the virtual machine that has the data disk you want to detach and click **Stop** to deallocate the VM.
3. In the virtual machine pane, select **Disks**.
4. At the top of the **Disks** pane, select **Edit**.
5. In the **Disks** pane, to the far right of the data disk that you would like to detach, click the ![Detach button image](./media/detach-disk/detach.png) detach button.
5. After the disk has been removed, click **Save** on the top of the pane.
6. In the virtual machine pane, click **Overview** and then click the **Start** button at the top of the pane to restart the VM.



The disk remains in storage but is no longer attached to a virtual machine.

## Detach a data disk using PowerShell
In this example, the first command gets the virtual machine named **MyVM07** in the **RG11** resource group using the [Get-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet and stores it in the **$VirtualMachine** variable.

The second line removes the data disk named DataDisk3 from the virtual machine using the [Remove-AzureRmVMDataDisk](/powershell/module/azurerm.compute/remove-azurermvmdatadisk) cmdlet.

The third line updates the state of the virtual machine, using the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet, to complete the process of removing the data disk.

```azurepowershell-interactive
$VirtualMachine = Get-AzureRmVM -ResourceGroupName "RG11" -Name "MyVM07"
Remove-AzureRmVMDataDisk -VM $VirtualMachine -Name "DataDisk3"
Update-AzureRmVM -ResourceGroupName "RG11" -VM $VirtualMachine
```

For more information, see [Remove-AzureRmVMDataDisk](/powershell/module/azurerm.compute/remove-azurermvmdatadisk).

## Next steps
If you want to reuse the data disk, you can just [attach it to another VM](attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

