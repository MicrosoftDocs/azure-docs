---
title: Restore a database to a Point in Time
description: Explains how to perform a Point in Time Restore operation
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


Azure Arc-enabled SQL Managed Instance comes built in with many PaaS like capabilities. One such capability is the ability to restore a database to a point-in-time, within the pre-configured retention settings. This article describes how to do a point-in-time restore of a database in Azure Arc-enabled SQL managed instance.

Point-In-Time-Restore is an instance level setting with two properties - Recovery Point Objective (RPO) and Retention Time (RT). Recovery Point Objective setting determines how often the transaction log backups are taken. This is also the amount of time data loss is to be expected. Retention Time is how long the backups (full, differential and transaction log) are kept.  

Currently, Point-in-time restore can restore a database:

- from an existing database on a SQL instance
- to a new database on the same SQL instance

### Limitations

Point-in-time restore to Azure Arc-enabled SQL Managed Instance has the following limitations:

- You can only restore to the same Azure Arc-enabled SQL managed instance
- Point-in-time restore can be performed only via a yaml file 
- Older backup files that are beyond the pre-configured retention period need to be manually cleaned up
- Renaming a databases starts a new backup chain in a new folder
- Dropping and creating different databases with same names isn't handled properly at this time

### Edit PITR settings

##### Enable/disable automated backups

Point-In-Time-Restore (PITR) service is enabled by default with the following settings:

- Recovery Point Objective (RPO) = 300 seconds. Accepted values are 0, or between 300 to 600 (in seconds)

This implies that log backups for all databases on the Azure Arc-enabled SQL managed instance will be taken every 300 seconds or 5 minutes by default. This value can be changed to 0, to disable backups being taken or to a higher value in seconds depending on the RPO requirement needed for the databases on the SQL instance. 

The PITR service itself cannot be disabled but the automated backups for a specific instance of Azure Arc-enabled SQL managed instance can either be disabled, or the default settings changed.

The RPO can be edited by changing the value for the property ```recoveryPointObjectiveInSeconds``` as follows:

```
kubectl edit sqlmi <sqlinstancename>  -n <namespace> -o yaml
```

This should open up the Custom Resource spec for Azure Arc-enabled SQL managed instance in your default editor. Look for ```backup``` setting under ```spec```:

```
backup:
  recoveryPointObjectiveInSeconds: 300
```

Edit the value for ```recoveryPointObjectiveInSeconds``` in the editor and save the changes for the new setting to take effect. 

> [!NOTE]
> Editing the RPO setting will reboot the pod containing the Azure Arc-enabled SQL managed instance. 

### Restore a database to a Point-In-Time

A restore operation can be performed on an Azure Arc-enabled SQL managed instance to restore from a source database to a point-in-time within the retention period. 
**(1) Create yaml file as below in your editor:**

```
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceRestoreTask
metadata:
  name: sql01-restore-20210707
  namespace: arc
spec:
  source:
    name: sql01
    database: db01
  restorePoint: "2021-07-01T02:00:00Z"
  destination:
    name: sql01
    database: db02
```

- name - Unique string for each custom resource which is a requirement for kubernetes
- namespace - namespace where the Azure Arc-enabled SQL managed instance is running
- source > name - name of the Azure Arc-enabled SQL managed instance
- source > database - name of the source database on the Azure Arc-enabled SQL managed instance
- restorePoint - Point-in-time for the restore operation in "UTC" date time.
- destination > name - name of the target Azure Arc-enabled SQL managed instance to restore to. Currently only restores to the same instances are supported.
- destination > database - name of the new database where the restore would be applied to

**(2) Apply the yaml file to create a task to initiate the restore operation**

Run the command as follows to initiate the restore operation:

```
kubectl apply -f sql01-restore-task.yaml
```

> [!NOTE]
> The name of the task inside the custom resource and the file name don't have to be same.


**Check the status of restore**

- Restore task status gets updated about every 10 seconds and the status changes from "Waiting" --> "Restoring" --> "Completed"/"Failed". 
- While a database is being restored, the status would reflect "Restoring".

The status of the task can be retrieved as follows:

```
kubectl get sqlmirestoretask -n arc
``` 

### Monitor your backups

The backups are stored under ```/var/opt/mssql/backups/archived/<dbname>/<datetime>``` folder, where ```<dbname>``` is the name of the database and ```<datetime>``` would be a timestamp in UTC format, for the beginning of each full backup. Each time a full backup is initiated, a new folder would be created with the full back and all subsequent differential and transaction log backups inside that folder. The most current full backup and its subsequent differential and transaction log backups are stored under ```/var/opt/mssql/backups/current/<dbname><datetime>``` folder.


### Clean up 

If you need to delete older backups either to create space or no longer need them, any of the folders under ```/var/opt/mssql/backups/archived/``` folder can be removed. Removing folders in the middle of a timeline could impact the ability to restore to a point in time during that window. It is recommended to delete the oldest folders first allowing for a continuous timeline of restorability. 


