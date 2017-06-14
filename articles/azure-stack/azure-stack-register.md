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
ms.date: 03/01/2017
ms.author: erikje

---
# Register Azure Stack with your Azure Subscription

You must register with Azure to download marketplace items from Azure and to set up Azure Stack to report commerce data back to Microsoft. 

> [!NOTE]
>In TP3, registering Azure Stack is not required because you don't have to select a business model or connection option. However, you can test the process and provide feedback about it.
>

## Register

1. Sign in to the Azure Stack POC host computer as an Azure Stack administrator.
2. Install the Azure PowerShell cmdlets on the host computer by running the 'Install-module AzureRM' cmdlet. 
3. Copy the [RegisterWithAzure.ps1 script](https://go.microsoft.com/fwlink/?linkid=842959) to a folder on the host computer (such as C:\Temp).
4. Start PowerShell ISE as an administrator.
5. Run the RegisterWithAzure.ps1 script. Make sure to change the values for *YourAccountName* (the owner of the Azure subscription), *YourGUID*, and *YourDirectory* to match your Azure subscription.

    ```powershell
    RegisterWithAzure.ps1 -azureDirectory YourDirectory -azureSubscriptionId YourGUID -azureSubscriptionOwner YourAccountName
    ```
    
    For example:
    
    ```powershell
    C:\temp\RegisterWithAzure.ps1 -azureDirectory contoso.onmicrosoft.com -azureSubscriptionId 5c15413c-1135-479b-a046-857e1ef9fbeb -azureSubscriptionOwner serviceadmin@contoso.onmicrosoft.com     
    ```
    
6. At the two prompts, press Enter.
7. In the pop-up log in window, enter your Azure subscription credentials

## Verify the registration

1. Sign in to the Azure Stack portal as a service administrator.
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

