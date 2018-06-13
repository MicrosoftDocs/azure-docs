---
title: Upgrade Backup vault to Recovery Services vault of Azure Backup'
description: Upgrade Backup vault to Recovery Services vault to get new features like backup of Resource manager VMs, enhanced security, VMware VM backup and System State backup for Windows Servers
services: backup
author: trinadhk
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 02/10/2017
ms.author: trinadhk
---
# Backup vault upgraded to Recovery Services vault
This article provides an overview of what Recovery Services vault provides, frequently asked questions about upgrading existing Backup vault to Recovery Services vault, and post-upgrade steps. A Recovery Services vault is the Azure Resource Manager equivalent of a Backup vault that houses your backup data. The data is typically copies of data, or configuration information for virtual machines (VMs), workloads, servers, or workstations, whether on-premises or in Azure.

## What is a Recovery Services vault?
A Recovery Services vault is an online storage entity in Azure used to hold data such as backup copies, recovery points, and backup policies. You can use Recovery Services vaults to hold backup data for various Azure services such as IaaS VMs (Linux or Windows) and Azure SQL databases. Recovery Services vaults support System Center DPM, Windows Server, Azure Backup Server, and more. Recovery Services vaults make it easy to organize your backup data, while minimizing management overhead.

## Comparing Recovery Services vaults and Backup vaults
Recovery Services vaults are based on the Azure Resource Manager model of Azure, whereas Backup vaults are based on the Azure Service Manager model. When you upgrade a Backup vault to a Recovery Services vault, the backup data remains intact during and after the upgrade process. Recovery Services vaults provide features not available for Backup vaults, such as:

- **Enhanced capabilities to help secure backup data**: With Recovery Services vaults, Azure Backup provides security capabilities to protect cloud backups. These security features ensure that you can secure your backups, and safely recover data from cloud backups even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

- **Central monitoring for your hybrid IT environment**: With Recovery Services vaults, you can monitor not only your [Azure IaaS VMs](backup-azure-manage-vms.md) but also your [on-premises assets](backup-azure-manage-windows-server.md#manage-backup-items) from a central portal. [Learn more](http://azure.microsoft.com/blog/alerting-and-monitoring-for-azure-backup)

- **Role-Based Access Control (RBAC)**: RBAC provides fine-grained access management control in Azure. [Azure provides various built-in roles](../role-based-access-control/built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). Recovery Services vaults are compatible with RBAC, which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md)

- **Protect all configurations of Azure Virtual Machines**: Recovery Services vaults protect Resource Manager-based VMs including Premium Disks, Managed Disks, and Encrypted VMs. Upgrading a Backup vault to a Recovery Services vault gives you the opportunity to upgrade your Service Manager-based VMs to Resource Manager-based VMs. While upgrading the vault, you can retain your Service Manager-based VM recovery points and configure protection for the upgraded (Resource Manager-enabled) VMs. [Learn more](http://azure.microsoft.com/blog/azure-backup-recovery-services-vault-ga)

- **Instant restore for IaaS VMs**: Using Recovery Services vaults, you can restore files and folders from an IaaS VM without restoring the entire VM, which enables faster restore times. Instant restore for IaaS VMs is available for both Windows and Linux VMs. [Learn more](http://azure.microsoft.com/blog/instant-file-recovery-from-azure-linux-vm-backup-using-azure-backup-preview)

> [!NOTE]
> If you have items registered to a Backup vault with MARS agent earlier than 2.0.9083.0, [download the latest MARS agent]( http://download.microsoft.com/download/F/4/B/F4B06356-150F-4DB0-8AD8-95B4DB4BBF7C/MARSAgentInstaller.exe) version to take the benefits of all the features of Recovery Services vault. 
> 

## Managing your Recovery Services vaults
The following screens show a new Recovery Services vault, upgraded from Backup vault, in the Azure portal. The upgraded vault will be present in a default Resource group named “Default-RecoveryServices-ResourceGroup-geo”. 
Example: If your Backup vault was located in West US, it will be put up in a default RG named Default-RecoveryServices-ResourceGroup-westus.
> [!NOTE]
> For CPS Standard customers, Resource group is not changed after the vault upgrade and remains the same as it was before the upgrade.

The first screen shows the vault dashboard that displays key entities for the vault.
![example of Recovery Services vault upgraded from a Backup vault](./media/backup-azure-upgrade-backup-to-recovery-services/upgraded-rs-vault-in-dashboard.png)

The second screen shows the help links available to help you get started using the Recovery Services vault.

![help links in the Quick Start blade](./media/backup-azure-upgrade-backup-to-recovery-services/quick-start-w-help-links.png)

## Post-upgrade steps
Recovery Services vault supports specifying time zone information in backup policy. After vault is successfully upgraded, go to Backup policies from vault settings menu and update the time zone information for each of the policies configured in the vault. This screen already shows the backup schedule time specified as per local time zone used when you created policy. 

## Enhanced security
When a Backup vault is upgraded to a Recovery Services vault, the security settings for that vault are automatically turned on. When the security settings are on, certain operations such as deleting backups, or changing a passphrase require an [Azure Multi-Factor Authentication](../active-directory/authentication/multi-factor-authentication.md) PIN. For more information on the enhanced security, see the article [Security features to protect hybrid backups](backup-azure-security-feature.md). 
When the enhanced security is turned on, data is retained up to 14 days after the recovery point information has been deleted from the vault. Customers are billed for storage of this security data. Security data retention applies to recovery points taken for the Azure Backup agent, Azure Backup Server, and System Center Data Protection Manager. 

## Gather data on your vault
Once you upgrade to a Recovery Services vault, configure reports for Azure Backup (for IaaS VMs and Microsoft Azure Recovery Services agent), and use Power BI to access the reports. For additional information on gathering data, see the article, [Configure Azure Backup reports](backup-azure-configure-reports.md).

## Frequently asked questions

**Does the upgrade plan affect my ongoing backups?**</br>
No. Your ongoing backups continue uninterrupted during and after upgrade.

**What does this upgrade mean for my existing tooling?**</br>
You must update your existing automation or tooling to the Resource Manager deployment model to ensure that it continues to work after the upgrade. Consult the PowerShell cmdlets references for the [Resource Manager deployment model](backup-client-automation.md).

**Can I roll back after upgrade?**</br>
No. Rollback is not supported after the resources have been successfully upgraded.

**Can I view my classic vault post upgrade?**</br>
No. You cannot view or manage your classic vault post upgrade. You will only be able to use the new Azure portal for all management actions on the vault.

**Why can’t I see servers protected by MARS agent in my upgraded vault?**</br>
You need to install the latest MARS agent to see all the servers protected by MARS agent in your vault. You can download the latest version of the agent from [here]( http://download.microsoft.com/download/F/4/B/F4B06356-150F-4DB0-8AD8-95B4DB4BBF7C/MARSAgentInstaller.exe).

**I can’t see Backup policy for the servers protected by MARS agent after the upgrade**</br>
Vault’s backup policy might be out of date and therefore could not be synced to the upgraded vault. Please update the policy to ensure you continue to see your policies in the upgraded vault.
To update the policy, go to MARS agent and update the configured backup policy.

**Why can’t I update my Backup policy after the upgrade?**</br>
This happens when you are on an old backup agent and select the minimum retention period to be less than the allowed minimum value. When a Backup vault is upgraded to a Recovery Services vault, the security settings for that vault are automatically turned on. To ensure that there are always a valid number of recovery points available, there is some minimum retention period that needs to be maintained as per the security feature. For more details, refer [here](backup-azure-security-feature.md).
Also, you need to update your Azure Backup agents to latest version to take the benefits of the latest features of Azure Backup.

**I have updated my agent, but I still can’t see any objects being synced even days after the upgrade**</br>
Please check if you have registered the same machine to multiple vaults. Ensure that you are looking at the same vault to which the MARS Agent is registered. To find out which vault your MARS Agent is registered to, open the Windows Registry and check the value for ServiceResourceName key under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config
The vault registered to that MARS agent will appear there. If the ServiceResourceName key is not visible in your system, reach out to us with the value of the ResourceId and MachineId keys under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config and we will help you resolve the issue.

**Why can't I see the jobs information for my resources after upgrade?**</br>
Monitoring for backups (MARS agent and IaaS) is a new feature that you get when you upgrade your Backup vault to Recovery Services vault. The monitoring information takes up to 12 hours to sync with the service.

**How do I report an issue?**</br>
If any portion of the vault upgrade fails, note the OperationId listed in the error. Microsoft Support will proactively work to resolve the issue. You can reach out to Support or email us at rsvaultupgrade@service.microsoft.com with your Subscription ID, vault name and OperationId. We will attempt to resolve the issue as quickly as possible. Do not retry the operation unless explicitly instructed to do so by Microsoft.

## Next steps
Use the following articles for:</br>
[Back up an IaaS VM](backup-azure-arm-vms-prepare.md)</br>
[Back up an Azure Backup Server](backup-azure-microsoft-azure-backup.md)</br>
[Back up a Windows Server](backup-configure-vault.md)
