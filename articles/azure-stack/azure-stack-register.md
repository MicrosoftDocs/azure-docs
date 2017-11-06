---
title: Register Azure Stack | Microsoft Docs
description: Register Azure Stack with your Azure subscription.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/10/2017
ms.author: erikje

---
# Register Azure Stack with your Azure Subscription

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can register [Azure Stack](azure-stack-poc.md) with Azure to download marketplace items from Azure and to set up commerce data reporting back to Microsoft. 

> [!NOTE]
>Registration is recommended because it enables you to test important Azure Stack functionality, like marketplace syndication and usage reporting. After you register Azure Stack, usage is reported to Azure commerce. You can see it under the subscription you used for registration. Azure Stack Development Kit users aren't charged for any usage they report.
>


## Get Azure subscription

Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get the ID, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the **Subscription ID**. China, Germany, and US government cloud subscriptions are not currently supported.
- The username and password for an account that is an owner for the subscription (MSA/2FA accounts are supported).
- The Azure Active Directory for the Azure subscription. You can find this directory in Azure by hovering over your avatar at the top right corner of the Azure portal. 
- [Registered the Azure Stack resource provider](#register-azure-stack-resource-provider-in-azure).

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/en-us/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.



## Register Azure Stack resource provider in Azure
> [!NOTE] 
> This step only needs to be completed once in an Azure Stack environment.
>

1. Start Powershell ISE as an administrator.
2. Log in to the Azure account that is an owner of the Azure subscription with -EnvironmentName parameter set to "AzureCloud".
3. Register the Azure resource provider "Microsoft.AzureStack".

Example: 
```Powershell
Login-AzureRmAccount -EnvironmentName "AzureCloud"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack
```


## Register Azure Stack with Azure

> [!NOTE]
>All these steps must be completed on the host computer.
>

1. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md). 
2. Copy the [RegisterWithAzure.psm1 script](https://go.microsoft.com/fwlink/?linkid=842959) to a folder (such as C:\Temp).
3. Start PowerShell ISE as an administrator and import the RegisterWithAzure module.    
4. From the RegisterWithAzure.psm1 script, run the Add-AzsRegistration module. Replace the following placeholders: 
    - *YourCloudAdminCredential* is a PowerShell object that contains the local domain credentials for the domain\cloudadmin (for the development kit, this is azurestack\cloudadmin).
    - *YourAzureSubscriptionID* is the ID of the Azure subscription that you want to use to register Azure Stack.
    - *YourAzureDirectoryTenantName* is the name of the Azure tenant directory in which you want to create your registration resource.
    - *YourPrivilegedEndpoint* is the name of the [privileged end point](azure-stack-privileged-endpoint.md).

    ```powershell
    Add-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -AzureDirectoryTenantName $YourAzureDirectoryTenantName  -AzureSubscriptionId $YourAzureSubscriptionId -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel Development 
    ```
5. In the pop-up login window, enter your Azure subscription credentials.

## Verify the registration

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

