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
ms.date: 07/10/2017
ms.author: erikje

---
# Register Azure Stack with your Azure Subscription

For Azure Active Directory deployments, you can register Azure Stack with Azure to download marketplace items from Azure and to set up commerce data reporting back to Microsoft. 
> [!NOTE]
>Registration is recommended because it enables you to test important Azure Stack functionality, like marketplace syndication and usage reporting. After you register Azure Stack, usage is reported to Azure commerce. You can see it under the subscription you used for registration. Azure Stack Development Kit users will not be charged for any usage they report.
>


## Get Azure subscription

Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get the ID, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the **Subscription ID**. China, Germany, and US government cloud subscriptions are not currently supported.
- The username and password for an account that is an owner for the subscription (MSA/2FA accounts are supported)
- The Azure Active Directory for the Azure subscription. You can find this directory in Azure by hovering over your avatar at the top right corner of the Azure portal. 

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/en-us/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.

## Register Azure Stack with Azure

> [!NOTE]
>All these steps must be completed on the host computer.
>

1. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md). 
2. Copy the [RegisterWithAzure.psm module](https://github.com/Azure/AzureStack-Tools/blob/vnext/Registration/RegisterWithAzure.psm1) to a folder (such as C:\Temp).
3. Start PowerShell ISE as an administrator.
4. Import the RegisterWithAzureModule
    Example:
    ```Powershell
    Import-Module 'C:\Temp\RegisterWithAzure.psm1' -Force -Verbose
    ```
5. Call the Add-AzsRegistration function providing the appropriate parameters when prompted
    - *YourDirectoryTenantName* is the name of the directory that your subscription is part of
    - *YourSubscriptionId* is the subscription that will be billed for Azure Stack usage
    - *PrivilegedEndpoint* is the privileged endpoint used for executing registration actions. Commonly named '\<ComputerName\>-ERCS01'
    
    ```Powershell
    Add-AzsRegistration -AzureDirectoryTenantName 'YourDirectoryTenantName' -AzureSubscriptionId 'YourSubsriptionId' -PrivilegedEndpoint 'Name of PrivilegedEndpoint'
    ```
    > [!NOTE]
    >You will be asked to enter CloudAdmin credentials. This is the user with access to the privileged endpoint
    >
6. When prompted, ender the Azure account credentials with access to the subscription and directory passed in.

## Verify the registration

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

