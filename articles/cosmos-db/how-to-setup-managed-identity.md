---
title: Configure managed identities with Azure AD for your Azure Cosmos DB account
description: Learn how to configure managed identities with Azure Active Directory for your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: how-to
ms.date: 10/15/2021
ms.author: sidandrews
---

# Configure managed identities with Azure Active Directory for your Azure Cosmos DB account
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. This article shows how to create a managed identity for Azure Cosmos DB accounts.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md). To learn about managed identity types, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).
- To set up managed identities, your account needs to have the [DocumentDB Account Contributor role](../role-based-access-control/built-in-roles.md#documentdb-account-contributor).

## Add a system-assigned identity

### Using the Azure portal

To enable a system-assigned managed identity on an existing Azure Cosmos DB account, navigate to your account in the Azure portal and select **Identity** from the left menu.

:::image type="content" source="./media/how-to-setup-managed-identity/identity-tab.png" alt-text="The Identity menu entry" border="true":::

Under the **System assigned** section, flip the **Status** to On and select **Save**. You will be asked to confirm the creation of the system-assigned managed identity.

:::image type="content" source="./media/how-to-setup-managed-identity/enable-system-assigned.png" alt-text="Enabling a system-assigned identity" border="true":::

Once the identity has been created and assigned, you can retrieve its Object (principal) ID.

:::image type="content" source="./media/how-to-setup-managed-identity/system-identity-enabled.png" alt-text="Retrieving the object ID of a system-assigned identity" border="true":::

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

Once your Azure Cosmos DB account has been created or updated, it will show the following property:

```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<azure-ad-tenant-id>",
    "principalId": "<azure-ad-principal-id>"
}
```

### Using the Azure CLI

To enable a system-assigned identity while creating a new Azure Cosmos DB account, add the `--assign-identity` option:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb create \
    -n $accountName \
    -g $resourceGroupName \
    --locations regionName='West US 2' failoverPriority=0 isZoneRedundant=False \
    --assign-identity
```

You can also add a system-assigned identity on an existing account using the `az cosmosdb identity assign` command:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb identity assign \
    -n $accountName \
    -g $resourceGroupName
```

Once your Azure Cosmos DB account has been created or updated, you can fetch the identity assigned with the `az cosmosdb identity show` command:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb identity show \
    -n $accountName \
    -g $resourceGroupName
```

```json
{
    "type": "SystemAssigned",
    "tenantId": "<azure-ad-tenant-id>",
    "principalId": "<azure-ad-principal-id>"
}
```

## Add a user-assigned identity

### Using the Azure portal

To enable a user-assigned managed identity on an existing Azure Cosmos DB account, navigate to your account in the Azure portal and select **Identity** from the left menu.

:::image type="content" source="./media/how-to-setup-managed-identity/identity-tab.png" alt-text="The Identity menu entry" border="true":::

Under the **user assigned** section, select **+ Add**.

:::image type="content" source="./media/how-to-setup-managed-identity/enable-user-assigned-1.png" alt-text="Enabling a user-assigned identity" border="true":::

Find and select all the identities you wish to assign to your Azure Cosmos DB account, then select **Add**.

:::image type="content" source="./media/how-to-setup-managed-identity/enable-user-assigned-2.png" alt-text="Selecting all the identities to assign" border="true":::

### Using an Azure Resource Manager (ARM) template

> [!IMPORTANT]
> Make sure to use an `apiVersion` of `2021-03-15` or higher when working with managed identities.

To enable a user-assigned identity on a new or existing Azure Cosmos DB account, include the following property in the resource definition:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<identity-resource-id>": {}
    }
}
```

The `resources` section of your ARM template should then look like the following:

```json
"resources": [
    {
        "type": " Microsoft.DocumentDB/databaseAccounts",
        "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
                "<identity-resource-id>": {}
            }
        },
        // ...
    },
    // ...
]
```

After your Azure Cosmos DB account has been created or updated, it will show the following property:

```json
"identity": {
    "type": "UserAssigned",
    "tenantId": "<azure-ad-tenant-id>",
    "principalId": "<azure-ad-principal-id>"
}
```

### Using the Azure CLI

To enable a user-assigned identity while creating a new Azure Cosmos DB account, add the `--assign-identity` option and pass the resource ID of the identity you wish to assign:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb create \
    -n $accountName \
    -g $resourceGroupName \
    --locations regionName='West US 2' failoverPriority=0 isZoneRedundant=False \
    --assign-identity <identity-resource-id>
```

You can also add a user-assigned identity on an existing account using the `az cosmosdb identity assign` command:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb identity assign \
    -n $accountName \
    -g $resourceGroupName
    --identities <identity-resource-id>
```

After your Azure Cosmos DB account has been created or updated, you can fetch the identity assigned with the `az cosmosdb identity show` command:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb identity show \
    -n $accountName \
    -g $resourceGroupName
```

```json
{
    "type": "UserAssigned",
    "tenantId": "<azure-ad-tenant-id>",
    "principalId": "<azure-ad-principal-id>"
}
```

## Remove a system-assigned or user-assigned identity

### Using an Azure Resource Manager (ARM) template

> [!IMPORTANT]
> Make sure to use an `apiVersion` of `2021-03-15` or higher when working with managed identities.

To remove a system-assigned identity from your Azure Cosmos DB account, set the `type` of the `identity` property to `None`:

```json
"identity": {
    "type": "None"
}
```

### Using the Azure CLI

To remove all managed identities from your Azure Cosmos DB account, use the `az cosmosdb identity remove` command:

```azurecli
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

az cosmosdb identity remove \
    -n $accountName \
    -g $resourceGroupName
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Store and use Azure Cosmos DB credentials with Azure Key Vault](store-credentials-key-vault.md)

- Learn more about [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
- Learn more about [customer-managed keys on Azure Cosmos DB](how-to-setup-cmk.md)
