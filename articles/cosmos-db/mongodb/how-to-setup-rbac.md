---
title: Configure role-based access control for your Azure Cosmos DB API for MongoDB database
description: Learn how to configure native role-based access control in the API for MongoDB
author: gahl.levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/08/2021
ms.author: gahllevy
---

# Configure role-based access control for your Azure Cosmos DB API for MongoDB (preview)
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

> [!NOTE]
> This article is about role-based access control for data plane operations in Azure Cosmos DB. If you are using management plane operations, see [role-based access control](role-based-access-control.md) applied to your management plane operations article.

The API for MongoDB exposes a built-in role-based access control (RBAC) system that lets you authorize your data requests with a fine-grained, role-based permission model. Users are roles reside within a database and are managed using the Azure CLI, Azure Powershell, or ARM for this preview feature.

## Concepts

### Resource
A resource is a collection or database which we are applying access control rules to.

### Privileges
Privileges are actions that can be take on a specific resource. For example, read access to collection xyz. Privileges are assigned to a specific role.

### Role
A role has one or more privileges. Roles are assigned to users (zero or more) to enable them to perform the actions defined in those privileges. Roles are stored within a single database.

### Diagnostic log auditing
An additional column called "userId" has been added to the MongoRequests table in the Azure Portal Diagnostics feature. This column will identify which user performed which data plan operation. The value is in this column is empyty when RBAC is not enabled. 

## Concepts

## Create a role (CLI, PowerShell)
# CLI - Create Role Definition
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
# CLI - Create Role by passing JSON file body
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body role.json
    
# CLI - Update Role Definition
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
# CLI - Update Role by passing JSON file body
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body role.json

# CLI - List Roles
az cosmosdb mongodb role definition list --account-name <account-name> --resource-group <resource-group-name>

# CLI - Check If Role Exists
az cosmosdb mongodb role definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role
    
# CLI - Delete Role
az cosmosdb mongodb role definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role

    
# Powershell - Create Privilege Resource
# Note: First create PrivilegeResource then Privileges and then Roles.
New-AzCosmosDBMongoDBPrivilegeResource -Database <String> -Collection <String>

# Powershell - Create Privilege
New-AzCosmosDBMongoDBPrivilege -PrivilegeResource <PSMongoPrivilegeResource> -Action <String[]>

# Powershell - Create Roles List
New-NewAzCosmosDBMongoDBRole -Role <String> [-Db <String>]
    
# Powershell - Create Role Definition
# Note: Use Privilege and Roles created above to create a Role Definition
New-AzCosmosDBMongoDBRoleDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -RoleName <String> -Type <String> -DatabaseName <String> -Privilege <PSMongoPrivilege[]> [-Role <PSMongoRole[]>]
    
# Powershell - Update Role Definition
Update-AzCosmosDBMongoDBRoleDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -RoleName <String> -Type <String> -DatabaseName <String> -Privilege <PSMongoPrivilege[]> [-Role <PSMongoRole[]>]

# Powershell - List Roles
Get-AzCosmosDBMongoDBRoleDefinition -Id <String> -ResourceGroupName <String> -AccountName <String>
    
# Powershell - Delete Role
Remove-AzCosmosDBMongoDBRoleDefinition -AccountName <String> -ResourceGroupName <String> -Id <String>


## Create a user definition (CLI, PowerShell)
# CLI - Create User Definition
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
# CLI - Create User by passing JSON file body
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body user.json
    
# CLI - Update User Definition
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
# CLI - Update User by passing JSON file body
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body user.json

# CLI - List Users
az cosmosdb mongodb user definition list --account-name <account-name> --resource-group <resource-group-name>

# CLI - Check If User Exists
az cosmosdb mongodb user definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.myName
    
# CLI - Delete User
az cosmosdb mongodb user definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.myName
    

# Powershell - Create Roles List
# Note: Role name should be a Valid existing role name.
New-NewAzCosmosDBMongoDBRole -Role <String> [-Db <String>]
    
# Powershell - Create User Definition
# Note: Use Roles created above to create a User Definition
New-AzCosmosDBMongoDBUserDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -UserName <String> -Password <String> -Mechanism <String> [[CustomData <String>] -DatabaseName <String>] -Role <PSMongoRole[]>
    
# Powershell - Update existing User Definition
Update-AzCosmosDBMongoDBUserDefinition -ResourceId <String> -Id <String> -UserName <String> -Password <String> -Mechanism <String> [-CustomData <String>] -DatabaseName <String> -Role <PSMongoRole[]>
# or
# The PSMongoDBUserDefinitionGetResults object is the response object of the Get-AzCosmosDBMongoDBUserDefinition call.
Update-AzCosmosDBMongoDBUserDefinition -ResourceGroupName <String>] -AccountName <String> -InputObject <PSMongoDBUserDefinitionGetResults>

# Powershell - List Users
Get-AzCosmosDBMongoDBUserDefinition -AccountName <String> -ResourceGroupName <String> -Id <String> -ResourceId <String>
    
# Powershell - Delete Role
Remove-AzCosmosDBMongoDBUserDefinition -AccountName <String> -ResourceGroupName <String> -Id <String>

## <a id="disable-local-auth"></a> Enforcing RBAC as the only authentication method

In situations where you want to force clients to connect to Azure Cosmos DB through RBAC exclusively, you have the option to disable the account's primary/secondary keys. When doing so, any incoming request using either a primary/secondary key or a resource token will be actively rejected.

### Using Azure Resource Manager templates

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
- Azure AD group resolution is not currently supported for identities that belong to more than 200 groups.
- The Azure AD token is currently passed as a header with each individual request sent to the Azure Cosmos DB service, increasing the overall payload size.
- listCollections, listDatabases, killCursors are excluded from RBAC in the preview.

## Frequently asked questions

### Which Azure Cosmos DB APIs are supported by RBAC?

The API for MongoDB (preview) and the SQL API.

### Is it possible to manage role definitions and role assignments from the Azure portal?

Azure portal support for role management is not available yet.

### Is it possible to disable the usage of the account primary/secondary keys when using RBAC?

Yes, see [Enforcing RBAC as the only authentication method](#disable-local-auth).

## Next steps

- Get an overview of [secure access to data in Cosmos DB](secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](role-based-access-control.md).
