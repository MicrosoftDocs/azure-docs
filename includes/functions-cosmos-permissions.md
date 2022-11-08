---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/19/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your database account at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Azure Cosmos DB extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                |
|----------------|---------------------------------------|
| Trigger        | [Cosmos DB Built-in Data Contributor] |
| Input binding  | [Cosmos DB Built-in Data Reader]      |
| Output binding | [Cosmos DB Built-in Data Contributor] |


[Cosmos DB Built-in Data Reader]: ../articles/cosmos-db/how-to-setup-rbac.md#built-in-role-definitions
[Cosmos DB Built-in Data Contributor]: ../articles/cosmos-db/how-to-setup-rbac.md#built-in-role-definitions