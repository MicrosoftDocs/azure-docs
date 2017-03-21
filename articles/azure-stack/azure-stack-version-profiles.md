---
title: Using Version Profiles in Azure Stack | Microsoft Docs
description: Learn about Version Profiles in Azure Stack.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2017
ms.author: sngun

---

# Using Version Profiles in Azure Stack

Different Azure cloud instances such as Azure Public, Azure Stack, Azure China, Azure Germany, and Azure Government may have different versions of Azure services installed with different capabilities. Version Profiles provide a mechanism to manage these version differences. Version Profile also referred as Azure Resource Manager Version Profile is a set of Azure PowerShell modules with specific API versions. To learn more about Resource Manager Version Profiles, refer to [this]() blog post. 

Each Azure cloud instance has a set of supported profile versions. The Azure Public cloud always supports the latest version of resources across all services whereas other Azure cloud instances may support specific Version Profiles. Resource Manager Version Profiles are available in the Azure .Net SDK as well as in the Azure PowerShell modules. In this document, we walk you through using Resource Manager Profile Versions in Azure Stack PowerShell.

> [!NOTE]
> Azure Stack supports **2017-03-09-profile**, when a user installs this profile, the Azure PowerShell modules that correspond to the specified profile are installed.
 
## Install PowerShell module required to use Version Profiles

The **AzureRM.Bootstrapper** module provides PowerShell commands that are required to work with Resource Manager Version Profiles. This module is available through the PowerShell Gallery. Use the following command to install the AzureRM.Bootstrapper module:

```PowerShell
# Install the bootstrapper module in the current user scope. To install the module for all users, replace the value of “Scope” parameter with “AllUsers”
Install-Module -Name AzureRm.BootStrapper -Scope CurrentUser

# Import the bootstrapper module into the current PowerShell session
Import-Module -Name AzureRm.Bootstrapper
```

## Operations on Profiles

###Install a Profile

Use the **Install-AzureRmProfile** command to install the modules associates with a specific Profile.

```PowerShell
# Installs the specified Version Profile in the current user scope. 
Install-AzureRMProfile -Profile 2017-03-09-profile -Scope CurrentUser
```
## Install and import modules in a Profile

Use the **Use-AzureRmProfile** command to install and import modules in a profile. By using this command, you can also install and import selected Azure modules. This command runs the following tasks:

* Checks if the PowerShell modules associated with Version Profile are installed in the current scope.  
* Downloads the modules if they are not already present.  
* Installs the modules if they are not already installed.  
* Imports the modules into the current PowerShell session. 

```PowerShell
# Installs and imports the specified Version Profile into the current PowerShell session.
Use-AzureRmProfile -Profile 2017-03-09-profile -Scope CurrentUser

# Installs and imports the specified Version Profile into the current PowerShell session without any prompts
Use-AzureRmProfile -Profile 2017-03-09-profile -Scope CurrentUser -Force

# Installs and imports the compute, Storage and Network modules from the specified Version Profile into your current PowerShell session.
Use-AzureRmProfile -Profile 2017-03-09-profile -Module AzureRM.Compute, AzureRM.Storage, AzureRM.Network
```

> [!NOTE]
> A PowerShell session can only have one Version Profile imported. To import a different Version Profile, you must open a new PowerShell session.

### Get the installed profiles

Use the **Get-AzureRmProfile** cmdlet to get the list of available Version Profiles. 

```PowerShell
# lists all available Version Profiles. This command lists the “2017-03-09-profile” and “latest” version profiles. 
Get-AzureRmProfile -ListAvailable 

# lists the Version Profiles that are currently installed on your machine
Get-AzureRmProfile
```
## Update profiles

Use the **Update-AzureRmProfile** command to update the modules in a Profile to the latest version that is available in the PSGallery.  

```PowerShell
# Updates the specified Version Profiles
Update-AzureRmProfile -Profile 2017-03-09-profile
```

This command runs the following tasks:

* Checks if the latest versions of modules in the given Version Profile are installed in the current scope.  
* Prompts the user to install the latest version of PowerShell modules in the given Version Profile.  
* Installs the updated version.  
* Imports the updated modules into the current PowerShell session.  

Use the update command along with the **-RemovePreviousVersions** parameter to update the modules in a profile to the latest version and to remove the previously installed versions of the modules. 

```PowerShell
# Updates the specified Version Profile and removes the previously installed versions. 
Update-AzureRmProfile -Profile 2017-03-09-profile -RemovePreviousVersions
```

This command runs the following tasks:
* Checks if the latest versions of modules are installed in the given Version Profile for the current scope.  
* Removes older versions of modules from the current Profile for a given scope.  
* Removes older versions of modules from the current PowerShell session.  
* prompts the user to install the latest version.  
* Installs the updated version.  
* Imports the updated modules into the current PowerShell session.  
 
> [!NOTE]
> Its recommended to always run the **Update-AzureRmProfile** command in a new PowerShell session to avoid conflicts when importing modules. 

### Uninstall profiles

Use the **Uninstall-AzureRmProfile** command to uninstall a profile.

```PowerShell 
# Uninstalls the specified Version Profile from the current machine.
Uninstall-AzureRmProfile -Profile 2017-03-09-profile
```

