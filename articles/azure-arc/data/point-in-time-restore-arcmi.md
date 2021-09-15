---
title: Restore a database in Azure Arc enabled SQL Managed Instance to a previous point in time
description: Restore a database in Azure Arc enabled SQL Managed Instance to a previous point in time
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 09/10/2021
ms.topic: how-to
---


# Restore a database in Azure Arc enabled SQL Managed Instance to a previous point in time 

Use the point-in-time restore (PITR) to create a database as a copy of another database from some time in the past. This article describes how to do a point-in-time restore of a database in Azure Arc enabled SQL Managed Instance.

Point-in-time restore can restore a database from:
- An existing database
- To a new database on the same Azure Arc enabled SQL managed instance


## Limitations

Point-in-time restore to Azure Arc enabled SQL Managed Instance has the following limitations:
- Point-in-time restore of a whole Azure Arc enabled SQL Managed Instance is not possible. This article explains only what's possible: point-in-time restore of a database that's hosted on Azure Arc enabled SQL Managed Instance.
- Currently Point-in-time restore capability does not with with Azure Arc enabled SQL managed instance that has High Availability enabled. 

## Point-in-time restore

Point-in-time restore is the ability to restore the database to a specific point in time. This is made possible by restoring a specific set of backup files such as:

1. Full backup
2. Differential backup and 
3. one or more transaction log backups


:::image type="content" source="media/point-in-time-restore/point-in-time-restore.png" alt-text="Point in time restore":::


Azure Arc enabled SQL managed instance comes with built-in capability to do a point-in-time restore. Whenever a new database is created or restored on to an Azue Arc enabled SQL managed instance, backups are automatically taken. 

There are two parameters that affect the point-in-time rstore capability - (1) recovery point objective and (2) retention days.

## Create a database from a point in time

Following are the steps to restore a database to the same Azure Arc enabled SQL managed instance using Azure CLI:

(1) Create a task for the restore operation. This is done by creating a .yaml file with the restore parameters.
Create a yaml file as follows:

```code
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
Instructions to edit the above yaml file:

- metadata > name - Name for the task custom resource (CR)
- metadata > namespace - Namespace of the Azure Arc enabled SQL managed instance
- source > name - Name of the Azure Arc enabled SQL managed instance
- source > database - Name of the **source** database on the Azure Arc enabled SQL managed instance to restore from
- restorePoint - Point-in-time fto restore to, in "UTC" date time.
- destination > name - Name of the Azure Arc enabled SQL Managed Instance
- destination > database - Name of the **destination** database on the Azure Arc enabled SQL Managed Instance


> [!NOTE] 
> The name of the source and destination Azure Arc enabled SQL managed instance should be the same.

(2) Create a task to initiate the point-in-time restore operation

```code
kubectl apply -f sql-restore-task.yaml
```

(3) Check the status of the restore

Run the below command to check the status of the restore operation.
```code
kubectl get sqlmirestoretask -n <namespace>
```

Once the status of the restore task shows **Completed**, the new database should be available. 

## Troubleshooting failed restore operations

If the restore task status shows **Failed**, run the below command to look for the root cause in the events.
```code
kubectl desctibe sqlmirestoretask <taskname> -n <namespace>
```

For example:
```code
kubectl describe sqlmirestoretask sql01-restore-20210909 -n arc
```


## Next steps

[Learn more about Features and Capabilities of Azure Arc enabled SQL Managed Instance](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller.md)

[Already created a Data Controller? Create an Azure Arc enabled SQL Managed Instance](create-sql-managed-instance.md)




