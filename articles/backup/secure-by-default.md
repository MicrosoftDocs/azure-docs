---
title: Secure by Default with soft delete for Azure Backup
description: Learn how secure by default with soft delete works for Azure Backup.
ms.topic: overview
ms.date: 11/10/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24, ignite-2024, references_regions
# Customer intent: As a data administrator, I want to utilize soft delete features in Azure Backup, so that I can ensure the recoverability of deleted backup data for up to 180 days and protect against accidental or malicious deletions.
---


# Secure by default with soft delete for Azure Backup
Secure by default with soft delete for Azure Backup allows you to recover your backup data even after it's deleted. This feature is useful when:

- You've accidentally deleted backup data and you need it back.

- Backup data is maliciously deleted by ransomware or bad actors.

>[!Note]
>Soft delete is now enforced by default as part of **secure by default** assurance for Azure Backup providing guaranteed recovery from accidental or malicious deletions. This default enforcement is currently in public preview across all public regions for Recovery Services vaults.

## Supported scenarios
- Soft delete is now enforced by default, and soft delete state can no longer be modified from the Azure portal. This enforcement ensures reliable recovery from any accidental or malicious deletions.
- With secure by default, soft delete is also applied at the vault level. When a vault is deleted, it automatically transitions into a soft-deleted state, enabling recovery if required.

## Supported regions

**Secure by default with soft delete** is available in the following regions:

| Vault Type               | Availability Type    | Regions                                      |
|--------------------------|----------------------|---------------------------------------------|
| Recovery Services Vault  | General Availability | West Central US                            |
| Recovery Services Vault  | Preview              | All remaining Azure Public Regions         |
| Backup Vault             | Preview              | Australia East, West Central US, East Asia |

For **Backup Vault**, in regions other than **Australia East**, **West Central US**, and **East Asia**, you still have the option to **disable soft delete** from the Azure portal.

## What's soft delete?

Soft delete primarily delays permanent deletion of backup data and vaults (preview for vaults) and gives you an opportunity to recover data after deletion. This deleted data is retained for the specified soft delete retention period which is default set to 14 days and can be extended up to 180 days.

After deletion (while the data is in soft deleted state), if you need to recover the deleted data, you can undelete. This returns the data to *stop protection with retain data* state. You can then use it to perform restore operations or you can resume backups for this instance.

The following diagram shows the flow of a backup item (or a backup instance) that gets deleted:

:::image type="content" source="./media/secure-by-default/backup-item-delete-flow.png" alt-text="Diagram showing the flow of a backup item (or a backup instance) that gets deleted." lightbox="./media/secure-by-default/backup-item-delete-flow.png":::

The key benefits of soft delete are:

- **Secure by Default**: Soft delete is automatically enabled by default for recovery points, backup items, and vaults. It operates in a single, enforced state across all onboarded regions, eliminating the need to disable soft delete under any circumstances. All newly created vaults have soft delete permanently enabled, ensuring enhanced protection and enforcing a **Good** security level by default.

>[!Note]
>You can't disable soft delete in the regions where secure by default assurance is in preview or general availability for Recovery Services vaults and Backup vaults.

- **Data recoverability**: Azure Backup promises to keep your data recoverable for up to 14 days by default at no extra cost. You don't need to take any action to configure secure by default state for your backup data.

- **Enhanced Security Posture**: In regions where "secure by default" with soft delete is **Generally Available** for Recovery Services Vaults, all vaults benefit from built-in protection against ransomware attacks. As a result, the security level for all backup items and vaults in GA regions is elevated to a Good security level.

- **Configurable soft delete retention**: You can specify the retention duration for deleted backup data to retain in soft-deleted state, ranging from *14 to 180 days*. By default, the retention duration is set to 14 days for the vault, and you can extend it as required. You won't incur additional costs for *14 days*; however, you're charged for the period beyond 14 days.

- **Soft delete for vaults**: You can move vaults with soft deleted items into a soft delete state. Also, you can recover soft-deleted vaults by undeleting them. When you initiate the deletion of a vault that contains soft-deleted items, the vault automatically moves into a soft-deleted state instead of being permanently removed. You can recover soft-deleted  vaults by undeleting them within the configured soft delete retention period. 
  During this retention period, you can also create a new Recovery Services vault or Backup vault with the same name in the same resource group as the soft-deleted vault. Azure Backup also allows multiple soft-deleted vaults with the same name within a single resource group, as naming constraints are enforced only for active vaults. 

- **Re-configuration of soft deleted backup items**: You can configure backup for the items in soft deleted state with another vault of your choice. [Learn more.](../business-continuity-center/tutorial-reconfigure-backup-alternate-vault.md)

- **Soft delete and re-registration of backup containers**: You can unregister the backup containers (which you can soft delete) if you've deleted all backup items in the container. You can then register such soft deleted containers to other vaults. This is applicable for supported workloads only, including SQL in Azure VM backup, SAP HANA in Azure VM backup and backup of on-premises servers.

>[!Note]
> To unregister hybrid backups(using MARS, DPM, or MABS), you need not disable soft delete. Backup data moves to soft deleted state and is deleted permanently after soft delete retention period expires.

- **Soft delete across workloads**: Soft delete applies to all vaulted datasources alike and is supported for Recovery Services vaults and Backup vaults. Soft delete also applies to operational backups of disks and VM backup snapshots used for instant restores. However, unlike vaulted backups, these snapshots can be directly accessed and deleted before the soft delete period expires. Soft delete is currently not supported for operational backup for Blobs and Azure Files.

- **Soft delete of recovery points**: This feature allows you to recover data from recovery points that are deleted due to the backup policy updates or changing the backup policy associated with a backup item. Soft delete of recovery points isn't supported for log recovery points in SQL and SAP HANA workloads.

## Soft delete for vaults

With secure by default assurance, when a vault is deleted, it moves into a soft deleted state. To soft delete a vault, you have to stop backup and soft delete all the backup items in the vault before initiating delete on the vault. 

When you initiate the deletion of a vault that contains soft-deleted items, the vault automatically moves into a soft-deleted state instead of being permanently removed. You can recover soft-deleted vaults by undeleting them within the configured soft delete retention period. 
During this retention period, you can also create a new vault with the same name in the same resource group as the soft-deleted vault. Azure Backup also allows multiple soft-deleted vaults with the same name within a single resource group, as naming constraints are enforced only for active vaults. 

Deletions using Azure portal moves the Recovery Services vault and Backup vault into a soft deleted state. 
For Recovery Services Vault, before initiating delete on the vault, follow these steps:
- Stop backups and soft delete all protected items
- Cleanup associations of Servers and Storage Accounts
- Disable Replication for Site Recovery Replicated Items
- Clean up dependencies related to your Site Recovery Replicated Items
- Remove Private Endpoint Connections

For Backup Vault, before initiating delete on the vault, follow these steps:
- Stop backups and soft delete all protected items

>[!Note]
>Azure Backup doesn't allow re-configuration of a backup item to the same vault if the backup item is already in soft deleted state. However, you can protect the item to a different vault or undelete and resume backup in the same vault for Recovery Services vaults.

## Soft delete of recovery points

Soft delete of recovery points helps you recover any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. For example, modification of a backup policy associated with a backup item to reduce the backup retention or assigning a new policy to a backed-up item that has a lower retention can cause a loss of certain recovery points.

This feature helps to retain these recovery points for an additional duration, as per the soft delete retention specified for the vault (the impacted recovery points show up as soft deleted during this period). You can undelete the recovery points by increasing the retentions in the backup policy. You can also restore your data from soft deleted state, if you don't choose to undelete them.

>[!Note]
> - Soft delete of recovery points is not supported for log recovery points in SQL and SAP HANA workloads.<br>

## Soft delete retention period

Soft delete retention is the retention period (in days) of a deleted item in soft deleted state. Once the soft delete retention period elapses (from the date of deletion), the item is permanently deleted, and you can't undelete. You can choose the soft delete retention period between *14 and 180 days*. Longer durations allow you to recover data from threats that can take time to identify (for example, Advanced Persistent Threats).

>[!Note]
> - Soft delete retention for *14 days* involves no cost. However, regular backup charges apply for additional retention days.
> - By default, soft delete retention is set to 14 days, and you can change it any time. However, the *soft delete retention period* that is active at the time of the deletion governs retention of the item in soft deleted state.
> - Soft-deleted operational backups aren't cleaned automatically after the *soft delete retention period* if the associated vault was also soft deleted. You must manually delete these soft-deleted operational backups.

## Pricing

There's no retention cost for the default soft delete duration of *14 days* for vaulted backup, after which, it incurs regular backup charges. For soft delete retention >14 days, the default period applies to the *last 14 days* of the continuous retention configured in soft delete, and then backups are permanently deleted. 

For example, you've deleted backups for one of the instances in the vault that has soft delete retention of 60 days. If you want to recover the soft deleted data after 52 days of deletion, the pricing is:

- Standard rates (similar rates apply when the instance is in *stop protection with retain data* state) are applicable for the first *46 days* (60 days of soft delete retention configured minus *14 days* of default soft delete retention).

- No charges for the last 6 days of soft delete retention.

However, the above billing rule doesn't apply for soft deleted operational backups of disks and VM backup snapshots, and the billing will continue as per the cost of the resource.

When you restore a soft-deleted backup item, it becomes active again, and standard pricing rates will apply.

## API Considerations for soft delete

Secure by default with soft delete is now enabled by default with the latest API versions during preview for both Recovery Services Vault and Backup Vault. In General Availability (GA) for Recovery Services Vault, the secure by default behavior is enforced across **all** API versions.

>[!Note]
>In the preview regions, you can still use older API versions to immediately disable soft delete and delete backup items, if required.

The following section outlines the API behavior across different scenarios for Preview and General Availability types:

### **Delete Protected Item**

The following table outlines the behavior of the **_Delete Protected Item_** action across various clients, based on the state of soft delete configuration.

# [Preview](#tab/preview)

| **Client** | **Soft Delete – Enabled / Always On** | **Soft Delete – Disabled** |
|-------------|----------------------------------------|-----------------------------|
| **Azure portal** | Backup items move to a soft-deleted state. | Backup items move to a soft-deleted state. |
| **PowerShell** | Backup items move to a soft-deleted state. | For PowerShell modules version **7.5.0** or later, backup items in Recovery Services vault move to a soft-deleted state. For earlier versions, backup items are deleted immediately.<br>Backup vault actions are independent of the module version. | 
| **CLI** | Backup items move to a soft-deleted state. | For Azure CLI version **2.75.0** or later, backup items in Recovery Services vault move to a soft-deleted state. For earlier versions, backup items are deleted immediately.<br>Backup vault actions are independent of the module version. |
| **REST API** | Backup items move to a soft-deleted state. | In Recovery Services vault, for API versions **2024-09-30-preview** or later, backup items move to a soft-deleted state. In Backup vault, for API versions **2025-09-01** or later, backup items move to a soft-deleted state.<br>For earlier API versions, backup items are deleted immediately. |

# [General availability](#tab/general-availability)

| **Clients**                                    | **Soft Delete – Enabled/AlwaysOn/Disabled.**                |
|------------------------------------------------|---------------------------------------------------------|
| **Azure portal / PowerShell / CLI / REST API** | Backup items go into soft deleted state for **all** modules/API versions |

---

### Delete Vault

The following table outlines the behavior of the ***Delete Vault*** action across different clients, based on the state of the soft delete configuration.

# [Preview](#tab/preview)

| **Client** | **Soft Delete – Disabled / Enabled / Always On** |
|-------------|--------------------------------------------------|
| **Azure portal** | Soft deletion of the vault is allowed when the vault is either empty or contains only soft-deleted backup items or containers. |
| **PowerShell** | For PowerShell module versions **7.5.0** or later, soft deletion of the Recovery Services vault is allowed when it is either empty or contains only soft-deleted backup items or containers. For earlier versions, vault deletion is allowed only when the vault is completely empty.<br>Backup vault actions are independent of the module version. |
| **CLI** | For Azure CLI versions **2.75.0** or later, soft deletion of the Recovery Services vault is allowed when the vault is either empty or contains only soft-deleted backup items or containers. For earlier versions, vault deletion is allowed only when the vault is completely empty.<br>Backup vault actions are independent of the module version. |
| **REST API** | In Recovery Services vault, for API versions **2024-09-30-preview** or later, soft deletion of the vault is allowed when the vault is either empty or contains only soft-deleted backup items or containers. In Backup vault, for API versions **2025-09-01** or later, soft deletion of the vault is allowed when the vault is either empty or contains only soft-deleted backup items or containers.<br>For earlier API versions, vault deletion is allowed only when the vault is completely empty. |


# [General availability](#tab/general-availability)

| **Clients**                              | **Soft Delete – Disabled/Enabled/AlwaysOn**                |
|---------------------------------------|--------------------------------------------------------|
| **Azure Portal / Powershell / CLI / REST API** | Soft delete of vault is allowed when vault is either empty or has only soft deleted backup items/containers for **all** modules/API versions. |

---


### **Disable Soft Delete for Vault**

The following table describes the behavior of the **_Disable Soft Delete_** action across various clients and API versions.

# [Preview](#tab/preview)

| **Client** | **Behavior** |
|-------------|--------------|
| **Azure portal** | Not allowed. |
| **PowerShell** | Not allowed for PowerShell module versions **7.5.0** or later in Recovery Services vault. Allowed for earlier versions.<br>Backup vault actions are independent of the module version. |
| **CLI** | Not allowed for Azure CLI versions **2.75.0** or later in Recovery Services vault. Allowed for earlier versions.<br>Backup vault actions are independent of the module version. |
| **REST API** | Not allowed for API versions **2024-09-30-preview** or later in Recovery Services vault. Not allowed for API versions **2025-09-01** or later in Backup vault.<br>Allowed for earlier API versions. |


# [General availability](#tab/general-availability)

| **Clients**                                    | **Behavior**                                                     |
|------------------------------------------------|------------------------------------------------------------------|
| **Azure portal / PowerShell / CLI / REST API** | Disable soft delete is **not allowed** for any module/API versions   |

---

## Next steps

- [Configure and manage soft delete for Azure Backup](backup-azure-enhanced-soft-delete-configure-manage.md).
