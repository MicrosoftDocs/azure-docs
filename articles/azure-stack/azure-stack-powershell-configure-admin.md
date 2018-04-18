---
title: Configure the Azure Stack operator's PowerShell environment | Microsoft Docs
description: Learn how to Configure the Azure Stack operator's PowerShell environment.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 37D9CAC9-538B-4504-B51B-7336158D8A6B
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/05/2018
ms.author: mabrigg

---

# Configure the Azure Stack operator's PowerShell environment

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can configure the Azure Stack to use PowerShell to manage resources such as creating offers, plans, quotas, and alerts. This topic helps you configure the operator environment. If you want to configure PowerShell for the user environment, see to [Configure the Azure Stack user's PowerShell environment](user/azure-stack-powershell-configure-user.md) article.

## Prerequisites

Run the following prerequisites either from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or from a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn): 

* Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).  
* Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).  

## Configure the operator environment and sign in to Azure Stack

Configure the Azure Stack operator environment with PowerShell. Based on the type of deployment, Azure AD or AD FS, run one of the following scripts: Replace the Azure AD tenantName, GraphAudience endpoint, and ArmEndpoint values with your own environment configuration.

### Azure Active Directory (Azure AD) based deployments

````powershell  
#  Create an administrator environment
Add-AzureRMEnvironment -Name AzureStackAdmin -ArmEndpoint "https://adminmanagement.local.azurestack.external"

# Get the value of your Directory Tenant ID
$TenantID = Get-AzsDirectoryTenantId -AADTenantName "<mydirectorytenant>.onmicrosoft.com" -EnvironmentName AzureStackAdmin

# After registering the AzureRM environment, cmdlets can be 
# easily targeted at your Azure Stack instance.
Connect-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $TenantID
````


### Active Directory Federation Services (AD FS) based deployments

````powershell  
#  Create an administrator environment
Add-AzureRMEnvironment -Name AzureStackAdmin -ArmEndpoint "https://adminmanagement.local.azurestack.external"

# Get the value of your Directory Tenant ID
$TenantID = Get-AzsDirectoryTenantId -ADFS -EnvironmentName AzureStackAdmin

# After registering the AzureRM environment, cmdlets can be 
# easily targeted at your Azure Stack instance.
Connect-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $TenantID
````

## Test the connectivity

Now that you've got everything set-up, let's use PowerShell to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named "MyResourceGroup":

```powershell
New-AzureRmResourceGroup -Name "MyResourceGroup" -Location "Local"
```

## Next steps
* [Develop templates for Azure Stack](user/azure-stack-develop-templates.md)
* [Deploy templates with PowerShell](user/azure-stack-deploy-template-powershell.md)
