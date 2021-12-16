---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to the storage account for "AzureWebJobsStorage" at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The [Storage Blob Data Owner] role covers the basic needs of Functions host storage - the runtime needs both read and write access to blobs and the ability to create containers. There are some situations, as with use of the blob trigger, where [Storage Queue Data Contributor] may be needed as well. You may need additional permissions if you use "AzureWebJobsStorage" for any other purposes.

[Storage Blob Data Owner]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Queue Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor