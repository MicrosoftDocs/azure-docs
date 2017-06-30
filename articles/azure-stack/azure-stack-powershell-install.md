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
ms.date: 07/10/2017
ms.author: sngun

---

# Install PowerShell for Azure Stack  

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack. In this guide, we walk you through the steps required to install PowerShell for Azure Stack. You can use the steps described in this article either from the Azure Stack Development Kit, or from a Windows-based external client if you are connected through VPN.

This article has detailed instructions to install PowerShell for Azure Stack. However, if you want to quickly install and configure PowerShell, you can use the script provided in the [Get up and running with PowerShell](azure-stack-powershell-configure-quickstart.md) topic. 

> [!NOTE]
> The following steps require PowerShell 5.0. To check your version, run $PSVersionTable.PSVersion and compare the "Major" version.

PowerShell commands for Azure Stack are installed through the PowerShell gallery. To regiser the PSGallery repository, open an elevated PowerShell session from the development kit or from a Windows-based external client if you are connected through VPN and run the following command:

```powershell
Set-PSRepository `
  -Name "PSGallery" `
  -InstallationPolicy Trusted
```

## Install the required version of PowerShell modules

Before installing the required version, make sure that you uninstall any existing Azure PowerShell modules. You can uninstall them by using one of the following two methods:

a. To uninstall the existing PowerShell modules, sign in to the development kit, or to the Windows-based external client if you are planning to establish a VPN connection. Close all the active PowerShell sessions and run the following command: 

   ```powershell
   Get-Module -ListAvailable | where-Object {$_.Name -like “Azure*”} | Uninstall-Module
   ```

b. Sign in to the development kit, or to the Windows-based external client if you are planning to establish a VPN connection. Delete all the folders that start with "Azure" from the `C:\Program Files\WindowsPowerShell\Modules` and `C:\Users\AzureStackAdmin\Documents\WindowsPowerShell\Modules` folders. Deleting these folders removes any existing PowerShell modules from the "AzureStackAdmin" and "global" user scopes. 

Now, use the following steps to install PowerShell for Azure Stack:  

1. Azure Stack compatible AzureRM modules are installed through API version profiles.
To learn about API version profiles and the cmdlets provided by them,
refer to the [manage API version profiles](azure-stack-version-profiles.md)
article. The AzureRM.Bootstrapper module provides PowerShell commands that are 
required to work with API version profiles. Use the following 
command to install the AzureRM.Bootstrapper module:  

  ```powershell
  # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet 
  Install-Module `
    -Name AzureRm.BootStrapper
  ```
2. Run the following command to install the **2017-03-09-profile** version of the 
AzureRM modules for Compute, Storage, Network, Key Vault etc.  

  ```powershell
  # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
  Use-AzureRmProfile `
    -Profile 2017-03-09-profile -Force
  ```
3. In addition to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules such as AzureStackAdmin, and AzureStackStorage by running the following command:  

  ```powershell
  Install-Module `
    -Name AzureStack `
    -RequiredVersion 1.2.10
  ```
4. To confirm the installation, run the following command:  

  ```powershell
  Get-Module `
    -ListAvailable | where-Object {$_.Name -like “Azure*”}
  ```
  If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

## Next steps

* [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md)
* [Configure PowerShell for use with Azure Stack](azure-stack-powershell-configure.md)  
* [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md)  
