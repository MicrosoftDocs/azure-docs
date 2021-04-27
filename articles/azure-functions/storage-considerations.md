---
title: Storage considerations for Azure Functions
description: Learn about the storage requirements of Azure Functions and about encrypting stored data. 

ms.topic: conceptual
ms.date: 07/27/2020
---

# Storage considerations for Azure Functions

Azure Functions requires an Azure Storage account when you create a function app instance. The following storage services may be used by your function app:


|Storage service  | Functions usage  |
|---------|---------|
| [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md)     | Maintain bindings state and function keys.  <br/>Also used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). |
| [Azure Files](../storage/files/storage-files-introduction.md)  | File share used to store and run your function app code in a [Consumption Plan](consumption-plan.md) and [Premium Plan](functions-premium-plan.md). |
| [Azure Queue storage](../storage/queues/storage-queues-introduction.md)     | Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).   |
| [Azure Table storage](../storage/tables/table-storage-overview.md)  |  Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).       |

> [!IMPORTANT]
> When using the Consumption/Premium hosting plan, your function code and binding configuration files are stored in Azure File storage in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

## Storage account requirements

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts and Azure Premium Storage.

To learn more about storage account types, see [Introducing the Azure Storage Services](../storage/common/storage-introduction.md#core-storage-services). 

While you can use an existing storage account with your function app, you must make sure that it meets these requirements. Storage accounts created as part of the function app create flow in the Azure portal are guaranteed to meet these storage account requirements. In the portal, unsupported accounts are filtered out when choosing an existing storage account while creating a function app. In this flow, you are only allowed to choose existing storage accounts in the same region as the function app you're creating. To learn more, see [Storage account location](#storage-account-location).

<!-- JH: Does using a Premium Storage account improve perf? -->

## Storage account guidance

Every function app requires a storage account to operate. If that account is deleted your function app won't run. To troubleshoot storage-related issues, see [How to troubleshoot storage-related issues](functions-recover-storage-account.md). The following additional considerations apply to the Storage account used by function apps.

### Storage account location

For best performance, your function app should use a storage account in the same region, which reduces latency. The Azure portal enforces this best practice. If, for some reason, you need to use a storage account in a region different than your function app, you must create your function app outside of the portal. 

### Storage account connection setting

The storage account connection is maintained in the [AzureWebJobsStorage application setting](./functions-app-settings.md#azurewebjobsstorage). 

The storage account connection string must be updated when you regenerate storage keys. [Read more about storage key management here](../storage/common/storage-account-create.md).

### Shared storage accounts

It's possible for multiple function apps to share the same storage account without any issues. For example, in Visual Studio you can develop multiple apps using the Azure Storage Emulator. In this case, the emulator acts like a single storage account. The same storage account used by your function app can also be used to store your application data. However, this approach isn't always a good idea in a production environment.

### Optimize storage performance

[!INCLUDE [functions-shared-storage](../../includes/functions-shared-storage.md)]

## Storage data encryption

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

### In-region data residency

When all customer data must remain within a single region, the storage account associated with the function app must be one with [in-region redundancy](../storage/common/storage-redundancy.md). An in-region redundant storage account also must be used with [Azure Durable Functions](./durable/durable-functions-perf-and-scale.md#storage-account-selection).

Other platform-managed customer data is only stored within the region when hosting in an internally load-balanced App Service Environment (ASE). To learn more, see [ASE zone redundancy](../app-service/environment/zone-redundancy.md#in-region-data-residency).

## Mount file shares

_This functionality is current only available when running on Linux._ 

You can mount existing Azure Files shares to your Linux function apps. By mounting a share to your Linux function app, you can leverage existing machine learning models or other data in your functions. You can use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command to mount an existing share to your Linux function app. 

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
