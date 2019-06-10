---
title: Connect to Azure Stack with PowerShell as a user | Microsoft Docs
description: Steps to connect to Azure Stack using PowerShell. 
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/09/2019
ms.author: mabrigg
ms.reviewer: thoroet
ms.lastreviewed: 01/24/2019

---

# Connect to Azure Stack with PowerShell as a user

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can connect to Azure Stack with PowerShell. You must connect to manage Azure Stack resources with PowerShell. For example, you can use PowerShell to subscribe to offers, create virtual machines, and deploy Azure Resource Manager templates.

To get set up:
  - Make sure you have the requirements.
  - Connect with Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS). 
  - Register resource providers.
  - Test your connectivity.

## Prerequisites to connect using PowerShell

Configure these prerequisites from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or from a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn):

* Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).
* Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).

Make sure you replace the following script variables with values from your Azure Stack configuration:

- **Azure AD tenant name**  
  The name of your Azure AD tenant used to manage Azure Stack, for example, yourdirectory.onmicrosoft.com.
- **Azure Resource Manager endpoint**  
  For Azure Stack development kit, this value is set to https://management.local.azurestack.external. To get this value for Azure Stack integrated systems, contact your service provider.

## Connect with Azure AD

```powershell  
    Add-AzureRMEnvironment -Name "AzureStackUser" -ArmEndpoint "https://management.local.azurestack.external"
    # Set your tenant name
    $AuthEndpoint = (Get-AzureRmEnvironment -Name "AzureStackUser").ActiveDirectoryAuthority.TrimEnd('/')
    $AADTenantName = "<myDirectoryTenantName>.onmicrosoft.com"
    $TenantId = (invoke-restmethod "$($AuthEndpoint)/$($AADTenantName)/.well-known/openid-configuration").issuer.TrimEnd('/').Split('/')[-1]

    # After signing in to your environment, Azure Stack cmdlets
    # can be easily targeted at your Azure Stack instance.
    Add-AzureRmAccount -EnvironmentName "AzureStackUser" -TenantId $TenantId
```

## Connect with AD FS

  ```powershell  
  # Register an Azure Resource Manager environment that targets your Azure Stack instance
  Add-AzureRMEnvironment -Name "AzureStackUser" -ArmEndpoint "https://management.local.azurestack.external"

  # Sign in to your environment
  Login-AzureRmAccount -EnvironmentName "AzureStackUser"
  ```

## Register resource providers

Resource providers aren’t automatically registered for new user subscriptions that don’t have any resources deployed through the portal. You can explicitly register a resource provider by running the following script:

```powershell  
foreach($s in (Get-AzureRmSubscription)) {
        Select-AzureRmSubscription -SubscriptionId $s.SubscriptionId | Out-Null
        Write-Progress $($s.SubscriptionId + " : " + $s.SubscriptionName)
Get-AzureRmResourceProvider -ListAvailable | Register-AzureRmResourceProvider -Force
    }
```

## Test the connectivity

When you've got everything set up, test connectivity by using PowerShell to create resources in Azure Stack. As a test, create a resource group for an application and add a virtual machine. Run the following command to create a resource group named "MyResourceGroup":

```powershell  
New-AzureRmResourceGroup -Name "MyResourceGroup" -Location "Local"
```

## Next steps

- [Develop templates for Azure Stack](azure-stack-develop-templates.md)
- [Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)
- [Azure Stack PowerShell Module Reference](https://docs.microsoft.com/en-us/powershell/azure/azure-stack/overview)
- If you want to set up PowerShell for the cloud operator environment, refer to the [Configure the Azure Stack operator's PowerShell environment](../azure-stack-powershell-configure-admin.md) article.
