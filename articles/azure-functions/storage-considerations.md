---
title: Storage considerations for Azure Functions
description: Learn about the storage requirements of Azure Functions and about encrypting stored data. 

ms.topic: conceptual
ms.date: 01/21/2020
---

# Storage considerations for Azure Functions

Azure Functions requires an Azure Storage account when you create a function app instance. The following storage services may be used by your function app:


|Storage service  | Functions usage  |
|---------|---------|
| [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md)     | Maintain bindings state and function keys.  <br/>Also used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). |
| [Azure Files](../storage/files/storage-files-introduction.md)  | File share used to store and run your function app code in a [Consumption Plan](functions-scale.md#consumption-plan). |
| [Azure Queue storage](../storage/queues/storage-queues-introduction.md)     | Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).   |
| [Azure Table storage](../storage/tables/table-storage-overview.md)  |  Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).       |

> [!IMPORTANT]
> When using the Consumption hosting plan, your function code and binding configuration files are stored in Azure File storage in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

## Storage account requirements

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts, Azure Premium Storage, and general-purpose storage accounts with ZRS replication. These unsupported accounts are filtered out of from the Storage Account blade when creating a function app.

To learn more about storage account types, see [Introducing the Azure Storage Services](../storage/common/storage-introduction.md#core-storage-services). 

While you can use an existing storage account with your function app, you must make sure that it meets these requirements. Storage accounts created as part of the function app create flow are guaranteed to meet these storage account requirements.  

## Storage account guidance

Every function app requires a storage account to operate. If that account is deleted your function app won't run. To troubleshoot storage-related issues, see [How to troubleshoot storage-related issues](functions-recover-storage-account.md). The following additional  considerations apply to the Storage account used by function apps.

### Storage account connection setting

The storage account connection is maintained in the [AzureWebJobsStorage application setting](./functions-app-settings.md#azurewebjobsstorage). 

The storage account connection string must be updated when you regenerate storage keys. [Read more about storage key management here](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account).

### Shared storage accounts

It's possible for multiple function apps to share the same storage account without any issues. For example, in Visual Studio you can develop multiple apps using the Azure Storage Emulator. In this case, the emulator acts like a single storage account. The same storage account used by your function app can also be used to store your application data. However, this approach isn't always a good idea in a production environment.

### Optimize storage performance

[!INCLUDE [functions-shared-storage](../../includes/functions-shared-storage.md)]

## Storage data encryption

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

## Mount file shares (Linux)

You can mount existing Azure Files shares to your Linux function apps. By mounting a share to your Linux function app, you can leverage existing machine learning models or other data in your functions. You can use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command to mount an existing share to your Linux function app. 

In this command, `share-name` is the name of the existing Azure Files share, and `custom-id` can be any string that uniquely defines the share when mounted to the function app. Also, `mount-path` is the path from which the share is accessed in your function app. `mount-path` must be in the format `/dir-name`, and it can't start with `/home`.

For a complete example, see the scripts in [Create a Python function app and mount a Azure Files share](scripts/functions-cli-mount-files-storage-linux.md). 

Currently, only a `storage-type` of `AzureFiles` is supported. You can only mount five shares to a given function app. Mounting a file share may increase the cold start time by at least 200-300ms, or even more when the storage account is in a different region.

The mounted share is available to your function code at the `mount-path` specified. For example, when `mount-path` is `/path/to/mount`, you can access the target directory by file system APIs, as in the following Python example:

```python
import os
...

files_in_share = os.listdir("/path/to/mount")
```

## Next steps

Learn more about Azure Functions hosting options.

> [!div class="nextstepaction"]
> [Azure Functions scale and hosting](functions-scale.md)


