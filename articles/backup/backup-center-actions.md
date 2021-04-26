---
title: Perform actions using Backup center
description: This article explains how to perform actions using Backup center
ms.topic: conceptual
ms.date: 09/07/2020
---
# Perform actions using Backup center

Backup center allows you to perform key backup-related actions from a central interface without needing to navigate to an individual vault. Some actions that you can perform from Backup center are:

* Configure backup for your datasources
* Restore a backup instance
* Create a new vault
* Create a new backup policy
* Trigger an on-demand backup for a backup instance
* Stop backup for a backup instance

## Supported scenarios

* Backup center is currently supported for Azure VM backup, SQL in Azure VM backup, SAP HANA in Azure VM backup, Azure Files backup, and Azure Database for PostgreSQL Server backup.
* Refer to the [support matrix](backup-center-support-matrix.md) for a detailed list of supported and unsupported scenarios.

## Configure backup

If you are backing up Azure VMs, SQL in Azure VMs, SAP HANA in Azure VMs or Azure Files, you should use a Recovery Services vault. If you are backing up Azure Databases for PostgreSQL Server, you should use a Backup vault. 

Depending on the type of datasource you wish to back up, follow the appropriate instructions as described below.

### Configure backup to a Recovery Services vault

1. Navigate to the Backup center and select **+ Backup** at the top of the **Overview** tab.

    ![Backup Center overview](./media/backup-center-actions/backup-center-overview-configure-backup.png)

2. Select the type of datasource you wish to back up.

    ![Select datasource to configure VM backup](./media/backup-center-actions/backup-select-datasource-vm.png)

3. Choose a Recovery Services vault and select **Proceed**. This leads you to the backup configuration experience that is identical to the one reachable from a Recovery Services vault. [Learn more about how configure backup for Azure virtual machines with a Recovery Services vault](tutorial-backup-vm-at-scale.md).

### Configure backup to a Backup vault

1. Navigate to the Backup center and select **+ Backup** at the top of the **Overview** tab.
2. Select the type of datasource you wish to back up (Azure Database for PostgreSQL server in this case).

    ![Select datasource to configure Azure Database for PostgreSQL Server backup](./media/backup-center-actions/backup-select-datasource-type-postgresql.png)

3. Select **Proceed**. This leads you to the backup configuration experience that it identical to the one reachable from a Backup vault. [Learn more about how to configure backup for Azure Database for PostgreSQL Server with a Backup vault](backup-azure-database-postgresql.md#configure-backup-on-azure-postgresql-databases).

## Restore a backup instance

Depending on the type of datasource you wish to restore, follow the appropriate instructions as described below.

### If you're restoring from a Recovery Services vault

1. Navigate to the Backup center and select **Restore** at the top of the **Overview** tab.

    ![Backup Center Overview to restore VM](./media/backup-center-actions/backup-center-overview-restore.png)

2. Select the type of datasource you wish to restore.

    ![Select datasource for VM restore](./media/backup-center-actions/restore-select-datasource-vm.png)

3. Choose a backup instance and select **Proceed**. This leads you to the restore settings experience that is identical to the one reachable from a Recovery Services vault. [Learn more about how to restore an Azure Virtual Machine with a Recovery Services vault](backup-azure-arm-restore-vms.md#before-you-start).

### If you're restoring from a Backup vault

1. Navigate to the Backup center and select **Restore** at the top of the **Overview** tab.
2. Select the type of datasource you wish to restore (Azure Database for PostgreSQL Server in this case).

    ![Select datasource for Azure Database for PostgreSQL Server restore](./media/backup-center-actions/restore-select-datasource-postgresql.png)

3. Choose a backup instance and select **Proceed**. This leads you to the restore settings experience that is identical to the one reachable from a Recovery Services vault. [Learn more about how to restore an Azure Database for PostgreSQL Server with a Backup vault](backup-azure-database-postgresql.md#restore).

## Create a new vault

You can create a new vault by navigating to Backup center and selecting **+ Vault** at the top of the **Overview** tab.

![Create vault](./media/backup-center-actions/backup-center-create-vault.png)

* [Learn more about creating a Recovery services vault](backup-create-rs-vault.md)
* [Learn more about creating a Backup vault](backup-vault-overview.md)

## Create a new backup policy

Depending on the type of datasource you wish to back up, follow the appropriate instructions described below.

### If you're backing up to a Recovery Services vault

1. Navigate to the Backup center and select **+ Policy** at the top of the **Overview** tab.

    ![Backup Center Overview for backup policy](./media/backup-center-actions/backup-center-overview-policy.png)

2. Select the type of datasource you wish to back up.

    ![Select datasource for policy for VM backup](./media/backup-center-actions/policy-select-datasource-vm.png)

3. Choose a Recovery services vault and select **Proceed**. This leads you to the policy creation experience that is identical to the one reachable from a Recovery Services vault. [Learn more about how to create a new backup policy for Azure Virtual Machine with a Recovery services vault](backup-azure-arm-vms-prepare.md#create-a-custom-policy).

### If you're backing up to a Backup vault

1. Navigate to the Backup center and select **+ Policy** at the top of the **Overview** tab.
2. Select the type of datasource you wish to back up (Azure Database for PostgreSQL Server in this case).

    ![Select datasource for policy for Azure Database for PostgreSQL Server backup](./media/backup-center-actions/policy-select-datasource-postgresql.png)

3. Select **Proceed**. This leads you to the policy creation experience that it identical to the one reachable from a Backup vault. [Learn more about how to create a new backup policy with a Backup vault](backup-azure-database-postgresql.md#create-backup-policy).

## Execute an on-demand backup for a backup instance

Backup center allows you to search for backup instances across your backup estate and execute backup operations on demand.

To trigger an on-demand backup, navigate to Backup center and select the **Backup Instances** menu item. Selecting this lets you view details of all the backup instances that you have access to. You can search for the backup instance you wish to back up. Right-clicking on an item in the grid opens up a list of available actions. Select the **Backup Now** option to execute an on-demand backup.

![On-demand backup](./media/backup-center-actions/backup-center-on-demand-backup.png)

[Learn more about performing on-demand backups for Azure Virtual Machines](backup-azure-manage-vms.md#run-an-on-demand-backup).

[Learn more about performing on-demand backups for Azure Database for PostgreSQL Server](backup-azure-database-postgresql.md#on-demand-backup).

## Stop backup for a backup instance

There are scenarios when you might want to stop backup for a backup instance, such as when the underlying resource being backed up doesn’t exist anymore.

To trigger an on-demand backup, navigate to Backup center and select the **Backup Instances** menu item. Select this lets you view details of all the backup instances that you have access to. You can search for the backup instance you wish to back up. Right-clicking on an item in the grid opens up a list of available actions. Select the **Stop Backup** option to stop backup for the backup instance.

![Stop protection](./media/backup-center-actions/backup-center-stop-protection.png)

[Learn more about stopping backup for Azure Virtual Machines](backup-azure-manage-vms.md#stop-protecting-a-vm).

[Learn more about stopping backup for Azure Database for PostgreSQL Server](backup-azure-database-postgresql.md#stop-protection)

## Next steps

* [Monitor and Operate backups](backup-center-monitor-operate.md)
* [Govern your backup estate](backup-center-govern-environment.md)
* [Obtain insights on your backups](backup-center-obtain-insights.md)
