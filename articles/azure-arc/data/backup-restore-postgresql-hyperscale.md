---
title: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
description: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Backup and restore for Azure Arc enabled PostgreSQL Hyperscale server groups

You can do full backup/restore of your Azure Arc enabled PostgreSQL Hyperscale server group. When you do so, the entire set of databases on all the nodes of your Azure Arc enabled PostgreSQL Hyperscale server group is backed-up and/or restored.
To take a backup and restore it, you need to make sure that a backup storage class is configured for your server group. For now, you need to indicate a backup storage class at the time you create the server group. It is not yet possible to configure your server group to use a backup storage class after it has been created.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

> [!CAUTION]
> Preview does not support backup/restore for the version 11 of the Postgres engine. It only supports backup/restore for Postgres version 12.

## Verify configuration

First, verify if your existing server group has been configured to use backup storage class.

Run the following command after setting the name of your server group:
```console
 azdata arc postgres server show -n postgres01
```
Look at the storage section of the output:
```console
...
"storage": {
      "backups": {
        "className": "local-storage"
      },
      "data": {
        "className": "local-storage",
        "size": "5Gi"
      },
      "logs": {
        "className": "local-storage",
        "size": "5Gi"
      }
    }
...
```
If you see  the name of a storage class indicated in the "backups" section of the output of that command, it means your server group has been configured to use a backup storage class and is ready for you to take backups and do restores. If you do not see a section "backups", you need to delete and recreate your server group to configure backup storage class. At this point, it is not yet possible to configure a backup storage class after the server group has been created.

>[!IMPORTANT]
>If your server group is already configured to use a backup storage class, skip the next step and go directly to step "Take manual full backup".

## Create a server group 

Next, create a server group configured for backup/restore.

In order to be able to take backups and restore them, you need to create a server that is configured with a storage class.

To get a list of the storage classes available on your Kubernetes cluster, run the following command:

```console
kubectl get sc
```

<!--The general format of create server group command is documented [here](create-postgresql-instances.md)-->

```console
azdata arc postgres server create -n <name> --workers 2 --storage-class-backups <storage class name> [--storage-class-data <storage class name>] [--storage-class-logs <storage class name>]
```

For example if you have created a simple environment based on kubeadm:
```console
azdata arc postgres server create -n postgres01 --workers 2 --storage-class-backups local-storage
```

## Take manual full backup

Next, take a manual full backup.

To take a full backup of the entire data and log folders of your server group, run the following command:

```console
azdata arc postgres backup create [--name <backup name>] --server-name <server group name> [--no-wait] 
```
Where:
- __name__ indicates the name of a backup
- __server-name__ indicates a server group
- __no-wait__ indicates that the command line will not wait for the backup to complete for you to be able to continue to use this command-line window

This command will coordinate a distributed full backup across all the nodes that constitute your Azure Arc enabled PostgreSQL Hyperscale server group. In other words, it will backup all data in your Coordinator and Worker nodes.

For example:
```console
azdata arc postgres backup create --name MyBackup_Aug31_0730amPST --server-name postgres01
```

When the backup completes, the ID, name, and state of the backup will be returned. For example:
```console
{
  "ID": "d134f51aa87f4044b5fb07cf95cf797f",
  "name": "MyBackup_Aug31_0730amPS",
  "state": "Done"
}
```

> [!NOTE]
> It is not yet possible to:
> - Schedule automatic backups
> - Show the progress of a backup while it is being taken

## List backups

List the backups that are available to restore.

To list the backups that are available to restore, run the following command:

```console
azdata arc postgres backup list --server-name <servergroup name>
```

For example:
```console
azdata arc postgres backup list --server-name postgres01
```

It will return an output like:
```console
ID                                Name                      State    Timestamp
--------------------------------  ------------------------  -------  ------------------------------
d134f51aa87f4044b5fb07cf95cf797f  MyBackup_Aug31_0730amPST  Done     2020-08-31 14:30:00:00+00:00
```

Timestamp indicates the point in time UTC at which the backup was taken.

## Restore a backup

To restore the backup of an entire server group, run the command:

```console
azdata arc postgres backup restore --server-name <server group name> --backup-id <backup id>
```

Where:
- __backup-id__ is the ID of the backup shown in the list backup command (refer to Step 3).
This will coordinate a distributed full restore across all the nodes that constitute your Azure Arc enabled PostgreSQL Hyperscale server group. In other words, it will restore all data in your Coordinator and Worker nodes.

For example:
```console
azdata arc postgres backup restore --server-name postgres01 --backup-id d134f51aa87f4044b5fb07cf95cf797f
```

When the restore operation is complete, it will return an output like this to the command line:
```console
{
  "ID": "d134f51aa87f4044b5fb07cf95cf797f",
  "state": "Done"
}
```
> [!NOTE]
> It is not yet possible to:
> - Restore a backup by indicating its name
> - Restore a server group under a different name or on a different server group
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

You can retrieve the name and the ID of your backups by running the list backup command as explained in the previous paragraph.

For example, consider you have the following backups listed:
```console
azdata arc postgres backup list -sn postgres01
ID                                Name                    State
--------------------------------  ----------------------  -------
5b0481dfc1c94b4cac79dd56a1bb21f4  MyBackup091720200110am  Done
0cf39f1e92344e6db4cfa285d36c7b14  MyBackup091720200111am  Done
```
and you want to delete the first of them, you would run the following command:
```console
azdata arc postgres backup delete -sn postgres01 -n MyBackup091720200110am
{
  "ID": "5b0481dfc1c94b4cac79dd56a1bb21f4",
  "name": "MyBackup091720200110am",
  "state": "Done"
}
```
If you were to list the backups at that point, you would get the following output:
```console
azdata arc postgres backup list -sn postgres01
ID                                Name                    State
--------------------------------  ----------------------  -------
0cf39f1e92344e6db4cfa285d36c7b14  MyBackup091720200111am  Done
```

For more details about the delete command, run:
```console
azdata arc postgres backup delete --help
```

## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
