---
title: What's New in Azure Cache for Redis
description: Recent updates for Azure Cache for Redis
author: flang-msft

ms.custom: references_regions
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 09/29/2023

---

# What's New in Azure Cache for Redis

## October 2023

### Flush data operation for Basic, Standard and Premium Caches (preview)

Basic, Standard, and Premium tier caches now support a built-in _flush_ operation that can be started at the control plane level. Use the _flush_ operation with your cache executing the `FLUSH ALL` command through Portal Console or _redis-cli_.

For more information, see [flush data operation](cache-administration.md#flush-data-preview).

### Update channel for Basic, Standard and Premium Caches (preview)

With Basic, Standard or Premium tier caches, you can choose to receive early updates by configuring the "Preview" or the "Stable" update channel.

For more information, see [update channels](cache-administration.md#update-channel-and-schedule-updates).

## September 2023

### Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

To meet the industry-wide push toward the exclusive use of Transport Layer Security (TLS) version 1.2 or later, Azure Cache for Redis is moving toward requiring the use of TLS 1.2 in October 2024.

As a part of this effort, you can expect the following changes to Azure Cache for Redis:

- _Phase 1_: Azure Cache for Redis stops offering TLS 1.0/1.1 as an option for MinimumTLSVersion setting for new cache creates. Existing cache instances won't be updated at this point. You can still use the Azure portal or other management APIs to [change the minimum TLS version](cache-configure.md#access-ports) to 1.0 or 1.1 for backward compatibility.
- _Phase 2_: Azure Cache for Redis stops supporting TLS 1.1 and TLS 1.0 starting October 1, 2024. After this change, your application must use TLS 1.2 or later to communicate with your cache. The Azure Cache for Redis service is expected to be available while we update the MinimumTLSVerion for all caches to 1.2.

For more information, see [Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis](cache-remove-tls-10-11.md).

## June 2023

Azure Active Directory for authentication and role-based access control is available across regions that support Azure Cache for Redis.

## May 2023

### Azure Active Directory-based authentication and authorization (preview)

Azure Active Directory (Azure AD) based [authentication and authorization](cache-azure-active-directory-for-authentication.md) is now available for public preview with Azure Cache for Redis. With this Azure AD integration, users can connect to their cache instance without an access key and use [role-based access control](cache-configure-role-based-access-control.md) to connect to their cache instance.

This feature is available for Azure Cache for Redis Basic, Standard, and Premium SKUs. With this update, customers can look forward to increased security and a simplified authentication process when using Azure Cache for Redis.

### Support for up to 30 shards for clustered Azure Cache for Redis instances

Azure Cache for Redis now supports clustered caches with up to 30 shards. Now, your applications can store more data and scale better with your workloads.

For more information, see [Configure clustering for Azure Cache for Redis instance](cache-how-to-premium-clustering.md#azure-cache-for-redis-now-supports-up-to-30-shards-preview).

## April 2023

### 99th percentile latency metric (preview)

A new metric is available to track the worst-case latency of server-side commands in Azure Cache for Redis instances. Latency is measured by using `PING` commands and tracking response times. This metric can be used to track the health of your cache instance and to see if long-running commands are compromising latency performance.

For more information, see [Monitor Azure Cache for Redis](cache-how-to-monitor.md#list-of-metrics).

## March 2023

### In-place scale up and scale out for the Enterprise tiers (preview)

The Enterprise and Enterprise Flash tiers now support the ability to scale cache instances up and out without requiring downtime or data loss. Scale up and scale out actions can both occur in the same operation.

For more information, see [Scale an Azure Cache for Redis instance](cache-how-to-scale.md).

### Support for RedisJSON in active geo-replicated caches (preview)

Cache instances using active geo-replication now support the RedisJSON module.

For more information, see [Configure active geo-replication](cache-how-to-active-geo-replication.md).

### Flush operation for active geo-replicated caches (preview)

Caches using active geo-replication now include a built-in _flush_ operation that can be initiated at the control plane level. Use the _flush_ operation with your cache instead of the `FLUSH ALL` and `FLUSH DB` operations, which are blocked by design for active geo-replicated caches.

For more information, see [Flush operation](cache-how-to-active-geo-replication.md#flush-operation).

### Customer managed key (CMK) disk encryption (preview)

Redis data that is saved on disk can now be encrypted using customer managed keys (CMK) in the Enterprise and Enterprise Flash tiers. Using CMK adds another layer of control to the default disk encryption.

For more information, see [Enable disk encryption](cache-how-to-encryption.md).

### Connection event audit logs (preview)

Enterprise and Enterprise Flash tier caches can now log all connection, disconnection, and authentication events through diagnostic settings. Logging this information helps in security audits. You can also monitor who has access to your cache resource.

For more information, see [Enabling connection audit logs](cache-monitor-diagnostic-settings.md).

## November 2022

### Support for RedisJSON

Support for using the RedisJSON module has now reached General Availability (GA).

For more information, see [Use Redis modules with Azure Cache for Redis](cache-redis-modules.md).

### Redis 6 becomes default update

All versions of Azure Cache for Redis REST API, PowerShell, Azure CLI and Azure SDK, will create Redis instances using Redis 6 starting January 20, 2023. Previously, we announced this change would take place on November 1, 2022, but due to unforeseen changes, the date has now been pushed out to January 20, 2023.

For more information, see [Redis 6 becomes default for new cache instances](#redis-6-becomes-default-for-new-cache-instances).

## October 2022

### Enhancements for passive geo-replication

Several enhancements have been made to the passive geo-replication functionality offered on the Premium tier of Azure Cache for Redis.

- New metrics are available for customers to better track the health and status of their geo-replication link, including statistics around the amount of data that is waiting to be replicated. For more information, see [Monitor Azure Cache for Redis](cache-how-to-monitor.md).
  
  - Geo Replication Connectivity Lag (preview)
  - Geo Replication Data Sync Offset (preview)
  - Geo Replication Full Sync Event Finished (preview)
  - Geo Replication Full Sync Event Started (preview)

- Customers can now initiate a failover between geo-primary and geo-replica caches with a single selection or CLI command, eliminating the hassle of manually unlinking and relinking caches. For more information, see [Initiate a failover from geo-primary to geo-secondary](cache-how-to-geo-replication.md#initiate-a-failover-from-geo-primary-to-geo-secondary).

- A global cache URL is also now offered that automatically updates their DNS records after geo-failovers are triggered, allowing their application to manage only one cache address. For more information, see [Geo-primary URL](cache-how-to-geo-replication.md#geo-primary-url).

## September 2022

### Upgrade your Azure Cache for Redis instances to use Redis version 6 by June 30, 2023

On June 30, 2023, we'll retire version 4 for Azure Cache for Redis instances. Before that date, you need to [upgrade](cache-how-to-upgrade.md) any of your cache instances to version 6.

- All cache instances running Redis version 4 after June 30, 2023 will be upgraded automatically.
- All cache instances running Redis version 4 that have geo-replication enabled will be upgraded automatically after August 30, 2023.

We recommend that you [upgrade](cache-how-to-upgrade.md) your caches on your own to accommodate your schedule and the needs of your users to make the upgrade as convenient as possible.

For more information, see [Retirements](cache-retired-features.md).

### Support for managed identity in Azure Cache for Redis

Authenticating storage account connections using managed identity has now reached General Availability (GA).

For more information, see [Managed identity for storage](cache-managed-identity.md).

## August 2022

### RedisJSON module available in Azure Cache for Redis Enterprise  

The Enterprise and Enterprise Flash tiers of Azure Cache for Redis now support the **RedisJSON** module. This module adds native functionality to store, query, and search JSON-formatted data that allows you to store data more easily in a document-style format in Redis. By using this module, you simplify common use cases like storing product catalog or user profile data.  

The **RedisJSON** module implements the community version of the module so you can use your existing knowledge and workstreams. **RedisJSON** is  designed for use with the search functionality of **RediSearch**. Using both modules provides integrated indexing and querying of data. For more information, see [RedisJSON](https://aka.ms/redisJSON).

The **RediSearch** module is also now available for Azure Cache for Redis. For more information on using Redis modules in Azure Cache for Redis, see [Use Redis modules with Azure Cache for Redis](cache-redis-modules.md).

## July 2022

### Redis 6 becomes default for new cache instances

> [!IMPORTANT]
> Previously, we announced this change would take place on November 1, 2022. The new date is January 20th, 2023. The text has been updated to reflect the new date.

Beginning January 20, 2023, all versions of Azure Cache for Redis REST API, PowerShell, Azure CLI, and Azure SDK will create Redis instances using the latest stable version of Redis offered by Azure Cache for Redis by default. Previously, Redis version 4.0 was the default version used. However, as of October 2021, the latest stable Redis version offered in Azure Cache for Redis is 6.0.

>[!NOTE]
> This change does not affect any existing instances. It is only applicable to new instances created from January 20, 2023, and onward.
>
> The default Redis version that is used when creating a cache instance can vary because it is  based on the latest stable version offered in Azure Cache for Redis.

If you need a specific version of Redis for your application, we recommend using latest artifact versions as shown in the table. Then, choose the Redis version explicitly when you create the cache.

| Artifact | Version that  supports specifying Redis version  |
|---------|---------|
| REST API              | 2020-06-01 and newer |
| PowerShell            | 6.3.0 and newer |
| Azure CLI             | 2.27.0 and newer |
| Azure SDK for .NET  | 7.0.0 and newer |
| Azure SDK for Python | 13.0.0 and newer |
| Azure SDK  for Java  | 2.2.0 and newer |
| Azure SDK for JavaScript| 6.0.0 and newer |
| Azure SDK for Go    | v49.1.0 and newer |

## April 2022

### New metrics for connection creation rate

These two new metrics can help identify whether Azure Cache for Redis clients are frequently disconnecting and reconnecting, which can cause higher CPU usage and **Redis Server Load**.

- Connections Created Per Second
- Connections Closed Per Second

For more information, see [View cache metrics](cache-how-to-monitor.md#view-cache-metrics).

### Default cache change

On May 15, 2022, all new Azure Cache for Redis instances will use Redis 6 by default. You can still create a Redis 4 instance by explicitly selecting the version when you create an Azure Cache for Redis instance.

This change doesn't affect any existing instances. The change is only applicable to new instances created after May 15, 2022.

The default version of Redis that is used when creating a cache can change over time. Azure Cache for Redis might adopt a new version when a new version of open-source Redis is released. If you need a specific version of Redis for your application, we recommend choosing the Redis version explicitly when you create the cache.

## February 2022

### TLS Certificate Change

As of May 2022, Azure Cache for Redis rolls over to TLS certificates issued by DigiCert Global G2 CA Root. The current Baltimore CyberTrust Root expires in May 2025, requiring this change.

We expect that most Azure Cache for Redis customers aren't affected. However, your application might be affected if you explicitly specify a list of acceptable certificate authorities (CAs), known as _certificate pinning_.

For more information, read this blog that contains instructions on [how to check whether your client application is affected](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-cache-for-redis-tls-upcoming-migration-to-digicert-global/ba-p/3171086). We recommend taking the actions recommended in the blog to avoid cache connectivity loss.

### Active geo-replication for Azure Cache For Redis Enterprise GA

Active geo-replication for Azure Cache for Redis Enterprise is now generally available (GA).

Active geo-replication is a powerful tool that enables Azure Cache for Redis clusters to be linked together for seamless active-active replication of data. Your applications can write to one Redis cluster and your data is automatically copied to the other linked clusters, and vice versa. For more information, see this [post](https://aka.ms/ActiveGeoGA) in the _Azure Developer Community Blog_.

## January 2022

### Support for managed identity in Azure Cache for Redis in storage

Azure Cache for Redis now supports authenticating storage account connections using managed identity. Identity is established through Azure Active Directory, and both system-assigned and user-assigned identities are supported. Support for managed identity further allows the service to establish trusted access to storage for uses including data persistence and importing/exporting cache data.

For more information, see [Managed identity with Azure Cache for Redis](cache-managed-identity.md).

## October 2021

### Azure Cache for Redis 6.0 GA

Azure Cache for Redis 6.0 is now generally available. The new version includes:

- Redis Streams, a new data type
- Performance enhancements
- Enhanced developer productivity
- Boosts security

You can now use an append-only data structure, Redis Streams, to ingest, manage, and make sense of data that is continuously being generated.

Additionally, Azure Cache for Redis 6.0 introduces new commands: `STRALGO`, `ZPOPMIN`, `ZPOPMAX`, and `HELP` for performance and ease of use.

Get started with Azure Cache for Redis 6.0, today, and select Redis 6.0 during cache creation. Also, you can upgrade your existing Redis 4.0 cache instances.

### Diagnostics for connected clients

Azure Cache for Redis now integrates with Azure diagnostic settings to log information on all client connections to your cache. Logging and then analyzing this diagnostic setting helps you understand who is connecting to your caches and the timestamp of those connections. This data could be used to identify the scope of a security breach and for security auditing purposes. Users can route these logs to a destination of their choice, such as a storage account or Event Hubs.

For more information, see [Monitor Azure Cache for Redis data using diagnostic settings](cache-monitor-diagnostic-settings.md).

### Azure Cache for Redis Enterprise update

Active geo-replication public preview now supports:

- RediSearch Module: Deploy RediSearch with active geo-replication
- Five caches in a replication group. Previously, supported two caches.
- OSS clustering policy - suitable for high-performance workloads and provides better scalability.

## October 2020

### Azure TLS Certificate Change

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates don't comply with one of the CA/Browser Forum Baseline requirements. For full details, see [Azure TLS Certificate Changes](../security/fundamentals/tls-certificate-changes.md).

For more information on the effect to Azure Cache for Redis, see [Azure TLS Certificate Change](cache-best-practices-development.md#azure-tls-certificate-change).

## Next steps

If you have more questions, contact us through [support](https://azure.microsoft.com/support/options/).
