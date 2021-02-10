---
title: Configure role-based access control for your Azure Cosmos DB account
description: Learn how to configure role-based access control with Azure Active Directory for your Azure Cosmos DB account
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/12/2021
ms.author: thweiss
---

# Configure role-based access control with Azure Active Directory for your Azure Cosmos DB account (Preview)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!IMPORTANT]
> Azure Cosmos DB role-based access control is currently in preview. This preview version is provided without a Service Level Agreement and is not recommended for production workloads. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB exposes a built-in role-based access control (RBAC) system that lets you:

- Authenticate your data requests with an Azure Active Directory (AAD) identity.
- Authorize your data requests with a fine-grained, role-based permission model.

## Concepts

The Azure Cosmos DB data plane RBAC is built on concepts that are commonly found in other RBAC systems like [Azure RBAC](../role-based-access-control/overview.md):

- The permission model is composed of a set of **[actions](#actions)**; each of these actions maps to one or multiple database operations.
- Azure Cosmos DB users create **[role definitions](#role-definitions)** containing a list of allowed actions.
- Role definitions get assigned to specific AAD identities through **[role assignments](#role-assignments)**. A role assignment also defines the scope that the role definition applies to; three scopes are currently supported:
    - An Azure Cosmos DB account,
    - An Azure Cosmos DB database,
    - An Azure Cosmos DB container.

:::image type="content" source="./media/how-to-setup-rbac/concepts.png" alt-text="RBAC concepts":::

> [!NOTE]
> The Azure Cosmos DB RBAC does not currently expose any built-in roles. Built-in roles will be added before the feature becomes generally available.

## <a id="actions"></a> Actions

The table below lists all the actions exposed by the permission model.

| Name | Corresponding database operation(s) |
|---|---|
| `Microsoft.DocumentDB/databaseAccounts/readMetadata` | Reading account metadata. See [Metadata requests](#metadata-requests) for details. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/create` | Creating a new item |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read` | Reading an individual item by its ID and partition key (point-read) |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/replace` | Replacing an existing item |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/upsert` | "Upserting" an item (i.e., creating it if it doesn't exist, or replacing it if it exists) |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/delete` | Deleting an item |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery` | Executing a [SQL query](sql-query-getting-started.md) |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed` | Reading from the container's [change feed](read-change-feed.md) |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeStoredProcedure` | Executing a [stored procedure](stored-procedures-triggers-udfs.md) |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/manageConflicts` | Managing [conflicts](conflict-resolution-policies.md) for multi-write region accounts (i.e., listing and deleting items from the conflict feed) |

Wildcards are supported at both *containers* and *items* levels:

- `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*`
- `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*`

> [!IMPORTANT]
> This permission model only covers database operations that let you read and write data. It does **not** cover any kind of management operations, like creating containers or changing their throughput. To authenticate management operations with an AAD identity, use [Azure RBAC](role-based-access-control.md) instead.

### <a id="metadata-requests"></a> Metadata requests

When using Azure Cosmos DB SDKs, these SDKs issue read-only metadata requests during initialization and to serve specific data requests. These metadata requests fetch various configuration details, like the global configuration of your account (which Azure regions the account is available in), the partition key of your containers or their indexing policy. They do *not* fetch any of the data that you've stored in your account.

To ensure the best transparency of our permission model, these metadata requests are covered by an explicit action (`Microsoft.DocumentDB/databaseAccounts/readMetadata`). This action should be allowed in every situation where your Azure Cosmos DB account is accessed through one of the Azure Cosmos DB SDKs. It can be assigned (through a role assignment) at any level of the Cosmos DB hierarchy (i.e., account, database, or container).

The actual metadata requests allowed by the `Microsoft.DocumentDB/databaseAccounts/readMetadata` action depend on the scope that the action is assigned to:

| Scope | Requests allowed by the action |
|---|---|
| Account | - Listing the databases under the account<br>- For each database under the account, the allowed actions at the database scope |
| Database | - Reading database metadata<br>- Listing the containers under the database<br>- For each container under the database, the allowed actions at the container scope |
| Container | - Reading container metadata<br>- Listing physical partitions under the container<br>- Resolving the address of each physical partition |

## <a id="role-definitions"></a> Create role definitions

### Using Azure PowerShell

Create a role named "MyReadOnlyRole" that only contains read actions:

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "myCosmosAccount"
New-AzCosmosDBSqlRoleDefinition -AccountName $accountName `
    -ResourceGroupName $resourceGroupName `
    -Type CustomRole -RoleName MyReadOnlyRole `
    -DataAction @( `
        'Microsoft.DocumentDB/databaseAccounts/readMetadata',
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read', `
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery', `
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed') `
    -AssignableScope "/"
```

Create a role named "MyReadWriteRole that contains all actions:

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "myCosmosAccount"
New-AzCosmosDBSqlRoleDefinition -AccountName $accountName `
    -ResourceGroupName $resourceGroupName `
    -Type CustomRole -RoleName MyReadWriteRole `
    -DataAction @( `
        'Microsoft.DocumentDB/databaseAccounts/readMetadata',
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*', `
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*') `
    -AssignableScope "/"
```

List the role definitions you've just created to fetch their IDs:

```powershell
Get-AzCosmosDBSqlRoleDefinition -AccountName $accountName `
    -ResourceGroupName $resourceGroupName
```

### Using the Azure CLI

Create a role named "MyReadOnlyRole" that only contains read actions:

```json
// role-definition-ro.json
{
    "RoleName": "MyReadOnlyRole",
    "Type": "CustomRole",
    "AssignableScopes": ["/"],
    "Permissions": [{
        "DataActions": [
            "Microsoft.DocumentDB/databaseAccounts/readMetadata",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed"
        ]
    }]
}
```

```azurecli-interactive
resourceGroupName='myResourceGroup'
accountName='myCosmosAccount'
az cosmosdb sql role definition create -a $accountName -g $resourceGroupName -b @role-definition-ro.json
```

Create a role named "MyReadWriteRole" that contains all actions:

```json
// role-definition-rw.json
{
    "RoleName": "MyReadWriteRole",
    "Type": "CustomRole",
    "AssignableScopes": ["/"],
    "Permissions": [{
        "DataActions": [
            "Microsoft.DocumentDB/databaseAccounts/readMetadata",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
        ]
    }]
}
```

```azurecli-interactive
az cosmosdb sql role definition create -a $accountName -g $resourceGroupName -b @role-definition-rw.json
```

List the role definitions you've just created to fetch their IDs:

```azurecli-interactive
az cosmosdb sql role definition list -a $accountName -g $resourceGroupName
```

## <a id="role-assignments"></a> Create role assignments

Once you've created your role definitions, you can associate them with your AAD identities.

> [!NOTE]
> If you want to create a role assignment for a service principal, make sure to use its **Object ID** as found in the **Enterprise applications** section of the **Azure Active Directory** portal blade.

### Using Azure PowerShell

Assign the role 'MyReadOnlyRole' to an identity:

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "myCosmosAccount"
$readOnlyRoleDefinitionId = "roleDefinitionId" // as fetched above
$principalId = "aadPrincipalId"
New-AzCosmosDBSqlRoleAssignment -AccountName $accountName `
    -ResourceGroupName $resourceGroupName `
    -RoleDefinitionId $readOnlyRoleDefinitionId `
    -Scope $accountName `
    -PrincipalId $principalId
```

### Using the Azure CLI

Assign the role 'MyReadOnlyRole' to an identity:

```azurecli-interactive
resourceGroupName='myResourceGroup'
accountName='myCosmosAccount'
readOnlyRoleDefinitionId = 'roleDefinitionId' // as fetched above
principalId = 'aadPrincipalId'
az cosmosdb sql role assignment create -a $accountName -g $resourceGroupName -s "/" -p $principalId -d $readOnlyRoleDefinitionId
```

## Initialize the Azure Cosmos DB SDK with Azure Active Directory

To use the Azure Cosmos DB RBAC in your application, you have to update the way you initialize the Azure Cosmos DB SDK. Instead of passing your account's primary key, you have to pass an instance of a `TokenCredential` class. This instance provides the Azure Cosmos DB SDK with the context required to fetch an AAD token on behalf of the identity you wish to use.

The way you create a `TokenCredential` instance is beyond the scope of this article. There are many ways to create such an instance depending on the type of AAD identity you want to use (user principal, service principal, group etc.). Most importantly, your `TokenCredential` instance must resolve to the identity (principal ID) that you've assigned your roles to. You can find examples of creating a `TokenCredential` class:

- [in .NET](https://docs.microsoft.com/dotnet/api/overview/azure/identity-readme#credential-classes)
- [in Java](https://docs.microsoft.com/java/api/overview/azure/identity-readme#credential-classes)

The examples below use a service principal with a `ClientSecretCredential` instance.

### In .NET

```csharp
TokenCredential servicePrincipal = new ClientSecretCredential(
    "<azure-ad-tenant-id>",
    "<client-application-id>",
    "<client-application-secret>");
CosmosClient client = new CosmosClient("<account-endpoint>", servicePrincipal);
```

### In Java

```java
TokenCredential ServicePrincipal = new ClientSecretCredentialBuilder()
    .authorityHost("https://login.microsoftonline.com")
    .tenantId("<azure-ad-tenant-id>")
    .clientId("<client-application-id>")
    .clientSecret("<client-application-secret>")
    .build();
CosmosAsyncClient Client = new CosmosClientBuilder()
    .endpoint("<account-endpoint>")
    .credential(ServicePrincipal)
    .build();
```

## Frequently asked questions

### Which Azure Cosmos DB APIs are supported by RBAC?

Only the SQL API is currently supported.

### Which Azure Cosmos DB SQL API SDKs are supported by RBAC?

The [.NET V3](sql-api-sdk-dotnet-standard.md) and [Java V4](sql-api-sdk-java-v4.md) SDKs are currently supported.

### Is the AAD token automatically refreshed by the Azure Cosmos DB SDKs when it expires?

Yes.

### Is it possible to disable the usage of the account primary key when using RBAC?

This is not currently possible, but will be offered before the feature becomes generally available

## Next steps

- Get an overview of [secure access to data in Cosmos DB](secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](role-based-access-control.md).