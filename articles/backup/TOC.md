
# Overview
## [What is Azure Backup?](backup-introduction-to-azure-backup.md)

# Get started
## [Back up files and folders](backup-try-azure-backup-in-10-mins.md)
## [Back up Azure virtual machines](backup-azure-vms-first-look.md)
## [Protect Azure VMs](backup-azure-vms-first-look-arm.md)

# How to
## Use PowerShell
### [Azure VMs in Azure portal](backup-azure-vms-automation.md)
### [Azure VMs in classic portal](backup-azure-vms-classic-automation.md)
### [DPM in Azure portal](backup-dpm-automation.md)
### [DPM in classic portal](backup-dpm-automation-classic.md)
### [Windows Server in Azure portal](backup-client-automation.md)
### [Windows Server in classic portal](backup-client-automation-classic.md)

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
### Troubleshoot
#### [Troubleshoot Azure Backup Server](backup-azure-mabs-troubleshoot.md)


## Data Protection Manager
### [Prepare DPM workloads in Azure portal](backup-azure-dpm-introduction.md)
### [Prepare DPM workloads in classic portal](backup-azure-dpm-introduction-classic.md)
### [Use System Center DPM to back up Exchange server](backup-azure-backup-exchange-server.md)
### [Recover data in the Backup vault to an alternate DPM server](backup-azure-alternate-dpm-server.md)
### [Use DPM to back up SQL Server workloads](backup-azure-backup-sql.md)
### [Use DPM to back up a SharePoint farm](backup-azure-backup-sharepoint.md)

## Azure VMs
### Prepare the VM
#### [Prepare Azure virtual machines](backup-azure-vms-prepare.md)
#### [Prepare Resource Manager-deployed virtual machines](backup-azure-arm-vms-prepare.md)
### Plan your environment
#### [Plan VM backup infrastructure](backup-azure-vms-introduction.md)
### Back up VMs
#### [Back up Azure virtual machines to backup vault](backup-azure-vms.md)
#### [Back up Azure virtual machines to a Recovery Services vault](backup-azure-arm-vms.md)
#### [Back up encrypted virtual machines](backup-azure-vms-encryption.md)
### Manage and monitor VMs
#### [Manage and monitor Azure VM backups in classic portal](backup-azure-manage-vms-classic.md)
#### [Manage Azure VM backups in Azure portal](backup-azure-manage-vms.md)
#### [Monitor alerts for Azure VM backups in Azure portal](backup-azure-monitor-vms.md)
### Restore data from VMs
#### [Recover files from Azure VM backups](backup-azure-restore-files-from-vm.md)
#### [Restore virtual machines in Azure](backup-azure-restore-vms.md)
#### [Restore Resource Manager-deployed VMs in Azure portal](backup-azure-arm-restore-vms.md)
#### [Restore Key Vault key and secret for encrypted VMs using Azure Backup](backup-azure-restore-key-secret.md)
#### [Restore encrypted virtual machines](backup-azure-vms-encryption.md)

## Azure SQL Database
### [Configure long-term backup retention](../sql-database/sql-database-configure-long-term-retention.md?toc=%2fazure%2fbackup%2ftoc.json)
### [View backups in a Recovery Services vault](../sql-database/sql-database-view-backups-in-vault.md?toc=%2fazure%2fbackup%2ftoc.json)
### [Restore from long-term backup retention](../sql-database/sql-database-restore-from-long-term-retention.md?toc=%2fazure%2fbackup%2ftoc.json)
### [Delete long-term Azure SQL backups](../sql-database/sql-database-long-term-retention-delete.md?toc=%2fazure%2fbackup%2ftoc.json)

## Windows files and folders
### [Windows Server using the classic deployment model](backup-configure-vault-classic.md)
### [Windows Server using the Resource Manager deployment model](backup-configure-vault.md)
### [Manage Backup vaults using the classic deployment model](backup-azure-manage-windows-server-classic.md)
### [Monitor and manage Recovery Services vaults](backup-azure-manage-windows-server.md)
### [Recover files to a Windows Server using Resource Manager deployment model](backup-azure-restore-windows-server.md)
### [Recover files to a Windows Server using the classic deployment model](backup-azure-restore-windows-server-classic.md)

## [FAQ](backup-azure-backup-faq.md)

## Troubleshoot
### [Azure VM backup problems in Azure portal](backup-azure-vms-troubleshoot.md)
### [Azure VM backup problems in classic portal](backup-azure-vms-troubleshoot-classic.md)
### [Azure VM Backup fails: Could not communicate with the VM agent for snapshot status - Snapshot VM sub task timed out](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md)
### [Slow backup of files and folders in Azure Backup](backup-azure-troubleshoot-slow-backup-performance-issue.md)

# Concepts
## [Overview of Recovery Services vaults](backup-azure-recovery-services-vault-overview.md)
## [Upgrading a Backup vault to Recovery Services vault](backup-azure-upgrade-backup-to-recovery-services.md)
## [Delete an Azure Backup vault](backup-azure-delete-vault.md)
## [Role-Based Access Control](backup-rbac-rs-vault.md)
## [Security for hybrid backups](backup-azure-security-feature.md)
## [Configure Azure Backup reports](backup-azure-configure-reports.md)
## [Azure Backup data model for reports](backup-azure-reports-data-model.md)
## [Configure offline-backup](backup-azure-backup-import-export.md)
## [Replace your tape library](backup-azure-backup-cloud-as-tape.md)
## [Application consistent backups of Linux VMs](backup-azure-linux-app-consistent.md)

# Reference
## [PowerShell](/powershell/module/azurerm.recoveryservices.backup)
## [.NET](/dotnet/api/microsoft.azure.management.recoveryservices.backup)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/backup/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazureonlinebackup)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=backup)
## [Service updates](https://azure.microsoft.com/updates/?product=backup)
