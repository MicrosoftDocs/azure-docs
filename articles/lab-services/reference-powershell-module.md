---
title: PowerShell module for Azure Lab Services | Microsoft Docs
description: This article provides information about a PowerShell module that helps with managing artifacts in Azure Lab Services. 
ms.topic: how-to
ms.date: 12/12/2021
---

# Az.LabServices PowerShell module (preview) to create, query, update and delete Azure Lab Services resources

[Az.LabServices (preview)](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Modules/Library) is a PowerShell module that simplifies the management of Azure Lab Services. This module provides composable functions to create, query, update and delete lab accounts, labs, VMs, and Images. 

Here is an example of using a PowerShell command to stop all the running VMs in all labs.

```powershell
Get-AzLabAccount | Get-AzLab | Get-AzLabVm -Status Running | Stop-AzLabVm
```

## Install & launch

1. Install [Azure PowerShell](/powershell/azure/) if it doesn't exist on your machine. 

1. Download [Az.LabServices.psm1](https://github.com/Azure/azure-devtestlab/blob/master/samples/ClassroomLabs/Modules/Library/Az.LabServices.psm1) to your machine.

1. Import the module:

    ```powershell
    Import-Module .\Az.LabServices.psm1
    ```
1. Run the following command to list all the labs in your subscription.

    ```powershell
    Get-AzLabAccount | Get-AzLab
    ```
    
## Next steps

Learn more about module at the [Az.LabServices home page on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Modules/Library).
