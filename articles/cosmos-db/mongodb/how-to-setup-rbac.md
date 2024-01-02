---
title: Configure role-based access control in Azure Cosmos DB for MongoDB database
description: Learn how to configure native role-based access control in Azure Cosmos DB for MongoDB
author: gahl-levy
ms.service: cosmos-db
ms.custom: ignite-2022, devx-track-azurecli, devx-track-extended-java, devx-track-js
ms.topic: how-to
ms.date: 09/26/2022
ms.author: gahllevy
ms.subservice: mongodb
---

# Configure role-based access control in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article is about role-based access control for data plane operations in Azure Cosmos DB for MongoDB.

If you're using management plane operations, see [role-based access control](../role-based-access-control.md) applied to your management plane operations article.

Azure Cosmos DB for MongoDB exposes a built-in role-based access control (RBAC) system that lets you authorize your data requests with a fine-grained, role-based permission model. Users and roles reside within a database and are managed using the Azure CLI, Azure PowerShell, or Azure Resource Manager (ARM).

## Concepts

### Resource
A resource is a collection or database to which we're applying access control rules.

### Privileges
Privileges are actions that can be performed on a specific resource. For example, "read access to collection xyz". Privileges are assigned to a specific role.

### Role
A role has one or more privileges. Roles are assigned to users (zero or more) to enable them to perform the actions defined in those privileges. Roles are stored within a single database.

### Diagnostic log auditing
Another column called `userId` has been added to the `MongoRequests` table in the Azure Portal Diagnostics feature. This column identifies which user performed which data plan operation. The value in this column is empty when RBAC isn't enabled. 

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
These roles already exist on every database and don't need to be created.

### read
Has the following privileges: changeStream, collStats, find, killCursors, listIndexes, listCollections

### readWrite
Has the following privileges: collStats, createCollection, dropCollection, createIndex, dropIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

### dbAdmin
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex

### dbOwner
Has the following privileges: collStats, createCollection, createIndex, dbStats, dropCollection, dropDatabase, dropIndex, listCollections, listIndexes, reIndex, find, insert, killCursors, listIndexes, listCollections, remove, update

## Azure CLI Setup (Quickstart)
We recommend using the cmd when using Windows.

1. Make sure you have latest CLI version(not extension) installed locally. try `az upgrade` command.
2. Connect to your subscription.
```powershell
az cloud set -n  AzureCloud
az login
az account set --subscription <your subscription ID>
```
3. Enable the RBAC capability on your existing API for MongoDB database account. You need to [add the capability](how-to-configure-capabilities.md) "EnableMongoRoleBasedAccessControl" to your database account. RBAC can also be enabled via the features tab in the Azure portal instead. 
If you prefer a new database account instead, create a new database account with the RBAC capability set to true.
```powershell
az cosmosdb create -n <account_name> -g <azure_resource_group> --kind MongoDB --capabilities EnableMongoRoleBasedAccessControl
```
4. Create a database for users to connect to in the Azure portal.
5. Create an RBAC user with built-in read role.
```powershell
az cosmosdb mongodb user definition create --account-name <YOUR_DB_ACCOUNT> --resource-group <YOUR_RG> --body {\"Id\":\"<YOUR_DB_NAME>.<YOUR_USERNAME>\",\"UserName\":\"<YOUR_USERNAME>\",\"Password\":\"<YOUR_PASSWORD>\",\"DatabaseName\":\"<YOUR_DB_NAME>\",\"CustomData\":\"Some_Random_Info\",\"Mechanisms\":\"SCRAM-SHA-256\",\"Roles\":[{\"Role\":\"read\",\"Db\":\"<YOUR_DB_NAME>\"}]}
```

## Authenticate using pymongo
```python
from pymongo import MongoClient
client = MongoClient("mongodb://<YOUR_HOSTNAME>:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000", username="<YOUR_USER>", password="<YOUR_PASSWORD>", authSource='<YOUR_DATABASE>', authMechanism='SCRAM-SHA-256', appName="<YOUR appName FROM CONNECTION STRING IN AZURE PORTAL>")
```

## Authenticate using Node.js driver
```javascript
connectionString = "mongodb://" + "<YOUR_USER>" + ":" + "<YOUR_PASSWORD>" + "@" + "<YOUR_HOSTNAME>" + ":10255/" + "<YOUR_DATABASE>" +"?ssl=true&retrywrites=false&replicaSet=globaldb&authmechanism=SCRAM-SHA-256&appname=@" + "<YOUR appName FROM CONNECTION STRING IN AZURE PORTAL>" + "@";
var client = await mongodb.MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
```

## Authenticate using Java driver
```java
connectionString = "mongodb://" + "<YOUR_USER>" + ":" + "<YOUR_PASSWORD>" + "@" + "<YOUR_HOSTNAME>" + ":10255/" + "<YOUR_DATABASE>" +"?ssl=true&retrywrites=false&replicaSet=globaldb&authmechanism=SCRAM-SHA-256&appname=@" + "<YOUR appName FROM CONNECTION STRING IN AZURE PORTAL>" + "@";
MongoClientURI uri = new MongoClientURI(connectionString);
MongoClient client = new MongoClient(uri);
```

## Authenticate using Mongosh
```powershell
mongosh --authenticationDatabase <YOUR_DB> --authenticationMechanism SCRAM-SHA-256 "mongodb://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_HOST>:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000"
```

## Azure CLI RBAC Commands
The RBAC management commands will only work with newer versions of the Azure CLI installed. See the Quickstart above on how to get started. 

#### Create Role Definition
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

#### Create Role by passing JSON file body
```powershell
az cosmosdb mongodb role definition create --account-name <account-name> --resource-group <resource-group-name> --body role.json
```
##### JSON file
```json
{
	"Id": "test.My_Read_Only_Role101",
	"RoleName": "My_Read_Only_Role101",
	"Type": "CustomRole",
	"DatabaseName": "test",
	"Privileges": [{
		"Resource": {
			"Db": "test",
			"Collection": "test"
		},
		"Actions": ["insert", "find"]
	}],
	"Roles": []
}
```

#### Update Role Definition
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body {\"Id\":\"test.My_Read_Only_Role101\",\"RoleName\":\"My_Read_Only_Role101\",\"Type\":\"CustomRole\",\"DatabaseName\":\"test\",\"Privileges\":[{\"Resource\":{\"Db\":\"test\",\"Collection\":\"test\"},\"Actions\":[\"insert\",\"find\"]}],\"Roles\":[]}
```

#### Update role by passing JSON file body
```powershell
az cosmosdb mongodb role definition update --account-name <account-name> --resource-group <resource-group-name> --body role.json
```
##### JSON file
```json
{
	"Id": "test.My_Read_Only_Role101",
	"RoleName": "My_Read_Only_Role101",
	"Type": "CustomRole",
	"DatabaseName": "test",
	"Privileges": [{
		"Resource": {
			"Db": "test",
			"Collection": "test"
		},
		"Actions": ["insert", "find"]
	}],
	"Roles": []
}
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
##### JSON file
```json
{
	"Id": "test.myName",
	"UserName": "myName",
	"Password": "pass",
	"DatabaseName": "test",
	"CustomData": "Some_Random_Info",
	"Mechanisms": "SCRAM-SHA-256",
	"Roles": [{
		"Role": "My_Read_Only_Role101",
		"Db": "test"
	}]
}
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
##### JSON file
```json
{
	"Id": "test.myName",
	"UserName": "myName",
	"Password": "pass",
	"DatabaseName": "test",
	"CustomData": "Some_Random_Info",
	"Mechanisms": "SCRAM-SHA-256",
	"Roles": [{
		"Role": "My_Read_Only_Role101",
		"Db": "test"
	}]
}
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

## Limitations

- The number of users and roles you can create must equal less than 10,000. 
- The commands listCollections, listDatabases, killCursors, and currentOp are excluded from RBAC.
- Users and Roles across databases aren't supported.
- A user's password can only be set/reset by through the Azure CLI / Azure PowerShell.
- Configuring Users and Roles is only supported through Azure CLI / PowerShell. 
- Disabling primary/secondary key authentication isn't supported. We recommend rotating your keys to prevent access when enabling RBAC.
- RBAC policies for Cosmos DB for Mongo DB RU won't be automatically reinstated following a restore operation. You'll be required to reconfigure these policies after the restoration process is complete.

## Frequently asked questions (FAQs)

### Is it possible to manage role definitions and role assignments from the Azure portal?

Azure portal support for role management isn't available. However, RBAC can be enabled via the features tab in the Azure portal.

### How do I change a user's password?

Update the user definition with the new password.

### What Cosmos DB for MongoDB versions support role-based access control (RBAC)?

Versions 3.6 and higher support RBAC.

## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](../secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](../role-based-access-control.md).
