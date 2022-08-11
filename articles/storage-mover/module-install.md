---
title: How to install Azure Storage Mover modules for PowerShell
description: How to install Azure Storage Mover modules for PowerShell #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/10/2022
ms.custom: template-how-to
---

# How to install Azure Storage Mover modules for PowerShell

This article guides you through the installation of the Azure Storage Mover modules for PowerShell.

Installing the Storage Mover PowerShell modules is the first step in evaluating the public preview. After completing the steps within this article, you'll be able to complete the remaining PowerShell examples.

## Prerequisites

- **PowerShell 5.1, or 6.0 and greater**<br />
  To check your version, use the following command.

  ```powershell
  echo $PSVersionTable.PSVersion.ToString()
  ```

  If needed, you can reference the [Install PowerShell](/powershell/scripting/install/installing-powershell) article to install a newer version of PowerShell.

- **The latest version of PowerShellGet**<br />
  To install or update to the latest version, run one of the following commands with elevated privileges. Afterward, close and subsequently re-open the PowerShell console.

  ```powershell
  #If PowerShellGet is not installed
  Install-Module PowerShellGet –Repository PSGallery –Force

  #If PowerShellGet was previously installed
  Update-Module -Name PowerShellGet -RequiredVersion 2.2.5
  ```

  For additional help installing PowerShellGet, see the article on [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget).

## Remove previous installations and modules

Before installing a newer version of the Azure Storage Mover PowerShell module, you'll need to remove any previous installations. Te removal of Microsoft Azure PowerShell and any existing `AzureRM` and `Az` modules will prevent the possibility of module clashes.

Complete the steps included in the [uninstall Azure PowerShell modules](/powershell/azure/uninstall-az-ps) article to complete the removal. Afterward, follow the guidance in the next section to install the new modules.

## Install Storage Mover modules

1. Copy the Storage Mover PowerShell modules from [\\xstoreself.corp.microsoft.com\scratch\XDataMove\Public Preview\PSCmdlets\StorageMoverRC1](file://xstoreself.corp.microsoft.com/scratch/XDataMove/Public Preview/PSCmdlets/StorageMoverRC1) to your local machine.
1. Navigate to the local copy of the **StorageMoverRC1** folder and run the **RegisterRepository.ps1** script. The script will create a local repository which references the modules within the **pkgs** file. You can provide a custom name of the new repository by supplying a value for the `-RepositoryName` parameter. Running  **RegisterRepository.ps1** with no parameters will create a repository with the same name as its containing folder.

> [!TIP]
> If you're updating PowerShell cmdlet binaries to the same local folder, you may receive an error. Use the following cmdlets to list and unregister conflicting repository names.
    ```powershell
        Unregister-PSRepository -Name <name of the repository that its complaining about - using defaults to directory name> 
   ```

1. After the **RegisterRepository.ps1** script has successfully run, install the modules by running the following command.

  ```powershell
  Install-Module -Name Az.StorageMover -Repository [Repository Name] –AllowPrerelease –AllowClobber –Force
  ```

  If you're using PowerShell 5.1, this will install the modules in *C:\Program Files\WindowsPowerShell\Modules*. PowerShell 6.0 and greater will install the modules in *C:\Program Files\PowerShell\Modules*.

> [!IMPORTANT]
> If the PowerShell binary is unsigned or the **Restricted** execution policy is in effect on your machine, you may encounter an error. To run unsigned scripts, start PowerShell with the *Run as Administrator* option and then use the following command to change the execution policy on the computer to **Unrestricted**.
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy Unrestricted
> ```
> If the Powershell binary is unsigned and you face issues with importing the module on strong name validation, import the following registry keys to skip strong name validation:
> *[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\StrongName\Verification\*,*]*
> *[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\StrongName\Verification\*,*]*
> For more information, see the article for the [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy) cmdlet.

1. Enter necessary parameters in **sample.ps1** file, then run the script.

By completing the steps contained in this section, you've successfully installed the Azure Storage Mover modules for PowerShell. You are now ready to begin utilizing the cmdlets to perform your migration.

## Next steps

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](overview.md)
