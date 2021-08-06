---
title: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
description: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Back up and restore Azure Arc—enabled PostgreSQL Hyperscale server groups

> [!IMPORTANT]
> Backup and restore of Azure Arc—enabled PostgreSQL Hyperscale server is not supported in the current preview release.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

When you back up or restore your Azure Arc—enabled PostgreSQL Hyperscale server group, the entire set of databases on all the PostgreSQL nodes of your server group is backed-up and/or restored.

## Take a manual full backup

To take a full backup of the entire data and log folders of your server group, run the following command:
```console
azdata arc postgres backup create [--name <backup name>] --server-name <server group name> [--no-wait] 
```
Where:
- __name__ indicates the name of a backup
- __server-name__ indicates a server group
- __no-wait__ indicates that the command line will not wait for the backup to complete for you to be able to continue to use this command-line window

This command will coordinate a distributed full backup across all the nodes that constitute your Azure Arc—enabled PostgreSQL Hyperscale server group. In other words, it will backup all data in your Coordinator and Worker nodes.

For example:

```console
azdata arc postgres backup create --name backup12082020-0250pm --server-name postgres01
```

When the backup completes, the ID, name, size, state and timestamp of the backup will be returned. For example:
```console
{
  "ID": "8085723fcbae4aafb24798c1458f4bb7",
  "name": "backup12082020-0250pm",
  "size": "9.04 MiB",
  "state": "Done",
  "timestamp": "2020-12-08 22:50:22+00:00"
}
```
`+xx:yy` indicates the timezone for the time at which the backup was taken. In this example, "+00:00" means UTC time (UTC + 00 hour 00 minutes).

> [!NOTE]
> It is not yet possible to:
> - Schedule automatic backups
> - Show the progress of a backup while it is being taken

## List backups

To list the backups that are available to restore, run the following command:

```console
azdata arc postgres backup list --server-name <servergroup name>
```

For example:

```console
azdata arc postgres backup list --server-name postgres01
```

Returns an output like:

```output
ID                                Name                   Size       State    Timestamp
--------------------------------  ---------------------  ---------  -------  -------------------------
d744303b1b224ef48be9cba4f58c7cb9  backup12072020-0731pm  13.83 MiB  Done     2020-12-08 03:32:09+00:00
c4f964d28da34318a420e6d14374bd36  backup12072020-0819pm  9.04 MiB   Done     2020-12-08 04:19:49+00:00
a304c6ef99694645a2a90ce339e94714  backup12072020-0822pm  9.1 MiB    Done     2020-12-08 04:22:26+00:00
47d1f57ec9014328abb0d8fe56020760  backup12072020-0827pm  9.06 MiB   Done     2020-12-08 04:27:22+00:00
8085723fcbae4aafb24798c1458f4bb7  backup12082020-0250pm  9.04 MiB   Done     2020-12-08 22:50:22+00:00
```

The Timestamp column indicates the point in time UTC at which the backup was taken.

## Restore a backup
In this section we are showing you how to do a full restore or a point in time restore. When you restore a full backup, you restore the entire content of the backup. When you do a point in time restore, you restore up to the point in time you indicate. Any transaction that was done later than this point in time is not restored.

> [!CAUTION]
> You can only restore to a server group that has the same number of worker nodes that it had when the backup was taken. If you increased or reduced the number of worker nodes since the backup was taken, before you restore, you need to increase/reduce the number of worker nodes - or create a new server group - to match the content of the backup. The restore will fail when the number of worker nodes do not match.

### Restore a full backup
To restore the entire content of a backup run the command:
```console
azdata arc postgres backup restore --server-name <target server group name> [--source-server-name <source server group name> --backup-id <backup id>]
or
azdata arc postgres backup restore -sn <target server group name> [-ssn <source server group name> --backup-id <backup id>]
```
<!--To read the general format of restore command, run: azdata arc postgres backup restore --help -->

Where:
- __backup-id__ is the ID of the backup shown in the list backup command shown above.
This will coordinate a distributed full restore across all the nodes that constitute your Azure Arc—enabled PostgreSQL Hyperscale server group. In other words, it will restore all data in your Coordinator and Worker nodes.

#### Examples:

__Restore the server group postgres01 onto itself:__

```console
azdata arc postgres backup restore -sn postgres01 --backup-id d134f51aa87f4044b5fb07cf95cf797f
```

This operation is only supported for PostgreSQL version 12 and higher.

__Restore the server group postgres01 to a different server group postgres02:__

```console
azdata arc postgres backup restore -sn postgres02 -ssn postgres01 --backup-id d134f51aa87f4044b5fb07cf95cf797f
```
This operation is supported for any version of PostgreSQL starting version 11. The target server group must be created before the restore operation, must be of the same configuration and must be using the same backup PVC as the source server group.

When the restore operation is complete, it will return an output like this to the command line:

```json
{
  "ID": "d134f51aa87f4044b5fb07cf95cf797f",
  "state": "Done"
}
```

> [!NOTE]
> It is not yet possible to:
> - Restore a backup by indicating its name
> - Show the progress of a restore operation


### Do a point in time restore

To restore a server group up to a specific point time, run the command:
```console
azdata arc postgres backup restore --server-name <target server group name> --source-server-name <source server group name> --time <point in time to restore to>
or
azdata arc postgres backup restore -sn <target server group name> -ssn <source server group name> -t <point in time to restore to>
```

To read the general format of restore command, run: `azdata arc postgres backup restore --help`.

Where `time` is the point in time to restore to. Provide either a timestamp or a number and suffix (`m` for minutes, `h` for hours, `d` for days, or `w` for weeks). For example `1.5h` goes back 90 minutes.

#### Examples:
__Do a point in time restore of the server group postgres01 onto itself:__

It is not yet possible to do point in time restore of a server group onto itself.

__Do a point in time restore of the server group postgres01 to a different server group postgres02 to a specific timestamp:__
```console
azdata arc postgres backup restore -sn postgres02 -ssn postgres01 -t "2020-12-08 04:23:48.751326+00"
``` 

This example restores into server group postgres02 the state at which server group postgres01 was on December 8th 2020 at 04:23:48.75 UTC. Note that "+00" indicates the timezone of the point in time you indicate. If you do not indicate a timezone, the timezone of the client from which you run the restore operation will be used.

For example:
- `2020-12-08 04:23:48.751326+00` is interpreted as `2020-12-08 04:23:48.751326` UTC
- if you are in the Pacific Standard Time zone (PST = UTC+08), `2020-12-08 04:23:48.751326` is interpreted as `2020-12-08 12:23:48.751326` UTC
This operation is supported for any version of PostgreSQL starting version 11. The target server group must be created before the restore operation and must be using the same backup PVC as the source server group.


__Do a point in time restore of the server group postgres01 to a different server group postgres02 to a specific amount of time in the past:__
```console
azdata arc postgres backup restore -sn postgres02 -ssn postgres01 -t "22m"
```

This example restores into server group postgres02 the state at which server group postgres01 was 22 minutes ago.
This operation is supported for any version of PostgreSQL starting version 11. The target server group must be created before the restore operation and must be using the same backup PVC as the source server group.

> [!NOTE]
> It is not yet possible to:
> - Show the progress of a restore operation

## Delete backups

Backup retention cannot be set in Preview. However you can manually delete backups that you do not need.
The general command to delete backups is:

```console
azdata arc postgres backup delete  [--server-name, -sn] {[--name, -n], -id}
```

where:
- `--server-name` is the name of the server group from which the user wants to delete a backup
- `--name` is the name of the backup to delete
- `-id`is the ID of the backup to delete

> [!NOTE]
> `--name` and `-id` are mutually exclusive.

For example:

```console
azdata arc postgres backup delete -sn postgres01 -n MyBackup091720200110am
{
  "ID": "5b0481dfc1c94b4cac79dd56a1bb21f4",
  "name": "MyBackup091720200110am",
  "state": "Done"
}
```

You can retrieve the name and the ID of your backups by running the list backup command as explained in the previous paragraph.

For more details about the delete command, run:

```console
azdata arc postgres backup delete --help
```

## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-in-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
