---
title: Concept of Immutable Vault for Azure Backup
description: This article explains the concept of an immutable vault for Azure Backup, and how it helps protect data from malicious actors.
ms.topic: overview
ms.service: azure-backup
ms.custom: references_regions, engagement-fy24, ignite-2024
ms.date: 09/09/2026
ms.update-cycle: 1095-days
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a data protection administrator, I want to implement and lock an immutable vault for backup data so that I can ensure the integrity and recoverability of backups against malicious deletion or modification."
---

# Immutable vault for Azure Backup

An immutable vault for Azure Backup can help you protect your backup data by blocking any operations that could lead to loss of recovery points. You can lock the immutable vault setting to make it irreversible and use WORM (write once, read many) storage for backups, to prevent any malicious actors from disabling immutability and deleting backups.

## Support matrix

| Category | Support |
| --- | --- |
| Vault types | Recovery Services vault, Backup vault |
| Regions | Immutability (enabled and locked) is generally available in all Azure public and US government regions. |
| Workloads | Immutability is supported for all workloads that Azure Backup protects. |
| Time-based immutability | Supported for Recovery Services vaults. |

### WORM storage support

Azure Backup is introducing the use of WORM storage in its vaults as part of enforcing locked immutability. Where WORM storage isn't yet supported for a region or workload, locked immutability continues to be enforced by the backup service, and backups transition to WORM-backed storage automatically once it becomes available, with no user action or data movement required.

| Category | Details |
| --- | --- |
| Recovery Services vault regions | Generally available in: Australia Central 2, Switzerland West, South Africa West, Korea Central, Germany North, Korea South, Spain Central, Israel Central, India South, India West, Mexico Central, Norway West, Poland Central, Japan East, Japan West, Brazil South East, Canada North, Qatar Central, Switzerland North, West US 3. |
| Backup vault regions | Generally available in all Azure public regions. Not available in national cloud regions. |
| Supported workloads - Recovery Services vault | Azure Virtual Machines, SQL Server on Azure Virtual Machines, SAP HANA on Azure Virtual Machines, Azure Files, Azure Backup (server and agent), System Center Data Protection Manager. |
| Supported workloads - Backup vault | Azure Kubernetes Service, Azure Database for PostgreSQL, Azure Cosmos DB. |
| Other regions and workloads | Locked immutability is enforced by the backup service. Backups automatically transition to WORM-backed storage after it becomes available in that region, with no user action and no data movement required. |

## Considerations before you start

- Enabling immutability blocks you from performing specific operations on the vault and its protected items.
- Enabling immutability is a reversible operation for a vault. However, you can choose to make the operation irreversible to prevent malicious actors from disabling the vault and performing destructive operations.
- Immutability applies to all the data in a vault. All instances that are protected in the vault have immutability applied to them.
- Immutability doesn't apply to operational backups for resources like blobs, files, and disks.
- Ensure that the resource provider is registered in your subscription for `Microsoft.RecoveryServices`. Otherwise, zone-redundant and vault property options like immutability settings aren't accessible.
- Enable immutability based on the backup policy retention, or for a specific duration that's independent of the policy retention. Learn more about the [immutability enablement options](#immutability-enablement-options).

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

## Immutability enablement options

When you enable immutability for a vault, choose how long recovery points remain immutable:

- **Enable based on backup policy** (default): Recovery points are immutable for as long as the associated backup policy retains them. The immutability duration always matches the policy retention period, so any reduction in policy retention that deletes an existing recovery point is blocked.

- **Enable for specific duration**: Recovery points are immutable for a fixed number of days that you configure (for example, 30 days), irrespective of the overall retention period defined in the backup policy. Once the configured immutability duration elapses, the recovery points continue to exist as per the backup policy retention, but they're no longer immutable and you can delete them through normal retention or manual actions.

  For example, if a backup policy retains recovery points for 180 days and you configure immutability for a specific duration of 30 days, recovery points remain immutable for the first 30 days after creation. After that, they still exist until the 180-day retention expires, but they're no longer protected by immutability.

  When you use this option, Azure Backup restricts you from reducing the backup policy retention period less than the configured immutability duration (30 days in this example). You can reduce retention to the immutability duration value, but not to a value lesser than it.

  This option gives you flexibility to balance data protection with storage costs, especially when you lock immutability, because you aren't required to keep every recovery point immutable for the entire retention period.

>[!NOTE]
  >The **Enable for specific duration** option applies the configured duration uniformly to all recovery points in the vault. Ensure the configured duration meets your compliance and recovery requirements before you lock immutability, because locking makes the setting irreversible.

## Restricted operations

Immutability prevents you from performing the following operations on the vault that could lead to loss of data:

# [Recovery Services vault](#tab/recovery-services-vault)

| Operation type | Description |
| --- | --- |
| Stop protection with deletion of data | A protected item can't have its recovery points deleted before their respective expiry dates. However, you can still stop protection of the instances while retaining data forever or until their expiry. |
| Modify a backup policy to reduce retention | Any actions that reduce the retention period in a backup policy are disallowed on an immutable vault. However, you can make policy changes that result in the increase of retention. You can also make changes to the schedule of a backup policy. <br><br>  The increase in retention can't be applied if any item has its backups suspended. <br><br> If immutability is enabled for a [specific duration](#immutability-enablement-options), retention can be reduced only up to the configured immutability duration, and not to a value lesser than it. |
| Change a backup policy to reduce retention | Any attempt to replace a backup policy associated with a backup item with another policy that has retention lower than the existing one is blocked. However, you can replace a policy with the one that has higher retention. <br><br> If immutability is enabled for a [specific duration](#immutability-enablement-options), you can replace the policy with one that has retention lesser than the existing one, as long as the new retention isn't lesser than the configured immutability duration. |

# [Backup vault](#tab/backup-vault)

| Operation type | Description |
| --- | --- |
| Stop protection with deletion of data | A protected item can't have its recovery points deleted before their respective expiry dates. However, you can still stop protection of the instances while retaining data forever or until their expiry. |

---

## Related content

- Learn [how to manage operations of Azure Backup vault immutability](backup-azure-immutable-vault-how-to-manage.md).
