---
title: Learn how to secure access to data in Azure Cosmos DB
description: Learn about access control concepts in Azure Cosmos DB, including primary keys, read-only keys, users, and permissions.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/26/2022
ms.custom: devx-track-csharp, subject-rbac-steps, ignite-2022
---
# Secure access to data in Azure Cosmos DB
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

This article provides an overview of data access control in Azure Cosmos DB.

Azure Cosmos DB provides three ways to control access to your data.

| Access control type | Characteristics |
|---|---|
| [Primary/secondary keys](#primary-keys) | Shared secret allowing any management or data operation. It comes in both read-write and read-only variants. |
| [Role-based access control (RBAC)](#rbac) | Fine-grained, role-based permission model using Microsoft Entra identities for authentication. |
| [Resource tokens](#resource-tokens)| Fine-grained permission model based on native Azure Cosmos DB users and permissions. |

## <a id="primary-keys"></a> Primary/secondary keys

Primary/secondary keys provide access to all the administrative resources for the database account. Each account consists of two keys: a primary key and secondary key. The purpose of dual keys is to let you regenerate, or roll, keys, providing continuous access to your account and data. To learn more about primary/secondary keys, see [Overview of database security in Azure Cosmos DB](database-security.md#primary-keys).

To see your account keys, on the left menu select **Keys**. Then, select the **View** icon at the right of each key. Select the **Copy** button to copy the selected key. You can hide them afterwards by selecting the same icon per key, which updates the icon to a **Hide** button.

:::image type="content" source="./media/database-security/view-account-key.png" alt-text="Screenshot of the View account key for Azure Cosmos DB.":::

### <a id="key-rotation"></a> Key rotation and regeneration

> [!NOTE]
> The following section describes the steps to rotate and regenerate keys for the API for NoSQL. If you're using a different API, see the [API for MongoDB](database-security.md?tabs=mongo-api#key-rotation), [API for Cassandra](database-security.md?tabs=cassandra-api#key-rotation), [API for Gremlin](database-security.md?tabs=gremlin-api#key-rotation), or [API for Table](database-security.md?tabs=table-api#key-rotation) sections.
>
> To monitor your account for key updates and key regeneration, see [Monitor your Azure Cosmos DB account for key updates and key regeneration](monitor-account-key-updates.md).

The process of key rotation and regeneration is simple. First, make sure that *your application is consistently using either the primary key or the secondary key* to access your Azure Cosmos DB account. Then, follow the steps in the next section.

# [If your application is currently using the primary key](#tab/using-primary-key)

1. Go to your Azure Cosmos DB account in the Azure portal.

1. Select **Keys** on the left menu and then select **Regenerate Secondary Key** from the ellipsis on the right of your secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key.png" alt-text="Screenshot that shows the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key.png" alt-text="Screenshot that shows the Azure portal showing how to regenerate the primary key." border="true":::

# [If your application is currently using the secondary key](#tab/using-secondary-key)

1. Go to your Azure Cosmos DB account in the Azure portal.

1. Select **Keys** on the left menu and then select **Regenerate Primary Key** from the ellipsis on the right of your primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key.png" alt-text="Screenshot that shows the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key.png" alt-text="Screenshot that shows the Azure portal showing how to regenerate the secondary key." border="true":::

---

### Code sample to use a primary key

The following code sample illustrates how to use an Azure Cosmos DB account endpoint and primary key to instantiate a `CosmosClient`:

```csharp
// Read the Azure Cosmos DB endpointUrl and authorization keys from config.
// These values are available from the Azure portal on the Azure Cosmos DB account blade under "Keys".
// Keep these values in a safe and secure location. Together they provide Administrative access to your Azure Cosmos DB account.

private static readonly string endpointUrl = ConfigurationManager.AppSettings["EndPointUrl"];
private static readonly string authorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];

CosmosClient client = new CosmosClient(endpointUrl, authorizationKey);
```

## <a id="rbac"></a> Role-based access control

Azure Cosmos DB exposes a built-in RBAC system that lets you:

- Authenticate your data requests with a Microsoft Entra identity.
- Authorize your data requests with a fine-grained, role-based permission model.

Azure Cosmos DB RBAC is the ideal access control method in situations where:

- You don't want to use a shared secret like the primary key and prefer to rely on a token-based authentication mechanism.
- You want to use Microsoft Entra identities to authenticate your requests.
- You need a fine-grained permission model to tightly restrict which database operations your identities are allowed to perform.
- You want to materialize your access control policies as "roles" that you can assign to multiple identities.

To learn more about Azure Cosmos DB RBAC, see [Configure role-based access control for your Azure Cosmos DB account](how-to-setup-rbac.md).

For information and sample code to configure RBAC for the Azure Cosmos DB for MongoDB, see [Configure role-based access control for your Azure Cosmos DB for MongoDB](mongodb/how-to-setup-rbac.md).

## <a id="resource-tokens"></a> Resource tokens

Resource tokens provide access to the application resources within a database. Resource tokens:

- Provide access to specific containers, partition keys, documents, and attachments.
- Are created when a [user](#users) is granted [permissions](#permissions) to a specific resource.
- Are re-created when a permission resource is acted upon by a POST, GET, or PUT call.
- Use a hash resource token specifically constructed for the user, resource, and permission.
- Are time bound with a customizable validity period. The default valid time span is one hour. Token lifetime, however, might be explicitly specified, up to a maximum of 24 hours.
- Provide a safe alternative to giving out the primary key.
- Enable clients to read, write, and delete resources in the Azure Cosmos DB account according to the permissions they were granted.

You can use a resource token (by creating Azure Cosmos DB users and permissions) when you want to provide access to resources in your Azure Cosmos DB account to a client that can't be trusted with the primary key.  

Azure Cosmos DB resource tokens provide a safe alternative that enables clients to read, write, and delete resources in your Azure Cosmos DB account according to the permissions you were granted, and without need for either a primary or read-only key.

Here's a typical design pattern whereby resource tokens can be requested, generated, and delivered to clients:

1. A mid-tier service is set up to serve a mobile application to share user photos.
1. The mid-tier service possesses the primary key of the Azure Cosmos DB account.
1. The photo app is installed on user mobile devices.
1. On sign-in, the photo app establishes the identity of the user with the mid-tier service. This mechanism of identity establishment is purely up to the application.
1. After the identity is established, the mid-tier service requests permissions based on the identity.
1. The mid-tier service sends a resource token back to the phone app.
1. The phone app can continue to use the resource token to directly access Azure Cosmos DB resources with the permissions defined by the resource token and for the interval allowed by the resource token.
1. When the resource token expires, subsequent requests receive a 401 unauthorized exception. At this point, the phone app reestablishes the identity and requests a new resource token.

    :::image type="content" source="./media/secure-access-to-data/resourcekeyworkflow.png" alt-text="Screenshot that shows an Azure Cosmos DB resource tokens workflow." border="false":::

Resource token generation and management are handled by the native Azure Cosmos DB client libraries. However, if you use REST, you must construct the request/authentication headers. For more information on creating authentication headers for REST, see [Access control on Azure Cosmos DB resources](/rest/api/cosmos-db/access-control-on-cosmosdb-resources) or the source code for our [.NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos/src/Authorization/AuthorizationHelper.cs) or [Node.js SDK](https://github.com/Azure/azure-cosmos-js/blob/master/src/auth.ts).

For an example of a middle-tier service used to generate or broker resource tokens, see the [ResourceTokenBroker app](https://github.com/Azure/azure-cosmos-dotnet-v2/tree/master/samples/xamarin/UserItems/ResourceTokenBroker/ResourceTokenBroker/Controllers).

### Users<a id="users"></a>

Azure Cosmos DB users are associated with an Azure Cosmos DB database. Each database can contain zero or more Azure Cosmos DB users. The following code sample shows how to create an Azure Cosmos DB user by using the [Azure Cosmos DB .NET SDK v3](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/UserManagement).

```csharp
// Create a user.
Database database = client.GetDatabase("SalesDatabase");
User user = await database.CreateUserAsync("User 1");
```

> [!NOTE]
> Each Azure Cosmos DB user has a `ReadAsync()` method that you can use to retrieve the list of [permissions](#permissions) associated with the user.

### Permissions<a id="permissions"></a>

A permission resource is associated with a user and assigned to a specific resource. Each user can contain zero or more permissions. A permission resource provides access to a security token that the user needs when trying to access a specific container or data in a specific partition key. There are two available access levels that can be provided by a permission resource:

- **All**: The user has full permission on the resource.
- **Read**: The user can only read the contents of the resource but can't perform write, update, or delete operations on the resource.

> [!NOTE]
> To run stored procedures, the user must have the **All** permission on the container in which the stored procedure will be run.

If you enable the [diagnostic logs on data-plane requests](monitor-resource-logs.md), the following two properties corresponding to the permission are logged:

* **resourceTokenPermissionId**: This property indicates the resource token permission ID that you specified.

* **resourceTokenPermissionMode**: This property indicates the permission mode that you set when you created the resource token. The permission mode can have values such as **All** or **Read**.

#### Code sample to create permission

The following code sample shows how to create a permission resource, read the resource token of the permission resource, and associate the permissions with the [user](#users) you just created.

```csharp
// Create a permission on a container and specific partition key value
Container container = client.GetContainer("SalesDatabase", "OrdersContainer");
await user.CreatePermissionAsync(
    new PermissionProperties(
        id: "permissionUser1Orders", 
        permissionMode: PermissionMode.All, 
        container: container,
        resourcePartitionKey: new PartitionKey("012345")));
```

#### Code sample to read permission for user

The following code snippet shows how to retrieve the permission associated with the user you created and instantiate a new `CosmosClient` for the user, scoped to a single partition key.

```csharp
// Read a permission, create user client session.
Permission permission = await user.GetPermission("permissionUser1Orders").ReadAsync();

CosmosClient client = new CosmosClient(accountEndpoint: "MyEndpoint", authKeyOrResourceToken: permission.Resource.Token);
```

## Differences between RBAC and resource tokens

| Subject | RBAC | Resource tokens |
|--|--|--|
| Authentication  | With Microsoft Entra ID. | Based on the native Azure Cosmos DB users.<br>Integrating resource tokens with Microsoft Entra ID requires extra work to bridge Microsoft Entra identities and Azure Cosmos DB users. |
| Authorization | Role-based: Role definitions map allowed actions and can be assigned to multiple identities. | Permission-based: For each Azure Cosmos DB user, you need to assign data access permissions. |
| Token scope | A Microsoft Entra token carries the identity of the requester. This identity is matched against all assigned role definitions to perform authorization. | A resource token carries the permission granted to a specific Azure Cosmos DB user on a specific Azure Cosmos DB resource. Authorization requests on different resources might require different tokens. |
| Token refresh | The Microsoft Entra token is automatically refreshed by the Azure Cosmos DB SDKs when it expires. | Resource token refresh isn't supported. When a resource token expires, a new one needs to be issued. |

## Add users and assign roles

To add Azure Cosmos DB account reader access to your user account, have a subscription owner perform the following steps in the Azure portal.

1. Open the Azure portal and select your Azure Cosmos DB account.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Cosmos DB Account Reader. |
    | Assign access to | User, group, or service principal. |
    | Members | The user, group, or application in your directory to which you want to grant access. |

    ![Screenshot that shows the Add role assignment page in the Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

The entity can now read Azure Cosmos DB resources.

## Delete or export user data

As a database service, Azure Cosmos DB enables you to search, select, modify, and delete any data located in your database or containers. It's your responsibility to use the provided APIs and define logic required to find and erase any personal data if needed.

Each multi-model API (SQL, MongoDB, Gremlin, Cassandra, or Table) provides different language SDKs that contain methods to search and delete data based on custom predicates. You can also enable the [time to live (TTL)](time-to-live.md) feature to delete data automatically after a specified period, without incurring any more cost.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

- To learn more about Azure Cosmos DB database security, see [Azure Cosmos DB database security](database-security.md).
- To learn how to construct Azure Cosmos DB authorization tokens, see [Access control on Azure Cosmos DB resources](/rest/api/cosmos-db/access-control-on-cosmosdb-resources).
- For user management samples with users and permissions, see [.NET SDK v3 user management samples](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/UserManagement/UserManagementProgram.cs).
- For information and sample code to configure RBAC for the Azure Cosmos DB for MongoDB, see [Configure role-based access control for your Azure Cosmos DB for MongoDB](mongodb/how-to-setup-rbac.md).
