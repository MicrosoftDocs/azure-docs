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
ms.date: 03/01/2017
ms.author: sngun

---

# Install PowerShell for Azure Stack  

You must use Azure Stack compatible Azure PowerShell modules to work with Azure Stack. In this guide, we walk you through the steps required to install PowerShell in Azure Stack. You can use the steps described in this article either from MAS-CON01, Azure Stack host computer, or from a Windows-based external client if you are connected through VPN. 

Azure Stack supports the 1.2.8 version of Azure PowerShell. Azure Stack compatible AzureRM commands are installed from the PowerShell Gallery. To verify if PowerShell Gallery is available, open a PowerShell Console on the MAS-CON01 computer or on your local computer if you are connected through VPN and run the following command:  

```powershell

Get-PSRepository 

```
This command returns a list of PowerShell module repositories that are registered for the current user. 

![The Region Management tile](media/azure-stack-powershell-install/getpsrepository.png)

You can install Azure Stack PowerShell commands in the following scenarios:  

a.	[Install the required version.](#install-the-required-version)  
b.	[Uninstall the existing version and install the required version.](#uninstall-the-existing-version-and-install-the-required-version)  
c.	[Install the required version along with the existing version.](#install-the-required-version-along-with-the-existing-version)  

## Install the required version

To install the Azure Stack PowerShell modules on a computer, which doesn’t already contain any installed PowerShell modules, use the following steps:  

1. Run the following command to install the required version of the AzureRM modules for Compute, Storage, Network, Key Vault etc. 
  ```powershell
    # To install the module in current user scope
    Install-Module -Name AzureRM -RequiredVersion 1.2.8 -Scope CurrentUser
    
    # To install the module for all users on your computer. Run this command in an elevated PowerShell session
    Install-Module -Name AzureRM -RequiredVersion 1.2.8
 ```

    The **Scope** parameter is optional. 

        •	If set to **CurrentUser**, the module installs only in the current user account.  
        •	If set to **All Users** or not specified, the AzureRM module installs to a location that all users can access.  

    When prompted, type **yes** to trust the PSGallery repository.

2. In addition to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules such as AzureStackAdmin, AzureStackStorage, etc. To do this, run the following command:
 ```powershell
    # To install the module in current user scope
    Install-Module -Name AzureStack -Scope CurrentUser
    
    # To install the module for all users on your computer. Run this command in an elevated PowerShell session
    Install-Module -Name AzureStack
```

3.	To confirm the installation of AzureRM modules, run the following command:
  ```powershell
    Get-Module -ListAvailable
 ```
    If the installation is successful, this command lists the AzureRM and AzureStack modules.


## Uninstall the existing version and install the required version

To install the Azure Stack PowerShell modules on a computer, which already contains a different version of PowerShell modules, use the following steps:  

1.	Uninstall the existing Azure PowerShell commands (AzureRM and Azure modules). To uninstall, close all the active PowerShell sessions and run the following command:
  ```powershell
    Get-Module -ListAvailable | where-Object ($_.Name -like “Azure*”) | Uninstall-Module
```

2.	After uninstalling, follow the steps described in [Install the required version](#install-the-required-version) section.
 
## Install the required version along with the existing version

You can install a new version of PowerShell modules along with an existing version. When you do so, it is recommended that you install the existing and new versions of PowerShell modules in the same user scope. 

For example, If the 1.2.6 version PowerShell modules are already installed in the **CurrentUser scope**, it is recommended that you install the 1.2.8 version PowerShell modules in the same scope. For CurrentUser scope, the modules are installed at `C:\Users\<username>\Documents\WindowsPowerShell\Modules` location.

If the 1.2.6 version PowerShell modules are already installed in the **AllUsers** scope, it is recommended that you install the 1.2.8 version PowerShell modules in the same scope. For AllUsers scope, the modules are installed at `C:\Program Files\WindowsPowerShell\Modules` location.

The steps required to install are same as the steps described in the [Install the required version](#install-the-required-version) section.

> [!NOTE]
> Installing more than one version of PowerShell modules on the same computer is not a recommended option. This is because both the module are installed in the same location and whenever you load a module, you must make sure to specify the full path.

Next steps
•	[Configure PowerShell for use with Azure Stack](azure-stack-powershell-configure.md)  
•	[Download Azure Stack tools from GitHub](azure-stack-powershell-download.md) 
