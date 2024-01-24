---
title: Size series retirement overview
description: Overview of the retirement of virtual machine size series and explaination of reasoning behind retirement.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: overview
ms.date: 01/17/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

Retiring hardware is necessary over time to ensure that the latest and greatest technology is being used. This ensures that the hardware is reliable, secure, and efficient. It also allows for the latest features and capabilities to be used by customers. When hardware is retired, it is recommended to migrate your workloads to newer hardware that provides better performance and reliability. This will help you to avoid any potential issues that may arise from using outdated hardware. By keeping your hardware up-to-date, you can ensure that your workloads are running smoothly and efficiently.

## Previous-gen sizes
Previous generation sizes **are not currently retired** and can still be used. These sizes will eventually be retired, so it is still recommended to migrate to the latest generation replacements as soon as possible. For a list of sizes which are considered "previous-gen", see the [list of previous-gen sizes](./previous_gen_sizes_list.md). 

## Migrate to newer sizes by resizing your VM

### [Portal](#tab/retire-in-portal)
1. Open the [Azure portal](https://portal.azure.com). <br/><br/>
1. Type *virtual machines* in the search. Under **Services**, select **Virtual machines**.
    ![Screenshot of the Azure portal search bar](./media/portal_vms_search.png)<br/><br/>
1. In the **Virtual machines** page, select the virtual machine you want to resize.
    ![Screenshot of an example VM selected](./media/portal_select_vm.png)<br/><br/>
1. In the left menu, select **size**. Pick a new compatible size from the list of available sizes 
    ![Size selection in the Azure portal](./media/portal_size_select.png)<br/><br/>
1. After picking a size, select **Resize**.
    ![Resize button in the Azure portal](./media/portal_resize_button.png)<br/><br/>

### [PowerShell](#tab/retire-in-PS)
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