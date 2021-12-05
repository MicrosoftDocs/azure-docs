---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your blob container at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Blob Storage extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                |
|----------------|---------------------------------------|
| Trigger        | [Storage Blob Data Owner]<sup>1</sup> |
| Input binding  | [Storage Blob Data Reader]            |
| Output binding | [Storage Blob Data Owner]             |

<sup>1</sup> In some configurations, a blob trigger may additionally require [Storage Queue Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor).

[Storage Blob Data Reader]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader
[Storage Blob Data Owner]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner
