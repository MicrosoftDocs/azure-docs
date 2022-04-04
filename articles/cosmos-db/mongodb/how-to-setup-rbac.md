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

## Available Privileges
#### Query and Write
* find
* insert
* remove
* update

#### Change Streams
* changeStream

#### Database Management
* createCollection
* createIndex 
* dropCollection
* killCursors
* killAnyCursor

#### Server Administration 
* dropDatabase
* dropIndex
* reIndex

#### Diagnostics
* collStats
* dbStats
* listDatabases
* listCollections
* listIndexes

## Built-in Roles
These roles already exist on every database and do not need to be created.

### read
Has the following privileges: changeStream, collStats, find, killCursors, listIndexes, listCollections

### readwrite
Has the following privileges: collStats, createCollection, dropCollection, createIndex, dropIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

### dbAdmin
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex

### dbOwner
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

## Azure CLI Setup 
We recommend using the cmd when using Windows.

1. Make sure you have latest CLI version(not extension) installed locally. try "az upgrade" command.
2. Check if you have dev extension version already installed. "az extension show -n cosmosdb-preview". If it shows your local version, remove it using the following command: "az extension remove -n cosmosdb-preview". It may ask you to remove it from python virtual env. If that's the case, launch your local cli extension python env and run "azdev extension remove cosmosdb-preview"(no -n here).
3. List the available extensions and make sure the list shows the preview version and corresponding "Compatible" flag is true.
4. Install the latest preview version: az extension add -n cosmosdb-preview
5. Check if the preview version is installed using this: az extension list
6. Connect to your subscription
```powershell
az cloud set -n  AzureCloud
az login
az account set --subscription <your subscription ID>
```
7. Create a new database account with the RBAC capability set to true. Your subscription must be allow-listed in order to create an account with the EnableMongoRoleBasedAccessControl capability. 
```powershell
az cosmosdb create -n <account_name> -g <azure_resource_group> --kind MongoDB --capabilities EnableMongoRoleBasedAccessControl
```
8. Create a database for users to connect to in the Azure Portal
9. Create an RBAC user with built-in read role
```powershell
az cosmosdb mongodb user definition create --account-name <YOUR_DB_ACCOUNT> --resource-group <YOUR_RG> --body {\"Id\":\"testdb.read\",\"UserName\":\"<YOUR_USERNAME>\",\"Password\":\"<YOUR_PASSWORD>\",\"DatabaseName\":\"<YOUR_DB_NAME>\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"read\",\"Db\":\"<YOUR_DB_NAME>\"}]}
```

## Powershell Quickstart
Coming soon.

## Authenticate using pymongo
Sending the appName parameter is required to authenticate as a user in the preview. Here is an example of how to do so:
```python
from pymongo import MongoClient
client = MongoClient("mongodb://<YOUR_HOSTNAME>:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000", username="<YOUR_USER>", password="<YOUR_PASSWORD>", authSource='<YOUR_DATABASE>', authMechanism='SCRAM-SHA-256', appName="<YOUR appName FROM CONNECTION STRING IN AZURE PORTAL>")
```

## RBAC Commands
The RBAC management commands will only work with a preview version of the Azure CLI or Powershell installed. See the Quickstarts above on how to get started. 

### CLI - Create Role Definition
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

### CLI - Create Role by passing JSON file body
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body role.json
```

### CLI - Update Role Definition
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

### CLI - Update Role by passing JSON file body
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body role.json
```

### CLI - List Roles
```powershell
az cosmosdb mongodb role definition list --account-name <account-name> --resource-group <resource-group-name>
```

### CLI - Check If Role Exists
```powershell
az cosmosdb mongodb role definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role
```
    
### CLI - Delete Role
```powershell
az cosmosdb mongodb role definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role
```
    
### Powershell - Create Privilege Resource
Note: First create PrivilegeResource then Privileges and then Roles.
```powershell
New-AzCosmosDBMongoDBPrivilegeResource -Database <String> -Collection <String>
```

### Powershell - Create Privilege
```powershell
New-AzCosmosDBMongoDBPrivilege -PrivilegeResource <PSMongoPrivilegeResource> -Action <String[]>
```

### Powershell - Create Roles List
```powershell
New-NewAzCosmosDBMongoDBRole -Role <String> [-Db <String>]
```

### Powershell - Create Role Definition
Note: Use Privilege and Roles created above to create a Role Definition
```powershell
New-AzCosmosDBMongoDBRoleDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -RoleName <String> -Type <String> -DatabaseName <String> -Privilege <PSMongoPrivilege[]> [-Role <PSMongoRole[]>]
```
    
### Powershell - Update Role Definition
```powershell
Update-AzCosmosDBMongoDBRoleDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -RoleName <String> -Type <String> -DatabaseName <String> -Privilege <PSMongoPrivilege[]> [-Role <PSMongoRole[]>]
```

### Powershell - List Roles
```powershell
Get-AzCosmosDBMongoDBRoleDefinition -Id <String> -ResourceGroupName <String> -AccountName <String>
```
    
### Powershell - Delete Role
```powershell
Remove-AzCosmosDBMongoDBRoleDefinition -AccountName <String> -ResourceGroupName <String> -Id <String>
```


### CLI - Create User Definition
```powershell
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
```

### CLI - Create User by passing JSON file body
```powershell
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body user.json
```

### CLI - Update User Definition
To update the user's password, send the new password in the password field. 

```powershell
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
```

### CLI - Update User by passing JSON file body
```powershell
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body user.json
```

### CLI - List Users
```powershell
az cosmosdb mongodb user definition list --account-name <account-name> --resource-group <resource-group-name>
```

### CLI - Check If User Exists
```powershell
az cosmosdb mongodb user definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.myName
```

### CLI - Delete User
```powershell
az cosmosdb mongodb user definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.myName
```

### Powershell - Create Roles List
Note: Role name should be a Valid existing role name.
```powershell
New-NewAzCosmosDBMongoDBRole -Role <String> [-Db <String>]
```

### Powershell - Create User Definition
Note: Use Roles created above to create a User Definition
```powershell
New-AzCosmosDBMongoDBUserDefinition -ResourceGroupName <String> -AccountName <String> -Id <String> -UserName <String> -Password <String> -Mechanism <String> [[CustomData <String>] -DatabaseName <String>] -Role <PSMongoRole[]>
```
    
### Powershell - Update existing User Definition
```powershell
Update-AzCosmosDBMongoDBUserDefinition -ResourceId <String> -Id <String> -UserName <String> -Password <String> -Mechanism <String> [-CustomData <String>] -DatabaseName <String> -Role <PSMongoRole[]>
```
### or
### The PSMongoDBUserDefinitionGetResults object is the response object of the Get-AzCosmosDBMongoDBUserDefinition call.
```powershell
Update-AzCosmosDBMongoDBUserDefinition -ResourceGroupName <String>] -AccountName <String> -InputObject <PSMongoDBUserDefinitionGetResults>
```

### Powershell - List Users
```powershell
Get-AzCosmosDBMongoDBUserDefinition -AccountName <String> -ResourceGroupName <String> -Id <String> -ResourceId <String>
```

### Powershell - Delete Role
```powershell
Remove-AzCosmosDBMongoDBUserDefinition -AccountName <String> -ResourceGroupName <String> -Id <String>
```

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

## Limitations

- The number of users + roles you can create must equal less than 10,000. 
- listCollections, listDatabases, killCursors are excluded from RBAC in the preview.
- Backup/Restore and Synapse link are not supported in the preview``
- Users and Roles across databases are not supported in the preview
- Users must connect with a tool that support the appName parameter in the preview. Mongo shell and many GUI tools are not supported in the preview. MongoDB drivers are supported.
- A user's password can only be set/reset by through the Azure CLI / PowerShell in the preview
- Configuring Users and Roles is only supported through Azure CLI / Powershell. 

## Frequently asked questions

### Which Azure Cosmos DB APIs are supported by RBAC?

The API for MongoDB (preview) and the SQL API.

### Is it possible to manage role definitions and role assignments from the Azure portal?

Azure portal support for role management is not available yet.

### Is it possible to disable the usage of the account primary/secondary keys when using RBAC?

Yes, see [Enforcing RBAC as the only authentication method](#disable-local-auth).

### How do I change a user's password?

Update the user definition with the new password.

## Next steps

- Get an overview of [secure access to data in Cosmos DB](secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](role-based-access-control.md).
