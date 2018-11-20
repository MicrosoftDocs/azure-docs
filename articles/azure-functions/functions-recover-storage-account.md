---
title: How to troubleshoot Azure Functions Runtime is unreachable.
description: Learn how to troubleshoot an invalid storage account.
services: functions
documentationcenter: 
author: alexkarcher-msft
manager: cfowler
editor: ''

ms.service: functions
ms.workload: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2018
ms.author: alkarche
---

# How to troubleshoot "functions runtime is unreachable"


## Error text
This doc is intended to troubleshoot the following error when displayed in the Functions portal.

`Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration`

### Summary
This issue occurs when the Azure Functions Runtime cannot start. The most common reason for this error to occur is the function app losing access to its storage account. [Read more about the storage account requirements here](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal#storage-account-requirements)

### Troubleshooting
We'll walk through the four most common error cases, how to identify, and how to resolve each case.

1. Storage Account deleted
1. Storage Account application settings deleted
1. Storage Account credentials invalid
1. Storage Account Inaccessible

## Storage account deleted

Every function app requires a storage account to operate. If that account is deleted your Function will not work.

### How to find your storage account

Start by looking up your storage account name in your Application Settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` will contain the name of your storage account wrapped up in a connection string. Read more specifics at the [application setting reference here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)

Search for your storage account in the Azure portal to see if it still exists. If it has been deleted, you will need to recreate a storage account and replace your storage connection strings. Your function code is lost and you will need to redeploy it again.

## Storage account application settings deleted

In the previous step, if you did not have a storage account connection string they were likely deleted or overwritten. Deleting app settings is most commonly done when using deployment slots or Azure Resource Manager scripts to set application settings.

### Required application settings

* Required
    * [`AzureWebJobsStorage`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)
* Required for Consumption Plan Functions
    * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#websitecontentazurefileconnectionstring)
    * [`WEBSITE_CONTENTSHARE`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#websitecontentshare)

[Read about these application settings here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)

### Guidance

* Do not check "slot setting" for any of these settings. When you swap deployment slots the Function will break.
* Do not set these settings when using automated deployments.
* These settings must be provided and valid at creation time. An automated deployment that does not contain these settings will result in a non-functional App, even if the settings are added after the fact.

## Storage account credentials invalid

The above Storage Account connection strings must be updated if you regenerate storage keys. [Read more about storage key management here](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account#manage-your-storage-account)

## Storage account inaccessible

Your Function App must be able to access the storage account. Common issues that block a Functions access to a storage account are:

* Function Apps deployed to App Service Environments without the correct network rules to allow traffic to and from the storage account
* The storage account firewall is enabled and not configured to allow traffic to and from Functions. [Read more about storage account firewall configuration here](https://docs.microsoft.com/azure/storage/common/storage-network-security?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)


## Next Steps

Now that your Function App is back and operational take a look at our quickstarts and developer references to get up and running again!

* [Create your first Azure Function](functions-create-first-azure-function.md)  
  Jump right in and create your first function using the Azure Functions quickstart. 
* [Azure Functions developer reference](functions-reference.md)  
  Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.
* [Testing Azure Functions](functions-test-a-function.md)  
  Describes various tools and techniques for testing your functions.
* [How to scale Azure Functions](functions-scale.md)  
  Discusses service plans available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan. 
* [Learn more about Azure App Service](../app-service/app-service-web-overview.md)  
  Azure Functions leverages Azure App Service for core functionality like deployments, environment variables, and diagnostics. 
