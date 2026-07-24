---
title: Back up using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for running the backup command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: reference
ms.date: 10/06/2025
ms.author: phjensen
# Customer intent: "As a cloud administrator, I want to execute the backup command using the Azure Application Consistent Snapshot tool, so that I can create consistent backups of data and other volumes in Azure NetApp Files efficiently."
---

# Back up using Azure Application Consistent Snapshot tool

This article provides a guide for running the backup command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Introduction

A storage snapshot based backup is run using the `azacsnap -c backup` command. This command performs the orchestration of a database consistent storage snapshot on the DATA volumes, and a storage snapshot (without any database consistency setup) on the OTHER volumes. 

For DATA volumes `azacsnap` prepares the database for a storage snapshot, then it takes a storage snapshot for all configured volumes, finally it tells the database the snapshot is complete. It also manages any database catalogs which record snapshot backup activity (for example, SAP HANA backup catalog).

## Command options

The `-c backup` command takes the following arguments:

- `--volume=` type of volume to snapshot, this parameter may contain `data`, `other`, or `all`
  - `data` snapshots the volumes within the `dataVolume` stanza of the configuration file.
    1. **data** Volume Snapshot process
       1. put the database into *backup-mode*.
       1. take snapshots of the Volumes listed in the configuration file's `"dataVolume"` stanza.
       1. take the database out of *backup-mode*.
       1. perform snapshot management.
  - `other` snapshots the volumes within the `otherVolume` stanza of the configuration file.
    1. **other** Volume Snapshot process
       1. take snapshots of the Volumes listed in the configuration file's `"otherVolume"` stanza.
       1. perform snapshot management.
  - `all` snapshots all the volumes in the `dataVolume` stanza and then all the volumes in the `otherVolume` stanza of the configuration file. The 
    processing is handled in the order outlined as follows:
    1. **all** Volumes Snapshot process
       1. **data** Volume Snapshot (same as the normal `--volume data` option)
          1. put the database into *backup-mode*.
          1. take snapshots of the Volumes listed in the configuration file's `"dataVolume"` stanza.
          1. take the database out of *backup-mode*.
          1. perform snapshot management.
       1. **other** Volume Snapshot (same as the normal `--volume other` option)
          1. take snapshots of the Volumes listed in the configuration file's `"otherVolume"` stanza.
          1. perform snapshot management.
  
  > [!NOTE]
  > By creating a separate config file with the boot volume as the otherVolume, it's possible for `boot` snapshots to be taken on an entirely different schedule (for example, daily).

- `--prefix=` the customer snapshot prefix for the snapshot name. This parameter has two purposes. Firstly provide a unique name for grouping of snapshots. Secondly to determine the `--retention` number of storage snapshots that are kept for the specified `--prefix`.

    > [!IMPORTANT]
    > Only alpha numeric ("A-Z,a-z,0-9"), underscore ("_") and dash ("-") characters are allowed.

- `--retention` the number of snapshots of the defined `--prefix` to be kept. Any extra snapshots are removed after a new snapshot is taken for this `--prefix`.

- `--trim` available for SAP HANA v2 and later, this option maintains the backup catalog and on disk catalog and log backups. The `--retention` option sets the number of entries to keep in the backup catalog, and deletes older entries for the defined prefix (`--prefix`) from the backup catalog, and the related physical logs backup. It also deletes any log backup entries that are older than the oldest non-log backup entry. This `--trim` operation helps to prevent the log backups from using up all available disk space.

  > [!NOTE]
  > The following example command keeps nine storage snapshots and ensures the backup catalog is continuously trimmed to match the nine storage snapshots being retained.

    ```bash
    azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim
    ```

- `[--flush]` an option to request the operating system kernel to flush I/O buffers for volumes after the database is put into "*backup mode*". In prior versions, we used the "mountpoint" values to indicate volumes to flush, with AzAcSnap 10 the `--flush` option takes care of it. Therefore this key/value ("mountpoint") can be removed from the configuration file.
  - On Windows, volumes labeled as "Windows" or "Recovery" and formatted with NTFS aren't flushed. You can also add "noflush" to the volume label and it isn't flushed.

    > [!IMPORTANT]
    > Flushing file buffers on Windows requires administrator privilege.
    
    - These examples are ways to run `azacsnap.exe --flush ...` with administrator privileges on Windows.
      1. Launch elevated CMD:
         1. Press Windows key, type cmd.
         1. Right-click Command Prompt, choose "Run as administrator".
         1. Then run `azacsnap.exe` inside the elevated window.
      1. Use PowerShell with elevation:
          ```code
          Start-Process powershell -Verb RunAs -ArgumentList "-Command `"cd 'C:\Users\UserName\AzAcSnap'; .\azacsnap.exe -c backup --volume data --prefix adhoc --retention 1 -v --flush; pause`""
          ```
      1. Use Task Scheduler for silent elevation:
         1. For automation, you can create a scheduled task with Administrator privileges and trigger it via command line.
  - On Linux, all I/O is flushed using the Linux `sync` command.

  Running the following example on the same host running the database will:
    1. Put the database into "*backup mode*".
    2. Request an operating system kernel flush of I/O buffers for local volumes (see operating system specific details).
    3. Take a storage snapshot.
    4. Release the database from "*backup mode*".

    ```bash
    azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim --flush
    ```

- `[--ssl=]` an optional parameter that defines the encryption method used to communicate
    with SAP HANA, either `openssl` or `commoncrypto`. If defined, then the `azacsnap -c backup`
    command expects to find two files in the same directory, these files must be named after
    the corresponding SID. Refer to [Using SSL for communication with SAP HANA](azacsnap-configure-database.md#using-ssl-for-communication-with-sap-hana). The following example takes a `hana` type snapshot with a prefix of `hana_TEST` and keeps `9` of them communicating with SAP HANA using SSL (`openssl`).

    ```bash
    azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim --ssl=openssl
    ```

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

## Snapshot backups are fast

The duration of a snapshot backup is independent of the volume size. For example, a 10-TiB volume is typically snapshot 
in the same time as a 10-GiB volume.

The primary factors impacting overall execution time are the number of volumes to be snapshot and any
changes in the `--retention` parameter (where a reduction can increase the execution time as excess
snapshots are removed).

In the example configuration provided for **Azure Large Instance**, snapshots for the
two volumes took less than 5 seconds to complete. For **Azure NetApp Files**, snapshots for the two volumes
would take about 60 seconds.

> [!NOTE]
> If the `--retention` value is much less than the previous time `azacsnap` is run
(for example, from `--retention 50` to `--retention 5`), then the time taken increases as `azacsnap`
needs to remove the extra snapshots.

## Example with `data` parameter

```bash
azacsnap -c backup --volume data --prefix hana_TEST --retention 9 --trim
```

The command doesn't output to the console, but does write to a log file, a result file,
and `/var/log/messages`.

In this example, the *log file* name is `azacsnap-backup-azacsnap.log` (see [Log files](#log-files)).

Running the `azacsnap` command option `-c backup` with the `--volume data` option also generates a result file to simplify
checking the outcome of a backup. The *result* file has the same base name as the log file, with `.result` as its suffix.

In this example, the *result file* name is `azacsnap-backup-azacsnap.result` and contains the following output:

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

The command doesn't output to the console, but does write to a log file only. It does _not_ write
to a result file or `/var/log/messages`.

In this example, the *log file* name is `azacsnap-backup-azacsnap.log` (see [Log files](#log-files)).

## Example with `other` parameter (to backup host OS)

> [!NOTE]
> The use of another configuration file (`--configfile bootVol.json`) which contains only
the boot volumes.

```bash
azacsnap -c backup --volume other --prefix boot_TEST --retention 9 --configfile bootVol.json
```

> [!IMPORTANT]
> For Azure Large Instance, the configuration file volume parameter for the boot volume might not be visible at the host operating system level.
> Microsoft Operations can provide this value.

The command doesn't output to the console, but does write to a log file only. It does _not_ write
to a result file or `/var/log/messages`.

In this example, the *log file* name is `azacsnap-backup-bootVol.log` (see [Log files](#log-files)).

## Log files

The log file name is constructed from the following "(command name)-(the `-c` option)-(the config filename)". For example, if running the command `azacsnap -c backup --configfile h80.json --retention 5 --prefix one-off` then the log file is called `azacsnap-backup-h80.log`. Or if using the `-c test` option with the same configuration file (for example, `azacsnap -c test --configfile h80.json`) then the log file is called `azacsnap-test-h80.log`.

> [!NOTE]
> Log files can be automatically maintained using [this guide](azacsnap-tips.md#manage-azacsnap-log-files).

## Next steps

- [Get snapshot details](azacsnap-cmd-ref-details.md)
- [Delete snapshots](azacsnap-cmd-ref-delete.md)
