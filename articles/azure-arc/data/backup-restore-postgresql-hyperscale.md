---
title: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
description: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Backup and restore Arc enabled Azure Database: PostgreSQL Hyperscale server groups

The instructions for the PostgreSQL server group are created from [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-instances.md).

## Enable backup volumes

First, provision a backup volume for each node in the server group. To provision the backup volume, edit the server group configuration:

```console
azdata postgres server update -n <name of your postgresql server group> -ns <name of the namespace> --backupSizesMb <size of backup in MBs>

#Example:
#azdata postgres server update -n pg1 -ns arc --backupSizesMb 500
```

Verify that the system provisions backup volumes next to the data volumes, one for each node:

```console
kubectl get pvc -n default

NAME                                                                   STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS    AGE
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-backups-pg1-0   Bound    local-pv-1aad2e4d   62Gi       RWO            local-storage   18m
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-backups-pg1-1   Bound    local-pv-27567b68   62Gi       RWO            local-storage   17m
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-backups-pg1-2   Bound    local-pv-7cf6c23    62Gi       RWO            local-storage   17m
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-data-pg1-0      Bound    local-pv-f20c5865   62Gi       RWO            local-storage   24m
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-data-pg1-1      Bound    local-pv-d663110b   62Gi       RWO            local-storage   24m
pg1-93f1d33e-458a-11ea-bbaa-2a742840465e-data-pg1-2      Bound    local-pv-aba563ba   62Gi       RWO            local-storage   24m
```

You can also specify an existing persistent volume claim. For example:

```console
azdata postgres server update -n <name of your postgresql server group> -ns <name of the namespace> --backupVolumeClaims <pvc name>

#Example
#azdata postgres server update -n pg1 -ns arc --backupVolumeClaims pvc1
```

Backup volumes are shared across all nodes in the server group. This argument can also be used to share the backup volumes across multiple PostgreSQL server groups.

## Run and restore a manual backup

Issue a manual backup. For example:

```console
azdata postgres backup take -n <name of your postgresql server group> -ns <name of the namespace> -bn <backup name>

#Example:
#azdata postgres backup take -n pg1 -ns default -bn test

ID                                    Name           State    Tiers    Timestamp
------------------------------------  -------------  -------  -------  ----------------------------
3e249df4-889d-4ceb-9358-44e7e4fb5a73  backup-m6e3br  Pending  1        2020-02-02T07:17:39.3228459Z
```

Verify that the backup completed by using the `azdata postgres backup list` command:

```console
azdata postgres backup list -n <name of your postgresql server group> -ns <name of the namespace>

#Example:
#azdata postgres backup list -n pg1 -ns default

ID                                    Name           Size     State      Tiers    Timestamp
------------------------------------  -------------  -------  ---------  -------  --------------------
3e249df4-889d-4ceb-9358-44e7e4fb5a73  backup-m6e3br  14.5 MB  Succeeded  1        2020-02-02T07:17:42Z
```

Now, restore this backup:

```console
azdata postgres server restore -n <name of your postgresql server group> -ns <name of the namespace> -bn <name of backup>

#Example:
#azdata postgres server restore -n pg1 -ns default -bn test
```

At first, the server group is in the state `Pending` - once it's back in `Running`, the backup was restored:

```console
azdata postgres server list

ClusterIP         ExternalIP      MustRestart    Name        Status
----------------  --------------  -------------  ----------  --------
10.98.62.6:31815  10.0.0.4:31815  False          pg1         Running
```

> [!NOTE]
> To restore from another server, the write-ahead log(WAL) file containing data for a recent timestamp must be archived first on the other server.
Cross-server restores can only access WAL files from the archive. The time-based frequency with which WAL files are archived is determined by the `--deltaBackupInterval` parameter given when creating the server, defaulting to 3 hours.
Also, if you've written a full WAL file of data (16 MB) that will also cause the WAL file to be moved to the archive.
You can also manually trigger a WAL archival by running `SELECT pg_switch_wal()` on the server that you want to restore from.

## Configure backup schedules

You can also run backups on a scheduled, instead of triggering them manually.

There are two kinds of backups:

* **Full backups** - The previous example is a full backup. A full backup is a complete physical copy of the PostgreSQL data directory
* **Delta backups** - A delta backup backs up the PostgreSQL WAL archive, and is required for point-in-time-restore between full backups. Typically, these backups are done frequently. For example, once per minute.

Try to schedule two backups. A low full backup setting, and a standard delta backup setting. The delta backup is scheduled for every minute and the full backup is scheduled for every 5 minutes:

```console
azdata postgres server update -n <name of your postgresql server group> -ns <name of the namespace> --deltaBackupInterval <interval in mins> --fullBackupInterval <interval in mins>

#Example:
#azdata postgres server update -n pg1 -ns arc --deltaBackupInterval 1 --fullBackupInterval 5
```

After a few minutes, we can see our first scheduled backup:

```console
azdata postgres backup list -n <name of your postgresql server group> -ns <name of the namespace>

#Example:
#azdata postgres backup list -n pg1 -ns arc

ID                                    Name           Size     State      Tiers    Timestamp
------------------------------------  -------------  -------  ---------  -------  --------------------
3e249df4-889d-4ceb-9358-44e7e4fb5a73  test           14.5 MB  Succeeded  1        2020-02-02T07:17:42Z
40165eb7-5173-441d-bc39-3bbd96e5d8a3  1061937090     8.7 MB   Succeeded  1        2020-02-02T07:30:01Z
```

## Backup retention

To avoid our backup volume running out of storage, set backup retention to automatically remove backups after a certain amount of time.

The following example sets retention to seven days:

```console
azdata postgres server update -n <name of your postgresql server group> -ns <name of the namespace> --retentionMin <retention period> --retentionMax <retention period>

#Example:
#azdata postgres server update -n pg1 -ns arc --retentionMin '7d' --retentionMax '7d'
```

## Create a point-in-time restore

Create a point-in-time restore by specifying the `-t` parameter to the `azdata postgres server restore` command. You can either specify a timestamp (For example, `2019-12-17 17:34:02`, expressed in your local time) or a time span (For example, `30m`, `6h`, `2.5d`, or `1w` for 30 minutes, 6 hours, 2.5 days, or 1 week, respectively).
x`

At least one backup with a timestamp no later than the given time must exist. The time is assumed to be in local time if no time zone is specified.

Define the -f parameter and give the ID of the server to restore from. The ID of a server can be obtained from `azdata postgres server list`. You can restore from a server even after it's been deleted, if you know its ID.

```console
azdata postgres server restore -n pg1 -ns arc -t '2019-09-06T21:00:10.87966Z' -f <your server ID>
azdata postgres server restore -n pg1 -ns arc -t '06 Sep, 2019 21:00' -f <your server ID>
azdata postgres server restore -n pg1 -ns arc -t '06 Sep 21:00' -f <your server ID>
azdata postgres server restore -n pg1 -ns arc -t '9:00 pm' -f <your server ID>
azdata postgres server restore -n pg1 -ns arc -t '1.5h' -f <your server ID>
azdata postgres server restore -n target1 -ns arc -t 2d -f <your server ID>
```

## Replicating backups to other locations for disaster recovery or long-term retention

_Azure Database for PostgreSQL Hyperscale - Azure Arc_ supports multiple backup storage locations (`tiers`).
A typical use case might be to store two weeks' worth of backups on fast, local storage and a year's worth in a remote storage.

 First-tier backups are complete, and the synchronization of backups to other tiers is automatic.

To configure multiple backup tiers, provide multiple comma-separated Kubernetes persistent volume claims to `--backupVolumeClaims` when you create your Azure Database for PostgreSQL Hyperscale Server Group. For instance:

```console
azdata postgres server create -n <name of your postgresql server group> -ns <name of the namespace> --dataSizeMb <database size> --serviceType <service type> --backupVolumeClaims <backup claim names>

#Example:
#azdata postgres server create -n pg1 -ns arc --dataSizeMb 1024 --serviceType NodePort --backupVolumeClaims pvc1,pvc2
```

If the Kubernetes cluster has a dynamic storage provisioner, multiple comma-separated Kubernetes storage classes can be provided to `--backupClasses` along with their requested sizes to `--backupSizesMb`. For example:

```console
azdata postgres server create -n pg1 --dataSizeMb 1024 --serviceType NodePort --backupClasses managed-premium,default --backupSizesMb 1024,2048
```

> [!NOTE]
> Each tier that you configure has its own retention settings.

## Managing backups

You can use the command-line tool to manage the individual backup tiers and take the following actions:

### List backups

```console
azdata postgres backup list -n <name of your postgresql server group> -ns <name of the namespace> --tier 1

#Example:
#azdata postgres backup list -n pg1 -ns default --tier 1
```

### Delete backups

You can delete a backup from just one tier rather than deleting it from all tiers. Most backup-related commands accept a `--tier` parameter, which can either be the ordinal of a tier (For example, 1, 2, 3…) to restrict the command to, or `all` (the default) to operate on all tiers

```console
azdata postgres backup delete -n <server group name> -bn <backup name> --tier <tier>

#Example:
azdata postgres backup delete -n pg1 -ns arc --tier 1
```

## Next Steps

Try out [using PostgreSQL extensions](using-postgresql-extensions.md).
