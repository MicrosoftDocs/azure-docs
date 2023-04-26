---
title: Configure role-based access control with Data Access Policy
titleSuffix: Azure Cache for Redis
description: Learn how to configure role-based access control with Data Access Policy.
author: flang-msft

ms.service: cache
ms.topic: conceptual
ms.date: 04/25/2023
ms.author: franlanglois

---

## Configure role-based access control with Data Access Policy

Managing access to your Azure Cache for Redis instance is critical to ensure that the right users have access to the right set of data and commands. In Redis version 1, the [Access Control List](https://redis.io/docs/management/security/acl/) (ACL) was introduced, which allows limits to be placed on users in terms of commands that can be executed and the keys that can be accessed. For example, you can disable some users from deleting keys in the cache with the [DEL](https://redis.io/commands/del/) command.

Azure Cache for Redis now integrates this ACL functionality with Azure Active Directory (Aazure AD) to allow you to configure your data access policies for your application's service principal and managed identity.

Azure Cache for Redis offers three built-in access policies: *Owner*, *Contributor*, and *Reader*. If the built-in access policies do not satisfy your data protection and isolation requirements, you can create and use your own custom data access policy as described in [Configure custom data access policy](\<link to Configure customer data access policy\>)

### Scope of Availability

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|------------------|--------------------------|------------------------------|
| **Availability** | Yes (preview)            | No                           |
  
### Prerequisites and Limitations

- Redis ACL and Data Access Policies are not supported on Azure Cache for Redis instances that run Redis version 1.
- Redis ACL and Data Access Policies are not supported on Azure Cache for Redis instances that depend on [Cloud Services](cache-faq.md#caches-with-a-dependency-on-cloud-services--classic).
- Some Redis commands are [blocked](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

### Permissions for your data access policy

As documented on [ACL | Redis](https://redis.io/docs/management/security/acl/), ACL in Redis version 1.1 allows configuring access permissions for two areas:

## Command categories

Redis has created groupings of commands such as administrative commands, dangerous commands, etc. to make setting permissions on a group of commands easier. These [commands](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis) are still blocked. The following groups are useful command categories that Redis supports. You can find the full list here.

- **admin** 
  - Administrative commands. Normal applications will never need to use these. Includes `MONITOR`, `SHUTDOWN`, etc.
- **dangerous** 
  - Potentially dangerous commands (each should be considered with care for various reasons). This includes `FLUSHALL`, `RESTORE`, `SORT`, `KEYS`, CLIENT,    DEBUG, INFO, CONFIG, etc.
- **keyspace** 
  - Writing or reading from keys, databases, or their metadata in a type agnostic way. Includes `DEL`, `RESTORE`, `DUMP`, `RENAME`, `EXISTS`, `DBSIZE`, `KEYS`, `EXPIRE`, `TTL`, `FLUSHALL`, and more. Commands that may modify the keyspace, key, or metadata will also have the write category. Commands that only read the keyspace, key, or     metadata will have the read category.
- **pubsub** 
  - PubSub-related commands.
- **read** 
  - Reading from keys (values or metadata). Note that commands that don\'t interact with keys, will not have either read or write.
- **set** 
  - Data type: sets related.
- **sortedset** 
  - Data type: sorted sets related.
- **stream** 
  - Data type: streams related.
- **string** 
  - Data type: strings related.
- **write** 
  - Writing to keys (values or metadata).

## Keys
 
Keys allows you to control access to specific keys or groups of keys stored in the cache.

Use `\~\<pattern\>` to provide a pattern for keys. You can use `\~\*` or `allkeys` to indicate that the command category permissions apply to all keys in the cache instance.

## How to specify permissions

To specify permissions, you need to create a string to save as your custom access policy, then, assign the string to your Azure Cache for Redis user.

Below are some examples of permission strings for various scenarios.

1. Allow application to execute all commands on all keys

    Permissions string: \@all allkeys

1. Allow application to execute all commands on keys with prefix "*Az*"

    Permissions string: \@all \~Az\*

1. All my application to execute only *read* commands on all keys

     Permissions string: \@read allkeys

## Configure a custom data access policy for your application

1. In the Azure portal, select the Azure Cache for Redis instance that you want to configure AAD token based authentication for.

1. On the left side of the screen, select **(PREVIEW) Data Access Policy**.

<!-- > (ADD SCREENSHOT) -->

1. Click on "Add" button and choose "New Access Policy"

<!-- (ADD SCREENSHOT) -->

1. Provide a name for your access policy.

1. Configure Permissions as per your requirements. See \<
