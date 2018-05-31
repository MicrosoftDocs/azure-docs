---
title: 
description: 
services: storage
keywords: 
author: craigshoemaker
ms.topic: article
ms.author: cshoe
manager: twooley
ms.date: 06/01/2018
ms.service: storage
---

# Manage Azure Blob File System data and account settings

There are two ways you interact with BlobFS. The first is at the account level where settings are manipulated through the [Azure portal](https://portal.azure.com), [Azure CLI](https://docs.microsoft.com/cli/azure) and/or various [PowerShell commands](https://docs.microsoft.com/powershell/azure/get-started-azureps). The second approach is to interface with BlobFS data directly through the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), [SDKs](https://docs.microsoft.com/azure/#pivot=sdkstools&panel=sdkstools-all), and [REST APIs](https://docs.microsoft.com/rest/api/storageservices/azure-storage-services-rest-api-reference). This article demonstrates how to manage account settings via the portal and manipulate data with the Azure Storage Explorer.


## Manage account settings

The following steps demonstrate how to make changes to the Azure Storage account using the portal.

### Open storage account in Azure portal
Point your browser to the [Azure portal](https://portal.azure.com) and log in to your subscription.

Click on **All services** and enter *storage* in the search box. Next, click the **Storage accounts** and click on the account name you want to manage.

### Get storage account key
To access your storage account key, locate the **Settings** group and click **Access keys**. The *Access keys* window allows you to copy both keys and connection strings to your clipboard. 

### Change replication options
To adjust your account's [replication options](../common/storage-redundancy.md), go to **Settings** and click on **Configuration**. From here, you can use the **Replication** drop-down to select the best option for your account.

### Change tiering and lifecycle policies

You have full control over how your account is billed based on the [tiering settings](../blobs/storage-blob-storage-tiers.md) of your account. The process varies slightly depending on the type of account you have.

#### Change GPv2 or Blob storage account tiering

1. In the *Settings* blade, click **Configuration** to edit the account configuration.

2. Set the **Access tier** to either **Cool** or **Hot**.

3. Click **Save** at the top of the blade.

#### Change the tier of a blob in a GPv2 or Blob storage account.

1. To navigate to your blob in your storage account, select **All Resources**, select your storage account, select your container, and then select your blob.

2. In the Blob properties blade, click the **Access tier** dropdown menu to select the **Hot**, **Cool**, or **Archive** storage tier.

3. Click **Save** at the top of the blade

For more detail read, [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md)

## Manage data using Storage Explorer
Inspired by Windows Explorer, the Azure Storage Explorer makes it natural to work with files and folders in BlobFS. In fact, the Storage Explorer makes it easy to:

- View the hierarchical structure of your files
- Inspect folder and file metadata
- Review and edit security settings

Each of these features becomes helpful when you're debugging or just looking to view an individual file. 

### Download Storage Explorer
Download the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and connect login with your Azure credentials.

### View and edit metadata
Select file, right-click, and select **Properties**. From the properties window, you can then add, edit, or delete metadata.

### Edit permissions (future section)
TODO: Add information about how to edit permissions