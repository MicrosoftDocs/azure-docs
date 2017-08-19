---
title: Configure PowerShell for use with Azure Stack | Microsoft Docs
description: Learn how to configure PowerShell for Azure Stack.
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
ms.date: 08/07/2017
ms.author: sngun

---

# Configure PowerShell in Azure Stack for the cloud operator environment

This article describes the steps required to connect to an Azure Stack Development Kit instance by using PowerShell. After you connect, you can access the portal and deploy resources through PowerShell. This topic is scoped to use with the cloud operator environments only, if you want to set up PowerShell for the user environment, refer to [Configure PowerShell for the user environment](azure-stack-powershell-configure-user.md) topic. You can use the steps described in this article either from the development kit, or from a Windows-based external client if you are connected through VPN. 

This article has detailed instructions to configure PowerShell for Azure Stack. However, if you want to quickly install and configure PowerShell, you can use the script provided in the [Get up and running with PowerShell](azure-stack-powershell-configure-quickstart.md) topic. 

## Prerequisites

* Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).  
* Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).  

## Import the Connect PowerShell module

After you download the required tools, navigate to the downloaded folder and import the **Connect** PowerShell module by running the following command in an elevated PowerShell session:

```powershell
Set-ExecutionPolicy RemoteSigned
Import-Module .\Connect\AzureStack.Connect.psm1
```

## Configure the PowerShell environment and sign in to Azure Stack

Based on the type of deployment (Azure AD or AD FS), run one of the following script to configure PowerShell for Azure Stack:

* **Azure Active Directory (Azure AD)**
       
  ```powershell
  # Register an AzureRM environment that targets your Azure Stack instance
  Add-AzureRMEnvironment `
    -Name "AzureStackAdmin" `
    -ArmEndpoint "https://adminmanagement.local.azurestack.external"

  # Set the GraphEndpointResourceId value
  Set-AzureRmEnvironment `
    -Name "AzureStackAdmin" `
    -GraphAudience "https://graph.windows.net/"

  # Get the Active Directory tenantId that is used to deploy Azure Stack
  $TenantID = Get-AzsDirectoryTenantId `
    -AADTenantName "<myDirectoryTenantName>.onmicrosoft.com" `
    -EnvironmentName "AzureStackAdmin"

  # Sign in to your environment
  Login-AzureRmAccount `
    -EnvironmentName "AzureStackAdmin" `
    -TenantId $TenantID 
  ```

* **Active Directory Federation Services**
         
  ```powershell
  # Register an AzureRM environment that targets your Azure Stack instance
  Add-AzureRMEnvironment `
    -Name "AzureStackAdmin" `
    -ArmEndpoint "https://adminmanagement.local.azurestack.external"

  # Set the GraphEndpointResourceId value
  Set-AzureRmEnvironment `
    -Name "AzureStackAdmin" `
    -GraphAudience "https://graph.local.azurestack.external/" `
    -EnableAdfsAuthentication:$true

  # Get the Active Directory tenantId that is used to deploy Azure Stack     
  $TenantID = Get-AzsDirectoryTenantId `
    -ADFS `
    -EnvironmentName "AzureStackAdmin"

  # Sign in to your environment
  Login-AzureRmAccount `
    -EnvironmentName "AzureStackAdmin" `
    -TenantId $TenantID 
  ```

## Next steps
* [Develop templates for Azure Stack](azure-stack-develop-templates.md)
* [Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)