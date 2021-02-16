---
title: Learn how to secure access to data in Azure Cosmos DB
description: Learn about access control concepts in Azure Cosmos DB, including primary keys, read-only keys, users, and permissions.
author: thomasweiss
ms.author: thweiss
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 02/11/2021
ms.custom: devx-track-csharp

---
# Secure access to data in Azure Cosmos DB
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article provides an overview of data access control in Azure Cosmos DB.

Azure Cosmos DB provides three ways to control access to your data.

| Access control type | Characteristics |
|---|---|
| [Primary keys](#primary-keys) | Shared secret allowing any management or data operation. It comes in both read-write and read-only variants. |
| [Role-based access control](#rbac) (Preview) | Fine-grained, role-based permission model using Azure Active Directory (AAD) identities for authentication. |
| [Resource tokens](#resource-tokens)| Fine-grained permission model based on native Azure Cosmos DB users and permissions. |

## <a id="primary-keys"></a> Primary keys

Primary keys provide access to all the administrative resources for the database account. Each account consists of two primary keys: a primary key and secondary key. The purpose of dual keys is to let you regenerate, or roll keys, providing continuous access to your account and data. To learn more about primary keys, see the [Database security](database-security.md#primary-keys) article.

### <a id="key-rotation"></a> Key rotation

The process of rotating your primary key is simple. 

1. Navigate to the Azure portal to retrieve your secondary key.
2. Replace your primary key with your secondary key in your application. Make sure that all the Cosmos DB clients across all the deployments are promptly restarted and will start using the updated key.
3. Rotate the primary key in the Azure portal.
4. Validate the new primary key works against all resource. Key rotation process can take anywhere from less than a minute to hours depending on the size of the Cosmos DB account.
5. Replace the secondary key with the new primary key.

:::image type="content" source="./media/secure-access-to-data/nosql-database-security-master-key-rotate-workflow.png" alt-text="Primary key rotation in the Azure portal - demonstrating NoSQL database security" border="false":::

### Code sample to use a primary key

The following code sample illustrates how to use a Cosmos DB account endpoint and primary key to instantiate a DocumentClient and create a database:

```csharp
//Read the Azure Cosmos DB endpointUrl and authorization keys from config.
//These values are available from the Azure portal on the Azure Cosmos DB account blade under "Keys".
//Keep these values in a safe and secure location. Together they provide Administrative access to your Azure Cosmos DB account.

private static readonly string endpointUrl = ConfigurationManager.AppSettings["EndPointUrl"];
private static readonly string authorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];

CosmosClient client = new CosmosClient(endpointUrl, authorizationKey);
```

The following code sample illustrates how to use the Azure Cosmos DB account endpoint and primary key to instantiate a `CosmosClient` object:

:::code language="python" source="~/cosmosdb-python-sdk/sdk/cosmos/azure-cosmos/samples/access_cosmos_with_resource_token.py" id="configureConnectivity":::

## <a id="rbac"></a> Role-based access control (Preview)

Azure Cosmos DB exposes a built-in role-based access control (RBAC) system that lets you:

- Authenticate your data requests with an Azure Active Directory (AAD) identity.
- Authorize your data requests with a fine-grained, role-based permission model.

Azure Cosmos DB RBAC is the ideal access control method in situations where:

- You don't want to use a shared secret like the primary key, and prefer to rely on a token-based authentication mechanism,
- You want to use Azure AD identities to authenticate your requests,
- You need a fine-grained permission model to tightly restrict which database operations your identities are allowed to perform,
- You wish to materialize your access control policies as "roles" that you can assign to multiple identities.

See [Configure role-based access control for your Azure Cosmos DB account](how-to-setup-rbac.md) to learn more about Azure Cosmos DB RBAC.

## <a id="resource-tokens"></a> Resource tokens

Resource tokens provide access to the application resources within a database. Resource tokens:

- Provide access to specific containers, partition keys, documents, attachments, stored procedures, triggers, and UDFs.
- Are created when a [user](#users) is granted [permissions](#permissions) to a specific resource.
- Are recreated when a permission resource is acted upon on by POST, GET, or PUT call.
- Use a hash resource token specifically constructed for the user, resource, and permission.
- Are time bound with a customizable validity period. The default valid time span is one hour. Token lifetime, however, may be explicitly specified, up to a maximum of five hours.
- Provide a safe alternative to giving out the primary key.
- Enable clients to read, write, and delete resources in the Cosmos DB account according to the permissions they've been granted.

You can use a resource token (by creating Cosmos DB users and permissions) when you want to provide access to resources in your Cosmos DB account to a client that cannot be trusted with the primary key.  

Cosmos DB resource tokens provide a safe alternative that enables clients to read, write, and delete resources in your Cosmos DB account according to the permissions you've granted, and without need for either a primary or read only key.

Here is a typical design pattern whereby resource tokens may be requested, generated, and delivered to clients:

1. A mid-tier service is set up to serve a mobile application to share user photos.
2. The mid-tier service possesses the primary key of the Cosmos DB account.
3. The photo app is installed on end-user mobile devices.
4. On login, the photo app establishes the identity of the user with the mid-tier service. This mechanism of identity establishment is purely up to the application.
5. Once the identity is established, the mid-tier service requests permissions based on the identity.
6. The mid-tier service sends a resource token back to the phone app.
7. The phone app can continue to use the resource token to directly access Cosmos DB resources with the permissions defined by the resource token and for the interval allowed by the resource token.
8. When the resource token expires, subsequent requests receive a 401 unauthorized exception.  At this point, the phone app re-establishes the identity and requests a new resource token.

    :::image type="content" source="./media/secure-access-to-data/resourcekeyworkflow.png" alt-text="Azure Cosmos DB resource tokens workflow" border="false":::

Resource token generation and management are handled by the native Cosmos DB client libraries; however, if you use REST you must construct the request/authentication headers. For more information on creating authentication headers for REST, see [Access Control on Cosmos DB Resources](/rest/api/cosmos-db/access-control-on-cosmosdb-resources) or the source code for our [.NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos/src/Authorization/AuthorizationHelper.cs) or [Node.js SDK](https://github.com/Azure/azure-cosmos-js/blob/master/src/auth.ts).

For an example of a middle tier service used to generate or broker resource tokens, see the [ResourceTokenBroker app](https://github.com/Azure/azure-cosmos-dotnet-v2/tree/master/samples/xamarin/UserItems/ResourceTokenBroker/ResourceTokenBroker/Controllers).

### Users<a id="users"></a>

Azure Cosmos DB users are associated with a Cosmos database.  Each database can contain zero or more Cosmos DB users. The following code sample shows how to create a Cosmos DB user  using the [Azure Cosmos DB .NET SDK v3](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/UserManagement).

```csharp
//Create a user.
Database database = benchmark.client.GetDatabase("SalesDatabase");

User user = await database.CreateUserAsync("User 1");
```

> [!NOTE]
> Each Cosmos DB user has a ReadAsync() method that can be used to retrieve the list of [permissions](#permissions) associated with the user.

### Permissions<a id="permissions"></a>

A permission resource is associated with a user and assigned at the container as well as partition key level. Each user may contain zero or more permissions. A permission resource provides access to a security token that the user needs when trying to access a specific container or data in a specific partition key. There are two available access levels that may be provided by a permission resource:

- All: The user has full permission on the resource.
- Read: The user can only read the contents of the resource but cannot perform write, update, or delete operations on the resource.

> [!NOTE]
> In order to run stored procedures the user must have the All permission on the container in which the stored procedure will be run.

If you enable the [diagnostic logs on data-plane requests](cosmosdb-monitor-resource-logs.md), the following two properties corresponding to the permission are logged:

* **resourceTokenPermissionId** - This property indicates the resource token permission Id that you have specified. 

* **resourceTokenPermissionMode** - This property indicates the permission mode that you have set when creating the resource token. The permission mode can have values such as "all" or "read".

#### Code sample to create permission

The following code sample shows how to create a permission resource, read the resource token of the permission resource, and associate the permissions with the [user](#users) created above.

```csharp
// Create a permission on a container and specific partition key value
Container container = client.GetContainer("SalesDatabase", "OrdersContainer");
user.CreatePermissionAsync(
    new PermissionProperties(
        id: "permissionUser1Orders",
        permissionMode: PermissionMode.All,
        container: benchmark.container,
        resourcePartitionKey: new PartitionKey("012345")));
```

#### Code sample to read permission for user

The following code snippet shows how to retrieve the permission associated with the user created above and instantiate a new CosmosClient on behalf of the user, scoped to a single partition key.

```csharp
//Read a permission, create user client session.
PermissionProperties permissionProperties = await user.GetPermission("permissionUser1Orders")

CosmosClient client = new CosmosClient(accountEndpoint: "MyEndpoint", authKeyOrResourceToken: permissionProperties.Token);
```

## Differences between RBAC and resource tokens

| Subject | RBAC | Resource tokens |
|--|--|--|
| Authentication  | With Azure Active Directory (Azure AD). | Based on the native Azure Cosmos DB users<br>Integrating resource tokens with Azure AD requires extra work to bridge Azure AD identities and Azure Cosmos DB users. |
| Authorization | Role-based: role definitions map allowed actions and can be assigned to multiple identities. | Permission-based: for each Azure Cosmos DB user, you need to assign data access permissions. |
| Token scope | An AAD token carries the identity of the requester. This identity is matched against all assigned role definitions to perform authorization. | A resource token carries the permission granted to a specific Azure Cosmos DB user on a specific Azure Cosmos DB resource. Authorization requests on different resources may requires different tokens. |
| Token refresh | The AAD token is automatically refreshed by the Azure Cosmos DB SDKs when it expires. | Resource token refresh is not supported. When a resource token expires, a new one needs to be issued. |

## Add users and assign roles

To add Azure Cosmos DB account reader access to your user account, have a subscription owner perform the following steps in the Azure portal.

1. Open the Azure portal, and select your Azure Cosmos DB account.
2. Click the **Access control (IAM)** tab, and then click  **+ Add role assignment**.
3. In the **Add role assignment** pane, in the **Role** box, select **Cosmos DB Account Reader Role**.
4. In the **Assign access to box**, select **Azure AD user, group, or application**.
5. Select the user, group, or application in your directory to which you wish to grant access.  You can search the directory by display name, email address, or object identifiers.
    The selected user, group, or application appears in the selected members list.
6. Click **Save**.

The entity can now read Azure Cosmos DB resources.

## Delete or export user data

As a database service, Azure Cosmos DB enables you to search, select, modify and delete any data located in your database or containers. It is however your responsibility to use the provided APIs and define logic required to find and erase any personal data if needed. Each multi-model API (SQL, MongoDB, Gremlin, Cassandra, Table) provides different language SDKs that contain methods to search and delete data based on custom predicates. You can also enable the [time to live (TTL)](time-to-live.md) feature to delete data automatically after a specified period, without incurring any additional cost.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

- To learn more about Cosmos database security, see [Cosmos DB Database security](database-security.md).
- To learn how to construct Azure Cosmos DB authorization tokens, see [Access Control on Azure Cosmos DB Resources](/rest/api/cosmos-db/access-control-on-cosmosdb-resources).
- User management samples with users and permissions, [.NET SDK v3 user management samples](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/UserManagement/UserManagementProgram.cs)
