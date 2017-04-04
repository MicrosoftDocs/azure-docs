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
ms.date: 04/04/2017
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

1. Get the GUID value of the Azure Active Directory(AAD) tenant that is used to deploy the Azure Stack. You can get the GUID value in the following two scenarios:  

    a. If you already know the Azure Active Directory(AAD) tenant name, you can get the associated GUID by using the following command:   
    ```PowerShell
    $AadTenant = Get-AADTenantGUID -AADTenantName "<myaadtenant>.onmicrosoft.com"
    ```
    b. If you don’t know the Azure Active Directory (AAD) tenant name, for example in an ADFS environment, you can run the following commands to get the GUID:
    ```PowerShell
    # Add your Azure Stack host to the list of trusted hosts by running the following command in an elevated PowerShell session
    Set-Item wsman:\localhost\Client\TrustedHosts -Value "<Azure Stack host address>" -Concatenate  

    # Get the administrator password used when deploying the Azure Stack
    $Password = ConvertTo-SecureString "<Administrator password provided when deploying Azure Stack>" -AsPlainText -Force  

    #Get the Active Directory Tenant GUID
    $AadTenant = Get-AzureStackAadTenant -HostComputer <Host IP Address> -Password $Password
    ```

2. Register an AzureRM environment that targets your Azure Stack instance. AzureRM commands can be targeted at multiple clouds such as Azure Stack, Azure China, Azure Government etc. To target it to your Azure Stack instance, you should register the AzureRM environment as follows:  
    ```PowerShell
    # Use this command to access the administrative portal
    Add-AzureStackAzureRmEnvironment -Name "AzureStackAdmin" -ArmEndpoint "https://adminmanagement.local.azurestack.external" 

    # Use this command to access the user portal
    Add-AzureStackAzureRmEnvironment -Name "AzureStackUser" -ArmEndpoint "https://management.local.azurestack.external" 
    ```

    ![Get environment details](media/azure-stack-powershell-configure/getenvdetails.png)

## Sign in to Azure Stack 
After the AzureRM environment is registered to target the Azure Stack instance, you can use all the AzureRM commands in your Azure Stack environment. Use the following command to sign in to your Azure Stack administrator or user account:

```PowerShell
# Use this command to sign-in to the administrative portal
Login-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $AadTenant

# Use this command to sign-in to the user portal
Login-AzureRmAccount -EnvironmentName "AzureStackUser" -TenantId $AadTenant
```
![Get subscription details](media/azure-stack-powershell-configure/subscriptiondetails.png)

## Register resource providers 

After you sign in to the administrator or user portal, you can issue operations against resource providers registered in that subscription. By default, all the foundational resource providers are registered in the **Default Provider Subscription(administrator subscription)**. But they are not automatically registered for new user subscriptions to issue operations through PowerShell. You can verify this by using the following command:

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


