---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 05/11/2022
ms.author: mahender
---

You'll need to create a role assignment that provides access to Azure storage at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) aren't sufficient. The following built-in roles are recommended when using the Durable Functions extension in normal operation:

- [Storage Blob Data Contributor]
- [Storage Queue Data Contributor]
- [Storage Table Data Contributor]

Your application may require more permissions based on the code you write. If you're using the default behavior or explicitly setting `connectionName` to "AzureWebJobsStorage", see [Connecting to host storage with an identity](../articles/azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity) for other permission considerations.

[Storage Blob Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Storage Queue Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Table Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-table-data-contributor
