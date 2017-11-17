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

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/en-us/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.



## Register Azure Stack resource provider in Azure
> [!NOTE] 
> This step only needs to be completed once in an Azure Stack environment.
>

1. Start a Powershell session as an administrator.
2. Login to the Azure account that is an owner of the Azure subscription (You can use the Login-AzureRmAccount cmdlet to login and when you sign in, make sure to set the -EnvironmentName parameter to "AzureCloud").
3. Register the Azure resource provider "Microsoft.AzureStack".

**Example:** 
```Powershell
Login-AzureRmAccount -EnvironmentName "AzureCloud"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack
```

## Register Azure Stack with Azure

> [!NOTE]
> All these steps must be run from a machine that has access to the privileged endpoint. In case of Azure Stack Development Kit, it would be the host computer. If you’re using an integrated system, contact your Azure Stack operator.
>

1. Open a PowerShell console as an administrator and [install PowerShell for Azure Stack](azure-stack-powershell-install.md).  

2. Add the Azure account that you will be using to register Azure Stack. To do this, run the `Add-AzureRmAccount` cmdlet without any parameters. You will be prompted to enter your Azure account credentials and you may have to use 2-factor authentication depending on your account’s configuration.  

3. If you have multiple subscriptions, run the following command to select the one you want to use:  

   ```powershell
      Get-AzureRmSubscription -SubscriptionName '<Your Azure Subscription Name>' | Select-AzureRmSubscription
   ```

4. Delete any existing versions of the Powershell modules that correspond to registration and [download the latest version of it from GitHub](azure-stack-powershell-download.md).  

5. From the "AzureStack-Tools-master" directory that is created in the above step, navigate to the "Registration" folder and import the ".\RegisterWithAzure.psm1" module:  

   ```powershell 
   Import-Module .\RegisterWithAzure.psm1 
   ```

6. In the same PowerShell session, run the following script. When prompted for credentials, specify `azurestack\cloudadmin` as the user and the password is the same as what you used for the local administrator during deployment.  

   ```powershell
   $AzureContext = Get-AzureRmContext
   $CloudAdminCred = Get-Credential -UserName AZURESTACK\CloudAdmin -Message "Enter the cloud domain credentials to access the privileged endpoint"
   Add-AzsRegistration `
       -CloudAdminCredential $CloudAdminCred `
       -AzureSubscriptionId $AzureContext.Subscription.Id `
       -AzureDirectoryTenantName $AzureContext.Tenant.TenantId `
       -PrivilegedEndpoint AzS-ERCS01 `
       -BillingModel Development 
   ```

   | Parameter | Description |
   | -------- | ------------- |
   | CloudAdminCredential | The cloud domain credentials that are used to [access the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint). The username is in the format "\<Azure Stack domain\>\cloudadmin". For development kit, the username is set to "azurestack\cloudadmin". If you’re using an integrated system, contact your Azure Stack operator to get this value.|
   | AzureSubscriptionId | The Azure subscription that you use to register Azure Stack.|
   | AzureDirectoryTenantName | Name of the Azure tenant directory that is associated with your Azure subscription. The registration resource will be created in this directory tenant. |
   | PrivilegedEndpoint | A pre-configured remote PowerShell console that provides you with capabilities like log collection and other post deployment tasks. For development kit, the privileged endpoint is hosted on the "AzS-ERCS01" virtual machine. If you’re using an integrated system, contact your Azure Stack operator to get this value. To learn more, refer to the [using the privileged end point](azure-stack-privileged-endpoint.md) topic.|
   | BillingModel | The billing model that your subscription uses. Allowed values for this parameter are- "Capacity","PayAsYouUse", and "Development". For development kit, this value is set to "Development". If you’re using an integrated system, contact your Azure Stack operator to get this value. |

7. When the script completes, you see a message “Activating Azure Stack (this may take up to 10 minutes to complete).” 

## Verify the registration

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

