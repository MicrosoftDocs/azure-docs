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
ms.date: 06/02/2017
ms.author: sngun

---

# Configure PowerShell for use with Azure Stack 

This article describes the steps required to connect to an Azure Stack POC instance by using PowerShell. After connecting, you can access the portal and deploy resources through PowerShell. You can use the steps described in this article either from the Azure Stack POC computer, or from a Windows-based external client if you are connected through VPN.

## Prerequisites
* [Install Azure Stack compatible Azure PowerShell modules.](azure-stack-powershell-install.md)  
* [Download the tools required to work with Azure Stack.](azure-stack-powershell-download.md)  

## Import the Connect PowerShell module

After downloading the required tools, navigate to the downloaded folder and import the **Connect** PowerShell module. To import the Connect module, run the following command in an elevated PowerShell session:

```PowerShell
Set-ExecutionPolicy Unrestricted
Import-Module .\Connect\AzureStack.Connect.psm1
```

## Configure the PowerShell Environment

Use the following steps to configure your Azure Stack environment:

1. Register an AzureRM environment that targets your Azure Stack instance by using one of the following cmdlets:  
   a. **Administrative environment**

   ```PowerShell
   Add-AzureStackAzureRmEnvironment `
     -Name "AzureStackAdmin" `
     -ArmEndpoint "https://adminmanagement.local.azurestack.external"
   ```

   b. **User environment**

   ```PowerShell
   Add-AzureStackAzureRmEnvironment `
     -Name "AzureStackUser" `
     -ArmEndpoint "https://management.local.azurestack.external" 
   ```
   After the AzureRM environment is registered, you can use all the AzureRM cmdlets in your Azure Stack environment. Following screen shot shows the output of the previous cmdlet:

   ![Get environment details](media/azure-stack-powershell-configure/getenvdetails.png)

2. Get the GUID value of the Active Directory(AD) tenant that is used to deploy Azure Stack. If your Azure Stack environment is deployed by using:  

   a. **Azure Active Directory**:
   
      * To access the **Administrative environment**
        ```PowerShell
        $TenantID = Get-DirectoryTenantID `
          -AADTenantName "<myDirectoryTenantName>.onmicrosoft.com" `
          -EnvironmentName AzureStackAdmin
        ```

      * To access the **User environemnt**
        ```PowerShell
        $TenantID = Get-DirectoryTenantID `
          -AADTenantName "<myDirectoryTenantName>.onmicrosoft.com" `
          -EnvironmentName AzureStackUser
        ```

   b. **Active Directory Federation Services**:
   
      * To access the **Administrative environment**
        ```PowerShell
        $TenantID = Get-DirectoryTenantID `
          -ADFS `
          -EnvironmentName AzureStackAdmin
        ```

      * To access the **User environemnt**
        ```PowerShell 
        $TenantID = Get-DirectoryTenantID `
          -ADFS `
          -EnvironmentName AzureStackUser 
        ```

## Sign in to Azure Stack

Use the following steps to sign in your Azure Stack environment:

1. Store the Azure Active Directory service administrator or user account's credentials in a variable:

   ```PowerShell
   $UserName='<Azure Active Directory service administrator or user account name>'
   $Password='<Azure Active Directory service administrator or user password>'| `
     ConvertTo-SecureString -Force -AsPlainText
   $Credential= New-Object PSCredential($UserName,$Password)
   ```

2. Sign in to the Azure Stack environment by using one of the following two cmdlets:

   a. To sign in to the **administrative portal**

   ```powershell
   Login-AzureRmAccount `
     -EnvironmentName "AzureStackAdmin" `
     -TenantId $TenantID `
     -Credential $Credential
   ```

   b. To sign in to the **user portal**

   ```powershell
   Login-AzureRmAccount `
     -EnvironmentName "AzureStackUser" `
     -TenantId $TenantID `
     -Credential $Credential
   ```

## Register resource providers 

After you sign in to the administrator or user portal, you can issue operations against the registered resource providers. By default, all the foundational resource providers are registered in the **Default Provider Subscription(administrator subscription)**. When you are operating on a newly created user subscription, which doesn’t have any resources deployed through the portal, the resource providers aren't automatically registered. For example, when you look at the output of the following cmdlet, you can see that the registration state is "Unregistered."

```PowerShell
  Get-AzureRmResourceProvider `
    -ListAvailable 
```

![unregistered PowerShell](media/azure-stack-powershell-configure/unregisteredrps.png)  

You should explicitly register these resource providers in the user subscriptions before you can use them. To register providers on the current subscription, use the following command:

```PowerShell
Register-AllAzureRmProviders
```

![registering PowerShell](media/azure-stack-powershell-configure/registeringrps.png)  

To register all the resource providers on all your subscriptions, use the following command:

```PowerShell
Register-AllAzureRmProvidersOnAllSubscriptions
```

## Next Steps
* [Develop templates for Azure Stack](azure-stack-develop-templates.md)
* [Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)
