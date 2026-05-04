---
title: Migrate with tooling - Migrate from Redis Enterprise to Azure Managed Redis
description: Learn how to use migration tooling to move from Azure Cache for Redis Enterprise tier to Azure Managed Redis.
ms.date: 04/14/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis Enterprise
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Enterprise instances, I want to use migration tooling to simplify my migration to Azure Managed Redis.
---

# Migrate with tooling - Redis Enterprise to Azure Managed Redis

Azure provides built-in migration tooling that updates your Azure Cache for Redis Enterprise instance into an Azure Managed Redis instance. After the migration completes, your Redis Enterprise hostname will point to an Azure Managed Redis instance, and your client applications reconnect automatically to the Azure Managed Redis instance using the same hostname and access key as your Redis Enterprise instance. Once you validate the migration, update your client applications to use the new Azure Managed Redis hostname.

[!INCLUDE [Redis Enterprise migration agent skill](../includes/redis-enterprise-migration-agent-skill.md)]

Use these steps if you choose migration tooling for Enterprise caches using Azure Portal.

## Step 1: Update deployment scripts and create new Azure Managed Redis instance

1. Once you have identified the appropriate Azure Managed Redis SKU, update your deployment scripts (such as ARM templates, Bicep files, or Terraform configurations) to provision Azure Managed Redis instead of Azure Cache for Redis Enterprise.
1. Use the [size guidance](migrate-redis-enterprise-understand.md#choose-the-right-azure-managed-redis-size) to select the right size (same size or bigger than the existing cache) and performance tier.
1. Create the instance by following the [Quickstart: Create an Azure Managed Redis Instance](../quickstart-create-managed-redis.md).

## Step 2a: Configure Entra ID authentication (optional)

If you use Microsoft Entra ID authentication, configure required managed identities and permissions on the target Azure Managed Redis instance before migration.

## Step 2b: Data migration (optional)

If you need your data to be copied over to your new Azure Managed Redis instance, review multiple [data migration strategies](migrate-redis-enterprise-self-service.md#step-3-migrate-your-data).

## Step 3: Validate and start migration

1. Add the resource tag `amr-migration-data-preserve: false` to your Azure Cache for Redis Enterprise instance to explicitly disable best-effort data sync. This tag is required before migration can proceed. We recommend setting the resource tag to `False` as it will ensure migration is faster with more probability of success. Data sync is not supported yet.

    ```Azure CLI
    az tag update --resource-id --operation Merge --tags amr-migration-data-preserve=False
    ```    
1. In the Azure portal, use the **Resource** menu for your Azure Cache for Redis Enterprise instance and select **Migrate to Azure Managed Redis** from the top level command bar.

    :::image type="content" source="../media/migration-tooling/redis-enterprise-migration-tooling.png" alt-text="Screenshot showing the migration tooling in the Azure portal.":::
1. In the migration pane, select the existing Azure Managed Redis SKU to migrate to, then select **Migrate**. This will start migration process for your Azure Cache for Redis Enterprise instance.

## Step 4: During migration

1. During migration, cache status changes to **Updating**. No other management operations can be performed until migration completes.
1. Your client application will experience a connection blip, similar to maintenance experience. When your client application reconnects, it will connect to Azure Managed Redis instance.

## Step 5: Ensure success and delete old Azure Cache for Redis Enterprise hostname

1. After migration completes, validate that your application behaves as expected with the migrated endpoint.
Note that the Azure Cache for Redis Enterprise hostname will continue to point to the new Azure Managed Redis instance even after the migration is complete.
1. Update applications to use the Azure Managed Redis hostname (`<cachename>.<region>.redis.azure.net`) and retire the unused Azure Cache for Redis Enterprise hostname.


## Related content

- [Migrate from Redis Enterprise to Azure Managed Redis](migrate-redis-enterprise-overview.md)
- [Understand the differences](migrate-redis-enterprise-understand.md)
- [Plan migration execution](migrate-redis-enterprise-self-service.md)
- [What is Azure Managed Redis?](../overview.md)
