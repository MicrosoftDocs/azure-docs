---
title: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
description: Backup and Restore for Azure Database for PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/04/2020
ms.topic: how-to
---

# Backup and restore for Azure Arc enabled PostgreSQL Hyperscale server groups

You can do full backup/restore of your Azure Arc enabled PostgreSQL Hyperscale server group. When you do so, the entire set of databases on all the nodes of your Azure Arc enabled PostgreSQL Hyperscale server group is backed-up and/or restored.
To take a backup and restore it, you need to make sure that a backup storage class is configured for your server group. For now, you need to indicate a backup storage class at the time you create the server group. It is not yet possible to configure your server group to use a backup storage class after it has been created.

## Step 1: Verify if your existing server group has been configured to use backup storage class
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
If you see  a section "backups", it means your server group has been configured to use a backup storage class and is ready for you to take backups and do restores. If you do not see a section "backups", you need to delete and recreate your server group to configure backup storage class. At this point, it is not yet possible to configure a backup storage class after the server group has been created.

If your server group is already configured to use a backup storage class, skip Step 2 and go directly to Step 3.

## Step 2: Create a server group configured for backup/restore

In order to be able to take backups and restore them, you need to create a server that is configured with a storage class.
To get a list of the storage classes available on your Kubernetes cluster, run the following command:
```console
kubectl get sc
```

<!--The general format of create server group command is documented [here](create-postgresql-instances.md)-->

```console
azdata arc postgres server create -n <name> --workers 2 --storage-class-backups <storage class name> [--storage-class-data <storage class name>] [--storage-class-logs <storage class name>]
```

For example if you have deployed a simple environment based on kubeadm:
```console
azdata arc postgres server create -n postgres01 --workers 2 --storage-class-backups local-storage
```

## Step 3: Take a manual full backup
To take a full backup of the entire data and log folders of your server group, run the following command:
```console
azdata arc postgres backup create [--name <backup name>] --server-name <server group name> [--no-wait] 
```
Where:
- __name__ indicates the name of a backup
- __server-name__ indicates a server group
- __no-wait__ indicates that the command line will not wait for the backup to complete for you to be able to continue to use this command-line window

>**Note**: The command that allows you to list the backups that are available to restore does not show yet, the date/time at which the backup was taken. So it is recommended you give a name to the backup (using the --name parameter) that includes the date/time information.

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

>**Note:** It is not yet possible to schedule automatic backups
>**Note:** It is not yet possible to show the progress of a backup while it is being taken


## Step 4: List the backups that are available to restore
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
ID                                Name                      State
--------------------------------  ------------------------  -------
d134f51aa87f4044b5fb07cf95cf797f  MyBackup_Aug31_0730amPST  Done
```

## Step 5: Restore a backup
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
 
>**Note:** It is not yet possible to restore a backup by indicating its name.
>**Note:** It is not yet possible to restore a server group under a different name or on a different server group.
>**Note:** It is not yet possible to show the progress of a restore operation.

## Deleting backups
Backups retention cannot be set in Preview. 
Backups cannot be deleted in Preview. If you are blocked on reclaiming space on the storage you are using, reach out to us.


## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
