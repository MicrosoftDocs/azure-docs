---
title: Install PowerShell for Azure Stack | Microsoft Docs
description: Learn how to install PowerShell for Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: article
ms.date: 09/18/2018
ms.author: sethm
ms.reviewer: thoroet
---

# Install PowerShell for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

To work with your cloud, you must install Azure Stack compatible PowerShell modules. Compatibility is enabled through a feature called *API profiles*.

API profiles provide a way to manage version differences between Azure and Azure Stack. An API version profile is a set of Azure Resource Manager PowerShell modules with specific API versions. Each cloud platform has a set of supported API version profiles. For example, Azure Stack supports a specific dated profile version such as **2018-03-01-hybrid**, and Azure supports the **latest** API version profile. When you install a profile, the Azure Resource Manager PowerShell modules that correspond to the specified profile are installed.

You can install Azure Stack compatible PowerShell modules in Internet connected, partially connected, or disconnected scenarios. This article walks through the detailed instructions to install PowerShell for Azure Stack for these scenarios.

## 1. Verify your prerequisites

Before you get started with Azure Stack and PowerShell, you must have the following prerequisites:

- **PowerShell Version 5.0**
To check your version, run **$PSVersionTable.PSVersion** and compare the **Major** version. If you do not have PowerShell 5.0, follow the [Installing Windows PowerShell](https://docs.microsoft.com/powershell/scripting/setup/installing-windows-powershell?view=powershell-6#upgrading-existing-windows-powershell).

  > [!Note]
  > PowerShell 5.0 requires a Windows machine.

- **Run Powershell in an elevated command prompt**
  You must run PowerShell with administrative privileges.

- **PowerShell Gallery access**
  You need access to the [PowerShell Gallery](https://www.powershellgallery.com). The gallery is the central repository for PowerShell content. The **PowerShellGet** module contains cmdlets for discovering, installing, updating, and publishing PowerShell artifacts such as modules, DSC resources, role capabilities, and scripts from the PowerShell Gallery and other private repositories. If you are using PowerShell in a disconnected scenario, you must retrieve resources from a machine with a connection to the Internet and store them in a location accessible to your disconnected machine.


## 2. Validate the PowerShell Gallery accessibility

Validate if PSGallery is registered as a repository.

> [!Note]
> This step requires Internet access.

Open an elevated PowerShell prompt, and run the following cmdlets:

````PowerShell
Import-Module -Name PowerShellGet -ErrorAction Stop
Import-Module -Name PackageManagement -ErrorAction Stop
Get-PSRepository -Name "PSGallery"
````

If the repository is not registered, open an elevated PowerShell session and run the following command:

```PowerShell
Register-PsRepository -Default
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
```

## 3. Uninstall existing versions of the Azure Stack PowerShell modules

Before installing the required version, make sure that you uninstall any previously installed Azure Stack AzureRM PowerShell modules. You can uninstall them by using one of the following two methods:

1. To uninstall the existing AzureRM PowerShell modules, close all the active PowerShell sessions, and run the following cmdlets:

  ````PowerShell
    Uninstall-Module -Name AzureRM.AzureStackAdmin -Force
    Uninstall-Module -Name AzureRM.AzureStackStorage -Force
    Uninstall-Module -Name AzureStack -Force
    Get-Module -Name Azs.* -ListAvailable | Uninstall-Module -Force
  ````

2. Delete all the folders that start with `Azure` from the `C:\Program Files\WindowsPowerShell\Modules` and `C:\Users\{yourusername}\Documents\WindowsPowerShell\Modules` folders. Deleting these folders removes any existing PowerShell modules.

## 4. Connected: Install PowerShell for Azure Stack with Internet connectivity

Azure Stack requires the **2018-03-01-hybrid** API version profile for Azure Stack version 1808. The profile is available by installing the **AzureRM.Bootstrapper** module. In addition, to the AzureRM modules, you should also install the Azure Stack-specific PowerShell modules. The API version profile and Azure Stack PowerShell modules you require will depend on the version of Azure Stack your are running.

Run the following PowerShell script to install these modules on your development workstation:

  - Azure Stack 1808 or later.

    ```PowerShell
    # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet
    Install-Module -Name AzureRm.BootStrapper

    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
    Use-AzureRmProfile -Profile 2018-03-01-hybrid -Force

    Install-Module -Name AzureStack -RequiredVersion 1.5.0
    ```

> [!Note]
> To upgrade Azure PowerShell from the **2017-03-09-profile** to **2018-03-01-hybrid**, Please see the [Migration guide](https://github.com/bganapa/azure-powershell/blob/migration-guide/documentation/migration-guides/Stack/migration-guide.2.3.0.md).

  - Azure Stack 1807 or earlier.

    ```PowerShell
    Install-Module -Name AzureRm.BootStrapper
    Use-AzureRmProfile -Profile 2017-03-09-profile -Force
    Install-Module -Name AzureStack -RequiredVersion 1.4.0
    ```

  - Azure Stack 1804 or earlier.

    ```PowerShell
    Install-Module -Name AzureRm.BootStrapper
    Use-AzureRmProfile -Profile 2017-03-09-profile -Force
    Install-Module -Name AzureStack -RequiredVersion 1.2.11
    ```

Confirm the installation by running the following command:

```PowerShell
Get-Module -Name "Azure*" -ListAvailable
Get-Module -Name "Azs*" -ListAvailable
```

If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

## 5. Disconnected: Install PowerShell without an Internet connection

In a disconnected scenario, you must first download the PowerShell modules to a machine that has Internet connectivity, and then transfer them to the Azure Stack Development Kit for installation.

Sign in to a computer with Internet connectivity and use the following scripts to download the Azure Resource Manager and AzureStack packages, depending on your version of Azure Stack:

  - Azure Stack 1808 or later.

    ````PowerShell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

      $Path = "<Path that is used to save the packages>"
      Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 2.3.0
      Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.5.0
    ````

  - Azure Stack 1807 or earlier.

    > [!Note]
    To upgrade from the 1.2.11 version, see the [migration guide](https://aka.ms/azspowershellmigration).

    ````PowerShell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

    $Path = "<Path that is used to save the packages>"
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 1.2.11
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.4.0
    ````

  - Azure Stack 1804 or earlier.

    ````PowerShell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

    $Path = "<Path that is used to save the packages>"
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 1.2.11
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.3.0
    ````

2. Copy the downloaded packages to a USB device.

3. Sign in to the workstation and copy the packages from the USB device to a location on the workstation.

4. Now register this location as the default repository and install the AzureRM and AzureStack modules from this repository:

   ```PowerShell
   #requires -Version 5
   #requires -RunAsAdministrator
   #requires -Module PowerShellGet
   #requires -Module PackageManagement

   $SourceLocation = "<Location on the development kit that contains the PowerShell packages>"
   $RepoName = "MyNuGetSource"

   Register-PSRepository -Name $RepoName -SourceLocation $SourceLocation  -InstallationPolicy Trusted

   Install-Module -Name AzureRM -Repository $RepoName

   Install-Module -Name AzureStack -Repository $RepoName
   ```

## 6. Configure PowerShell to use a proxy server

In scenarios that require a proxy server to access the Internet, you must first configure PowerShell to use an existing proxy server:

1. Open an elevated PowerShell prompt.
2. Run the following commands:

   ```PowerShell
   #To use Windows credentials for proxy authentication
   [System.Net.WebRequest]::DefaultWebProxy.Credentials = [System.Net.CredentialCache]::DefaultCredentials

   #Alternatively, to prompt for separate credentials that can be used for #proxy authentication
   [System.Net.WebRequest]::DefaultWebProxy.Credentials = Get-Credential
   ```

## Next steps

 - [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md)
 - [Configure the Azure Stack user's PowerShell environment](user/azure-stack-powershell-configure-user.md)
 - [Configure the Azure Stack operator's PowerShell environment](azure-stack-powershell-configure-admin.md)
 - [Manage API version profiles in Azure Stack](user/azure-stack-version-profiles.md)
