---
title: Tutorial - Configure protection for data sources
description: Learn how to configure protection for your data sources which are currently not protected by any solution using Azure Business Continuity Center.
ms.topic: tutorial
ms.date: 08/20/2025
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Tutorial: Reconfigure backup for data sources in an alternate vault

This tutorial describes how to reconfigure backup for data sources in Azure Business Continuity Center. This feature allows you to suspend backup for a data source in a Recovery Services vault and configure backup with a different vault.

> [!NOTE]
> - Recovery Services vault does not allow active multi-protection.
> - The alternate vault has no limitations on redundancy, security settings, or policy retention, including for immutable vaults.
> - Old recovery points remain protected with the original configurations and retention. This capability also applies to immutable vaults.
> - Immutable vaults remain secure when using this feature. You can only stop protection by retaining data, and older recovery points continue to be protected as per the selected retention option.

## Cost Implications

The implications of reconfiguring backup for data sources in an alternate vault incurs the following charges:

- Old recovery points in the previous vault incur storage cost until they are purged as per the retention policy.
- New recovery points in the new vault also incur storage cost.


## Prerequisites

Before you start reconfiguring backup for data sources in an alternate vault, ensure that the following prerequisites are met:

-	Review the existing policies, vault redundancy and security settings of the data sources for which you want to reconfigure backup.
-Create a new vault with Customer Managed Keys (CMK) and Private Endpoints (PE) enabled, or use an existing vault where both settings are already configured to apply them to new backups.

  >[!Note]
  >You can enable Private Endpoints (PE) and Customer Managed Keys (CMK) only if the vault has no backups configured yet.

- Unregister the underlying storage accounts for the Mercury workloads (SQL database in Azure VM, SAP database in Azure VM, Azure Files). Backup reconfiguration for these datasources isn't allowed until the associated storage accounts are unregistered.

## Suspend the active backup for a datasource on Recovery Services vault

To suspend the active backup for a datasource on Recovery Services vault, follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection inventory** > **Protected items**.

1.  On the **Protected items** pane, select a protected item from the list.
 
1. On the selected protected item pane, select the associated item from the list.
1. On the associated item pane, select **Stop backup**.
 
1. On the **Stop Backup** pane, choose a **Stop backup level** from the dropdown, enter a reason, and then select **Stop backup**.

   For **Immutable vaults** you can only choose **Retain backup data as per policy** or **Retain forever**. Non-immutable vaults can also choose to **Delete backup data**. 
 
After the backup stops, the **Last backup status** changes to **Warning (Backup disabled)**.

## Unregister the underlying storage account

 - for SQL in VM, SAP in VM and AFS workloads only. This step is not needed for VM.


a.	Go to the parent vault of the concerned datasource.
b.	Go to Manage> Backup Infrastructure
c.	Select Workload in Azure VM for SQL/ SAP in VM or select Azure Storage Accounts> Storage Accounts for AFS.
d.	Click on the 3 dots for the concerned container and Unregister the container.


## Reconfigure backup

a.	Go to the backup item view of the concerned datasource and select “Resume Backup”
b.	To re-configure backup in an alternate vault than the existing choose “Alternate Vault”. This will help re-direct you to the configure backup flow for that datasource. 
c.	In the configure backup flow, please choose the alternate vault of choice with the required redundancy. Add a policy of choice.
d.	Complete with any other settings and tags of choice.

After the backup reconfiguration is complete, the different backup items associated with the protected item in Azure Business Continuity Center appear. Only one backup stays active at any point of time.


## Related content

- [Reconfigure backups that are in soft deleted state](../backup/backup-azure-enhanced-soft-delete-configure-manage.md?tabs=recovery-services-vault#unregister-containers).
- [About Immutable vault for Azure Backup](../backup/backup-azure-immutable-vault-concept.md?tabs=recovery-services-vault).
- [About Multi-user authorization using Resource Guard](../backup/multi-user-authorization-concept.md?tabs=recovery-services-vault).
- [Encrypt backup data by using customer-managed keys](../backup/encryption-at-rest-with-cmk.md?tabs=portal).

