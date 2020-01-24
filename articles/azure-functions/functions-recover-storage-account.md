---
title: 'Troubleshoot error: Azure Functions Runtime is unreachable'
description: Learn how to troubleshoot an invalid storage account.
author: alexkarcher-msft

ms.topic: article
ms.date: 09/05/2018
ms.author: alkarche
---

# Troubleshoot error: "Azure Functions Runtime is unreachable"

This article is intended to help you troubleshoot the following error if it's displayed in the Azure Functions portal:

> "Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration."

This issue occurs when the Azure Functions Runtime can't start. The most common reason for the issue is that the function app has lost access to its storage account. For more information, see [Storage account requirements](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal#storage-account-requirements).

This article walks you through the six most common error cases and shows you how to identify and resolve each case.

* Storage account deleted
* Storage account application settings deleted
* Storage account credentials invalid
* Storage account inaccessible
* Daily execution quota full
* App is behind a firewall


## Storage account deleted

Every function app requires a storage account to operate. If that account is deleted, your function won't work.

Start by looking up your storage account name in your application settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` contains the name of your storage account wrapped up in a connection string. For more information, see [App settings reference for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage).

Search for your storage account in the Azure portal to see whether it still exists. If it has been deleted, re-create the storage account and replace your storage connection strings. Your function code is lost, and you need to redeploy it.

## Storage account application settings deleted

In the preceding step, if you can't find a storage account connection string, it was likely deleted or overwritten. Deleting application settings most commonly happens when you're using deployment slots or Azure Resource Manager scripts to set application settings.

### Required application settings

* Required:
    * [`AzureWebJobsStorage`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)
* Required for consumption plan functions:
    * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)
    * [`WEBSITE_CONTENTSHARE`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)

For more information, see [App settings reference for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-app-settings).

### Guidance

* Don't select **slot setting** for any of these settings. If you swap deployment slots, the function will break.
* Don't modify these settings as part of automated deployments.
* These settings must be provided and valid at creation time. An automated deployment that doesn't contain these settings results in a non-functional app, even if the settings are added after the fact.

## Storage account credentials invalid

The previously discussed storage account connection strings must be updated if you regenerate storage keys. For more information about storage key management, see [Create an Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account).

## Storage account inaccessible

Your function app must be able to access the storage account. Common issues that block a function app's access to a storage account are:

* The function app is deployed to an App Service environment without the correct network rules to allow traffic to and from the storage account.
* The storage account firewall is enabled and not configured to allow traffic to and from functions. For more information, see [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

## Daily execution quota full

If you have a daily execution quota configured, your function app is temporarily disabled, and many of the portal controls are unavailable. 

* To verify the quota, go to **Platform Features** > **Function App Settings** in the portal. If you're over quota, the following message is displayed:
  > "The Function App has reached daily usage quota and has been stopped until the next 24 hours time frame."
* To resolve the issue, remove the quota and restart your app.

## App is behind a firewall

Your function runtime might be unreachable for either of the following reasons:
* Your function app is hosted in an [internally load balanced App Service Environment](../app-service/environment/create-ilb-ase.md) and it's configured to block inbound internet traffic.
* Your function app has [inbound IP restrictions](functions-networking-options.md#inbound-ip-restrictions) that are configured to block internet access. 

The Azure portal makes calls directly to the running app to fetch the list of functions, and it makes HTTP calls to the Kudu endpoint. Platform level settings under the **Platform Features** tab are still available.

* To verify your App Service Environment (ASE) configuration:
   1. Go to the network security group (NSG) of the subnet where ASE resides.
   1. Validate the inbound rules to allow traffic that's coming from the public IP of the computer where you're accessing the application. 
   
      You can also use the portal from a computer that is connected to the virtual network that's running your app or to a virtual machine that's running in your virtual network. For more information about inbound rule configuration, see [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info#network-security-groups).

## Next steps

Now that your function app is back and operational, take a look at our quickstarts and developer references:

* [Create your first Azure function](functions-create-first-azure-function.md)  
  Jump right in and create your first function by using the instructions in the Azure function's quickstart article. 
* [Azure Functions developer reference](functions-reference.md)  
  Get more technical information about the Azure Functions Runtime and a reference for coding functions and defining triggers and bindings.
* [Testing Azure functions](functions-test-a-function.md)  
  Learn about various tools and techniques for testing your functions.
* [How to scale Azure functions](functions-scale.md)  
  Understand the service plans that are available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan. 
* [Learn more about Azure App Service](../app-service/overview.md)  
  Learn how Azure Functions takes advantage of Azure App Service for core functionality, such as deployments, environment variables, and diagnostics. 
