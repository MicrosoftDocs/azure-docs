---
title: How to install Azure Storage Mover modules for PowerShell
description: How to install Azure Storage Mover modules for PowerShell #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 06/22/2022
ms.custom: template-how-to
---

<!--

This template provides the basic structure of a HOW-TO article. A HOW-TO article is used to help the customer complete a specific task.

1. H1 (Docs Required)
   Start your H1 with a verb. Pick an H1 that clearly conveys the task the user will complete (example below).

-->

# How to install Azure Storage Mover modules for PowerShell

<!-- 

2. Introductory paragraph (Docs Required)
   Lead with a light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it short (example provided below).

-->

This article guides you through the installation of the Azure Storage Mover modules for PowerShell. This article is the first step in evaluating the public preview. After completing the steps within this article, you'll be able to complete the remaining PowerShell examples.

<!-- 
3. Prerequisites (Optional)
   If you need prerequisites, make them your first H2 in a how-to guide. Use clear and unambiguous language and use a list format. Remove this section if prerequisites are not needed.

-->

## Prerequisites

- **PowerShell 5.1, or 6.0 and greater**<br />
  To check your version, use the following command.
 
   ```powershell
   echo $PSVersionTable.PSVersion.ToString()
   ``` 

- **The latest version of PowerShellGet**<br />
  The install the latests version, close and subsequently re-open the PowerShell console after running the following command.

  ```powershell
  Install-Module PowerShellGet –Repository PSGallery –Force
  ```

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Remove previous installations and modules

Before installing the new versions of the Azure Storage Mover PowerShell modules, remove previous installations of Microsoft Azure PowerShell and any existing `AzureRM` and `Az` modules. This will prevent any possible module clashes. Complete the following steps to verify that the removal has been completed.

1. **Remove Azure PowerShell**<br />
    Open the Windows control panel and select **Programs > Programs and Features**. Remove any existing installations of Microsoft Azure PowerShell.

1. **Identify any `AzureRM` and `Az` modules installed**<br />
    Open PowerShell and run the following commands, taking note of the *Directory* location if modules are located.

    ```powershell
    Get-Module -Name AzureRM.* -ListAvailable
    Get-Module -Name Az.* -ListAvailable
    ```

1. **Delete any modules identified**<br />
   If the PowerShell command identifies modules installed on your machine, navigate to the directory specified within the command list. Select any `AzureRM.*` and `Az.*` folders containing the modules and delete them.

After completing the previously identified steps, you're ready to begin installing the new modules as described in the next section.

## Install Storage Mover modules

With no installed `AzureRM` or `Az` modules to cause clashes with the updated modules, you're ready to begin the install. Follow the steps within this section to complete the installation process.

1. Run the RegisterRepository.ps1 script to setup a local repository pointing at the modules found in the **pkgs** file. Running **RegisterRepository.ps1** with no parameters will create a repository with the same name as its containing folder. You can also choose the name for the repository by providing a value for the `-RepositoryName` parameter.

1. Install the modules by running the following command.

```powershell
-Install-Module -Name Az.StorageMover -Repository [Repository Name] –AllowPrerelease –AllowClobber –Force
```

If you're using PowerShell 5.0 or 5.1, this will install the modules in *C:\Program Files\WindowsPowerShell\Modules*. PowerShell 6.0 and greater will install the modules in *C:\Program Files\PowerShell\Modules*.

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

<!-- 

5. Next steps (Docs required)

A single link in the blue box format. Point to the next logical tutorial or how-to in a series, or, if there are no other tutorials or how-tos, to some other cool thing the customer can do. -->

## Next steps

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](overview.md)
