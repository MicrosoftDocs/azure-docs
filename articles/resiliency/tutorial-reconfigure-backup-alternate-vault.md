---
title: Tutorial - Reconfigure backup for data sources in an alternate vault using Resiliency
description: Learn how to reconfigure backup in an alternate vault for your datasources - Azure Virtual Machine (VM), Azure Files, SQL databases in Azure VM, SAP HANA database in Azure VM.
ms.topic: tutorial
ms.date: 11/19/2025
ms.service: resiliency
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Tutorial: Reconfigure backup for data sources in an alternate vault

Resiliency in Azure allows you to suspend backup for a datasource in one vault and reconfigure in another without losing existing recovery points. This flexibility helps in the following scenarios:

- Change the backup policy or vault redundancy without impacting the old recovery points.
- Modify the backup policy and retention for immutable vaults.
- Enable the private endpoint and/ or Customer Manage Keys (CMKs) on your backup.

This tutorial describes how to reconfigure backup for data sources in Resiliency by switching to an alternate Recovery Services vault, called re-registration. The feature is available for all datasources supported in Recovery Services vault.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

> [!NOTE]
> - Backup reconfiguration to alternate vault isn't supported for SQL Always On Availability Groups (AG) and SAP HANA System Replication (HSR).
> - Recovery Services vault doesn't allow active multi-protection.
> - The alternate vault has no limitations on redundancy, security settings, or policy retention, including for immutable vaults. However, the migration from Enhanced to Standard tier isn't allowed.
> - Old recovery points remain protected with the original configurations and retention. You can use the recovery points stored in the old vault for recovery until they're retained as per the backup policy. This capability also applies to immutable vaults.
> - Immutable vaults remain secure when using this feature. You can only stop protection by retaining data, and older recovery points continue to be protected as per the assigned retention policy.
> - Private endpoints and Customer Managed Keys (CMK) can be enabled only if the vault has no backups configured yet.

## Prerequisites

Before you start reconfiguring backup for data sources in an alternate vault, ensure that the following prerequisites are met:

-	Review the existing policies, vault redundancy, and security settings of the data sources for which you want to reconfigure backup.
- Create a new vault with Customer Managed Keys (CMK) and private endpoints enabled, or use an existing vault where both settings are already configured. These security features are then applied to new backups.
- Unregister the underlying storage accounts for the Mercury workloads (SQL database in Azure VM, SAP database in Azure VM, Azure Files). Backup reconfiguration for the datasources isn't allowed until the associated storage accounts are unregistered.

## Suspend the active backup for a datasource on Recovery Services vault

To suspend the active backup for a datasource on Recovery Services vault, follow these steps:

1. Go to **Resiliency**, and then select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/view-protected-items.png" alt-text="Screenshot shows how to view the protected items." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/view-protected-items.png":::

1.  On the **Protected items** pane, select a protected item from the list.
 
1. On the selected protected item pane, select the associated item from the list.
1. On the associated item pane, select **Stop backup**.
 
   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/initiate-stop-backup.png" alt-text="Screenshot shows how to initiate the stop backup operation." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/initiate-stop-backup.png":::

1. On the **Stop Backup** pane, choose the **Stop backup level** as **Retain backup data** from the dropdown, enter a reason, and then select **Stop backup**.

   >[!Note]
   >Backup items in **soft-deleted** state are also permitted for reconfiguration in an alternate vault. For **Immutable vaults** you can only choose **Retain backup data as per policy** or **Retain forever**. For nonimmutable vaults, you can also choose to stop protection and delete backup data. 

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/stop-backup.png" alt-text="Screenshot shows the option to choose the reason and stop backup." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/stop-backup.png":::
 
After the backup stops, the last backup status changes to **Warning (Backup disabled)**.

## Unregister the underlying storage account for the protected datasources in the Recovery Services vault

To unregister the underlying storage accounts for the protected Mercury datasources, follow these steps:

>[!Note]
> This process is applicable only for Mercury datasources (SQL database in Azure VM, SAP HANA database in Azure VM, Azure files), and not applicable for Azure Virtual Machines (VMs).

1. Go to the **Recovery Services vault** from where you want to unregister the underlying datasources, and then select **Manage** > **Backup Infrastructure**.
1. On the **Backup Infrastructure** pane, select **Workload in Azure VM** for SQL or SAP database in Azure VM.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/unregister-protected-item.png" alt-text="Screenshot shows how to unregister a protected item." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/unregister-protected-item.png":::

   For Azure Files, select **Azure Storage Accounts** > **Storage Accounts** > the **more options icon** corresponding to the required container, and then select **Unregister**.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/unregister-protected-storage-account.png" alt-text="Screenshot shows how to unregister a protected storage account." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/unregister-protected-storage-account.png":::

1. On the **Protected Servers** pane, select the **more options icon** corresponding to the required container, and then select **Unregister**.


## Reconfigure backup in an alternate Recovery Services vault

To reconfigure backup in an alternate Recovery Services vault, follow these steps:

1. Go to **Resiliency**, and then select **+ Configure protection**.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/start-configure-protection.png" alt-text="Screenshot shows how to start configuring protection." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/start-configure-protection.png":::

   You can also go to the new **Recovery Services vault** where you want to reconfigure backup, and then select **+ Backup**.

1. On the **Configure protection** pane, select **Resources managed by** as **Azure**, **Datasource type** for reconfiguring backup,  and **Solution** as **Azure Backup**, and then select **Continue**.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/select-datasource.png" alt-text="Screenshot shows how to select datasource for configuring protection." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/select-datasource.png":::

1. On the **Start: Configure Backup** pane, under **Vault**, click **Select vault**.

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/select-vault.png" alt-text="Screenshot shows how to select a vault." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/select-vault.png":::

1. On the **Select a Vault** pane, select a vault from the list with which you want to reconfigure backup, and then click **Select**.

   >[!Note]
   >Ensure that the vault you select has the necessary configuration to meet your new requirements – including redundancy, private endpoints, customer-managed keys (CMK), and so on. If you don't have an alternate vault created, [create a new vault](backup-vaults.md).

1. On the **Configure Backup** pane, select the required backup policy, resource for backup, select a datasource (for example, Virtual Machine name) for protection by selecting **Add**, and set the other backup configurations as applicable to initiate the reconfiguration. Learn how to [configure protection for datasources](tutorial-configure-protection-datasource.md).

   :::image type="content" source="./media/tutorial-reconfigure-backup-alternate-vault/configure-backup-settings.png" alt-text="Screenshot shows how to configure backup." lightbox="./media/tutorial-reconfigure-backup-alternate-vault/configure-backup-settings.png":::

After the configuration is complete, the new recovery points in the new vault appear.

## Cost implications for backup reconfiguration in an alternate vault

The implications of reconfiguring backup for data sources in an alternate vault incurs the following charges:

- The Azure Backup service forever retains the recovery points that are backed up in the old vault. This recovery point retention in the vault is chargeable. See [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup) for details.
- New recovery points in the new vault also incur storage cost.

## Related content

- [Reconfigure backups that are in soft deleted state](../backup/backup-azure-enhanced-soft-delete-configure-manage.md?tabs=recovery-services-vault#unregister-containers).
- [About Immutable vault for Azure Backup](../backup/backup-azure-immutable-vault-concept.md?tabs=recovery-services-vault).
- [About Multi-user authorization using Resource Guard](../backup/multi-user-authorization-concept.md?tabs=recovery-services-vault).
- [Encrypt backup data by using customer-managed keys](../backup/encryption-at-rest-with-cmk.md?tabs=portal).

