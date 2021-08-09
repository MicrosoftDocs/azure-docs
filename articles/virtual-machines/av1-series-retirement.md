---
title: Av1-series retirement
description: Retirement information for the Av1 series VM sizes.
author: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-general
ms.topic: conceptual
ms.date: 07/26/2021
ms.author: mimckitt
---

# Av1-series retirement

On 31 August 2024, we'll retire Basic and Standard A-series VMs. Before that date, you'll need to migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs).

> [!NOTE]
> In some cases, users must deallocate the VM prior to resizing. This can happen if the new size is not available on the hardware cluster that is currently hosting the VM.


## Migrate workloads from Basic and Standard A-series VMs to Av2-series VMs 

You can resize your virtual machines to the Av2-series using the [Azure portal](https://portal.azure.com), [PowerShell](https://docs.microsoft.com/powershell/azure/?view=azps-6.3.0) and [CLI](https://docs.microsoft.com/cli/azure/). Below are examples on how to resize using the Azure portal and PowerShell. 

### Azure Portal 
1. Open the [Azure portal](https://portal.azure.com).
1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select the virtual machine you want to resize.
1. In the left menu, select size.
1. Pick a new Av2 size from the list of available sizes and select Resize.

> [!NOTE]
> Resizing the virtual machine will result in a restart. It is suggested to perform actions that will result in a restart during off-peak business hours. 

### Azure PowerShell
1. Set the resource group and VM name variables. Replace the values with information of the VM you want to resize. 

    ```powershell
    $resourceGroup = "myResourceGroup"
    $vmName = "myVM"
    ```
2. List the VM sizes that are available on the hardware cluster where the VM is hosted.

    ```powershell
    Get-AzVMSize -ResourceGroupName $resourceGroup -VMName $vmName
    ```

3. Resize the VM to the new size.

> [!NOTE]
> Resizing the virtual machine will result in a restart. It is suggested to perform actions that will result in a restart during off-peak business hours. 

    ```powershell
    $vm = Get-AzVM -ResourceGroupName $resourceGroup -VMName $vmName
    $vm.HardwareProfile.VmSize = "<newAv2VMsize>"
    Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
    ```
## Help and support

If you have questions, ask community experts in Microsoft Q&A. If you have a support plan and need technical help, create a support request:

1. For Issue type, select Technical.
1. For Subscription, select your subscription.
1. For Service, click My services.
1. For Service type, select Virtual Machine running Windows/Linux.
1. For Summary, enter a summary of your request.
1. For Problem type, select Assistance with resizing my VM.
1. For Problem subtype, select the option that applies to you.

## Next steps
Learn more about the [Av2-series VMs](av2-series.md)


