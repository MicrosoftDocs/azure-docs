---
title: Use Azure Active Directory for Cache Authentication
titleSuffix: Azure Cache for Redis
description: Learn how to develop code for Azure Cache for Redis.
author: flang-msft

ms.service: cache
ms.topic: conceptual
ms.date: 04/24/2023
ms.author: franlanglois

---

# Use Azure Active Directory for cache authentication

Azure Cache for Redis offers two methods to authenticate to your cache instance:

- [access key](cache-configure.md#access-keys)

- [Azure Active Directory token](/azure/active-directory/develop/access-tokens)

Although access key authentication is simple, it comes with a set of challenges around security and password management. In this article, you learn  how to use an Azure Active Directory (Azure AD) token for cache authentication.

Azure Cache for Redis offers a password-free authentication mechanism by integrating with [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis). This integration also includes [role-based access control](/azure/role-based-access-control/) functionality provided through [access control lists (ACLs)](https://redis.io/docs/management/security/acl/) supported in open source Redis.

To use the ACL integration, your client application must assume the identity of an Azure Active Directory entity, like service principal or managed identity, and connect to your cache. In this article, you learn how to use your service principal or managed identity to connect to your cache, and how to grant your connection pre-defined permissions based on the Azure AD artifact being used for the connection.

## Scope of availability

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|:-----------------|:------------------------:|:----------------------------:|
| **Availability** | Yes (preview)            | No                           |

## Prerequisites & Limitations

- To enable AAD token based authentication for your Azure Cache for Redis instance, at least one Redis user must be configured under the **Data Access Policy** setting in the Resource menu.
- Azure AD based authentication is supported for SSL connections and TLS 1.2 only.
- Azure AD based authentication is not supported on Azure Cache for Redis instances that run Redis version 4.
- Azure AD based authentication is not supported on Azure Cache for Redis instances that [depend on Cloud Services](/azure/azure-cache-for-redis/cache-faq.md#caches-with-a-dependency-on-cloud-services--classic).
- Azure AD based authentication is not supported in the Enterprise tiers of Azure Cache for Redis Enterprise.
- Some Redis commands are blocked. For a full list of blocked commands, see [Redis commands not supported in Azure Cache for Redis](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

> [!IMPORTANT]
> Once a connection is established using Azure AD token, client applications must periodically refresh Azure AD token before expiry and send an AUTH command to Redis server to avoid disruption of connections. See Configure your Redis client to use Azure Active Directory " for more details.

## Enable Azure AD token based authentication on your cache

1. In the Azure portal, select the Azure Cache for Redis instance with which you'd like to configure Azure AD token-based authentication.

1. On the left side of the screen, select **(PREVIEW) Data Access Policy**.

1. Click "**Add**" button and choose "**New Redis User**"

1. You will be redirected to a new page named "**Choose Data Access Policy**". Choose the "**Owner**" policy and click the "**Next**" button. To create custom data access policies, see "Configure Data Access Policy" \<add link\>

   <!-- (ADD SCREENSHOT) -->

1. Choose the service principal or managed identity that you want to use for authenticating to your Azure Cache for Redis instance and click **Save**.

1. On the left side of the screen, select **Advanced settings**.

1. Check the box labeled **(PREVIEW) Enable Azure AD Authorization** and select **Save**.

   <!-- > (ADD SCREENSHOT) -->

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes.**

1. Once the enable operation is complete, you get a notification on your portal indicating completion. The operation can take several minutes.

   <!-- > (ADD SCREENSHOT) -->

   > [!NOTE]
   > Propagation of a change to the cache configuration for AAD authentication might take as many as 20 minutes.

## Configure your Redis client to use Azure Active Directory

Because most Azure Cache for Redis clients assume that a password/access key is used for authentication, you likely need to update your client workflow to support authentication using Azure AD. In this section, you learn how to configure your client applications to connect to Azure Cache for Redis using an Azure AD token.

<!-- Conceptual Art goes here. -->

### Azure AD Client Workflow

1. Configure your client application to acquire an Azure AD token for your application using the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview).

   <!-- (ADD code snippet) -->

1. Update your Redis connection logic to use following `UserName` and Passw`ord:

   1. `UserName` = Object id of your managed identity or service principal

   1. `Password` = Azure AD token that you acquired using MSAL

   <!-- (ADD code snippet) -->

1. Ensure that your client executes a Redis [AUTH command](https://redis.io/commands/auth/) automatically before your Azure AD token expires using:

   1. `UserName` = Object id of your managed identity or service principal

   1. `Password` = Azure AD token refreshed periodically

   <!-- (ADD code snippet) -->

### Best practices for AAD authentication

1. Configure private links or firewall rules to protect your cache from a Denial of Service attack.

1. Ensure that your client application sends a new AAD token at least 3 minutes before token expiry to avoid connection disruption.

1. When executing AUTH command periodically, consider adding a jitter so that the AUTH commands are staggered and your Redis server is does not receive lot of AUTH commands at the same time.

### Client library support

The following table includes links to code samples which demonstrate how to connect to your Azure Cache for Redis instance using an Azure AD token. A wide variety of client libraries are included in multiple languages.

+---------------------+----------------+-------------------------------------------------------------------------+
| **Client library**  | **Language**   | **Link to sample code**                                                 |
+=====================+================+=========================================================================+
| StackExchange.Redis | C#/.NET        | StackExchange.Redis extension as a NuGet                                |
|                     |                |                                                                         |
|                     |                | <!-- Link -->                                                           |
+---------------------+----------------+------------------------------------------------------------+
| Python              | Python         | [Python code Sample](https://aka.ms/redis/aad/sample-code/python)        |
+---------------------+----------------+------------------------------------------------------------+
| Jedis               | Java           | [Jedis code sample](https://aka.ms/redis/aad/sample-code/java-jedis)    |
+---------------------+----------------+------------------------------------------------------------+
| Lettuce             | Java           | [Lettuce code sample](https://aka.ms/redis/aad/sample-code/java-lettuce)  |
+---------------------+----------------+------------------------------------------------------------+
| Redisson            | Java           | [Redisson code sample](https://aka.ms/redis/aad/sample-code/java-redisson) |
+---------------------+----------------+------------------------------------------------------------+
| ioredis             | Node.js        | [ioredis code sample](https://aka.ms/redis/aad/sample-code/js-ioredis)    |
+---------------------+----------------+------------------------------------------------------------+
| Node-redis          | Node.js        | [noredis code sample](https://aka.ms/redis/aad/sample-code/js-noderedis)  |
+---------------------+----------------+------------------------------------------------------------+
