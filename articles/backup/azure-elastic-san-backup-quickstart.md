---
title: Quickstart - Back up Azure Elastic SAN using the Azure portal
description: Learn how to quickly configure backup for Azure Elastic SAN using Azure Backup in the Azure portal.
ms.topic: quickstart
ms.date: 08/20/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to quickly configure backup for Azure Elastic SAN using the Azure portal, so that I can protect Elastic SAN volumes."
---

# Quickstart: Back up Azure Elastic SAN using the Azure portal

This quickstart shows you how to configure backup for Azure Elastic SAN volumes using Azure Backup.

## Prerequisites

Before you start, ensure that:

- You have an existing Elastic SAN volume, or you [create an Elastic SAN instance and volume](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- The Elastic SAN volume is in a [supported region](azure-elastic-san-backup-support-matrix.md#supported-regions).
- You have a Backup vault in the same subscription. You can use an existing vault, or [create a Backup vault](create-manage-backup-vault.md#create-backup-vault).

## Create a backup policy

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency** > **Protection policies**.
1. Select **+ Create Policy** > **Create Backup Policy**.
1. On the **Basics** tab, enter a policy name, and then select **Elastic SAN** as the datasource type.
1. On the **Schedule + retention** tab, configure the backup schedule and retention duration.
1. Select **Review + create**, and then select **Create**.

## Configure backup

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**, and then select **+ Configure protection**.
1. Select **Azure** as the resource management type, **Elastic SAN volumes** as the datasource type, and **Azure Backup** as the solution.
1. Select the Backup vault and backup policy.
1. Add the Elastic SAN instance and volumes that you want to protect.
1. Validate that the required permissions are assigned.
1. Select **Review + configure**, and then select **Configure Backup**.

After the configuration completes, Azure Backup runs backups based on the policy schedule. You can also [run an on-demand backup](azure-elastic-san-backup-manage.md#run-an-on-demand-backup).

## Next steps

- [Configure Azure Elastic SAN backup using the Azure portal](azure-elastic-san-backup-configure.md)
- [Restore Azure Elastic SAN backup using the Azure portal](azure-elastic-san-backup-restore.md)
- [Manage Azure Elastic SAN backups using the Azure portal](azure-elastic-san-backup-manage.md)
