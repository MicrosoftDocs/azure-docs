---
title: Upgrade Your Redis Version in Azure Managed Redis
description: Learn how to upgrade your Redis version in Azure Managed Redis.
ms.date: 05/18/2025
ms.topic: how-to
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Upgrade the Redis version of your Azure Managed Redis instance

New versions of Redis server software are frequently released with new features, more commands, and stability improvements. By maintaining your Azure Managed Redis instance with the latest version of Redis, you can ensure the best possible experience.

This article details how to upgrade your Redis instance in Azure Managed Redis to the latest available version.

> [!IMPORTANT]
> Following [standard Redis versioning](https://redis.io/about/releases/), this article only covers upgrades to the _major_ version of Redis, not the _minor_ or _patch_ versions. Updates to the minor and patch versions are made automatically during the normal patching cycle each month.
>

### Current versions

These Redis versions are available for each tier.

| Tier                         |        Available Redis version       |
|:------------------------------------------------- |:------------------------------------:|
| Memory Optimized, Balanced, Compute Optimized     |   Redis 7.4 |
| Flash Optimized | Redis 7.4 (preview)  |

## Upgrade options

You can choose from automatic or manual upgrades. Automatic upgrades are part of the standard patching process. With the manual process, you can start upgrades that are available outside the normal automatic process.

### Automatic upgrades

Redis server version upgrades are made automatically as a part of the standard monthly patching process. Upgrades to the latest version of Redis occur when that Redis version reaches general availability (GA) on Azure.

When a new version becomes generally available, your Redis instance is automatically upgraded to the new version unless you defer it ahead of time. For more information on deferring an upgrade, see [Defer upgrades](#defer-upgrades) in this article.

### Manual upgrades

You can also choose to manually upgrade to the latest Redis version. Manual upgrades provide two benefits:

- You control when the upgrade occurs.
- You can upgrade to preview releases of Redis.

   > [!WARNING]
   > After you upgrade your Redis instance, you can't downgrade it to the previous version.

1. In the portal, use the **Resource** menu to go to **Overview**. Select **Upgrade**.

1. An **Upgrading Redis** pane displays the current Redis version and the versions that you can upgrade to. To confirm and begin the upgrade process, select **Start upgrade**. (If you're already running the latest available version of Redis software, the **Start upgrade** button is unavailable.)

### Defer upgrades

You can defer an automatic upgrade of a new version of Redis software for up to 90 days. This option gives you time to test new versions and ensure that everything works as expected. The cache is upgraded either 90 days after the new Redis version reaches GA, or whenever you manually trigger the upgrade.

To prevent an automatic upgrade, select the deferral option before a new Redis version reaches GA.

Go to **Advanced settings** on the **Resource** menu, and select the box for **Defer Redis DB version updates**.

> [!IMPORTANT]
> When you select the option to defer upgrades, your selection only applies to the next automatic upgrade event. You can't use the defer button to downgrade caches that were already upgraded.

## Pre-upgrade considerations

Each new Redis version is intended to be a seamless upgrade from previous versions with backward compatibility as a design principle. However, small changes and bug fixes do occur, which can cause application changes. You should keep these changes in mind.

### Client version

When you use an outdated Redis client, new commands or Redis features aren't properly supported. We always recommend that you update to the latest stable version of your Redis client, because newer versions often have stability and performance improvements. For more information on configuring your client library, see [Best practices using client libraries](best-practices-client-libraries.md).

### Breaking changes

Each version of Redis often has a few minor bug fixes that can present breaking changes. If you have concerns, we recommend reviewing the [Redis 7.4 release notes](https://raw.githubusercontent.com/redis/redis/7.4/00-RELEASENOTES) before you upgrade your Redis version.
