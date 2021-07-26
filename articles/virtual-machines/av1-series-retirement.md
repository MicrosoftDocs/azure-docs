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

With the announcement of Av1 retirement, customers are required to migrate existing workloads running on Basic and Standard A VMs to [Av2-series](av2-series.md) or other sized instances.

> [!NOTE]
> In some cases, users must deallocate the VM prior to resizing. This can happen if the new size is not available on the hardware cluster that is currently hosting the VM.


## Migrate workloads from Basic and Standard A-series VMs to Av2-series VMs 

Below are instructions on customers can resize their VMs to Av2 series via Azure portal and Powershell

### Azure Portal 
1. Open the Azure portal.
1. Open the page for the virtual machine.
1. In the left menu, select the appropriate Basic or Standard A Size.
1. Pick a new Av2 size from the list of available sizes and then select Resize.

### Azure PowerShell
1. Set some variables. Replace the values with your own information.

    ```powershell
    $resourceGroup = "myResourceGroup"
    $vmName = "myVM"
    ```
2. List the VM sizes that are available on the hardware cluster where the VM is hosted.

    ```powershell
    Get-AzVMSize -ResourceGroupName $resourceGroup -VMName $vmName
    ```

3. Run the following commands to resize the VM.

    ```powershell
    $vm = Get-AzVM -ResourceGroupName $resourceGroup -VMName $vmName
    $vm.HardwareProfile.VmSize = "<newAv2VMsize>"
    Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
    ```

## Next steps
Learn more about the [Av2-series VMs](av2-series.md)


