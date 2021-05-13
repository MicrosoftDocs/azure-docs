---
title: Delete using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for running the delete command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 04/21/2021
ms.author: phjensen
---

# Delete using Azure Application Consistent Snapshot tool

This article provides a guide for running the delete command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Introduction

It is possible to delete volume snapshots and database catalog entries with the `azacsnap -c delete` command.

> [!IMPORTANT]
> Snapshots created less than 10 minutes before running this command should not be deleted due to the potential for interference with snapshot replication.

## Command options

The `-c delete` command has the following options:

- `--delete hana` when used with the options `--dbsid <SID>` and `--hanabackupid <HANA backup id>` will delete entries from the SAP HANA backup catalog matching the criteria.

- `--delete storage` when used with the option `--snapshot <snapshot name>` will delete the snapshot from the back-end storage system.

- `--delete sync` when used with options `--dbsid <SID>` and `--hanabackupid <HANA backup id>` gets the storage snapshot name from the backup catalog for the `<HANA backup id>`, and then deletes the entry in the backup catalog _and_ the snapshot from any of the volumes containing the named snapshot.

- `--delete sync` when used with `--snapshot <snapshot name>` will check for any entries in the backup catalog for the `<snapshot name>`, gets the SAP HANA backup ID and deletes both the entry in the backup catalog _and_ the snapshot from any of the volumes containing the named snapshot.

- `[--force]` (optional) *Use with caution*.  This operation will force deletion without prompting for confirmation.

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

### Delete a snapshot using `sync` option`

```bash
azacsnap -c delete --delete sync --dbsid H80 --hanabackupid 157979797979
```

> [!NOTE]
> Checks for any entries in the backup catalog for the SAP HANA backup ID 157979797979,
gets the storage snapshot name and deletes both the entry in the backup catalog
and the snapshot from all of the volumes containing the named snapshot.

```bash
azacsnap -c delete --delete sync --snapshot hana_hourly.2020-01-22_2358
```

> [!NOTE]
> Checks for any entries in the backup catalog for the snapshot named hana_hourly.2020-01-22_2358,
gets the SAP HANA backup ID and deletes both the entry in the backup catalog
and the snapshot from any of the volumes containing the named snapshot.

### Delete a snapshot using `hana` option`

```bash
azacsnap -c delete --delete hana --dbsid H80 --hanabackupid 157979797979
```

> [!NOTE]
> Deletes the SAP HANA backup ID 157979797979 from the backup catalog for SID H80.

### Delete a snapshot using `storage` option`

```bash
azacsnap -c delete --delete storage --snapshot hana_hourly.2020-01-22_2358
```

> [!NOTE]
> Deletes the snapshot from any volumes containing snapshot named hana_hourly.2020-01-22_2358.

**Output using the `--delete storage` option**

The user is asked to confirm the deletion.

```bash
azacsnap -c delete --delete storage --snapshot azacsnap-hsr-ha.2020-07-02T221702.2535255Z
```

```output
Processing delete request for snapshot 'azacsnap-hsr-ha.2020-07-02T221702.2535255Z'.
Are you sure you want to permanently delete the snapshot 'azacsnap-hsr-ha.2020-07-02T221702.2535255Z' from all storage volumes.? (y/n) [n]: y
Snapshot deletion completed
```

It is possible to avoid user confirmation, by using the optional `--force` parameter as follows:

```bash
azacsnap -c delete --delete storage --snapshot azacsnap-hsr-ha.2020-07-02T222201.4988618Z --force
```

```output
Processing delete request for snapshot 'azacsnap-hsr-ha.2020-07-02T222201.4988618Z'.
Snapshot deletion completed
```

## Next steps

- [Get snapshot details](azacsnap-cmd-ref-details.md)
- [Take a backup](azacsnap-cmd-ref-backup.md)
