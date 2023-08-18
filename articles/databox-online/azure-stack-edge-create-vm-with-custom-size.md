---
title: Create a VM image with custom number of cores, memory, and GPU count.
description: Learn how to create a VM image of custom size.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/18/2023
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to create VM images with custom number of cores, memory, and GPU count.
---
# Create a VM image with custom size

[!INCLUDE [applies-to-GPU-sku](../../includes/azure-stack-edge-applies-to-gpu-sku.md)]

This article describes how to create a VM image with custom number of cores, memory, and GPU count.

If the standard VM sizes do not meet your needs, you can configure a standard VM size with custom number of cores, memory, and GPU count.

Use the following steps to create a new VM.

1. Connect to the PowerShell interface of your device. For detailed steps, see [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

1. Run the following command to see available VM sizes on your device, including the custom sizes:

   ```azurepowershell
   Get-AzVmSize -Location dbelocal 
   ``` 

1. Run the following command to see the names and current values for custom VM sizes on your device:

   ```azurepowershell
   Get-HcsVMCustomSizes
   ```
 
   Here's example output for a machine with a T4 GPU:

   ```Output
   [DBE-BNVGF33.microsoftdatabox.com]: PS>Get-HcsVMCustomSizes 

   [{'Name':'Custom_NonGPU','Cores':8,'MemoryMb':14336},{'Name':'Custom_GPU_T4_v3','Cores':8,'MemoryMb':28672,'GpuCount': 1}] 
   ``` 

   Here's example output for a machine with an A2 GPU: 

   ```Output
   [DBE-BNVGF33.microsoftdatabox.com]: PS>Get-HcsVMCustomSizes 

   [{'Name':'Custom_NonGPU','Cores':8,'MemoryMb':14336},{'Name':'Custom_GPU_A2','Cores':8,'MemoryMb':28672,'GpuCount': 1}] 
   ```

1. Run the following command to change the `Cores` or `MemoryMb` values for a VM you deploy to your device.
 
Consider the following requirements and restrictions:
   1. The `Name` for these sizes cannot be modified.
   1. `GpuCount` can only be a value compatible with the number of GPUs on your device, which is 1 or 2.
   1. Make sure to modify the correct GPU custom size that corresponds with the GPU on your device.
   1. Once a VM is deployed with a custom size, you cannot modify that custom size again. To make a change, you will have to remove that VM first.
   1. Once an operation kicks off, wait at least five minutes before you deploy any other VMs or workloads; this command takes about 5 minutes to complete.

   ```azurepowershell
   Set-HcsVMCustomSizes -CustomVMSizesJson <string> [-JsonFormat]
   ```

   Here's example output where `Custom_NonGPU` is modified to have four cores and 4096 MiB of memory. 

   ```Output
   [DBE-BNVGF33.microsoftdatabox.com]: PS>Set-HcsVMCustomSizes -CustomVMSizesJson "[{'Name':'Custom_NonGPU','Cores':4,'MemoryMb':4096},{'Name':'Custom_GPU_T4_v3','Cores':8,'MemoryMb':28672,'GpuCount':2}]"

   [{'Name':'Custom_NonGPU','Cores':4,'MemoryMb':4096},{'Name':'Custom_GPU_T4_v3','Cores':8,'MemoryMb':28672,'GpuCount':2}] 
   ```

1. Run the following command again to verify that the changes propagated successfully. 

   ```azurepowershell
   Get-AzVmSize -Location dbelocal
   ```

In Azure portal, the VM size dropdown should also update with the new VM options that you just created. 

## Next steps

 - [azure-stack-edge-gpu-virtual-machine-sizes.md](azure-stack-edge-gpu-virtual-machine-sizes.md).
