
# Overview

## [What is Azure Backup?](backup-introduction-to-azure-backup.md)

# Quickstarts

## [Back up VMs - Portal](quick-backup-vm-portal.md)
## [Back up VMs - PowerShell](quick-backup-vm-powershell.md)
## [Back up VMs - CLI](quick-backup-vm-cli.md)

# Tutorials

## [Back up Azure VMs at scale](tutorial-backup-azure-vm.md)
## [Back up Windows Server to Azure](tutorial-backup-windows-server-to-azure.md)

# Samples

## [PowerShell](powershell-backup-samples.md)

# Concepts

## FAQ
### [FAQ on Recovery Services vault](backup-azure-backup-faq.md)
### [FAQ on Azure VM backup](backup-azure-vm-backup-faq.md)
### [FAQ on file-folder backup using Azure Backup agent](backup-azure-file-folder-backup-faq.md)
## [Role-Based Access Control](backup-rbac-rs-vault.md)
## [Security for hybrid backups](backup-azure-security-feature.md)
## [Configure offline-backup](backup-azure-backup-import-export.md)
## [Replace your tape library](backup-azure-backup-cloud-as-tape.md)

# How to

## Azure Backup Server
### [Azure Backup Server protection matrix](backup-mabs-protection-matrix.md)
### Install or upgrade
#### [Prepare Azure Backup Server workloads in Azure portal](backup-azure-microsoft-azure-backup.md)
#### [Prepare Azure Backup Server workloads in classic portal](backup-azure-microsoft-azure-backup-classic.md)
#### [Add storage to Azure Backup Server](backup-mabs-add-storage.md)
#### [Upgrade Azure Backup Server to v.2](backup-mabs-upgrade-to-v2.md)
#### [Unattended installation of Azure Backup Server](backup-mabs-unattended-install.md)
### Protect workloads
#### [Use Azure Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
#### [Use Azure Backup Server to back up Exchange](backup-azure-exchange-mabs.md)
#### [Use Azure Backup Server to back up a SharePoint farm](backup-azure-backup-sharepoint-mabs.md)
#### [Use Azure Backup Server to back up SQL](backup-azure-sql-mabs.md)
#### [Protect system state and bare metal recovery](backup-mabs-system-state-and-bmr.md)
### [Recover data from Azure Backup Server](backup-azure-alternate-dpm-server.md)

## Azure VMs
### Prepare the VM
#### [Prepare Resource Manager-deployed virtual machines](backup-azure-arm-vms-prepare.md)
#### [Application consistent backups of Linux VMs](backup-azure-linux-app-consistent.md)
#### [Prepare Azure virtual machines](backup-azure-vms-prepare.md)
### Plan your environment
#### [Plan VM backup infrastructure](backup-azure-vms-introduction.md)
### Back up VMs
#### [Back up Azure virtual machines to a Recovery Services vault](backup-azure-arm-vms.md)
#### [Back up encrypted virtual machines](backup-azure-vms-encryption.md)
#### [Back up Azure virtual machines](backup-azure-vms.md)
### Manage and monitor VMs
#### [Manage Azure VM backups in Azure portal](backup-azure-manage-vms.md)
#### [Monitor alerts for Azure VM backups in Azure portal](backup-azure-monitor-vms.md)
#### [Manage and monitor Azure VM backups in classic portal](backup-azure-manage-vms-classic.md)
### Restore data from VMs
#### [Recover files from Azure VM backups](backup-azure-restore-files-from-vm.md)
#### [Restore Resource Manager-deployed VMs in Azure portal](backup-azure-arm-restore-vms.md)
#### [Restore encrypted virtual machines](backup-azure-vms-encryption.md)
#### [Restore virtual machines in Azure](backup-azure-restore-vms.md)
#### [Restore Key Vault key and secret for encrypted VMs](backup-azure-restore-key-secret.md)

## Configure Azure Backup reports
### [Configure Azure Backup reports](backup-azure-configure-reports.md)
### [Data model for Azure Backup reports](backup-azure-reports-data-model.md)
### [Log Analytics data model for Azure Backup](backup-azure-log-analytics-data-model.md)

## Data Protection Manager
### [Prepare DPM workloads in Azure portal](backup-azure-dpm-introduction.md)
### [Prepare DPM workloads in classic portal](backup-azure-dpm-introduction-classic.md)
### [Use System Center DPM to back up Exchange server](backup-azure-backup-exchange-server.md)
### [Recover data to an alternate DPM server](backup-azure-alternate-dpm-server.md)
### [Use DPM to back up SQL Server workloads](backup-azure-backup-sql.md)
### [Use DPM to back up a SharePoint farm](backup-azure-backup-sharepoint.md)

## Use PowerShell
### [Azure VMs in Azure portal](backup-azure-vms-automation.md)
### [Azure VMs in classic portal](backup-azure-vms-classic-automation.md)
### [DPM in Azure portal](backup-dpm-automation.md)
### [DPM in classic portal](backup-dpm-automation-classic.md)
### [Windows Server in Azure portal](backup-client-automation.md)
### [Windows Server in classic portal](backup-client-automation-classic.md)

## Azure SQL Database
### [Configure long-term backup retention](../sql-database/sql-database-configure-long-term-retention.md?toc=%2fazure%2fbackup%2ftoc.json)
### [View backups in a Recovery Services vault](../sql-database/sql-database-view-backups-in-vault.md?toc=%2fazure%2fbackup%2ftoc.json)
### [Restore from long-term backup retention](../sql-database/sql-database-restore-from-long-term-retention.md?toc=%2fazure%2fbackup%2ftoc.json)
### [Delete long-term Azure SQL backups](../sql-database/sql-database-long-term-retention-delete.md?toc=%2fazure%2fbackup%2ftoc.json)

## Windows Server
### [Back up Windows Server files and folders](backup-configure-vault.md)
### [Back up Windows Server System State](backup-azure-system-state.md)
### [Recover files from Azure to Windows Server](backup-azure-restore-windows-server.md)
### [Restore Windows Server System State](backup-azure-restore-system-state.md)
### [Monitor and manage Recovery Services vaults](backup-azure-manage-windows-server.md)
### Back up and restore using the classic portal
#### [Windows Server using the classic deployment model](backup-configure-vault-classic.md)
#### [Manage Backup vaults using the classic deployment model](backup-azure-manage-windows-server-classic.md)
#### [Recover files to a Windows Server using the classic deployment model](backup-azure-restore-windows-server-classic.md)

## Recovery Services vault
### [Overview of Recovery Services vaults](backup-azure-recovery-services-vault-overview.md)
### [Upgrading a Backup vault to Recovery Services vault](backup-azure-upgrade-backup-to-recovery-services.md)
### [Delete a Recovery Services vault](backup-azure-delete-vault.md)

## Troubleshoot
### [Azure VM backup problems in Azure portal](backup-azure-vms-troubleshoot.md)
### [Azure VM backup problems in classic portal](backup-azure-vms-troubleshoot-classic.md)
### [Azure VM Backup fails: Could not communicate with the VM agent for snapshot status - Snapshot VM sub task timed out](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md)
### [Slow backup of files and folders in Azure Backup](backup-azure-troubleshoot-slow-backup-performance-issue.md)
### [Troubleshoot Azure Backup Server](backup-azure-mabs-troubleshoot.md)




# Reference
## [PowerShell](/powershell/module/azurerm.recoveryservices.backup)
## [.NET](/dotnet/api/microsoft.azure.management.recoveryservices.backup)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazureonlinebackup)
## [Pricing](https://azure.microsoft.com/pricing/details/backup/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=backup)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=backup)
