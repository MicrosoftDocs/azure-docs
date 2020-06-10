---
title: Troubleshoot SAP HANA databases backup errors
description: Describes how to troubleshoot common errors that might occur when you use Azure Backup to back up SAP HANA databases.
ms.topic: troubleshooting
ms.date: 11/7/2019
---

# Troubleshoot backup of SAP HANA databases on Azure

This article provides troubleshooting information for backing up SAP HANA databases on Azure virtual machines. For more information on the SAP HANA backup scenarios we currently support, see [Scenario support](sap-hana-backup-support-matrix.md#scenario-support).

## Prerequisites and Permissions

Refer to the [prerequisites](tutorial-backup-sap-hana-db.md#prerequisites) and [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) sections before configuring backups.

## Common user errors

### UserErrorHANAInternalRoleNotPresent

| **Error Message**      | <span style="font-weight:normal">Azure backup does not have required role  privileges to carry out backup</span>    |
| ---------------------- | ------------------------------------------------------------ |
| **Possible causes**    | The role may have been overwritten.                          |
| **Recommended action** | To resolve the issue, run the script from the **Discover DB** pane, or download it [here](https://aka.ms/scriptforpermsonhana). Alternatively, add the 'SAP_INTERNAL_HANA_SUPPORT' role to the Workload Backup User (AZUREWLBACKUPHANAUSER). |

### UserErrorInOpeningHanaOdbcConnection

| Error Message      | <span style="font-weight:normal">Failed to connect to HANA system</span>                        |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | The SAP HANA instance may be down.<br/>The required permissions for Azure backup to interact with the HANA database aren't set. |
| **Recommended action** | Check if the SAP HANA database is up. If the database is up and running, check if all the required permissions are set. If any of the permissions are missing run the [preregistration script](https://aka.ms/scriptforpermsonhana) to add the missing permissions. |

### UserErrorHanaInstanceNameInvalid

| Error Message      | <span style="font-weight:normal">The specified SAP HANA instance is either invalid or can't be found</span>  |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | Multiple SAP HANA instances on a single Azure VM can't be backed up. |
| **Recommended action** | Run the [preregistration script](https://aka.ms/scriptforpermsonhana) on the SAP HANA instance you want to back up. If the issue still persists, contact Microsoft support. |

### UserErrorHanaUnsupportedOperation

| Error Message      | <span style="font-weight:normal">The specified SAP HANA operation isn't supported</span>              |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | Azure backup for SAP HANA doesn't support incremental backup and actions performed on SAP HANA native clients (Studio/ Cockpit/ DBA Cockpit) |
| **Recommended action** | For more information, refer [here](https://docs.microsoft.com/azure/backup/sap-hana-backup-support-matrix#scenario-support). |

### UserErrorHANAPODoesNotSupportBackupType

| Error Message      | <span style="font-weight:normal">This SAP HANA database doesn't support the requested backup type</span>  |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | Azure backup doesn't support incremental backup and backup using snapshots |
| **Recommended action** | For more information, refer [here](https://docs.microsoft.com/azure/backup/sap-hana-backup-support-matrix#scenario-support). |

### UserErrorHANALSNValidationFailure

| Error Message      | <span style="font-weight:normal">Backup log chain is broken</span>                                    |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | The log backup destination may have been updated from backint to file system or the backint executable may have been changed |
| **Recommended action** | Trigger a full backup to resolve the issue                   |

### UserErrorSDCtoMDCUpgradeDetected

| Error Message      | <span style="font-weight:normal">SDC to MDC upgrade detected</span>                                   |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | The SAP HANA instance has been upgraded from SDC to MDC. Backups will fail after the update. |
| **Recommended action** | Follow the steps listed in the [SDC to MDC upgrade](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database-troubleshoot#sdc-to-mdc-upgrade-with-a-change-in-sid) to resolve the issue |

### UserErrorInvalidBackintConfiguration

| Error Message      | <span style="font-weight:normal">Detected invalid backint configuration</span>                       |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | The backing parameters are incorrectly specified for Azure backup |
| **Recommended action** | Check if the following (backint) parameters are set:<br/>\* [catalog_backup_using_backint:true]<br/>\* [enable_accumulated_catalog_backup:false]<br/>\* [parallel_data_backup_backint_channels:1]<br/>\* [log_backup_timeout_s:900)]<br/>\* [backint_response_timeout:7200]<br/>If backint-based parameters are present in HOST, remove them. If parameters aren't present at HOST level but have been manually modified at a database level, revert them to the appropriate values as described earlier. Or, run [stop protection and retain backup data](https://docs.microsoft.com/azure/backup/sap-hana-db-manage#stop-protection-for-an-sap-hana-database) from the Azure portal, and then select **Resume backup**. |

### UserErrorIncompatibleSrcTargetSystemsForRestore

|Error Message  |The source and target systems for restore are incompatible  |
|---------|---------|
|Possible causes   | The source and target systems selected for restore are incompatible        |
|Recommended action   |   Ensure that your restore scenario isn't in the following list of possible incompatible restores: <br><br>   **Case 1:** SYSTEMDB cannot be renamed during restore.  <br><br> **Case 2:** Source - SDC and target - MDC: The source database cannot be restored as SYSTEMDB or tenant DB on the target. <br><br> **Case 3:** Source - MDC and target - SDC: The source database (SYSTEMDB or tenant DB) cannot be restored to the target. <br><br>  For more information, see note **1642148** in the [SAP support launchpad](https://launchpad.support.sap.com). |

## Restore checks

### Single Container Database (SDC) restore

Take care of inputs while restoring a single container database (SDC) for HANA to another SDC machine. The database name should be given with lowercase and with "sdc" appended in brackets. The HANA instance will be displayed in capitals.

Assume an SDC HANA instance "H21" is backed up. The backup items page will show the backup item name as **"h21(sdc)"**. If you attempt to restore this database to another target SDC, say H11, then following inputs need to be provided.

![Restored SDC database name](media/backup-azure-sap-hana-database/hana-sdc-restore.png)

Note the following points:

- By default, the restored db name will be populated with the backup item name. In this case, h21(sdc).
- Selecting the target as H11 will NOT change the restored db name automatically. **It should be edited to h11(sdc)**. Regarding SDC, the restored db name will be the target instance ID with lowercase letters and 'sdc' appended in brackets.
- Since SDC can have only single database, you also need to click the checkbox to allow override of the existing database data with the recovery point data.
- Linux is case-sensitive. So be careful to preserve the case.

### Multiple Container Database (MDC) restore

In multiple container databases for HANA, the standard configuration is SYSTEMDB + 1 or more Tenant DBs. Restoring an entire SAP HANA instance means to restore both SYSTEMDB and Tenant DBs. One restores SYSTEMDB first and then proceeds for Tenant DB. System DB essentially means to override the system information on the selected target. This restore also overrides the BackInt related information in the target instance. So after the system DB is restored to a target instance, run the pre-registration script again. Only then the subsequent tenant DB restores will succeed.

## Back up a replicated VM

### Scenario 1

The original VM was replicated using Azure Site Recovery or Azure VM backup. The new VM was built to simulate the old VM. That is, the settings are exactly the same. (This is because the original VM was deleted and the restore was done from VM backup or Azure Site Recovery).

This scenario could include two possible cases. Learn how to back up the replicated VM in both of these cases:

1. The new VM created has the same name, and is in the same resource group and subscription as the deleted VM.

    - The extension is already present on the VM, but isn't visible to any of the services
    - Run the pre-registration script
    - Re-register the extension for the same machine in the Azure portal (**Backup** -> **View details** -> Select the relevant Azure VM -> Re-register)
    - The already existing backed up databases (from the deleted VM) should then start successfully being backed up

2. The new VM created has either:

    - a different name than the deleted VM
    - the same name as the deleted VM but is in a different resource group or subscription (as compared to the deleted VM)

    If this is the case, then do the following steps:

    - The extension is already present on the VM, but isn't visible to any of the services
    - Run the pre-registration script
    - If you discover and protect the new databases, you'll start seeing duplicate active databases in the portal. To avoid this, [Stop protection with retain data](sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) for the old databases. Then continue with the remaining steps.
    - Discover the databases to enable backup
    - Enable backups on these databases
    - The already existing backed up databases (from the deleted VM) will continue to be stored in the vault (with their backups being retained according to the policy)

### Scenario 2

The original VM was replicated using Azure Site Recovery or Azure VM backup. The new VM was built out of the content – to be used as a template. This is a new VM with a new SID.

Follow these  steps to enable backups on the new VM:

- The extension is already present on the VM, but not visible to any of the services
- Run the pre-registration script. Based on the SID of the new VM, two scenarios can arise:
  - The original VM and the new VM have the same SID. The pre-registration script will run successfully.
  - The original VM and the new VM have different SIDs. The pre-registration script will fail. Contact support to get help in this scenario.
- Discover the databases that you want to back up
- Enable backups on these databases

## SDC version upgrade or MDC version upgrade on the same VM

Upgrades to the OS, SDC version change, or MDC version change that don't cause a SID change can be handled as follows:

- Ensure that the new OS version, SDC, or MDC version are currently [supported by Azure Backup](sap-hana-backup-support-matrix.md#scenario-support)
- [Stop protection with retain data](sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) for the database
- Perform the upgrade or update
- Rerun the pre-registration script. Usually, the upgrade process removes the necessary roles. Running the pre-registration script will help verify all the required roles
- Resume protection for the database again

## SDC to MDC upgrade with no change in SID

Upgrades from SDC to MDC that don't cause a SID change can be handled as follows:

- Ensure that the new MDC version is currently [supported by Azure Backup](sap-hana-backup-support-matrix.md#scenario-support)
- [Stop protection with retain data](sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) for the old SDC database
- Perform the upgrade. After completion, the HANA system is now MDC with a system DB and tenant DBs
- Rerun the [pre-registration script](https://aka.ms/scriptforpermsonhana)
- Re-register the extension for the same machine in the Azure portal (**Backup** -> **View details** -> Select the relevant Azure VM -> Re-register)
- Click **Rediscover DBs** for the same VM. This action should show the new DBs in step 3 as SYSTEMDB and Tenant DB, not SDC
- The older SDC database will continue to exist in the vault and have old backed-up data retained according to the policy
- Configure backup for these databases

## SDC to MDC upgrade with a change in SID

Upgrades from SDC to MDC that cause a SID change can be handled as follows:

- Ensure that the new MDC version is currently [supported by Azure Backup](sap-hana-backup-support-matrix.md#scenario-support)
- **Stop protection with retain data** for the old SDC database
- Perform the upgrade. After completion, the HANA system is now MDC with a system DB and tenant DBs
- Rerun the [pre-registration script](https://aka.ms/scriptforpermsonhana) with correct details (new SID and MDC). Due to a change in SID, you may face issues with successfully running the script. Contact Azure Backup support if you face issues.
- Re-register the extension for the same machine in the Azure portal (**Backup** -> **View details** -> Select the relevant Azure VM -> Re-register)
- Click **Rediscover DBs** for the same VM. This action should show the new DBs in step 3 as SYSTEMDB and Tenant DB, not SDC
- The older SDC database will continue to exist in the vault and have old backed up data retained according to the policy
- Configure backup for these databases

## Re-registration failures

Check for one or more of the following symptoms before you trigger the re-register operation:

- All operations (such as backup, restore, and configure backup) are failing on the VM with one of the following error codes: **WorkloadExtensionNotReachable, UserErrorWorkloadExtensionNotInstalled, WorkloadExtensionNotPresent, WorkloadExtensionDidntDequeueMsg**.
- If the **Backup Status** area for the backup item is showing **Not reachable**, rule out all the other causes that might result in the same status:

  - Lack of permission to perform backup-related operations on the VM
  - The VM is shut down, so backups can't take place
  - Network issues

These symptoms may arise for one or more of the following reasons:

- An extension was deleted or uninstalled from the portal.
- The VM was restored back in time through in-place disk restore.
- The VM was shut down for an extended period, so the extension configuration on it expired.
- The VM was deleted, and another VM was created with the same name and in the same resource group as the deleted VM.

In the preceding scenarios, we recommend that you trigger a re-register operation on the VM.

## Next steps

- Review the [frequently asked questions](https://docs.microsoft.com/azure/backup/sap-hana-faq-backup-azure-vm) about backing up SAP HANA databases on Azure VMs.
