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
ms.date: 11/15/2017
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
> All these steps must be run from a machine that has access to the PrivilegedEndpoint (it would be the host computer for > Azure Stack Development Kit).
>

1. Open a PowerShell console as an administrator [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).  
2. Add the Azure account that you will be using to register your Azure Stack instance. To do this, run the `Add-AzureRmAccount` cmdlet without any parameters. You will be prompted to enter your Azure account credentials and you may have to use 2-factor authentication depending on your account’s configuration.  
3. Now delete any existing versions of the powershell modules that correspond to registration and [download the latest version of it from GitHub](azure-stack-powershell-download.md).  
4. From the "AzureStack-Tools-master" directory that is created in the above step, navigate to the **Registration** folder and find the .\RegisterWithAzure.psm1 module.  
5. Verify that you are connected to the correct Azure subscription by using the Get-AzureRmContext command. 
   * If you have multiple subscriptions, run the following command to select the one you want to use:
    ```powershell
      Get-AzureRmSubscription -SubscriptionName '<Your Azure Subscription Name>' | Select-AzureRmSubscription
    ```

6. In the same PowerShell ISE session, copy the following script. Before you run the script, assign values to the $ADTenant and $SubId variables. When prompted for credentials, specify `azurestack\cloudadmin` as the user and the password is the same as what you used for the local administrator during deployment. 
7. 


   ```powershell

   	$ADTenantName = "Azure tenant directory associated with your Azure subscription, for example contoso.onmicrosoft.com"
	$SubId = "ID of the Azure subscription that you want to use to register Azure Stack"
	$creds = Get-Credential

    Add-AzsRegistration -CloudAdminCredential $creds -AzureDirectoryTenantName $ADTenantName  -AzureSubscriptionId $SubId -PrivilegedEndpoint azs-ercs01 -BillingModel Development 
   ```

   | Parameter | Description |
   | -------- | ------------- |
   | *YourCloudAdminCredential* | is a PowerShell object that contains the local domain credentials for the domain\cloudadmin (for the development kit, this is azurestack\cloudadmin).
   | *YourAzureSubscriptionID* | is the ID of the Azure subscription that you want to use to register Azure Stack.
   | *YourAzureDirectoryTenantName* | is the name of the Azure tenant directory associated with your Azure subscription. The registration resource will be created in this directory tenant. 
   | *YourPrivilegedEndpoint* | is the name of the [privileged end point](azure-stack-privileged-endpoint.md).

5. When prompted for Azure credentials, enter your Azure subscription credentials.

6. When the script completes, you see a message “Activating Azure Stack (this may take up to 10 minutes to complete).” 

## Verify the registration

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

