---
title: Manage VMs running on your Azure Stack Edge Pro GPU device via Azure portal
description: Describes how to manage virtual machines (VMs) running on an Azure Stack Edge Pro GPU device using Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 11/04/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device using APIs so that I can efficiently manage my VMs.
---

# Manage VMs on your Azure Stack Edge Pro GPU device via Azure portal


This tutorial describes how to create and manage a VM on your Azure Stack Edge Pro device using Azure PowerShell.






## Manage VM

The following section describes some of the common operations around the VM that you will create on your Azure Stack Edge Pro device.

### View VMs running on the device

To view a list of the VMs running on your Azure Stack Edge Pro device, follow these steps:


 

### Turn on the VM



### Suspend or shut down the VM

To stop or shut down a virtual machine running on your device, follow these steps:


```powershell
Stop-AzureRmVM [-Name] <String> [-StayProvisioned] [-ResourceGroupName] <String>
```


For more information on this cmdlet, go to [Stop-AzureRmVM cmdlet](https://docs.microsoft.com/powershell/module/azurerm.compute/stop-azurermvm?view=azurermps-6.13.0).

### Add a data disk

If the workload requirements on your VM increase, then you may need to add a data disk. Currently you can't add a data disk to an existing VM via the Azure portal.

### Delete the VM

to remove a virtual machine from your device, follow these steps:


## Next steps

[Azure Resource Manager cmdlets](https://docs.microsoft.com/powershell/module/azurerm.resources/?view=azurermps-6.13.0)
