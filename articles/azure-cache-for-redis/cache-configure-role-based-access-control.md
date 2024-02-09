---
title: Configure role-based access control with Data Access Policy
titleSuffix: Azure Cache for Redis
description: Learn how to configure role-based access control with Data Access Policy.
author: flang-msft

ms.custom: references_regions
ms.service: cache
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: franlanglois

---

# Configure role-based access control with Data Access Policy

Managing access to your Azure Cache for Redis instance is critical to ensure that the right users have access to the right set of data and commands. In Redis version 6, the [Access Control List](https://redis.io/docs/management/security/acl/) (ACL) was introduced. ACL limits which user can execute certain commands, and the keys that a user can be access. For example, you can prohibit specific users from deleting keys in the cache using [DEL](https://redis.io/commands/del/) command.

Azure Cache for Redis now integrates this ACL functionality with Microsoft Entra ID to allow you to configure your Data Access Policies for your application's service principal and managed identity.

Azure Cache for Redis offers three built-in access policies: _Owner_, _Contributor_, and _Reader_. If the built-in access policies don't satisfy your data protection and isolation requirements, you can create and use your own custom data access policy as described in [Configure custom data access policy](#configure-a-custom-data-access-policy-for-your-application).

## Scope of availability

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|:-----------------|:------------------------:|:----------------------------:|
| **Availability** | Yes (preview)            | No                           |

## Prerequisites and limitations

- Redis ACL and Data Access Policies aren't supported on Azure Cache for Redis instances that run Redis version 4.
- Redis ACL and Data Access Policies aren't supported on Azure Cache for Redis instances that depend on [Cloud Services](cache-faq.yml#caches-with-a-dependency-on-cloud-services--classic).
- Microsoft Entra authentication and authorization are supported for SSL connections only.
- Some Redis commands are [blocked](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

## Permissions for your data access policy

As documented on [Redis Access Control List](https://redis.io/docs/management/security/acl/), ACL in Redis version 6.0 allows configuring access permissions for three areas:

### Command categories

Redis has created groupings of commands such as administrative commands, dangerous commands, etc. to make setting permissions on a group of commands easier.

- Use `+@commandcategory` to allow a command category
- Use `-@commandcategory` to disallow a command category

These [commands](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis) are still blocked. The following groups are useful command categories that Redis supports. For more information on command categories, see the full list under the heading [Command Categories](https://redis.io/docs/management/security/acl/).

- `admin`
  - Administrative commands. Normal applications never need to use these, including `MONITOR`, `SHUTDOWN`, and others.
- `dangerous`
  - Potentially dangerous commands. Each should be considered with care for various reasons, including `FLUSHALL`, `RESTORE`, `SORT`, `KEYS`, `CLIENT`, `DEBUG`, `INFO`, `CONFIG`, and others.
- `keyspace`
  - Writing or reading from keys, databases, or their metadata in a type agnostic way, including `DEL`, `RESTORE`, `DUMP`, `RENAME`, `EXISTS`, `DBSIZE`, `KEYS`, `EXPIRE`, `TTL`, `FLUSHALL`, and more. Commands that can modify the keyspace, key, or metadata also have the write category. Commands that only read the keyspace, key, or metadata have the read category.
- `pubsub`
  - PubSub-related commands.
- `read`
  - Reading from keys, values or metadata. Commands that don't interact with keys, don't have either read or write.
- `set`
  - Data type: sets related.
- `sortedset`
  - Data type: sorted sets related.
- `stream`
  - Data type: streams related.
- `string`
  - Data type: strings related.
- `write`
  - Writing to keys (values or metadata).

### Commands

_Commands_ allow you to control which specific commands can be run by a particular Redis user.

- Use `+command` to allow a command.
- Use `-command` to disallow a command.

### Keys

Keys allow you to control access to specific keys or groups of keys stored in the cache.

- Use `~<pattern>` to provide a pattern for keys.

- Use either `~*` or `allkeys` to indicate that the command category permissions apply to all keys in the cache instance.

### How to specify permissions

To specify permissions, you need to create a string to save as your custom access policy, then assign the string to your Azure Cache for Redis user.

The following list contains some examples of permission strings for various scenarios.

- Allow application to execute all commands on all keys

   Permissions string: `+@all allkeys`

- Allow application to execute only _read_ commands

    Permissions string: `+@read *`

- Allow application to execute _read_ command category and set command on keys with prefix `Az`.

    Permissions string: `+@read +set ~Az*`

## Configure a custom data access policy for your application

1. In the Azure portal, select the Azure Cache for Redis instance that you want to configure Microsoft Entra token based authentication for.

1. From the Resource menu, select **(PREVIEW) Data Access configuration**.

   :::image type="content" source="media/cache-configure-role-based-access-control/cache-data-access-configuration.png" alt-text="Screenshot showing Data Access Configuration highlighted in the Resource menu.":::

1. Select **Add** and choose **New Access Policy**.

   :::image type="content" source="media/cache-configure-role-based-access-control/cache-add-custom-policy.png" alt-text="Screenshot showing a form to add custom access policy.":::

1. Provide a name for your access policy.

1. [Configure Permissions](#permissions-for-your-data-access-policy) as per your requirements.

1. From the Resource menu, select **Advanced settings**.

1. If not checked already, Check the box labeled **(PREVIEW) Enable Microsoft Entra Authorization** and select **OK**. Then, select **Save**.

   :::image type="content" source="media/cache-azure-active-directory-for-authentication/cache-azure-ad-access-authorization.png" alt-text="Screenshot of Microsoft Entra ID access authorization.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes.**

   > [!IMPORTANT]
   > Once the enable operation is complete, the nodes in your cache instance reboots to load the new configuration. We recommend performing this operation during your maintenance window or outside your peak business hours. The operation can take up to 30 minutes.

<a name='configure-your-redis-client-to-use-azure-active-directory'></a>

## Configure your Redis client to use Microsoft Entra ID

Now that you have configured Redis User and Data access policy for configuring role based access control, you need to update your client workflow to support authenticating using a specific user/password. To learn how to configure you client application to connect to your cache instance as a specific Redis User, see [Configure your Redis client to use Azure AD.](cache-azure-active-directory-for-authentication.md#configure-your-redis-client-to-use-azure-active-directory)

## Next steps

- [Use Microsoft Entra ID for cache authentication](cache-azure-active-directory-for-authentication.md)
