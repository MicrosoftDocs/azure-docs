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
# Abhijit

## Assign privileges to a role
# Abhijit

## Create a user
# Abhijit

## Assign roles to a user
# Abhijit

## Delete a role or user
# Abhijit

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
