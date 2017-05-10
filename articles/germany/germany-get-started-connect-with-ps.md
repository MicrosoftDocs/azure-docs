---
title: Azure Germany Connect with PowerShell | Microsoft Docs
description: Information on managing your subscription in Azure Germany by connecting with PowerShell
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---

# Connect to Azure Germany with PowerShell
To use Azure PowerShell with Azure Germany, you need to connect to Azure Germany instead of global Azure. Azure PowerShell can be used to manage a large subscription through script or to access features that are not currently available in the Azure portal. If you have used PowerShell in global Azure, it is mostly the same.  The differences in Azure Germany are:

* Connecting your account
* Region names

> [!NOTE]
> If you have not used PowerShell yet, check out the [Introduction to Azure PowerShell](/powershell/azure/overview).


When you start PowerShell, you have to tell Azure PowerShell to connect to Azure Germany by specifying an environment parameter.  The parameter ensures that PowerShell is connecting to the correct endpoints.  The collection of endpoints is determined when you connect to your account. Different APIs require different versions of the environment switch:

| Connection type | Command |
| --- | --- |
| [Azure (Classic deployment model)](https://msdn.microsoft.com/library/dn708504.aspx) commands |`Add-AzureAccount -Environment AzureGermanCloud` |
| [Azure (Resource Manager deployment model)](https://msdn.microsoft.com/library/mt125356.aspx) commands |`Login-AzureRmAccount -EnvironmentName AzureGermanCloud` |
| [Azure Active Directory (Classic deployment model)](https://msdn.microsoft.com/library/azure/jj151815.aspx) commands |`Connect-MsolService -AzureEnvironment AzureGermanyCloud` |
| [Azure Active Directory (Resource Manager deployment model)](https://msdn.microsoft.com/library/azure/mt757189.aspx) commands |`Connect-AzureAD -AzureEnvironmentName AzureGermanyCloud` |

You may also use the `Environment` switch when connecting to a storage account using `New-AzureStorageContext` and specify `AzureGermanCloud`.

### Determining region
Once you are connected, there is one additional difference – The regions used to target a service.  Every Azure cloud has different regions.  You can see them listed on the service availability page.  You normally use the region in the `Location` parameter for a command.


| Common Name | Display Name | Location Name |
| --- | --- | --- |
| Germany Central |`Germany Central` | `germanycentral` |
| Germany Northeast |`Germany Northeast` | `germanynortheast` |


> [!NOTE]
> As is true with PowerShell for global Azure, you can use either the Display Name or the Location Name for the `Location` parameter.
>
>

If you ever want to validate the available regions in Azure Germany, you can run the following commands and print the current list. For classic deployments, use the first command; for Resource Manager deployments, use the second line.

    Get-AzureLocation
    Get-AzureRmLocation

If you are curious about the available environments across Azure, you can run:

    Get-AzureEnvironment
    Get-AzureRmEnvironment

### Next steps
For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany with Azure CLI](./germany-get-started-connect-with-cli.md)
* [Connect to Azure Germany with Visual Studio](./germany-get-started-connect-with-vs.md)
* [Connect to Azure Germany with Portal](./germany-get-started-connect-with-portal.md)




