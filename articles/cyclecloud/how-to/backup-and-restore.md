---
title: Backup and Restore
description: Learn about the backup and restore process for Azure CycleCloud. By default, CycleCloud takes underlying application datastore snapshots as recovery points.
author: mvrequa
ms.date: 02/04/2020
ms.author: mirequa
---

# Backups in CycleCloud

By default, CycleCloud will take point-in-time snapshots of the underlying application datastore as recovery points. These are stored in _/opt/cycle_server/backups/_. The _backups_ directory does not have stringent read-write IO or latency requirements, so it is often mounted to an NFS share or blob fuse for additional durability.

> [!IMPORTANT]
> Within this directory is also a sub-directory named _shared/_, which holds data common to all backups and must be preserved to enable restoration.

## Backup Schedule

By default CycleCloud will preserve snapshots for:

* 5 min
* 15 min
* 1 hour
* 4 hours
* 8 hours
* 1 day
* and 7 days

The backup schedule is stored as a datastore record of type `Application.BackupPlan`. To access this record, go to the **Settings** page and select the **Records** tab. Make sure **All** record types are selected in the drop down. Near the very bottom of the list is a category labelled *Backup Plan*. Using the *edit* option, the schedule list can be changed and saved.

## Restore from Backup

The backups are stored with the restore time encoded in the directory name:
_/opt/cycle_server/data/backups/backup-2018-08-30_15-05-05+0000_.
This directory is a restore point. To revert CycleCloud back to this point in time, run the restore utility with this restore point as the argument. If no restore point is specified, then the latest restore point is used.

```bash
cd /opt/cycle_server/
./util/restore.sh ./data/backups/backup-2019-08-30_15-05-05
```
