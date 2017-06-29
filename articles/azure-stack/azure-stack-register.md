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
>In TP3, registering Azure Stack is not required because you don't have to select a business model or connection option. However, you can test the process and provide feedback about it.
>


## Get Azure subscription

Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get this, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the **Subscription ID**. China, Germany, government cloud, and CSP subscriptions are not supported in TP3.
- The username and password for an account that is an owner for the subscription (Hotmail.com, live.com domains and 2FA accounts are not supported).
- The AAD directory for the Azure subscription. You can find this directory in Azure by hovering over your avatar at the top right corner of the Azure portal. 

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/en-us/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.




## Register

> [!NOTE]
>All these steps must be completed on the host computer, not the console computer.
>

1. Sign in to the Azure Stack Development Kit host administrator portal (https://adminportal.local.azurestack.external).
2. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md). 
3. Copy the [RegisterWithAzure.ps1 script](https://go.microsoft.com/fwlink/?linkid=842959) to a folder (such as C:\Temp).
4. Start PowerShell ISE as an administrator.
5. Run the RegisterWithAzure.ps1 script. Make sure to change the values for *YourAccountName* (the owner of the Azure subscription), *YourID*, and *YourDirectory* to match your Azure subscription.

    ```powershell
    RegisterWithAzure.ps1 -azureDirectory YourDirectory -azureSubscriptionId YourID -azureSubscriptionOwner YourAccountName
    ```
    
    For example:
    
    ```powershell
    C:\temp\RegisterWithAzure.ps1 -azureDirectory contoso.onmicrosoft.com ` 
    -azureSubscriptionId 5c15413c-1135-479b-a046-857e1ef9fbeb ` 
    -azureSubscriptionOwner serviceadmin@contoso.onmicrosoft.com     
    ```
    
6. At the two prompts, press Enter.
7. In the pop-up log in window, enter your Azure subscription credentials

## Verify the registration

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

