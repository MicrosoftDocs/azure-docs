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
| [Azure Blob storage](/storage/blobs/storage-blobs-overview.md)     | Maintain bindings state and function keys.  <br/>Also used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). |
| [Azure Files](../storage/files/storage-files-introduction.md)  | File share used to store and run your function app code in a [Consumption Plan](functions-scale.md#consumption-plan). |
| [Azure Queue storage](../storage/queues/storage-queues-introduction.md)     | Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).   |
| [Azure Table storage](../storage/tables/table-storage-overview.md)  |  Used by [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).       |

> [!IMPORTANT]
> When using the Consumption hosting plan, your function code and binding configuration files are stored in Azure File storage in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

## Storage account requirements

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts, Azure Premium Storage, and general-purpose storage accounts with ZRS replication. These unsupported accounts are filtered out of from the Storage Account blade when creating a function app.

To learn more about storage account types, see [Introducing the Azure Storage Services](../storage/common/storage-introduction.md#azure-storage-services). 

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

Azure Storage encrypts all data in a storage account at rest. For more information, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of blob and file data. These keys must be present in Azure Key Vault for Functions to be able to access the storage account. To learn more, see [Configure customer-managed keys with Azure Key Vault by using the Azure portal](../storage/common/storage-encryption-keys-portal.md).  

## Next steps

Learn more about Azure Functions hosting options.

> [!div class="nextstepaction"]
> [Azure Functions scale and hosting](functions-scale.md)


