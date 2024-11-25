---
title: Use Microsoft Entra for cache authentication with Azure Managed Redis (preview)
description: Learn how to use Microsoft Entra with Azure Managed Redis.
ms.service: azure-managed-redis
ms.custom: references_regions, ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Use Microsoft Entra for cache authentication with Azure Managed Redis (preview)

Azure Managed Redis (preview)offers two methods to [authenticate](managed-redis-configure.md#authentication) to your cache instance: access keys and Microsoft Entra.

Although access key authentication is simple, it comes with a set of challenges around security and password management. For contrast, in this article, you learn how to use a Microsoft Entra token for cache authentication.

Azure Managed Redis offers a password-free authentication mechanism by integrating with [Microsoft Entra](/azure/active-directory/fundamentals/active-directory-whatis). The Entra ID configured to connect with Azure Managed Redis is assigned the same permissions as with using Access Keys. 

In this article, you learn how to use your service principal or managed identity to connect to your Redis instance.

## Prerequisites and limitations

- Microsoft Entra authentication is supported for SSL connections only.
- Some Redis commands are blocked. For a full list of blocked commands, see [Redis commands not supported in Azure Managed Redis](managed-redis-best-practices-client-libraries.md#blocked-commands).

> [!IMPORTANT]
> After a connection is established by using a Microsoft Entra token, client applications must periodically refresh the Microsoft Entra token before expiry. Then the apps must send an `AUTH` command to the Redis server to avoid disrupting connections. For more information, see [Configure your Redis client to use Microsoft Entra](#configure-your-redis-client-to-use-microsoft-entra).

## Enable Microsoft Entra authentication on your cache

1. In the Azure portal, select the Azure Managed Redis instance where you want to configure Microsoft Entra token-based authentication.

1. On the **Resource** menu, select **Authentication**.

1. On the working pane, select the **Microsoft Entra Authentication** tab.

1. Select **Enable Microsoft Entra Authentication** and choose "User or service principal" or "Managed Identity" buttons. The user you enter is automatically assigned same permissions as when using Access Keys when you **Select**. You can also enter a managed identity or service principal to connect to your AMR instance.

    :::image type="content" source="media/managed-redis-entra-for-authentication/managed-redis-enable-microsoft-entra.png" alt-text="Screenshot showing authentication selected in the resource menu and the Enable Microsoft Entra authentication checkbox.":::

For information on how to use Microsoft Entra with the Azure CLI, see the [reference pages for identity](/cli/azure/redis/identity).

## Disable access key authentication on your cache

Using Microsoft Entra is the secure way to connect your cache. We recommend that you use Microsoft Entra and disable access keys.

When you disable access key authentication for a Redis instance, all existing client connections are terminated, whether they use access keys or Microsoft Entra authentication. Follow the recommended Redis client best practices to implement proper retry mechanisms for reconnecting Microsoft Entra-based connections, if any.

Before you disable access keys:

- Microsoft Entra authentication must be enabled.
- For geo-replicated caches, you must:

   1. Unlink the caches.
   1. Disable access keys.
   1. Relink the caches.

If you have a cache where you use access keys, and you want to disable access keys, follow this procedure:

1. In the Azure portal, select the Azure Managed Redis instance where you want to disable access keys.

1. On the **Resource** menu, select **Authentication**.

1. On the working pane, select **Access keys**.

1. Configure **Access Keys Authentication** to be disabled.

   :::image type="content" source="media/managed-redis-entra-for-authentication/managed-redis-disable-access-keys.png" alt-text="Screenshot showing access keys in the working pane with the Disable Access Keys Authentication checkbox. ":::

1. Confirm that you want to update your configuration by selecting **Yes**.

> [!IMPORTANT]
> When the **Disable Access Keys Authentication** setting is changed for a cache, all existing client connections, using access keys or Microsoft Entra, are terminated. Follow the best practices to implement proper retry mechanisms for reconnecting Microsoft Entra-based connections. For more information, see [Connection resilience](managed-redis-best-practices-connection.md).

## Configure your Redis client to use Microsoft Entra

Because most Azure Managed Redis clients assume that a password and access key are used for authentication, you likely need to update your client workflow to support authentication by using Microsoft Entra. In this section, you learn how to configure your client applications to connect to Azure Managed Redis by using a Microsoft Entra token.

### Microsoft Entra client workflow

1. Configure your client application to acquire a Microsoft Entra token for scope, `https://redis.azure.com/.default` or `acca5fbb-b7e4-4009-81f1-37e38fd66d78/.default`, by using the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview).

1. Update your Redis connection logic to use the following `User` and `Password`:

   - `User` = Object ID of your managed identity or service principal
   - `Password` = Microsoft Entra token that you acquired by using MSAL

1. Ensure that your client executes a Redis [AUTH command](https://redis.io/commands/auth/) automatically before your Microsoft Entra token expires by using:

   - `User` = Object ID of your managed identity or service principal
   - `Password` = Microsoft Entra token refreshed periodically

### Client library support

The library [`Microsoft.Azure.StackExchangeRedis`](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) is an extension of `StackExchange.Redis` that enables you to use Microsoft Entra to authenticate connections from a Redis client application to an Azure Managed Redis. The extension manages the authentication token, including proactively refreshing tokens before they expire to maintain persistent Redis connections over multiple days.

[This code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis) demonstrates how to use the `Microsoft.Azure.StackExchangeRedis` NuGet package to connect to your Azure Managed Redis instance by using Microsoft Entra.

The following table includes links to code samples. They demonstrate how to connect to your Azure Managed Redis instance by using a Microsoft Entra token. Various client libraries are included in multiple languages.

| Client library  | Language   | Link to sample code|
|----|----|----|
| StackExchange.Redis | .NET           | [StackExchange.Redis code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis)   |
| redis-py            | Python         | [redis-py code sample](https://aka.ms/redis/aad/sample-code/python)        |
| Jedis               | Java           | [Jedis code sample](https://aka.ms/redis/aad/sample-code/java-jedis)    |
| Lettuce             | Java           | [Lettuce code sample](https://aka.ms/redis/aad/sample-code/java-lettuce)  |
| Redisson            | Java           | [Redisson code sample](https://aka.ms/redis/aad/sample-code/java-redisson) |
| ioredis             | Node.js        | [ioredis code sample](https://aka.ms/redis/aad/sample-code/js-ioredis)    |
| node-redis          | Node.js        | [node-redis code sample](https://aka.ms/redis/aad/sample-code/js-noderedis)  |

### Best practices for Microsoft Entra authentication

- Configure private links or firewall rules to protect your cache from a denial of service attack.
- Ensure that your client application sends a new Microsoft Entra token at least three minutes before token expiry to avoid connection disruption.
- When you call the Redis server `AUTH` command periodically, consider adding a jitter so that the `AUTH` commands are staggered. In this way, your Redis server doesn't receive too many `AUTH` commands at the same time.

## Related content

- [Reference pages for identity](/cli/azure/redis/identity)
