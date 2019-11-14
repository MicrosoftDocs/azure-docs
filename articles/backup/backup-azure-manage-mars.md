---
title: Manage & monitor Microsoft Azure Recovery Services Agent backups
description: Learn how to manage and monitor Microsoft Azure Recovery Services Agent backups by using the Azure Backup service.
ms.reviewer: srinathv
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 10/07/2019
ms.author: dacurwin
---
# Manage Microsoft Azure Recovery Services Agent backups by using the Azure Backup service

This article describes how to manage files and folders that are backed up with the Microsoft Azure Recovery Services Agent.

## Create a backup policy

The backup policy specifies when to take snapshots of the data to create recovery points and how long to retain recovery points. You configure the backup policy using the MARS agent.

Create a policy as follows:

1. After downloading and registering the MARS agent, launch the agent console. You can find it by searching your machine for **Microsoft Azure Backup**.  
2. In **Actions**, click **Schedule Backup**.

    ![Schedule a Windows Server backup](./media/backup-configure-vault/schedule-first-backup.png)
3. In the Schedule Backup Wizard >  **Getting started**, click **Next**.
4. In **Select Items to Back up**, click **Add Items**.

    ![Select Items to Back up](./media/backup-azure-manage-mars/select-item-to-backup.png)

5. In **Select Items**, select what you want to back up and click **OK**.

    ![Selected Items to Back up](./media/backup-azure-manage-mars/selected-items-to-backup.png)

6. In **Select Items to Back up** page, click **Next**.
7. In **Specify Back up Schedule** page, specify when you want to take daily or weekly backups. Then click **Next**.

    - A recovery point is created when a backup is taken.
    - The number of recovery points created in your environment is dependent upon your backup schedule.

8. You can schedule daily backups, up to three times a day. For example, the screenshot shows two daily backups, one at midnight and one at 6:00 PM.

    ![Daily schedule](./media/backup-configure-vault/day-schedule.png)

9. You can run weekly backups too. For example, the screenshot shows backups taken every alternate Sunday & Wednesday at 9:30 AM and 1:00 AM.

    ![Weekly schedule](./media/backup-configure-vault/week-schedule.png)

10. On the **Select Retention Policy** page, specify how you store historical copies of your data. Then click **Next**.

    - Retention settings specify which recovery points should be stored, and how long they should be stored for.
    - For example, when you set a daily retention setting, you indicate that at the time specified for the daily retention, the latest recovery point will be retained for the specified number of days. Or, as another example, you could specify a monthly retention policy to indicate that the recovery point created on the 30th of every month should be stored for 12 months.
    - Daily and weekly recovery point retention usually coincides with the backup schedule. Meaning that when the backup is triggered according to schedule, the recovery point created by the backup is stored for the duration indicated in the daily or weekly retention policy.
    - As an example, in the following screenshot:
            - Daily backups at midnight and 6:00 PM are kept for seven days.
            - Backups taken on a Saturday at midnight and 6:00 PM are kept for four weeks.
            - Backups taken on Saturday on the last week of the month at midnight and 6:00 PM are kept for 12 months.
            - Backups taken on a Saturday in the last week of March are kept for 10 years.

           ![Retention example](./media/backup-configure-vault/retention-example.png)

11. In **Choose Initial Backup Type** decide if you want to take the initial backup over the network or use offline backup (for more information on offline backup refer, see this [article](backup-azure-backup-import-export.md)). To take the initial backup over the network, select **Automatically over the network** and click **Next**.

    ![initial Backup Type](./media/backup-azure-manage-mars/choose-initial-backup-type.png)

12. In **Confirmation**, review the information, and then click **Finish**.
    ![Confirm Backup Type](./media/backup-azure-manage-mars/confirm-backup-type.png)

13. After the wizard finishes creating the backup schedule, click **Close**.
  ![Confirm Modify Backup Process](./media/backup-azure-manage-mars/confirm-modify-backup-process.png)

You must create a policy on each machine where the agent is installed.

## Modify a backup policy

When you modify backup policy, you can add new items, remove existing items from backup, or exclude files from being backed up using  Exclusion Settings.

- **Add Items** use this option only for adding new items to back up. To remove existing items, use **Remove Items** or **Exclusion Settings** option.  
- **Remove Items** use this option to remove items from being backed up.
  - Use **Exclusion Settings** for removing all items within a volume instead of **Remove Items**.
  - Clearing all selections in a volume causes old backups of the items, to be retained as per retention settings at the time of the last backup, without scope for modification.
  - Reselecting these items, leads to a first full-backup and new policy changes are not applied to old backups.
  - Unselecting entire volume retains past backup without any scope for modifying retention policy.
- **Exclusion Settings** use this option to exclude specific items from being backed up.
  
### Add new items to existing policy

1. In **Actions**, click **Schedule Backup**.

    ![Schedule a Windows Server backup](./media/backup-configure-vault/schedule-first-backup.png)

2. In **Select policy item** tab, and select **Modify backup schedule for your files and folders** and click **Next**.

    ![Select Policy Items](./media/backup-azure-manage-mars/select-policy-items.png)

3. In **Modify or stop schedule backup** tab, select **Make changes to backup items or times** and click **Next**.

    ![Modify or schedule backup](./media/backup-azure-manage-mars/modify-schedule-backup.png)

4. In **Select items to Backup** tab, click **Add items** to add the items that you want to back up.

    ![Modify or schedule backup add items](./media/backup-azure-manage-mars/modify-schedule-backup-add-items.png)

5. In **Select Items** window, select flies or folders that you  want to add and click **OK**.

    ![Select the items](./media/backup-azure-manage-mars/select-item.png)

6. Complete the subsequent steps and click **Finish** to complete the operation.

### Add Exclusion rules to existing policy

You can add exclusion rules to skip files and folders that you don't want to be backed up. You can do this during when defining a new policy or modifying an existing policy.

1. From the Actions pane, click **Schedule Backup**. Go to **Select items to Backup** and click **Exclusion Settings**.

    ![Select the items](./media/backup-azure-manage-mars/select-exclusion-settings.png)

2. In **Exclusion Settings**, click **Add Exclusion**.

    ![Select the items](./media/backup-azure-manage-mars/add-exclusion.png)

3. From **Select Items to Exclude**, browse the files and folders and select items that you want to exclude and click **OK**.

    ![Select the items](./media/backup-azure-manage-mars/select-items-exclude.png)

4. By default all **Subfolders** within the selected folders are excluded. You can change this by selecting **Yes** or **No**. You can edit and specific the file types to exclude as shown below:

    ![Select the items](./media/backup-azure-manage-mars/subfolders-type.png)

5. Complete the subsequent steps and click **Finish** to complete the operation.

### Remove items from existing policy

1. From the Actions pane, click **Schedule Backup**. Go to **Select items to Backup**. From the list, select the files and folders that you want to remove from backup schedule and click **Remove items**.

    ![Select the items](./media/backup-azure-manage-mars/select-items-remove.png)

> [!NOTE]
> Proceed with caution when you completely remove a volume from the policy.  If you need to add it again, then it will be treated as a new volume. The next scheduled backup will perform an Initial Backup (full backup) instead of Incremental Backup. If you need to temporarily remove and add items later, then it is recommended to use **Exclusions Settings** instead of **Remove Items** to ensure incremental backup instead of full backup.

2. Complete the subsequent steps and click **Finish** to complete the operation.

## Stop protecting Files and Folder backup

There are two ways to stop protecting Files and Folders backup:

- **Stop protection and retain backup data**.
  - This option will stop all future backup jobs from protection.
  - Azure Backup service will retain the recovery points that have been backed up based on the retention policy.
  - You'll be able to restore the backed-up data for unexpired recovery points.
  - If you decide to resume protection, then you can use the *Re-enable backup schedule* option. After that, data would be retained based on the new retention policy.
- **Stop protection and delete backup data**.
  - This option will stop all future backup jobs from protecting your data and delete all the recovery points.
  - You will receive a delete Backup data alert email with a message *Your data for this Backup item has been deleted. This data will be temporarily available for 14 days, after which it will be permanently deleted* and recommended action *Reprotect the Backup item within 14 days to recover your data.*
  - To resume protection, reprotect within 14 days from delete operation.

### Stop protection and retain backup data

1. Open the MARS management console, go to the **Actions pane**, and **select Schedule Backup**.
    ![Modify or stop a scheduled backup.](./media/backup-azure-manage-mars/mars-actions.png)
1. In **Select Policy Item** page, select **Modify a backup schedule for your files and folders** click **Next**.
    ![Modify or stop a scheduled backup.](./media/backup-azure-manage-mars/select-policy-item-retain-data.png)
1. From the **Modify or Stop a Scheduled Backup** page, select **Stop using this backup schedule, but keep the stored backups till a schedule is activated again**. Then, select **Next**.  
    ![Modify or stop a scheduled backup.](./media/backup-azure-manage-mars/stop-schedule-backup.png)
1. In **Pause Scheduled Backup** review the information click **Finish**
    ![Modify or stop a scheduled backup.](./media/backup-azure-manage-mars/pause-schedule-backup.png)
1. in **Modify backup process** check your schedule backup pause status success and click **close** to finish.

### Stop protection and delete backup data

1. Open the MARS management console, go to the **Actions** pane, and select **Schedule Backup**.
2. From the **Modify or Stop a Scheduled Backup** page, select **Stop using this backup schedule and delete all the stored backups**. Then, select **Next**.

    ![Modify or stop a scheduled backup.](./media/backup-azure-delete-vault/modify-schedule-backup.png)

3. From the **Stop a Scheduled Backup** page, select **Finish**.

    ![Stop a scheduled backup.](./media/backup-azure-delete-vault/stop-schedule-backup.png)
4. You are prompted to enter a security PIN (personal identification number), which you must generate manually. To do this, first sign in to the Azure portal.
5. Go to **Recovery Services vault** > **Settings** > **Properties**.
6. Under **Security PIN**, select **Generate**. Copy this PIN. The PIN is valid for only five minutes.
7. In the management console, paste the PIN, and then select **OK**.

    ![Generate a security PIN.](./media/backup-azure-delete-vault/security-pin.png)

8. In the **Modify Backup Progress** page, the following message appears: *Deleted backup data will be retained for 14 days. After that time, backup data will be permanently deleted.*  

    ![Delete the backup infrastructure.](./media/backup-azure-delete-vault/deleted-backup-data.png)

After you delete the on-premises backup items, follow the next steps from the portal.

## Re-enable protection

If you stopped protection while retaining data and decided to resume protection, then you can re-enable the backup schedule using modify backup policy.

1. On **Actions** select **Schedule backup**.
1. Select **Re-enable backup schedule. You can also modify backup items or tines** and click **Next**.
    ![Delete the backup infrastructure.](./media/backup-azure-manage-mars/re-enable-policy-next.png)
1. In **Select Items to Backup**, click **Next**.
    ![Delete the backup infrastructure.](./media/backup-azure-manage-mars/re-enable-next.png)
1. In **Specify Backup Schedule**, specify the backup schedule and click **Next**.
1. In **Select Retention Policy**, specify retention duration and click **Next**.
1. Finally in **Conformation** screen, review the policy details and click **Finish**.

## Next steps

- For information about supported scenarios and limitations, refer to the [Support Matrix for MARS](https://docs.microsoft.com/azure/backup/backup-support-matrix-mars-agent).
- Learn more about [Ad hoc backup policy retention behavior](https://docs.microsoft.com/azure/backup/backup-configure-vault#ad-hoc-backup-policy-retention-behavior.md).
