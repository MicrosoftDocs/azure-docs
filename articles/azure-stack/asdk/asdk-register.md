---
title: Register the ASDK with Azure | Microsoft Docs
description: Describes how to register Azure Stack with Azure to enable marketplace syndication and usage reporting.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Register Azure Stack with Azure
You can register your Azure Stack Development Kit (ASDK) installation with Azure to download marketplace items from Azure and to set up commerce data reporting back to Microsoft. Registration is recommended because it enables you to test important Azure Stack functionality like marketplace syndication and usage reporting. After you register Azure Stack, usage is reported to Azure commerce. You can see it under the subscription you used for registration. However, ASDK users aren't charged for any usage they report.


## Register Azure Stack with Azure 
Follow these steps to register the ASDK with Azure.

> [!NOTE]
> All these steps must be run from a computer that has access to the privileged endpoint. For the ASDK, that's the development kit host computer. 

Before using these steps to register the ASDK with Azure, ensure that you have installed the Azure Stack PowerShell and downloaded the Azure Stack tools as described in the [post-deployment configuration](asdk-post-deploy.md) article. 

1. Open a PowerShell console as an administrator.  

2. Run the following PowerShell commands to register your ASDK installation with Azure (you will need to log in to both your Azure subscription and the local ASDK installation):

    ```PowerShell
    # Add the Azure cloud subscription environment name. Supported environment names are AzureCloud or, if using a China Azure Subscription, AzureChinaCloud.
    Connect-AzureRmAccount -EnvironmentName "AzureCloud"

    # Register the Azure Stack resource provider in your Azure subscription
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack

    #Import the registration module that was downloaded with the GitHub tools
    Import-Module C:\AzureStack-Tools-master\Registration\RegisterWithAzure.psm1

    #Register Azure Stack
    $AzureContext = Get-AzureRmContext
    $CloudAdminCred = Get-Credential -UserName AZURESTACK\CloudAdmin -Message "Enter the credentials to access the privileged endpoint."
    Set-AzsRegistration `
        -PrivilegedEndpointCredential $CloudAdminCred `
        -PrivilegedEndpoint AzS-ERCS01 `
        -BillingModel Development

3. When the script completes, you should see this message: **Your environment is now registered and activated using the provided parameters.**

    ![](media/asdk-register/1.PNG) 

## Verify the registration was successful
Follow these steps to verify that the ASDK registration with Azure was successful.

1. Sign in to the [Azure Stack administration portal](https://adminportal.local.azurestack.external).

2. Click **Marketplace Management** > **Add from Azure**.

    ![](media/asdk-register/2.PNG) 

3. If you see a list of items available from Azure, your activation was successful.

    ![](media/asdk-register/3.PNG) 

## Next steps
[Add an Azure Stack marketplace item](asdk-marketplace-item.md)
