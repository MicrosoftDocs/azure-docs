---
title: How to install Azure Storage Mover modules for PowerShell
description: How to install Azure Storage Mover modules for PowerShell #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: not evaluated for completeness

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# How to install Azure Storage Mover modules for PowerShell

Installing the Storage Mover PowerShell modules is the first step in evaluating the public preview. This article guides you through the installation of the Azure Storage Mover modules for PowerShell.

After completing the steps within this article, you'll be able to complete the remaining PowerShell examples.

## Prerequisites

- **PowerShell 5.1, or 6.0 and greater**<br />
  To check your version, use the following sample code. You can reference the [Install PowerShell](/powershell/scripting/install/installing-powershell) article to install a newer version of PowerShell if needed.

  ```powershell
  echo $PSVersionTable.PSVersion.ToString()
  ```

- **The latest version of PowerShellGet**<br />
  To install or update to the latest version, run one of the following commands with elevated privileges. Afterward, close and subsequently re-open the PowerShell console.

  ```powershell
  #New installation of PowerShellGet
  Install-Module PowerShellGet –Repository PSGallery –Force

  #Update an existing installation of PowerShellGet
  Update-Module -Name PowerShellGet -RequiredVersion 2.2.5
  ```

  For additional help installing PowerShellGet, see the article on [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget).

  <!-- ####NOTE####   I don't want to keep updating the version number above - how  can this be done better? -->

## Remove previous installations and modules

Before installing a newer version of the Azure Storage Mover PowerShell module, you'll need to remove any previous installations. The removal of Microsoft Azure PowerShell and any existing `AzureRM` and `Az` modules will prevent the possibility of module clashes when running the Storage Mover cmdlets.

You can reference the [uninstall Azure PowerShell modules](/powershell/azure/uninstall-az-ps) article for help with the removal.

After ensuring that no `AzureRM` and `Az` modules exist locally, follow the guidance in the next section to install the new modules.

## Install Storage Mover modules

1. First, copy the folder containing the Storage Mover PowerShell modules and scripts to the file system of your local machine. You can access the `StorageMoverRC1` folder at [https://paste.microsoft.com/0162a457-7e30-44ab-85e5-75514c078c73](https://paste.microsoft.com/0162a457-7e30-44ab-85e5-75514c078c73).

1. Next, open PowerShell with elevated privileges and navigate to your local copy of the `StorageMoverRC1` folder. Create a local repository referencing the modules within the `pkgs` folder by running the `RegisterRepository.ps1` script.

  Running `RegisterRepository.ps1` with no parameters will create a repository with the same name as its containing folder. You can also specify a custom name for the new repository by supplying values for two parameters. The `-RepositoryName` parameter stores the desired name of the repository, and the `-PkgsPath` parameter expects the path to the `pkgs` folder within `StorageMoverRC1`. Both parameters are required when creating a repository with a specific name.

  The sample code below shows the creation of a custom repository name using the optional parameters.
  
  ```PowerShell
  cd C:\Temp\StorageMoverRC1\
  .\RegisterRepository.ps1 `
  -RepositoryName StorageMover `
  -PkgsPath C:\Temp\StorageMoverRC1\pkgs                                                                                               
  ```

  The response indicates that the repository was created. You should see results similar to those shown.

  ```Response
  Registered repository 'StorageMover' at location 'C:\Temp\StorageMoverRC1\pkgs'
  To install modules from this repository, please run the following:
  
  Install-Module -Name Az.StorageMover -Repository StorageMover -AllowPrerelease -AllowClobber -Force -SkipPublisherCheck
  ```

  > [!TIP]
  > If you're updating PowerShell cmdlet binaries stored in the same local folder, you may receive an error asking you to use a different name. You can use the following sample code to list and unregister conflicting repository names.

  >    ```powershell
  >    Get-PSRepository
  >    Unregister-PSRepository -Name [conflicting repository name]
  >   ```

1. After the `RegisterRepository.ps1` script has successfully run, install the modules using the `Install-Module` command as shown in the following example.

  ```powershell
  Install-Module -Name Az.StorageMover -Repository [Repository Name] –AllowPrerelease –AllowClobber –Force
  ```

  If you're using PowerShell 5.1, the modules will be installed in `C:\Program Files\WindowsPowerShell\Modules`. PowerShell 6.0 and greater will install the modules in `C:\Program Files\PowerShell\Modules`.

  > [!IMPORTANT]
  > If the PowerShell binary is unsigned or the **Restricted** execution policy is in effect on your machine, you may encounter an error. To run unsigned scripts, start PowerShell with the *Run as Administrator* option and then use the following command to change the execution policy on the computer to **Unrestricted**.
  > ```powershell
  > Set-ExecutionPolicy -ExecutionPolicy Unrestricted
  > ```
  >
  > You may also face issues with importing the module due to strong name validation. Import the following registry keys to skip strong name validation if needed.
  > *[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\StrongName\Verification\*,*]*
  > *[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\StrongName\Verification\*,*]*
  > For more information, see the article for the [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy) cmdlet.

1. Run the following sample code in PowerShell to verify that you have successfully installed the cmdlets.

    ```powershell
    Get-Command -Module Az.StorageMover
    ```

    You should receive a response similar to the following example.

    ```Response
    CommandType     Name                    Version    Source
    -----------     ----                    -------    ------
    Function        Get-AzStorageMover              0.1.0      Az.StorageMover
    Function        Get-AzStorageMoverAgent         0.1.0      Az.StorageMover
    Function        Get-AzStorageMoverEndpoint      0.1.0      Az.StorageMover
    Function        Get-AzStorageMoverJobDefinition 0.1.0      Az.StorageMover
    Function        Get-AzStorageMoverJobRun        0.1.0      Az.StorageMover
    Function        Get-AzStorageMoverProject       0.1.0      Az.StorageMover
    [...]
    ```

By completing the steps contained in this section, you've successfully installed the Azure Storage Mover modules for PowerShell. You are now ready to begin utilizing the cmdlets to perform your migration.

## Next steps

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](service-overview.md)
