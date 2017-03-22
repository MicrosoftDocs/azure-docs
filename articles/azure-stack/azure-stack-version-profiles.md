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

Different Azure cloud instances such as Azure Public, Azure Stack, Azure China, Azure Germany, and Azure Government have different versions of Azure services installed with different capabilities. Version Profiles provide a mechanism to manage these version differences. Version Profile also referred as Azure Resource Manager Version Profile is a set of Azure PowerShell modules with specific API versions. 

Each Azure cloud instance has a set of supported profile versions. The Azure Public cloud always supports the latest version of resources across all services whereas other Azure cloud instances may support specific Version Profiles. Currently, Version Profiles are available in Azure PowerShell and they will be supported across the entire Azure development chain which includes the Azure .Net SDK, CLI and other Azure development tools. In this document, we walk you through using Version Profiles in Azure Stack PowerShell.

> [!NOTE]
> Azure Stack supports the **2017-03-09-profile** Version Profile, when a user installs this profile, the AzureRM PowerShell modules that correspond to the specified profile are installed. The Azure Stack administrator modules are not available with this Version Profile, and they should be installed separately as specified in the Step 3 of [Install PowerShell for Azure Stack](azure-stack-powershell-install.md) article.
 
## Install the PowerShell module required to use Version Profiles

The **AzureRM.Bootstrapper** module provides PowerShell commands that are required to work with Version Profiles. This module is available through the PowerShell Gallery. Use the following command to install the AzureRM.Bootstrapper module:

```PowerShell
# Install the bootstrapper module in the current user scope. To install the module for all users, replace the value of “Scope” parameter with “AllUsers”
Install-Module -Name AzureRm.BootStrapper -Scope CurrentUser

# Import the bootstrapper module into the current PowerShell session
Import-Module -Name AzureRm.Bootstrapper
```

## Operations on Profiles

###Install a Profile

Use the **Install-AzureRmProfile** command to install the modules associates with a specific Version Profile.

```PowerShell
# Installs the specified Version Profile in the current user scope. 
Install-AzureRMProfile -Profile 2017-03-09-profile -Scope CurrentUser
```
### Install and import modules in a Profile

Use the **Use-AzureRmProfile** command to install and import modules in a Version Profile. By using this command, you can also install and import selected Azure modules from a Version Profile. When you run this command, it does the following tasks:

* Checks if the PowerShell modules associated with the specified Version Profile are installed in the current scope.  
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
> In a PowerShell session, you can import only one Version Profile. To import a different Version Profile, you must open a new PowerShell session. If you try to import more than one Version Profile into a PowerShell session, it will result an error.

### Get the installed profiles

Use the **Get-AzureRmProfile** cmdlet to get the list of available Version Profiles. 

```PowerShell
# lists all Version Profiles provided by the AzureRM.BootStrapper module. This command lists the “2017-03-09-profile” and “latest” version profiles. 
Get-AzureRmProfile -ListAvailable 

# lists the Version Profiles which are installed on your machine
Get-AzureRmProfile
```
### Update profiles

Use the **Update-AzureRmProfile** command to update the modules in a Version Profile to the latest version of modules that are available in the PSGallery.  

```PowerShell
# Updates the modules in the specified Version Profile
Update-AzureRmProfile -Profile 2017-03-09-profile
```

When you run this command, it does the following tasks:

* Checks if the latest versions of modules in the given Version Profile are installed in the current scope.  
* Prompts the user to install the latest version of PowerShell modules in the given Version Profile.  
* Installs the updated version.  
* Imports the updated modules into the current PowerShell session.  

Use the update command along with the **-RemovePreviousVersions** parameter to update the modules in a Version Profile to remove the previously installed versions of the modules and to update to the latest available version. 

```PowerShell
# Removes the previously installed versions and updates the specified Version Profile. 
Update-AzureRmProfile -Profile 2017-03-09-profile -RemovePreviousVersions
```

When you run this command, it does the following tasks:  
* Checks if the latest versions of modules are installed in the given Version Profile for the current scope.  
* Removes older versions of modules from the current Version Profile for a given scope.  
* Removes older versions of modules from the current PowerShell session.  
* prompts the user to install the latest version.  
* Installs the updated version.  
* Imports the updated modules into the current PowerShell session.  
 
> [!NOTE]
> Its recommended to always run the **Update-AzureRmProfile** command in a new PowerShell session to avoid conflicts when importing modules. 

### Uninstall profiles

Use the **Uninstall-AzureRmProfile** command to uninstall a Version Profile.

```PowerShell 
# Uninstalls the specified Version Profile from the current computer.
Uninstall-AzureRmProfile -Profile 2017-03-09-profile
```

