---
title: Common Issues - Staging Resources| Microsoft Docs
description: Azure CycleCloud common issue - Staging Resources
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Staging Resources

## Possible Error Messages

- `Staging Resources (Unable to determine AccessKey for URL)`
- `pogo.exceptions.FrameworkError: 'az://.../blobs' is not a directory`
- `pogo.exceptions.FrameworkError: Cannot sync from directory to file!`

## Resolution

Typically, this error is caused when the service principal associated with Azure CycleCloud does not have the appropriate permissions to read the access key for the storage account locker. To resolve, you must grant "Microsoft.Storage/storageAccounts/listKeys/action" to the service principal.

Another common cause of these failures is using a Storage Account with "Hierarchical namespace" enabled for Azure Data Lake Storage Gen 2.  "Hierarchical namespace" *must* be disabled for Blob storage accounts that are used as storage Lockers.  

You can check "Hierarchical namespace" is enabled in the Storage Account **Overview** page in the Azure Portal.   Search the page for "Hierarchical namespace."   Once enabled, there is no way to disable hierarchical namespace, so a new Storage Account must be chosen or created for the CycleCloud Storage Locker.

## More Information

For more information about specific permissions required for CycleCloud, see [Create a custom role and managed identity for CycleCloud](/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud)
