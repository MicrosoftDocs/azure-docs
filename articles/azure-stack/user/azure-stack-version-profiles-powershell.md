---
title: Using API version profiles with PowerShell in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with PowerShell in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: EBAEA4D2-098B-4B5A-A197-2CEA631A1882
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: sethm
ms.reviewer: sijuman

---

# Use API version profiles for PowerShell in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

API version profiles provide a way to manage version differences between Azure and Azure Stack. An API version profile is a set of AzureRM PowerShell modules with specific API versions. Each cloud platform has a set of supported API version profiles. For example, Azure Stack supports a specific dated profile version such as  **2018-03-01-hybrid**, and Azure supports the **latest** API version profile. When you install a profile, the AzureRM PowerShell modules that correspond to the specified profile are installed.

## Install the PowerShell module required to use API version profiles

The **AzureRM.Bootstrapper** module that is available through the PowerShell Gallery provides PowerShell cmdlets that are required to work with API version profiles. Use the following cmdlet to install the AzureRM.Bootstrapper module:

```PowerShell
Install-Module -Name AzureRm.BootStrapper
```

## Azure Stack version and profile versions

The following table lists the required API profile version and PowerShell administrator module moniker used for recent releases of Azure Stack. If you are using this article with a version before 1808, update your version profile and moniker with the correct value.

| Version No. | API version profile | PS admin module moniker |
| --- | --- | --- |
| 1808 or later | 2018-03-01-hybrid | 1.5.0 |
| 1804 or later | 2017-03-09-profile | 1.4.0 |
| Versions before 1804 | 2017-03-09-profile | 1.2.11 |

> [!Note]  
> To upgrade from the 1.2.11 version, see the [Migration Guide](https://aka.ms/azpsh130migration).

## Install a profile

Use the **Install-AzureRmProfile** cmdlet with the **2018-03-01-hybrid** API version profile to install the AzureRM modules required by Azure Stack. The Azure Stack operator modules are not installed with this API version profile. They should be installed separately as specified in the Step 3 of the [Install PowerShell for Azure Stack](../azure-stack-powershell-install.md) article.

```PowerShell 
Install-AzureRMProfile -Profile 2018-03-01-hybrid
```

## Install and import modules in a profile

Use the **Use-AzureRmProfile** cmdlet to install and import modules that are associated with an API version profile. You can import only one API version profile in a PowerShell session. To import a different API version profile, you must open a new PowerShell session. The Use-AzureRMProfile cmdlet runs the following tasks:  
1. Checks if the PowerShell modules associated with the specified API version profile are installed in the current scope.  
2. Downloads and installs the modules if they are not already installed.   
3. Imports the modules into the current PowerShell session. 

```PowerShell
# Installs and imports the specified API version profile into the current PowerShell session.
Use-AzureRmProfile -Profile 2018-03-01-hybrid -Scope CurrentUser

# Installs and imports the specified API version profile into the current PowerShell session without any prompts
Use-AzureRmProfile -Profile 2018-03-01-hybrid -Scope CurrentUser -Force
```

To install and import selected AzureRM modules from an API version profile, run the Use-AzureRMProfile cmdlet with the **Module** parameter:

```PowerShell
# Installs and imports the compute, Storage and Network modules from the specified API version profile into your current PowerShell session.
Use-AzureRmProfile -Profile 2018-03-01-hybrid -Module AzureRM.Compute, AzureRM.Storage, AzureRM.Network
```

## Get the installed profiles

Use the **Get-AzureRmProfile** cmdlet to get the list of available API version profiles: 

```PowerShell
# lists all API version profiles provided by the AzureRM.BootStrapper module.
Get-AzureRmProfile -ListAvailable 

# lists the API version profiles which are installed on your machine
Get-AzureRmProfile
```

## Update profiles

Use the **Update-AzureRmProfile** cmdlet to update the modules in an API version profile to the latest version of modules that are available in the PSGallery. It's recommended to always run the **Update-AzureRmProfile** cmdlet in a new PowerShell session to avoid conflicts when importing modules. The Update-AzureRmProfile cmdlet runs the following tasks:

1. Checks if the latest versions of modules are installed in the given API version profile for the current scope.  
2. Prompts you to install if they are not already installed.  
3. Installs and imports the updated modules into the current PowerShell session.  

```PowerShell
Update-AzureRmProfile -Profile 2018-03-01-hybrid
```

<!-- To remove the previously installed versions of the modules before updating to the latest available version, use the Update-AzureRmProfile cmdlet along with the **-RemovePreviousVersions** parameter:

```PowerShell 
Update-AzureRmProfile -Profile 2018-03-01-hybrid -RemovePreviousVersions
``` --> 

This cmdlet runs the following tasks:  

1. Checks if the latest versions of modules are installed in the given API version profile for the current scope.  
2. Removes the older versions of modules from the current API version profile and in the current PowerShell session.  
4. prompts you to install the latest version.  
5. Installs and imports the updated modules into the current PowerShell session.  
 
## Uninstall profiles

Use the **Uninstall-AzureRmProfile** cmdlet to uninstall the specified API version profile.

```PowerShell 
Uninstall-AzureRmProfile -Profile  2018-03-01-hybrid
```

## Next steps
* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)  
