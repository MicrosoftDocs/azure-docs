---
title: Common Issues - Staging Resources| Microsoft Docs
description: Azure CycleCloud common issue - Staging Resources
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Staging resources

## Possible error messages

- `Staging Resources (Unable to determine AccessKey for URL)`
- `pogo.exceptions.FrameworkError: 'az://.../blobs' is not a directory`
- `pogo.exceptions.FrameworkError: Cannot sync from directory to file!`

## Resolution

Typically, this error happens when the service principal associated with Azure CycleCloud doesn't have the right permissions to read the access key for the storage account locker. To fix this error, grant the **Microsoft.Storage/storageAccounts/listKeys/action** permission to the service principal.

Another common cause of these failures is using a Storage Account with **Hierarchical namespace** enabled for Azure Data Lake Storage Gen 2. You must disable **Hierarchical namespace** for Blob storage accounts that you use as storage lockers.

You can check if **Hierarchical namespace** is enabled in the Storage Account **Overview** page in the Azure portal. Search the page for **Hierarchical namespace**. Once enabled, you can't disable hierarchical namespace. You must choose or create a new Storage Account for the CycleCloud Storage Locker.

## More information

For more information about specific permissions required for CycleCloud, see [Create a custom role and managed identity for CycleCloud](/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud).
