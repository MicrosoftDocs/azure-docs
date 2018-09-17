---
title: Connect to Azure Stack with PowerShell as an operator | Microsoft Docs
description: Learn how to connect to Azure Stack with PowerShell as an operator
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
ms.date: 09/17/2018
ms.author: mabrigg
ms.reviewer: thoroet
---

# Connect to Azure Stack with PowerShell as an operator

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can configure the Azure Stack to use PowerShell to manage resources such as creating offers, plans, quotas, and alerts. This topic helps you configure the operator environment.

## Prerequisites

Run the following prerequisites either from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or from a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn). 

 - Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).  
 - Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).  

## Configure the operator environment and sign in to Azure Stack

Configure the Azure Stack operator environment with PowerShell. Run one of the following scripts: Replace the Azure AD tenantName, GraphAudience endpoint, and ArmEndpoint values with your own environment configuration.

````PowerShell  
    # For Azure Stack development kit, this value is set to https://adminmanagement.local.azurestack.external.
    # To get this value for Azure Stack integrated systems, contact your service provider.
    $ArmEndpoint = "<Admin Resource Manager endpoint for your environment>"

    # Register an AzureRM environment that targets your Azure Stack instance
    Add-AzureRMEnvironment -Name "AzureStackAdmin" -ArmEndpoint $ArmEndpoint

    # After signing in to your environment, Azure Stack cmdlets
    # can be easily targeted at your Azure Stack instance.
    Add-AzureRmAccount -EnvironmentName "AzureStackAdmin"
````

## Test the connectivity

Now that you've got everything set-up, use PowerShell to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named **MyResourceGroup**.

```powershell
New-AzureRmResourceGroup -Name "MyResourceGroup" -Location "Local"
```

## Next steps

 - [Develop templates for Azure Stack](user/azure-stack-develop-templates.md)
 - [Deploy templates with PowerShell](user/azure-stack-deploy-template-powershell.md)