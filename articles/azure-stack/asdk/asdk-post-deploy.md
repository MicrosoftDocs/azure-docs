---
title: Post deployment configurations for the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: Describes the recommended configuration changes to make after installing the Azure Stack Development Kit (ASDK).
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Post ASDK installation configuration tasks

After [installing the Azure Stack Development Kit (ASDK)](asdk-install.md), you will need to make a some recommended post-installation configuration changes.

## Install Azure Stack PowerShell

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack.

PowerShell commands for Azure Stack are installed through the PowerShell Gallery. To register the PSGallery repository, open an elevated PowerShell session and run the following command:

``` Powershell
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
```

You can use API version profiles  to specify Azure Stack compatible AzureRM modules.  API version profiles provide a way to manage version differences between Azure and Azure Stack. An API version profile is a set of AzureRM PowerShell modules with specific API versions. The **AzureRM.Bootstrapper** module that is available through the PowerShell Gallery provides PowerShell cmdlets that are required to work with API version profiles.

You can install the latest Azure Stack PowerShell module with or without Internet connectivity to the ASDK host computer:

> [!IMPORTANT]
> Before installing the required version, make sure that you [uninstall any existing Azure PowerShell modules](.\.\azure-stack-powershell-install.md#3-uninstall-existing-versions-of-the-azure-stack-powershell-modules).

- **With an internet connection** from the ASDK host computer. Run the following PowerShell script to install these modules on your development kit installation:

  - Azure Stack 1808 or later:

    ``` PowerShell
    # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet. 
    Install-Module -Name AzureRm.BootStrapper

    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
    Use-AzureRmProfile -Profile 2018-03-01-hybrid -Force

    # Install Azure Stack Module Version 1.5.0.
    Install-Module -Name AzureStack -RequiredVersion 1.5.0
    ```

  - Azure Stack 1807 or earlier:

    ``` PowerShell
    # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet. 
    Install-Module -Name AzureRm.BootStrapper

    # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
    Use-AzureRmProfile -Profile 2017-03-09-profile -Force
    
    # Install Azure Stack Module Version 1.4.0.
    Install-Module -Name AzureStack -RequiredVersion 1.4.0
    ```

  - Azure Stack 1803 or earlier:

    ``` PowerShell
    # Install the AzureRM.Bootstrapper module. Select Yes when prompted to install NuGet. 
      Install-Module -Name AzureRm.BootStrapper

      # Install and import the API Version Profile required by Azure Stack into the current PowerShell session.
      Use-AzureRmProfile -Profile 2017-03-09-profile -Force

      # Install Azure Stack Module Version 1.2.11
      Install-Module -Name AzureStack -RequiredVersion 1.2.11 
    ```

  If the installation is successful, the AzureRM and AzureStack modules are displayed in the output.

- **Without an internet connection** from the ASDK host computer. In a disconnected scenario, you must first download the PowerShell modules to a machine that has internet connectivity using the following PowerShell commands:

  ```PowerShell
  $Path = "<Path that is used to save the packages>"

  # AzureRM for 1808 requires 2.3.0, for prior versions use 1.2.11
  Save-Package `
    -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureRM -Path $Path -Force -RequiredVersion 2.3.0
  
  # AzureStack requries 1.5.0 for version 1808, 1.4.0 for versions after 1803, and 1.2.11 for versions before 1803
  Save-Package `
    -ProviderName NuGet -Source https://www.powershellgallery.com/api/v2 -Name AzureStack -Path $Path -Force -RequiredVersion 1.5.0
  ```

  Next, copy the downloaded packages to the ASDK computer and register the location as the default repository and install the AzureRM and AzureStack modules from this repository:

    ```PowerShell  
    $SourceLocation = "<Location on the development kit that contains the PowerShell packages>"
    $RepoName = "MyNuGetSource"

    Register-PSRepository -Name $RepoName -SourceLocation $SourceLocation -InstallationPolicy Trusted

    Install-Module AzureRM -Repository $RepoName

    Install-Module AzureStack -Repository $RepoName
    ```

## Download the Azure Stack tools

[AzureStack-Tools](https://github.com/Azure/AzureStack-Tools) is a GitHub repository that hosts PowerShell modules for managing and deploying resources to Azure Stack. To obtain these tools, clone the GitHub repository or download the AzureStack-Tools folder by running the following script:

  ```PowerShell
  # Change directory to the root directory.
  cd \

  # Enforce usage of TLSv1.2 to download the Azure Stack tools archive from GitHub
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  invoke-webrequest `
    https://github.com/Azure/AzureStack-Tools/archive/master.zip `
    -OutFile master.zip

  # Expand the downloaded files.
  expand-archive master.zip -DestinationPath . -Force

  # Change to the tools directory.
  cd AzureStack-Tools-master
  ```

## Validate the ASDK installation

To ensure that your ASDK deployment was successful, you can use the Test-AzureStack cmdlet by following these steps:

1. Log in as AzureStack\AzureStackAdmin on the ASDK host computer.
2. Open PowerShell as an administrator (not PowerShell ISE).
3. Run: `Enter-PSSession -ComputerName AzS-ERCS01 -ConfigurationName PrivilegedEndpoint`
4. Run: `Test-AzureStack`

The tests take a few minutes to complete. If the installation was successful, the output looks something like:

![test-azurestack](media/asdk-post-deploy/test-azurestack.png)

If there was a failure, follow the troubleshooting steps to get help.

## Reset the password expiration policy 

To make sure that the password for the development kit host doesn't expire before your evaluation period ends, follow these steps after you deploy the ASDK.

### To change the password expiration policy from Powershell

From an elevated Powershell console, run the command:

```powershell
Set-ADDefaultDomainPasswordPolicy -MaxPasswordAge 180.00:00:00 -Identity azurestack.local
```

### To change the password expiration policy manually

1. On the development kit host, open **Group Policy Management** (GPMC.MMC) and navigate to **Group Policy Management** – **Forest: azurestack.local** – **Domains** – **azurestack.local**.
2. Right-click **Default Domain Policy** and click **Edit**.
3. In the Group Policy Management Editor, navigate to **Computer Configuration** – **Policies** – **Windows Settings** – **Security Settings** – **Account Policies** – **Password Policy**.
4. In the right pane, double-click **Maximum password age**.
5. In the **Maximum password age Properties** dialog box, change the **Password will expire in** value to **180**, and then click **OK**.

![Group policy management console](media/asdk-post-deploy/gpmc.png)

## Enable multi-tenancy

For deployments using Azure AD, you need to [enable multi-tenancy](.\.\azure-stack-enable-multitenancy.md#enable-multi-tenancy) for your ASDK installation.

> [!NOTE]  
> When administrator or user accounts from domains other than the one used to register Azure Stack are used to log in to an Azure Stack portal, the domain name used to register Azure Stack must be appended to the portal url. For example, if Azure Stack has been registered with fabrikam.onmicrosoft.com and the user account logging in is admin@contoso.com, the url to use to log into the user portal would be: https://portal.local.azurestack.external/fabrikam.onmicrosoft.com.

## Next steps

[Register the ASDK with Azure](asdk-register.md)
