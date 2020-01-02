---
title: PowerShell module for Azure Lab Services | Microsoft Docs
description: This article provides information about a PowerShell module that helps with managing artifacts in Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/01/2019
ms.author: spelluru

---
# Az.LabServices PowerShell module (preview)
Az.LabServices is a PowerShell module that simplifies the management of Azure Lab services. It provides composable functions to create, query, update and delete lab accounts, labs, VMs, and Images. For more information about this module, see the [Az.LabServices home page on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Modules/Library).

> [!NOTE]
> This module is in **preview**. 

## Example command
Here is an example of using a PowerShell command to stop all the running VMs in all labs.

```powershell
Get-AzLabAccount | Get-AzLab | Get-AzLabVm -Status Running | Stop-AzLabVm
```

## Get started
1. Install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) if it doesn't exist on your machine. 
2. Download [Az.LabServices.psm1](https://github.com/Azure/azure-devtestlab/blob/master/samples/ClassroomLabs/Modules/Library/Az.LabServices.psm1) to your machine.
3. Import the module:

    ```powershell
    Import-Module .\Az.LabServices.psm1
    ```
4. Run the following command to list all the labs in your subscription.

    ```powershell
    Get-AzLabAccount | Get-AzLab
    ```

## Next steps
See the [Az.LabServices home page on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Modules/Library).
