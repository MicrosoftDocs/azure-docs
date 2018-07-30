---
title: Install PowerShell for Azure Stack | Microsoft Docs
description: Learn how to install PowerShell for Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: article
ms.date: 07/10/2018
ms.author: mabrigg
ms.reviewer: thoroet
---

# Install PowerShell for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack. In this guide, we walk you through the steps required to install PowerShell for Azure Stack. The following steps apply to internet connected environments. Scroll to the bottom of the page for disconnected environments.

This article has detailed instructions to install PowerShell for Azure Stack.

> [!Note]  
> The following steps require at least PowerShell 5.0. To check your version, run $PSVersionTable.PSVersion and compare the **Major** version. If you do not have PowerShell 5.0, follow the [link](https://docs.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell?view=powershell-6#upgrading-existing-windows-powershell) to upgrade to PowerShell 5.0.

PowerShell commands for Azure Stack are installed through the PowerShell Gallery. You can use the following procedure to validate if PSGallery is registered as a repository, open an elevated PowerShell session and run the following command:

```PowerShell
#requires -Version 5
#requires -RunAsAdministrator
#requires -Module PowerShellGet

Import-Module -Name PowerShellGet -ErrorAction Stop
Import-Module -Name PackageManagement -ErrorAction Stop 

Get-PSRepository -Name "PSGallery"
```

If the repository is not registered, open an elevated PowerShell session and run the following command:

```PowerShell
Register-PsRepository -Default
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
```
> [!Note]  
> This step requires Internet access. 

## Uninstall existing versions of the Azure Stack PowerShell modules

Before installing the required version, make sure that you uninstall any previously installed Azure Stack AzureRM PowerShell modules. You can uninstall them by using one of the following two methods:

 - To uninstall the existing AzureRM PowerShell modules, close all the active PowerShell sessions and run the following command:

  ```PowerShell
    Uninstall-Module AzureRM.AzureStackAdmin -Force
    Uninstall-Module AzureRM.AzureStackStorage -Force
    Uninstall-Module -Name AzureStack -Force
  ```

 - Delete all the folders that start with "Azure" from the `C:\Program Files\WindowsPowerShell\Modules` and `C:\Users\AzureStackAdmin\Documents\WindowsPowerShell\Modules` folders. Deleting these folders removes any existing PowerShell modules.

The following sections describe the steps required to install PowerShell for Azure Stack. PowerShell can be installed on Azure Stack that is operated in connected, partially connected, or in a disconnected scenario.

## Install the Azure Stack PowerShell modules in a connected scenario (with Internet connectivity)

Azure Stack compatible AzureRM modules are installed through API version profiles. Azure Stack requires the **2017-03-09-profile** API version profile, which is available by installing the AzureRM.Bootstrapper module. To learn about API version profiles and the cmdlets provided by them, refer to the [manage API version profiles](user/azure-stack-version-profiles.md). In addition to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules. Run the following PowerShell script to install these modules on your development workstation:

  ```PowerShell  
# Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet 
Install-Module -Name AzureRm.BootStrapper 

# Install and import the API Version Profile required by Azure Stack into the current PowerShell session. 
Use-AzureRmProfile -Profile 2017-03-09-profile -Force 

# Install Module Version 1.3.0 if Azure Stack is running 1804 at a minimum 
Install-Module -Name AzureStack -RequiredVersion 1.3.0 

# Install Module Version 1.2.11 if Azure Stack is running a lower version than 1804 
Install-Module -Name AzureStack -RequiredVersion 1.2.11 
  ```

To confirm the installation, run the following command:

```PowerShell  
Get-Module -ListAvailable | where-Object {$_.Name -like "Azs*"}
```

If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

## Install the Azure Stack PowerShell modules in a disconnected or a partially connected scenario (with limited Internet connectivity)

In a disconnected scenario, you must first download the PowerShell modules to a machine that has Internet connectivity, and then transfer them to the Azure Stack Development Kit for installation.

> [!IMPORTANT]  
> The release of the Azure Stack 1.3.0 PowerShell module comes with a list of breaking changes. To upgrade from the 1.2.11 version, see the [migration guide](https://aka.ms/azspowershellmigration).

1. Sign in to a computer where you have internet connectivity and use the following script to download the AzureRM, and AzureStack packages onto your local computer:

   ```PowerShell 
  #requires -Version 5
  #requires -RunAsAdministrator
  #requires -Module PowerShellGet
  #requires -Module PackageManagement
  
  Import-Module -Name PowerShellGet -ErrorAction Stop
  Import-Module -Name PackageManagement -ErrorAction Stop

   $Path = "<Path that is used to save the packages>"

   Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 `
     -Name AzureRM -Path $Path -Force -RequiredVersion 1.2.11

   Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 `
     -Name AzureStack -Path $Path -Force -RequiredVersion 1.3.0 
   ```

  > [!Important]  
  > If you are not running Azure Stack with update 1804 or greater, change the **requiredversion** parameter value to `1.2.11`. 

2. Copy the downloaded packages over to a USB device.

3. Sign in to the workstation and copy the packages from the USB device to a location on the workstation.

4. Now you must register this location as the default repository and install the AzureRM and AzureStack modules from this repository:

   ```PowerShell
   #requires -Version 5
   #requires -RunAsAdministrator
   #requires -Module PowerShellGet
   #requires -Module PackageManagement

   $SourceLocation = "<Location on the development kit that contains the PowerShell packages>"
   $RepoName = "MyNuGetSource"

   Register-PSRepository -Name $RepoName -SourceLocation $SourceLocation  -InstallationPolicy Trusted

   Install-Module AzureRM -Repository $RepoName

   Install-Module AzureStack -Repository $RepoName 
   ```

## Configure PowerShell to use a proxy server

In scenarios that require a proxy server to access the internet, you must first configure the PowerShell to use an existing proxy server.

1. Open an elevated PowerShell prompt.
2. Run the following commands:

````PowerShell  
  #To use Windows credentials for proxy authentication
  [System.Net.WebRequest]::DefaultWebProxy.Credentials = [System.Net.CredentialCache]::DefaultCredentials

  #Alternatively, to prompt for separate credentials that can be used for #proxy authentication

  [System.Net.WebRequest]::DefaultWebProxy.Credentials = Get-Credential
````

## Next steps

 - [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md)
 - [Configure the Azure Stack user's PowerShell environment](user/azure-stack-powershell-configure-user.md)  
 - [Configure the Azure Stack operator's PowerShell environment](azure-stack-powershell-configure-admin.md) 
 - [Manage API version profiles in Azure Stack](user/azure-stack-version-profiles.md)  
