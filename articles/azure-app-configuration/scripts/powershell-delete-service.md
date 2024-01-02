---
title: PowerShell script sample - Delete an Azure App Configuration store
titleSuffix: Azure App Configuration
description: Delete an Azure App Configuration store using a sample PowerShell script. See reference article links to commands used in the script.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: sample
ms.date: 02/02/2023
ms.author: malev 
ms.custom:
---

# Delete an Azure App Configuration store with PowerShell

This sample script deletes an instance of Azure App Configuration using PowerShell.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

To execute this sample script, you need a functional setup of [Azure PowerShell](/powershell/azure/).

Open a PowerShell window with admin rights and run `Install-Module -Name Az` to install Azure PowerShell

## Sample script

```powershell
# Delete an App Configuration store
Remove-AzAppConfigurationStore -Name <store-name> -ResourceGroupName <resource-group-name>
```

## Script explanation

This script uses the following command to delete an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Remove-AzAppConfigurationStore](/powershell/module/az.appconfiguration/Remove-AzAppConfigurationStore) | Deletes an App Configuration store. |

## Next steps

For more information about Azure PowerShell, check out the [Azure PowerShell documentation](/powershell/azure/).

More App Configuration script samples for PowerShell can be found in the [Azure App Configuration PowerShell samples](../powershell-samples.md).
