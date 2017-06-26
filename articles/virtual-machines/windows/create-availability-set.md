---
title: Create a VM availability set in Azure | Microsoft Docs
description: Learn how to create a managed availability set or unmanaged availability set for your virtual machines using Azure PowerShell or the portal in the Resource Manager deployment model.
keywords: availability set
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: a3db8659-ace8-4e78-8b8c-1e75c04c042c
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: cynthn
ms.custom: H1Hack27Feb2017
---
# Increase VM availability by creating an Azure availability set 
Availability sets provide redundancy to your application. We recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine will be available and meet the 99.95% Azure SLA. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

> [!IMPORTANT]
> VMs must be created in the same resource group as the availability set.
> 

If you want your VM to be part of an availability set, you need to create the availability set first or while you are creating your first VM in the set. If your VM will be using Managed Disks, the availability set must be created as a managed availability set.

For more information about creating and using availability sets, see [Manage the availability of virtual machines](manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Use the portal to create an availability set before creating your VMs
1. In the hub menu, click **Browse** and select **Availability sets**.
2. On the **Availability sets blade**, click **Add**.
   
    ![Screenshot that shows the add button for creating a new availability set.](./media/create-availability-set/add-availability-set.png)
3. On the **Create availability set** blade, complete the information for your set.
   
    ![Screenshot that shows the information you need to enter to create the availability set.](./media/create-availability-set/create-availability-set.png)
   
   * **Name** - the name should be 1-80 characters made up of numbers, letters, periods, underscores and dashes. The first character must be a letter or number. The last character must be a letter, number or underscore.
   * **Fault domains** - fault domains define the group of virtual machines that share a common power source and network switch. By default, the VMs  are separated across up to three fault domains and can be changed to between 1 and 3.
   * **Update domains** -  five update domains are assigned by default and this can be set to between 1 and 20. Update domains indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. For example, if we specify five update domains, when more than five virtual machines are configured within a single Availability Set, the sixth virtual machine will be placed into the same update domain as the first virtual machine, the seventh in the same UD as the second virtual machine, and so on. The order of the reboots may not be sequential, but only one update domain will be rebooted at a time.
   * **Subscription** - select the subscription to use if you have more than one.
   * **Resource group** - select an existing resource group by clicking the arrow and selecting a resource group from the drop down. You can also create a new resource group by typing in a name. The name can contain any of the following characters: letters, numbers, periods, dashes, underscores and opening or closing parenthesis. The name cannot end in a period. All of the VMs in the availability group need to be created in the same resource group as the availability set.
   * **Location** - select a location from the drop-down.
   * **Managed** - select *Yes* to create a managed availability set to use with VMs that use Managed Disks for storage. Select **No** if the VMs that will be in the set use unmanaged disks in a storage account.
   
4. When you are done entering the information, click **Create**. 

## Use the portal to create a virtual machine and an availability set at the same time
If you are creating a new VM using the portal, you can also create a new availability set for the VM while you create the first VM in the set. If you choose to use Managed Disks for your VM, a managed availability set will be created.

![Screenshot that shows the process for creating a new availability set while you create the VM.](./media/create-availability-set/new-vm-avail-set.png)

## Add a new VM to an existing availability set in the portal
For each additional VM that you create that should belong in the set, make sure that you create it in the same **resource group** and then select the existing availability set in Step 3. 

![Screenshot showing how to select an existing availability set to use for your VM.](./media/create-availability-set/add-vm-to-set.png)

## Use PowerShell to create an availability set
This example creates an availability set named **myAvailabilitySet** in the **myResourceGroup** resource group in the **West US** location. This needs to be done before you create the first VM that will be in the set.

Before you begin, make sure that you have the latest version of the AzureRM.Compute PowerShell module. Run the following command to install it.

```powershell
Install-Module AzureRM.Compute -RequiredVersion 2.6.0
```
For more information, see [Azure PowerShell Versioning](/powershell/azure/overview).


If you are using managed disks for your VMs, type:

```powershell
    New-AzureRmAvailabilitySet -ResourceGroupName "myResourceGroup" '
	-Name "myAvailabilitySet" -Location "West US" -managed
```

If you are using your own storage accounts for your VMs, type:

```powershell
    New-AzureRmAvailabilitySet -ResourceGroupName "myResourceGroup" '
	-Name "myAvailabilitySet" -Location "West US" 
```

For more information, see [New-AzureRmAvailabilitySet](/powershell/module/azurerm.compute/new-azurermavailabilityset).

## Troubleshooting
* When you create a VM, if the availability set you want isn't in the drop-down list in the portal you may have created it in a different resource group. If you don't know the resource group for your availability set, go to the hub menu and click Browse > Availability sets to see a list of your availability sets and which resource groups they belong to.

## Next steps
Add additional storage to your VM by adding an additional [data disk](attach-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

