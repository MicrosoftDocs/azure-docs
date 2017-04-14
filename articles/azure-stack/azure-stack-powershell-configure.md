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
ms.date: 04/14/2017
ms.author: sngun

---

# Configure PowerShell for use with Azure Stack 

You can use PowerShell to connect to an Azure Stack environment. After connecting, you can manage and deploy Azure Stack resources. You can use the steps described in this article either from MAS-CON01, the Azure Stack host computer, or a Windows-based external client if you are connected through VPN. The steps in this article are applicable for Azure Stack instances deployed through Azure Active Directory(AAD) or Active Directory Federation Services(ADFS). 

## Prerequisites
* [Install Azure Stack compatible Azure PowerShell on MAS-CON01 or on your local computer.](azure-stack-powershell-install.md)  
* [Download tools required to work with Azure Stack to MAS-CON01 or to your local computer.](azure-stack-powershell-download.md)  

## Import the Connect PowerShell module

After downloading the tools, navigate to the downloaded folder and import the **Connect** PowerShell module by using the following command:  
```PowerShell
Import-Module .\Connect\AzureStack.Connect.psm1
```

> [!NOTE]
> When importing the module specified earlier, if you receive an error that “AzureStack.Connect.psm1 is not digitally signed and you cannot run this script on the current system”, you can resolve it by executing the following command in an elevated PowerShell window:  

```PowerShell
Set-ExecutionPolicy Unrestricted
```

## Configure the PowerShell Environment
Use the following steps to configure your Azure Stack environment:

1. Register an AzureRM environment that targets your Azure Stack instance by using the following cmdlets:  
    ```PowerShell
    # Use this command to access the administrative portal.
    Add-AzureStackAzureRmEnvironment -Name "AzureStackAdmin" -ArmEndpoint "https://adminmanagement.local.azurestack.external" 

    # Use this command to access the user portal.
    Add-AzureStackAzureRmEnvironment -Name "AzureStackUser" -ArmEndpoint "https://management.local.azurestack.external" 
    ```

    ![Get environment details](media/azure-stack-powershell-configure/getenvdetails.png)

2. Get the GUID value of the Azure Active Directory(AAD) tenant that is used to deploy the Azure Stack. If your Azure Stack environment is deployed by using:  

    a. **Azure Active Directory**, use the following cmdlet:
    
    ```PowerShell
    # Use this command to get the GUID value in the administrator's environment. 
    $AadTenantID = Get-DirectoryTenantID -AADTenantName "<myaadtenant>.onmicrosoft.com" -EnvironmentName AzureStackAdmin
    
    # Use this command to get the GUID value in the user's environment. 
    $AadTenantID = Get-DirectoryTenantID -AADTenantName "<myaadtenant>.onmicrosoft.com" -EnvironmentName AzureStackUser
    ```
    b. **Active Directory Federation Services**, use the following cmdlet:
    
    ```PowerShell
    # This command gets the GUID value in the administrator's environment.
    $AadTenantID = Get-DirectoryTenantID -ADFS -EnvironmentName AzureStackAdmin 
    
    # This command gets the GUID value in the user's environment. 
    $AadTenantID = Get-DirectoryTenantID -ADFS -EnvironmentName AzureStackUser 
    ```

## Sign in to Azure Stack 
After the AzureRM environment is registered to target the Azure Stack instance, you can use all the AzureRM commands in your Azure Stack environment. Use the following command to sign in to your Azure Stack administrator or user account:

```PowerShell
# Store the AAD service administrator or user account credentials in a variable. 
$UserName='<Username of the service administrator or user account>'
$Password='<administrator or user password>'| ConvertTo-SecureString -Force -AsPlainText
$Credential=New-Object PSCredential($UserName,$Password)

# Use this command to sign-in to the administrative portal.
Login-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $AadTenantID -Credential $Credential

# Use this command to sign-in to the user portal.
Login-AzureRmAccount -EnvironmentName "AzureStackUser" -TenantId $AadTenantID -Credential $Credential
```
![Get subscription details](media/azure-stack-powershell-configure/subscriptiondetails.png)

## Register resource providers 

After you sign in to the administrator or user portal, you can issue operations against resource providers registered in that subscription. By default, all the foundational resource providers are registered in the **Default Provider Subscription(administrator subscription)**. When operating on newly created user subscription, and if these subscription doesn’t have any resources deployed through the portal, you should register the resource providers for this subscription by using the following command:

```PowerShell
  Get-AzureRmResourceProvider -ListAvailable 
```

![unregistered PowerShell](media/azure-stack-powershell-configure/unregisteredrps.png)  

In the user subscriptions, you should manually register these resource providers before you use them. To register providers on the current subscription, use the following command:

```PowerShell
Register-AllAzureRmProviders
```

![registering PowerShell](media/azure-stack-powershell-configure/registeringrps.png)  


To register all resource providers on all your subscriptions, use the following command:

```PowerShell
Register-AllAzureRmProvidersOnAllSubscriptions
```

## Next Steps
* [Develop templates for Azure Stack](azure-stack-develop-templates.md)
* [Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)


