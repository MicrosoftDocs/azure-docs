---
title: CycleCloud Common Issues - Staging Resources| Microsoft Docs
description: Azure CycleCloud common issue - Staging Resources
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Staging Resources

## Possible Error Messages

- `Staging Resources (Unable to determine AccessKey for URL)`

## Resolution

Typically, this error is caused when the service principal associated with Azure CycleCloud does not have the appropriate permissions to read the access key for the storage account locker. To resolve, you must grant "Microsoft.Storage/storageAccounts/listKeys/action" to the service principal.

## More Information

For more information about specific permissions required for CycleCloud, see [Create a custom role and managed identity for CycleCloud](https://docs.microsoft.com/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud)