---
title: Connect to Azure Germany by using PowerShell | Microsoft Docs
description: Information on managing your subscription in Azure Germany by using PowerShell
ms.topic: article
ms.date: 10/16/2020
author: gitralf
ms.author: ralfwi 
ms.service: germany
ms.custom: bfdocs
---

# Connect to Azure Germany by using PowerShell

[!INCLUDE [closureinfo](../../includes/germany-closure-info.md)]

To use Azure PowerShell with Azure Germany, you need to connect to Azure Germany instead of global Azure. You can use Azure PowerShell to manage a large subscription through a script or to access features that are not currently available in the Azure portal. If you have used PowerShell in global Azure, it's mostly the same. The differences in Azure Germany are:

* Connecting your account
* Region names

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

> [!NOTE]
> If you have not used PowerShell yet, check out [Introduction to Azure PowerShell](/powershell/azure/).

When you start PowerShell, you have to tell Azure PowerShell to connect to Azure Germany by specifying an environment parameter. The parameter ensures that PowerShell is connecting to the correct endpoints. The collection of endpoints is determined when you connect to your account. Different APIs require different versions of the environment switch:

| Connection type | Command |
| --- | --- |
| [Azure (classic deployment model)](/powershell/azure) commands |`Add-AzureAccount -Environment AzureGermanCloud` |
| [Azure (Resource Manager deployment model)](/powershell/azure) commands |`Connect-AzAccount -EnvironmentName AzureGermanCloud` |
| [Azure Active Directory (classic deployment model)](/previous-versions/azure/jj151815(v=azure.100)) commands |`Connect-MsolService -AzureEnvironment AzureGermanyCloud` |
| [Azure Active Directory (Resource Manager deployment model)](/azure/azure-resource-manager/management/deployment-models) commands |`Connect-AzureAD -AzureEnvironmentName AzureGermanyCloud` |

You can also use the `Environment` switch when connecting to a storage account by using `New-AzStorageContext`, and then specify `AzureGermanCloud`.

## Determining region
After you're connected, there is one more difference: the regions that are used to target a service. Every Azure cloud service has different regions. You can see them listed on the service availability page. You normally use the region in the `Location` parameter for a command.


| Common name | Display name | Location name |
| --- | --- | --- |
| Germany Central |`Germany Central` | `germanycentral` |
| Germany Northeast |`Germany Northeast` | `germanynortheast` |


> [!NOTE]
> As is true with PowerShell for global Azure, you can use either the display name or the location name for the `Location` parameter.
>
>

If you ever want to validate the available regions in Azure Germany, you can run the following commands and print the current list. For classic deployments, use the first command. For Resource Manager deployments, use the second command.

```azurepowershell
Get-AzureLocation
Get-AzLocation
```

If you're curious about the available environments across Azure, you can run:

```azurepowershell
Get-AzureEnvironment
Get-AzEnvironment
```

## Next steps
For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany by using Azure CLI](./germany-get-started-connect-with-cli.md)
* [Connect to Azure Germany by using Visual Studio](./germany-get-started-connect-with-vs.md)
* [Connect to Azure Germany by using the Azure portal](./germany-get-started-connect-with-portal.md)




