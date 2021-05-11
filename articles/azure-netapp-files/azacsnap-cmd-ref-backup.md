---
title: Back up using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for running the backup command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
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

# Back up using Azure Application Consistent Snapshot tool

This article provides a guide for running the backup command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Introduction

A storage snapshot based backup is run using the `azacsnap -c backup` command.  This command performs the orchestration of a database consistent storage snapshot on the DATA volumes, and a storage snapshot (without any database consistency setup) on the OTHER volumes.  

For DATA volumes `azacsnap` will prepare the database for a storage snapshot, then it will take the storage snapshot for all configured volumes, finally it will advise the database the snapshot is complete.  It will also manage any database entries which record snapshot backup activity (e.g. SAP HANA backup catalog).

## Command options

The `-c backup` command takes the following arguments:

- `--volume=` type of volume to snapshot, this parameter may contain `data` or `other`
  - `data` snapshots the volumes within the dataVolume stanza of the configuration file.
  - `other` snapshots the volumes within the otherVolume stanza of the configuration file.
  
  > [!NOTE]
  > By creating a separate config file with the boot volume as the otherVolume, it's possible for `boot` snapshots to be taken on an entirely different schedule (for example, daily).

- `--prefix=` the customer snapshot prefix for the snapshot name. This parameter has two purposes. Firstly purpose is to provide a unique name for grouping of snapshots. Secondly to determine the `--retention` number of storage snapshots that are kept for the specified `--prefix`.

    > [!IMPORTANT]
    > Only alpha numeric ("A-Z,a-z,0-9"), underscore ("_") and dash ("-") characters are allowed.

- `--retention` the number of snapshots of the defined `--prefix` to be kept. Any additional snapshots are removed after a new snapshot is taken for this `--prefix`.

- `--trim` available for SAP HANA v2 and later, this option maintains the backup catalog and on disk catalog and log backups. The number of entries to keep in the backup catalog is determined by the `--retention` option above, and deletes older entries for the defined prefix (`--prefix`) from the backup catalog, and the related physical logs backup. It also deletes any log backup entries that are older than the oldest non-log backup entry. This operations helps to prevent the log backups from using up all available disk space.

  > [!NOTE]
  > The following example command will keep 9 storage snapshots and ensure the backup catalog is continuously trimmed to match the 9 storage snapshots being retained.

    ```bash
    azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim
    ```

- `[--ssl=]` an optional parameter that defines the encryption method used to communicate
    with SAP HANA, either `openssl` or `commoncrypto`. If defined, then the `azacsnap -c backup`
    command expects to find two files in the same directory, these files must be named after
    the corresponding SID. Refer to [Using SSL for communication with SAP HANA](azacsnap-installation.md#using-ssl-for-communication-with-sap-hana). The following example takes a `hana` type snapshot with a prefix of `hana_TEST` and will keep `9` of them communicating with SAP HANA using SSL (`openssl`).

    ```bash
    azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim --ssl=openssl
    ```

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

## Snapshot backups are fast

The duration of a snapshot backup is independent of the volume size, with a 10-TB volume being snapped
within the same approximate time as a 10-GB volume.  

The primary factors impacting overall execution time are the number of volumes to be snapshot and any
changes in the `--retention` parameter (where a reduction can increase the execution time as excess
snapshots are removed).

In the example configuration above (for **Azure Large Instance**), snapshots for the
two volumes took less than 5 seconds to complete. For **Azure NetApp Files**, snapshots for the two volumes
would take about 60 seconds.

> [!NOTE]
> If the `--retention` is significantly reduced from the previous time `azacsnap` is run
(for example, from `--retention 50` to `--retention 5`), then the time taken will increase as `azacsnap`
needs to remove the extra snapshots.

## Example with `data` parameter

```bash
azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim
```

The command does not output to the console, but does write to a log file, a result file,
and `/var/log/messages`.

The *log file* is made up of the command name + the -c option + the config filename. By default
a log filename for a `-c backup` run with a default config filename `azacsnap-backup-azacsnap.log`.

The *result* file has the same base name as the log file, with `.result` as its suffix, for
example `azacsnap-backup-azacsnap.result` that contains the following output:

```bash
cat logs/azacsnap-backup-azacsnap.result
```

```output
Database # 1 (H80) : completed ok
```

The `/var/log/messages` file contains the same output as the `.result` file. See the following
example (run as root):

```bash
grep "azacsnap.*Database" /var/log/messages | tail -n10
```

```output
Jul  2 05:22:07 server01 azacsnap[183868]: Database # 1 (H80) : completed ok
Jul  2 05:27:06 server01 azacsnap[4069]: Database # 1 (H80) : completed ok
Jul  2 05:32:07 server01 azacsnap[19769]: Database # 1 (H80) : completed ok
Jul  2 05:37:06 server01 azacsnap[35312]: Database # 1 (H80) : completed ok
Jul  2 05:42:06 server01 azacsnap[50877]: Database # 1 (H80) : completed ok
Jul  2 05:47:06 server01 azacsnap[66429]: Database # 1 (H80) : completed ok
Jul  2 05:52:06 server01 azacsnap[82964]: Database # 1 (H80) : completed ok
Jul  2 05:57:06 server01 azacsnap[98522]: Database # 1 (H80) : completed ok
Jul  2 05:59:13 server01 azacsnap[105519]: Database # 1 (H80) : completed ok
Jul  2 06:02:06 server01 azacsnap[114280]: Database # 1 (H80) : completed ok
```

## Example with `other` parameter

```bash
azacsnap -c backup --volume other --prefix logs_TEST --retention 9
```

The command does not output to the console, but does write to a log file only.  It does _not_ write
to a result file or `/var/log/messages`.

The *log file* is made up of the command name + the -c option + the config filename. By default
a log filename for a `-c backup` run with a default config filename `azacsnap-backup-azacsnap.log`.

## Example with `other` parameter (to backup host OS)

> [!NOTE]
> The use of another configuration file (`--configfile bootVol.json`) which contains only
the boot volumes.

```bash
azacsnap -c backup --volume other --prefix boot_TEST --retention 9 --configfile bootVol.json
```

The command does not output to the console, but does write to a log file only.  It does _not_ write
to a result file or `/var/log/messages`.

The *log file* name in this example is `azacsnap-backup-bootVol.log`.

> [!NOTE]
> The log file name is made up of the "(command name-(the `-c` option)-(the config filename)".  For example, if using the `-c backup` option with a log file name of `h80.json`, then the log file will be called `azacsnap-backup-h80.log`.  Or if using the `-c test` option with the same configuration file then the log file will be called `azacsnap-test-h80.log`.

- HANA Large Instance Type: There are two valid values with `TYPEI` or `TYPEII` dependent on
    the HANA Large Instance Unit.
- See [Available SKUs for HANA Large Instances](../virtual-machines/workloads/sap/hana-available-skus.md) to confirm the available SKUs.

## Next steps

- [Get snapshot details](azacsnap-cmd-ref-details.md)
- [Delete snapshots](azacsnap-cmd-ref-delete.md)
