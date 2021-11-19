---
title: Automation in Azure Backup
description: Provides a summary of automation capabilities offered by Azure Backup
ms.topic: conceptual
ms.date: 11/16/2021
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# Automation in Azure Backup

As you manage your operations in Azure, your backup estate might expand by including new diverse set of workloads/scale-up in volume.

At small-scale, the following actions could be manual or performed with ease: identifying the right machines to be backed up, configuring backup, monitoring their status, extracting data, and so on. But at large-scale, such actions could be difficult, complex and could be prone to error.

Azure Backup allows you to automate most backup tasks using programmatic methods. This document provides the different automation clients supported by Azure Backup. This also walks you through some end-to-end automation scenarios that are commonly used in the enterprise-scale backup deployments.

## Automation methods

To access Azure Backup functionality, you can use the following standard automation methods supported by Azure:

- PowerShell
- CLI
- REST API
- Python SDK
- Go SDK
- Terraform
- ARM templates
- Bicep

You can also use Azure Backup associated with other Azure services, such as Logic Apps, Runbooks, and Action Groups, to set up end-to-end automation workflows.

For more information on about the various scenarios that automation clients support and the corresponding document references, see the [supported automation solutions for Azure Backup](#supported-automation-methods-by-operation-types) section.

## Sample automation scenarios

This section provides a few common automation use cases that you might encounter as a backup admin. It also provides guidance on getting started.

### Configure backups

As a backup admin, you need to deal with new infrastructure getting added periodically, and ensure they are protected as per agreed requirements. The automation clients, such as PowerShell/CLI, helps to fetch all VM details, check the backup status of each of them, and then take appropriate action for unprotected VMs.

However, this must be performant at-scale. Also, you need to schedule them periodically and monitor each run. To ease the automation operations, Azure Backup now uses Azure Policy and provides [built-in backup specific Azure policies](backup-center-govern-environment.md#azure-policies-for-backup) to govern the backup estate.

Once you assign an Azure policy to a scope, all VMs that meet your criteria are backed up automatically, and newer VMs are scanned and protected periodically by the Azure Policy. You can also view a compliance report that alerts you for non-compliant resources.

[Learn more about built-in Azure Policies for backup](backup-azure-auto-enable-backup.md).

The following video illustrates how Azure Policy works for backup:  <br><br>

> [!VIDEO https://channel9.msdn.com/Shows/IT-Ops-Talk/Configure-backups-at-scale-using-Azure-Policy/player]

### Export backup-operational data

You might need to extract the backup-operational data for your entire estate and periodically import it to your monitoring systems/dashboards. At large scales, the data should be retrieved fast (while you query huge records). You need to query across resources, subscriptions, and tenants. You also need to query from a client (Azure portal/PowerShell/CLI/any SDK/REST API). There should be flexibility in output format (table vs Array) as well.

Azure Resource Graph (ARG) allows you to perform these operations and query at-scale. Azure Backup uses ARG as an optimized way to fetch required data with minimal queries (one query for one scenario). For example, a single query can fetch all failed jobs across all vaults in all subscriptions and all tenants. Also, the queries are Azure role-based access control (Azure RBAC) compliant.

See the [sample ARG queries](query-backups-using-azure-resource-graph.md#sample-queries).

### Automate responses/actions

The automation of responses to transient backup job failures helps you ensure that you have the right number of reliable backups to restore from. This also helps to avoid unintentional breaches in your [RPO](azure-backup-glossary.md#rpo-recovery-point-objective).

You can set up a workflow to retry backup jobs using a combination of Azure Automation Runbooks, PowerShell, and Azure Resource Graph. This helps in scenarios where the backup jobs have failed due to a transient error or due to a planned/unplanned outage.

To get started, follow these steps:

1. Create an Automation account and a new PowerShell Runbook within the Automation Account. [Learn more](../automation/learn/powershell-runbook-managed-identity.md).

2. Insert the following script in the body of the runbook. 

   The script runs an ARG query to fetch the list of all VMs with recent job failures (you can add a filter on _startTime_ to the query), and then triggers an on-demand backup for each VM. You can create similar queries to fetch the list of all SQL databases, HANA databases, Azure Files, and other Azure workloads being backed up.

    ```azurepowershell
    $connection = Get-AutomationConnection -Name AzureRunAsConnection
    $connectionResult = Connect-AzAccount `
    -ServicePrincipal `
    -Tenant $connection.TenantID `
    -ApplicationId $connection.ApplicationID `
    -CertificateThumbprint $connection.CertificateThumbprint
    "Login successful.."

    $query = "RecoveryServicesResources
    | where type in~ ('microsoft.recoveryservices/vaults/backupjobs')
    | extend vaultName = case(type =~ 'microsoft.dataprotection/backupVaults/backupJobs',properties.vaultName,type =~ 'Microsoft.RecoveryServices/vaults/backupJobs',split(split(id, '/Microsoft.RecoveryServices/vaults/')[1],'/')[0],'--')
    | extend friendlyName = case(type =~ 'microsoft.dataprotection/backupVaults/backupJobs',strcat(properties.dataSourceSetName , '/', properties.dataSourceName),type =~ 'Microsoft.RecoveryServices/vaults/backupJobs', properties.entityFriendlyName, '--')
    | extend dataSourceType = case(type =~ 'Microsoft.RecoveryServices/vaults/backupJobs',properties.backupManagementType,type =~ 'microsoft.dataprotection/backupVaults/backupJobs',properties.dataSourceType,'--')
    | extend protectedItemName = split(split(properties.backupInstanceId, 'protectedItems')[1],'/')[1]
    | extend vaultId = tostring(split(id, '/backupJobs')[0])
    | extend vaultSub = tostring( split(id, '/')[2])
    | extend jobStatus = case (properties.status == 'Completed' or properties.status == 'CompletedWithWarnings','Succeeded',properties.status == 'Failed','Failed',properties.status == 'InProgress', 'Started', properties.status), operation = case(type =~ 'microsoft.dataprotection/backupVaults/backupJobs' and tolower(properties.operationCategory) =~ 'backup' and properties.isUserTriggered == 'true',strcat('adhoc',properties.operationCategory),type =~ 'microsoft.dataprotection/backupVaults/backupJobs', tolower(properties.operationCategory), type =~ 'Microsoft.RecoveryServices/vaults/backupJobs' and tolower(properties.operation) =~ 'backup' and properties.isUserTriggered == 'true',strcat('adhoc',properties.operation),type =~ 'Microsoft.RecoveryServices/vaults/backupJobs',tolower(properties.operation), '--'), startTime = todatetime(properties.startTime),endTime = properties.endTime, duration = properties.duration 
    | where (dataSourceType in~ ('AzureIaasVM'))
    | where jobStatus=='Failed'
    | where operation == 'backup' or operation == 'adhocBackup'
    | project vaultSub, vaultId, protectedItemName, startTime, endTime, jobStatus, operation
    | sort by vaultSub"

    $subscriptions = Get-AzSubscription | foreach {$_.SubscriptionId}
    $result = Search-AzGraph -Subscription $subscriptions -Query $query -First 5
    $result = $result.data
    $prevsub = ""
    foreach($jobresponse in $result)
    {
                if($jobresponse.vaultSub -ne $prevsub)
                {
                            Set-AzContext -SubscriptionId $jobresponse.vaultSub
                            $prevsub = $jobresponse.vaultSub
                }

                $item = Get-AzRecoveryServicesBackupItem -VaultId $jobresponse.vaultId -BackupManagementType AzureVM -WorkloadType AzureVM -Name $jobresponse.protectedItemName

                Backup-AzRecoveryServicesBackupItem -ExpiryDateTimeUTC (get-date).AddDays(10) -Item $item -VaultId $jobresponse.vaultId
    }
    ```

3. Import the following modules in the runbook to ensure the script runs correctly: `Az.Accounts`, `Az.RecoveryServices`, `Az.Graph`.

   [Learn how to import modules in a runbook](../automation/shared-resources/modules.md).

4. [Link the runbook to a schedule](../automation/shared-resources/schedules.md) to configure the script to be run automatically at regular intervals.

   Refer to the following video for an end-to-end walk-through of the scenario: <br><br>

   > [!VIDEO https://channel9.msdn.com/Shows/IT-Ops-Talk/Automatically-retry-failed-backup-jobs-using-Azure-Resource-Graph-and-Azure-Automation-Runbooks/player]

## Supported automation methods by operation types

### Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported <br><br> [See the examples](./backup-azure-vms-automation.md#back-up-azure-vms). | Supported <br><br> [See the examples](./quick-backup-vm-cli.md#enable-backup-for-an-azure-vm) | Supported  <br><br>  [See the examples](./backup-azure-arm-userestapi-backupazurevms.md). | Supported  <br><br> [See the examples](./backup-azure-auto-enable-backup.md). | Supported  <br><br> [See the examples](./backup-rm-template-samples.md). |
| Backup | Selective disk backup | Supported  <br><br> [See the examples](./selective-disk-backup-restore.md#using-powershell) | Supported  <br><br> [See the examples](./selective-disk-backup-restore.md#using-azure-cli). | Supported  <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#excluding-disks-in-azure-vm-backup). | N/A | N/A |
| Backup | Run on-demand backup | Supported   <br><br> [See the examples](./quick-backup-vm-powershell.md#start-a-backup-job). | Supported -  <br><br> [See the examples](./quick-backup-vm-cli.md#start-a-backup-job). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#trigger-an-on-demand-backup-for-a-protected-azure-vm). | N/A | N/A |
| Restore | Restore disks to primary region | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-an-azure-vm). | Supported  <br><br> [See the examples](./tutorial-restore-disk.md#restore-a-vm-disk). | Supported  <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md). | N/A | N/A |
| Restore | Cross-region restore | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-disks-to-a-secondary-region). | Supported   <br><br> [See the examples](/cli/azure/backup/restore?view=azure-cli-latest#az_backup_restore_restore_disks&preserve-view=true). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#cross-region-restore). | N/A | N/A |
| Restore | Restore selective disks | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-selective-disks). | Supported   <br><br> [See the examples](./selective-disk-backup-restore.md#restore-disks-with-azure-cli). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#restore-disks-selectively). | N/A | N/A |
| Restore | Create a VM from restored disks | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#using-managed-identity-to-restore-disks). | Supported   <br><br> [See the examples](./tutorial-restore-disk.md#using-managed-identity-to-restore-disks). | Supported   <br><br> [See the examples](/rest/api/backup/restores/trigger). | N/A | N/A |
| Restore | Restore files | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#create-a-vm-from-restored-disks). | Supported   <br><br> [See the examples](./tutorial-restore-disk.md#create-a-vm-from-the-restored-disk). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#restore-disks). | N/A | N/A |
| Manage | Monitor jobs | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-files-from-an-azure-vm-backup). | Supported   <br><br> [See the examples](./tutorial-restore-files.md). | N/A | N/A |
| Manage | Modify backup policy | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#monitoring-a-backup-job). | Supported   <br><br> [See the examples](./quick-backup-vm-cli.md#monitor-the-backup-job). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-managejobs.md#tracking-the-job). | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#retain-data). | Supported   <br><br> [See the examples](/cli/azure/backup/protection?view=azure-cli-latest#az_backup_protection_disable&preserve-view=true). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#stop-protection-but-retain-existing-data). | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#delete-backup-data). | Supported   <br><br> [See the examples](/cli/azure/backup/protection?view=azure-cli-latest#az_backup_protection_disable&preserve-view=true). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#stop-protection-and-delete-data). | N/A | N/A |
| Manage | Resume protection | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#resume-backup).    | Supported    <br><br> [See the examples](/cli/azure/backup/protection?view=azure-cli-latest#az_backup_protection_resume&preserve-view=true). | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#undo-the-deletion) | N/A | N/A |

### SQL in Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#configure-a-backup-policy). | Supported | Supported | Currently not here | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). |
| Backup | Enable auto-protection | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#enable-autoprotection) | Supported | Supported | N/A | N/A |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#on-demand-backup). | Supported | Supported | N/A | N/A |
| Restore | Restore to a distinct full/differential recovery point | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#original-restore-with-distinct-recovery-point). | Supported | Supported | N/A | N/A |
| Restore | Restore to a point in time | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#original-restore-with-log-point-in-time). | Supported | Supported | N/A | N/A |
| Restore | Cross-region restore | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#alternate-workload-restore-to-a-vault-in-secondary-region). | Supported | Supported | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#track-azure-backup-jobs). | Supported | Supported | N/A | N/A |
| Manage | Manage Azure Monitor Alerts (preview) | Supported    <br><br> [See the examples](../azure-monitor/powershell-samples.md). | Supported | Supported | N/A | N/A |
| Manage | Manage Azure Monitor Metrics (preview) | Supported    <br><br> [See the examples](../azure-monitor/powershell-samples.md). | Supported | Supported | N/A | N/A |
| Manage | Modify backup policy | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#change-policy-for-backup-items). | Supported | Supported | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#retain-data). | Supported | Supported | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#delete-backup-data). | Supported | Supported | N/A | N/A |
| Manage | Unregister instance | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#unregister-sql-vm). | Supported | Supported | N/A | N/A |
| Manage | Re-register instance | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#re-register-sql-vms). | Supported | Supported | N/A | N/A |

### SAP HANA in Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-backup-cli.md#register-and-protect-the-sap-hana-instance). | Supported | Currently not supported | N/A |
| Backup | Run on-demand backup | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-backup-cli.md#trigger-an-on-demand-backup). | Supported | N/A | Supported – Examples   <br><br> [See the examples](./backup-rm-template-samples.md). |
| Restore | Restore to a distinct full/ differential/ incremental recovery point | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-restore-cli.md#restore-a-database). | Supported | N/A |    |
| Restore | Restore to a point in time | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-restore-cli.md#restore-a-database). | Supported | N/A | N/A |
| Restore | Cross-region restore | Currently not supported | Supported | Supported | N/A | N/A |
| Manage | Monitor jobs | Currently not supported  | Supported | Supported | N/A | N/A |
| Manage | Modify backup policy | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#change-policy). | Supported | N/A | N/A |
| Manage | Stop protection and retain backup data | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#stop-protection-with-retain-data) | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-createorupdatepolicy.md). | N/A | N/A |
| Manage | Stop protection and delete backup data | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#stop-protection-without-retain-data). | Supported    <br><br> [See the examples](/rest/api/backup/protected-items/delete). | N/A | N/A |
| Manage | Unregister instance | Currently not supported  | Supported | Supported | N/A | N/A |
| Manage | Re-register instance | Currently not supported  | Supported | Supported | N/A | N/A |

### Azure Files

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-azure-afs-automation.md#configure-a-backup-policy). | Supported    <br><br> [See the examples](./backup-afs-cli.md#enable-backup-for-azure-file-shares). | Supported    <br><br> [See the examples](./backup-azure-file-share-rest-api.md#configure-backup-for-an-unprotected-azure-file-share-using-rest-api). | Currently not supported | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-azure-afs-automation.md#trigger-an-on-demand-backup). | Supported    <br><br> [See the examples](./backup-afs-cli.md#trigger-an-on-demand-backup-for-file-share). | Supported    <br><br> [See the examples](./backup-azure-file-share-rest-api.md#trigger-an-on-demand-backup-for-file-share). | N/A | N/A |
| Restore | Restore to original or alternate location | Supported    <br><br> [See the examples](./restore-afs-powershell.md). | Supported    <br><br> [See the examples](./restore-afs-cli.md). | Supported    <br><br> [See the examples](./restore-azure-file-share-rest-api.md). | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./manage-afs-powershell.md#track-backup-and-restore-jobs). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#monitor-jobs). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#monitor-jobs). | N/A | N/A |
| Manage | Modify backup policy | Supported    <br><br> [See the examples](./manage-afs-powershell.md#modify-the-protection-policy). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#modify-policy). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#modify-policy). | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported    <br><br> [See the examples](./manage-afs-powershell.md#stop-protection-and-retain-recovery-points). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#stop-protection-and-retain-recovery-points). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#stop-protection-but-retain-existing-data). | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported    <br><br> [See the examples](./manage-afs-powershell.md#stop-protection-without-retaining-recovery-points). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#stop-protection-without-retaining-recovery-points). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#stop-protection-and-delete-data). | N/A | N/A |

### Azure Blobs

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-blobs-storage-account-ps.md). | Supported    <br><br> [See the examples](./backup-blobs-storage-account-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-backup-blobs.md). | Currently not supported | Supported |
| Restore | Restore blobs | Supported    <br><br> [See the examples](./restore-blobs-storage-account-ps.md). | Supported    <br><br> [See the examples](./restore-blobs-storage-account-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-blobs.md). | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./restore-blobs-storage-account-ps.md#tracking-job). | Supported    <br><br> [See the examples](./restore-blobs-storage-account-cli.md#tracking-job). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-blobs.md#tracking-jobs). | N/A | N/A |
| Manage | Modify backup policy | Currently not supported | Currently not supported | Currently not supported | N/A | N/A |
| Manage | Stop protection and retain backup data | Currently not supported | Currently not supported | Currently not supported | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported | Supported | Supported | N/A | N/A |
| Manage | Resume protection | Currently not supported | Currently not supported | Currently not supported | N/A | N/A |

### Azure Disks

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported   <br><br> [See the examples](./backup-managed-disks-ps.md). | Supported    <br><br> [See the examples](./backup-managed-disks-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-backup-disks.md). | Currently not supported | Supported |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-managed-disks-ps.md#run-an-on-demand-backup). | Supported    <br><br> [See the examples](./backup-managed-disks-cli.md#run-an-on-demand-backup). |  N/A | N/A |
| Restore | Restore to new disk | Supported    <br><br> [See the examples](./restore-managed-disks-ps.md). | Supported    <br><br> [See the examples](./restore-managed-disks-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-disks.md). | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./restore-managed-disks-ps.md#tracking-job). | Supported    <br><br> [See the examples](./restore-managed-disks-cli.md#tracking-job). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-disks.md#track-jobs). | N/A | N/A |
| Manage | Modify backup policy | Currently not supported | Currently not supported | Currently not supported | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported | Supported | Supported | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported | Supported | Supported | N/A | N/A |
| Manage | Resume protection | Supported | Supported | Supported | N/A | N/A |

### Azure Database for PostgreSQL Server

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported | Supported | Supported | Currently not here | Supported |
| Backup | Run on-demand backup | Supported | Supported | Supported | N/A | N/A |
| Restore | Restore database on target storage account | Supported | Supported | Supported | N/A | N/A |
| Manage | Modify backup policy | Supported | Supported | Supported | N/A | N/A |
| Manage | Stop protection and delete data | Supported | Supported | Supported | N/A | N/A |
| Manage | Stop protection and retain data | Supported | Supported | Supported | N/A | N/A |
| Manage | Resume protection | Supported | Supported | Supported | N/A | N/A |

### Vault-level configurations

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Manage | Create Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-vms-automation.md#create-a-recovery-services-vault). | Supported    <br><br> [See the examples](./quick-backup-vm-cli.md#create-a-recovery-services-vault). | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-createorupdatevault.md). | N/A | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). |
| Manage | Create Backup vault | Supported    <br><br> [See the examples](./backup-blobs-storage-account-ps.md#create-a-backup-vault). | Supported    <br><br> [See the examples](./backup-blobs-storage-account-cli.md#create-a-backup-vault). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md). | N/A | Supported |
| Manage | Move Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-move-recovery-services-vault.md#use-powershell-to-move-recovery-services-vault). | Supported    <br><br> [See the examples](./backup-azure-move-recovery-services-vault.md#use-powershell-to-move-recovery-services-vault). | Supported | N/A | N/A |
| Manage | Move Backup vault | Supported | Supported | Supported | N/A | N/A |
| Manage | Delete Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md#delete-the-recovery-services-vault-by-using-powershell). | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md#delete-the-recovery-services-vault-by-using-cli). | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md#delete-the-recovery-services-vault-by-using-azure-resource-manager). | N/A | N/A |
| Manage | Delete Backup vault | Supported | Here | Here | N/A | N/A |
| Manage | Configure diagnostics settings | Supported | Supported | Supported | Supported    <br><br> [See the examples](./azure-policy-configure-diagnostics.md). | Supported |
| Manage | Manage Azure Monitor Alerts (preview) | Supported | Supported | Supported | N/A | N/A |
| Manage | Manage Azure Monitor Metrics (preview) | Supported | Supported | Supported | N/A | N/A |
| Security | Enable private endpoints for Recovery Services vault | Supported | Supported | Supported | Only audit policy supported currently | Supported |
| Security | Enable customer-managed keys for Recovery Services vault. | Supported | Supported | Supported | Only audit policy supported currently | Supported |
| Security | Enable soft-delete for Recovery Services vault | Supported | Supported | Supported | Currently not supported | Supported |
| Resiliency | Enable cross region restore for Recovery Services vault | Supported | Supported | Supported | Currently not supported | Supported |