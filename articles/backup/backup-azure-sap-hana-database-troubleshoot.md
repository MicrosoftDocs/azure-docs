---
title: Troubleshoot SAP HANA databases backup errors
description: Describes how to troubleshoot common errors that might occur when you use Azure Backup to back up SAP HANA databases.
ms.topic: troubleshooting
ms.date: 05/31/2021
---

# Troubleshoot backup of SAP HANA databases on Azure

This article provides troubleshooting information for backing up SAP HANA databases on Azure virtual machines. For more information on the SAP HANA backup scenarios we currently support, see [Scenario support](sap-hana-backup-support-matrix.md#scenario-support).

## Prerequisites and Permissions

Refer to the [prerequisites](tutorial-backup-sap-hana-db.md#prerequisites) and [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) sections before configuring backups.

## Common user errors

###### UserErrorHANAInternalRoleNotPresent

| **Error message**      | <span style="font-weight:normal">Azure Backup does not have required role  privileges to carry out Backup and Restore operations</span>    |
| ---------------------- | ------------------------------------------------------------ |
| **Possible causes**    | All operations will fail with this error when the Backup user (AZUREWLBACKUPHANAUSER) doesn’t have the **SAP_INTERNAL_HANA_SUPPORT** role assigned or the role may have been overwritten.                          |
| **Recommended action** | Download and run the [pre-registration script](https://aka.ms/scriptforpermsonhana) on the SAP HANA instance, or manually assign the **SAP_INTERNAL_HANA_SUPPORT** role to the Backup user (AZUREWLBACKUPHANAUSER).<br><br>**Note**<br><br>If you are using HANA 2.0 SPS04 Rev 46 and later, this error doesn’t occur as the use of the **SAP_INTERNAL_HANA_SUPPORT** role is deprecated in these HANA versions. |

###### UserErrorInOpeningHanaOdbcConnection

| **Error message**      | <span style="font-weight:normal">Failed to connect to HANA system</span>                        |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | <ul><li>Connection to HANA instance failed</li><li>System DB  is offline</li><li>Tenant DB is offline</li><li>Backup user (AZUREWLBACKUPHANAUSER) doesn’t have enough permissions/privileges.</li></ul> |
| **Recommended action** | Check if the system is up and running. If the database(s) is up and running, ensure that the required permissions are set by downloading and running the [pre-registration script](https://aka.ms/scriptforpermsonhana) on the SAP HANA instance. |

###### UserErrorHanaInstanceNameInvalid

| **Error message**      | <span style="font-weight:normal">The specified SAP HANA instance is either invalid or can't be found</span>  |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | <ul><li>The specified SAP HANA instance is either invalid or can’t be found.</li><li>Multiple SAP HANA instances on a single Azure VM can't be backed up.</li></ul> |
| **Recommended action** | <ul><li>Ensure that only one HANA instance is running on the Azure VM.</li><li>Run the script from the Discover DB pane (you can also find this [here](https://aka.ms/scriptforpermsonhana)) with the correct SAP HANA instance to resolve the issue.</li></ul> |

###### UserErrorHANALSNValidationFailure

| **Error message**      | <span style="font-weight:normal">Backup log chain is broken</span>                                    |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | HANA LSN Log chain break can be triggered for various reasons, including:<ul><li>Azure Storage call failure to commit backup.</li><li>The Tenant DB is offline.</li><li>Extension upgrade has terminated an in-progress Backup job.</li><li>Unable to connect to Azure Storage during backup.</li><li>SAP HANA has rolled back a transaction in the backup process.</li><li>A backup is complete, but catalog is not yet updated with success in HANA system.</li><li>Backup failed from Azure Backup perspective, but success from HANA's perspective - the log backup/catalog destination may have been updated from backint to file system, or the backint executable may have been changed.</li></ul> |
| **Recommended action** | To resolve this issue, Azure Backup triggers an auto-heal Full backup. While this auto-heal backup is in progress, all log backups are triggered by HANA fail with **OperationCancelledBecauseConflictingAutohealOperationRunningUserError**. Once the auto-heal Full backup is complete, logs and all other backups will start working as expected.<br>If you do not see an auto-heal full backup triggered or any successful backup (Full/Differential/ Incremental) in 24 hours, contact Microsoft support.</br> |

###### UserErrorSDCtoMDCUpgradeDetected

| **Error message**      | <span style="font-weight:normal">SDC to MDC upgrade detected.</span>                                   |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | When an SDC system is upgraded to MDC, backups fail  with this error. |
| **Recommended action** | To troubleshoot and resolve the issue, see [SDC to MDC upgrade](#sdc-to-mdc-upgrade-with-a-change-in-sid). |

###### UserErrorInvalidBackintConfiguration

| **Error message**      | <span style="font-weight:normal">Backups will fail with this error when the Backint Configuration is incorrectly updated.</span>                       |
| ------------------ | ------------------------------------------------------------ |
| **Possible causes**    | The backint configuration updated during the Configure Protection flow by Azure Backup is either altered/updated by the customer. |
| **Recommended action** | Check if the following (backint) parameters are set:<br><ul><li>[catalog_backup_using_backint:true]</li><li>[enable_accumulated_catalog_backup:false]</li><li>[parallel_data_backup_backint_channels:1]</li><li>[log_backup_timeout_s:900)]</li><li>[backint_response_timeout:7200]</li></ul>If backint-based parameters are present at the HOST level, remove them. However, if parameters aren't present at the HOST level but have been manually modified at a database level, ensure that the database level values are set above. Or, run [stop protection with retain backup data](./sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) from the Azure portal, and then select Resume backup. |

###### UserErrorIncompatibleSrcTargetSystemsForRestore

|**Error message**  | <span style="font-weight:normal">The source and target systems for restore are incompatible.</span>  |
|---------|---------|
|**Possible causes**   | The restore flow fails with this error when the source and target HANA databases, and systems are incompatible. |
|Recommended action   |   Ensure that your restore scenario isn't in the following list of possible incompatible restores:<br> **Case 1:** SYSTEMDB cannot be renamed during restore.<br>**Case 2:** Source - SDC and target - MDC: The source database cannot be restored as SYSTEMDB or tenant DB on the target. <br> **Case 3:** Source - MDC and target - SDC: The source database (SYSTEMDB or tenant DB) cannot be restored to the target.<br>To learn more, see the note **1642148** in the [SAP support launchpad](https://launchpad.support.sap.com). |

###### UserErrorHANAPODoesNotExist

**Error message** | <span style="font-weight:normal">Database configured for backup does not exist.</span>
--------- | --------------------------------
**Possible causes** | If a database that has been configured for backup is deleted, then all scheduled and ad-hoc backups on this database will fail.
**Recommended action** | Verify if the database is deleted. Re-create the database or [stop protection](sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) (with or without retain data) for the database.

###### UserErrorInsufficientPrivilegeOfDatabaseUser

**Error message** |	<span style="font-weight:normal">Azure Backup does not have enough privileges to carry out Backup and Restore operations.</span>
---------- | ---------
**Possible causes** | Backup user (AZUREWLBACKUPHANAUSER) created by the pre-registration script doesn’t have one or more of the following roles assigned:<ul><li>For MDC, DATABASE ADMIN and BACKUP ADMIN (for HANA 2.0 SPS05 and later) to create new databases during restore.</li><li>For SDC, BACKUP ADMIN to create new databases during restore.</li><li>CATALOG READ to read the backup catalog.</li><li>SAP_INTERNAL_HANA_SUPPORT to access a few private tables. Only required for SDC and MDC versions prior to HANA 2.0 SPS04 Rev 46. This is not required for HANA 2.0 SPS04 Rev 46 and later as we are getting the required information from public tables now with the fix from HANA team.</li></ul>
**Recommended action** | To resolve the issue, add the required roles and permissions manually to the Backup user (AZUREWLBACKUPHANAUSER), or download and run the pre-registration script on the [SAP HANA instance](https://aka.ms/scriptforpermsonhana).

###### UserErrorDatabaseUserPasswordExpired

**Error message** | <span style="font-weight:normal">Database/Backup user’s password expired.</span>
----------- | -----------
**Possible causes** | The Database/Backup user created by the pre-registration script doesn’t set expiry for the password. However, if it was altered, you may see this error.
**Recommended action** | Download and run the [pre-registration script](https://aka.ms/scriptforpermsonhana) on the SAP HANA instance to resolve the issue.

###### UserErrorInconsistentSSFS

**Error message** | <span style="font-weight:normal">SAP HANA error</span>
------------ | ----------
**Possible causes** | Inconsistent Secure Storage File System (SSFS) error received from SAP HANA Engine.
**Recommended action** | Work with the SAP HANA team to fix this issue. To learn more, see the SAP note **0002097613**.

###### UserErrorCannotConnectToAzureActiveDirectoryService

**Error message** | <span style="font-weight:normal">Unable to connect to the AAD service from the HANA system.</span>
--------- | --------
**Possible causes** | Firewall or proxy settings as Backup extension’s plugin service account is not allowing the outbound connection to AAD.
**Recommended action** | Fix the firewall or proxy settings for the outbound connection to AAD to succeed.

###### UserErrorMisConfiguredSslCaStore

**Error message** | <span style="font-weight:normal">Misconfigured CA store</span>
-------- | -------
**Possible causes** | Backup extension's plugin host process is unable to access the root CA store (in _/var/lib/ca-certificates/ca-bundle.pem_ for SLES).
**Recommended action** | Fix the CA store issue by using `chmod o+r` to restore the original permission.  Then restart the plugin host service for Backups and Restores to succeed.

###### UserErrorBackupFailedAsRemedialBackupInProgress

**Error message** | <span style="font-weight:normal">Remedial Backup in progress.</span>
---------- | -------
**Possible causes** | Azure Backup triggers a remedial full backup to handle LSN log chain break. While this remedial full is in progress, backups (Full/ Differential/Incremental) triggered through the portal/CLI fails with this error.
**Recommended action** | Wait for the remedial full backup to complete successfully before triggering another backup.

###### OperationCancelledBecauseConflictingOperationRunningUserError

**Error message** | <span style="font-weight:normal">Conflicting operation in progress.</span>
----------- | -------------
**Possible causes** | A Full/Differential/Incremental backup triggered through portal/CLI/native HANA clients, while another Full/Differential/Incremental backup is already in progress.
**Recommended action** | Wait for the active backup job to complete before triggering a new Full/delta backup.

###### OperationCancelledBecauseConflictingAutohealOperationRunning UserError

**Error message** | <span style="font-weight:normal">Auto-heal Full backup in progress.</span>
------- | -------
**Possible causes** | Azure Backup triggers an auto-heal Full backup to resolve **UserErrorHANALSNValidationFailure**. While this auto-heal backup is in progress, all the log backups triggered by HANA fail with **OperationCancelledBecauseConflictingAutohealOperationRunningUserError**.<br>Once the auto-heal Full backup is complete, logs and all other backups will start working as expected.</br>
**Recommended action** | Wait for the auto-heal Full backup to complete before triggering a new Full/delta backup.

###### UserErrorHanaPreScriptNotRun

**Error message** | <span style="font-weight:normal">Pre-registration script not run.</span>
--------- | --------
**Possible causes** | The SAP HANA pre-registration script for setting up the environment has not been run.
**Recommended action** | Download and run the [pre-registration script](https://aka.ms/scriptforpermsonhana) on the SAP HANA instance.


###### UserErrorTargetPOExistsOverwriteNotSpecified

**Error message** | <span style="font-weight:normal">Target database cannot be overwritten for Restore.</span>
------- | -------
**Possible causes** | Target database exists, but can’t be overwritten. Force overwrite isn’t set in the Restore flow on portal/CLI.
**Recommended action** | Restore database with the force overwrite option selected, or restore to a different target database.

###### UserErrorRecoverySysScriptFailedToTriggerRestore

**Error message** | <span style="font-weight:normal">RecoverySys.py could not be run successfully to restore System DB.</span>
-------- | ---------
**Possible causes** | Possible causes for System DB restore to fail are:<ul><li>Azure Backup is unable to find **Recoverysys.py** on the HANA machine. This happens when the HANA environment isn’t set up properly.</li><li>**Recoverysys.py** is present, but triggering this script has failed to invoke HANA to perform the restore.</li><li>Recoverysys.py has successfully invoked HANA to perform the restore, but HANA fails to restore.</li></ul>
**Recommended action** | <ul><li>For issue 1, work with the SAP HANA team to fix the issue.</li><li>For 2 and 3, see the log trace by running the HDSetting.sh command in sid-adm prompt. For example, _/usr/sap/SID/HDB00/HDBSetting.sh_.</li></ul>Share these findings with the SAP HANA team to get the issue fixed.

###### UserErrorDBNameNotInCorrectFormat

**Error message** | <span style="font-weight:normal">Restored database name not in correct format.</span>
--------- | --------
**Possible causes** | The Restored database name that you have provided is not in the acceptable/expected format.
**Recommended action** | Ensure that the restored database name starts with a letter and shouldn’t contain any symbol, other than digits or an underscore.<br>It can contain a maximum of 127 characters only and must not begin with "\_SYS_\".

###### UserErrorDefaultSidAdmDirectoryChanged

**Error message** | <span style="font-weight:normal">Default sid-adm directory changed.</span>
------- | -------
**Possible causes** | The default **sid-adm** directory was changed, and **HDBSetting.sh** is not available in this default directory.
**Recommended action** | If HXE is the SID, ensure that environment variable HOME is set to _/usr/sap/HXE/home_ as **sid-adm** user.

###### UserErrorHDBsettingsScriptNotFound

**Error message** | <span style="font-weight:normal">HDBSetting.sh file cannot be found.</span>
--------- | -------
**Possible causes** | System databases restore failed as the **&lt;sid&gt;adm** user environment couldn't find the **HDBsettings.sh** file to trigger restore.
**Recommended action** | Work with the SAP HANA team to fix this issue.<br><br>If HXE is the SID, ensure that environment variable HOME is set to _/usr/sap/HXE/home_ as **sid-adm** user.

## Restore checks

### Single Container Database (SDC) restore

Take care of inputs while restoring a single container database (SDC) for HANA to another SDC machine. The database name should be given with lowercase and with "sdc" appended in brackets. The HANA instance will be displayed in capitals.

Assume an SDC HANA instance "H21" is backed up. The backup items page will show the backup item name as **"h21(sdc)"**. If you attempt to restore this database to another target SDC, say H11, then following inputs need to be provided.

![Restored SDC database name](media/backup-azure-sap-hana-database/hana-sdc-restore.png)

Note the following points:

- By default, the restored db name will be populated with the backup item name. In this case, h21(sdc).
- Selecting the target as H11 won't change the restored db name automatically. **It should be edited to h11(sdc)**. Regarding SDC, the restored db name will be the target instance ID with lowercase letters and 'sdc' appended in brackets.
- Since SDC can have only single database, you also need to select the checkbox to allow override of the existing database data with the recovery point data.
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
- Rerun the pre-registration script. Often, the upgrade process may remove [the necessary roles](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does). Running the pre-registration script will help verify all the required roles.
- Resume protection for the database again

## SDC to MDC upgrade with no change in SID

Upgrades from SDC to MDC that don't cause a SID change can be handled as follows:

- Ensure that the new MDC version is currently [supported by Azure Backup](sap-hana-backup-support-matrix.md#scenario-support)
- [Stop protection with retain data](sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) for the old SDC database
- Perform the upgrade. After completion, the HANA system is now MDC with a system DB and tenant DBs
- Rerun the [pre-registration script](https://aka.ms/scriptforpermsonhana)
- Re-register the extension for the same machine in the Azure portal (**Backup** -> **View details** -> Select the relevant Azure VM -> Re-register)
- Select **Rediscover DBs** for the same VM. This action should show the new DBs in step 3 as SYSTEMDB and Tenant DB, not SDC
- The older SDC database will continue to exist in the vault and have the old backed-up data retained according to the policy
- Configure backup for these databases

## SDC to MDC upgrade with a change in SID

Upgrades from SDC to MDC that cause a SID change can be handled as follows:

- Ensure that the new MDC version is currently [supported by Azure Backup](sap-hana-backup-support-matrix.md#scenario-support)
- **Stop protection with retain data** for the old SDC database
- Perform the upgrade. After completion, the HANA system is now MDC with a system DB and tenant DBs
- Rerun the [pre-registration script](https://aka.ms/scriptforpermsonhana) with correct details (new SID and MDC). Due to a change in SID, you may face issues with successfully running the script. Contact Azure Backup support if you face issues.
- Re-register the extension for the same machine in the Azure portal (**Backup** -> **View details** -> Select the relevant Azure VM -> Re-register)
- Select **Rediscover DBs** for the same VM. This action should show the new DBs in step 3 as SYSTEMDB and Tenant DB, not SDC
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

- Review the [frequently asked questions](./sap-hana-faq-backup-azure-vm.yml) about backing up SAP HANA databases on Azure VMs.
