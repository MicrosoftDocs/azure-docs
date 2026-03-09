---
title: Concept of Immutable Vault for Azure Backup
description: This article explains the concept of an immutable vault for Azure Backup, and how it helps protect data from malicious actors.
ms.topic: overview
ms.service: azure-backup
ms.custom: references_regions, engagement-fy24, ignite-2024
ms.date: 06/19/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a data protection administrator, I want to implement and lock an immutable vault for backup data so that I can ensure the integrity and recoverability of backups against malicious deletion or modification."
---

# Immutable vault for Azure Backup

An immutable vault for Azure Backup can help you protect your backup data by blocking any operations that could lead to loss of recovery points. You can lock the immutable vault setting to make it irreversible. You can also use WORM (write once, read many) storage for backups to prevent any malicious actors from disabling immutability and deleting backups.

## Supported scenarios for WORM storage

- The immutability feature in an enabled and locked state is generally available in all Azure regions for Recovery Services vaults.
- Use of WORM storage for immutable vaults in a locked state is currently in general availability for Recovery Services vaults in the following regions: Australia Central 2, Switzerland West, South Africa West, Korea Central, Germany North, Korea South, Spain Central, Israel Central, India South, India West, Mexico Central, Norway West, Poland Central, Japan East.
- Use of WORM storage for immutable vaults in a locked state is currently in preview for Backup vaults in the following regions: South Africa West, Korea Central, India South, India West, Poland Central.
- In regions where WORM storage isn't yet generally available, backups with immutability enabled and locked will automatically transition to WORM-enabled storage after the feature becomes available. This transition requires no user action and involves no data movement.
- Use of WORM storage for immutable vaults in a locked state is applicable for the following workloads: Azure Virtual Machines, SQL Server on Azure Virtual Machines, SAP HANA on Azure Virtual Machines, Azure Files, Azure Backup (server and agent), System Center Data Protection Manager, Azure Kubernetes Service, Azure Database for PostgreSQL.

## Considerations before you start

- Immutable vaults are available in all Azure public and US government regions.
- Immutable vaults are supported for Recovery Services vaults and Backup vaults.
- Enabling immutability blocks you from performing specific operations on the vault and its protected items.
- Enabling immutability is a reversible operation for a vault. However, you can choose to make the operation irreversible to prevent malicious actors from disabling the vault and performing destructive operations.
- Immutability applies to all the data in a vault. All instances that are protected in the vault have immutability applied to them.
- Immutability doesn't apply to operational backups for resources like blobs, files, and disks.
- Ensure that the resource provider is registered in your subscription for `Microsoft.RecoveryServices`. Otherwise, zone-redundant and vault property options like immutability settings aren't accessible.

## How does immutability work?

Azure Backup stores data in isolation from production workloads. You can perform management operations to help manage your backups, including operations for deleting recovery points.

In certain scenarios, you might want to make the backup data immutable by preventing operations that, if used by malicious actors, could lead to the loss of backups. You can use the immutability setting on your vault to block such operations and help protect your backup data, even if malicious actors try to delete them to affect the recoverability of data.

## Making immutability irreversible

The immutability of a vault is a reversible setting. You can disable immutability if you need to allow the deletion of backup data.

However, we recommend that after you're satisfied with the impact of immutability, you lock the vault to make the immutable vault settings irreversible and enable WORM storage for backups. These choices help ensure that bad actors can't disable the immutability.

Immutable vault settings accept following three states:

| State of immutable vault setting | Description |
| --- | --- |
| **Disabled** | The vault doesn't have immutability enabled, and no operations are blocked. |
| **Enabled**  | The vault has immutability enabled and doesn't allow operations that could result in loss of backups. <br><br> The setting can be disabled. |
| **Enabled and locked** | The vault has immutability with WORM storage enabled and doesn't allow operations that could result in loss of backups. <br><br> The immutable vault setting is now locked and can't be disabled. <br><br> Immutability locking is irreversible. Ensure that your decision to use it is well informed. |

## Restricted operations

Immutability prevents you from performing the following operations on the vault that could lead to loss of data:

# [Recovery Services vault](#tab/recovery-services-vault)

| Operation type | Description |
| --- | --- |
| Stop protection with deletion of data | A protected item can't have its recovery points deleted before their respective expiry dates. However, you can still stop protection of the instances while retaining data forever or until their expiry. |
| Modify a backup policy to reduce retention | Any actions that reduce the retention period in a backup policy are disallowed on an immutable vault. However, you can make policy changes that result in the increase of retention. You can also make changes to the schedule of a backup policy. <br><br>  The increase in retention can't be applied if any item has its backups suspended.  |
| Change a backup policy to reduce retention | Any attempt to replace a backup policy associated with a backup item with another policy that has retention lower than the existing one is blocked. However, you can replace a policy with the one that has higher retention. |

# [Backup vault](#tab/backup-vault)

| Operation type | Description |
| --- | --- |
| Stop protection with deletion of data | A protected item can't have its recovery points deleted before their respective expiry dates. However, you can still stop protection of the instances while retaining data forever or until their expiry. |

---

## Related content

- Learn [how to manage operations of Azure Backup vault immutability](backup-azure-immutable-vault-how-to-manage.md).
