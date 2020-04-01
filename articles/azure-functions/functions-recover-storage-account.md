---
title: 'Troubleshoot error: Azure Functions Runtime is unreachable'
description: Learn how to troubleshoot an invalid storage account.
author: alexkarcher-msft

ms.topic: article
ms.date: 09/05/2018
ms.author: alkarche
---

# Troubleshoot error: "Azure Functions Runtime is unreachable"

This article helps you troubleshoot the following error string that appears in the Azure portal:

> "Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration."

This issue occurs when the Azure Functions Runtime can't start. The most common reason for the issue is that the function app has lost access to its storage account. For more information, see [Storage account requirements](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal#storage-account-requirements).

The rest of this article helps you troubleshoot the following causes of this error, including how to identify and resolve each case.

## Storage account was deleted

Every function app requires a storage account to operate. If that account is deleted, your function won't work.

Start by looking up your storage account name in your application settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` contains the name of your storage account wrapped up in a connection string. For more information, see [App settings reference for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage).

Search for your storage account in the Azure portal to see whether it still exists. If it has been deleted, re-create the storage account and replace your storage connection strings. Your function code is lost, and you need to redeploy it.

## Storage account application settings were deleted

In the preceding step, if you can't find a storage account connection string, it was likely deleted or overwritten. Deleting application settings most commonly happens when you're using deployment slots or Azure Resource Manager scripts to set application settings.

### Required application settings

* Required:
    * [`AzureWebJobsStorage`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)
* Required for consumption plan functions:
    * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)
    * [`WEBSITE_CONTENTSHARE`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)

For more information, see [App settings reference for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-app-settings).

### Guidance

* Don't check "slot setting" for any of these settings. If you swap deployment slots, the function app breaks.
* Don't modify these settings as part of automated deployments.
* These settings must be provided and valid at creation time. An automated deployment that doesn't contain these settings results in a function app that won't run, even if the settings are added later.

## Storage account credentials are invalid

The previously discussed storage account connection strings must be updated if you regenerate storage keys. For more information about storage key management, see [Create an Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account).

## Storage account is inaccessible

Your function app must be able to access the storage account. Common issues that block a function app's access to a storage account are:

* The function app is deployed to your App Service Environment without the correct network rules to allow traffic to and from the storage account.

* The storage account firewall is enabled and not configured to allow traffic to and from functions. For more information, see [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

## Daily execution quota is full

If you have a daily execution quota configured, your function app is temporarily disabled, which causes many of the portal controls to become unavailable. 

To verify the quota in the [Azure portal](https://portal.azure.com), select **Platform Features** > **Function App Settings** in your function app. If you're over the **Daily Usage Quota** you've set, the following message is displayed:

  > "The Function App has reached daily usage quota and has been stopped until the next 24 hours time frame."

To resolve this issue, remove or increase the daily quota, and then restart your app. Otherwise, the execution of your app is blocked until the next day.

## App is behind a firewall

Your function runtime might be unreachable for either of the following reasons:

* Your function app is hosted in an [internally load balanced App Service Environment](../app-service/environment/create-ilb-ase.md) and it's configured to block inbound internet traffic.

* Your function app has [inbound IP restrictions](functions-networking-options.md#inbound-ip-restrictions) that are configured to block internet access. 

The Azure portal makes calls directly to the running app to fetch the list of functions, and it makes HTTP calls to the Kudu endpoint. Platform-level settings under the **Platform Features** tab are still available.

To verify your App Service Environment configuration:
1. Go to the network security group (NSG) of the subnet where the App Service Environment resides.
1. Validate the inbound rules to allow traffic that's coming from the public IP of the computer where you're accessing the application. 
   
You can also use the portal from a computer that's connected to the virtual network that's running your app or to a virtual machine that's running in your virtual network. 

For more information about inbound rule configuration, see the "Network Security Groups" section of [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info#network-security-groups).

## Next steps

Learn about monitoring your function apps:

> [!div class="nextstepaction"]
> [Monitor Azure Functions](functions-monitoring.md)
