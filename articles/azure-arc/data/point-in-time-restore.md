---
title: Restore a database in SQL Managed Instance enabled by Azure Arc to a previous point-in-time
description: Explains how to restore a database to a specific point-in-time on SQL Managed Instance enabled by Azure Arc.
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.date: 06/17/2022
ms.topic: how-to
---

#  Perform a point-in-time Restore

Use the point-in-time restore (PITR) to create a database as a copy of another database from some time in the past that is within the retention period. This article describes how to do a point-in-time restore of a database in SQL Managed Instance enabled by Azure Arc.

Point-in-time restore can restore a database:

- From an existing database
- To a new database on the same SQL Managed Instance enabled by Azure Arc

You can restore a database to a point-in-time within a pre-configured retention setting.
You can check the retention setting for a SQL Managed Instance enabled by Azure Arc as follows:

For **Direct** connected mode:

```azurecli
az sql mi-arc show --name <SQL instance name> --resource-group <resource-group>
#Example
az sql mi-arc show --name sqlmi --resource-group myresourcegroup
```

For **Indirect** connected mode:

```azurecli
az sql mi-arc show --name <SQL instance name> --k8s-namespace <SQL MI namespace> --use-k8s
#Example
az sql mi-arc show --name sqlmi --k8s-namespace arc --use-k8s
```

Currently, point-in-time restore can restore a database:

- From an existing database on an instance
- To a new database on the same instance

## Automatic Backups

SQL Managed Instance enabled by Azure Arc has built-in automatic backups feature enabled. Whenever you create or restore a new database, SQL Managed Instance enabled by Azure Arc initiates a full backup immediately and schedules differential and transaction log backups automatically. SQL managed instance stores these backups in the storage class specified during the deployment. 

Point-in-time restore enables a database to be restored to a specific point-in-time, within the retention period. To restore a database to a specific point-in-time, Azure Arc-enabled data services applies the backup files in a specific order. For example:

1. Full backup
2. Differential backup 
3. One or more transaction log backups

:::image type="content" source="media/point-in-time-restore/point-in-time-restore.png" alt-text="Point-in-time restore":::

Currently, full backups are taken once a week, differential backups are taken every 12 hours and transaction log backups every 5 minutes.

## Retention Period

The default retention period for a new SQL Managed Instance enabled by Azure Arc is seven days, and can be adjusted with values of 0, or 1-35 days. The retention period can be set during deployment of  the SQL managed instance by specifying the `--retention-days` property. Backup files older than the configured retention period are automatically deleted.


## Create a database from a point-in-time using az CLI

```azurecli
az sql midb-arc restore --managed-instance <SQL managed instance> --name <source DB name> --dest-name <Name for new db> --k8s-namespace <namespace of managed instance> --time "YYYY-MM-DDTHH:MM:SSZ" --use-k8s
#Example
az sql midb-arc restore --managed-instance sqlmi1 --name Testdb1 --dest-name mynewdb --k8s-namespace arc --time "2021-10-29T01:42:14.00Z" --use-k8s
```

You can also use the `--dry-run` option to validate your restore operation without actually restoring the database. 

```azurecli
az sql midb-arc restore --managed-instance <SQL managed instance> --name <source DB name> --dest-name <Name for new db> --k8s-namespace <namespace of managed instance> --time "YYYY-MM-DDTHH:MM:SSZ" --use-k8s --dry-run
#Example
az sql midb-arc restore --managed-instance sqlmi1 --name Testdb1 --dest-name mynewdb --k8s-namespace arc --time "2021-10-29T01:42:14.00Z" --use-k8s --dry-run
```

## Create a database from a point-in-time using kubectl

1. To perform a point-in-time restore with Kubernetes native tools, you can use `kubectl`. Create a task spec yaml file. For example:

   ```yaml
   apiVersion: tasks.sql.arcdata.microsoft.com/v1
   kind: SqlManagedInstanceRestoreTask                 
   metadata:                                       
     name: myrestoretask20220304
     namespace: test                              
   spec:                                           
     source:                                       
       name: miarc1                                
       database: testdb                            
     restorePoint: "2021-10-12T18:35:33Z"          
     destination:                                  
       name: miarc1                           
       database: testdb-pitr
     dryRun: false  
   ```

1.  Edit the properties as follows:

    1. `name:` Unique string for each custom resource (CR). Required by Kubernetes.
    1. `namespace:` Kubernetes namespace where instance is.
    1. `source: ... name:` Name of the source instance.
    1. `source: ... database:` Name of source database where the restore would be applied from.
    1. `restorePoint:` Point-in-time for the restore operation in UTC datetime.
    1. `destination: ... name:` Name of the destination Arc-enabled SQL managed instance. Currently, point-in-time restore is only supported within the Arc SQL managed instance. This should be same as the source SQL managed instance.
    1. `destination: ... database:` Name of the new database where the restore would be applied to. 

1. Create a task to start the point-in-time restore. The following example initiates the task defined in `myrestoretask20220304.yaml`.


   ```console
   kubectl apply -f myrestoretask20220304.yaml
   ```  

1. Check restore task status as follows:

   ```console
   kubectl get sqlmirestoretask -n <namespace>
   ``` 

Restore task status will be updated about every 10 seconds based on the PITR progress. The status progresses from `Waiting` to `Restoring` to `Completed` or `Failed`.

## Create a database from a point-in-time using Azure Data Studio

You can also restore a database to a point-in-time from Azure Data Studio as follows:
1. Launch Azure Data studio
2. Ensure you have the required Arc extensions as described in [Tools](install-client-tools.md).
3. Connect to the Azure Arc data controller
4. Expand the data controller node,  right-click on the instance and select **Manage**. Azure Data Studio launches the SQL managed instance dashboard.
5. Click on the **Backups** tab in the dashboard
6. You should see a list of databases on the SQL managed instance and their Earliest and Latest restore time windows, and an icon to initiate the **Restore**
7. Click on the icon for the database you want to restore from. Azure Data Studio launches a blade towards the right side
8. Provide the required input in the blade and click on **Restore**

### Monitor progress

When a restore is initiated, a task is created in the Kubernetes cluster that executes the actual restore operations of full, differential, and log backups. The progress of this activity can be monitored from your Kubernetes cluster as follows:

```console
kubectl get sqlmirestoretask -n <namespace>
#Example
kubectl get sqlmirestoretask -n arc
```

You can get more details of the task by running `kubectl describe` on the task. For example:

```console
kubectl describe sqlmirestoretask <nameoftask> -n <namespace>
```

## Configure Retention period

The Retention period for a SQL Managed Instance enabled by Azure Arc can be reconfigured from their original setting as follows:

> [!WARNING] 
> If you reduce the current retention period, you lose the ability to restore to points in time older than the new retention period. Backups that are no longer needed to provide PITR within the new retention period are deleted. If you increase the current retention period, you do not immediately gain the ability to restore to older points in time within the new retention period. You gain that ability over time, as the system starts to retain backups for longer.



The `--retention-period` can be changed for a SQL Managed Instance-Azure Arc as follows. The below command applies to both `direct` and `indirect` connected modes. 


```azurecli
az sql mi-arc update  --name <SQLMI name> --k8s-namespace <namespace>  --use-k8s --retention-days <retentiondays>
```

For example:

```azurecli
az sql mi-arc update  --name sqlmi --k8s-namespace arc  --use-k8s --retention-days 10
```

## Disable Automatic backups

You can disable the built-in automated backups for a specific instance of SQL Managed Instance enabled by Azure Arc by setting the `--retention-days` property to 0, as follows. The below command applies to both ```direct``` and ```indirect``` modes. 

> [!WARNING]
> If you disable Automatic Backups for a SQL Managed Instance enabled by Azure Arc, then any Automatic Backups configured will be deleted and  you lose the ability to do a point-in-time restore. You can change the `retention-days` property to re-initiate automatic backups if needed.


```azurecli
az sql mi-arc update  --name <SQLMI name> --k8s-namespace <namespace>  --use-k8s --retention-days 0
```

For example:
```azurecli
az sql mi-arc update  --name sqlmi --k8s-namespace arc  --use-k8s --retention-days 0
```

## Monitor backups

The backups are stored under `/var/opt/mssql/backups/archived/<dbname>/<datetime>` folder, where `<dbname>` is the name of the database and `<datetime>` would be a timestamp in UTC format, for the beginning of each full backup. Each time a full backup is initiated, a new folder would be created with the full back and all subsequent differential and transaction log backups inside that folder. The most current full backup and its subsequent differential and transaction log backups are stored under `/var/opt/mssql/backups/current/<dbname><datetime>` folder.

## Limitations

Point-in-time restore to SQL Managed Instance enabled by Azure Arc has the following limitations:

- Point-in-time restore is database level feature, not an instance level feature. You cannot restore the entire instance with Point-in-time restore.
- You can only restore to the same SQL Managed Instance enabled by Azure Arc from where the backup was taken.

## Related content

[Learn more about Features and Capabilities of SQL Managed Instance enabled by Azure Arc](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller-indirect-cli.md)

[Create a SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md)
