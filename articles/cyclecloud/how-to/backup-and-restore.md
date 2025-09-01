---
title: Backup and Restore
description: Learn about the backup and restore process for Azure CycleCloud. By default, CycleCloud takes underlying application datastore snapshots as recovery points.
author: mvrequa
ms.date: 06/30/2025
ms.author: mirequa
ms.custom: compute-evergreen
---

# Backups in CycleCloud

By default, CycleCloud takes point-in-time snapshots of the underlying application datastore as recovery points. CycleCloud stores these snapshots in _/opt/cycle_server/data/backups/_. The _backups_ directory doesn't have stringent read-write IO or latency requirements, so you can often mount it to an NFS share or use blob fuse for extra durability.

> [!IMPORTANT]
> A subdirectory named _shared/_ exists within this directory. This subdirectory holds data common to all backups and you must preserve it to enable restoration.

## Backup schedule

By default, CycleCloud preserves snapshots for:

* 5 minutes
* 15 minutes
* 1 hour
* 4 hours
* 8 hours
* 1 day
* 7 days

The backup schedule is stored as a datastore record of type `Application.BackupPlan`. To access this record, go to the **Settings** page and select the **Records** tab. Make sure **All** record types are selected in the drop down. A category labeled *Backup Plan* is near the bottom of the list. Use the *edit* option to change and save the schedule list.

## Restore from backup

The backups include the restore time in the directory name. For example:
`_/opt/cycle_server/data/backups/backup-2018-08-30_15-05-05+0000_`.
This directory acts as a restore point. To revert CycleCloud to this point in time, run the restore utility with this restore point as the argument. If you don't specify a restore point, the utility uses the latest restore point.

```bash
cd /opt/cycle_server/
./util/restore.sh ./data/backups/backup-2019-08-30_15-05-05
```
