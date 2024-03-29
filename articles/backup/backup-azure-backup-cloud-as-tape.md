---
title: Replace your tape infrastructure by using Azure Backup
description: Learn how Azure Backup provides tape-like semantics that enable you to back up and restore data in Azure
ms.service: backup
ms.topic: how-to
ms.date: 03/29/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Move your long-term storage from tape to the Azure cloud

This article describes how you can enable backup and retention policies. If you're using tapes to address your long-term-retention needs, Azure Backup provides a powerful and viable alternative with the availability of this feature. The feature is enabled in the Azure Backup service (which is available [here](https://aka.ms/azurebackup_agent)). If you're using System Center DPM, then you must update to, at least, DPM 2012 R2 UR5 before using DPM with the Azure Backup service.

Azure Backup and System Center Data Protection Manager enable you to:

* Back up data in schedules, which best suit the organizational needs.
* Retain the backup data for longer periods.
* Make Azure a part of your long-term retention needs (instead of tape).

## What is the Backup Schedule?

The backup schedule indicates the frequency of the backup operation. For example, the settings in the following screen indicate that backups are taken daily at 6pm and at midnight.

![Screenshot shows the daily schedule option.](./media/backup-azure-backup-cloud-as-tape/dailybackupschedule.png)

You can also schedule a weekly backup. For example, the settings in the following screen indicate that backups are taken every alternate Sunday & Wednesday at 9:30AM and 1:00AM.

![Screenshot shows the weekly schedule option.](./media/backup-azure-backup-cloud-as-tape/weeklybackupschedule.png)

## What is the Retention Policy?

The retention policy specifies the duration for which the backup must be stored. Rather than just specifying a *flat policy* for all backup points, you can specify different retention policies based on when the backup is taken. For example, the backup point taken daily, which serves as an operational recovery point, is preserved for 90 days. The backup point taken at the end of each quarter for audit purposes is preserved for a longer duration.

![Screenshot shows the retention policy.](./media/backup-azure-backup-cloud-as-tape/retentionpolicy.png)

The total number of “retention points” specified in this policy is 90 (daily points) + 40 (one each quarter for 10 years) = 130.

## Example protection policy

![Screenshot shows the sample protection policy.](./media/backup-azure-backup-cloud-as-tape/samplescreen.png)

1. **Daily retention policy**: Backups taken daily are stored for seven days.
2. **Weekly retention policy**: Backups taken at midnight and 6 PM Saturday are preserved for four weeks.
3. **Monthly retention policy**: Backups taken at midnight and 6 PM on the last Saturday of each month are preserved for 12 months.
4. **Yearly retention policy**: Backups taken at midnight on the last Saturday of every March are preserved for 10 years.

The total number of “retention points” (points from which you can restore data) in the preceding diagram is computed as follows:

* Two points per day for seven days = 14 recovery points
* Two points per week for four weeks = 8 recovery points
* Two points per month for 12 months = 24 recovery points
* One point per year per 10 years = 10 recovery points

The total number of recovery points is 56.

> [!NOTE]
> Using Azure Backup you can create up to 9999 recovery points per protected instance. A protected instance is a computer, server (physical or virtual), or workload that backs up to Azure.
>

## Advanced configuration

By selecting **Modify** in the preceding screen, you have further flexibility in specifying retention schedules.

![Screenshot shows the Modify Policy blade.](./media/backup-azure-backup-cloud-as-tape/modify.png)

## Next steps

For more information about Azure Backup, see:

* [Introduction to Azure Backup](./backup-overview.md)
* [Try Azure Backup](./backup-windows-with-mars-agent.md)
