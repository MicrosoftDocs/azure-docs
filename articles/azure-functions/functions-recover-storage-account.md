---
title: How to troubleshoot Azure Functions Runtime is unreachable.
description: Learn how to troubleshoot an invalid storage account.
author: alexkarcher-msft

ms.topic: article
ms.date: 09/05/2018
ms.author: alkarche
---

# How to troubleshoot "functions runtime is unreachable"

This article is intended to troubleshoot the "functions runtime is unreachable" error message when it's displayed in the Azure portal. When this error occurs, you see the following error string displayed in the portal.

`Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration`

This occurs when the Azure Functions Runtime can't start. The most common reason for this error to occur is the function app losing access to its storage account. To learn more, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

The rest of this article helps you troubleshoot the following causes of this error, including how to identify and resolve each case.

+ [Storage account deleted](#storage-account-deleted)
+ [Storage account application settings deleted](#storage-account-application-settings-deleted)
+ [Storage account credentials invalid](#storage-account-credentials-invalid)
+ [Storage account inaccessible](#storage-account-inaccessible)
+ [Daily execution quota exceeded](#daily-execution-quota-full)
+ [Your app is behind a firewall](#app-is-behind-a-firewall)


## Storage account deleted

Every function app requires a storage account to operate. If that account is deleted your Function will not work.

### How to find your storage account

Start by looking up your storage account name in your Application Settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` will contain the name of your storage account wrapped up in a connection string. Read more specifics at the [application setting reference here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage).

Search for your storage account in the Azure portal to see if it still exists. If it has been deleted, you will need to recreate a storage account and replace your storage connection strings. Your function code is lost and you will need to redeploy it again.

## Storage account application settings deleted

In the previous step, if you did not have a storage account connection string it was likely deleted or overwritten. Deleting app settings is most commonly done when using deployment slots or Azure Resource Manager scripts to set application settings.

### Required application settings

* Required
    * [`AzureWebJobsStorage`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)
* Required for Consumption Plan Functions
    * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)
    * [`WEBSITE_CONTENTSHARE`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)

[Read about these application settings here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings).

### Guidance

* Don't check "slot setting" for any of these settings. When you swap deployment slots the function app breaks.
* Don't modify these settings as part of automated deployments.
* These settings must be provided and valid at creation time. An automated deployment that doesn't contain these settings results in a function app that won't run, even if the settings are added later.

## Storage account credentials invalid

The above Storage Account connection strings must be updated if you regenerate storage keys. [Read more about storage key management here](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account).

## Storage account inaccessible

Your function app must be able to access the storage account. Common issues that block a Functions access to a storage account are:

+ function apps deployed to App Service Environments (ASE) without the correct network rules to allow traffic to and from the storage account.

+ The storage account firewall is enabled and not configured to allow traffic to and from functions. To learn more, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

## Daily execution quota full

If you have a daily execution quota configured, your function app is temporarily disabled, which causes many of the portal controls to become unavailable. 

+ To verify in the [Azure portal](https://portal.azure.com), open **Platform Features** > **Function App Settings** in your function app. When you're over the **Daily Usage Quota** you set, you'll see the following message:

    `The function app has reached daily usage quota and has been stopped until the next 24 hours time frame.`

+ To resolve this issue, remove or increase the daily quota and restart your app. Otherwise, execution of your app is blocked until the next day.

## App is behind a firewall

Your function runtime will be unreachable if your function app is hosted in an [internally load balanced App Service Environment](../app-service/environment/create-ilb-ase.md) and is configured to block inbound internet traffic, or has [inbound IP restrictions](functions-networking-options.md#inbound-ip-restrictions) configured to block internet access. The Azure portal makes calls directly to the running app to fetch the list of functions and also makes HTTP calls to KUDU endpoint. Platform level settings under the `Platform Features` tab will still be available.

To verify your ASE configuration, navigate to the NSG of the subnet where ASE resides and validate inbound rules to allow traffic coming from the public IP of the computer where you are accessing the application. You can also use the portal from a computer connected to the virtual network running your app or a virtual machine running in your virtual network. [Read more about inbound rule configuration here](../app-service/environment/network-info.md#network-security-groups)

## Next Steps

Learn about monitoring your function apps:

> [!div class="nextstepaction"]
> [Monitor Azure Functions](functions-monitoring.md)
