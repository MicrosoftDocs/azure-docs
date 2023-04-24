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

1. [An access key](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-configure#access-keys)

1. An [Azure Active Directory (AAD) token](https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens) (preview)

Although access key authentication is simple, it comes with a set of challenges around security and password management. In this article, we provide a guide on how to use an Azure Active Directory (Azure AD) token for cache authentication.

Azure Cache for Redis offers a password-free authentication mechanism by integrating with [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis). This integration also includes [role-based access control](Add%20link%20to%20RBAC) functionality provided through [access control lists (ACLs)](https://redis.io/docs/management/security/acl/) supported in open source Redis. To use the integration, your client application must assume the identity of an Azure Active Directory entity, like service principal or managed identity, and connect to your cache. This article shows how to use your service principal or managed identity to connect to your cache and how to grant your connection pre-defined permissions based on the AAD artifact being used for the connection.

## Scope of Availability

 
|**Tier**   |             Basic, Standard, Premium |  Enterprise, Enterprise Flash|
|:  ----------------:|------- ------------------------:|: ------------------------------:|
| **Availability**   |     Yes (preview) |             No|

## Prerequisites & Limitations

- To enable AAD token based authentication for your Azure Cache for Redis instance, at least one Redis user must be configured under the "Data Access Policy" blade.

- AAD based authentication is not supported on Azure Cache for Redis instances that run Redis version 4.

- AAD based authentication is not supported on Azure Cache for Redis instances that [depend on Cloud Services](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-faq#caches-with-a-dependency-on-cloud-services--classic)

- AAD based authentication is not supported by Azure Cache for Redis Enterprise SKUs.

- Some Redis commands are blocked. See full list here

NOTE:

Once a connection is established using AAD token, client applications must periodically refresh AAD token before expiry and send an AUTH command to Redis server to avoid disruption of connections. See Configure your Redis client to use Azure Active Directory " for more details.

## Enable AAD token based authentication on your cache

1. In the Azure portal, select the Azure Cache for Redis instance with which you'd like to configure AAD token-based authentication.

1. On the left side of the screen, select **(PREVIEW) Data Access Policy**.

1. Click "**Add**" button and choose "**New Redis User**"

1. You will be redirected to a new page named "**Choose Data Access Policy**". Choose the "**Owner**" policy and click the "**Next**" button. To create custom data access policies, see "Configure Data Access Policy" \<add link\>

> (ADD SCREENSHOT)

5.  Choose the service principal or managed identity that you want to use for authenticating to your Azure Cache for Redis instance and click **Save**.

6.  On the left side of the screen, select **Advanced settings**.

7.  Check the box labeled **(PREVIEW) Enable AAD Authorization** and select **Save**.

> (ADD SCREENSHOT)

8.  A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes.** 

9.  Once the enable operation is complete, you will get a notification on your portal indicating completion.

> (ADD SCREENSHOT)


## Configure your Redis client to use Azure Active Directory

Because most Redis clients assume that a password/access key is used for authentication, you will likely need to update your client workflow to support authentication using AAD. This section outlines how to configure your client applications to connect to Azure Cache for Redis using an AAD token.

> ![Icon Description automatically generated](media/image1.png){width="1.090333552055993in" height="0.7778182414698163in"}

### AAD Client Workflow

1.  Configure your client application to acquire an AAD token for your application using the [Microsoft Authentication Library (MSAL)](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)

> (ADD code snippet)

2.  Update your Redis connection logic to use following UserName and Password:

    a.  UserName = Object id of your managed identity or service principal

    b.  Password = AAD token that you acquired in Step 1

(ADD code snippet)

3.  Ensure that your client executes a Redis [AUTH command](https://redis.io/commands/auth/) automatically before your AAD token expires using:

    a.  UserName = Object id of your managed identity or service principal

    b.  Password = AAD token refreshed periodically

(ADD code snippet)

### Client library support 

The following table includes links to code samples which demonstrate how to connect to your Azure Cache for Redis instance using an AAD token. A wide variety of client libraries are included in multiple languages.

+---------------------+----------------+------------------------------------------------------------+
| **Client library**  | **Language**   | **Link to sample code**                                    |
+=====================+================+============================================================+
| StackExchange.Redis | C#/.NET        | StackExchange.Redis extension as a NuGet \<todo\>          |
|                     |                |                                                            |
|                     |                | Link \<todo\>                                              |
+---------------------+----------------+------------------------------------------------------------+
| Python              | Python         | [Link](https://aka.ms/redis/aad/sample-code/python)        |
+---------------------+----------------+------------------------------------------------------------+
| Jedis               | Java           | [Link](https://aka.ms/redis/aad/sample-code/java-jedis)    |
+---------------------+----------------+------------------------------------------------------------+
| Lettuce             | Java           | [Link](https://aka.ms/redis/aad/sample-code/java-lettuce)  |
+---------------------+----------------+------------------------------------------------------------+
| Redisson            | Java           | [Link](https://aka.ms/redis/aad/sample-code/java-redisson) |
+---------------------+----------------+------------------------------------------------------------+
| ioredis             | Node.js        | [Link](https://aka.ms/redis/aad/sample-code/js-ioredis)    |
+---------------------+----------------+------------------------------------------------------------+
| Node-redis          | Node.js        | [Link](https://aka.ms/redis/aad/sample-code/js-noderedis)  |
+---------------------+----------------+------------------------------------------------------------+


# Move this

## Configure role-based access control with Data Access Policy

Managing access to your Redis instance is critical to ensure that the right users have access to the right set of data and commands. Redis 6 introduced the [Access Control List](https://redis.io/docs/management/security/acl/) (ACL), which allows limits to be placed on users in terms of commands that can be executed and the keys that can be accessed. For example, you can disable some users from deleting keys in the cache with the [DEL](https://redis.io/commands/del/) command.

Azure Cache for Redis now integrates this ACL functionality with Azure Active Directory (AAD) to allow you to configure your data access policies for your application's service principal and managed identity.

Azure Cache for Redis offers three built-in access policies: *Owner*, *Contributor* and *Reader*. If the built-in access policies do not satisfy your data protection and isolation requirements, you can create and use your own custom data access policy as described in [Configure custom data access policy]{.underline}. \<link to Configure customer data access policy\>

**Scope of Availability**

  ---------------------------------------------------------------------------------
  **Tier**                Basic, Standard, Premium   Enterprise, Enterprise Flash
  ----------------------- -------------------------- ------------------------------
  **Availability**        Yes (preview)              No

  ---------------------------------------------------------------------------------

### Prerequisites and Limitations

-   Redis ACL and Data Access Policies are not supported on Azure Cache for Redis instances that run Redis version 4.

-   Redis ACL and Data Access Policies are not supported on Azure Cache for Redis instances that [depend on Cloud Services](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-faq#caches-with-a-dependency-on-cloud-services--classic).

-   Some Redis commands are blocked. See full list [here](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-configure#redis-commands-not-supported-in-azure-cache-for-redis)

### Permissions for your data access policy

As documented on [ACL \| Redis](https://redis.io/docs/management/security/acl/), ACL in Redis version 6.0 allows configuring access permissions for two areas:

1.  ***Command categories***

Redis has created groupings of commands such as administrative commands, dangerous commands, etc. to make setting permissions on a group of commands easier. Please note that commands mentioned [here](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-configure#redis-commands-not-supported-in-azure-cache-for-redis) are still blocked. Following are some of useful command categories that Redis supports. You can find the full list here.

-   **admin** - Administrative commands. Normal applications will never need to use these. Includes MONITOR, SHUTDOWN, etc.

-   **dangerous** - Potentially dangerous commands (each should be considered with care for various reasons). This includes FLUSHALL, RESTORE, SORT, KEYS, CLIENT, DEBUG, INFO, CONFIG, etc.

-   **keyspace** - Writing or reading from keys, databases, or their metadata in a type agnostic way. Includes DEL, RESTORE, DUMP, RENAME, EXISTS, DBSIZE, KEYS, EXPIRE, TTL, FLUSHALL, etc. Commands that may modify the keyspace, key, or metadata will also have the write category. Commands that only read the keyspace, key, or metadata will have the read category.

-   **pubsub** - PubSub-related commands.

-   **read** - Reading from keys (values or metadata). Note that commands that don\'t interact with keys, will not have either read or write.

-   **set** - Data type: sets related.

-   **sortedset** - Data type: sorted sets related.

-   **stream** - Data type: streams related.

-   **string** - Data type: strings related.

-   **write** - Writing to keys (values or metadata).

2.  ***Keys***, which allows you to control access to specific keys or groups of keys stored in the cache.

> Use *\~\<pattern\>* to provide a pattern for keys. You can use **\~\*** or *allkeys* to indicate that the command category permissions apply to all keys in the cache instance.

### How to specify permissions

To specify permissions, you need to create a string that will be saved as your custom access policy and be assigned to your Redis User.

Below are some examples of permission strings for various scenarios.

1.  Allow application to execute all commands on all keys

Permissions string: \@all allkeys

2.  Allow application to execute all commands on keys with prefix "*Az*"

Permissions string: \@all \~Az\*

3.  All my application to execute only *read* commands on all keys

> Permissions string: \@read allkeys

### Configure a custom data access policy for your application

1.  In the Azure portal, select the Azure Cache for Redis instance that you want to configure AAD token based authentication for.

2.  On the left side of the screen, select **(PREVIEW) Data Access Policy**.

> (ADD SCREENSHOT)

3.  Click on "Add" button and choose "New Access Policy"

(ADD SCREENSHOT)

4.  Provide a name for your access policy.

5.  Configure Permissions as per your requirements. See \<
