---
title: Configure role-based access control with Azure AD
titleSuffix: Azure Cosmos Db
description: Learn how to configure role-based access control with Azure Active Directory for your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/12/2023
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: ignite-2022
---

# Configure role-based access control with Azure Active Directory for your Azure Cosmos DB account

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

> [!NOTE]
> This article is about role-based access control for data plane operations in Azure Cosmos DB. If you are using management plane operations, see [role-based access control](role-based-access-control.md) applied to your management plane operations article.

Azure Cosmos DB exposes a built-in role-based access control system that lets you:

- Authenticate your data requests with an Azure Active Directory (Azure AD) identity.
- Authorize your data requests with a fine-grained, role-based permission model.

## Concepts

The Azure Cosmos DB data plane role-based access control is built on concepts that are commonly found in other role-based access control systems like [Azure role-based access control](../role-based-access-control/overview.md):

- The [permission model](#permission-model) is composed of a set of **actions**; each of these actions maps to one or multiple database operations. Some examples of actions include reading an item, writing an item, or executing a query.
- Azure Cosmos DB users create **[role definitions](#role-definitions)** containing a list of allowed actions.
- Role definitions get assigned to specific Azure AD identities through **[role assignments](#role-assignments)**. A role assignment also defines the scope that the role definition applies to; currently, three scopes are currently:
  - An Azure Cosmos DB account,
  - An Azure Cosmos DB database,
  - An Azure Cosmos DB container.

:::image type="content" source="./media/how-to-setup-rbac/concepts.svg" alt-text="Diagram of common role-based access control concepts including role definitions, role assignments, and principals.":::

## <a id="permission-model"></a> Permission model

> [!IMPORTANT]
> This permission model covers only database operations that involve reading and writing data. It **does not** cover any kind of management operations on management resources, including:
>
> - Create/Replace/Delete Database
> - Create/Replace/Delete Container
> - Read/Replace Container Throughput
> - Create/Replace/Delete/Read Stored Procedures
> - Create/Replace/Delete/Read Triggers
> - Create/Replace/Delete/Read User Defined Functions
>
> You *cannot use any Azure Cosmos DB data plane SDK* to authenticate management operations with an Azure AD identity. Instead, you must use [Azure role-based access control](role-based-access-control.md) through one of the following options:
>
> - [Azure Resource Manager templates (ARM templates)](./sql/manage-with-templates.md)
> - [Azure PowerShell scripts](./sql/manage-with-powershell.md)
> - [Azure CLI scripts](./sql/manage-with-cli.md)
> - Azure management libraries available in:
>   - [.NET](https://www.nuget.org/packages/Azure.ResourceManager.CosmosDB/)
>   - [Java](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-cosmos)
>   - [Python](https://pypi.org/project/azure-mgmt-cosmosdb/)
>
> Read Database and Read Container are considered [metadata requests](#metadata-requests). Access to these operations can be granted as stated in the following section.

This table lists all the actions exposed by the permission model.

| Name | Corresponding database operation(s) |
|---|---|
| `Microsoft.DocumentDB/databaseAccounts/readMetadata` | Read account metadata. See [Metadata requests](#metadata-requests) for details. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/create` | Create a new item. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read` | Read an individual item by its ID and partition key (point-read). |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/replace` | Replace an existing item. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/upsert` | "Upsert" an item. This operation creates an item if it doesn't already exist, or to replace the item if it does exist. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/delete` | Delete an item. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery` | Execute a [SQL query](nosql/query/getting-started.md). |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed` | Read from the container's [change feed](read-change-feed.md). Execute [SQL queries](nosql/query/getting-started.md) using the SDKs. |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeStoredProcedure` | Execute a [stored procedure](stored-procedures-triggers-udfs.md). |
| `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/manageConflicts` | Manage [conflicts](conflict-resolution-policies.md) for multi-write region accounts (that is, list and delete items from the conflict feed). |

> [!NOTE]
> When executing queries through the SDKs, both `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery` and `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed` permissions are required.

Wildcards are supported at both *containers* and *items* levels:

- `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*`
- `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*`

### <a id="metadata-requests"></a> Metadata requests

The Azure Cosmos DB SDKs issue read-only metadata requests during initialization and to serve specific data requests. These requests fetch various configuration details such as:

- The global configuration of your account, which includes the Azure regions the account is available in.
- The partition key of your containers or their indexing policy.
- The list of physical partitions that make a container and their addresses.

They **do not** fetch any of the data that you've stored in your account.

To ensure the best transparency of our permission model, these metadata requests are explicitly covered by the `Microsoft.DocumentDB/databaseAccounts/readMetadata` action. This action should be allowed in every situation where your Azure Cosmos DB account is accessed through one of the Azure Cosmos DB SDKs. It can be assigned (through a role assignment) at any level in the Azure Cosmos DB hierarchy (that is, account, database, or container).

The actual metadata requests allowed by the `Microsoft.DocumentDB/databaseAccounts/readMetadata` action depend on the scope that the action is assigned to:

| Scope | Requests allowed by the action |
|---|---|
| Account | &bull; Listing the databases under the account <br /> &bull; For each database under the account, the allowed actions at the database scope |
| Database | &bull; Reading database metadata <br /> &bull; Listing the containers under the database <br /> &bull; For each container under the database, the allowed actions at the container scope |
| Container | &bull; Reading container metadata <br /> &bull; Listing physical partitions under the container <br /> &bull; Resolving the address of each physical partition |

> [!IMPORTANT]
> Throughput is not included in the metadata for this action.

## Built-in role definitions

Azure Cosmos DB exposes two built-in role definitions:

> [!IMPORTANT]
> The term **role definitions** here refer to Azure Cosmos DB specific role definitions. These are distinct from Azure role-based access control role definitions.

| ID | Name | Included actions |
|---|---|---|
| 00000000-0000-0000-0000-000000000001 | Cosmos DB Built-in Data Reader | `Microsoft.DocumentDB/databaseAccounts/readMetadata`<br />`Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read`<br />`Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery`<br />`Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed` |
| 00000000-0000-0000-0000-000000000002 | Cosmos DB Built-in Data Contributor | `Microsoft.DocumentDB/databaseAccounts/readMetadata`<br />`Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*`<br />`Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*` |

## <a id="role-definitions"></a> Create custom role definitions

When creating a custom role definition, you need to provide:

- The name of your Azure Cosmos DB account.
- The resource group containing your account.
- The type of the role definition: `CustomRole`.
- The name of the role definition.
- A list of [actions](#permission-model) that you want the role to allow.
- One or multiple scope(s) that the role definition can be assigned at; supported scopes are:
  - `/` (account-level),
  - `/dbs/<database-name>` (database-level),
  - `/dbs/<database-name>/colls/<container-name>` (container-level).

> [!NOTE]
> The operations described are available in:
>
> - Azure PowerShell: [Az.CosmosDB version 1.2.0](https://www.powershellgallery.com/packages/Az.CosmosDB/1.2.0) or higher
> - [Azure CLI](/cli/azure/install-azure-cli): version 2.24.0 or higher
>

### Using Azure PowerShell

Create a role named *MyReadOnlyRole* that only contains read actions:

```powershell
$resourceGroupName = "<myResourceGroup>"
$accountName = "<myCosmosAccount>"
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

Create a role named *MyReadWriteRole* that contains all actions:

```powershell
New-AzCosmosDBSqlRoleDefinition -AccountName $accountName `
    -ResourceGroupName $resourceGroupName `
    -Type CustomRole -RoleName MyReadWriteRole `
    -DataAction @( `
        'Microsoft.DocumentDB/databaseAccounts/readMetadata',
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*', `
        'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*') `
    -AssignableScope "/"
```

List the role definitions you've created to fetch their IDs:

```powershell
Get-AzCosmosDBSqlRoleDefinition -AccountName $accountName `
    -ResourceGroupName $resourceGroupName
```

```output
RoleName         : MyReadWriteRole
Id               : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAcc
                   ounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>
Type             : CustomRole
Permissions      : {Microsoft.Azure.Management.CosmosDB.Models.Permission}
AssignableScopes : {/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAc
                   counts/<myCosmosAccount>}

RoleName         : MyReadOnlyRole
Id               : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAcc
                   ounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>
Type             : CustomRole
Permissions      : {Microsoft.Azure.Management.CosmosDB.Models.Permission}
AssignableScopes : {/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAc
                   counts/<myCosmosAccount>}
```

### Using the Azure CLI

Create a role named *MyReadOnlyRole* that only contains read actions in a file named **role-definition-ro.json**:

```json
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

```azurecli
resourceGroupName='<myResourceGroup>'
accountName='<myCosmosAccount>'
az cosmosdb sql role definition create --account-name $accountName --resource-group $resourceGroupName --body @role-definition-ro.json
```

Create a role named *MyReadWriteRole* that contains all actions in a file named **role-definition-rw.json**:

```json
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

```azurecli
az cosmosdb sql role definition create --account-name $accountName --resource-group $resourceGroupName --body @role-definition-rw.json
```

List the role definitions you've created to fetch their IDs:

```azurecli
az cosmosdb sql role definition list --account-name $accountName --resource-group $resourceGroupName
```

```json
[
  {
    "assignableScopes": [
      "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>"
    ],
    "id": "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>",
    "name": "<roleDefinitionId>",
    "permissions": [
      {
        "dataActions": [
          "Microsoft.DocumentDB/databaseAccounts/readMetadata",
          "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
          "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
        ],
        "notDataActions": []
      }
    ],
    "resourceGroup": "<myResourceGroup>",
    "roleName": "MyReadWriteRole",
    "sqlRoleDefinitionGetResultsType": "CustomRole",
    "type": "Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions"
  },
  {
    "assignableScopes": [
      "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>"
    ],
    "id": "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>",
    "name": "<roleDefinitionId>",
    "permissions": [
      {
        "dataActions": [
          "Microsoft.DocumentDB/databaseAccounts/readMetadata",
          "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read",
          "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery",
          "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed"
        ],
        "notDataActions": []
      }
    ],
    "resourceGroup": "<myResourceGroup>",
    "roleName": "MyReadOnlyRole",
    "sqlRoleDefinitionGetResultsType": "CustomRole",
    "type": "Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions"
  }
]
```

### Using Azure Resource Manager templates

For a reference and examples of using Azure Resource Manager templates to create role definitions, see [``Microsoft.DocumentDB`` ``databaseAccounts/sqlRoleDefinitions``](/azure/templates/microsoft.documentdb/2021-10-15/databaseaccounts/sqlroledefinitions).

## <a id="role-assignments"></a> Create role assignments

You can associate built-in or custom role definitions with your Azure AD identities. When creating a role assignment, you need to provide:

- The name of your Azure Cosmos DB account.
- The resource group containing your account.
- The ID of the role definition to assign.
- The principal ID of the identity that the role definition should be assigned to.
- The scope of the role assignment; supported scopes are:
  - `/` (account-level)
  - `/dbs/<database-name>` (database-level)
  - `/dbs/<database-name>/colls/<container-name>` (container-level)

  The scope must match or be a subscope of one of the role definition's assignable scopes.

> [!NOTE]
> If you want to create a role assignment for a service principal, make sure to use its **Object ID** as found in the **Enterprise applications** section of the **Azure Active Directory** portal blade.

> [!NOTE]
> The operations described are available in:
>
> - Azure PowerShell: [Az.CosmosDB version 1.2.0](https://www.powershellgallery.com/packages/Az.CosmosDB/1.2.0) or higher
> - [Azure CLI](/cli/azure/install-azure-cli): version 2.24.0 or higher
>

### Using Azure PowerShell

Assign a role to an identity:

```powershell
$resourceGroupName = "<myResourceGroup>"
$accountName = "<myCosmosAccount>"
$readOnlyRoleDefinitionId = "<roleDefinitionId>" # as fetched above
# For Service Principals make sure to use the Object ID as found in the Enterprise applications section of the Azure Active Directory portal blade.
$principalId = "<aadPrincipalId>"
New-AzCosmosDBSqlRoleAssignment -AccountName $accountName `
    -ResourceGroupName $resourceGroupName `
    -RoleDefinitionId $readOnlyRoleDefinitionId `
    -Scope "/" `
    -PrincipalId $principalId
```

### Using the Azure CLI

Assign a role to an identity:

```azurecli
resourceGroupName='<myResourceGroup>'
accountName='<myCosmosAccount>'
readOnlyRoleDefinitionId='<roleDefinitionId>' # as fetched above
# For Service Principals make sure to use the Object ID as found in the Enterprise applications section of the Azure Active Directory portal blade.
principalId='<aadPrincipalId>'
az cosmosdb sql role assignment create --account-name $accountName --resource-group $resourceGroupName --scope "/" --principal-id $principalId --role-definition-id $readOnlyRoleDefinitionId
```

### Using Bicep/Azure Resource Manager templates

For a built-in assignment using a Bicep template:

```
resource sqlRoleAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2023-04-15' = {
  name: guid(<roleDefinitionId>, <aadPrincipalId>, <databaseAccountResourceId>)
  parent: databaseAccount
  properties:{
    principalId: <aadPrincipalId>
    roleDefinitionId: '/${subscription().id}/resourceGroups/<databaseAccountResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>'
    scope: <databaseAccountResourceId>
  }
}
```

For a reference and examples of using Azure Resource Manager templates to create role assignments, see [``Microsoft.DocumentDB`` ``databaseAccounts/sqlRoleAssignments``](/azure/templates/microsoft.documentdb/2021-10-15/databaseaccounts/sqlroleassignments).

## Initialize the SDK with Azure AD

To use the Azure Cosmos DB role-based access control in your application, you have to update the way you initialize the Azure Cosmos DB SDK. Instead of passing your account's primary key, you have to pass an instance of a `TokenCredential` class. This instance provides the Azure Cosmos DB SDK with the context required to fetch an Azure AD token on behalf of the identity you wish to use.

The way you create a `TokenCredential` instance is beyond the scope of this article. There are many ways to create such an instance depending on the type of Azure AD identity you want to use (user principal, service principal, group etc.). Most importantly, your `TokenCredential` instance must resolve to the identity (principal ID) that you've assigned your roles to. You can find examples of creating a `TokenCredential` class:

- [In .NET](/dotnet/api/overview/azure/identity-readme#credential-classes)
- [In Java](/java/api/overview/azure/identity-readme#credential-classes)
- [In JavaScript](/javascript/api/overview/azure/identity-readme#credential-classes)
- [In Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#credential-classes)

The following examples use a service principal with a `ClientSecretCredential` instance.

### In .NET

The Azure Cosmos DB role-based access control is currently supported in the [.NET SDK V3](nosql/sdk-dotnet-v3.md).

```csharp
TokenCredential servicePrincipal = new ClientSecretCredential(
    "<azure-ad-tenant-id>",
    "<client-application-id>",
    "<client-application-secret>");
CosmosClient client = new CosmosClient("<account-endpoint>", servicePrincipal);
```

### In Java

The Azure Cosmos DB role-based access control is currently supported in the [Java SDK V4](nosql/sdk-java-v4.md).

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

### In JavaScript

The Azure Cosmos DB role-based access control is currently supported in the [JavaScript SDK V3](nosql/sdk-nodejs.md).

```javascript
const servicePrincipal = new ClientSecretCredential(
    "<azure-ad-tenant-id>",
    "<client-application-id>",
    "<client-application-secret>");
const client = new CosmosClient({
    endpoint: "<account-endpoint>",
    aadCredentials: servicePrincipal
});
```

### In Python

The Azure Cosmos DB role-based access control is supported in the [Python SDK versions 4.3.0b4](nosql/sdk-python.md) and higher.

```python
aad_credentials = ClientSecretCredential(
    tenant_id="<azure-ad-tenant-id>",
    client_id="<client-application-id>",
    client_secret="<client-application-secret>")
client = CosmosClient("<account-endpoint>", aad_credentials)
```

## Authenticate requests on the REST API

When constructing the [REST API authorization header](/rest/api/cosmos-db/access-control-on-cosmosdb-resources), set the **type** parameter to **aad** and the hash signature **(sig)** to the **OAuth token** as shown in the following example:

`type=aad&ver=1.0&sig=<token-from-oauth>`

## Use data explorer

> [!NOTE]
> The data explorer exposed in the Azure portal does not support the Azure Cosmos DB role-based access control yet. To use your Azure AD identity when exploring your data, you must use the [Azure Cosmos DB Explorer](https://cosmos.azure.com/?feature.enableAadDataPlane=true) instead.

When you access the [Azure Cosmos DB Explorer](https://cosmos.azure.com/?feature.enableAadDataPlane=true) with the specific `?feature.enableAadDataPlane=true` query parameter and sign in, the following logic is used to access your data:

1. A request to fetch the account's primary key is attempted on behalf of the identity signed in. If this request succeeds, the primary key is used to access the account's data.
1. If the identity signed in isn't allowed to fetch the account's primary key, this identity is directly used to authenticate data access. In this mode, the identity must be [assigned with proper role definitions](#role-assignments) to ensure data access.

## Audit data requests

[Diagnostic logs](monitor-resource-logs.md) get augmented with identity and authorization information for each data operation when using Azure Cosmos DB role-based access control. This augmentation lets you perform detailed auditing and retrieve the Azure AD identity used for every data request sent to your Azure Cosmos DB account.

This additional information flows in the **DataPlaneRequests** log category and consists of two extra columns:

- `aadPrincipalId_g` shows the principal ID of the Azure AD identity that was used to authenticate the request.
- `aadAppliedRoleAssignmentId_g` shows the [role assignment](#role-assignments) that was honored when authorizing the request.

## <a id="disable-local-auth"></a> Enforcing role-based access control as the only authentication method

In situations where you want to force clients to connect to Azure Cosmos DB through role-based access control exclusively, you can disable the account's primary/secondary keys. When doing so, any incoming request using either a primary/secondary key or a resource token is actively rejected.

### Use Azure Resource Manager templates

When creating or updating your Azure Cosmos DB account using Azure Resource Manager templates, set the `disableLocalAuth` property to `true`:

```json
"resources": [
    {
        "type": " Microsoft.DocumentDB/databaseAccounts",
        "properties": {
            "disableLocalAuth": true,
            // ...
        },
        // ...
    },
    // ...
 ]
```

## Limits

- You can create up to 100 role definitions and 2,000 role assignments per Azure Cosmos DB account.
- You can only assign role definitions to Azure AD identities belonging to the same Azure AD tenant as your Azure Cosmos DB account.
- Azure AD group resolution isn't currently supported for identities that belong to more than 200 groups.
- The Azure AD token is currently passed as a header with each individual request sent to the Azure Cosmos DB service, increasing the overall payload size.

## Frequently asked questions

This section includes frequently asked questions about role-based access control and Azure Cosmos DB.

### Which Azure Cosmos DB APIs support role-based access control?

The API for NoSQL is supported. Support for the API for MongoDB is in preview.

### Is it possible to manage role definitions and role assignments from the Azure portal?

Azure portal support for role management isn't available yet.

### Which SDKs in Azure Cosmos DB API for NoSQL support role-based access control?

The [.NET V3](nosql/sdk-dotnet-v3.md), [Java V4](nosql/sdk-java-v4.md), [JavaScript V3](nosql/sdk-nodejs.md) and [Python V4.3+](nosql/sdk-python.md) SDKs are currently supported.

### Is the Azure AD token automatically refreshed by the Azure Cosmos DB SDKs when it expires?

Yes.

### Is it possible to disable the usage of the account primary/secondary keys when using role-based access control?

Yes, see [Enforcing role-based access control as the only authentication method](#disable-local-auth).

## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](secure-access-to-data.md).
- Learn more about [role-based access control for Azure Cosmos DB management](role-based-access-control.md).
