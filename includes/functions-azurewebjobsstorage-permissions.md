---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to the storage account for "AzureWebJobsStorage" at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The [Storage Blob Data Owner] role covers the basic needs of Functions host storage - the runtime needs both read and write access to blobs and the ability to create containers. Several extensions use this connection as a default location for blobs, queues, and tables, and these uses may add requirements as noted in the table below. You may need additional permissions if you use "AzureWebJobsStorage" for any other purposes.

| Extension                  | Roles required                                                                                                 | Explanation                                                                                                                                                     |
|----------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _No extension (host only)_ | [Storage Blob Data Owner]                                                                                      | Used for general coordination, default key store                                                                                                                |
| Azure Blobs (trigger only) | All of:<br/>[Storage Account Contributor],<br/>[Storage Blob Data Owner],<br/>[Storage Queue Data Contributor] | The blob trigger internally uses Azure Queues and writes [blob receipts]. It uses AzureWebJobsStorage for these, regardless of the connection configured for the trigger. |
| Azure Event Hubs (trigger only) | (no change from default requirement)<br/>[Storage Blob Data Owner]       | Checkpoints are persisted in blobs using the AzureWebJobsStorage connection. |
| Timer trigger | (no change from default requirement)<br/>[Storage Blob Data Owner]       | To ensure one execution per event, locks are taken with blobs using the AzureWebJobsStorage connection. |
| Durable Functions | All of:<br/>[Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor]  | Durable Functions uses blobs, queues, and tables to coordinate activity functions and maintain orchestration state. It uses the AzureWebJobsStorage connection for all of these by default, but you can specify a different connection in the [Durable Functions extension configuration]. |



[Storage Account Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Blob Data Owner]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Queue Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Blob Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Storage Table Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-table-data-contributor


[blob receipts]: ../articles/azure-functions/functions-bindings-storage-blob-trigger.md#blob-receipts

[Durable Functions extension configuration]: ../articles/azure-functions/durable/durable-functions-bindings.md#host-json