---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/19/2021
ms.author: mahender
---

Cosmos DB does not use Azure RBAC for data operations. Instead, it uses a [Cosmos DB built-in RBAC system] which is built on similar concepts. You will need to create a role assignment that provides access to your database account at runtime. Azure RBAC Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Azure Cosmos DB extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type        | Example built-in roles<sup>1</sup>    |
|---------------------|---------------------------------------|
| Trigger<sup>2</sup> | [Cosmos DB Built-in Data Contributor] |
| Input binding       | [Cosmos DB Built-in Data Reader]      |
| Output binding      | [Cosmos DB Built-in Data Contributor] |

<sup>1</sup> These roles cannot be used in an Azure RBAC role assignment. See the [Cosmos DB built-in RBAC system] documentation for details on how to assign these roles. 

<sup>2</sup> When using identity, Cosmos DB treats container creation as a management operation. It is not available as a data-plane operation for the trigger. You will need to ensure that you create the containers needed by the trigger (including the lease container) before setting up your function.

[Cosmos DB built-in RBAC system]: ../articles/cosmos-db/how-to-setup-rbac.md
[Cosmos DB Built-in Data Reader]: ../articles/cosmos-db/how-to-setup-rbac.md#built-in-role-definitions
[Cosmos DB Built-in Data Contributor]: ../articles/cosmos-db/how-to-setup-rbac.md#built-in-role-definitions