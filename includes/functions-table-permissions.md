---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 01/24/2022
ms.author: mahender
---

You'll need to create a role assignment that provides access to your Azure Storage table service at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) aren't sufficient. The following table shows built-in roles that are recommended when using the Azure Tables extension against Azure Storage in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles (Azure Storage<sup>1</sup>) |
|----------------|---------------------------------------|
| Input binding  | [Storage Table Data Reader]            |
| Output binding | [Storage Table Data Contributor]          |

<sup>1</sup> If your app is instead connecting to tables in Azure Cosmos DB for Table, using an identity isn't supported and the connection must use a connection string.

[Storage Table Data Reader]: ../articles/role-based-access-control/built-in-roles.md#storage-table-data-reader
[Storage Table Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-table-data-contributor
