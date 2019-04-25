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
ms.date: 04/13/2019
ms.author: mabrigg
ms.reviewer: thoroet
ms.lastreviewed: 04/13/2019
---

# Install PowerShell for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

To work with your cloud, you must install Azure Stack compatible PowerShell modules. Compatibility is enabled through a feature called *API profiles*.

API profiles provide a way to manage version differences between Azure and Azure Stack. An API version profile is a set of Azure Resource Manager PowerShell modules with specific API versions. Each cloud platform has a set of supported API version profiles. For example, Azure Stack supports a specific profile version such as **2018-03-01-hybrid**. When you install a profile, the Azure Resource Manager PowerShell modules that correspond to the specified profile are installed. Profiles are used for Azure Stack version 1811 or earlier. For Azure Stack version 1901 or later, developers can use AzureRM modules **2.4.0** to install the correct Azure Resource Manager PowerShell modules.

You can install Azure Stack compatible PowerShell modules in Internet connected, partially connected, or disconnected scenarios. This article walks you through the detailed instructions for these scenarios.

## 1. Verify your prerequisites

Before you get started with Azure Stack and PowerShell, you must have the following prerequisites:

- **PowerShell Version 5.0**
To check your version, run **$PSVersionTable.PSVersion** and compare the **Major** version. If you do not have PowerShell 5.0, follow the [Installing Windows PowerShell](https://docs.microsoft.com/powershell/scripting/setup/installing-windows-powershell?view=powershell-6#upgrading-existing-windows-powershell).

  > [!Note]
  > PowerShell 5.0 requires a Windows machine.

- **Run Powershell in an elevated command prompt**.

- **PowerShell Gallery access**
  You need access to the [PowerShell Gallery](https://www.powershellgallery.com). The gallery is the central repository for PowerShell content. The **PowerShellGet** module contains cmdlets for discovering, installing, updating, and publishing PowerShell artifacts such as modules, DSC resources, role capabilities, and scripts from the PowerShell Gallery and other private repositories. If you are using PowerShell in a disconnected scenario, you must retrieve resources from a machine with a connection to the Internet and store them in a location accessible to your disconnected machine.

## 2. Validate the PowerShell Gallery accessibility

Validate if PSGallery is registered as a repository.

> [!Note]  
> This step requires Internet access.

Open an elevated PowerShell prompt, and run the following cmdlets:

```powershell
Import-Module -Name PowerShellGet -ErrorAction Stop
Import-Module -Name PackageManagement -ErrorAction Stop
Get-PSRepository -Name "PSGallery"
```

If the repository is not registered, open an elevated PowerShell session and run the following command:

```powershell
Register-PsRepository -Default
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
```

## 3. Uninstall existing versions of the Azure Stack PowerShell modules

Before installing the required version, make sure that you uninstall any previously installed Azure Stack AzureRM PowerShell modules. You can uninstall them by using one of the following two methods:

1. To uninstall the existing AzureRM PowerShell modules, close all the active PowerShell sessions, and run the following cmdlets:

    ```powershell
    Get-Module -Name Azs.* -ListAvailable | Uninstall-Module -Force -Verbose
    Get-Module -Name Azure* -ListAvailable | Uninstall-Module -Force -Verbose
    ```

    If you hit an error such as 'The module is already in use', close the PowerShell sessions that are using the modules and rerun the above script.

2. Delete all the folders that start with `Azure` or `Azs.` from the `C:\Program Files\WindowsPowerShell\Modules` and `C:\Users\{yourusername}\Documents\WindowsPowerShell\Modules` folders. Deleting these folders removes any existing PowerShell modules.

## 4. Connected: Install PowerShell for Azure Stack with Internet connectivity

Use AzureRM version 2.4.0 for Azure Stack version 1901 or later. In addition, to the AzureRM modules, install the Azure Stack-specific PowerShell modules. The API version profile and Azure Stack PowerShell modules you require will depend on the version of Azure Stack your are running.

Installation has three steps:

1. Install Azure Stack PowerShell depending on your version of Azure Stack
2. Enable additional storage features
3. Confirm the installation of PowerShell

### Install Azure Stack PowerShell

Run the following PowerShell script to install these modules on your development workstation:

- Azure Stack version 1901 or later, only install the two modules below:

    ```powershell  
    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.

    Install-Module AzureRM -RequiredVersion 2.4.0
    Install-Module -Name AzureStack -RequiredVersion 1.7.1
    ```

    > [!Note]  
    > - The Azure Stack module version 1.7.1 is a breaking change release. To migrate from Azure Stack 1.6.0 please refer to the [migration guide](https://aka.ms/azspshmigration171).
    > - The AzureRm module version 2.4.0 comes with a breaking change for the cmdlet Remove-AzureRmStorageAccount. This cmdlet expects -Force parameter to be specified for removing the storage account without confirmation.
    > - You don't need to install **AzureRM.Bootstrapper** to install the modules for Azure stack version 1901 or later.
    > - Don't install the 2018-03-01-hybrid profile in addition to using the above AzureRM modules on Azure Stack version 1901 or later.

- Azure Stack version 1811, install the profile using **AzureRM.Bootstrapper**, in addition to the versions indicated in the cmdlets:

    ```powershell  
    # Install the AzureRM.BootStrapper module. Select Yes when prompted to install NuGet
    Install-Module -Name AzureRM.BootStrapper

    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
    Use-AzureRmProfile -Profile 2018-03-01-hybrid -Force

    Install-Module -Name AzureStack -RequiredVersion 1.6.0
    ```

- Azure Stack 1810 or earlier, install the profile using **AzureRM.Bootstrapper**:

    ```powershell  
    # Install the AzureRM.BootStrapper module. Select Yes when prompted to install NuGet
    Install-Module -Name AzureRM.BootStrapper

    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
    Use-AzureRmProfile -Profile 2018-03-01-hybrid -Force

    Install-Module -Name AzureStack -RequiredVersion 1.5.0
    ```

> [!Note]  
> To upgrade Azure PowerShell from the **2017-03-09-profile** to **2018-03-01-hybrid**, please see the [Migration guide](https://github.com/azure/azure-powershell/blob/AzureRM/documentation/migration-guides/Stack/migration-guide.2.3.0.md).

### Enable additional storage features

To make use of the additional storage features (mentioned in the connected section), download and install the following packages as well.

```powershell
# Install the Azure.Storage module version 4.5.0
Install-Module -Name Azure.Storage -RequiredVersion 4.5.0 -Force -AllowClobber

# Install the AzureRm.Storage module version 5.0.4
Install-Module -Name AzureRM.Storage -RequiredVersion 5.0.4 -Force -AllowClobber

# Remove incompatible storage module installed by AzureRM.Storage
Uninstall-Module Azure.Storage -RequiredVersion 4.6.1 -Force

# Load the modules explicitly specifying the versions
Import-Module -Name Azure.Storage -RequiredVersion 4.5.0
Import-Module -Name AzureRM.Storage -RequiredVersion 5.0.4
```

### Confirm the installation of PowerShell

Confirm the installation by running the following command:

```powershell
Get-Module -Name "Azure*" -ListAvailable
Get-Module -Name "Azs*" -ListAvailable
```

If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

## 5. Disconnected: Install PowerShell without an Internet connection

In a disconnected scenario, you must first download the PowerShell modules to a machine that has Internet connectivity, and then transfer them to the Azure Stack Development Kit for installation.

Sign in to a computer with Internet connectivity and use the following scripts to download the Azure Resource Manager and Azure Stack packages, depending on your version of Azure Stack.

Installation has four steps:

1. Install Azure Stack PowerShell to a connected machine
2. Enable additional storage features
3. Transport the PowerShell packages to your disconnected workstation
4. Confirm the installation of PowerShell

### Install Azure Stack PowerShell

- Azure Stack 1901 or later.

    ```powershell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

    $Path = "<Path that is used to save the packages>"
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 2.4.0
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.7.1
    ```

    > [!Note]  
    > The Azure Stack module version 1.7.1 is a breaking change. To migrate from AzureStack 1.6.0 please refer to the [migration guide](https://github.com/Azure/azure-powershell/tree/AzureRM/documentation/migration-guides/Stack).

  - Azure Stack 1811 or earlier.

    ```powershell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

    $Path = "<Path that is used to save the packages>"
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 2.3.0
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.6.0
    ```

  - Azure Stack 1809 or earlier.

    ```powershell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop

    $Path = "<Path that is used to save the packages>"
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 2.3.0
    Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.5.0
    ```

    > [!NOTE]
    > On machines without an Internet connection, we recommend executing the following cmdlet for disabling the telemetry data collection. You may experience a performance degradation of the cmdlets without disabling the telemetry data collection. This is applicable only for the machines without internet connections
    > ```powershell
    > Disable-AzureRmDataCollection
    > ```

### Enable additional storage features

To make use of the additional storage features (mentioned in the connected section), download and install the following packages as well.

```powershell
$Path = "<Path that is used to save the packages>"
Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name Azure.Storage -Path $Path -Force -RequiredVersion 4.5.0
Save-Package -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRm.Storage -Path $Path -Force -RequiredVersion 5.0.4
```

### Add your packages to your workstation

1. Copy the downloaded packages to a USB device.

2. Sign in to the disconnected workstation and copy the packages from the USB device to a location on the workstation.

3. Now register this location as the default repository and install the AzureRM and AzureStack modules from this repository:

   ```powershell
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

### Confirm the installation of PowerShell

Confirm the installation by running the following command:

```powershell
Get-Module -Name "Azure*" -ListAvailable
Get-Module -Name "Azs*" -ListAvailable
```

## 6. Configure PowerShell to use a proxy server

In scenarios that require a proxy server to access the Internet, you must first configure PowerShell to use an existing proxy server:

1. Open an elevated PowerShell prompt.
2. Run the following commands:

   ```powershell
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