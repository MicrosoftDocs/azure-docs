---
title: Migration options - Migrate from Redis Enterprise to Azure Managed Redis
description: Explore the available migration options for moving from Azure Cache for Redis Enterprise tier to Azure Managed Redis.
ms.date: 04/14/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis Enterprise
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Enterprise instances, I want to understand the migration options available to me when moving to Azure Managed Redis.
---

# Migration options - Redis Enterprise to Azure Managed Redis

This article describes the available migration options for moving from Azure Cache for Redis Enterprise tier to Azure Managed Redis.

[!INCLUDE [Redis Enterprise migration agent skill](../includes/redis-enterprise-migration-agent-skill.md)]

There are two migration paths to consider. We recommend **Option 1** for most customers.

## Option 1: (Recommended) Self-service migration

In this approach, you create a new Azure Managed Redis instance, migrate your data to it, update your applications to point to the new instance, and then delete the old Azure Cache for Redis Enterprise instance.

**Why this is recommended:**

- **Full control.** You decide exactly when to cut over, and you can test the new instance before switching production traffic. If you have multiple applications connecting to a shared Redis instance, you can choose to migrate one application at a time.
- **Minimal downtime.** By using a data sync strategy (such as dual-write or export/import), you can keep both caches running in parallel and switch over with minimal disruption.
- **Independent validation.** You can verify the new Azure Managed Redis instance works correctly with your application before decommissioning the old cache.
- **Works with geo-replicated caches.** You can now add an Azure Managed Redis instance to your geo-replication group of Redis Enterprise instances one at a time and remove corresponding Redis Enterprise instances from the geo-replication group. This ensures that geo-replication continues to work, and migration can be performed without having to unlink any caches.

The [Self-service migration](migrate-redis-enterprise-self-service.md) article provides step-by-step instructions for this approach, including multiple [data migration strategies](migrate-redis-enterprise-self-service.md#step-3-migrate-your-data).

## Option 2: Use migration tooling 

Azure provides built-in migration tooling that transforms your existing Azure Cache for Redis Enterprise instance into Azure Managed Redis instance, while keeping the same hostname and access key, so your client applications reconnect automatically to the Azure Managed Redis instance using the same hostname and access key. After you validate the migration, update your client applications to use the new Azure Managed Redis hostname and decommission the old Azure Cache for Redis Enterprise hostname

> [!IMPORTANT]
> Review the limitations below carefully before choosing this approach.

### Limitations

- **No control over when cutover happens.** You can use the tool to initiate migration, but have no control on when the traffic cutover exactly happens during the migration.
- **All client applications impacted simultaneously.** All the client applications that connect to the migrating Redis instance will migrate simultaneously. You cannot migrate one application or service at a time.
- **Data sync not supported.** This tooling will orchestrate hostname/endpoint migration but does not migrate any data.
- **No support rollback.** Once the migration begins, it cannot be paused, canceled or rolled back.
- **Limited window to keep both hostnames.** Once migration is successful, we highly recommend you update your applications to use the new Azure Managed Redis hostname. The hostname from your old Azure Cache for Redis Enterprise instance will be automatically deleted in future.
- **Temporary management lock during migration.** While status is **Migrating**, other management operations are blocked until migration completes.
- **Geo-replicated caches not supported.**

The [Migration using tooling](migrate-redis-enterprise-with-tooling.md) article provides step-by-step instructions for this approach, including multiple [data migration strategies](migrate-redis-enterprise-self-service.md#step-3-migrate-your-data).

## Related content

- [Migrate from Redis Enterprise to Azure Managed Redis](migrate-redis-enterprise-overview.md)
- [Understand the differences](migrate-redis-enterprise-understand.md)
- [Plan migration execution](migrate-redis-enterprise-self-service.md)
- [What is Azure Managed Redis?](../overview.md)
