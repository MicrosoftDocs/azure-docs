---
title: Automation in Azure Backup support matrix
description: This article summarizes automation tasks related to Azure Backup support.
ms.date: 11/04/2022
ms.topic: conceptual
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for automation in Azure Backup

You  can automate most backup related tasks using programmatic methods in Azure Backup. This article provides information about various scenarios that automation clients support and the corresponding document references.

## Supported automation methods by operation types

### Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported <br><br> [See the examples](./backup-azure-vms-automation.md#back-up-azure-vms). | Supported <br><br> [See the examples](./quick-backup-vm-cli.md#enable-backup-for-an-azure-vm) | Supported  <br><br>  [See the examples](./backup-azure-arm-userestapi-backupazurevms.md). | Supported  <br><br> [See the examples](./backup-azure-auto-enable-backup.md). | Supported  <br><br> [See the examples](./backup-rm-template-samples.md). | Supported <br><br> [See the examples](./quick-backup-vm-bicep-template.md). | Supported <br><br> [See the examples](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/backup_protected_vm). | 
| Backup | Selective disk backup | Supported  <br><br> [See the examples](./selective-disk-backup-restore.md#using-powershell) | Supported  <br><br> [See the examples](./selective-disk-backup-restore.md#using-azure-cli). | Supported  <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#excluding-disks-in-azure-vm-backup). | N/A | N/A | N/A | Currently not supported. | 
| Backup | Run on-demand backup | Supported   <br><br> [See the examples](./quick-backup-vm-powershell.md#start-a-backup-job). | Supported -  <br><br> [See the examples](./quick-backup-vm-cli.md#start-a-backup-job). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#trigger-an-on-demand-backup-for-a-protected-azure-vm). | N/A | N/A | N/A | N/A | 
| Restore | Restore disks to primary region | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-an-azure-vm). | Supported  <br><br> [See the examples](./tutorial-restore-disk.md#restore-a-vm-disk). | Supported  <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md). | N/A | N/A | N/A | N/A |
| Restore | Cross-region restore | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-disks-to-a-secondary-region). | Supported   <br><br> [See the examples](/cli/azure/backup/restore#az-backup-restore-restore-disks). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#cross-region-restore). | N/A | N/A | N/A | N/A |
| Restore | Restore selective disks | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-selective-disks). | Supported   <br><br> [See the examples](./selective-disk-backup-restore.md#restore-disks-with-azure-cli). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#restore-disks-selectively). | N/A | N/A | N/A | N/A |
| Restore | Create a VM from restored disks | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#using-managed-identity-to-restore-disks). | Supported   <br><br> [See the examples](./tutorial-restore-disk.md#using-managed-identity-to-restore-disks). | Supported   <br><br> [See the examples](/rest/api/backup/restores/trigger). | N/A | N/A | N/A | N/A |
| Restore | Restore files | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#create-a-vm-from-restored-disks). | Supported   <br><br> [See the examples](./tutorial-restore-disk.md#create-a-vm-from-the-restored-disk). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-restoreazurevms.md#restore-disks). | N/A | N/A | N/A | N/A |
| Manage | Monitor jobs | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#restore-files-from-an-azure-vm-backup). | Supported   <br><br> [See the examples](./tutorial-restore-files.md). | N/A | N/A | N/A | N/A |
| Manage | Modify backup policy | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#monitoring-a-backup-job). | Supported   <br><br> [See the examples](./quick-backup-vm-cli.md#monitor-the-backup-job). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-managejobs.md#tracking-the-job). | N/A | N/A | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#retain-data). | Supported   <br><br> [See the examples](/cli/azure/backup/protection#az-backup-protection-disable). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#stop-protection-but-retain-existing-data). | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#delete-backup-data). | Supported   <br><br> [See the examples](/cli/azure/backup/protection#az-backup-protection-disable). | Supported   <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#stop-protection-and-delete-data). | N/A | N/A | N/A | N/A |
| Manage | Resume protection | Supported   <br><br> [See the examples](./backup-azure-vms-automation.md#resume-backup).    | Supported    <br><br> [See the examples](/cli/azure/backup/protection#az-backup-protection-resume). | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-backupazurevms.md#undo-the-deletion) | N/A | N/A | N/A | N/A |

### SQL in Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#configure-a-backup-policy). | Supported | Supported | Currently not supported | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). | Supported | Currently not supported |
| Backup | Enable auto-protection | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#enable-autoprotection) | Supported | Supported | N/A | N/A | N/A | Currently not supported |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#on-demand-backup). | Supported | Supported | N/A | N/A | N/A | Currently not supported |
| Restore | Restore to a distinct full/differential recovery point | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#original-restore-with-distinct-recovery-point). | Supported | Supported | N/A | N/A | N/A | N/A |
| Restore | Restore to a point in time | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#original-restore-with-log-point-in-time). | Supported | Supported | N/A | N/A | N/A | N/A |
| Restore | Cross-region restore | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#alternate-workload-restore-to-a-vault-in-secondary-region). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#track-azure-backup-jobs). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Manage Azure Monitor Alerts (preview) | Supported    <br><br> [See the examples](../azure-monitor/powershell-samples.md). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Manage Azure Monitor Metrics (preview) | Supported    <br><br> [See the examples](../azure-monitor/powershell-samples.md). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Modify backup policy | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#change-policy-for-backup-items). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#retain-data). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#delete-backup-data). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Unregister instance | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#unregister-sql-vm). | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Re-register instance | Supported    <br><br> [See the examples](./backup-azure-sql-automation.md#re-register-sql-vms). | Supported | Supported | N/A | N/A | N/A | N/A |

### SAP HANA in Azure VM

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-backup-cli.md#register-and-protect-the-sap-hana-instance). | Supported | Currently not supported | N/A | Supported | Currently not supported | 
| Backup | Run on-demand backup | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-backup-cli.md#trigger-an-on-demand-backup). | Supported | N/A | Supported – Examples   <br><br> [See the examples](./backup-rm-template-samples.md). | N/A | Currently not supported |
| Restore | Restore to a distinct full/ differential/ incremental recovery point | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-restore-cli.md#restore-a-database). | Supported | N/A | N/A | N/A | N/A |
| Restore | Restore to a point in time | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-restore-cli.md#restore-a-database). | Supported | N/A | N/A | N/A | N/A |
| Restore | Cross-region restore | Currently not supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Monitor jobs | Currently not supported  | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Modify backup policy | Currently not supported | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#change-policy). | Supported | N/A | N/A | N/A | Currently not supported |
| Manage | Stop protection and retain backup data | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#stop-protection-with-retain-data) | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-createorupdatepolicy.md). | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete backup data | Currently not supported  | Supported    <br><br> [See the examples](./tutorial-sap-hana-manage-cli.md#stop-protection-without-retain-data). | Supported    <br><br> [See the examples](/rest/api/backup/protected-items/delete). | N/A | N/A | N/A | N/A |
| Manage | Unregister instance | Currently not supported  | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Re-register instance | Currently not supported  | Supported | Supported | N/A | N/A | N/A | N/A |

### Azure Files

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-azure-afs-automation.md#configure-a-backup-policy). | Supported    <br><br> [See the examples](./backup-afs-cli.md#enable-backup-for-azure-file-shares). | Supported    <br><br> [See the examples](./backup-azure-file-share-rest-api.md#configure-backup-for-an-unprotected-azure-file-share-using-rest-api). | Currently not supported | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). | Supported | Supported <br><br> [See the examples](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/backup_protected_file_share). |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-azure-afs-automation.md#trigger-an-on-demand-backup). | Supported    <br><br> [See the examples](./backup-afs-cli.md#trigger-an-on-demand-backup-for-file-share). | Supported    <br><br> [See the examples](./backup-azure-file-share-rest-api.md#trigger-an-on-demand-backup-for-file-share). | N/A | N/A | N/A | N/A |
| Restore | Restore to original or alternate location | Supported    <br><br> [See the examples](./restore-afs-powershell.md). | Supported    <br><br> [See the examples](./restore-afs-cli.md). | Supported    <br><br> [See the examples](./restore-azure-file-share-rest-api.md). | N/A | N/A |N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./manage-afs-powershell.md#track-backup-and-restore-jobs). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#monitor-jobs). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#monitor-jobs). | N/A | N/A |N/A | N/A |
| Manage | Modify backup policy | Supported    <br><br> [See the examples](./manage-afs-powershell.md#modify-the-protection-policy). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#modify-policy). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#modify-policy). | N/A | N/A |N/A | N/A |
| Manage | Stop protection and retain backup data | Supported    <br><br> [See the examples](./manage-afs-powershell.md#stop-protection-and-retain-recovery-points). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#stop-protection-and-retain-recovery-points). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#stop-protection-but-retain-existing-data). | N/A | N/A |N/A | N/A |
| Manage | Stop protection and delete backup data | Supported    <br><br> [See the examples](./manage-afs-powershell.md#stop-protection-without-retaining-recovery-points). | Supported    <br><br> [See the examples](./manage-afs-backup-cli.md#stop-protection-without-retaining-recovery-points). | Supported    <br><br> [See the examples](./manage-azure-file-share-rest-api.md#stop-protection-and-delete-data). | N/A | N/A | N/A | N/A |

### Azure Blobs

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported    <br><br> [See the examples](./backup-blobs-storage-account-ps.md). | Supported    <br><br> [See the examples](./backup-blobs-storage-account-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-backup-blobs.md). | Currently not supported | Supported | Supported    <br><br> [See the examples](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dataprotection/backup-create-storage-account-enable-protection). | Supported    <br><br> [See the examples](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/data_protection_backup_instance_blob_storage). |
| Restore | Restore blobs | Supported    <br><br> [See the examples](./restore-blobs-storage-account-ps.md). | Supported    <br><br> [See the examples](./restore-blobs-storage-account-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-blobs.md). | N/A | N/A | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./restore-blobs-storage-account-ps.md#tracking-job). | Supported    <br><br> [See the examples](./restore-blobs-storage-account-cli.md#tracking-job). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-blobs.md#tracking-jobs). | N/A | N/A | N/A | N/A |
| Manage | Modify backup policy | Currently not supported | Currently not supported | Currently not supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and retain backup data | Currently not supported | Currently not supported | Currently not supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Resume protection | Currently not supported | Currently not supported | Currently not supported | N/A | N/A | N/A | N/A |

### Azure Disks

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported   <br><br> [See the examples](./backup-managed-disks-ps.md). | Supported    <br><br> [See the examples](./backup-managed-disks-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-backup-disks.md). | Currently not supported | Supported | Supported    <br><br> [See the examples](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dataprotection/backup-create-disk-enable-protection). | Supported    <br><br> [See the examples](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/data_protection_backup_instance_disk). |
| Backup | Run on-demand backup | Supported    <br><br> [See the examples](./backup-managed-disks-ps.md#run-an-on-demand-backup). | Supported    <br><br> [See the examples](./backup-managed-disks-cli.md#run-an-on-demand-backup). |  N/A | N/A | N/A | N/A | N/A |
| Restore | Restore to new disk | Supported    <br><br> [See the examples](./restore-managed-disks-ps.md). | Supported    <br><br> [See the examples](./restore-managed-disks-cli.md). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-disks.md). | N/A | N/A | N/A | N/A |
| Manage | Monitor jobs | Supported    <br><br> [See the examples](./restore-managed-disks-ps.md#tracking-job). | Supported    <br><br> [See the examples](./restore-managed-disks-cli.md#tracking-job). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-restore-disks.md#track-jobs). | N/A | N/A |  N/A | N/A | 
| Manage | Modify backup policy | Currently not supported | Currently not supported | Currently not supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and retain backup data | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete backup data | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Resume protection | Supported | Supported | Supported | N/A | N/A | N/A | N/A |

### Azure Database for PostgreSQL Server

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** | **Bicep** | **Terraform** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Backup | Create backup policy and configure backup | Supported <br><br> [See the examples](backup-postgresql-ps.md). | Supported <br><br> [See the examples](backup-postgresql-cli.md). | Supported <br><br> [See the examples](backup-azure-data-protection-use-rest-api-backup-postgresql.md). | Currently not here | Supported | Supported | Supported    <br><br> [See the examples](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/data_protection_backup_instance_postgresql). |
| Backup | Run on-demand backup | Supported <br><br> [See the examples](backup-postgresql-ps.md). | Supported <br><br> [See the examples](backup-postgresql-cli.md). | Supported <br><br> [See the examples](backup-azure-data-protection-use-rest-api-backup-postgresql.md). | N/A | N/A | N/A | N/A |
| Restore | Restore database on target storage account | Supported <br><br> [See the examples](restore-postgresql-database-ps.md). | Supported <br><br> [See the examples](restore-postgresql-database-cli.md). | Supported <br><br> [See the examples](restore-postgresql-database-use-rest-api.md) | N/A | N/A | N/A | N/A |
| Manage | Modify backup policy | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and delete data | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Stop protection and retain data | Supported | Supported | Supported | N/A | N/A | N/A | N/A |
| Manage | Resume protection | Supported | Supported | Supported | N/A | N/A | N/A | N/A |

### Vault-level configurations

| **Category** | **Operation** | **PowerShell** | **CLI** | **REST API** | **Azure Policy** | **ARM Template** |
| --- | --- | --- | --- | --- | --- | --- |
| Manage | Create Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-vms-automation.md#create-a-recovery-services-vault). | Supported    <br><br> [See the examples](./quick-backup-vm-cli.md#create-a-recovery-services-vault). | Supported    <br><br> [See the examples](./backup-azure-arm-userestapi-createorupdatevault.md). | N/A | Supported    <br><br> [See the examples](./backup-rm-template-samples.md). |
| Manage | Create Backup vault | Supported    <br><br> [See the examples](./backup-blobs-storage-account-ps.md#create-a-backup-vault). | Supported    <br><br> [See the examples](./backup-blobs-storage-account-cli.md#create-a-backup-vault). | Supported    <br><br> [See the examples](./backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md). | N/A | Supported |
| Manage | Move Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-move-recovery-services-vault.md#use-powershell-to-move-recovery-services-vault). | Supported    <br><br> [See the examples](./backup-azure-move-recovery-services-vault.md#use-powershell-to-move-recovery-services-vault). | Supported | N/A | N/A |
| Manage | Move Backup vault | Supported | Supported | Supported | N/A | N/A |
| Manage | Delete Recovery Services vault | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md?tabs=powershell#tabpanel_1_powershell). | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md?tabs=cli#tabpanel_1_cli). | Supported    <br><br> [See the examples](./backup-azure-delete-vault.md?tabs=arm#tabpanel_1_arm). | N/A | N/A |
| Manage | Delete Backup vault | Supported | Here | Here | N/A | N/A |
| Manage | Configure diagnostics settings | Supported | Supported | Supported | Supported    <br><br> [See the examples](./azure-policy-configure-diagnostics.md). | Supported |
| Manage | Manage Azure Monitor Alerts (preview) | Supported | Supported | Supported | N/A | N/A |
| Manage | Manage Azure Monitor Metrics (preview) | Supported | Supported | Supported | N/A | N/A |
| Security | Enable private endpoints for Recovery Services vault | Supported | Supported | Supported | Only audit policy supported currently | Supported |
| Security | Enable customer-managed keys for Recovery Services vault. | Supported | Supported | Supported | Only audit policy supported currently | Supported |
| Security | Enable soft-delete for Recovery Services vault | Supported | Supported | Supported | Currently not supported | Supported |
| Resiliency | Enable cross region restore for Recovery Services vault | Supported | Supported | Supported | Currently not supported | Supported |

## Next steps

[Automation in Azure Backup](automation-backup.md)