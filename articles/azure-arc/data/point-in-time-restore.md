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

#  Perform a point in time Restore

Use the point-in-time restore (PITR) to create a database as a copy of another database from some time in the past that is within the retention period. This article describes how to do a point-in-time restore of a database in Azure Arc enabled SQL managed instance.

Point-in-time restore can restore a database:

- From an existing database
- To a new database on the same Azure Arc enabled SQL managed instance

You can restore a database to a point-in-time within a pre-configured retention setting.
You can check the retention setting for an Azure Arc enabled SQL managed instance as follows:

For **Direct** connected mode:
```
az sql mi-arc show --name <SQL instance name> --resource-group <resource-group>
#Example
az sql mi-arc show --name sqlmi --resource-group myresourcegroup
```
For **Indirect** connected mode:
```
az sql mi-arc show --name <SQL instance name> --k8s-namespace <SQL MI namespace> --use-k8s
#Example
az sql mi-arc show --name sqlmi --k8s-namespace arc --use-k8s
```

Currently, point-in-time restore can restore a database:

- From an existing database on an instance
- To a new database on the same instance

## Automatic Backups

Azure Arc enabled SQL managed instance has built-in automatic backups feature enabled by default. Whenever a new database is created or restored on to an Azure Arc enabled SQL managed instance the a full backup is immediately initiated and then differential and transaction log backups are automatically scheduled. These backups are stored in the storage class specified during the deployment of the Azure Arc enabled SQL managed instance. 

Point-in-time restore enables a database to be restored to a specific point in time, within the retention period. To restore a database to a specific point in time, Azure Arc-enabled data services applies the backup files in a specific order. For example:

1. Full backup
2. Differential backup 
3. One or more transaction log backups

:::image type="content" source="media/point-in-time-restore/point-in-time-restore.png" alt-text="Point in time restore":::

Currently, full backups are taken once a week, differential backups are taken every 12 hours and transaction log backups every 5 minutes.

## Retention Period

The default retention period for a new Azure Arc enabled SQL managed instance is 7 days, and can be adjusted with values of 0, or 1-35 days. The retention period can be set during deployment of  the SQL managed instance by specifying the ```--retention-days``` property. Backup files older than the configured retention period are automatically deleted.


## Create a database from a point in time using az

```
az sql midb-arc restore --managed-instance <SQL managed instance> --name <source DB name> --dest-name <Name for new db> --k8s-namespace <namespace of managed instance> --time "YYYY-MM-DDTHH:MM:SSZ" --use-k8s
#Example
az sql midb-arc restore --managed-instance sqlmi1 --name Testdb1 --dest-name mynewdb --k8s-namespace arc --time "2021-10-29T01:42:14.0000000Z" --use-k8s
```

You can also use the ```--dry-run``` option to validate your restore operation without actually restoring the database. 
```
az sql midb-arc restore --managed-instance <SQL managed instance> --name <source DB name> --dest-name <Name for new db> --k8s-namespace <namespace of managed instance> --time "YYYY-MM-DDTHH:MM:SSZ" --use-k8s --dry-run
#Example
az sql midb-arc restore --managed-instance sqlmi1 --name Testdb1 --dest-name mynewdb --k8s-namespace arc --time "2021-10-29T01:42:14.0000000Z" --use-k8s --dry-run
```


## Create a database from a point in time using Azure Data Studio

You can also restore a database to a point in time from Azure Data Studio as follows:
1. Launch Azure Data studio
2. Ensure you have the required Arc extensions as described in [Tools](install-client-tools.md).
3. Connect to the Azure Arc data controller
4. Expand the data controller node and right click on the Azure Arc enabled SQL managed instance and select "Manage". This should launch the SQL managed instance dashboard.
5. Click on the **Backups** tab in the dashboard
6. You should see a list of databases on the SQL maanged instance and their Earliest and Latest restore time windows, and an icon to initiate the **Restore**
7. Click on the icon for the database you want to restore from. This should launch a blade towards the right side of ADS
8. Provide the required input in the blade and click on **Restore**


### Monitor progress

When a restore is initiated, a task is created in the kubernetes cluster that executes the actual restore operations of full, differential and log backups. The progress of this activity can be monitored from your kubernetes cluster as follows:

```
kubectl get sqlmirestoretask -n <namespace>
#Example
kubectl get sqlmirestoretask -n arc
```

You can get additional details of the task by running a describe on the task, as follows:

```
kubectl describe sqlmirestoretask <nameoftask> -n <namespace>
```

## Configure Retention period

The Retention period for an Azure Arc enabled SQL managed instance can be reconfigured from their original setting as follows:

[!WARNING] If you reduce the current retention period, you lose the ability to restore to points in time older than the new retention period. Backups that are no longer needed to provide PITR within the new retention period are deleted. If you increase the current retention period, you do not immediately gain the ability to restore to older points in time within the new retention period. You gain that ability over time, as the system starts to retain backups for longer.

### Change Retention period for **Direct** connected SQL managed instance

```
az sql mi-arc edit  --name <SQLMI name> --custom-location dn-octbb-cl --resource-group dn-testdc --location eastus --retention-days 10
#Example
az sql mi-arc edit  --name sqlmi --custom-location dn-octbb-cl --resource-group dn-testdc --location eastus --retention-days 10
```

### Change Retention period for **Indirect** connected SQL managed instance

```
az sql mi-arc edit  --name <SQLMI name> --k8s-namespace <namespace>  --use-k8s --retention-days <retentiondays>
#Example
az sql mi-arc edit  --name sqlmi --k8s-namespace arc  --use-k8s --retention-days 10
```

## Disable Automatic backups

You can disable the automated backups for a specific instance of Azure Arc-enabled SQL managed instance by setting the ```--retention-days``` property to 0, as follows.

[!WARNING] If you disable Automatic Backups for an Azure Arc enabled SQL managed instance, then any Automatic Backups configured will be deleted and  you lose the ability to do a point in time restore. You can change the ```retention-days``` property to re-initiate automatic backups if needed.

### Disable Automatic backups for **Direct** connected SQL managed instance

```
az sql mi-arc edit  --name <SQLMI name> --custom-location dn-octbb-cl --resource-group dn-testdc --location eastus --retention-days 0
#Example
az sql mi-arc edit  --name sqlmi --custom-location dn-octbb-cl --resource-group dn-testdc --location eastus --retention-days 0
```

### Disable Automatic backups for **Indirect** connected SQL managed instance

```
az sql mi-arc edit  --name <SQLMI name> --k8s-namespace <namespace>  --use-k8s --retention-days 0
#Example
az sql mi-arc edit  --name sqlmi --k8s-namespace arc  --use-k8s --retention-days 0
```

## Monitor backups

The backups are stored under `/var/opt/mssql/backups/archived/<dbname>/<datetime>` folder, where `<dbname>` is the name of the database and `<datetime>` would be a timestamp in UTC format, for the beginning of each full backup. Each time a full backup is initiated, a new folder would be created with the full back and all subsequent differential and transaction log backups inside that folder. The most current full backup and its subsequent differential and transaction log backups are stored under `/var/opt/mssql/backups/current/<dbname><datetime>` folder.

## Limitations

Point-in-time restore to Azure Arc enabled SQL Managed Instance has the following limitations:

- Point-in-time restore of a whole Azure Arc enabled SQL Managed Instance is not possible. 
- An Azure Arc-enabled SQL managed instance that is deployed with high availability (preview) does not currently support point-in-time restore.
- You can only restore to the same Azure Arc-enabled SQL managed instance.
- Dropping and creating different databases with same names isn't handled properly at this time.

### Clean up 

If you need to delete older backups either to create space or no longer need them, any of the folders under `/var/opt/mssql/backups/archived/` folder can be removed. Removing folders in the middle of a timeline could impact the ability to restore to a point in time during that window. Delete the oldest folders first, to allow for a continuous timeline of restorability. 

## Next steps

[Learn more about Features and Capabilities of Azure Arc enabled SQL Managed Instance](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller.md)

[Already created a Data Controller? Create an Azure Arc enabled SQL Managed Instance](create-sql-managed-instance.md)
