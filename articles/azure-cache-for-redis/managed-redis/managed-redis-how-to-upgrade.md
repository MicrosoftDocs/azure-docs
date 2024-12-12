---
title: How to upgrade the Redis version of Azure Managed Redis (preview)
description: Learn how to upgrade the version of Azure Managed Redis.

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/15/2024
---

# How to upgrade the version of your Azure Managed Redis (Preview) instance

New versions of Redis server software are frequently released with new features, more commands, and stability improvements. Maintaining Redis instances using the latest version of Redis is a good way to ensure that you get the best possible Redis experience.

This article details how to upgrade your Redis instance to the latest version of Redis available in Azure Managed Redis (preview).

> [!IMPORTANT]
> Following the [standard Redis versioning](https://redis.io/docs/about/releases/), this article only covers upgrades to the _major_ version of Redis, not the _minor_ or _patch_ versions. Updates to the minor and patch versions are made automatically during the normal patching cycle each month.
>

### Current versions

This table contains the information for which Redis version are available in each tier.

| Tier                         |        Available Redis version       |
|:------------------------------------------------- |:------------------------------------:|
| Memory Optimized, Balanced, Compute Optimized     |   Redis 7.4 (Preview) |
| Flash Optimized | Redis 7.4 (preview)  |

## How to upgrade

You have two options for upgrades: automatic and manual. Automatic upgrades are part of the standard patching process. With the manual process, you can start upgrades that are available outside the normal automatic process.

### Automatic upgrade

Redis server version upgrades are made automatically as a part of the standard monthly patching process. Upgrades to the latest version of Redis occur once that Redis version reaches general availability (GA) on Azure.

At GA of a new version, your Redis instance is automatically upgraded to the new GA version unless you defer it before general availability. For more information on deferring an upgrade, see [Defer Upgrades](#defer-upgrades).

### Start an upgrade manually

As an alternative to automatic upgrade, you can also manually upgrade to the latest Redis version. Manual upgrades provide two other benefits instead waiting for the automatic upgrade to occur: a) You control when the upgrade occurs, and b) you can upgrade to preview releases of Redis server.

1. In the portal, navigate to the **Overview** of the cache using the Resource menu. Then, choose **Upgrade** in the working pane to start an upgrade.

    :::image type="content" source="media/managed-redis-how-to-upgrade/managed-redis-upgrade-overview.png" alt-text="Screenshot showing the upgrade pane, the current version, and the available version." :::

1. You then see an **Upgrade Redis** pane that shows you the current Redis version, and any version that you can upgrade to. As noted in the pane, upgrading is irreversible. You can't downgrade. To confirm and begin the upgrade process, select **Start Upgrade**.

    > [!WARNING]
    > Once your Redis instance has been upgraded, it cannot be downgraded to the previous version.
    >

    :::image type="content" source="media/managed-redis-how-to-upgrade/managed-redis-upgrade-pane.png" alt-text="Screenshot showing overview selected in the resource menu and pane titled Upgrade Redis.":::

    If you're already running the latest version of Redis software available, the **Upgrade** button is disabled.

### Defer upgrades

You can defer an automatic upgrade of a new version of Redis software by as many as 90 days. This option gives you time to test new versions and ensure that everything works as expected. The cache is then upgraded either 90 days after the new Redis version reaches GA, or whenever you trigger the upgrade manually.

The deferral option must be selected before a new Redis version reaches GA for it to take effect before the automatic upgrade occurs.

To defer upgrades to your cache, navigate to the **Advanced Settings** on the Resource menu, and select the **Defer Redis DB version updates** box.

:::image type="content" source="media/managed-redis-how-to-upgrade/managed-redis-defer-upgrade.png" alt-text="Screenshot showing Advanced settings selected in the Resource menu and a red box around Defer Redis DB version updates.":::

> [!IMPORTANT]
> Selecting the option to defer upgrades only applies to the next automatic upgrade event. Caches that have already been upgraded cannot be downgraded using the defer option.
>

## Considerations before upgrading Redis versions

Each new Redis version is intended to be a seamless upgrade from previous versions with backwards-compatibility as a design principle. However, small changes and bug fixes do occur which can cause application changes. Being conscious of these changes is always a good idea.

### Client version

If you're using an outdated Redis client, new commands or Redis features can't be supported properly. We always recommend updating to the latest stable version of your Redis client, as newer versions often have stability and performance improvements as well. For more information on configuring your client library, see [best practices using client libraries](../cache-best-practices-client-libraries.md).

### Breaking changes

Each version of Redis often has a few minor bug fixes that can present breaking changes. If you have concerns, we recommend reviewing the Redis 7.4 release notes before upgrading your Redis version:

- [Redis 7.4 release notes](https://raw.githubusercontent.com/redis/redis/7.4/00-RELEASENOTES)
