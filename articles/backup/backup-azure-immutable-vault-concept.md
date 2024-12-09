---
title: Concept of Immutable vault for Azure Backup
description: This article explains about the concept of Immutable vault for Azure Backup, and how it helps in protecting data from malicious actors.
ms.topic: overview
ms.service: azure-backup
ms.custom: references_regions, engagement-fy24, ignite-2024
ms.date: 12/09/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Immutable vault for Azure Backup

Immutable vault can help you protect your backup data by blocking any operations that could lead to loss of recovery points. Further, you can lock the Immutable vault setting to make it irreversible and use WORM storage for backups to prevent any malicious actors from disabling immutability and deleting backups.

## Supported scenarios for WORM storage

- Use of WORM storage for immutable vaults in locked state is currently in GA for Recovery Services Vaults in the following regions: Australia Central 2, Switzerland West, South Africa West, Korea Central, Germany North, Korea South, Spain Central.
- Use of WORM storage for immutable vaults in locked state is applicable for the following workloads: Azure Virtual machines, SQL in Azure VM, SAP HANA in Azure VM, Azure Backup Server, Azure Backup Agent, DPM.

## Before you start

- Immutable vault is available in all Azure public and US Government regions.
- Immutable vault is supported for Recovery Services vaults and Backup vaults.
- Enabling Immutable vault blocks you from performing specific operations on the vault and its protected items. See the [restricted operations](#restricted-operations).
- Enabling immutability for the vault is a reversible operation. However, you can choose to make it irreversible to prevent any malicious actors from disabling it (after disabling it, they can perform destructive operations). Learn about [making Immutable vault irreversible](#making-immutability-irreversible).
- Immutable vault applies to all the data in the vault. Therefore, all instances that are protected in the vault have immutability applied to them.
- Immutability doesn't apply to operational backups, such as operational backup of blobs, files, and disks.

>[!Note]
>Ensure that the resource provider is registered in your subscription for `Microsoft.RecoveryServices`, otherwise Zone-redundant and vault property options like “Immutability settings” will not be accessible.

## How does immutability work?

While Azure Backup stores data in isolation from production workloads, it allows performing management operations to help you manage your backups, including those operations that allow you to delete recovery points. However, in certain scenarios, you may want to make the backup data immutable by preventing any such operations that, if used by malicious actors, could lead to the loss of backups. The Immutable vault setting on your vault enables you to block such operations to ensure that your backup data is protected, even if any malicious actors try to delete them to affect the recoverability of data.

## Making immutability irreversible

The immutability of a vault is a reversible setting that allows you to disable the immutability (which would allow deletion of backup data) if needed. However, we recommend you, after being satisfied with the impact of immutability, lock the vault to make the Immutable vault settings irreversible and enable WORM storage for backups, so that any bad actors can’t disable it. Therefore, the Immutable vault settings accept following three states.

| State of Immutable vault setting | Description |
| --- | --- |
| **Disabled** | The vault doesn't have immutability enabled and no operations are blocked. |
| **Enabled**  | The vault has immutability enabled and doesn't allow operations that could result in loss of backups. <br><br> However, the setting can be disabled. |
| **Enabled and locked** | The vault has immutability with WORM storage enabled and doesn't allow operations that could result in loss of backups. <br><br> As the Immutable vault setting is now locked, it can't be disabled. <br><br> Note that immutability locking is irreversible, so ensure that you take a well-informed decision when opting to lock. |

## Restricted operations

Immutable vault prevents you  from performing the following operations  on the vault that could lead to loss of data:

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

| Operation type | Description |
| --- | --- |
| **Stop protection with delete data** | A protected item can't have its recovery points deleted before their respective expiry date. However, you can still stop protection of the instances while retaining data forever or until their expiry. |
| **Modify backup policy to reduce retention** | Any actions that reduce the retention period in a backup policy are disallowed on Immutable vault. However, you can make policy changes that result in the increase of retention. You can also make changes to the schedule of a backup policy. <br><br>  Note that the increase in retention can't be applied if any item has its backups suspended (stop backup).  |
| **Change backup policy to reduce retention** | Any attempt to replace a backup policy associated with a backup item with another policy with retention lower than the existing one is blocked. However, you can replace a policy with the one that has higher retention. |

# [Backup vault](#tab/backup-vault)

| Operation type | Description |
| --- | --- |
| **Stop protection with delete data** | A protected item can't have its recovery points deleted before their respective expiry date. However, you can still stop protection of the instances while retaining data forever or until their expiry. |

---

## Next steps

- Learn [how to manage operations of Azure Backup vault immutability](backup-azure-immutable-vault-how-to-manage.md).
