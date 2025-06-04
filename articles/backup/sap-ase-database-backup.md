---
title: Configure backup for SAP ASE (Sybase) database on Azure VMs using Azure portal
description: In this article, learn how to configure backup for SAP ASE (Sybase) databases that are running on Azure virtual machines.
ms.topic: how-to
ms.date: 05/13/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to configure automated backup for my SAP ASE databases on Azure VMs, so that I can ensure data integrity and recovery in case of failure."
---

# Configure backup for SAP ASE (Sybase) database on Azure VMs using Azure portal

This article describes how to configure backup for SAP Adaptive Server Enterprise (ASE) (Sybase) databases (running on Azure Virtual Machines) using Azure portal.

Learn about the [supported configurations and scenarios for SAP ASE database backup](sap-ase-backup-support-matrix.md) on Azure Virtual Machines (VMs).

## Prerequisites

Before you set up the SAP ASE database for backup, review the following prerequisites:
- Identify or create a Recovery Services vault in the same region and subscription as the VM running SAP ASE.
- Allow connectivity from the VM to the internet, so that it can reach Azure.
- The combined length of the SAP ASE Server VM name and the Resource Group name must have **<= 84** characters for Azure Resource Manager (ARM) VMs (and 77 characters for classic VMs) as the service reserves some characters. 
- VM must have python **>= 3.6.15** (recommended- Python3.10) with requests module installed. The default sudo python3 must run python 3.6.15 or higher. Validate by running python3 and **sudo python3** in your system to check the python version. To change the default version, link python3 to python 3.6.15 or higher.
- [Run the SAP ASE backup configuration script (preregistration script)](sap-ase-database-backup-run-preregistration-quickstart.md) in the virtual machine that hosts the SAP ASE database. This script gets the ASE system ready for backup.
- Assign the following privileges and settings for the backup operation:
  
  | Privilege/ Setting | Description |
  | --- | --- |
  | Operator role | Enable this **ASE database role** for the database user to create a custom database user for the backup and restore operations and pass it in the preregistration script. |
  | **Map external file** privilege | Enable this role to allow database file access. |
  | **Own any database** privilege |Allows differential backups. The **Allow incremental dumps** for the database should be **True**. |
  | **Trunc log on chkpt** privilege | Disable this privilege for all databases that you want to protect using the **ASE Backup**. Allows you to back up the database log to recovery services vault. Learn more about the [SAP note - 2921874 - "trunc log on chkpt" in databases with HADR - SAP ASE - SAP for Me](https://me.sap.com/notes/0002921874). |

  >[!Note]
  >Log backups aren't supported for the Master database. For other system databases, log backups can only be supported if the database's log files are stored separately from its data files. By default, system databases are created with both data and log files in the same database device, which prevents log backups. To enable log backups, the database administrator must change the location of the log files to a separate device.

- Use the Azure built-in roles to configure backup- assignment of roles and scope to the resources. The following Contributor role allows you to run the **Configure Protection** operation on the database VM:

  | Resource (Access control) | Role | User, group, or service principal |
  | --- | --- | --- |
  | Source Azure VM running the ASE database | Virtual Machine Contributor | Allows you to configure the backup operation. |

- [Create a custom role for Azure Backup](sap-ase-database-backup-tutorial.md#create-a-custom-role-for-azure-backup).
- [Establish network connectivity](sap-ase-database-backup-tutorial.md#establish-network-connectivity).
- Use an existing Recovery Services vault, or [create a new one](backup-create-recovery-services-vault.md#create-a-recovery-services-vault).
- [Enable Cross Region Restore](sap-ase-database-backup-tutorial.md#enable-cross-region-restore) for Recovery Services vault.

## Discover the SAP ASE databases

To discover the SAP ASE databases, follow these steps:

1. Go to the **Recovery Services Vault**, and then select **+ Backup**.

   :::image type="content" source="./media/sap-ase-database-backup/initiate-database-backup.png" alt-text="Screenshot shows how to start the SAP database backup." lightbox="./media/sap-ase-database-backup/initiate-database-backup.png"::: 

2. On the **Backup Goal**, select **SAP ASE (Sybase) in Azure VM** as the datasource type.

   :::image type="content" source="./media/sap-ase-database-backup/select-data-source-type.png" alt-text="Screenshot shows the selection of the data source type." lightbox="./media/sap-ase-database-backup/select-data-source-type.png":::
 
3. Select **Start Discovery**. This initiates discovery of unprotected Linux VMs in the vault region.

     :::image type="content" source="./media/sap-ase-database-backup/start-database-discovery.png" alt-text="Screenshot shows how to start the discovery of the database." lightbox="./media/sap-ase-database-backup/start-database-discovery.png":::

   >[!Note]
   >- After discovery, unprotected VMs appear in the portal, listed by name and resource group.
   >- If a VM isn't listed as expected, check if it's already backed up in a vault.
   >- Multiple VMs can have the same name but they belong to different resource groups.
 
4. On the **Select Virtual Machines** pane, download the prepost script that provides permissions for the Azure Backup service to access the SAP ASE VMs for database discovery.
5. Run the script on each VM hosting SAP ASE databases that you want to back up.
6. After you run the script on the VMs, on the **Select Virtual Machines** pane, select the *VMs*, and then select **Discover DBs**.

   Azure Backup discovers all SAP ASE databases on the VM. During discovery, Azure Backup registers the VM with the vault, and installs an extension on the VM. No agent is installed on the database.

     :::image type="content" source="./media/sap-ase-database-backup/select-database.png" alt-text="screenshot shows how to select a database for backup configuration from the discovered list." lightbox="./media/sap-ase-database-backup/select-database.png"::: 

## Configure the SAP ASE (Sybase) database backup

After the database discovery process is complete, Azure Backup redirects to the **Backup Goal** pane, allowing you to configure backup settings for the selected VM hosting the SAP ASE database.

To configure the backup operation for the SAP ASE database, follow these steps:


1.	On the **Backup Goal** pane, under **Step 2**, select **Configure Backup**.
 
     :::image type="content" source="./media/sap-ase-database-backup/configure-backup.png" alt-text="Screenshot shows how to start the backup configuration." lightbox="./media/sap-ase-database-backup/configure-backup.png":::

2. Under **Backup Policy**, select **Create a new policy** for the databases. 

   :::image type="content" source="./media/sap-ase-database-backup/create-backup-policy.png" alt-text="Screenshot shows how to start creating the backup policy." lightbox="./media/sap-ase-database-backup/create-backup-policy.png":::

   A backup policy defines when backups are taken, and how long they're retained.

   - A policy is created at the vault level.
   - Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.

3. On the **Policy name**, provide a name for the new policy.

     :::image type="content" source="./media/sap-ase-database-backup/add-backup-policy-name.png" alt-text="Screenshot shows how to provide a name for the new backup policy." lightbox="./media/sap-ase-database-backup/add-backup-policy-name.png":::
 

4. On the **Full Backup policy**, select a **Backup Frequency**, and then select **Daily** or **Weekly** as per the requirement.

   - **Daily**: Select the **hour** and **time zone** in which the backup job begins.

     >[!Note]
     >- You must run a full backup. You can't turn off this option.
     >- Go to Full Backup policy to view the policy settings.
     >- You can't create differential backups for daily full backups.

   - **Weekly**: Select the **day of the week**, **hour**, and **time zone** in which the backup job runs.

   The following screenshot shows the backup schedule for full backups.

     :::image type="content" source="./media/sap-ase-database-backup/set-backup-rules.png" alt-text="Screenshot shows the configuration of backup rules." lightbox="./media/sap-ase-database-backup/set-backup-rules.png":::


5. On the **Retention Range**, define the retention range for the full backup.
   >[!Note]
   >- By default, all options are selected. Clear any retention range limits you don't want to use, and set those that you want.
   >- The minimum retention period for any type of backup (full/differential/log) is seven days.
   >- Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered each day.
   >- The backup for a specific day is tagged and retained based on the weekly retention range and setting.
   >- The monthly and yearly retention ranges behave in a similar way.

6. On the **Full Backup policy**, select **OK** to accept the settings.
7. Select the **Differential Backup** to add a differential policy.

8. On the **Differential Backup policy**, select **Enable** to open the frequency and retention controls.

   >[!Note]
   >- At most, you can trigger one differential backup per day.
   >- Differential backups can be retained for a maximum of 180 days. If you need longer retention, you must use full backups.

9. Select **OK** to save the policy and return to the **Backup policy** pane.

10. Select **Log Backup** to add a transactional log backup policy.

11. On the **Log Backup**, select **Enable** to set the frequency and retention controls.

     >[!Note]
     >- Log backups only begin to flow after a successful full backup is completed.
     >- Each log backup is chained to the previous full backup to form a recovery chain. This full backup is retained until the retention of the last log backup has expired. This might mean that the full backup is retained for an extra period to make sure all the logs can be recovered. Let's assume a user has a weekly full backup, daily differential and 2-hour logs. All of them are retained for 30 days. But, the weekly full can be cleaned up/deleted only after the next full backup is available, that is, after 30 + seven days. For example, if a weekly full backup is performed on November 16th, it remains stored until December 16th in accordance with the retention policy. The final log backup for this full backup occurs on November 22nd, before the next scheduled full backup. Since this log backup remains accessible until December 22nd, the November 16th full backup cannot be deleted until that date. As a result, the November 16th full backup is retained until December 22nd.

12. On the **Configure Backup**, select the new policy under **Backup Policy**, and then select **Add**.
13. Select **Configure backup**.
14. On the **Select items to backup**, select the Databases for protection, and then select **Next**.

    :::image type="content" source="./media/sap-ase-database-backup/select-database-items-for-backup.png" alt-text="Screenshot shows the selection of the database items for backup." lightbox="./media/sap-ase-database-backup/select-database-items-for-backup.png":::
  

15. Review  the backup configuration.

    :::image type="content" source="./media/sap-ase-database-backup/select-enable-backup.png" alt-text="Screenshot shows the completion of backup configuration." lightbox="./media/sap-ase-database-backup/select-enable-backup.png":::

16. Select **Enable Backup** to start the backup operation.

After the backup configuration is complete, Azure Backup takes backup of the SAP ASE database as per the backup schedule set in the backup policy. You can also [run an on-demand backup](sap-ase-database-backup-tutorial.md#run-an-on-demand-backup-for-sap-ase-database) to create the first full backup.

## Next steps

- [Restore SAP ASE database on Azure VMs using Azure portal](sap-ase-database-restore.md).
- [Manage and monitor backed-up SAP ASE database using Azure portal](sap-ase-database-manage.md).
- [Troubleshoot SAP ASE (Sybase) database backup](troubleshoot-sap-ase-sybase-database-backup.md).
