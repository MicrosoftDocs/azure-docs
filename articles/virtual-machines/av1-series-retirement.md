---
title: Av1-series retirement
description: Retirement information for the Av1 series virtual machine sizes. Before retirement, migrate your workloads to Av2-series virtual machines.
author: rishabv90
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: how-to
ms.date: 06/08/2022
ms.author: risverma
ms.custom: kr2b-contr-experiment
---

# Av1-series retirement

On August 31, 2024, we retire Basic and Standard A-series virtual machines (VMs). Before that date, migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs).

> [!NOTE]
> In some cases, you must deallocate the VM prior to resizing. This can happen if the new size is not available on the hardware cluster that is currently hosting the VM.

## Migrate workloads to Av2-series VMs

You can resize your virtual machines to the Av2-series using the [Azure portal, PowerShell, or the CLI](resize-vm.md). Below are examples on how to resize your VM using the Azure portal and PowerShell.

> [!IMPORTANT]
> Resizing a virtual machine results in a restart. We recommend that you perform actions that result in a restart during off-peak business hours.

### Azure portal

1. Open the [Azure portal](https://portal.azure.com).
1. Type *virtual machines* in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select the virtual machine you want to resize.
1. In the left menu, select **size**.
1. Pick a new Av2 size from the list of available sizes and select **Resize**.

### Azure PowerShell

1. Set the resource group and VM name variables. Replace the values with information of the VM you want to resize.

    ```powershell
    $resourceGroup = "myResourceGroup"
    $vmName = "myVM"
    ```

1. List the VM sizes that are available on the hardware cluster where the VM is hosted.

    ```powershell
    Get-AzVMSize -ResourceGroupName $resourceGroup -VMName $vmName
    ```

1. Resize the VM to the new size.

    ```powershell
    $vm = Get-AzVM -ResourceGroupName $resourceGroup -VMName $vmName
    $vm.HardwareProfile.VmSize = "<newAv2VMsize>"
    Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
    ```

## Help and support

If you have questions, ask community experts in [Microsoft Q&A](/answers/topics/azure-virtual-machines.html). If you have a support plan and need technical help, create a support request:

1. In the [Help + support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) page, select **Create a support request**. Follow the **New support request** page instructions. Use the following values:
   * For **Issue type**, select **Technical**.
   * For **Service**, select **My services**.
   * For **Service type**, select **Virtual Machine running Windows/Linux**.
   * For **Resource**, select your VM.
   * For **Problem type**, select **Assistance with resizing my VM**.
   * For **Problem subtype**, select the option that applies to you.

Follow instructions in the **Solutions** and **Details** tabs, as applicable, and then **Review + create**.

## Next steps

Learn more about the [Av2-series VMs](av2-series.md)
