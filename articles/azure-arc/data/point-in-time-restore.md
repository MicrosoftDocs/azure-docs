---
title: Restore a database in Azure Arc-enabled SQL Managed Instance to a previous point in time
description: Explains how to restore a database to a specific point in time on Azure Arc-enabled SQL Managed Instance.
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 07/30/2021
ms.topic: how-to
---

#  Perform a Point in Time Restore

Use the point-in-time restore (PITR) to create a database as a copy of another database from some time in the past. This article describes how to do a point-in-time restore of a database in Azure Arc enabled SQL managed instance.

Point-in-time restore can restore a database from:

- An existing database
- To a new database on the same Azure Arc enabled SQL managed instance

You can restore a database to a point-in-time within a pre-configured retention settings.

Point-In-Time-Restore is an instance level setting with two properties - Recovery Point Objective (RPO) and Retention Time (RT). Recovery Point Objective setting determines how often the transaction log backups are taken. This is also the amount of time data loss is to be expected. Retention Time is how long the backups (full, differential and transaction log) are kept.  

Currently, Point-in-time restore can restore a database:

- from an existing database on a SQL instance
- to a new database on the same SQL instance

## Limitations

Point-in-time restore to Azure Arc enabled SQL Managed Instance has the following limitations:

- Point-in-time restore of a whole Azure Arc enabled SQL Managed Instance is not possible. This article explains only what's possible: point-in-time restore of a database that's hosted on Azure Arc enabled SQL Managed Instance.
- An Azure Arc-enabled SQL managed instance that is deployed with high availability (preview) does not currently support point-in-time restore.
- You can only restore to the same Azure Arc-enabled SQL managed instance
- Point-in-time restore can be performed only via a yaml file 
- Older backup files that are beyond the pre-configured retention period need to be manually cleaned up
- Renaming a database starts a new backup chain in a new folder
- Dropping and creating different databases with same names isn't handled properly at this time

## Description

Point-in-time restore restores a database to a specific point in time. The process to complete a point in time is to restore a specific set of backup files in order. For example:

1. Full backup
2. Differential backup 
3. One or more transaction log backups

:::image type="content" source="media/point-in-time-restore/point-in-time-restore.png" alt-text="Point in time restore":::

Azure Arc enabled SQL Managed Instance comes with built-in capability to do a point-in-time restore. Whenever a new database is created or restored on to an Azure Arc enabled SQL Managed Instance, backups are automatically taken. 

There are two parameters that affect the point-in-time restore capability:

- Recovery point objective
- Retention days

## Create a database from a point in time

The following are steps to restore a database to the same Azure Arc enabled SQL Managed Instance using the Azure CLI:

1. Create a task for the restore operation. To do this, create a .yaml file with the restore parameters.

   For example:

   ```json
   apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
      kind: SqlManagedInstanceRestoreTask
   metadata:
     name: sql01-restore-20210909
   namespace: arc
   spec:
     source:
       name: sql01
       database: db01
     restorePoint: "2021-09-09T02:00:00Z"
     destination:
       name: sql01
       database: db02
   ```

   Edit the above yaml file:

   - `metadata` > `name` - Name for the task custom resource (CR)
   - `metadata` > `namespace` - Namespace of the Azure Arc enabled SQL Managed Instance
   - `source` > `name` - Name of the Azure Arc enabled SQL Managed Instance
   - `source` > `database` - Name of the **source** database on the Azure Arc enabled SQL Managed Instance to restore from
   - `restorePoint` - Point-in-time to restore to, in "UTC" date time.
   - `destination` > `name` - Name of the Azure Arc enabled SQL Managed Instance
   - `destination` > `database` - Name of the **destination** database on the Azure Arc enabled SQL Managed Instance


   > [!NOTE] 
   > The name of the source and destination Azure Arc enabled SQL managed instance should be the same.

2. Create a task to initiate the point-in-time restore operation

   ```console
   kubectl apply -f sql-restore-task.yaml
   ```

3. Check the status of the restore

   Run the following command to check the status of the restore operation.

   ```console
   kubectl get sqlmirestoretask -n <namespace>
   ```

Once the status of the restore task shows **Completed**, the new database should be available. 

## Troubleshoot failed restore operations

If the restore task status shows **Failed**, run the following command to look for the root cause in the events.

```console
kubectl describe sqlmirestoretask <taskname> -n <namespace>
```

For example:
```console
kubectl describe sqlmirestoretask sql01-restore-20210909 -n arc
```

## Enable/disable automated backups

Point-in-time-restore (PITR) service is enabled by default with the following settings:

- Recovery Point Objective (RPO) = 300 seconds. Accepted values are 0, or between 300 to 600 (in seconds)

This sets the service to take log backups for all databases on the Azure Arc-enabled SQL managed instance every 300 seconds or 5 minutes by default. This value can be changed to 0, to disable backups being taken or to a higher value in seconds depending on the RPO requirement needed for the databases on the SQL instance. 

The PITR service itself cannot be disabled, but but you can disable the automated backups for a specific instance of Azure Arc-enabled SQL managed instance, or change the default settings.

You can edit the RPO by changing the value for the `recoveryPointObjectiveInSeconds` property  as follows:

```console
kubectl edit sqlmi <sqlinstancename>  -n <namespace> -o yaml
```

This should open up the Custom Resource spec for Azure Arc-enabled SQL managed instance in your default editor. Look for the `backup` setting under `spec`:

```json
backup:
  recoveryPointObjectiveInSeconds: 300
```

Edit the value for `recoveryPointObjectiveInSeconds` in the editor and save the changes for the new setting to take effect. 

> [!NOTE]
> Editing the RPO setting will reboot the pod containing the Azure Arc-enabled SQL managed instance. 

## Monitor backups

The backups are stored under `/var/opt/mssql/backups/archived/<dbname>/<datetime>` folder, where `<dbname>` is the name of the database and `<datetime>` would be a timestamp in UTC format, for the beginning of each full backup. Each time a full backup is initiated, a new folder would be created with the full back and all subsequent differential and transaction log backups inside that folder. The most current full backup and its subsequent differential and transaction log backups are stored under `/var/opt/mssql/backups/current/<dbname><datetime>` folder.

### Clean up 

If you need to delete older backups either to create space or no longer need them, any of the folders under `/var/opt/mssql/backups/archived/` folder can be removed. Removing folders in the middle of a timeline could impact the ability to restore to a point in time during that window. It is recommended to delete the oldest folders first, to allow for a continuous timeline of restorability. 

## Next steps

[Learn more about Features and Capabilities of Azure Arc enabled SQL Managed Instance](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller.md)

[Already created a Data Controller? Create an Azure Arc enabled SQL Managed Instance](create-sql-managed-instance.md)
