---
title: How to troubleshoot Functions Runtime is unreachable.
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

# How to troubleshoot "Functions Runtime is unreachable"


## Error Text
 `Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration`

### Summary
This issue occurs when the Functions Runtime cannot start. The most common reason for this error to occur is the Function App losing access to its storage account. [Read more about the storage account requirements here](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal#storage-account-requirements)

## Troubleshooting
We'll walk through the four most common error cases, how to identify, and how to resolve each case.

1. Storage Account deleted
1. Storage Account application setting deleted
1. Storage firewall enabled
1. Storage credentials invalid

### Storage Account deleted

Verification: Check to see if your storage account exists by looking up the name in your Application Settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` will contain the name of your storage account wrapped up in a connection string. Read more specifics at the [application setting reference here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)

Search for your storage account in the Azure portal to see if it still exists. If it has been deleted, you will need to recreate a storage account and replace your storage connection strings. Your function code is lost and you will need to redeploy it again.

### Storage Account Application Settings Deleted

In the previous step, if you did not have a storage account connection string they were likely deleted or overwritten. Deleting app settings is most commonly done when using deployment slots or Azure Resource Manager scripts to set application settings.

#### Required Application Settings

* Required
    * [`AzureWebJobsStorage`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#azurewebjobsstorage)
* Required for Consumption Plan Functions
    * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#websitecontentazurefileconnectionstring)
    * [`WEBSITE_CONTENTSHARE`](https://docs.microsoft.com/azure/azure-functions/functions-app-settings#websitecontentshare)

[Read about these application settings here](https://docs.microsoft.com/azure/azure-functions/functions-app-settings)

#### Guidance

1. Do not check "slot setting" for any of these settings. When you swap deployment slots the application will break.
1. Do not overwrite these settings when using automated deployments.
1. These settings must be provided and valid at creation time. An automated deployment that does not contain these settings will result in a non-functional App, even if the settings are added after the fact.

### Storage Account Credentials Invalid

The above Storage Account connection strings must be updated if you regenerate storage keys. [Read more about storage key management here](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account#manage-your-storage-account)

### Storage Account Inaccessible

Your Function App must be able to access the storage account. Common issues that block a Functions access to a storage account are:

* Function Apps deployed to App Service Environments without the correct network rules to allow traffic to and from the storage account
* The storage account firewall is enabled and not configured to allow traffic to and from Functions. [Read more about storage account firewall configuration here](https://docs.microsoft.com/azure/storage/common/storage-network-security?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)