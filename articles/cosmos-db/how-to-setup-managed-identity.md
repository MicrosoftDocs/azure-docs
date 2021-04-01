---
title: Configure managed identities with Azure AD for your Azure Cosmos DB account
description: Learn how to configure managed identities with Azure Active Directory for your Azure Cosmos DB account
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/01/2021
ms.author: thweiss
---

# Configure managed identities with Azure Active Directory for your Azure Cosmos DB account
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. This article shows how to create a managed identity for Azure Cosmos DB accounts and how to use it to configure [customer-managed keys](how-to-setup-cmk.md).

> [!NOTE]
> Only system-assigned managed identities are currently supported by Azure Cosmos DB.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md). To learn about managed identity types, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).
- To setup managed identities, your account needs to have the [DocumentDB Account Contributor role](../role-based-access-control/built-in-roles.md#documentdb-account-contributor).

## Add a system-assigned identity

### Using an Azure Resource Manager (ARM) template

> [!IMPORTANT]
> Make sure to use an `apiVersion` of `2021-03-15` or higher when working with managed identities.

To enable a system-assigned identity on a new or existing Azure Cosmos DB account, include the following property in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

The `resources` section of your ARM template should then look like the following:

```json
"resources": [
    {
        "type": " Microsoft.DocumentDB/databaseAccounts",
        "identity": {
            "type": "SystemAssigned"
        },
        // ...
    },
    // ...
 ]
```

After your Azure Cosmos DB account has been created or updated, it will show the following property:

```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<azure-ad-tenant-id>",
    "principalId": "<azure-ad-principal-id>"
}
```

## Next steps

- Learn more about [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
- Learn more about [customer-managed keys on Azure Cosmos DB](how-to-setup-cmk.md)
