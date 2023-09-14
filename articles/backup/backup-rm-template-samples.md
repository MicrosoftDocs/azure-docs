---
title: Azure Resource Manager and Bicep templates
description: Azure Resource Manager and Bicep templates for use with Recovery Services vaults and Azure Backup features
ms.topic: sample
ms.date: 09/05/2022
ms.custom: mvc, devx-track-bicep, devx-track-arm-template
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Azure Resource Manager and Bicep templates for Azure Backup

The following table includes a link to a repository of Azure Resource Manager and Bicep templates for use with Recovery Services vaults, Backup vaults, and Azure Backup features. To learn about the JSON or Bicep syntax and properties, see [Microsoft.RecoveryServices resource types](/azure/templates/microsoft.recoveryservices/allversions) and [Microsoft.DataProtection resource types](/azure/templates/microsoft.dataprotection/allversions).

| Template | Description |
|---|---|
|**Recovery Services vault** | |
| [Create a Recovery Services vault](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-vault-create)| Create a Recovery Services vault. The vault can be used for Azure Backup and Azure Site Recovery. |
| [Create Recovery Services vault with backup policies](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-create-vault-with-backup-policies) | Create a Recovery Services vault. You can optionally configure backup policies, system identity, backup storage type, Cross Region Restores, and enable diagnostics logs and a delete lock. |
| [Create Recovery Services vault and Enable Diagnostics](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-create-vault-enable-diagnostics) | Template creates a Recovery Services vault and enables diagnostics for Azure Backup. |
|**Back up virtual machines**| |
| [Back up Resource Manager VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-vms) | Use the existing Recovery Services vault and Backup policy to back up Resource Manager-virtual machines in the same resource group.|
| [Back up IaaS VMs to Recovery Services vault](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-classic-resource-manager-vms) | Template to back up classic and Resource Manager-virtual machines. |
| [Create Weekly Backup policy for IaaS VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-weekly-backup-policy-create) | Template creates Recovery Services vault and a weekly backup policy, which is used to back up classic and Resource Manager-virtual machines.|
| [Create Daily Backup policy for IaaS VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-daily-backup-policy-create) | Template creates Recovery Services vault and a daily backup policy, which is used to back up classic and Resource Manager-virtual machines.|
| [Deploy Windows Server VM with backup enabled](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-create-vm-and-configure-backup) | Template creates a Windows Server VM and Recovery Services vault with the default backup policy enabled.|
|**Monitor Backup jobs** |  |
| [Use Azure Monitor logs with Azure Backup](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/backup-oms-monitoring) | Template deploys Azure Monitor logs with Azure Backup, which allows you to monitor backup and restore jobs, backup alerts, and the Cloud storage used in your Recovery Services vaults.|
| [Set up notifications for backup alerts using Azure Monitor](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-create-alert-processing-rule) | Template to enable you to set up email notifications for your Recovery Services vaults using Azure Monitor. |
|**Back up SQL Server in Azure VM** |  |
| [Back up SQL Server in Azure VM](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-vm-workload-backup) | Template creates a Recovery Services vault and Workload specific Backup Policy. It Registers the VM with Azure Backup service and Configures Protection on that VM. Currently, it only works for SQL Gallery images. |
|**Back up Azure File shares** |  |
| [Back up Azure File shares](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-file-share) (daily) | This template configures protection for an existing Azure file share by specifying appropriate details for the Recovery Services vault and backup policy. It optionally creates a new Recovery Services vault and backup policy, and registers the storage account containing the file share to the Recovery Services vault. |
| [Backup File share](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-file-share-hourly)  (hourly) | This template configures hourly protection for an existing Azure File share by specifying appropriate details for the Recovery Services vault and backup policy. It optionally creates a new Recovery Services vault and backup policy, and registers the storage account containing the File share to the Recovery Services vault. |
| **Backup vault** | |
| [Creates Backup vault](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dataprotection/backup-vault-basic) | Template creates a Backup Vault. The vault can be used for Azure Database for PostgreSQL backup, Azure Blobs backup, Azure Disk backup. |
| **Backup Azure Disk** | |
| [Create Disk and enable protection](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dataprotection/backup-create-disk-enable-protection) | Template creates a disk and enables protection via Azure Backup. |
| **Backup Azure Blobs** | |
| [Create storage account and enables blobs protection](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dataprotection/backup-create-storage-account-enable-protection) | Template creates storage account and enables blobs protection via Azure Backup.
