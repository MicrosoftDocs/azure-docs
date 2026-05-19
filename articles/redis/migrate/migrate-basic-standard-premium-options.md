---
title: Migration options - Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis
description: Explore the available migration options for moving from Azure Cache for Redis Basic, Standard, and Premium tiers to Azure Managed Redis.
ms.date: 03/26/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Basic, Standard, or Premium instances, I want to understand the migration options available to me when moving to Azure Managed Redis.
---

# Migration options - Basic, Standard, and Premium tiers to Azure Managed Redis

This article describes the available migration options for moving from Azure Cache for Redis Basic, Standard, and Premium tiers to Azure Managed Redis.

[!INCLUDE [Redis migration agent skill](../includes/redis-migration-agent-skill.md)]

There are two migration paths to consider. We recommend **Option 1** for most customers.

## Option 1: (Recommended) Self-service migration

In this approach, you create a new Azure Managed Redis instance, migrate your data to it, update your applications to point to the new instance, and then delete the old Azure Cache for Redis instance.

**Why this is recommended:**

- **Full control.** You decide exactly when to cut over, and you can test the new instance before switching production traffic. If you have multiple applications connecting to a shared Redis instance, you can choose to migrate one application at a time.
- **Minimal downtime.** By using a data sync strategy (such as dual-write or export/import), you can keep both caches running in parallel and switch over with minimal disruption.
- **Independent validation.** You can verify the new Azure Managed Redis instance works correctly with your application before decommissioning the old cache.

The [Self-service migration](migrate-basic-standard-premium-self-service.md) article provides step-by-step instructions for this approach, including multiple [data migration strategies](migrate-basic-standard-premium-self-service.md#step-2-migrate-your-data).

## Option 2: Use migration tooling (preview)

Azure provides built-in migration tooling (preview) that automates endpoint migration from your existing Azure Cache for Redis instance to a precreated Azure Managed Redis instance. After you create a new Azure Managed Redis instance and initiate the migration, the tooling updates your Azure Cache for Redis hostname to point to Azure Managed Redis, so your client applications reconnect automatically to the Azure Managed Redis instance using the same hostname and access key. After you validate the migration, delete the old Azure Cache for Redis instance and update your client applications to use the new Azure Managed Redis hostname.


> [!IMPORTANT]
> Review the limitations below carefully before choosing this approach.

### Limitations

- **Precreated target Azure Managed Redis required.** You choose and create the Azure Managed Redis instance before migration begins.
- **No control over when cutover happens.** You can use the tool to initiate migration, but have no control on when the traffic cutover exactly happens during the migration.
- **All client applications impacted simultaneously.** All the client applications that connect to the migrating Redis instance will migrate simultaneously. You cannot migrate one application or service at a time.
- **Data sync not supported.** This tooling will orchestrate hostname/endpoint migration but does not migrate any data. 
- **Limited window for rollback.** This flow supports cancellation or rollback after migration starts. However, once migration is successful, you will have limited time window to verify your applications are working as expected and perform any rollback if required.
- **Limited window to keep both hostnames.** Once migration is successful, we highly recommend you update your applications to use the new Azure Managed Redis hostname. The hostname from your old Azure Cache for Redis instance will be automatically deleted in future.
- **Temporary management lock during migration.** While status is **Migrating**, other management operations are blocked until migration completes.
- **Private endpoint not supported.** Caches with private endpoints are not supported.
- **Virtual network injected caches not supported.**
- **Geo-repplicated caches not supported.**
- **Not all cache configurations are copied over.** Configurations or properties like managed identities, firewall rules, persistence settings, update schedules, keyspace notifications are not copied over to the new Azure Managed Redis instance. You will need to configure Azure Managed Redis with the right configuration during creation.


The [Migration using tooling](migrate-basic-standard-premium-with-tooling.md) article provides step-by-step instructions for this approach, including multiple [data migration strategies](migrate-basic-standard-premium-self-service.md#step-2-migrate-your-data).

## Related content

- [Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis](migrate-basic-standard-premium-overview.md)
- [Understand the differences](migrate-basic-standard-premium-understand.md)
- [Plan migration execution](migrate-basic-standard-premium-self-service.md)
- [What is Azure Managed Redis?](../overview.md)
