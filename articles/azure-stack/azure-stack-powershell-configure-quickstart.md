---
title: Install and configure PowerShell for Azure Stack quickstart  | Microsoft Docs
description: Learn about installing and configuring PowerShell for Azure Stack.
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
ms.date: 06/15/2017
ms.author: sngun

---

# Get up and running with PowerShell in Azure Stack

This article is a quick start to install and configure PowerShell for Azure Stack. This script provided in this article is scoped to use with **Azure Active Directory(AAD)** based deployments and within the **administrative** environment only. You can also use this script for user environments, but make sure to replace the Azure Resource Manager endpoint value in the `Add-AzureStackAzureRmEnvironment` cmdlet. 

This article is a condensed version of the steps described in the [Install PowerShell]( azure-stack-powershell-install.md), [Download tools]( azure-stack-powershell-download.md), [Configure PowerShell]( azure-stack-powershell-configure.md) articles. To install and configure PowerShell, sign in to your Azure Stack POC computer, or a Windows-based external client if you are connected through VPN. Next, open an elevated PowerShell ISE session and run the following script:

```powershell

# Set the module repository and the execution policy
Set-PSRepository `
  -Name "PSGallery" `
  -InstallationPolicy Trusted

Set-ExecutionPolicy RemoteSigned `
  -force

# Uninstall any existing Azure PowerShell modules. To uninstall, close all the active PowerShell sessions and run the following command:
Get-Module -ListAvailable | `
  where-Object {$_.Name -like “Azure*”} | `
  Uninstall-Module

# Install PowerShell for Azure Stack
Install-Module `
  -Name AzureRm.BootStrapper `
  -Force

Use-AzureRmProfile `
  -Profile 2017-03-09-profile `
  -Force

Install-Module `
  -Name AzureStack `
  -RequiredVersion 1.2.9 `
  -Force 

Import-Module `
  -Name AzureStack `
  -RequiredVersion 1.2.9 `
  -Force

# Download Azure Stack tools from GitHub and import the connect module
cd \

invoke-webrequest `
  https://github.com/Azure/AzureStack-Tools/archive/master.zip `
  -OutFile master.zip

expand-archive master.zip `
  -DestinationPath . `
  -Force

cd AzureStack-Tools-master

Import-Module `
  .\Connect\AzureStack.Connect.psm1

# Configure the administrator’s PowerShell environment.
Add-AzureStackAzureRmEnvironment `
  -Name "AzureStackAdmin" `
  -ArmEndpoint https://adminmanagement.local.azurestack.external

$Credential= Get-Credential `
  -Message "Enter your Azure Active Directory service administrator's credentials. The username is in the format: user1@contoso.onmicrosoft.com"
 
$TenantName = ($Credential.UserName.split("@"))[1]

$TenantID = Get-DirectoryTenantID `
  -AADTenantName $TenantName `
  -EnvironmentName AzureStackAdmin

# Sign-in to the administrative portal.
Login-AzureRmAccount `
  -EnvironmentName "AzureStackAdmin" `
  -TenantId $TenantID `
  -Credential $Credential
    
# Register resource providers on all subscriptions
Register-AllAzureRmProvidersOnAllSubscriptions
 
```

## Test the connectivity

Now that you’ve configured PowerShell, you can test the configuration by creating a resource group:

```powershell
New-AzureRMResourceGroup -Name "ContosoVMRG" -Location Local
```

When the resource group is created, the cmdlet output has the Provisioning state property set to "Succeeded."

## Next steps

* [Install and configure CLI](azure-stack-connect-cli.md)

* [Develop templates](azure-stack-develop-templates.md)







