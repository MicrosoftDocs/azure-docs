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
ms.date: 08/03/2017
ms.author: sngun

---

# Install PowerShell for Azure Stack  

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack. In this guide, we walk you through the steps required to install PowerShell for Azure Stack. You can use the steps described in this article either from the Azure Stack Development Kit, or from a Windows-based external client if you are connected through VPN.

This article has detailed instructions to install PowerShell for Azure Stack. However, if you want to quickly install and configure PowerShell, you can use the script that is provided in the [Get up and running with PowerShell](azure-stack-powershell-configure-quickstart.md) topic. 

> [!NOTE]
> The following steps require PowerShell 5.0. To check your version, run $PSVersionTable.PSVersion and compare the "Major" version.

PowerShell commands for Azure Stack are installed through the PowerShell gallery. To regiser the PSGallery repository, open an elevated PowerShell session from the development kit or from a Windows-based external client if you are connected through VPN and run the following command:

```powershell
Set-PSRepository `
  -Name "PSGallery" `
  -InstallationPolicy Trusted
```

## Uninstall existing versions of PowerShell

Before installing the required version, make sure that you uninstall any existing Azure PowerShell modules. You can uninstall them by using one of the following two methods:

* To uninstall the existing PowerShell modules, sign in to the development kit, or to the Windows-based external client if you are planning to establish a VPN connection. Close all the active PowerShell sessions and run the following command: 

   ```powershell
   Get-Module -ListAvailable | where-Object {$_.Name -like “Azure*”} | Uninstall-Module
   ```

* Sign in to the development kit, or to the Windows-based external client if you are planning to establish a VPN connection. Delete all the folders that start with "Azure" from the `C:\Program Files (x86)\WindowsPowerShell\Modules` and `C:\Users\AzureStackAdmin\Documents\WindowsPowerShell\Modules` folders. Deleting these folders removes any existing PowerShell modules from the "AzureStackAdmin" and "global" user scopes. 

The following sections describe the steps required to install PowerShell for Azure Stack. PowerShell can be installed on Azure Stack that is operated in connected, partially connected, or in a disconnected scenario. 

## Install PowerShell in a connected scenario 

Azure Stack compatible AzureRM modules are installed through API version profiles. Azure Stack requires the **2017-03-09-profile** API version profile, which is available by installing the AzureRM.Bootstrapper module. To learn about API version profiles and the cmdlets provided by them,
 refer to the [manage API version profiles](azure-stack-version-profiles.md). In addition to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules. Run the following PowerShell script to install these modules on your development workstation:

  ```powershell
  # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet 
  Install-Module `
    -Name AzureRm.BootStrapper

  # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
  Use-AzureRmProfile `
    -Profile 2017-03-09-profile -Force

  Install-Module `
    -Name AzureStack `
    -RequiredVersion 1.2.10
  ```

To confirm the installation, run the following command:

  ```powershell
  Get-Module `
    -ListAvailable | where-Object {$_.Name -like “Azure*”}
  ```
  If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

## Install PowerShell in a disconnected or in a partially connected scenario

In a disconnected scenario, you must first download the PowerShell modules to a machine that has internet connectivity, and then transfer them to the Azure Stack Development Kit for installation.

1. Sign in to a computer where you have internet connectivity and use the following script to download the AzureRM, and AzureStack packages onto your local computer:

   ```powershell
   $Path = "<Path that is used to save the packages>"

   Save-Package `
     -ProviderName NuGet `
     -Source https://www.powershellgallery.com/api/v2 `
     -Name AzureRM `
     -Path $Path `
     -Force `
     -RequiredVersion 1.2.10

   Save-Package `
     -ProviderName NuGet `
     -Source https://www.powershellgallery.com/api/v2 `
     -Name AzureStack `
     -Path $Path `
     -Force `
     -RequiredVersion 1.2.10 
   ```

2. Copy the downloaded packages over to a USB device.

3. Sign in to the development kit and copy the packages from the USB device to a location on the development kit. 

4. Now you must register this location as the default repository and install the AzureRM and AzureStack modules from this repository:

   ```powershell
   $SourceLocation = "<Location on the development kit that contains the PowerShell packages>"
   $RepoName = "MyNuGetSource"

   Register-PSRepository `
     -Name $RepoName `
     -SourceLocation $SourceLocation `
     -InstallationPolicy Trusted

   ```powershell
   Install-Module AzureRM `
     -Repository $RepoName

   Install-Module AzureStack `
     -Repository $RepoName 
   ```

## Next steps

* [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)  
* [Configure the Azure Stack operator's PowerShell environment](azure-stack-powershell-configure-admin.md) 
* [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md)  
