---
title: Restore Oracle Database
description: Learn how to restore your Oracle Database on BareMetal Infrastructure using SnapCenter.
ms.topic: how-to
ms.subservice: baremetal-oracle
ms.date: 05/07/2021
---

# Restore Oracle Database

In this article, we'll walk through the steps to restore your Oracle Database on BareMetal Infrastructure using SnapCenter.

You have several options to restore your Oracle Database on BareMetal Infrastructure. We recommend consulting the [Oracle Restore Decision Matrix](oracle-high-availability-recovery.md#choose-your-method-of-recovery) before undertaking restoration. This matrix can help you choose the most appropriate restore method given time of recovery and potential data loss. 

Typically, you'll restore the most current snapshots for data and archive log volumes, as the goal is to restore the database to the last known recovery point. Restoring snapshots is a permanent process. 

>[!IMPORTANT]
>Great care is required to ensure that the appropriate snapshot is restored. Restoring from a snapshot deletes all other snapshots and their associated data. This includes even more current snapshots than the one you select for restoration. So we recommend you approach the restore process conservatively. Error on the side of using a more recent snapshot first if there is any question as to which snapshot should be recovered.

## Restore database locally with restored archive logs

Before attempting recovery, the database must be taken offline if it isn't already. Once you've verified the database isn't running on any nodes in the Oracle Real Application Clusters (RAC), you're ready to start. First, you'll restore the archive logs. 

1. Identify the backups available. In SnapCenter, select **Resources** in the left menu.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-available-backups.png" alt-text="Screenshot showing the Database view.":::

2. Select the database you want to restore from the list. The database will contain the list of resource groups created and their associated policies.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/available-backups-list.png" alt-text="Screenshot showing the full list of available backups to restore.":::

3. A list of primary backups is then displayed. The backups are identified by their backup name and their type: Log or Data. Handle the log restoration first, as SnapCenter isn't designed to directly restore archive log volumes. Identify the archive log volume requiring restoration. Typically the volume to restore is the latest backup, as most recoveries will roll forward all archive logs from the last known good datafiles backup.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/primary-backups-list.png" alt-text="Screenshot showing a list of the primary backups.":::

4. After selecting the Archive Log volume, the mount option in the upper right-hand corner of the backup list becomes enabled. Select **Mount**. On the Mount backups page, from the drop-down, select the host that will mount the backup. Any RAC node may be selected, but both the archive log and datafiles recovery host must be the same. Copy the mount path, as it will be used in the upcoming step to recover the datafiles. Select **Mount**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-mount-backups.png" alt-text="Screenshot showing the backups to mount.":::

5. Unlike backup jobs, the job viewer on this page doesn't show status of the mount process. To see the status of the mount, select **Monitor** on the left menu. It will then highlight the status of all jobs that have been run. The mount operation should be the first entry. You can also navigate to the copied mount path to verify existence of archive logs.

    The selected host for mounting that filesystem will also receive an entry into /etc/fstab with the above mount path. It can be removed once recovery is complete.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-mount-output.png" alt-text="Screenshot showing the mount output.":::

6. Next, restore the datafiles and control files. As before, select **Resources**  from the left menu and select the database to be restored. Select the data backup to be restored. Again, typically the backup restored is the most recent one. This time when you select the data backup, the restore option is enabled. Select **Restore**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-selected-data-backup.png" alt-text="Screenshot of the data backup to be restored.":::

7. On the **Restore Scope** tab: From the drop-down, select the same host you chose earlier to mount the log files. Ensure **All Datafiles** is selected and select the checkbox for **Control files**. Select **Next**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-recovery-scope.png" alt-text="Screenshot showing the restore scope details for datafiles.":::

8. On the **Recovery Scope** tab: The system change number (SCN) from the log backup that was mounted is entered. **Until SCN** is also now selected. 
 
    The SCN can be found on the list of all backups for each backup. The previously copied mount point location is also entered under **Specify external archive log files locations**. It's currently beyond the scope of this document to address more than one archive log restore location. Select **Next**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-choose-recovery-scope.png" alt-text="Screenshot showing the recovery scope options.":::

9. On the **PreOps** tab: No scripts are currently recommended as part of the pre-restore process. Select **Next**.

10. On the PostOps tab: Again, no scripts are supported as part of the post-restore process. Select the checkbox for **Open the database or container database in READ-WRITE mode after recovery**. Select **Next**.

11. On the **Notification** tab: If an SMTP server is available, and you want an email notification of the restore process, fill in the email settings. Select **Next**.

12. On the **Summary** tab: Verify all details are correct. Select **Finish**.

13. You can see the restore status by selecting the restore job in the **Activity** bottom screen. You can follow the progress by selecting the green arrows to open up each restore subsection and its progress.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-job-details.png" alt-text="Screenshot showing the restore job details.":::

    Once restore is complete, all of the steps will change to check marks. Select **Close**.

    The removed rows in the simple database created are now verified as restored.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/output-of-restored-files.png" alt-text="Screenshot showing the output verification of the restored files.":::

## Clone database locally or remotely

Cloning the database is similar to the restore process. The clone database operation can be used either locally or remotely depending on the outcome you want. Cloning the database in the disaster recovery (DR) location is useful for several purposes, including disaster recovery failover testing and QA staging of production data. This assumes the disaster recovery location is used for test, development, QA, and so on.

### Create a clone

Creating a clone is a feature within SnapCenter that allows you to use a snapshot as a point-in-time reference to capture a similar set of data between the parent volume and the cloned volume by using pointers. The cloned volume is then read-writable and expanded only through writes, while any reads still occur on the parent volume. This feature allows you to create a "duplicate" set of data available to a host without interfering with the data that exists on the parent volume. 

This feature is especially useful for disaster recovery testing, as a temporary file system can be stood up based on the same snapshots that will be used in an actual recovery. You can verify data and that applications work as expected, and then shut down the disaster recovery test, without impacting the disaster recovery volumes or replication.

Here are the steps to clone a database. 

1. In SnapCenter, select **Resources** and then select the database to be cloned. If you'll create the clone locally, continue to the next step. If you'll restore the clone in the secondary location, select backups above the Mirror Copies box.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/clone-database-manage-copies.png" alt-text="Clone database managed copies diagram.":::

2. Select the appropriate data backup from the provided backup list. Select **Clone**.

    >[!NOTE]
    >The data backup must have been created earlier than the timestamp or system change number (SCN) if a timestamp clone is required. 

3. On the **Name** tab: Enter the name of the **SID** for the clone. Verify that **Source Volume** and **Destination Volume** for Data and Archive Logs match what Microsoft Operations provided for the disaster recovery mapping. Select **Next**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/provide-clone-database-sid.png" alt-text="Screenshot showing where to enter the database SID.":::

4. On the **Locations** tab: The datafile locations, control files, and redo logs are where the clone operation will create the necessary file systems for recovery. We recommend leaving these as is. It's beyond the scope of this document to explore alternatives. Ensure the appropriate host is selected for the location of the restore. Select **Next**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/clone-database-select-host.png" alt-text="Screenshot showing how to select a host to clone.":::

5. On the **Credentials** tab: The Credentials and Oracle Home Settings values are pulled from the existing production location. We recommend leaving these as is unless you know the secondary location has different values than the primary location. Select **Next**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/clone-database-credentials.png" alt-text="Screenshot for entering the database credentials for clone.":::

6. On the **PreOps** tab: No pre-recovery scripts are currently supported. Select **Next**.

7. On the **PostOps** tab: If the database will only be recovered until a certain time or SCN, then select the appropriate radio button and add either the timestamp or SCN. SnapCenter will recover the database until it reaches that point. Otherwise, leave **Until Cancel** selected. Select **Next**.

8. On the **Notification** tab: Enter necessary SMTP information if you want to send a notification email when the cloning is complete. Select **Next**.

9. On the **Summary** tab: Verify the appropriate **Clone SID** is entered and the correct host has been selected. Scroll down to ensure the appropriate recovery scope has been entered. Select **Finish**.

10. The clone job will show in the active pop-up at the bottom of the screen. Select the clone activity to display the job details. Once the activity has finished, the Job Details page will show all green check marks and provide the completion time. Cloning usually takes around 7-10 minutes.

11. After the job is complete, switch to the host used as the target for the clone and verify mount points using cat /etc/fstab. This verification ensures the appropriate mount points exist for the database that were listed during the clone wizard, and also highlights the database SID entered in the wizard. In the example below, the SID is dbsc4 as given by the mount points on the host.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/clone-database-switch-to-target-host.png" alt-text="Screenshot of command to switch to target host.":::

12. On the host, type **oraenv** and press **enter**. Enter the newly created SID.

    It's up to you to verify the database is restored appropriately. However, the following added steps are based on the database created by a user other than Oracle. 

13. Enter **sqlplus / as sysdba**. Since the table was created under a different user, the original, invalid username and password are automatically entered. Enter the correct username and password. The SQL> prompt will display once the sign in is successful.

Enter a query of the basic database to verify the appropriate data is received. In the following example, we used the archive logs to roll forward the database. The following shows the archive logs were used appropriately, as the clonetest entry was created after the data backup was created. So if the archive logs didn't roll forward, that entry would not be listed.

```sql
SQL> select * from acolvin.t;

COL1
-----------------------------------------
COL2
---------------
first insert
17-DEC-20

log restore
17-DEC-20

clonetest
18-DEC-20

COL1
-----------------------------------------
COL2
---------------
after first insert
17-DEC-20

next insert
17-DEC-20

final insert
18-DEC-20

COL1
-----------------------------------------
COL2
---------------
BILLY
17-DEC-20

7 rows selected.

```

### Delete a clone

It's important to delete a clone once you're finished with it. If you intend to continue to use it, you should split the clone. A snapshot that is the parent for a clone cannot be deleted and is skipped as part of the retention count. If you don't delete clones as you finish with them, the number of snapshots you're maintaining could use excessive storage. 

A split clone copies the data from the existing volume and snapshot into a new volume. This process severs the relationship between the clone and the parent snapshot, allowing the snapshot to be deleted when its retention number is reached. If its retention number has already been reached, the snapshot will be deleted at the next snapshot. Still, a split clone also incurs storage cost.

When a clone is created, the resource tab for that database will list a clone present whether locally or remotely. To delete the clone:

1. On the **Resource** tab: Select the box containing the clone you wish to delete.

2. The Secondary Mirror Clone(s) page shows the clone. In this example, the clone is in the secondary location. Select **Delete** in the right upper corner of the clone list.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/delete-clone-secondary-mirror-clones.png" alt-text="Screenshot of the secondary mirror clones.":::

3. Ensure you've exited from SQLPLUS before executing. Select **OK**.

4. To see the job progress, select **Jobs** in the left menu. A green check mark shows when the clone has been deleted.

5. Once the clone is deleted, it might also be useful to unmount the archive logs that were used as part of the clone process, if applicable. Back on the appropriate backups list (from when you created the clone), the list of backups can be sorted by whether a backup has been mounted or not. The sort algorithm isn't perfect and won't always sort all items together, but will sort generally in the right direction. The following volume was previously mounted. Select **unmount**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/delete-clone-unmount-backup.png" alt-text="Screenshot showing the backups list.":::

6. Select **OK**. You can view the status of the unmount job by selecting **Monitor** on the left menu. A green check mark will show when the backup is unmounted.

### Split a Clone

Splitting a clone creates a copy of the parent volume by replicating all data in the parent volume to the point where the snapshot used to create the clone was created. This process separates the parent volume from the clone volume and removes the hold on the snapshot used to create the clone volume. The snapshot can then be deleted as part of the retention policy.

Splitting a clone is useful to populate data in either the production environment or the disaster recovery environment. Splitting allows the new volumes to function independently of the parent volume.

>[!NOTE]
>The split clone process cannot be reversed nor canceled.

To split a clone:

1. Select the database that already contains a clone.

2. Once the location of the clone is selected, it shows in the list on the Secondary Mirror Clone(s) page.

3. Just above the list of clones, select **Clone Split**. SnapCenter doesn't allow any change as part of the split  process, so the next page simply shows what changes will occur. Select **Start**.

    >[!NOTE]
    >The split process can take a significant amount of time depending on how much data must be copied, the layout of the database on storage, and the activity level of storage.

After the process is finished, the clone that was split is removed from the list of backups, and the snapshot associated with the clone is now free to be removed as part of the normal retention plan on SnapCenter.

## Restore database remotely after disaster recovery event

SnapCenter isn't currently designed to automate the failover process. If a disaster recovery event occurs, either Microsoft Operations or REST recovery scripts are required to restore the database in the secondary location. It's currently beyond the scope of this document to detail the process of executing the REST recovery scripts.

## Restart all RAC nodes after restore

After you've restored the database in SnapCenter, it's only active on the RAC node you selected when restoring the database, as shown below. In this example, we restored the database to bn6sc2 to demonstrate that you can select any RAC node to perform the restore.

:::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-example-output-rac-node.png" alt-text="Screenshot showing the database was restored to bn6sc2.":::

Start the remaining RAC nodes by using the _srvctl start database_ command. After the command finishes, verify status that all RAC nodes are participating.

:::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/restore-database-srvctl-start-database-command.png" alt-text="Screenshot showing the srvctl start database command to restart the remaining RAC nodes.":::

## Unmount log archive volume

After cloning or restoring a database, the log archives volume should be unmounted, as it's only used to restore the database and then is no longer used. 

1. On the **Resources** tab, select the appropriate backup list on the database by either selecting the local or remote list.

2. Once you've selected the appropriate backup list, sort the list of backups by whether a backup has been mounted. The sort algorithm isn't perfect and won't always sort all items together, but will give usable results. 
 
3. Once you find the volume you want that was previously mounted, select **unmount**. Select **OK**.

4. You can see the status of the unmount job by selecting **Monitor** on the left menu. A green check mark will show when the volume is unmounted.

>[!NOTE]
>Selecting unmount removes the entry from the /etc/fstab on the host it is mounted on. Unmount also frees the backup for deletion as necessary as part of the retention policy set in the protection policy.

## Next steps

Learn more about high availability and disaster recovery for Oracle on BareMetal:

> [!div class="nextstepaction"]
> [High availability and disaster recovery for Oracle on BareMetal](concepts-oracle-high-availability.md)
