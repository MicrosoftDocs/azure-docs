---
title: Install PowerShell for Azure Stack | Microsoft Docs
description: Learn how to install PowerShell for Azure Stack.
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

# Install PowerShell for Azure Stack  

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack. In this guide, we walk you through the steps required to install PowerShell in Azure Stack by using the PowerShell commands. You can use the steps described in this article either from MAS-CON01, Azure Stack host computer, or from a Windows-based external client if you are connected through VPN.

> [!NOTE]
> The following steps require PowerShell 5.0.  To check your version, run $PSVersionTable.PSVersion and compare the "Major" version.

PowerShell commands for Azure Stack are installed from the PowerShell Gallery. To verify if PowerShell Gallery is available, open a PowerShell Console on the MAS-CON01 computer or on your local computer if you are connected through VPN and run the following command:

```powershell
# Returns a list of PowerShell module repositories that are registered for the current user.
Get-PSRepository
```
![GetPSrepository](media/azure-stack-powershell-install/getpsrepository.png)

## Install the required version of PowerShell modules

Use the following steps to install PowerShell for Azure Stack:  

1. Azure Stack compatible AzureRM modules are installed through Version Profiles. To learn about Version Profiles and the commands provided by Version Profiles, refer to [Using Version Profiles in Azure Stack](azure-stack-version-profiles.md) article. The AzureRM.Bootstrapper module provides PowerShell commands that are required to work with Resource Manager Version Profiles. Use the following command to install the AzureRM.Bootstrapper module:  

```powershell
# Install the bootstrapper module in the current user scope. To install the module for all users, replace the value of “Scope” parameter with “AllUsers”
Install-Module -Name AzureRm.BootStrapper -Scope CurrentUser

# Import the bootstrapper module into the current PowerShell session
Import-Module -Name AzureRm.Bootstrapper
```

2. Run the following command to install the required version of the AzureRM modules for Compute, Storage, Network, Key Vault etc.  

```powershell
# Installs and imports the Version Profile required by Azure Stack into the current PowerShell session. This command installs the AzureRM modules in the current user scope, to install the module for all users, replace the value of “Scope” parameter with             “AllUsers”
Use-AzureRmProfile -Profile 2017-03-09-profile -Scope CurrentUser
```

3. In addition to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules such as AzureStackAdmin, and AzureStackStorage by running the following command:  

```powershell
# To install the AzureStack module in current user scope. To install the module for all users, replace the value of “Scope” parameter with “AllUsers”
Install-Module -Name AzureStack -RequiredVersion 1.2.9 -Scope CurrentUser
```

4. To confirm the installation of AzureRM modules, run the following command:  

```powershell
Get-Module -ListAvailable | where-Object {$_.Name -like “Azure*”}
```

## Next steps
* [Configure PowerShell for use with Azure Stack](azure-stack-powershell-configure.md)  
* [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md)

