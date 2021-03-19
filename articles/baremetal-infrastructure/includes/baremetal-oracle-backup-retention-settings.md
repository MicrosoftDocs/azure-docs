---
title: NetApp SnapCenter Oracle database backup retention settings
description: Retention settings for the Oracle database backup.
ms.topic: include
ms.date: 02/22/2021
---

There are two types of retention settings that are set for a backup policy. The first retention setting is the maximum number of nn demand snapshots that shall be kept. Based on customer backup policies, a set number of snapshots are kept such as the below example of 48 snapshots or an on-demand snapshot is kept for X number of days. Select the appropriate On-demand retention policy according to customer backup policies.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-retention.png" alt-text="Screenshot showing the database backup policy retention setting.":::

The next retention setting set is the scheduled number of snapshots to keep based on the previous entry of either hourly, daily, weekly, etc. The below example keeps 48 hourly snapshots totaling two days worth of snapshots. Select Next.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-retention2.png" alt-text="Screenshot showing the hourly retention setting.":::

On the replication screen, check the checkbox for Update SnapMirror after creating a local snapshot copy otherwise select Next. The other entries are left at default.

>[!NOTE]
>SnapVault is not currently supported in the Oracle HaaS environment.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-secondary-replication.png" alt-text="Screenshot of the secondary replication options.":::

>[!NOTE]
>Replication can always be added later by return to protection policy screen and selecting modify protection policy and selecting on Replication in the menu bar, setting the appropriate policy, and selecting Next until Summary, and then selecting finish.

The next setup page is for any scripts that are necessary to run either before the Oracle Backup takes place or after the Oracle Backup has finished. Currently, scripts as part of the SnapCenter process are not supported. Select Next.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-scripts.png" alt-text="Screenshot showing where to enter optional scripts to run.":::

If you want the ability to verify snapshots for recoverability integrity, then select the checkbox next to hourly. No Verification script commands are currently supported.

>[!NOTE]
>The actual location and schedule of the verification process is added in Section 4.5. Assign Protection Policies to Resources.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-backup-verification-options.png" alt-text="Screenshot showing the backup verification options.":::

Verify all settings are entered as expected and select Finish.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-summary.png" alt-text="Screenshot showing the summary of the new backup protection policy.":::