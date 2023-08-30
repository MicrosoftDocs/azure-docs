---
title: Use Azure Active Directory for cache authentication
titleSuffix: Azure Cache for Redis
description: Learn how to use Azure Active Directory with Azure Cache for Redis.
author: flang-msft

ms.custom: references_regions
ms.service: cache
ms.topic: conceptual
ms.date: 06/23/2023
ms.author: franlanglois

---

# Use Azure Active Directory for cache authentication

Azure Cache for Redis offers two methods to authenticate to your cache instance:

- [access key](cache-configure.md#access-keys)

- [Azure Active Directory token](/azure/active-directory/develop/access-tokens)

Although access key authentication is simple, it comes with a set of challenges around security and password management. In this article, you learn  how to use an Azure Active Directory (Azure AD) token for cache authentication.

Azure Cache for Redis offers a password-free authentication mechanism by integrating with [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis). This integration also includes [role-based access control](/azure/role-based-access-control/) functionality provided through [access control lists (ACLs)](https://redis.io/docs/management/security/acl/) supported in open source Redis.

To use the ACL integration, your client application must assume the identity of an Azure Active Directory entity, like service principal or managed identity, and connect to your cache. In this article, you learn how to use your service principal or managed identity to connect to your cache, and how to grant your connection predefined permissions based on the Azure AD artifact being used for the connection.

## Scope of availability

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|:-----------------|:------------------------:|:----------------------------:|
| **Availability** | Yes (preview)            | No                           |

## Prerequisites and limitations

- To enable Azure AD token-based authentication for your Azure Cache for Redis instance, at least one Redis user must be configured under the **Data Access Policy** setting in the Resource menu.
- Azure AD-based authentication is supported for SSL connections and TLS 1.2 only.
- Azure AD-based authentication isn't supported on Azure Cache for Redis instances that run Redis version 4.
- Azure AD-based authentication isn't supported on Azure Cache for Redis instances that [depend on Cloud Services](./cache-faq.yml#caches-with-a-dependency-on-cloud-services--classic).
- Azure AD based authentication isn't supported in the Enterprise tiers of Azure Cache for Redis Enterprise.
- Some Redis commands are blocked. For a full list of blocked commands, see [Redis commands not supported in Azure Cache for Redis](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

> [!IMPORTANT]
> Once a connection is established using Azure AD token, client applications must periodically refresh Azure AD token before expiry, and send an `AUTH` command to Redis server to avoid disruption of connections. For more information, see [Configure your Redis client to use Azure Active Directory](#configure-your-redis-client-to-use-azure-active-directory).

## Enable Azure AD token based authentication on your cache

1. In the Azure portal, select the Azure Cache for Redis instance where you'd like to configure Azure AD token-based authentication.

1. Select **(PREVIEW) Data Access Configuration** from the Resource menu.

1. Select "**Add**" and choose **New Redis User**.

1. On the **Access Policy** tab, select one the available policies in the table: **Owner**, **Contributor**, or **Reader**. Then, select the **Next:Redis Users**.

   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-new-redis-user.png" alt-text="Screenshot showing the available Access Policies.":::

1. Choose either the **User or service principal** or **Managed Identity** to determine how you want to use for authenticate to your Azure Cache for Redis instance.

1. Then, select **Select members** and select  **Select**. Then, select **Next : Review + Design**.
   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-select-members.png" alt-text="Screenshot showing members to add as New Redis Users.":::

1. From the Resource menu, select **Advanced settings**.

1. Check the box labeled **(PREVIEW) Enable Azure AD Authorization** and select **OK**. Then, select **Save**.

   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-azure-ad-access-authorization.png" alt-text="Screenshot of Azure AD access authorization.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes.**

   > [!IMPORTANT]
   > Once the enable operation is complete, the nodes in your cache instance reboots to load the new configuration. We recommend performing this operation during your maintenance window or outside your peak business hours. The operation can take up to 30 minutes.

## Configure your Redis client to use Azure Active Directory

Because most Azure Cache for Redis clients assume that a password/access key is used for authentication, you likely need to update your client workflow to support authentication using Azure AD. In this section, you learn how to configure your client applications to connect to Azure Cache for Redis using an Azure AD token.

:::image type="content" source="media/cache-azure-active-directory-for-authentication/azure-ad-token.png" alt-text="Architecture diagram showing the flow of a token from Azure AD to a customer application to a cache.":::

### Azure AD Client Workflow

1. Configure your client application to acquire an Azure AD token for scope `acca5fbb-b7e4-4009-81f1-37e38fd66d78/.default` using the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview).

   <!-- (ADD code snippet) -->

1. Update your Redis connection logic to use following `UserName` and `Password`:

   - `UserName` = Object ID of your managed identity or service principal

   - `Password` = Azure AD token that you acquired using MSAL

   <!-- (ADD code snippet) -->

1. Ensure that your client executes a Redis [AUTH command](https://redis.io/commands/auth/) automatically before your Azure AD token expires using:

   - `UserName` = Object ID of your managed identity or service principal

   - `Password` = Azure AD token refreshed periodically

   <!-- (ADD code snippet) -->

### Client library support

The library [`Microsoft.Azure.StackExchangeRedis`](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) is an extension of `StackExchange.Redis` that enables you to use Azure Active Directory to authenticate connections from a Redis client application to an Azure Cache for Redis. The extension manages the authentication token, including proactively refreshing tokens before they expire to maintain persistent Redis connections over multiple days.

This [code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis) demonstrates how to use the `Microsoft.Azure.StackExchangeRedis` NuGet package to connect to your Azure Cache for Redis instance using Azure Active Directory.

The following table includes links to code samples, which demonstrate how to connect to your Azure Cache for Redis instance using an Azure AD token. A wide variety of client libraries are included in multiple languages.

| **Client library**  | **Language**   | **Link to sample code**|
|----|----|----|
| StackExchange.Redis | .NET           | [StackExchange.Redis code sample](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis)   |
| redis-py            | Python         | [redis-py code Sample](https://aka.ms/redis/aad/sample-code/python)        |
| Jedis               | Java           | [Jedis code sample](https://aka.ms/redis/aad/sample-code/java-jedis)    |
| Lettuce             | Java           | [Lettuce code sample](https://aka.ms/redis/aad/sample-code/java-lettuce)  |
| Redisson            | Java           | [Redisson code sample](https://aka.ms/redis/aad/sample-code/java-redisson) |
| ioredis             | Node.js        | [ioredis code sample](https://aka.ms/redis/aad/sample-code/js-ioredis)    |
| node-redis          | Node.js        | [node-redis code sample](https://aka.ms/redis/aad/sample-code/js-noderedis)  |

### Best practices for Azure AD authentication

- Configure private links or firewall rules to protect your cache from a Denial of Service attack.

- Ensure that your client application sends a new Azure AD token at least 3 minutes before token expiry to avoid connection disruption.

- When calling the Redis server `AUTH` command periodically, consider adding a jitter so that the `AUTH` commands are staggered, and your Redis server doesn't receive lot of `AUTH` commands at the same time.

## Next steps

- [Configure role-based access control with Data Access Policy](cache-configure-role-based-access-control.md)
