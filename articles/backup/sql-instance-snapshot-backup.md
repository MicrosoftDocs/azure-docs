---
title: Back Up SQL Database instance Snapshots in Azure Virtual Machine (VM)
description: Learn how to back up SQL databases in Azure VMs using snapshot backups. Follow prerequisites, configure policies, and ensure secure data retention.
#customer intent: As an IT admin, I want to back up SQL Server databases in Azure VMs using snapshot backups so that I can ensure data recovery in case of failure.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 03/06/2026
ms.topic: how-to
ms.service: azure-backup
---

# Back up snapshot for SQL database instance in Azure VM using Azure portal (preview)

This article describes how to back up SQL Server databases in Azure VMs using snapshot backups. It covers the prerequisites, configuration steps for backup policies, database discovery, and backup operations to help you ensure secure data retention and recovery capabilities.

## Prerequisites

Before you back up SQL database snapshot, ensure that the following prerequisites are met:

- Identify or [create a Recovery Services vault](backup-sql-server-database-azure-vms.md#create-a-recovery-services-vault) in the same region and subscription as the VM hosting the SQL Server instance.

- Verify that the VM has [network connectivity established](backup-sql-server-database-azure-vms.md#establish-network-connectivity).

- Make sure that the SQL Server databases follow the [database naming guidelines for Azure Backup](backup-sql-server-database-azure-vms.md#database-naming-guidelines-for-azure-backup).

- Ensure that .NET 4.6.2 version or higher is installed on the VM.

- Check that you don't have any other backup solutions enabled for the database. Disable all other SQL Server backups before you back up the database.

## Backup and restore permissions for SQL in Azure VM

The Azure Backup extension on the SQL VM requires permissions to take managed disk snapshots and store them in the user‑specified resource group defined in the policy. Azure Backup uses a user‑assigned managed identity to perform these actions. During restore, Azure Backup uses the target VM’s managed identity to read snapshots from the specified resource group and restore the VM. Azure Backup integrates permission assignment through the built‑in Azure Backup Snapshot Contributor role into both backup and restore flows. You can provide the managed identity details while configuring the backup policy and during restore operations.

The following table lists the role and scope assignment details for the managed identities created during backup and restore operations.

| **Managed Identity created** | **Role** | **Scope** |
|---|---|---|
| Backup MSI (Added in the backup policy by user) | Azure Backup Snapshot Contributor | Source VM resource group, Snapshot resource group (can be different from source VM Resource Group) |
| Restore MSI (Added in restore flow by user; can be different or same as the backup MSI) | Azure Backup Snapshot Contributor | Target VM Resource Group, Snapshot Resource Group, Target resource group (where disks are created to attach to target VM) |

## Create a backup policy for SQL Server in Azure VM (Snapshot backup)

A backup policy defines when backups run and how long data is retained. For snapshot backups, the policy specifies the frequency and retention for both snapshot and transaction log backups.

When you use snapshot backups, you must also provide a user-assigned managed identity. Azure Backup uses this identity to store backups in the resource group you select.

You can create a backup policy while configuring backup, or create it directly in the vault before configuring backup by following these steps:

1.  Go to the Recovery Services vault, and then select **Manage** \> **Backup policies**.

1.  On the **Backup policies** pane, select **+ Add** to create a new policy.

1.  On the **Select policy type** pane, select **Policy type** as **SQL Server in Azure VM (Snapshot backup) (preview)**.  
      
    :::image type="content" source="./media/sql-instance-snapshot-backup/select-policy-type-sql-server.png" alt-text="Screenshot that shows policy type selection in Azure Recovery Services vault for SQL Server in Azure VM (Snapshot backup)." lightbox="./media/sql-instance-snapshot-backup/select-policy-type-sql-server.png":::

1.  For **Full Snapshot backup** and **Log backup**, select **Edit** corresponding to each backup type and enter the backup schedule and retention periods.  
    :::image type="content" source="./media/sql-instance-snapshot-backup/create-backup-policy.png" alt-text="Screenshot that shows the  policy types for SQL server  in Azure VM backup." lightbox="./media/sql-instance-snapshot-backup/create-backup-policy.png":::


      
    The following table lists the retention ranges for schedule backups:

    | **Backup point**                     | **Retention period range** |
    |--------------------------------------|----------------------------|
    | Instant recovery Snapshot (Ops tier) | 1-7days                    |
    | Daily backup point                   | 7-9999 days                |
    | Weekly backup point                  | 1-5163 weeks               |
    | Monthly backup point                 | 1-1188 months              |
    | Yearly backup point                  | 1-99 years                 |
    | Log backup point                     | 7-35 days                  |

    > [!NOTE]
    >- The available frequency for Snapshot-full backup is between every 6 hours and every 24 hours. Log backup can be scheduled from every 15 mins to 24 hours.
    >- The **schedule snapshot copy-only full backups** isn’t supported; you can trigger the backup operation only by selecting **Backup now**.

1.  To enable Azure Backup to store snapshots in a resource group of your choice, for **Snapshot identity**, select **Edit**.and provide a snapshot identity. 
      
    :::image type="content" source="./media/sql-instance-snapshot-backup/snapshot-identity-configuration.png" alt-text="Screenshot that shows the addition of Snapshot Identity settings in backup policy." lightbox="./media/sql-instance-snapshot-backup/snapshot-identity-configuration.png":::

1. On the **Snapshot Identity** pane, specify the Snapshot resource group and assign a managed identity, and then select **OK**.

    This configuration maintains an instant recovery point for faster restores. Learn about how Azure Backup uses managed identities.  

1.  On the **Create policy** pane, select **Validate + Create policy**.

## Discover unprotected SQL databases in a subscription

When you discover SQL databases, Azure Backup prepares the virtual machine for workload backup in the background. It registers the VM with the selected vault so that all SQL databases on the VM backup only to that vault, installs the AzureBackupWindowsWorkload extension on the VM, and creates the required service account (NT Service\AzureWLBackupPluginSvc). Azure Backup doesn't install any agent on the SQL databases themselves.

To discover unprotected SQL databases in a subscription, follow these steps:

1.  Go to the **Recovery Services vault**, and then select **+ Backup**.

2.  On the **Backup Goal** pane, for **What do you want to back up**, select **SQL Server in Azure VM (Snapshot backup) (preview)**.  
      
    :::image type="content" source="./media/sql-instance-snapshot-backup/sql-vm-snapshot-backup.png" alt-text="Screenshot that shows the datasource selection for backup." lightbox="./media/sql-instance-snapshot-backup/sql-vm-snapshot-backup.png":::

3.  Under **Step 1: Discover DBs in VMs**, select **Start Discovery**.

4.  On the Select Virtual Machine pane, select the VMs running the SQL server databases, and then select **Discover DB’s**.  
      
    :::image type="content" source="./media/sql-instance-snapshot-backup/sql-vm-discovery.png" alt-text="Screenshot that shows the database discovery for backup configuration." lightbox="./media/sql-instance-snapshot-backup/sql-vm-discovery.png":::

You can track database discovery in the notifications. The time required depends on the number of databases on the VM. When discovery completes, Azure Backup discovers all SQL Server databases on the VM and shows a success message.

## Configure backup for the SQL Server databases

When the SQL database discovery is complete, configure backup for the databases by following these steps:

1.  On the **Backup Goal** pane, under **Step 2: Configure Backup**, select **Configure Backup**.

1.  On the Configure backup pane, for Backup policy, select an existing snapshot backup policy for the instance.  
      
    You can create a new backup policy on the go by selecting **Create a new policy** or create it directly in the vault. To create a new backup policy, see [Create a backup policy for SQL Server in Azure VM (Snapshot backup)](#create-a-backup-policy-for-sql-server-in-azure-vm-snapshot-backup).  
      
    :::image type="content" source="./media/sql-instance-snapshot-backup/sql-backup-policy-configuration.png" alt-text="Screenshot that shows the backup configuration in Azure portal." lightbox="./media/sql-instance-snapshot-backup/sql-backup-policy-configuration.png":::

    For **Snapshot backup**, the **Resource Group** and **Managed Identity** is automatically added based on the selection in the backup policy.  
      
    Resource group is needed to house the Snapshot backups before they are moved to the Recovery Services Vault. Further [Create a managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) or provide an existing one to allow backup service to take disk snapshots and store it in your Resource Group.

1. For **SQL Instances or AlwaysOn AGs**, select **+ Add/Edit** to add the instance that you want to back up and select the databases within it.  
    >[!NOTE]
    > Azure Backup currently supports selection of maximum 12 databases for backup.

1.  When you assign the managed identity for the first time, **Backup readiness** shows the error **Role/identity assignment not done**. To complete the role assignment, select **Assign missing roles/identity**.  
      
    After the assignment is completed, **Backup readiness** shows **Success**.  
    Note: If you don't have permission to assign roles, download the identity assignment template and share it with an administrator who has the required access.  
    
1.  Select **Enable Backup** to finish the backup configuration.

## Run an on-demand backup of SQL instance

To run an on-demand backup at the SQL instance level, follow these steps:

1.  Go to the **Recovery Services vault**, and then select **Protected items** \> **Backup items**.

1.  On the **Backup items** pane, select **SQL Server in Azure VM (Snapshot backup) (Preview)**.

1.  On the **Backup Items** pane, for the required backup instance, select **View details**.

1.  On the selected backup instance pane, select **Backup now**.

1.  On the **Backup now** pane, select one of the supported **Backup type** - **Snapshot full** or **Snapshot copy only full**.  
    :::image type="content" source="./media/sql-instance-snapshot-backup/sql-backup-type-selection.png" alt-text="Screenshot that shows how to trigger an on-demand backup for a SQL instance in Azure portal." lightbox="./media/sql-instance-snapshot-backup/sql-backup-type-selection.png":::

1.  Select **OK**.

[Learn how to trigger on-demand backups at the database level.](manage-monitor-sql-database-backup.md#run-an-on-demand-backup)

## Run an on-demand backup of SQL database

To run an on-demand backup at the SQL database level, follow these steps:

1.  Go to the **Recovery Services vault**, and then select **Protected items** \> **Backup items**.

1.  On the **Backup items** pane, select **SQL Database in Azure VM**.

1.  On the **Backup Items** pane, for the required backup item with **Snapshot backup type**, select **View details**.

1.  On the selected backup item pane, select **Backup now**.

1.  On the **Backup now** pane, select one of the supported **Backup type** - **Copy only full**, **Log**, **Full**, or **Differential**.  
      
    **Note**: The supported on-demand backup types at the database level depend on whether you create the original backup item using streaming backups or snapshot backups.  
    :::image type="content" source="./media/sql-instance-snapshot-backup/sql-backup-type-selection.png" alt-text="Screenshot that shows how to trigger an on-demand backup for a SQL database in Azure portal." lightbox="./media/sql-instance-snapshot-backup/sql-backup-type-selection.png":::

1.  Select **OK**.


## Next step

[Manage and monitor backed up SQL Server databases using Azure portal](manage-monitor-sql-database-backup.md).
