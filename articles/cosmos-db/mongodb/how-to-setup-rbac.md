---
title: Configure role-based access control for your Azure Cosmos DB API for MongoDB database (preview)
description: Learn how to configure native role-based access control in the API for MongoDB
author: gahl-levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/07/2022
ms.author: gahllevy
---

# Configure role-based access control for your Azure Cosmos DB API for MongoDB (preview)
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

This article is about role-based access control for data plane operations in Azure Cosmos DB API for MongoDB, currently in public preview. 

If you are using management plane operations, see [role-based access control](../role-based-access-control.md) applied to your management plane operations article.

The API for MongoDB exposes a built-in role-based access control (RBAC) system that lets you authorize your data requests with a fine-grained, role-based permission model. Users and roles reside within a database and are managed using the Azure CLI, Azure PowerShell, or ARM for this preview feature.

## Concepts

### Resource
A resource is a collection or database to which we are applying access control rules.

### Privileges
Privileges are actions that can be performed on a specific resource. For example, "read access to collection xyz". Privileges are assigned to a specific role.

### Role
A role has one or more privileges. Roles are assigned to users (zero or more) to enable them to perform the actions defined in those privileges. Roles are stored within a single database.

### Diagnostic log auditing
An additional column called `userId` has been added to the `MongoRequests` table in the Azure portal Diagnostics feature. This column will identify which user performed which data plan operation. The value in this column is empty when RBAC is not enabled. 

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

### readWrite
Has the following privileges: collStats, createCollection, dropCollection, createIndex, dropIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

### dbAdmin
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex

### dbOwner
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

## Azure CLI Setup 
We recommend using the cmd when using Windows.

1. Make sure you have latest CLI version(not extension) installed locally. try `az upgrade` command.
2. Check if you have dev extension version already installed: `az extension show -n cosmosdb-preview`. If it shows your local version, remove it using the following command: `az extension remove -n cosmosdb-preview`. It may ask you to remove it from python virtual env. If that's the case, launch your local CLI extension python env and run `azdev extension remove cosmosdb-preview` (no -n here).
3. List the available extensions and make sure the list shows the preview version and corresponding "Compatible" flag is true.
4. Install the latest preview version: `az extension add -n cosmosdb-preview`.
5. Check if the preview version is installed using this: `az extension list`.
6. Connect to your subscription.
```powershell
az cloud set -n  AzureCloud
az login
az account set --subscription <your subscription ID>
```
7. Enable the RBAC capability on your existing API for MongoDB database account. You'll need to [add the capability](how-to-configure-capabilities.md) "EnableMongoRoleBasedAccessControl" to your database account. 
If you prefer a new database account instead, create a new database account with the RBAC capability set to true.
```powershell
az cosmosdb create -n <account_name> -g <azure_resource_group> --kind MongoDB --capabilities EnableMongoRoleBasedAccessControl
```
8. Create a database for users to connect to in the Azure portal.
9. Create an RBAC user with built-in read role.
```powershell
az cosmosdb mongodb user definition create --account-name <YOUR_DB_ACCOUNT> --resource-group <YOUR_RG> --body {\"Id\":\"<YOUR_DB_NAME>.<YOUR_USERNAME>\",\"UserName\":\"<YOUR_USERNAME>\",\"Password\":\"<YOUR_PASSWORD>\",\"DatabaseName\":\"<YOUR_DB_NAME>\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"read\",\"Db\":\"<YOUR_DB_NAME>\"}]}
```


## Authenticate using pymongo
Sending the appName parameter is required to authenticate as a user in the preview. Here is an example of how to do so:
```python
from pymongo import MongoClient
client = MongoClient("mongodb://<YOUR_HOSTNAME>:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000", username="<YOUR_USER>", password="<YOUR_PASSWORD>", authSource='<YOUR_DATABASE>', authMechanism='SCRAM-SHA-256', appName="<YOUR appName FROM CONNECTION STRING IN AZURE PORTAL>")
```

## Azure CLI RBAC Commands
The RBAC management commands will only work with a preview version of the Azure CLI installed. See the Quickstart above on how to get started. 

#### Create Role Definition
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

#### Create Role by passing JSON file body
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body role.json
```

#### Update Role Definition
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

#### Update role by passing JSON file body
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body role.json
```

#### List roles
```powershell
az cosmosdb mongodb role definition list --account-name <account-name> --resource-group <resource-group-name>
```

#### Check if role exists
```powershell
az cosmosdb mongodb role definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role
```
    
#### Delete role
```powershell
az cosmosdb mongodb role definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.My_Read_Only_Role
```

#### Create user definition
```powershell
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
```

#### Create user by passing JSON file body
```powershell
az cosmosdb mongodb user definition create --account-name <account-name> --resource-group <resource-group-name> --body user.json
```

#### Update user definition
To update the user's password, send the new password in the password field. 

```powershell
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.myName\",\"UserName\":\"myName\",\"Password\":\"pass\",\"DatabaseName\":\"test\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"My_Read_Only_Role101\",\"Db\":\"test\"}]}
```

#### Update user by passing JSON file body
```powershell
az cosmosdb mongodb user definition update --account-name <account-name> --resource-group <resource-group-name> --body user.json
```

#### List users
```powershell
az cosmosdb mongodb user definition list --account-name <account-name> --resource-group <resource-group-name>
```

#### Check if user exists
```powershell
az cosmosdb mongodb user definition exists --account-name <account-name> --resource-group <resource-group-name> --id test.myName
```

#### Delete user
```powershell
az cosmosdb mongodb user definition delete --account-name <account-name> --resource-group <resource-group-name> --id test.myName
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
        },
    },
 ]
```

## Limitations

- The number of users and roles you can create must equal less than 10,000. 
- The commands listCollections, listDatabases, killCursors, and currentOp are excluded from RBAC in the preview.
- Backup/Restore is not supported in the preview.
- [Azure Synapse Link for Azure Cosmos DB](../synapse-link.md) is not supported in the preview.
- Users and Roles across databases are not supported in the preview.
- Users must connect with a tool that support the appName parameter in the preview. Mongo shell and many GUI tools are not supported in the preview. MongoDB drivers are supported.
- A user's password can only be set/reset by through the Azure CLI / PowerShell in the preview.
- Configuring Users and Roles is only supported through Azure CLI / PowerShell. 

## Frequently asked questions (FAQs)

### Which Azure Cosmos DB APIs are supported by RBAC?

The API for MongoDB (preview) and the SQL API.

### Is it possible to manage role definitions and role assignments from the Azure portal?

Azure portal support for role management is not available yet.

### Is it possible to disable the usage of the account primary/secondary keys when using RBAC?

Yes, see [Enforcing RBAC as the only authentication method](#disable-local-auth).

### How do I change a user's password?

Update the user definition with the new password.

## Next steps

- Get an overview of [secure access to data in Cosmos DB](../secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](../role-based-access-control.md).
