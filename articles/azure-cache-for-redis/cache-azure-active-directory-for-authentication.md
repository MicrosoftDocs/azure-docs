---
title: Use Microsoft Entra ID for cache authentication
titleSuffix: Azure Cache for Redis
description: Learn how to use Microsoft Entra ID with Azure Cache for Redis.
author: flang-msft

ms.custom: references_regions
ms.service: cache
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: franlanglois

---

# Use Microsoft Entra ID for cache authentication

Azure Cache for Redis offers two methods to [authenticate](cache-configure.md#authentication) to your cache instance: Access keys and Microsoft Entra ID

Although access key authentication is simple, it comes with a set of challenges around security and password management. For contrast, in this article, you learn how to use a Microsoft Entra token for cache authentication.

Azure Cache for Redis offers a password-free authentication mechanism by integrating with [Microsoft Entra ID)](/azure/active-directory/fundamentals/active-directory-whatis). This integration also includes [role-based access control](/azure/role-based-access-control/) functionality provided through [access control lists (ACLs)](https://redis.io/docs/management/security/acl/) supported in open source Redis.

To use the ACL integration, your client application must assume the identity of a Microsoft Entra entity, like service principal or managed identity, and connect to your cache. In this article, you learn how to use your service principal or managed identity to connect to your cache, and how to grant your connection predefined permissions based on the Microsoft Entra artifact being used for the connection.

## Scope of availability

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|:-----------------|:------------------------:|:----------------------------:|
| **Availability** | Yes             | No                           |

## Prerequisites and limitations

- Microsoft Entra ID-based authentication is supported for SSL connections and TLS 1.2 or higher.
- Microsoft Entra ID-based authentication isn't supported on Azure Cache for Redis instances that [depend on Cloud Services](./cache-faq.yml#caches-with-a-dependency-on-cloud-services--classic).
- Microsoft Entra ID based authentication isn't supported in the Enterprise tiers of Azure Cache for Redis Enterprise.
- Some Redis commands are blocked. For a full list of blocked commands, see [Redis commands not supported in Azure Cache for Redis](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

> [!IMPORTANT]
> Once a connection is established using Microsoft Entra token, client applications must periodically refresh Microsoft Entra token before expiry, and send an `AUTH` command to Redis server to avoid disruption of connections. For more information, see [Configure your Redis client to use Microsoft Entra ID](#configure-your-redis-client-to-use-microsoft-entra-id).

## Enable Microsoft Entra ID authentication on your cache

1. In the Azure portal, select the Azure Cache for Redis instance where you'd like to configure Microsoft Entra token-based authentication.

1. Select **Authentication** from the Resource menu.

1. In the working pane, select **Enable Microsoft Entra Authentication**.

1. Select **Enable Microsoft Entra Authentication**, and enter the name of a valid user. The user you enter is automatically assigned _Data Owner Access Policy_ by default when you select **Save**. You can also enter a managed identity or service principal to connect to your cache instance.

    :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-enable-microsoft-entra.png" alt-text="Screenshot showing authentication selected in the resource menu and the enable Microsoft Entra authentication checked.":::

1. A popup dialog box displays asking if you want to update your configuration, and informing you that it takes several minutes. Select **Yes.**

   > [!IMPORTANT]
   > Once the enable operation is complete, the nodes in your cache instance reboots to load the new configuration. We recommend performing this operation during your maintenance window or outside your peak business hours. The operation can take up to 30 minutes.

For information on using Microsoft Entra ID with Azure CLI, see the [references pages for identity](/cli/azure/redis/identity).

## Using data access configuration with your cache

If you would like to use a custom access policy instead of Redis Data Owner, go to the **Data Access Configuration** on the Resource menu. For more information, see [Configure a custom data access policy for your application](cache-configure-role-based-access-control.md#configure-a-custom-data-access-policy-for-your-application).

1. In the Azure portal, select the Azure Cache for Redis instance where you'd like to add to the Data Access Configuration.

1. Select **Data Access Configuration** from the Resource menu.

1. Select **Add** and choose **New Redis User**.

1. On the **Access Policy** tab, select one the available policies in the table: **Data Owner**, **Data Contributor**, or **Data Reader**. Then, select the **Next:Redis Users**.

   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-new-redis-user.png" alt-text="Screenshot showing the available Access Policies.":::

1. Choose either the **User or service principal** or **Managed Identity** to determine how to assign access to your Azure Cache for Redis instance. If you select **User or service principal**, and you want to add a _user_, you must first [enable Microsoft Entra Authentication](#enable-microsoft-entra-id-authentication-on-your-cache).

1. Then, select **Select members** and select  **Select**. Then, select **Next : Review + Assign**.
   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-select-members.png" alt-text="Screenshot showing members to add as New Redis Users.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes.**

   > [!IMPORTANT]
   > Once the enable operation is complete, the nodes in your cache instance reboots to load the new configuration. We recommend performing this operation during your maintenance window or outside your peak business hours. The operation can take up to 30 minutes.

## Configure your Redis client to use Microsoft Entra ID

Because most Azure Cache for Redis clients assume that a password and access key are used for authentication, you likely need to update your client workflow to support authentication using Microsoft Entra ID. In this section, you learn how to configure your client applications to connect to Azure Cache for Redis using a Microsoft Entra token.

### Microsoft Entra Client Workflow

1. Configure your client application to acquire a Microsoft Entra token for scope, `https://redis.azure.com/.default` or `acca5fbb-b7e4-4009-81f1-37e38fd66d78/.default`, using the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview).

1. Update your Redis connection logic to use following `User` and `Password`:

   - `User` = Object ID of your managed identity or service principal
   - `Password` = Microsoft Entra token that you acquired using MSAL

1. Ensure that your client executes a Redis [AUTH command](https://redis.io/commands/auth/) automatically before your Microsoft Entra token expires using:

   - `User` = Object ID of your managed identity or service principal
   - `Password` = Microsoft Entra token refreshed periodically

### Client library support

The library [`Microsoft.Azure.StackExchangeRedis`](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) is an extension of `StackExchange.Redis` that enables you to use Microsoft Entra ID to authenticate connections from a Redis client application to an Azure Cache for Redis. The extension manages the authentication token, including proactively refreshing tokens before they expire to maintain persistent Redis connections over multiple days.

This [code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis) demonstrates how to use the `Microsoft.Azure.StackExchangeRedis` NuGet package to connect to your Azure Cache for Redis instance using Microsoft Entra ID.

The following table includes links to code samples, which demonstrate how to connect to your Azure Cache for Redis instance using a Microsoft Entra token. A wide variety of client libraries are included in multiple languages.

| **Client library**  | **Language**   | **Link to sample code**|
|----|----|----|
| StackExchange.Redis | .NET           | [StackExchange.Redis code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis)   |
| redis-py            | Python         | [redis-py code Sample](https://aka.ms/redis/aad/sample-code/python)        |
| Jedis               | Java           | [Jedis code sample](https://aka.ms/redis/aad/sample-code/java-jedis)    |
| Lettuce             | Java           | [Lettuce code sample](https://aka.ms/redis/aad/sample-code/java-lettuce)  |
| Redisson            | Java           | [Redisson code sample](https://aka.ms/redis/aad/sample-code/java-redisson) |
| ioredis             | Node.js        | [ioredis code sample](https://aka.ms/redis/aad/sample-code/js-ioredis)    |
| node-redis          | Node.js        | [node-redis code sample](https://aka.ms/redis/aad/sample-code/js-noderedis)  |

### Best practices for Microsoft Entra authentication

- Configure private links or firewall rules to protect your cache from a Denial of Service attack.

- Ensure that your client application sends a new Microsoft Entra token at least 3 minutes before token expiry to avoid connection disruption.

- When calling the Redis server `AUTH` command periodically, consider adding a jitter so that the `AUTH` commands are staggered, and your Redis server doesn't receive lot of `AUTH` commands at the same time.

## Related content

- [Configure role-based access control with Data Access Policy](cache-configure-role-based-access-control.md)
- [Reference pages for identity](/cli/azure/redis/identity)
